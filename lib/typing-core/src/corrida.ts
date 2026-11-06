/** Tipos e regras compartilhados entre o servidor e o navegador nas corridas. */

export const SALA_MIN = 2;
export const SALA_MAX = 8;
export const CONTAGEM_SEGUNDOS = 3;
export const WPM_MAXIMO_CORRIDA = 250;
export const ALFABETO_SALA = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export type StatusSala = "lobby" | "contagem" | "corrida" | "fim";

export interface JogadorSala {
  id: number;
  apelido: string;
  avatar: string;
  pronto: boolean;
  anfitriao: boolean;
  conectado: boolean;
  /** Índice do caractere atual, em caracteres (0 até o tamanho do texto). */
  indice: number;
  wpm: number;
  precisao: number;
  terminou: boolean;
  /** 1, 2, 3... quando terminou; null enquanto corre ou se não terminou. */
  posicao: number | null;
  pontos: number;
  /** Resultado considerado inválido pelo servidor (ex.: velocidade impossível). */
  invalido: boolean;
}

export interface EstadoSala {
  codigo: string;
  nome: string;
  status: StatusSala;
  jogadores: JogadorSala[];
  /** Texto da corrida (só durante contagem, corrida e fim). */
  texto: string | null;
  /** Horário do servidor (ms desde 1970) em que a corrida libera a digitação. */
  inicioEm: number | null;
  /** Horário atual do servidor, para o navegador acertar o relógio. */
  agora: number;
  rodada: number;
}

export type RespostaSimples = { ok: true } | { ok: false; erro: string };
export type RespostaCriar = { ok: true; codigo: string } | { ok: false; erro: string };

export interface ProgressoCorrida {
  indice: number;
  erros: number;
}

export const EVENTOS = {
  criar: "sala:criar",
  entrar: "sala:entrar",
  sair: "sala:sair",
  pronto: "sala:pronto",
  iniciar: "sala:iniciar",
  jogarDeNovo: "sala:jogar-de-novo",
  progresso: "corrida:progresso",
  estado: "sala:estado",
} as const;

/** Código da sala: 5 letras maiúsculas ou números, sem O, 0, I, 1 nem L. */
export function codigoValido(c: string): boolean {
  return new RegExp(`^[${ALFABETO_SALA}]{5}$`).test(c);
}

/** Quantos caracteres, no máximo, dá para ter digitado depois de um tempo (limite humano). */
export function indiceMaximoPlausivel(decorridoMs: number, tamanhoTexto: number): number {
  const porSegundo = (WPM_MAXIMO_CORRIDA * 5) / 60;
  return Math.min(tamanhoTexto, Math.ceil((decorridoMs / 1000) * porSegundo) + 3);
}

export function pontosCorrida(posicao: number, precisao: number): number {
  const base = posicao === 1 ? 50 : posicao === 2 ? 35 : posicao === 3 ? 25 : 15;
  return base + (precisao >= 95 ? 10 : 0);
}
