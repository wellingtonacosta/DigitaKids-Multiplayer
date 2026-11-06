import type { Dedo } from "@workspace/typing-core";

/** Cor de cada dedo: forte (realce) e clara (tecla em repouso). */
export const COR_DEDO: Record<Dedo, { forte: string; clara: string }> = {
  "mindinho-esquerdo": { forte: "#9B6FD0", clara: "#E6DAF5" },
  "anelar-esquerdo": { forte: "#3D8FC6", clara: "#D4E8F5" },
  "medio-esquerdo": { forte: "#2F9E6E", clara: "#D2EEDF" },
  "indicador-esquerdo": { forte: "#E39A1E", clara: "#FBE6B8" },
  polegar: { forte: "#A07A52", clara: "#EADBC8" },
  "indicador-direito": { forte: "#E39A1E", clara: "#FBE6B8" },
  "medio-direito": { forte: "#2F9E6E", clara: "#D2EEDF" },
  "anelar-direito": { forte: "#3D8FC6", clara: "#D4E8F5" },
  "mindinho-direito": { forte: "#9B6FD0", clara: "#E6DAF5" },
};

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
