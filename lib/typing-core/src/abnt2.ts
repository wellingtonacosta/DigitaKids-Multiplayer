/**
 * Teclado ABNT2: cada tecla física (event.code), o que ela escreve sem e com Shift,
 * a mão e o dedo do toque correto (touch typing padrão).
 */

export type Mao = "esquerda" | "direita";
export type Dedo =
  | "mindinho-esquerdo"
  | "anelar-esquerdo"
  | "medio-esquerdo"
  | "indicador-esquerdo"
  | "polegar"
  | "indicador-direito"
  | "medio-direito"
  | "anelar-direito"
  | "mindinho-direito";

export const DEDOS: Dedo[] = [
  "mindinho-esquerdo",
  "anelar-esquerdo",
  "medio-esquerdo",
  "indicador-esquerdo",
  "polegar",
  "indicador-direito",
  "medio-direito",
  "anelar-direito",
  "mindinho-direito",
];

export const NOME_DEDO: Record<Dedo, string> = {
  "mindinho-esquerdo": "mindinho esquerdo",
  "anelar-esquerdo": "anelar esquerdo",
  "medio-esquerdo": "dedo do meio esquerdo",
  "indicador-esquerdo": "indicador esquerdo",
  polegar: "polegar",
  "indicador-direito": "indicador direito",
  "medio-direito": "dedo do meio direito",
  "anelar-direito": "anelar direito",
  "mindinho-direito": "mindinho direito",
};

export interface TeclaFisica {
  code: string;
  /** Linha do teclado (0 = números, 4 = barra de espaço). */
  linha: number;
  normal: string;
  shift: string;
  /** Rótulo para desenhar na tecla (para teclas sem caractere, como Shift). */
  rotulo: string;
  dedo: Dedo;
  mao: Mao | "ambas";
  /** Tecla morta (acento): só escreve junto com a próxima tecla. */
  morta?: boolean;
  /** Largura relativa, em unidades de tecla (1 = tecla comum). */
  largura: number;
}

const ME = "mindinho-esquerdo" as const;
const AE = "anelar-esquerdo" as const;
const DME = "medio-esquerdo" as const;
const IE = "indicador-esquerdo" as const;
const ID = "indicador-direito" as const;
const DMD = "medio-direito" as const;
const AD = "anelar-direito" as const;
const MD = "mindinho-direito" as const;

function t(
  code: string,
  linha: number,
  normal: string,
  shift: string,
  dedo: Dedo,
  extra: Partial<TeclaFisica> = {},
): TeclaFisica {
  const mao: Mao | "ambas" =
    dedo === "polegar" ? "ambas" : dedo.endsWith("esquerdo") ? "esquerda" : "direita";
  return { code, linha, normal, shift, rotulo: normal || shift, dedo, mao, largura: 1, ...extra };
}

export const TECLAS: TeclaFisica[] = [
  // Linha 0: números
  t("Backquote", 0, "'", '"', ME),
  t("Digit1", 0, "1", "!", ME),
  t("Digit2", 0, "2", "@", AE),
  t("Digit3", 0, "3", "#", DME),
  t("Digit4", 0, "4", "$", IE),
  t("Digit5", 0, "5", "%", IE),
  t("Digit6", 0, "6", "¨", ID),
  t("Digit7", 0, "7", "&", ID),
  t("Digit8", 0, "8", "*", DMD),
  t("Digit9", 0, "9", "(", AD),
  t("Digit0", 0, "0", ")", MD),
  t("Minus", 0, "-", "_", MD),
  t("Equal", 0, "=", "+", MD),
  // Linha 1: superior
  t("KeyQ", 1, "q", "Q", ME),
  t("KeyW", 1, "w", "W", AE),
  t("KeyE", 1, "e", "E", DME),
  t("KeyR", 1, "r", "R", IE),
  t("KeyT", 1, "t", "T", IE),
  t("KeyY", 1, "y", "Y", ID),
  t("KeyU", 1, "u", "U", ID),
  t("KeyI", 1, "i", "I", DMD),
  t("KeyO", 1, "o", "O", AD),
  t("KeyP", 1, "p", "P", MD),
  t("BracketLeft", 1, "´", "`", MD, { morta: true }),
  t("BracketRight", 1, "[", "{", MD),
  // Linha 2: base
  t("KeyA", 2, "a", "A", ME),
  t("KeyS", 2, "s", "S", AE),
  t("KeyD", 2, "d", "D", DME),
  t("KeyF", 2, "f", "F", IE),
  t("KeyG", 2, "g", "G", IE),
  t("KeyH", 2, "h", "H", ID),
  t("KeyJ", 2, "j", "J", ID),
  t("KeyK", 2, "k", "K", DMD),
  t("KeyL", 2, "l", "L", AD),
  t("Semicolon", 2, "ç", "Ç", MD),
  t("Quote", 2, "~", "^", MD, { morta: true }),
  t("Backslash", 2, "]", "}", MD),
  // Linha 3: inferior
  t("ShiftLeft", 3, "", "", ME, { rotulo: "Shift", largura: 1.6 }),
  t("IntlBackslash", 3, "\\", "|", ME),
  t("KeyZ", 3, "z", "Z", ME),
  t("KeyX", 3, "x", "X", AE),
  t("KeyC", 3, "c", "C", DME),
  t("KeyV", 3, "v", "V", IE),
  t("KeyB", 3, "b", "B", IE),
  t("KeyN", 3, "n", "N", ID),
  t("KeyM", 3, "m", "M", ID),
  t("Comma", 3, ",", "<", DMD),
  t("Period", 3, ".", ">", AD),
  t("Slash", 3, ";", ":", MD),
  t("IntlRo", 3, "/", "?", MD),
  t("ShiftRight", 3, "", "", MD, { rotulo: "Shift", largura: 1.6 }),
  // Linha 4: espaço
  t("Space", 4, " ", " ", "polegar", { rotulo: "Espaço", largura: 6 }),
];

const POR_CODE = new Map(TECLAS.map((k) => [k.code, k]));

export function teclaPorCode(code: string): TeclaFisica | undefined {
  return POR_CODE.get(code);
}

export function dedoDaTecla(code: string): Dedo | undefined {
  return POR_CODE.get(code)?.dedo;
}

export function maoDaTecla(code: string): Mao | "ambas" | undefined {
  return POR_CODE.get(code)?.mao;
}

/** Códigos que só modificam (não contam como erro quando pressionados sozinhos). */
export const TECLAS_MODIFICADORAS = new Set([
  "ShiftLeft",
  "ShiftRight",
  "ControlLeft",
  "ControlRight",
  "AltLeft",
  "AltRight",
  "MetaLeft",
  "MetaRight",
  "CapsLock",
  "OS",
  "ContextMenu",
]);
