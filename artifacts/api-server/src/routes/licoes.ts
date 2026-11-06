import { Router, type IRouter } from "express";
import { and, asc, desc, eq } from "drizzle-orm";
import { db, lessonsTable, lessonResultsTable, usersTable } from "@workspace/db";
import {
  EnviarResultadoLicaoBody,
  EnviarResultadoLicaoParams,
  EnviarResultadoLicaoResponse,
  ListarLicoesResponse,
} from "@workspace/api-zod";
import {
  calcularEquilibrio,
  calcularEstrelas,
  calcularPontos,
  calcularPrecisao,
  calcularWpm,
  gerarDica,
  mensagemMotivadora,
  toquesDoTexto,
} from "@workspace/typing-core";
import { rateLimit } from "../lib/rateLimit";
import { jogadorDaSessao } from "../lib/sessao";
import { levelFor } from "../lib/levels";

const router: IRouter = Router();
const SEM_SESSAO = { erro: "Entre com seu apelido para jogar." };
const WPM_MAXIMO = 250;
const ORDEM_SEM_OLHAR = 5;

async function melhoresDoJogador(userId: number) {
  const rows = await db.select().from(lessonResultsTable).where(eq(lessonResultsTable.userId, userId));
  const mapa = new Map<number, { estrelas: number; wpm: number; precisao: number }>();
  for (const r of rows) {
    const m = mapa.get(r.lessonId) ?? { estrelas: 0, wpm: 0, precisao: 0 };
    m.estrelas = Math.max(m.estrelas, r.stars);
    m.wpm = Math.max(m.wpm, r.wpm);
    m.precisao = Math.max(m.precisao, r.accuracy);
    mapa.set(r.lessonId, m);
  }
  return mapa;
}

router.get("/licoes", async (req, res): Promise<void> => {
  const user = await jogadorDaSessao(req);
  if (!user) {
    res.status(401).json(SEM_SESSAO);
    return;
  }
  const lessons = await db.select().from(lessonsTable).orderBy(asc(lessonsTable.order));
  const melhores = await melhoresDoJogador(user.id);
  let anteriorPassou = true;
  const lista = lessons.map((l) => {
    const m = melhores.get(l.id);
    const item = {
      id: l.id,
      ordem: l.order,
      titulo: l.title,
      descricao: l.description,
      textoAlvo: l.targetText,
      teclasFoco: l.keysFocus,
      desbloqueada: anteriorPassou,
      estrelas: m?.estrelas ?? 0,
      melhorWpm: m?.wpm ?? 0,
      melhorPrecisao: m?.precisao ?? 0,
      semOlharDisponivel: l.order >= ORDEM_SEM_OLHAR,
    };
    anteriorPassou = (m?.estrelas ?? 0) >= 1;
    return item;
  });
  res.json(ListarLicoesResponse.parse(lista));
});

router.post("/licoes/:id/resultado", rateLimit(30, 10 * 60 * 1000), async (req, res): Promise<void> => {
  const user = await jogadorDaSessao(req);
  if (!user) {
    res.status(401).json(SEM_SESSAO);
    return;
  }
  const params = EnviarResultadoLicaoParams.safeParse(req.params);
  const body = EnviarResultadoLicaoBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ erro: "Resultado inválido." });
    return;
  }
  const lessons = await db.select().from(lessonsTable).orderBy(asc(lessonsTable.order));
  const licao = lessons.find((l) => l.id === params.data.id);
  if (!licao) {
    res.status(404).json({ erro: "Lição não encontrada." });
    return;
  }
  const melhores = await melhoresDoJogador(user.id);
  const anterior = lessons.find((l) => l.order === licao.order - 1);
  if (anterior && (melhores.get(anterior.id)?.estrelas ?? 0) < 1) {
    res.status(403).json({ erro: "Termine a lição anterior para liberar esta." });
    return;
  }

  const b = body.data;
  const caracteres = [...licao.targetText].length;
  const toquesCertos = toquesDoTexto(licao.targetText).length;
  const somaErros = Object.values(b.errosPorTecla).reduce((a, n) => a + n, 0);
  const wpm = calcularWpm(caracteres, b.duracaoMs);
  const maosOk =
    b.teclasEsquerda >= 0 && b.teclasDireita >= 0 && b.teclasEsquerda + b.teclasDireita <= toquesCertos;
  if (b.duracaoMs < 500 || wpm > WPM_MAXIMO || b.erros < 0 || b.erros !== somaErros || !maosOk) {
    res.status(400).json({ erro: "Esse resultado não parece certo. Tente digitar de novo." });
    return;
  }

  // O tempo de um envio não pode caber dentro do intervalo desde o envio anterior:
  // impede enviar vários resultados seguidos sem ter digitado de verdade.
  const [ultimo] = await db
    .select({ createdAt: lessonResultsTable.createdAt })
    .from(lessonResultsTable)
    .where(eq(lessonResultsTable.userId, user.id))
    .orderBy(desc(lessonResultsTable.createdAt))
    .limit(1);
  if (ultimo && Date.now() - ultimo.createdAt.getTime() < b.duracaoMs * 0.9) {
    res.status(429).json({ erro: "Calma, campeão! Termine uma lição de verdade antes de enviar outra." });
    return;
  }

  const precisao = calcularPrecisao(toquesCertos, b.erros);
  const estrelas = calcularEstrelas(licao.order, wpm, precisao);
  const melhorAntes = melhores.get(licao.id)?.estrelas ?? 0;
  const pontosGanhos = calcularPontos(estrelas, precisao, melhorAntes);
  const eq_ = calcularEquilibrio(b.teclasEsquerda, b.teclasDireita);
  const totalMaos = b.teclasEsquerda + b.teclasDireita;

  await db.insert(lessonResultsTable).values({
    userId: user.id,
    lessonId: licao.id,
    wpm,
    accuracy: precisao,
    stars: estrelas,
    leftHandPercent: totalMaos ? (b.teclasEsquerda / totalMaos) * 100 : 0,
    rightHandPercent: totalMaos ? (b.teclasDireita / totalMaos) * 100 : 0,
    errorsByKeyJson: JSON.stringify(b.errosPorTecla),
    durationMs: b.duracaoMs,
    errors: b.erros,
    noLook: b.semOlhar && licao.order >= ORDEM_SEM_OLHAR,
  });

  const pontosTotais = user.totalPoints + pontosGanhos;
  const nivel = levelFor(pontosTotais);
  await db
    .update(usersTable)
    .set({ totalPoints: pontosTotais, level: nivel, lastPlayedAt: new Date() })
    .where(and(eq(usersTable.id, user.id)));

  const jaDestravada = melhorAntes >= 1;
  const resposta = {
    wpm,
    precisao,
    estrelas,
    pontosGanhos,
    pontosTotais,
    nivel,
    subiuDeNivel: nivel !== user.level,
    proximaLicaoDesbloqueada:
      estrelas >= 1 && !jaDestravada && lessons.some((l) => l.order === licao.order + 1),
    melhorou: estrelas > melhorAntes,
    esquerdaPct: eq_.esquerdaPct,
    direitaPct: eq_.direitaPct,
    desequilibrada: eq_.desequilibrada ?? ("nenhuma" as const),
    mensagem: mensagemMotivadora(estrelas),
    dica: gerarDica({ errosPorTecla: b.errosPorTecla, equilibrio: eq_, precisao, estrelas }),
  };
  res.json(EnviarResultadoLicaoResponse.parse(resposta));
});

export default router;
