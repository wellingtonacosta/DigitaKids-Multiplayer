import { TECLAS, teclaPorCode, type Mao } from "./abnt2";

/** Um toque de tecla esperado. */
export interface Toque {
  code: string;
  shift: boolean;
  /** Tecla morta (acento) que precisa de outra tecla em seguida. */
  morta?: boolean;
}

const ACENTO_PARA_TOQUE: Record<string, Toque> = {
  agudo: { code: "BracketLeft", shift: false, morta: true },
  crase: { code: "BracketLeft", shift: true, morta: true },
  til: { code: "Quote", shift: false, morta: true },
  circunflexo: { code: "Quote", shift: true, morta: true },
};

const COMPOSTOS: Record<string, [keyof typeof ACENTO_PARA_TOQUE, string]> = {
  á: ["agudo", "a"], é: ["agudo", "e"], í: ["agudo", "i"], ó: ["agudo", "o"], ú: ["agudo", "u"],
  Á: ["agudo", "A"], É: ["agudo", "E"], Í: ["agudo", "I"], Ó: ["agudo", "O"], Ú: ["agudo", "U"],
  à: ["crase", "a"], À: ["crase", "A"],
  ã: ["til", "a"], õ: ["til", "o"], Ã: ["til", "A"], Õ: ["til", "O"],
  â: ["circunflexo", "a"], ê: ["circunflexo", "e"], ô: ["circunflexo", "o"],
  Â: ["circunflexo", "A"], Ê: ["circunflexo", "E"], Ô: ["circunflexo", "O"],
};

const MORTOS = new Set(["´", "`", "~", "^", "¨"]);
const CARACTERE_PARA_TOQUE = new Map<string, Toque>();
for (const k of TECLAS) {
  if (!k.normal) continue;
  if (!MORTOS.has(k.normal)) CARACTERE_PARA_TOQUE.set(k.normal, { code: k.code, shift: false });
  if (k.shift && k.shift !== k.normal && !MORTOS.has(k.shift))
    CARACTERE_PARA_TOQUE.set(k.shift, { code: k.code, shift: true });
}

/** Toques necessários para escrever um caractere (1 normalmente, 2 para letras acentuadas). */
export function toquesDoCaractere(c: string): Toque[] | null {
  const composto = COMPOSTOS[c];
  if (composto) {
    const [acento, base] = composto;
    const b = CARACTERE_PARA_TOQUE.get(base);
    if (!b) return null;
    return [ACENTO_PARA_TOQUE[acento]!, b];
  }
  const direto = CARACTERE_PARA_TOQUE.get(c);
  return direto ? [direto] : null;
}

export function caractereSuportado(c: string): boolean {
  return toquesDoCaractere(c) !== null;
}

/** Todos os toques de um texto, na ordem. Lança erro se houver caractere sem tecla. */
export function toquesDoTexto(texto: string): Toque[] {
  const out: Toque[] = [];
  for (const c of texto) {
    const t = toquesDoCaractere(c);
    if (!t) throw new Error(`Caractere sem tecla no ABNT2: ${JSON.stringify(c)}`);
    out.push(...t);
  }
  return out;
}

/** Mão que deve apertar o Shift: sempre a oposta à da tecla (regra do digitador). */
export function maoDoShiftPara(code: string): Mao {
  const mao = teclaPorCode(code)?.mao;
  return mao === "esquerda" ? "direita" : "esquerda";
}

export function codeDoShift(code: string): "ShiftLeft" | "ShiftRight" {
  return maoDoShiftPara(code) === "esquerda" ? "ShiftLeft" : "ShiftRight";
}
