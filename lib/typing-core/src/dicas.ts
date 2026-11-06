import { NOME_DEDO, type Dedo } from "./abnt2";
import type { Equilibrio } from "./metrics";
import { errosPorDedo } from "./metrics";

export interface EntradaDica {
  errosPorTecla: Record<string, number>;
  equilibrio: Equilibrio;
  precisao: number;
  estrelas: number;
}

/** Dica amigável e personalizada. Nunca fala de erro de forma negativa. */
export function gerarDica(e: EntradaDica): string {
  if (e.equilibrio.desequilibrada) {
    const usou = e.equilibrio.desequilibrada === "esquerda" ? "esquerda" : "direita";
    const outra = usou === "esquerda" ? "direita" : "esquerda";
    return `Você usou bastante a mão ${usou} nesta lição. Que tal chamar a mão ${outra} para ajudar? As duas trabalham em dupla!`;
  }
  const porDedo = errosPorDedo(e.errosPorTecla);
  const piores = (Object.entries(porDedo) as [Dedo, number][]).sort((a, b) => b[1] - a[1]);
  if (piores.length > 0 && piores[0]![1] >= 2) {
    return `Seu ${NOME_DEDO[piores[0]![0]]} está treinando. Deixe os dedos nas teclas de repouso (F e J) e volte para elas depois de cada toque.`;
  }
  if (e.precisao >= 100) return "Zero tropeços! Agora é só ganhar um pouquinho mais de velocidade, sem pressa.";
  if (e.estrelas >= 3) return "Que lição! Tente a próxima, ou repita para treinar o ritmo.";
  return "Olhe para a tela, não para o teclado. Os dedos já sabem o caminho!";
}

export function mensagemMotivadora(estrelas: number): string {
  switch (estrelas) {
    case 3: return "Incrível! Esse milharal já é seu!";
    case 2: return "Muito bem! Seus dedos estão pegando o jeito.";
    case 1: return "Boa! Você passou de fase. Continue treinando.";
    default: return "Quase lá! Treinar de novo deixa os dedos mais espertos.";
  }
}
