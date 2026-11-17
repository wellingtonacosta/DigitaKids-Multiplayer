import { Router, type IRouter } from "express";
import { sql } from "drizzle-orm";
import { db } from "@workspace/db";
import { ObterRankingQueryParams, ObterRankingResponse } from "@workspace/api-zod";
import { jogadorDaSessao } from "../lib/sessao";
import { levelFor } from "../lib/levels";

const router: IRouter = Router();
const LIMITE = 20;

type Linha = { id: number; nickname: string; avatar: string; total_points: number; valor: number; posicao: number };

router.get("/ranking", async (req, res): Promise<void> => {
  const user = await jogadorDaSessao(req);
  if (!user) {
    res.status(401).json({ erro: "Entre com seu apelido para jogar." });
    return;
  }
  const q = ObterRankingQueryParams.safeParse({
    ...req.query,
    pagina: req.query.pagina === undefined ? undefined : Number(req.query.pagina),
  });
  if (!q.success) {
    res.status(400).json({ erro: "Escolha um tipo de ranking e uma página válida." });
    return;
  }
  const { tipo } = q.data;
  const contagem = await db.execute(sql`select count(*)::int as total from users`);
  const totalJogadores = Number(contagem.rows[0]?.total ?? 0);
  const totalPaginas = Math.max(1, Math.ceil(totalJogadores / LIMITE));
  const pagina = Math.min(q.data.pagina ?? 1, totalPaginas);
  const inicio = (pagina - 1) * LIMITE;

  const consulta =
    tipo === "velocidade"
      ? sql`select u.id, u.nickname, u.avatar, u.total_points, coalesce(max(r.wpm), 0)::float as valor
            from users u left join lesson_results r on r.user_id = u.id
            group by u.id`
      : sql`select u.id, u.nickname, u.avatar, u.total_points, u.total_points::float as valor
            from users u`;
  const linhas = (await db.execute(sql`
    with marcas as (${consulta}),
    classificados as (
      select *, row_number() over (order by valor desc, id asc)::int as posicao
      from marcas
    )
    select * from classificados
    where (posicao > ${inicio} and posicao <= ${inicio + LIMITE}) or id = ${user.id}
    order by posicao
  `)).rows as unknown as Linha[];

  const itens = linhas.map((l) => ({
    posicao: l.posicao,
    jogadorId: l.id,
    apelido: l.nickname,
    avatar: l.avatar,
    nivel: levelFor(l.total_points),
    valor: Number(l.valor),
  }));
  res.json(
    ObterRankingResponse.parse({
      tipo,
      itens: itens.filter((t) => t.posicao > inicio && t.posicao <= inicio + LIMITE),
      voce: itens.find((t) => t.jogadorId === user.id) ?? null,
      totalJogadores,
      pagina,
      totalPaginas,
      porPagina: LIMITE,
    }),
  );
});

export default router;
