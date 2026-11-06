import { randomInt } from "node:crypto";
import { eq } from "drizzle-orm";
import {
  db, raceResultsTable, raceTextsTable, racesTable, roomsTable, usersTable,
} from "@workspace/db";
import {
  ALFABETO_SALA, CONTAGEM_SEGUNDOS, SALA_MAX, SALA_MIN, WPM_MAXIMO_CORRIDA,
  calcularPrecisao, calcularWpm, indiceMaximoPlausivel, pontosCorrida, toquesDoTexto,
  type EstadoSala, type JogadorSala, type ProgressoCorrida, type RespostaCriar, type RespostaSimples,
  type StatusSala,
} from "@workspace/typing-core";
import { levelFor } from "../levels";
import { proximaSequencia } from "../sequencia";
import { conferirMedalhas } from "../medalhas";
import { logger } from "../logger";

interface JogadorInterno extends JogadorSala {
  erros: number;
  sockets: Set<string>;
  saidaTimer: NodeJS.Timeout | null;
}

interface Sala {
  codigo: string;
  nome: string;
  dbRoomId: number | null;
  status: StatusSala;
  jogadores: Map<number, JogadorInterno>;
  texto: string | null;
  toquesTotais: number;
  raceId: number | null;
  inicioEm: number | null;
  rodada: number;
  vaziaDesde: number | null;
  timers: NodeJS.Timeout[];
  broadcastPendente: NodeJS.Timeout | null;
}

export interface Usuario { id: number; apelido: string; avatar: string }

const SALAS = new Map<string, Sala>();
const SALA_DO_JOGADOR = new Map<number, string>();
const CRIACOES = new Map<number, number[]>();
const TEMPO_MAX_CORRIDA_MS = 5 * 60 * 1000;
const FIM_APOS_PRIMEIRO_MS = 60 * 1000;
const SALA_VAZIA_MS = 2 * 60 * 1000;
const CARENCIA_SAIDA_MS = 10 * 1000;

let textos: { id: number; text: string }[] = [];
let emitir: (codigo: string, estado: EstadoSala) => void = () => {};

export function configurarEmissor(fn: (codigo: string, estado: EstadoSala) => void): void {
  emitir = fn;
}

export async function carregarTextos(): Promise<void> {
  const rows = await db.select({ id: raceTextsTable.id, text: raceTextsTable.text }).from(raceTextsTable);
  textos = rows;
}

function novoCodigo(): string {
  for (;;) {
    let c = "";
    for (let i = 0; i < 5; i++) c += ALFABETO_SALA[randomInt(ALFABETO_SALA.length)];
    if (!SALAS.has(c)) return c;
  }
}

function snapshot(s: Sala): EstadoSala {
  const mostrarTexto = s.status !== "lobby";
  return {
    codigo: s.codigo,
    nome: s.nome,
    status: s.status,
    jogadores: [...s.jogadores.values()].map((j) => ({
      id: j.id, apelido: j.apelido, avatar: j.avatar, pronto: j.pronto, anfitriao: j.anfitriao,
      conectado: j.conectado, indice: j.indice, wpm: j.wpm, precisao: j.precisao, terminou: j.terminou,
      posicao: j.posicao, pontos: j.pontos, invalido: j.invalido,
    })),
    texto: mostrarTexto ? s.texto : null,
    inicioEm: s.inicioEm,
    agora: Date.now(),
    rodada: s.rodada,
  };
}

function transmitir(s: Sala, imediato = true): void {
  if (imediato) {
    if (s.broadcastPendente) { clearTimeout(s.broadcastPendente); s.broadcastPendente = null; }
    emitir(s.codigo, snapshot(s));
    return;
  }
  if (s.broadcastPendente) return;
  s.broadcastPendente = setTimeout(() => {
    s.broadcastPendente = null;
    emitir(s.codigo, snapshot(s));
  }, 100);
}

function jogadorNovo(u: Usuario, anfitriao: boolean): JogadorInterno {
  return {
    id: u.id, apelido: u.apelido, avatar: u.avatar, pronto: anfitriao, anfitriao, conectado: true,
    indice: 0, wpm: 0, precisao: 100, terminou: false, posicao: null, pontos: 0, invalido: false,
    erros: 0, sockets: new Set(), saidaTimer: null,
  };
}

function limparTimers(s: Sala): void {
  for (const t of s.timers) clearTimeout(t);
  s.timers = [];
}

