import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Volume2, VolumeX, Eye, EyeOff, X, RotateCcw, ArrowRight, RefreshCw, Lock, Gauge, Target, Sparkles, Hand, Lightbulb } from "lucide-react";
import {
  useListarLicoes, useEnviarResultadoLicao, getListarLicoesQueryKey, getObterJogadorAtualQueryKey,
  type Licao, type ResultadoLicao, type ResultadoLicaoInput,
} from "@workspace/api-client-react";
import { MotorDigitacao, codeDoShift, teclaPorCode, NOME_DEDO, type Dedo } from "@workspace/typing-core";
import { useTecladoFisico } from "@/hooks/use-sessao";
import { TecladoVirtual, type Flash } from "@/components/teclado-virtual";
import { Maos } from "@/components/maos";
import { PosicaoMaos } from "@/components/posicao-maos";
import { Galo, Pintinho } from "@/components/milharal";
import { Estrelas, AvisoTeclado } from "@/pages/aulas";
import { lerMudo, salvarMudo, tocarSom } from "@/lib/dedos";
import { cn } from "@/lib/utils";

function nomeTecla(code: string) {
  const k = teclaPorCode(code);
  if (!k) return code;
  if (code === "Space") return "espaço";
  if (code.startsWith("Shift")) return code === "ShiftLeft" ? "Shift esquerdo" : "Shift direito";
  return k.normal.toUpperCase();
}

export default function LicaoPagina() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const temTeclado = useTecladoFisico();
  const q = useListarLicoes();
  const licao = q.data?.find((l) => l.id === id);
  const proxima = q.data?.filter((l) => l.ordem > (licao?.ordem ?? 0)).sort((a, b) => a.ordem - b.ordem)[0];

  const voltar = (
    <Link href="/aulas" data-testid="link-voltar-trilha" className="inline-flex items-center gap-2 font-bold hover:underline">
      <ArrowLeft className="h-5 w-5" aria-hidden="true" />Voltar à trilha
    </Link>
  );

  if (q.isLoading) return <div className="space-y-4" aria-busy="true">{voltar}<div className="h-40 rounded-3xl bg-muted animate-pulse" /><div className="h-64 rounded-3xl bg-muted animate-pulse" /></div>;
  if (q.isError) return (
    <div className="space-y-4">{voltar}
      <div className="chunky rounded-2xl bg-card p-6 text-center" role="status">
        <p className="font-display text-2xl font-extrabold">Não deu para abrir a lição</p>
        <button onClick={() => q.refetch()} data-testid="button-recarregar-licao" className="chunky-btn mt-4 inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-3 font-bold"><RefreshCw className="h-5 w-5" aria-hidden="true" />Tentar de novo</button>
      </div>
    </div>
  );
  if (!licao) return <div className="space-y-4">{voltar}<div className="chunky rounded-2xl bg-card p-6 text-center font-display text-2xl font-extrabold">Essa lição não existe no nosso milharal.</div></div>;
  if (!licao.desbloqueada) return (
    <div className="space-y-4">{voltar}
      <div className="chunky rounded-2xl bg-card p-8 text-center"><Lock className="mx-auto h-10 w-10" aria-hidden="true" />
        <p className="mt-3 font-display text-2xl font-extrabold">Essa lição ainda está trancada no galinheiro</p>
        <p className="text-muted-foreground">Termine a lição anterior para abrir esta.</p></div>
    </div>
  );
  if (!temTeclado) return <div className="space-y-4">{voltar}<h1 className="font-display text-3xl font-extrabold">{licao.titulo}</h1><AvisoTeclado /></div>;

  return <Sessao key={licao.id} licao={licao} proximaId={proxima?.id} voltar={voltar} />;
}

