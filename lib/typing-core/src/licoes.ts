export interface LicaoConteudo {
  ordem: number;
  titulo: string;
  descricao: string;
  textoAlvo: string;
  teclasFoco: string;
}

/** As 8 lições da trilha. Textos adequados para crianças de ~12 anos. */
export const LICOES: LicaoConteudo[] = [
  {
    ordem: 1,
    titulo: "Linha base",
    descricao: "Os dedos descansam em A S D F e J K L Ç. Aqui começa a colheita!",
    textoAlvo: "asdf jklç fdsa çlkj sala fada saco lado dado jaca ala sal",
    teclasFoco: "asdfjklç",
  },
  {
    ordem: 2,
    titulo: "Dedos indicadores",
    descricao: "Os indicadores também alcançam o G e o H.",
    textoAlvo: "gado galho hoje fogo jogo lago saga haja gola folga hall gás",
    teclasFoco: "gh",
  },
  {
    ordem: 3,
    titulo: "Linha superior",
    descricao: "Os dedos sobem para Q W E R T Y U I O P.",
    textoAlvo: "pequeno tempo pouco quero tropa pretos erro uva ouro pé tapete",
    teclasFoco: "qwertyuiop",
  },
  {
    ordem: 4,
    titulo: "Linha inferior",
    descricao: "Agora os dedos descem para Z X C V B N M , . e ;",
    textoAlvo: "zebra vaca bomba nuvem caixa, calma. ponto; vovô, zero. bebê",
    teclasFoco: "zxcvbnm,.;",
  },
  {
    ordem: 5,
    titulo: "Letras maiúsculas",
    descricao: "Use o Shift da mão contrária à da letra. Mão esquerda na letra, Shift direito!",
    textoAlvo: "Ana e Bruno viram o Sol. Carlos e Marta jogam Bola. Diogo e Paula",
    teclasFoco: "Shift",
  },
  {
    ordem: 6,
    titulo: "Acentos e ç",
    descricao: "Primeiro o acento, depois a letra: ´ ` ~ ^",
    textoAlvo: "avó maçã coração você café pé âmbar ação não órfão à tarde irmã",
    teclasFoco: "´`~^ç",
  },
  {
    ordem: 7,
    titulo: "Números e pontuação",
    descricao: "A fileira de cima tem os números. Os dedos esticam e voltam para casa.",
    textoAlvo: "Eu tenho 12 anos, 3 gatos e 45 livros! Sabia? São 67 pontos (98%).",
    teclasFoco: "0123456789!?()%",
  },
  {
    ordem: 8,
    titulo: "Palavras e frases",
    descricao: "Hora de juntar tudo e digitar frases de verdade!",
    textoAlvo:
      "O sapo não lava o pé, não lava porque não quer. Ele mora lá na lagoa, não lava o pé porque não quer.",
    teclasFoco: "tudo",
  },
];
