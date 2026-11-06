import { count } from "drizzle-orm";
import { db, raceTextsTable } from "@workspace/db";
import { TEXTOS_CORRIDA } from "@workspace/typing-core";
import { logger } from "./logger";

/** Grava os textos de corrida na primeira execução (só se a tabela estiver vazia). */
export async function seedTextosCorrida(): Promise<void> {
  const [{ total } = { total: 0 }] = await db.select({ total: count() }).from(raceTextsTable);
  if (total > 0) return;
  await db.insert(raceTextsTable).values(
    TEXTOS_CORRIDA.map((t) => ({ text: t.texto, difficulty: t.dificuldade, source: t.fonte })),
  );
  logger.info({ total: TEXTOS_CORRIDA.length }, "Textos de corrida prontos");
}
