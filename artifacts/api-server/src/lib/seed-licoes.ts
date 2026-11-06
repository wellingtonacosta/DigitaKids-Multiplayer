import { eq } from "drizzle-orm";
import { db, lessonsTable } from "@workspace/db";
import { LICOES } from "@workspace/typing-core";
import { logger } from "./logger";

/** Grava ou atualiza as 8 lições (idempotente, pela ordem). */
export async function seedLicoes(): Promise<void> {
  const existentes = await db.select().from(lessonsTable);
  for (const l of LICOES) {
    const valores = {
      order: l.ordem,
      title: l.titulo,
      description: l.descricao,
      targetText: l.textoAlvo,
      keysFocus: l.teclasFoco,
    };
    const atual = existentes.find((e) => e.order === l.ordem);
    if (atual) await db.update(lessonsTable).set(valores).where(eq(lessonsTable.id, atual.id));
    else await db.insert(lessonsTable).values(valores);
  }
  logger.info({ total: LICOES.length }, "Lições prontas");
}
