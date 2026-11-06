import { eq, inArray, sql } from "drizzle-orm";
import {
  db, achievementsTable, userAchievementsTable, lessonsTable, lessonResultsTable, raceResultsTable, usersTable,
} from "@workspace/db";
import { logger } from "./logger";

export const CATALOGO = [
  { chave: "primeira-espiga", titulo: "Primeira espiga", descricao: "Complete sua primeira lição." },
  { chave: "tres-estrelas", titulo: "Espiga dourada", descricao: "Ganhe 3 estrelas em uma lição." },
  { chave: "precisao-total", titulo: "Mira de ouro", descricao: "Termine uma lição sem errar nenhuma tecla." },
  { chave: "dedos-rapidos", titulo: "Dedos ligeiros", descricao: "Digite 30 palavras por minuto em uma lição." },
  { chave: "de-olhos-fechados", titulo: "Sem olhar", descricao: "Ganhe 2 estrelas com o teclado escondido." },
  { chave: "trilha-completa", titulo: "Colheita completa", descricao: "Complete todas as lições da trilha." },
  { chave: "sequencia-3", titulo: "Três dias seguidos", descricao: "Treine 3 dias seguidos." },
  { chave: "sequencia-7", titulo: "Semana no milharal", descricao: "Treine 7 dias seguidos." },
  { chave: "primeira-corrida", titulo: "Na largada", descricao: "Termine sua primeira corrida." },
  { chave: "campeao", titulo: "Campeão da corrida", descricao: "Vença uma corrida com outros jogadores." },
] as const;

export async function seedMedalhas(): Promise<void> {
  const existentes = await db.select().from(achievementsTable);
  for (const m of CATALOGO) {
    const v = { key: m.chave, title: m.titulo, description: m.descricao };
    const atual = existentes.find((e) => e.key === m.chave);
    if (atual) await db.update(achievementsTable).set(v).where(eq(achievementsTable.id, atual.id));
    else await db.insert(achievementsTable).values(v).onConflictDoNothing();
  }
  logger.info({ total: CATALOGO.length }, "Medalhas prontas");
}

/** Confere as regras no banco e grava as medalhas que faltam. Retorna as chaves novas. */
export async function conferirMedalhas(userId: number): Promise<string[]> {
  const [lic, totalLicoes, corridas, [user]] = await Promise.all([
    db.select().from(lessonResultsTable).where(eq(lessonResultsTable.userId, userId)),
    db.select({ n: sql<number>`count(*)::int` }).from(lessonsTable),
    db.select().from(raceResultsTable).where(eq(raceResultsTable.userId, userId)),
    db.select().from(usersTable).where(eq(usersTable.id, userId)),
  ]);
  const concluidas = new Set(lic.filter((r) => r.stars >= 1).map((r) => r.lessonId));
  const ganhas = new Set<string>();
  if (concluidas.size >= 1) ganhas.add("primeira-espiga");
  if (lic.some((r) => r.stars >= 3)) ganhas.add("tres-estrelas");
  if (lic.some((r) => r.stars >= 1 && r.errors === 0)) ganhas.add("precisao-total");
  if (lic.some((r) => r.stars >= 1 && r.wpm >= 30)) ganhas.add("dedos-rapidos");
  if (lic.some((r) => r.noLook && r.stars >= 2)) ganhas.add("de-olhos-fechados");
  if (totalLicoes[0] && totalLicoes[0].n > 0 && concluidas.size >= totalLicoes[0].n) ganhas.add("trilha-completa");
  if (user && user.streak >= 3) ganhas.add("sequencia-3");
  if (user && user.streak >= 7) ganhas.add("sequencia-7");
  if (corridas.length >= 1) ganhas.add("primeira-corrida");
  if (corridas.length >= 1) {
    const vencidas = corridas.filter((c) => c.position === 1);
    if (vencidas.length > 0) {
      const outras = await db
        .select({ raceId: raceResultsTable.raceId, n: sql<number>`count(*)::int` })
        .from(raceResultsTable)
        .where(inArray(raceResultsTable.raceId, vencidas.map((v) => v.raceId)))
        .groupBy(raceResultsTable.raceId);
      if (outras.some((o) => o.n >= 2)) ganhas.add("campeao");
    }
  }
  if (ganhas.size === 0) return [];

  const catalogo = await db.select().from(achievementsTable).where(inArray(achievementsTable.key, [...ganhas]));
  const inseridas = await db
    .insert(userAchievementsTable)
    .values(catalogo.map((c) => ({ userId, achievementId: c.id })))
    .onConflictDoNothing()
    .returning({ achievementId: userAchievementsTable.achievementId });
  const novas = new Set(inseridas.map((i) => i.achievementId));
  return catalogo.filter((c) => novas.has(c.id)).map((c) => c.key);
}

export function medalhaPorChave(chave: string) {
  return CATALOGO.find((m) => m.chave === chave);
}
