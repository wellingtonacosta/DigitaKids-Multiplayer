export interface SceneDetails { title: string; filePath: string; }
export const SCENE_DETAILS: Record<string, SceneDetails> = {
  abertura: { title: 'Abertura', filePath: 'src/components/video/scenes/Abertura.tsx' },
  risquinho: { title: 'Risquinho em F e J', filePath: 'src/components/video/scenes/Risquinho.tsx' },
  indicadores: { title: 'Passo 1 · Indicadores', filePath: 'src/components/video/scenes/Indicadores.tsx' },
  dedos: { title: 'Passo 2 · Outros dedos', filePath: 'src/components/video/scenes/Dedos.tsx' },
  polegares: { title: 'Passo 3 · Polegares', filePath: 'src/components/video/scenes/Polegares.tsx' },
  treino: { title: 'Treino da linha base', filePath: 'src/components/video/scenes/Treino.tsx' },
};
