import { nivelPorPontos } from "@workspace/typing-core";

/** Aprendiz, Digitador, Ninja do Teclado ou Mestre das Teclas. */
export function levelFor(points: number): string {
  return nivelPorPontos(points);
}
