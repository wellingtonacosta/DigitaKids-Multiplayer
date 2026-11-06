export interface TextoCorrida {
  dificuldade: 1 | 2 | 3;
  fonte: string;
  texto: string;
}

const f = (dificuldade: 1 | 2 | 3, fonte: string, texto: string): TextoCorrida => ({ dificuldade, fonte, texto });

/** 60 textos em PT-BR para corridas: 20 fáceis, 20 médios e 20 difíceis. */
export const TEXTOS_CORRIDA: TextoCorrida[] = [
  // Nível 1: frases curtas
  f(1, "Curiosidade", "O sol é uma estrela muito grande e muito quente."),
  f(1, "Curiosidade", "As abelhas fazem mel com o néctar das flores."),
  f(1, "Curiosidade", "A lua gira em volta da Terra todos os dias."),
  f(1, "Curiosidade", "O gato dorme muitas horas por dia."),
  f(1, "Curiosidade", "A girafa tem o pescoço mais comprido do mundo."),
  f(1, "Curiosidade", "O coração bate sem parar a vida inteira."),
  f(1, "Curiosidade", "As plantas precisam de água, luz e terra."),
  f(1, "Curiosidade", "O mar é salgado porque guarda muitos sais."),
  f(1, "Curiosidade", "A tartaruga pode viver mais de cem anos."),
  f(1, "Curiosidade", "O arco-íris aparece depois da chuva com sol."),
  f(1, "Trava-língua", "O rato roeu a roupa do rei de Roma."),
  f(1, "Trava-língua", "O sapo não lava o pé, não lava porque não quer."),
  f(1, "Trava-língua", "A aranha arranha a rã, a rã arranha a aranha."),
  f(1, "Trava-língua", "Um tigre, dois tigres, três tigres tristes."),
  f(1, "Trava-língua", "O peito do pé de Pedro é preto."),
  f(1, "Domínio público", "Quem ri por último ri melhor."),
  f(1, "Domínio público", "Devagar se vai ao longe."),
  f(1, "Domínio público", "A união faz a força."),
  f(1, "Domínio público", "Água mole em pedra dura, tanto bate até que fura."),
  f(1, "Domínio público", "Mais vale um pássaro na mão do que dois voando."),

  // Nível 2: frases médias
  f(2, "Curiosidade", "O polvo tem três corações e o sangue dele é azul, por causa de um metal chamado cobre."),
  f(2, "Curiosidade", "A Amazônia é a maior floresta tropical do planeta e guarda milhares de espécies de animais."),
  f(2, "Curiosidade", "Os golfinhos dormem com metade do cérebro de cada vez, para continuar a nadar e respirar."),
  f(2, "Curiosidade", "O Brasil tem cinco regiões: Norte, Nordeste, Centro-Oeste, Sudeste e Sul."),
  f(2, "Curiosidade", "A luz do Sol demora oito minutos para chegar até a Terra, viajando pelo espaço."),
  f(2, "Curiosidade", "As formigas carregam folhas muito maiores do que elas e trabalham sempre em equipe."),
  f(2, "Curiosidade", "O camaleão muda de cor para mostrar como se sente e para se proteger dos perigos."),
  f(2, "Curiosidade", "A pipoca estoura porque a água dentro do grão vira vapor e faz pressão."),
  f(2, "Curiosidade", "Os vulcões soltam lava quente que vem do fundo da Terra e depois vira rocha."),
  f(2, "Curiosidade", "O beija-flor bate as asas dezenas de vezes por segundo e consegue ficar parado no ar."),
  f(2, "Fábula", "A cigarra cantou o verão inteiro, e quando o frio chegou, foi pedir ajuda para a formiga."),
  f(2, "Fábula", "A tartaruga andou devagar, sem parar, e ganhou a corrida porque a lebre dormiu no caminho."),
  f(2, "Fábula", "O leão deixou o ratinho ir embora, e depois o ratinho salvou o leão da rede do caçador."),
  f(2, "Fábula", "O corvo abriu o bico para cantar, e a raposa esperta pegou o queijo que caiu."),
  f(2, "Fábula", "O pastor gritou que vinha o lobo, mas era mentira, e depois ninguém acreditou nele."),
  f(2, "Trava-língua", "Num ninho de mafagafos há sete mafagafinhos, e quem desmafagafizar os mafagafos bom desmafagafizador será."),
  f(2, "Trava-língua", "O doce perguntou ao doce qual é o doce mais doce, e o doce respondeu que o doce mais doce é o doce de batata-doce."),
  f(2, "Domínio público", "Não deixe para amanhã o que você pode fazer hoje, porque o tempo passa depressa."),
  f(2, "Domínio público", "Cada macaco no seu galho, cada coisa no seu lugar, e tudo fica mais fácil de achar."),
  f(2, "Domínio público", "Quem cedo madruga, Deus ajuda, mas quem dorme bem também acorda com mais energia."),

  // Nível 3: textos longos
  f(3, "Curiosidade", "O corpo humano tem mais de duzentos ossos, e cada um deles ajuda a sustentar, proteger e mover o nosso corpo todos os dias."),
  f(3, "Curiosidade", "A internet liga computadores de todo o mundo, e por isso uma mensagem pode atravessar o planeta em menos de um segundo."),
  f(3, "Curiosidade", "As árvores da floresta conversam por meio das raízes, trocando nutrientes e avisos, como se fossem uma grande família escondida debaixo da terra."),
  f(3, "Curiosidade", "O rio Amazonas leva tanta água para o oceano que, depois de muitos quilômetros, ainda é possível encontrar água doce no meio do mar."),
  f(3, "Curiosidade", "O milho foi cultivado há milhares de anos pelos povos da América, e hoje está em muitos alimentos, como a pipoca, o fubá e a pamonha."),
  f(3, "Curiosidade", "Os astronautas treinam durante anos antes de viajar, porque dentro de uma nave tudo flutua, até a comida e os lápis."),
  f(3, "Curiosidade", "Uma galinha pode reconhecer mais de cem rostos diferentes e conversa com os pintinhos ainda dentro do ovo, antes mesmo de eles nascerem."),
  f(3, "Curiosidade", "O cérebro é o centro de comando do corpo, e quanto mais a gente pratica uma coisa, mais ele cria caminhos novos para fazer tudo com facilidade."),
  f(3, "Curiosidade", "A capoeira nasceu no Brasil e junta luta, dança e música, ao som do berimbau, do pandeiro e das palmas da roda."),
  f(3, "Curiosidade", "O jacaré existe na Terra há milhões de anos, antes mesmo de os dinossauros desaparecerem, e continua a viver nos rios e nos pântanos."),
  f(3, "Fábula", "Um dia, a raposa viu uma parreira cheia de uvas maduras, mas não conseguiu alcançar nenhuma, e foi embora dizendo que elas estavam verdes."),
  f(3, "Fábula", "A lebre era muito veloz e vivia zombando da tartaruga, mas a tartaruga, com paciência e firmeza, mostrou que a calma também leva longe."),
  f(3, "Fábula", "O ratinho da cidade visitou o ratinho do campo, e os dois descobriram que a vida simples, sem medo, vale mais do que festas cheias de perigo."),
  f(3, "Fábula", "Os três porquinhos construíram casas de palha, de madeira e de tijolos, e só a casa de tijolos resistiu ao sopro forte do lobo."),
  f(3, "Fábula", "A formiga trabalhou o ano todo guardando comida, e por isso, quando o inverno chegou, ela tinha um cantinho quente e uma despensa cheia."),
  f(3, "Trava-língua", "Três pratos de trigo para três tigres tristes, e os tigres tristes comeram o trigo dos três pratos sem deixar um grão sequer."),
  f(3, "Trava-língua", "O padre Pedro Pires Pinto pintou a porta preta do prédio, e depois pediu a Paulo para pintar o portão da praça."),
  f(3, "Domínio público", "Quem planta colhe, e quem estuda aprende, porque tudo o que a gente faz com carinho e com atenção cresce e dá bons frutos."),
  f(3, "Domínio público", "De grão em grão, a galinha enche o papo, e de lição em lição, a gente aprende a digitar com todos os dedos, sem olhar para as teclas."),
  f(3, "Domínio público", "Água parada cria mosquito, mas rio que corre leva embora o que não serve, e por isso é bom estar sempre aprendendo coisas novas."),
];
