/** Regras de estrelas e pontos. A precisão pesa mais que a velocidade. */

export const PRECISAO_MINIMA = 90;

export function calcularEstrelas(ordemLicao: number, wpm: number, precisao: number): 0 | 1 | 2 | 3 {
  if (precisao < PRECISAO_MINIMA) return 0;
  const wpm2 = 6 + ordemLicao * 1.5;
  const wpm3 = 10 + ordemLicao * 2.5;
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
  { nome: "Pintinho", minimo: 0 },
  { nome: "Galinha", minimo: 200 },
  { nome: "Galo", minimo: 800 },
  { nome: "Mestre do Milharal", minimo: 2000 },
] as const;

export function nivelPorPontos(pontos: number): string {
  let nome: string = NIVEIS[0].nome;
  for (const n of NIVEIS) if (pontos >= n.minimo) nome = n.nome;
  return nome;
}