function fecharSala(s: Sala): void {
  limparTimers(s);
  if (s.broadcastPendente) clearTimeout(s.broadcastPendente);
  for (const j of s.jogadores.values()) {
    if (j.saidaTimer) clearTimeout(j.saidaTimer);
    if (SALA_DO_JOGADOR.get(j.id) === s.codigo) SALA_DO_JOGADOR.delete(j.id);
  }
  SALAS.delete(s.codigo);
  if (s.dbRoomId) {
    db.update(roomsTable).set({ status: "fechada" }).where(eq(roomsTable.id, s.dbRoomId))
      .catch((err) => logger.error({ err }, "Falha ao fechar sala no banco"));
  }
}

function promoverAnfitriao(s: Sala): void {
  const atual = [...s.jogadores.values()].find((j) => j.anfitriao);
  if (atual && atual.conectado) return;
  const proximo = [...s.jogadores.values()].find((j) => j.conectado);
  for (const j of s.jogadores.values()) j.anfitriao = false;
  if (proximo) { proximo.anfitriao = true; proximo.pronto = true; }
}

function removerJogador(s: Sala, id: number): void {
  const j = s.jogadores.get(id);
  if (!j) return;
  if (j.saidaTimer) clearTimeout(j.saidaTimer);
  s.jogadores.delete(id);
  if (SALA_DO_JOGADOR.get(id) === s.codigo) SALA_DO_JOGADOR.delete(id);
  promoverAnfitriao(s);
  if (s.jogadores.size === 0) { fecharSala(s); return; }
  verificarFim(s);
  transmitir(s);
}

export async function criarSala(u: Usuario, nomeBruto: string, socketId: string): Promise<RespostaCriar> {
  const nome = nomeBruto.trim().replace(/\s+/g, " ");
  if (nome.length < 2 || nome.length > 24) return { ok: false, erro: "O nome da sala precisa ter de 2 a 24 letras." };
  const agora = Date.now();
  const recentes = (CRIACOES.get(u.id) ?? []).filter((t) => agora - t < 10 * 60 * 1000);
  if (recentes.length >= 5) return { ok: false, erro: "Você criou muitas salas agora há pouco. Tente de novo daqui a pouco." };
  recentes.push(agora);
  CRIACOES.set(u.id, recentes);

  sairDaSalaAtual(u.id);
  const codigo = novoCodigo();
  const sala: Sala = {
    codigo, nome, dbRoomId: null, status: "lobby", jogadores: new Map(), texto: null, toquesTotais: 0,
    raceId: null, inicioEm: null, rodada: 0, vaziaDesde: null, timers: [], broadcastPendente: null,
  };
  const anfitriao = jogadorNovo(u, true);
  anfitriao.sockets.add(socketId);
  sala.jogadores.set(u.id, anfitriao);
  SALAS.set(codigo, sala);
  SALA_DO_JOGADOR.set(u.id, codigo);
  try {
    const [row] = await db.insert(roomsTable).values({ code: codigo, name: nome, hostUserId: u.id }).returning();
    sala.dbRoomId = row!.id;
  } catch (err) {
    logger.error({ err }, "Falha ao gravar sala");
  }
  transmitir(sala);
  return { ok: true, codigo };
}

export function entrarNaSala(u: Usuario, codigoBruto: string, socketId: string): RespostaSimples & { codigo?: string } {
  const codigo = codigoBruto.trim().toUpperCase();
  const s = SALAS.get(codigo);
  if (!s) return { ok: false, erro: "Não achamos essa sala. Confira o código." };
  const existente = s.jogadores.get(u.id);
  if (existente) {
    if (existente.saidaTimer) { clearTimeout(existente.saidaTimer); existente.saidaTimer = null; }
    existente.sockets.add(socketId);
    existente.conectado = true;
    existente.apelido = u.apelido;
    existente.avatar = u.avatar;
    s.vaziaDesde = null;
    promoverAnfitriao(s);
    transmitir(s);
    return { ok: true, codigo };
  }
  if (s.status !== "lobby") return { ok: false, erro: "Essa corrida já começou. Espere ela terminar para entrar." };
  if (s.jogadores.size >= SALA_MAX) return { ok: false, erro: "Essa sala está cheia (máximo de 8 jogadores)." };
  sairDaSalaAtual(u.id);
  const j = jogadorNovo(u, false);
  j.sockets.add(socketId);
  s.jogadores.set(u.id, j);
  SALA_DO_JOGADOR.set(u.id, codigo);
  s.vaziaDesde = null;
  promoverAnfitriao(s);
  transmitir(s);
  return { ok: true, codigo };
}

export function sairDaSalaAtual(userId: number): void {
  const codigo = SALA_DO_JOGADOR.get(userId);
  const s = codigo ? SALAS.get(codigo) : undefined;
  if (s) removerJogador(s, userId);
  SALA_DO_JOGADOR.delete(userId);
}

export function salaDoJogador(userId: number): Sala | undefined {
  const c = SALA_DO_JOGADOR.get(userId);
  return c ? SALAS.get(c) : undefined;
}

