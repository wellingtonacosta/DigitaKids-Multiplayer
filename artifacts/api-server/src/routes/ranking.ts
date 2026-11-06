import { Router, type IRouter } from "express";
import { sql } from "drizzle-orm";
import { db } from "@workspace/db";
import { ObterRankingQueryParams, ObterRankingResponse } from "@workspace/api-zod";
import { jogadorDaSessao } from "../lib/sessao";

const router: IRouter = Router();
const LIMITE = 20;

type Linha = { id: number; nickname: string; avatar: string; level: string; valor: number };

router.get("/ranking", async (req, res): Promise<void> => {
  const user = await jogadorDaSessao(req);
  if (!user) {
    res.status(401).json({ erro: "Entre com seu apelido para jogar." });
    return;
  }
  const q = ObterRankingQueryParams.safeParse(req.query);
  const tipo = q.success ? q.data.tipo : "pontos";

  const consulta =
    tipo === "velocidade"
      ? sql`select u.id, u.nickname, u.avatar, u.level, max(r.wpm)::float as valor
            from users u join lesson_results r on r.user_id = u.id
            group by u.id order by valor desc, u.id asc`
      : sql`select u.id, u.nickname, u.avatar, u.level, u.total_points::float as valor
            from users u where u.total_points > 0
            order by u.total_points desc, u.id asc`;
  const linhas = (await db.execute(consulta)).rows as unknown as Linha[];

  const todos = linhas.map((l, i) => ({
    posicao: i + 1,
    jogadorId: l.id,
    apelido: l.nickname,
    avatar: l.avatar,
    nivel: l.level,
    valor: Number(l.valor),
  }));
  res.json(
    ObterRankingResponse.parse({
      tipo,
      itens: todos.slice(0, LIMITE),
      voce: todos.find((t) => t.jogadorId === user.id) ?? null,
      totalJogadores: todos.length,
    }),
  );
});

export default router;
