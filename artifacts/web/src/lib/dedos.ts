import type { Dedo } from "@workspace/typing-core";

const AZUL = { forte: "#2563C9", clara: "#CFE0F8" };
const VERDE = { forte: "#2E9E52", clara: "#CDEBD6" };
const AMARELO = { forte: "#D9A90B", clara: "#FBEFB0" };
const VERMELHO = { forte: "#D6453A", clara: "#F8CFCA" };
const CINZA = { forte: "#6F757D", clara: "#E2E4E7" };

/** Cor de cada dedo: forte (realce) e clara (tecla em repouso). Mesma cor nos dedos equivalentes das duas mãos. */
export const COR_DEDO: Record<Dedo, { forte: string; clara: string }> = {
  "mindinho-esquerdo": AZUL,
  "anelar-esquerdo": VERDE,
  "medio-esquerdo": AMARELO,
  "indicador-esquerdo": VERMELHO,
  polegar: CINZA,
  "indicador-direito": VERMELHO,
  "medio-direito": AMARELO,
  "anelar-direito": VERDE,
  "mindinho-direito": AZUL,
};

export const LEGENDA_DEDOS: { nome: string; cor: { forte: string; clara: string } }[] = [
  { nome: "Mindinho", cor: AZUL },
  { nome: "Anelar", cor: VERDE },
  { nome: "Dedo do meio", cor: AMARELO },
  { nome: "Indicador", cor: VERMELHO },
  { nome: "Polegar", cor: CINZA },
];

const CHAVE_MUDO = "digitakids-mudo";
export function lerMudo() {
  try { return localStorage.getItem(CHAVE_MUDO) === "1"; } catch { return false; }
}
export function salvarMudo(v: boolean) {
  try { localStorage.setItem(CHAVE_MUDO, v ? "1" : "0"); } catch { /* sem storage */ }
}

let ctx: AudioContext | null = null;
export function tocarSom(tipo: "erro" | "fim") {
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    ctx = ctx ?? new AC();
    const t0 = ctx.currentTime;
    const notas = tipo === "erro" ? [[220, 0, 0.12]] : [[523, 0, 0.12], [659, 0.12, 0.12], [784, 0.24, 0.25]];
    for (const [f, d, dur] of notas) {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = tipo === "erro" ? "triangle" : "sine";
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t0 + d);
      g.gain.exponentialRampToValueAtTime(0.18, t0 + d + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + d + dur);
      o.connect(g).connect(ctx.destination);
      o.start(t0 + d);
      o.stop(t0 + d + dur + 0.02);
    }
  } catch { /* áudio indisponível */ }
}
