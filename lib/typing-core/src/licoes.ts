export interface LicaoConteudo {
  ordem: number;
  titulo: string;
  descricao: string;
  textoAlvo: string;
  teclasFoco: string;
}

/** As 15 lições da trilha. Textos adequados para crianças de ~12 anos. */
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
  {
    ordem: 9,
    titulo: "Acentos em sequência",
    descricao: "Palavras com ç, til e acentos, uma atrás da outra. Lembre: primeiro o acento!",
    textoAlvo:
      "ação coração limão pão mãe maçã balões irmão avião órgão vovó água dúvida pé você café açúcar feijão ônibus",
    teclasFoco: "´`~^ç",
  },
  {
    ordem: 10,
    titulo: "Frases com maiúsculas",
    descricao: "Frases curtas com letra maiúscula no começo e ponto no final.",
    textoAlvo:
      "Eu moro em Salvador. A Ana ganhou o jogo. O Pedro e a Júlia viram o Rio de Janeiro. Hoje é Sábado e o Sol brilha.",
    teclasFoco: "Shift .",
  },
  {
    ordem: 11,
    titulo: "Perguntas e exclamações",
    descricao: "Vírgulas, interrogações, exclamações e parênteses para dar vida ao texto.",
    textoAlvo:
      "Você viu o milho? Que dia lindo! Ana, Bia e Caio (os três amigos) foram ao sítio. Quanto custa, moço? Nossa, que susto!",
    teclasFoco: ",?!()",
  },
  {
    ordem: 12,
    titulo: "Números e datas",
    descricao: "Datas, horas, preços e porcentagens dentro de frases.",
    textoAlvo:
      "Em 15/03 fui à feira às 08:30 e comprei 12 espigas por R$ 9,50. Foram 25% mais baratas! Em 2026 colhemos 300 kg.",
    teclasFoco: "0123456789/:%$",
  },
  {
    ordem: 13,
    titulo: "Trava-línguas",
    descricao: "Frases rápidas para ganhar ritmo. Devagar e sempre, sem errar!",
    textoAlvo:
      "O rato roeu a roupa do rei de Roma. Três pratos de trigo para três tigres tristes. O sapo cururu está na beira do rio.",
    teclasFoco: "ritmo",
  },
  {
    ordem: 14,
    titulo: "Histórias do milharal",
    descricao: "Um pequeno texto sobre a fazenda, com várias frases seguidas.",
    textoAlvo:
      "Todas as manhãs, o galo canta e o sol acorda o milharal. Os pintinhos correm entre as espigas, e a vovó Rita colhe o milho mais amarelo. À tarde, as crianças ajudam a levar os cestos até o celeiro.",
    teclasFoco: "tudo",
  },
  {
    ordem: 15,
    titulo: "Desafio final",
    descricao: "O texto mais longo da trilha. Use tudo o que aprendeu e colha a última espiga!",
    textoAlvo:
      "No dia 12/10, às 07:30, a turma do sexto ano foi à fazenda do Seu Álvaro. Foram 28 crianças! Você sabia que uma espiga tem mais de 500 grãos? Ana, Bruno e Camila (os campeões da digitação) contaram tudo: \"Aprendemos a usar os dez dedos, sem olhar o teclado\". Que colheita incrível, não é mesmo?",
    teclasFoco: "tudo",
  },
];
