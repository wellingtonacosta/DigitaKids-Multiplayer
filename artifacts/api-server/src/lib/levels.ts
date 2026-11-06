export function levelFor(points: number): string {
  if (points >= 2000) return "Mestre";
  if (points >= 800) return "Veloz";
  if (points >= 200) return "Digitador";
  return "Aprendiz";
}