export function definirPronto(userId: number, pronto: boolean): RespostaSimples {
  const s = salaDoJogador(userId);
  const j = s?.jogadores.get(userId);
  if (!s || !j) return { ok: false, erro: "Você não está em uma sala." };
  if (s.status !== "lobby") return { ok: false, erro: "A corrida já começou." };
  if (!j.anfitriao) j.pronto = pronto;
  transmitir(s);
  return { ok: true };
}

export function iniciarCorrida(userId: number): RespostaSimples {
  const s = salaDoJogador(userId);
  const j = s?.jogadores.get(userId);
  if (!s || !j) return { ok: false, erro: "Você não está em uma sala." };
  if (!j.anfitriao) return { ok: false, erro: "Só quem criou a sala pode iniciar." };
  if (s.status !== "lobby") return { ok: false, erro: "A corrida já começou." };
  const presentes = [...s.jogadores.values()].filter((p) => p.conectado);
  if (presentes.length < SALA_MIN) return { ok: false, erro: "Chame pelo menos mais um amigo para correr." };
  if (presentes.some((p) => !p.anfitriao && !p.pronto)) return { ok: false, erro: "Espere todo mundo ficar pronto." };
  if (textos.length === 0) return { ok: false, erro: "Os textos da corrida ainda não estão prontos." };

  const t = textos[randomInt(textos.length)]!;
  s.texto = t.text;
  s.toquesTotais = toquesDoTexto(t.text).length;
  s.status = "contagem";
  s.inicioEm = Date.now() + CONTAGEM_SEGUNDOS * 1000;
  for (const p of s.jogadores.values()) {
    if (!p.conectado) { p.terminou = false; }
    p.indice = 0; p.erros = 0; p.wpm = 0; p.precisao = 100; p.terminou = false; p.posicao = null; p.pontos = 0; p.invalido = false;
  }
  db.insert(racesTable)
    .values({ roomId: s.dbRoomId ?? 0, raceTextId: t.id, startedAt: new Date(s.inicioEm) })
    .returning()
    .then(([r]) => { s.raceId = r?.id ?? null; })
    .catch((err) => logger.error({ err }, "Falha ao gravar corrida"));
  s.timers.push(setTimeout(() => {
    s.status = "corrida";
    transmitir(s);
  }, CONTAGEM_SEGUNDOS * 1000));
  s.timers.push(setTimeout(() => encerrar(s), CONTAGEM_SEGUNDOS * 1000 + TEMPO_MAX_CORRIDA_MS));
  transmitir(s);
  return { ok: true };
}

export function registrarProgresso(userId: number, p: ProgressoCorrida): void {
  const s = salaDoJogador(userId);
  const j = s?.jogadores.get(userId);
  if (!s || !j || s.status !== "corrida" || !s.texto || s.inicioEm === null || j.terminou) return;
  if (!Number.isInteger(p.indice) || !Number.isInteger(p.erros) || p.indice < 0 || p.erros < 0) return;
  const total = [...s.texto].length;
  const agora = Date.now();
  const decorrido = agora - s.inicioEm;
  if (decorrido < 0) return;
  if (p.indice < j.indice || p.erros < j.erros) return;
  if (p.indice > total || p.indice > indiceMaximoPlausivel(decorrido, total)) return;
  j.indice = p.indice;
  j.erros = Math.min(p.erros, total * 10);
  if (decorrido > 0) j.wpm = calcularWpm(j.indice, decorrido);
  j.precisao = calcularPrecisao(Math.min(j.indice, s.toquesTotais), j.erros);

  if (j.indice >= total) {
    j.terminou = true;
    j.wpm = calcularWpm(total, decorrido);
    j.precisao = calcularPrecisao(s.toquesTotais, j.erros);
    if (j.wpm > WPM_MAXIMO_CORRIDA) {
      j.invalido = true;
    } else {
      const validos = [...s.jogadores.values()].filter((x) => x.terminou && !x.invalido && x.posicao !== null).length;
      j.posicao = validos + 1;
      j.pontos = pontosCorrida(j.posicao, j.precisao);
    }
    const primeiro = [...s.jogadores.values()].filter((x) => x.terminou).length === 1;
    if (primeiro) s.timers.push(setTimeout(() => encerrar(s), FIM_APOS_PRIMEIRO_MS));
    transmitir(s);
    verificarFim(s);
    return;
  }
  transmitir(s, false);
}

function verificarFim(s: Sala): void {
  if (s.status !== "corrida") return;
  const emJogo = [...s.jogadores.values()].filter((j) => j.conectado && !j.terminou);
  if (emJogo.length === 0) encerrar(s);
}

