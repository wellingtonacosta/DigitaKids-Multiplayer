export interface SceneDetails { title: string; filePath: string; }
export const SCENE_DETAILS: Record<string, SceneDetails> = {
  abertura: { title: 'Abertura', filePath: 'src/components/video/scenes/Abertura.tsx' },
  apelido: { title: 'Apelido', filePath: 'src/components/video/scenes/Apelido.tsx' },
  avatar: { title: 'Avatar', filePath: 'src/components/video/scenes/Avatar.tsx' },
  privacidade: { title: 'Privacidade', filePath: 'src/components/video/scenes/Privacidade.tsx' },
  volta: { title: 'Volta automática', filePath: 'src/components/video/scenes/Volta.tsx' },
  inicio: { title: 'Tela inicial', filePath: 'src/components/video/scenes/Inicio.tsx' },
};
