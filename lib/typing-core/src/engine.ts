import { TECLAS_MODIFICADORAS } from "./abnt2";
import { toquesDoTexto, type Toque } from "./strokes";
import { calcularEquilibrio, calcularPrecisao, calcularWpm, contarMao, type Equilibrio } from "./metrics";

export interface EventoTecla {
  code: string;
  key: string;
  shiftKey: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  altKey?: boolean;
  repeat?: boolean;
  isTrusted?: boolean;
}

export type Resultado =
  | { tipo: "ignorado" }
  | { tipo: "acerto"; terminou: boolean }
  | { tipo: "erro"; esperado: Toque; recebido: string };

export interface ResumoDigitacao {
  duracaoMs: number;
  caracteres: number;
  toquesCertos: number;
  erros: number;
  errosPorTecla: Record<string, number>;
  teclasEsquerda: number;
  teclasDireita: number;
  wpm: number;
  precisao: number;
  equilibrio: Equilibrio;
}

/**
 * Motor de digitação: recebe eventos de tecla e confere com o texto-alvo.
 * Só avança com o toque certo. Eventos falsos (isTrusted === false) são ignorados.
 */
export class MotorDigitacao {
  readonly texto: string;
  private readonly toques: Toque[];
  /** Posição do primeiro toque de cada caractere (para saber o caractere atual). */
  private readonly inicios: number[] = [];
  private pos = 0;
  private inicioMs: number | null = null;
  private fimMs: number | null = null;
  private certos = 0;
  private erros = 0;
  private errosPorTecla: Record<string, number> = {};
  private esq = 0;
  private dir = 0;

  constructor(texto: string, private readonly agora: () => number = () => Date.now()) {
    this.texto = texto;
    this.toques = toquesDoTexto(texto);
    let p = 0;
    for (const c of texto) {
      this.inicios.push(p);
      p += toquesDoTexto(c).length;
    }
  }

  get terminou(): boolean {
    return this.pos >= this.toques.length;
  }

  /** Índice (em caracteres) do caractere que deve ser digitado agora. */
  get indiceCaractere(): number {
    let i = 0;
    while (i + 1 < this.inicios.length && this.inicios[i + 1]! <= this.pos) i++;
    return this.terminou ? this.inicios.length : i;
  }

  /** Próximo toque esperado (null se terminou). */
  get proximoToque(): Toque | null {
    return this.toques[this.pos] ?? null;
  }

  /** Quantos toques o caractere atual já recebeu (1 = falta só a letra depois do acento). */
  get progressoNoCaractere(): number {
    return this.pos - (this.inicios[this.indiceCaractere] ?? this.pos);
  }

  processar(ev: EventoTecla): Resultado {
    if (ev.isTrusted === false) return { tipo: "ignorado" };
    if (ev.repeat) return { tipo: "ignorado" };
    if (this.terminou) return { tipo: "ignorado" };
    if (TECLAS_MODIFICADORAS.has(ev.code)) return { tipo: "ignorado" };
    if (ev.ctrlKey || ev.metaKey || ev.altKey) return { tipo: "ignorado" };
    if (ev.code === "Backspace" || ev.code === "Tab" || ev.code === "Enter" || ev.code.startsWith("Arrow") || ev.code === "Escape")
      return { tipo: "ignorado" };

    const esperado = this.toques[this.pos]!;
    if (this.inicioMs === null) this.inicioMs = this.agora();

    if (ev.code === esperado.code && ev.shiftKey === esperado.shift) {
      this.pos++;
      this.certos++;
      const mao = contarMao(esperado.code);
      if (mao === "esquerda") this.esq++;
      else if (mao === "direita") this.dir++;
      if (this.terminou) this.fimMs = this.agora();
      return { tipo: "acerto", terminou: this.terminou };
    }

    // Errou. Se estava no meio de um acento, volta ao início do caractere.
    this.erros++;
    this.errosPorTecla[esperado.code] = (this.errosPorTecla[esperado.code] ?? 0) + 1;
    const inicioChar = this.inicios[this.indiceCaractere];
    if (inicioChar !== undefined && this.pos > inicioChar) this.pos = inicioChar;
    return { tipo: "erro", esperado, recebido: ev.code };
  }

  resumo(): ResumoDigitacao {
    const fim = this.fimMs ?? this.agora();
    const duracaoMs = this.inicioMs === null ? 0 : Math.max(0, fim - this.inicioMs);
    const caracteres = [...this.texto].length;
    return {
      duracaoMs,
      caracteres,
      toquesCertos: this.certos,
      erros: this.erros,
      errosPorTecla: { ...this.errosPorTecla },
      teclasEsquerda: this.esq,
      teclasDireita: this.dir,
      wpm: calcularWpm(caracteres, duracaoMs),
      precisao: calcularPrecisao(this.certos, this.erros),
      equilibrio: calcularEquilibrio(this.esq, this.dir),
    };
  }
}