function encerrar(s: Sala): void {
  if (s.status === "fim" || s.status === "lobby") return;
  limparTimers(s);
  s.status = "fim";
  let proxima = [...s.jogadores.values()].filter((j) => j.posicao !== null).length + 1;
  const participantes = [...s.jogadores.values()];
  const linhas: { userId: number; position: number; wpm: number; accuracy: number; points: number }[] = [];
  for (const j of participantes.filter((x) => x.posicao !== null).sort((a, b) => a.posicao! - b.posicao!)) {
    linhas.push({ userId: j.id, position: j.posicao!, wpm: j.wpm, accuracy: j.precisao, points: j.pontos });
  }
  for (const j of participantes.filter((x) => x.posicao === null)) {
    linhas.push({ userId: j.id, position: proxima++, wpm: j.invalido ? 0 : j.wpm, accuracy: j.precisao, points: 0 });
  }
  transmitir(s);
  void gravarResultados(s, linhas);
}

async function gravarResultados(
  s: Sala,
  linhas: { userId: number; position: number; wpm: number; accuracy: number; points: number }[],
): Promise<void> {
  try {
    if (!s.raceId) return;
    const raceId = s.raceId;
    await db.update(racesTable).set({ finishedAt: new Date() }).where(eq(racesTable.id, raceId));
    if (linhas.length === 0) return;
    await db.insert(raceResultsTable).values(
      linhas.map((l) => ({ raceId, userId: l.userId, position: l.position, wpm: l.wpm, accuracy: l.accuracy, pointsAwarded: l.points })),
    );
    for (const l of linhas) {
      const [atual] = await db.select().from(usersTable).where(eq(usersTable.id, l.userId));
      if (!atual) continue;
      const agora = new Date();
      const totalPoints = atual.totalPoints + l.points;
      await db
        .update(usersTable)
        .set({ totalPoints, level: levelFor(totalPoints), lastPlayedAt: agora, streak: proximaSequencia(atual.streak, atual.lastPlayedAt, agora) })
        .where(eq(usersTable.id, l.userId));
      await conferirMedalhas(l.userId);
    }
  } catch (err) {
    logger.error({ err }, "Falha ao gravar resultados da corrida");
  }
}

export function jogarDeNovo(userId: number): RespostaSimples {
  const s = salaDoJogador(userId);
  const j = s?.jogadores.get(userId);
  if (!s || !j) return { ok: false, erro: "Você não está em uma sala." };
  if (!j.anfitriao) return { ok: false, erro: "Só quem criou a sala pode começar outra corrida." };
  if (s.status !== "fim") return { ok: false, erro: "A corrida ainda não terminou." };
  for (const p of [...s.jogadores.values()]) {
    if (!p.conectado) { removerJogadorSemTransmitir(s, p.id); continue; }
    p.pronto = p.anfitriao; p.indice = 0; p.erros = 0; p.wpm = 0; p.precisao = 100;
    p.terminou = false; p.posicao = null; p.pontos = 0; p.invalido = false;
  }
  s.status = "lobby"; s.texto = null; s.inicioEm = null; s.raceId = null; s.rodada++;
  transmitir(s);
  return { ok: true };
}

function removerJogadorSemTransmitir(s: Sala, id: number): void {
  s.jogadores.delete(id);
  if (SALA_DO_JOGADOR.get(id) === s.codigo) SALA_DO_JOGADOR.delete(id);
}

export function aoDesconectar(userId: number, socketId: string): void {
  const s = salaDoJogador(userId);
  const j = s?.jogadores.get(userId);
  if (!s || !j) return;
  j.sockets.delete(socketId);
  if (j.sockets.size > 0) return;
  j.conectado = false;
  promoverAnfitriao(s);
  if (s.status === "lobby" || s.status === "fim") {
    j.saidaTimer = setTimeout(() => removerJogador(s, userId), CARENCIA_SAIDA_MS);
  } else {
    verificarFim(s);
  }
  if (![...s.jogadores.values()].some((p) => p.conectado)) s.vaziaDesde = Date.now();
  transmitir(s);
}

/** Remove salas sem ninguém conectado por alguns minutos. */
export function limparSalasVazias(): void {
  const agora = Date.now();
  for (const s of [...SALAS.values()]) {
    const alguem = [...s.jogadores.values()].some((j) => j.conectado);
    if (alguem) { s.vaziaDesde = null; continue; }
    s.vaziaDesde ??= agora;
    if (agora - s.vaziaDesde >= SALA_VAZIA_MS) fecharSala(s);
  }
}

export function estadoDaSala(codigo: string): EstadoSala | null {
  const s = SALAS.get(codigo);
  return s ? snapshot(s) : null;
}

