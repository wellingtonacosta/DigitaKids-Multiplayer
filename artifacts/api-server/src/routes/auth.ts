import { Router, type IRouter } from "express";
import { and, eq } from "drizzle-orm";
import { db, usersTable, type User } from "@workspace/db";
import { EntrarBody, EntrarResponse, ObterJogadorAtualResponse, SairResponse } from "@workspace/api-zod";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_MS,
  clientIp,
  codigoConfere,
  createSessionToken,
  gerarCodigoRecuperacao,
  hashCodigo,
  hashIp,
  readSessionToken,
} from "../lib/identity";
import { AVATARS, NICKNAME_RE, hasBadWord } from "../lib/nickname";
import { rateLimit } from "../lib/rateLimit";
import { sequenciaVisivel } from "../lib/sequencia";
import { levelFor } from "../lib/levels";

const router: IRouter = Router();

const cookieOpts = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env["NODE_ENV"] === "production",
  maxAge: SESSION_MAX_AGE_MS,
  path: "/",
};

function toJogador(u: User, novo: boolean, codigoRecuperacao: string | null = null) {
  return {
    id: u.id,
    apelido: u.nickname,
    avatar: u.avatar,
    pontosTotais: u.totalPoints,
    nivel: levelFor(u.totalPoints),
    sequenciaDias: sequenciaVisivel(u.streak, u.lastPlayedAt),
    novo,
    codigoRecuperacao,
  };
}

// Tentativas erradas de código por apelido: impede adivinhar o código.
const errosCodigo = new Map<string, { n: number; reset: number }>();
const MAX_ERROS_CODIGO = 5;
const JANELA_CODIGO_MS = 15 * 60 * 1000;

function bloqueadoPorCodigo(nick: string): boolean {
  const e = errosCodigo.get(nick);
  return !!e && e.reset > Date.now() && e.n >= MAX_ERROS_CODIGO;
}

function registrarErroCodigo(nick: string): void {
  const agora = Date.now();
  const e = errosCodigo.get(nick);
  if (!e || e.reset < agora) errosCodigo.set(nick, { n: 1, reset: agora + JANELA_CODIGO_MS });
  else e.n += 1;
}

function cookieValue(header: string | undefined, name: string): string | undefined {
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return decodeURIComponent(v.join("="));
  }
  return undefined;
}

router.post("/auth/entrar", rateLimit(20, 10 * 60 * 1000), async (req, res): Promise<void> => {
  const parsed = EntrarBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ erro: "Preencha o apelido e escolha um avatar." });
    return;
  }
  const apelido = parsed.data.apelido.trim();
  const avatar = parsed.data.avatar;

  if (!NICKNAME_RE.test(apelido)) {
    res.status(400).json({ erro: "O apelido precisa ter de 3 a 16 letras ou números, sem espaços." });
    return;
  }
  if (hasBadWord(apelido)) {
    res.status(400).json({ erro: "Vamos escolher um apelido mais legal? Esse não pode." });
    return;
  }
  if (!AVATARS.includes(avatar)) {
    res.status(400).json({ erro: "Escolha um dos avatares da lista." });
    return;
  }

  const ipHash = hashIp(clientIp(req));
  const nick = apelido.toLowerCase();
  const [existing] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.nickname, nick));

  let user: User;
  let novo = false;
  let codigoNovo: string | null = null;
  if (existing) {
    const ipHashNovo = existing.ipHash;
    if (ipHashNovo !== ipHash) {
      const codigo = parsed.data.codigo?.trim();
      if (!codigo || !existing.recoveryHash) {
        res.status(409).json({ erro: "Esse apelido já está em uso, escolha outro" });
        return;
      }
      if (bloqueadoPorCodigo(nick)) {
        res.status(429).json({ erro: "Muitas tentativas com esse apelido. Tente de novo mais tarde." });
        return;
      }
      if (!codigoConfere(codigo, existing.recoveryHash)) {
        registrarErroCodigo(nick);
        res.status(403).json({ erro: "O código não confere. Confira o que você anotou e tente de novo." });
        return;
      }
      errosCodigo.delete(nick);
    }
    // Contas antigas ainda não têm código: gera um na primeira entrada pela conexão de sempre.
    if (!existing.recoveryHash) codigoNovo = gerarCodigoRecuperacao();
    const [updated] = await db
      .update(usersTable)
      .set({ avatar, ipHash, ...(codigoNovo ? { recoveryHash: hashCodigo(codigoNovo) } : {}) })
      .where(and(eq(usersTable.id, existing.id)))
      .returning();
    user = updated!;
  } else {
    codigoNovo = gerarCodigoRecuperacao();
    const inserted = await db
      .insert(usersTable)
      .values({ nickname: nick, ipHash, avatar, recoveryHash: hashCodigo(codigoNovo) })
      .onConflictDoNothing()
      .returning();
    if (!inserted[0]) {
      res.status(409).json({ erro: "Esse apelido já está em uso, escolha outro" });
      return;
    }
    user = inserted[0];
    novo = true;
  }

  res.cookie(SESSION_COOKIE, createSessionToken(user.id), cookieOpts);
  res.json(EntrarResponse.parse(toJogador(user, novo, codigoNovo)));
});

router.get("/auth/eu", async (req, res): Promise<void> => {
  const userId = readSessionToken(cookieValue(req.headers.cookie, SESSION_COOKIE));
  if (!userId) {
    res.status(401).json({ erro: "Entre com seu apelido para jogar." });
    return;
  }
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  if (!user) {
    res.status(401).json({ erro: "Entre com seu apelido para jogar." });
    return;
  }
  res.json(ObterJogadorAtualResponse.parse(toJogador(user, false)));
});

router.post("/auth/sair", async (_req, res): Promise<void> => {
  res.clearCookie(SESSION_COOKIE, { path: "/" });
  res.json(SairResponse.parse({ status: "ok" }));
});

export default router;