function Sessao({ licao, proximaId, voltar }: { licao: Licao; proximaId?: number; voltar: ReactNode }) {
  const qc = useQueryClient();
  const enviar = useEnviarResultadoLicao();
  const [rodada, setRodada] = useState(0);
  const [intro, setIntro] = useState(licao.ordem === 1);
  const motor = useMemo(() => new MotorDigitacao(licao.textoAlvo), [licao.textoAlvo, rodada]);
  const [, setTick] = useState(0);
  const [flash, setFlash] = useState<Flash>(null);
  const [erroMsg, setErroMsg] = useState<string | null>(null);
  const [anuncio, setAnuncio] = useState("");
  const [mudo, setMudo] = useState(lerMudo);
  const [semOlhar, setSemOlhar] = useState(false);
  const [payload, setPayload] = useState<ResultadoLicaoInput | null>(null);
  const [resultado, setResultado] = useState<ResultadoLicao | null>(null);
  const [calor, setCalor] = useState<Record<string, number>>({});
  const mudoRef = useRef(mudo); mudoRef.current = mudo;
  const semOlharRef = useRef(semOlhar); semOlharRef.current = semOlhar;
  const flashN = useRef(0);
  const mutateRef = useRef(enviar.mutate); mutateRef.current = enviar.mutate;

  const submeter = useCallback((dados: ResultadoLicaoInput) => {
    mutateRef.current({ id: licao.id, data: dados }, {
      onSuccess: (r) => {
        setResultado(r);
        qc.invalidateQueries({ queryKey: getListarLicoesQueryKey() });
        qc.invalidateQueries({ queryKey: getObterJogadorAtualQueryKey() });
      },
    });
  }, [licao.id, qc]);

  useEffect(() => {
    if (payload || intro) return;
    function onKey(e: KeyboardEvent) {
      if (e.ctrlKey || e.metaKey) return;
      if (e.code === "Tab" || e.code === "Escape") return;
      e.preventDefault();
      const r = motor.processar({ code: e.code, key: e.key, shiftKey: e.shiftKey, ctrlKey: e.ctrlKey, metaKey: e.metaKey, altKey: e.altKey, repeat: e.repeat, isTrusted: e.isTrusted });
      if (r.tipo === "ignorado") return;
      flashN.current++;
      if (r.tipo === "acerto") {
        setFlash({ code: e.code, tipo: "acerto", n: flashN.current });
        setErroMsg(null);
        setAnuncio("");
        if (r.terminou) {
          const s = motor.resumo();
          const dados: ResultadoLicaoInput = { duracaoMs: s.duracaoMs, erros: s.erros, errosPorTecla: s.errosPorTecla, teclasEsquerda: s.teclasEsquerda, teclasDireita: s.teclasDireita, semOlhar: semOlharRef.current };
          setCalor(s.errosPorTecla);
          setPayload(dados);
          if (!mudoRef.current) tocarSom("fim");
          setAnuncio("Lição concluída! Calculando suas estrelas.");
          submeter(dados);
        }
      } else {
        const alvo = r.esperado.code;
        setFlash({ code: alvo, tipo: "erro", n: flashN.current });
        const dedo = teclaPorCode(alvo)?.dedo;
        const msg = `Quase! Procure a tecla ${nomeTecla(alvo)}${r.esperado.shift ? " com Shift" : ""}${dedo ? `, com o ${NOME_DEDO[dedo]}` : ""}.`;
        setErroMsg(msg);
        setAnuncio(msg);
        if (!mudoRef.current) tocarSom("erro");
      }
      setTick((t) => t + 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [motor, payload, intro, submeter]);

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash((f) => (f && f.n === flash.n ? null : f)), 380);
    return () => clearTimeout(t);
  }, [flash]);

  function reiniciar() {
    setPayload(null); setResultado(null); setErroMsg(null); setFlash(null); setAnuncio(""); setCalor({});
    enviar.reset();
    setRodada((r) => r + 1);
  }

  const chars = useMemo(() => [...licao.textoAlvo], [licao.textoAlvo]);
  const idx = motor.indiceCaractere;
  const toque = motor.proximoToque;
  const alvos: string[] = [];
  const dedos: Dedo[] = [];
  if (toque) {
    alvos.push(toque.code);
    const d = teclaPorCode(toque.code)?.dedo;
    if (d) dedos.push(d);
    if (toque.shift) {
      const s = codeDoShift(toque.code);
      alvos.push(s);
      const ds = teclaPorCode(s)?.dedo;
      if (ds && !dedos.includes(ds)) dedos.push(ds);
    }
  }
  const progresso = Math.round((idx / chars.length) * 100);

  const live = <div className="sr-only" aria-live="assertive" role="status" data-testid="status-anuncio">{anuncio}</div>;

  if (intro) {
    return (
      <div className="space-y-4 min-w-0">
        {voltar}
        <PosicaoMaos onComecar={() => setIntro(false)} />
      </div>
    );
  }

  if (payload) {
    return (
      <div className="space-y-5">
        {live}
        {voltar}
        {resultado ? (
          <TelaResultado r={resultado} licao={licao} calor={calor} proximaId={proximaId} onDeNovo={reiniciar} />
        ) : enviar.isError ? (
          <div className="chunky rounded-3xl bg-card p-8 text-center" role="status" aria-live="polite">
            <Pintinho tamanho={90} feliz={false} className="mx-auto" />
            <p className="mt-3 font-display text-2xl font-extrabold">Você terminou! Só falta guardar seus pontos.</p>
            <p className="text-muted-foreground">A internet tropeçou no caminho. Seu resultado está guardadinho aqui.</p>
            <button onClick={() => submeter(payload)} data-testid="button-reenviar" className="chunky-btn mt-5 inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-3 font-bold text-lg">
              <RefreshCw className="h-5 w-5" aria-hidden="true" />Tentar enviar de novo
            </button>
          </div>
        ) : (
          <div className="chunky rounded-3xl bg-card p-8 text-center" aria-busy="true">
            <Galo tamanho={110} className="mx-auto bob" />
            <p className="mt-3 font-display text-2xl font-extrabold">Contando as espigas...</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4 min-w-0" onPaste={(e) => e.preventDefault()} onDrop={(e) => e.preventDefault()}>
      {live}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {voltar}
        <div className="flex items-center gap-2">
          {licao.semOlharDisponivel && (
            <button onClick={() => setSemOlhar((v) => !v)} aria-pressed={semOlhar} data-testid="button-sem-olhar"
              className={cn("inline-flex items-center gap-2 rounded-xl border-[3px] border-foreground px-3 py-2 font-bold", semOlhar ? "bg-foreground text-background" : "bg-card")}>
              {semOlhar ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}Sem olhar
            </button>
          )}
          {licao.ordem === 1 && (
            <button onClick={() => setIntro(true)} data-testid="button-ver-posicao"
              className="inline-flex items-center gap-2 rounded-xl border-[3px] border-foreground bg-card px-3 py-2 font-bold">
              <Hand className="h-5 w-5" aria-hidden="true" />Ver posição das mãos
            </button>
          )}
          <button onClick={() => { setMudo((m) => { salvarMudo(!m); return !m; }); }} aria-pressed={mudo} aria-label={mudo ? "Ligar som" : "Desligar som"} data-testid="button-mudo"
            className="inline-flex items-center rounded-xl border-[3px] border-foreground bg-card p-2">
            {mudo ? <VolumeX className="h-6 w-6" aria-hidden="true" /> : <Volume2 className="h-6 w-6" aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div>
        <p className="font-bold text-secondary">Lição {licao.ordem} · teclas <span className="font-mono">{licao.teclasFoco}</span></p>
        <h1 className="font-display text-2xl sm:text-4xl font-extrabold" data-testid="text-titulo-licao">{licao.titulo}</h1>
      </div>

      <section className="chunky rounded-3xl bg-card p-4 sm:p-6 min-w-0" aria-label="Texto para digitar">
        <div className="h-3 rounded-full bg-muted border-2 border-foreground overflow-hidden mb-4" role="progressbar" aria-valuenow={progresso} aria-valuemin={0} aria-valuemax={100} aria-label="Progresso">
          <div className="h-full bg-accent origin-left transition-transform duration-200" style={{ transform: `scaleX(${progresso / 100})` }} />
        </div>
        <p className="font-mono text-[clamp(1.5rem,5vw,2.6rem)] leading-[1.6] tracking-wide break-words select-none" data-testid="text-alvo" aria-label={licao.textoAlvo}>
          {chars.map((c, i) => (
            <span key={i} aria-hidden="true" className={cn("rounded-md px-[1px]",
              i < idx && "text-secondary",
              i === idx && (erroMsg ? "bg-[#F6B3AA] outline outline-[3px] outline-primary" : "bg-accent outline outline-[3px] outline-foreground"),
              i > idx && "text-foreground/55")}>
              {c === " " ? (i === idx ? "\u2423" : "\u00a0") : c}
            </span>
          ))}
        </p>
        <div className="min-h-[3rem] mt-3">
          {erroMsg ? (
            <p className="inline-flex items-center gap-2 rounded-xl bg-[#FCE1DC] border-2 border-primary px-3 py-2 font-bold rise" data-testid="text-erro">
              <X className="h-5 w-5 shrink-0 rounded-full bg-primary text-primary-foreground p-0.5" aria-hidden="true" />{erroMsg}
            </p>
          ) : idx === 0 ? (
            <p className="font-semibold text-muted-foreground">Dedos na fileira do meio (as teclas F e J têm um risquinho). Comece quando quiser!</p>
          ) : toque?.morta ? (
            <p className="font-semibold">Primeiro o acento, depois a letra.</p>
          ) : null}
        </div>
      </section>

      <Maos dedos={dedos} />
      <TecladoVirtual alvos={alvos} flash={flash} semOlhar={semOlhar} rotuloAria={toque ? "Próxima tecla: " + nomeTecla(toque.code) + (toque.shift ? " com " + nomeTecla(codeDoShift(toque.code)) : "") : "Teclado virtual"} />
    </div>
  );
}

function TelaResultado({ r, licao, calor, proximaId, onDeNovo }: { r: ResultadoLicao; licao: Licao; calor: Record<string, number>; proximaId?: number; onDeNovo: () => void }) {
  const temErros = Object.keys(calor).length > 0;
  return (
    <div className="space-y-5 min-w-0">
      <section className="chunky rounded-3xl bg-sidebar text-sidebar-foreground p-5 sm:p-8 text-center relative overflow-hidden rise">
        {r.estrelas >= 2 ? <Galo tamanho={110} className="mx-auto bob" /> : <Pintinho tamanho={100} className="mx-auto bob" />}
        <p className="mt-2 font-bold text-accent">{licao.titulo}</p>
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold" data-testid="text-mensagem">{r.mensagem}</h1>
        <div className="mt-4 flex justify-center pop"><Estrelas n={r.estrelas} tamanho="h-12 w-12" /></div>
        {r.melhorou && <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-accent text-accent-foreground px-3 py-1 font-bold"><Sparkles className="h-4 w-4" aria-hidden="true" />Novo recorde seu!</p>}
      </section>

      {(r.subiuDeNivel || r.proximaLicaoDesbloqueada) && (
        <div className="grid gap-3 sm:grid-cols-2">
          {r.subiuDeNivel && <div className="chunky rounded-2xl bg-accent p-4 font-bold text-lg pop" data-testid="text-subiu-nivel">Você subiu de nível! Agora você é <span className="font-display text-2xl font-extrabold">{r.nivel}</span></div>}
          {r.proximaLicaoDesbloqueada && <div className="chunky rounded-2xl bg-secondary text-secondary-foreground p-4 font-bold text-lg pop" data-testid="text-proxima-desbloqueada">Uma nova lição abriu a porteira!</div>}
        </div>
      )}

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3" aria-label="Seus números">
        {[
          { t: "Velocidade", v: r.wpm + " ppm", i: Gauge, id: "wpm" },
          { t: "Precisão", v: r.precisao + "%", i: Target, id: "precisao" },
          { t: "Pontos ganhos", v: "+" + r.pontosGanhos, i: Sparkles, id: "pontos" },
          { t: "Nível", v: r.nivel, i: Hand, id: "nivel" },
        ].map((c) => (
          <div key={c.id} className="chunky rounded-2xl bg-card p-4 min-w-0">
            <p className="text-sm font-bold text-muted-foreground flex items-center gap-1"><c.i className="h-4 w-4" aria-hidden="true" />{c.t}</p>
            <p className="font-mono text-2xl sm:text-3xl font-bold break-words" data-testid={"text-resultado-" + c.id}>{c.v}</p>
          </div>
        ))}
      </section>
      <p className="text-sm text-muted-foreground -mt-2">Total: <span className="font-mono font-bold">{r.pontosTotais.toLocaleString("pt-BR")}</span> pontos</p>

      <section className="chunky rounded-2xl bg-card p-4 sm:p-5">
        <h2 className="font-display text-xl font-extrabold">Trabalho das mãos</h2>
        <div className="mt-3 flex h-10 rounded-xl border-[3px] border-foreground overflow-hidden font-bold text-sm">
          <div className="bg-[#FBE6B8] grid place-items-center min-w-0" style={{ width: Math.max(r.esquerdaPct, 12) + "%" }} data-testid="text-esquerda-pct">Esq. {r.esquerdaPct}%</div>
          <div className="bg-[#D2EEDF] grid place-items-center min-w-0 flex-1 border-l-[3px] border-foreground" data-testid="text-direita-pct">Dir. {r.direitaPct}%</div>
        </div>
        {r.desequilibrada !== "nenhuma" && (
          <p className="mt-3 rounded-xl bg-accent/40 p-3 font-semibold" data-testid="text-aviso-equilibrio">
            A mão {r.desequilibrada} trabalhou bem mais desta vez. Tudo bem! Quando der, deixe cada mão cuidar das teclas do seu lado.
          </p>
        )}
        <p className="mt-2 text-sm text-muted-foreground">Esses números são só uma pista para treinar, não uma nota.</p>
      </section>

      <section className="chunky rounded-2xl bg-card p-4 sm:p-5 min-w-0">
        <h2 className="font-display text-xl font-extrabold">Onde os dedos tropeçaram</h2>
        <p className="text-muted-foreground mb-3">{temErros ? "Quanto mais vermelha a tecla, mais vezes ela escapou. Elas são ótimas para treinar!" : "Nenhum tropeço! Todas as teclas no lugar certo."}</p>
        <TecladoVirtual calor={calor} rotuloAria={"Mapa de erros: " + (Object.entries(calor).map(([c, n]) => nomeTecla(c) + " " + n).join(", ") || "nenhum erro")} />
      </section>

      <p className="flex gap-3 items-start rounded-2xl bg-muted p-4 font-semibold" data-testid="text-dica"><Lightbulb className="h-6 w-6 shrink-0 text-primary" aria-hidden="true" />{r.dica}</p>

      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={onDeNovo} data-testid="button-tentar-de-novo" className="chunky-btn inline-flex justify-center items-center gap-2 rounded-xl bg-card px-5 py-3 font-bold text-lg">
          <RotateCcw className="h-5 w-5" aria-hidden="true" />Tentar de novo
        </button>
        {proximaId !== undefined && (r.estrelas > 0 || r.proximaLicaoDesbloqueada) && (
          <Link href={"/aulas/" + proximaId} data-testid="link-proxima-licao" className="chunky-btn inline-flex justify-center items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-3 font-bold text-lg">
            Próxima lição<ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        )}
        <Link href="/aulas" data-testid="link-trilha" className="chunky-btn inline-flex justify-center items-center gap-2 rounded-xl bg-accent px-5 py-3 font-bold text-lg">
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />Voltar à trilha
        </Link>
      </div>
    </div>
  );
}
