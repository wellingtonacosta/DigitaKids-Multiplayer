import { dedoDaTecla, maoDaTecla, type Dedo } from "./abnt2";

export function calcularWpm(caracteres: number, duracaoMs: number): number {
  if (duracaoMs <= 0) return 0;
  const minutos = duracaoMs / 60000;
  return Math.round((caracteres / 5 / minutos) * 10) / 10;
}

/** Precisão em % (0 a 100): toques certos sobre todos os toques (certos + erros). */
export function calcularPrecisao(toquesCertos: number, erros: number): number {
  const total = toquesCertos + erros;
  if (total <= 0) return 100;
  return Math.round((toquesCertos / total) * 1000) / 10;
}

export interface Equilibrio {
  esquerdaPct: number;
  direitaPct: number;
  /** Mão que ficou com mais de 80% dos toques, se houver. */
  desequilibrada: "esquerda" | "direita" | null;
}

export const LIMITE_DESEQUILIBRIO = 80;

export function calcularEquilibrio(esquerda: number, direita: number): Equilibrio {
  const total = esquerda + direita;
  if (total === 0) return { esquerdaPct: 0, direitaPct: 0, desequilibrada: null };
  const e = Math.round((esquerda / total) * 100);
  const d = 100 - e;
  return {
    esquerdaPct: e,
    direitaPct: d,
    desequilibrada: e > LIMITE_DESEQUILIBRIO ? "esquerda" : d > LIMITE_DESEQUILIBRIO ? "direita" : null,
  };
}

export function errosPorDedo(errosPorTecla: Record<string, number>): Partial<Record<Dedo, number>> {
  const out: Partial<Record<Dedo, number>> = {};
  for (const [code, n] of Object.entries(errosPorTecla)) {
    const d = dedoDaTecla(code);
    if (d) out[d] = (out[d] ?? 0) + n;
  }
  return out;
}

export function contarMao(code: string): "esquerda" | "direita" | null {
  const m = maoDaTecla(code);
  return m === "esquerda" || m === "direita" ? m : null;
}
