import { useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { EVENTOS, type EstadoSala, type RespostaSimples, type RespostaCriar, type ProgressoCorrida } from "@workspace/typing-core";

let socket: Socket | null = null;
let estadoAtual: EstadoSala | null = null;
let offset = 0;
let conectado = false;
let erroConexao: string | null = null;
const ouvintes = new Set<() => void>();
const avisar = () => ouvintes.forEach((f) => f());

export function obterSocket(): Socket {
  if (socket) return socket;
  socket = io({ path: "/api/socket.io", withCredentials: true });
  socket.on("connect", () => { conectado = true; erroConexao = null; avisar(); });
  socket.on("disconnect", () => { conectado = false; avisar(); });
  socket.on("connect_error", () => { conectado = false; erroConexao = "Não conseguimos falar com a pista. Confira se você ainda está no jogo."; avisar(); });
  socket.on(EVENTOS.estado, (e: EstadoSala) => { offset = e.agora - Date.now(); estadoAtual = e; avisar(); });
  return socket;
}

export function agoraServidor() { return Date.now() + offset; }

const SEM_RESPOSTA = "A pista demorou para responder. Tente de novo.";
function emitir<T extends { ok: boolean }>(ev: string, dados: unknown): Promise<T | { ok: false; erro: string }> {
  return new Promise((res) => {
    obterSocket().timeout(8000).emit(ev, dados, (err: unknown, r: T) => res(err ? { ok: false, erro: SEM_RESPOSTA } : r));
  });
}

export const salaApi = {
  criar: (nome: string) => emitir<RespostaCriar>(EVENTOS.criar, { nome }),
  entrar: (codigo: string) => emitir<RespostaSimples>(EVENTOS.entrar, { codigo }),
  sair: async () => { const r = await emitir<RespostaSimples>(EVENTOS.sair, null); estadoAtual = null; avisar(); return r; },
  pronto: (pronto: boolean) => emitir<RespostaSimples>(EVENTOS.pronto, { pronto }),
  iniciar: () => emitir<RespostaSimples>(EVENTOS.iniciar, null),
  jogarDeNovo: () => emitir<RespostaSimples>(EVENTOS.jogarDeNovo, null),
  progresso: (p: ProgressoCorrida) => { obterSocket().emit(EVENTOS.progresso, p); },
  limpar: () => { estadoAtual = null; avisar(); },
};

export function useSala() {
  const [, setN] = useState(0);
  useEffect(() => {
    obterSocket();
    const f = () => setN((n) => n + 1);
    ouvintes.add(f);
    return () => { ouvintes.delete(f); };
  }, []);
  return { estado: estadoAtual, conectado, erroConexao };
}
