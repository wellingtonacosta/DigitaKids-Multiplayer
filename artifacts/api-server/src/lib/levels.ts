import { nivelPorPontos } from "@workspace/typing-core";

/** Pintinho, Galinha, Galo ou Mestre do Milharal. */
export function levelFor(points: number): string {
  return nivelPorPontos(points);
}
