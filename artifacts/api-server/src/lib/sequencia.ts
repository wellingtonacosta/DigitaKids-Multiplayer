const FUSO = "America/Sao_Paulo";
const fmt = new Intl.DateTimeFormat("en-CA", { timeZone: FUSO, year: "numeric", month: "2-digit", day: "2-digit" });

/** Dia civil (AAAA-MM-DD) no horário de Brasília. */
export function diaBrasilia(d: Date): string {
  return fmt.format(d);
}

function diasEntre(a: string, b: string): number {
  return Math.round((Date.parse(b + "T00:00:00Z") - Date.parse(a + "T00:00:00Z")) / 86_400_000);
}

/** Nova sequência de dias ao jogar agora: mesmo dia mantém, dia seguinte soma, falha reinicia. */
export function proximaSequencia(streak: number, ultimo: Date | null, agora: Date = new Date()): number {
  if (!ultimo) return 1;
  const dif = diasEntre(diaBrasilia(ultimo), diaBrasilia(agora));
  if (dif <= 0) return Math.max(streak, 1);
  if (dif === 1) return streak + 1;
  return 1;
}

/** Sequência a mostrar: some se o jogador já perdeu o dia de ontem. */
export function sequenciaVisivel(streak: number, ultimo: Date | null, agora: Date = new Date()): number {
  if (!ultimo || streak <= 0) return 0;
  return diasEntre(diaBrasilia(ultimo), diaBrasilia(agora)) > 1 ? 0 : streak;
}
