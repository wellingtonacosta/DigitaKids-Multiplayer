/** Regras de estrelas e pontos. A precisão pesa mais que a velocidade. */

export const PRECISAO_MINIMA = 90;

export function calcularEstrelas(ordemLicao: number, wpm: number, precisao: number): 0 | 1 | 2 | 3 {
  if (precisao < PRECISAO_MINIMA) return 0;
  // Depois da lição 8 as metas crescem devagar, para continuarem alcançáveis por crianças.
  const base = Math.min(ordemLicao, 8);
  const extra = Math.max(0, ordemLicao - 8);
  const wpm2 = 6 + base * 1.5 + extra * 0.5;
  const wpm3 = 10 + base * 2.5 + extra * 1;
  if (precisao >= 98 && wpm >= wpm3) return 3;
  if (precisao >= 95 && wpm >= wpm2) return 2;
  return 1;
}

export function calcularPontos(estrelas: number, precisao: number, melhorAnterior: number): number {
  const bonus = precisao >= 100 ? 15 : precisao >= 95 ? 8 : 0;
  if (estrelas === 0) return 2;
  // Repetir sem melhorar rende pouco, para não valer a pena só repetir.
  if (estrelas <= melhorAnterior) return 5;
  return estrelas * 20 + bonus;
}

export const NIVEIS = [
  { nome: "Aprendiz", minimo: 0 },
  { nome: "Digitador", minimo: 200 },
  { nome: "Ninja do Teclado", minimo: 800 },
  { nome: "Mestre das Teclas", minimo: 2000 },
] as const;

export function nivelPorPontos(pontos: number): string {
  let nome: string = NIVEIS[0].nome;
  for (const n of NIVEIS) if (pontos >= n.minimo) nome = n.nome;
  return nome;
}
