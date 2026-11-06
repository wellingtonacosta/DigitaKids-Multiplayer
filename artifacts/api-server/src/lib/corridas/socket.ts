import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import { EVENTOS, codigoValido } from "@workspace/typing-core";
import { jogadorDoCookie } from "../sessao";
import { logger } from "../logger";
import {
  aoDesconectar, carregarTextos, configurarEmissor, criarSala, definirPronto, entrarNaSala,
  estadoDaSala, iniciarCorrida, jogarDeNovo, limparSalasVazias, registrarProgresso, sairDaSalaAtual,
  type Usuario,
} from "./salas";

type Ack = (r: unknown) => void;
const ack = (cb: unknown): Ack => (typeof cb === "function" ? (cb as Ack) : () => {});

export async function iniciarSocket(http: HttpServer): Promise<void> {
  await carregarTextos();
  const io = new Server(http, { path: "/api/socket.io", serveClient: false, cors: { origin: true, credentials: true } });
  configurarEmissor((codigo, estado) => io.to(codigo).emit(EVENTOS.estado, estado));
  setInterval(limparSalasVazias, 30 * 1000).unref();

  io.use(async (socket, next) => {
    try {
      const u = await jogadorDoCookie(socket.handshake.headers.cookie);
      if (!u) return next(new Error("sem-sessao"));
      socket.data["usuario"] = { id: u.id, apelido: u.nickname, avatar: u.avatar } satisfies Usuario;
      next();
    } catch (err) {
      logger.error({ err }, "Falha ao autenticar socket");
      next(new Error("erro"));
    }
  });

  io.on("connection", (socket) => {
    const u = socket.data["usuario"] as Usuario;
    const entrarNoCanal = (codigo: string) => { void socket.join(codigo); };

    socket.on(EVENTOS.criar, async (dados: unknown, cb: unknown) => {
      const nome = typeof (dados as { nome?: unknown })?.nome === "string" ? (dados as { nome: string }).nome : "";
      const r = await criarSala(u, nome, socket.id);
      if (r.ok) entrarNoCanal(r.codigo);
      ack(cb)(r);
    });

    socket.on(EVENTOS.entrar, (dados: unknown, cb: unknown) => {
      const codigo = typeof (dados as { codigo?: unknown })?.codigo === "string" ? (dados as { codigo: string }).codigo.trim().toUpperCase() : "";
      if (!codigoValido(codigo)) return ack(cb)({ ok: false, erro: "O código tem 5 letras ou números." });
      const r = entrarNaSala(u, codigo, socket.id);
      if (r.ok) { entrarNoCanal(codigo); const e = estadoDaSala(codigo); if (e) socket.emit(EVENTOS.estado, e); }
      ack(cb)(r.ok ? { ok: true } : r);
    });

    socket.on(EVENTOS.sair, (_d: unknown, cb: unknown) => {
      for (const c of socket.rooms) if (c !== socket.id) void socket.leave(c);
      sairDaSalaAtual(u.id);
      ack(cb)({ ok: true });
    });

    socket.on(EVENTOS.pronto, (dados: unknown, cb: unknown) => {
      ack(cb)(definirPronto(u.id, (dados as { pronto?: unknown })?.pronto === true));
    });
    socket.on(EVENTOS.iniciar, (_d: unknown, cb: unknown) => ack(cb)(iniciarCorrida(u.id)));
    socket.on(EVENTOS.jogarDeNovo, (_d: unknown, cb: unknown) => ack(cb)(jogarDeNovo(u.id)));
    socket.on(EVENTOS.progresso, (dados: unknown) => {
      const d = dados as { indice?: unknown; erros?: unknown };
      if (typeof d?.indice !== "number" || typeof d?.erros !== "number") return;
      registrarProgresso(u.id, { indice: d.indice, erros: d.erros });
    });
    socket.on("disconnect", () => aoDesconectar(u.id, socket.id));
  });
}
