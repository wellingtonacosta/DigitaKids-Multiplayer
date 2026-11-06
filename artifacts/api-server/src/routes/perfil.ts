import { Router, type IRouter } from "express";
import { eq, gt, sql } from "drizzle-orm";
import {
  db, achievementsTable, userAchievementsTable, lessonsTable, lessonResultsTable, raceResultsTable, usersTable,
} from "@workspace/db";
import { ObterPerfilResponse } from "@workspace/api-zod";
import { NIVEIS } from "@workspace/typing-core";
import { jogadorDaSessao } from "../lib/sessao";
import { sequenciaVisivel } from "../lib/sequencia";
import { CATALOGO } from "../lib/medalhas";

const router: IRouter = Router();

router.get("/perfil", async (req, res): Promise<void> => {
  const user = await jogadorDaSessao(req);
  if (!user) {
    res.status(401).json({ erro: "Entre com seu apelido para jogar." });
    return;
  }
  const [lic, [totalLicoes], corridas, ganhas, [acima]] = await Promise.all([
    db.select().from(lessonResultsTable).where(eq(lessonResultsTable.userId, user.id)),
    db.select({ n: sql<number>`count(*)::int` }).from(lessonsTable),
    db.select().from(raceResultsTable).where(eq(raceResultsTable.userId, user.id)),
    db
      .select({ key: achievementsTable.key, earnedAt: userAchievementsTable.earnedAt })
      .from(userAchievementsTable)
      .innerJoin(achievementsTable, eq(achievementsTable.id, userAchievementsTable.achievementId))
      .where(eq(userAchievementsTable.userId, user.id)),
    db.select({ n: sql<number>`count(*)::int` }).from(usersTable).where(gt(usersTable.totalPoints, user.totalPoints)),
  ]);

  const melhorPorLicao = new Map<number, number>();
  for (const r of lic) melhorPorLicao.set(r.lessonId, Math.max(melhorPorLicao.get(r.lessonId) ?? 0, r.stars));
  const concluidas = [...melhorPorLicao.values()].filter((e) => e >= 1).length;
  const estrelasTotais = [...melhorPorLicao.values()].reduce((a, n) => a + n, 0);

  const idx = NIVEIS.findIndex((n) => n.nome === user.level);
  const proximo = idx >= 0 ? NIVEIS[idx + 1] : undefined;
  const quando = new Map(ganhas.map((g) => [g.key, g.earnedAt]));

  res.json(
    ObterPerfilResponse.parse({
      apelido: user.nickname,
      avatar: user.avatar,
      nivel: user.level,
      pontosTotais: user.totalPoints,
      pontosProximoNivel: proximo ? Math.max(0, proximo.minimo - user.totalPoints) : null,
      proximoNivel: proximo?.nome ?? null,
      sequenciaDias: sequenciaVisivel(user.streak, user.lastPlayedAt),
      licoesConcluidas: concluidas,
      totalLicoes: totalLicoes?.n ?? 0,
      estrelasTotais,
      melhorWpm: lic.reduce((a, r) => Math.max(a, r.wpm), 0),
      melhorPrecisao: lic.reduce((a, r) => Math.max(a, r.accuracy), 0),
      corridasDisputadas: corridas.length,
      vitorias: corridas.filter((c) => c.position === 1).length,
      posicaoPontos: (acima?.n ?? 0) + 1,
      entrouEm: user.createdAt,
      medalhas: CATALOGO.map((m) => ({
        ...m,
        conquistada: quando.has(m.chave),
        conquistadaEm: quando.get(m.chave) ?? null,
      })),
    }),
  );
});

export default router;
