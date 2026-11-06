import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useParams } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Copy, Check, X, LogOut, Play, RotateCcw, Volume2, VolumeX, WifiOff, Crown, Gauge, Target, Sparkles, Hourglass, Users, Info } from "lucide-react";
import { getObterJogadorAtualQueryKey } from "@workspace/api-client-react";
import { MotorDigitacao, CONTAGEM_SEGUNDOS, SALA_MIN, SALA_MAX, type EstadoSala, type JogadorSala } from "@workspace/typing-core";
import { useSessao, useTecladoFisico } from "@/hooks/use-sessao";
import { useSala, salaApi, agoraServidor } from "@/hooks/use-sala";
import { Avatar } from "@/components/avatar-jogador";
import { Galo, Pintinho, Espiga, Cerca } from "@/components/milharal";
import { AvisoTeclado } from "@/pages/aulas";
import { lerMudo, salvarMudo, tocarSom } from "@/lib/dedos";
import { cn } from "@/lib/utils";

const btn = "chunky-btn inline-flex justify-center items-center gap-2 rounded-xl px-5 py-3 font-bold text-lg disabled:opacity-60";

export default function SalaPagina() {
  const { codigo: bruto } = useParams<{ codigo: string }>();
  const codigo = (bruto ?? "").toUpperCase();
  const { estado, erroConexao } = useSala();
  const { jogador } = useSessao();
  const temTeclado = useTecladoFisico();
  const [erro, setErro] = useState<string | null>(null);
  const [, go] = useLocation();

  useEffect(() => {
    let vivo = true;
    setErro(null);
    salaApi.entrar(codigo).then((r) => { if (vivo && !r.ok) setErro(r.erro); });
    return () => { vivo = false; salaApi.sair(); };
  }, [codigo]);

  const voltar = (
    <Link href="/corridas" data-testid="link-voltar-corridas" className="inline-flex items-center gap-2 font-bold hover:underline">
      <ArrowLeft className="h-5 w-5" aria-hidden="true" />Voltar às corridas
    </Link>
  );

  const falha = erro ?? (!estado ? erroConexao : null);
  if (falha) return (
    <div className="space-y-4">{voltar}
      <div className="chunky rounded-3xl bg-card p-8 text-center" role="alert">
        <Pintinho tamanho={90} feliz={false} className="mx-auto" />
        <p className="mt-3 font-display text-2xl font-extrabold" data-testid="text-erro-sala">{falha}</p>
        <p className="text-muted-foreground">Tudo bem! Dá para criar outra sala ou entrar com outro código.</p>
        <Link href="/corridas" className={cn(btn, "mt-5 bg-primary text-primary-foreground")} data-testid="link-erro-voltar">Ir para as corridas</Link>
      </div>
    </div>
  );
  if (!estado || estado.codigo !== codigo || !jogador) return (
    <div className="space-y-4" aria-busy="true">{voltar}
      <div className="h-28 rounded-3xl bg-muted animate-pulse" /><div className="h-64 rounded-3xl bg-muted animate-pulse" />
    </div>
  );

  const eu = estado.jogadores.find((j) => j.id === jogador.id);
  const sair = async () => { await salaApi.sair(); go("/corridas"); };

  return (
    <div className="space-y-5 min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {voltar}
        <button onClick={sair} data-testid="button-sair-sala" className="inline-flex items-center gap-2 rounded-xl border-[3px] border-foreground bg-card px-3 py-2 font-bold">
          <LogOut className="h-5 w-5" aria-hidden="true" />Sair da sala
        </button>
      </div>
      {!temTeclado && estado.status === "lobby" && <AvisoTeclado />}
      {estado.status === "lobby" && <Lobby estado={estado} eu={eu} />}
      {(estado.status === "contagem" || estado.status === "corrida") && <Corrida key={estado.rodada} estado={estado} meuId={jogador.id} />}
      {estado.status === "fim" && <Podio estado={estado} eu={eu} />}
    </div>
  );
}

function Lobby({ estado, eu }: { estado: EstadoSala; eu?: JogadorSala }) {
  const [copiado, setCopiado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const link = window.location.origin + import.meta.env.BASE_URL.replace(/\/$/, "") + "/sala/" + estado.codigo;
  const conectados = estado.jogadores.filter((j) => j.conectado);
  const outrosProntos = conectados.filter((j) => !j.anfitriao).every((j) => j.pronto);
  const podeIniciar = conectados.length >= SALA_MIN && outrosProntos;
  const copiar = async () => { try { await navigator.clipboard.writeText(link); setCopiado(true); setTimeout(() => setCopiado(false), 2000); } catch { setErro("Não deu para copiar. Mostre o código para seus amigos!"); } };
  const acao = async (p: Promise<{ ok: boolean; erro?: string }>) => { setErro(null); const r = await p; if (!r.ok) setErro(r.erro ?? "Algo deu errado."); };

  return (
    <div className="space-y-5 min-w-0">
      <section className="chunky rounded-3xl bg-sidebar text-sidebar-foreground p-5 sm:p-7 rise overflow-hidden">
        <p className="font-bold text-accent">Sala de espera</p>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold break-words" data-testid="text-nome-sala">{estado.nome}</h1>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="rounded-2xl bg-accent text-accent-foreground border-[3px] border-foreground px-4 py-2 font-mono text-3xl sm:text-4xl font-bold tracking-[0.3em]" data-testid="text-codigo-sala">{estado.codigo}</span>
          <button onClick={copiar} data-testid="button-copiar-link" className={cn(btn, "bg-card text-foreground text-base")}>
            {copiado ? <Check className="h-5 w-5" aria-hidden="true" /> : <Copy className="h-5 w-5" aria-hidden="true" />}{copiado ? "Link copiado!" : "Copiar link"}
          </button>
        </div>
        <p className="mt-3 opacity-90">Mande o código ou o link para a turma. Cabem até {SALA_MAX} jogadores.</p>
      </section>

      <section className="chunky rounded-3xl bg-card p-4 sm:p-6 min-w-0">
        <h2 className="font-display text-xl font-extrabold flex items-center gap-2"><Users className="h-5 w-5" aria-hidden="true" />Na porteira ({estado.jogadores.length}/{SALA_MAX})</h2>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2 min-w-0">
          {estado.jogadores.map((j) => (
            <li key={j.id} data-testid={"card-jogador-" + j.id} className={cn("flex items-center gap-3 rounded-2xl border-[3px] border-foreground p-3 min-w-0", j.pronto || j.anfitriao ? "bg-[#D2EEDF]" : "bg-background", !j.conectado && "opacity-60 border-dashed")}>
              <Avatar chave={j.avatar} tamanho={44} />
              <div className="min-w-0 flex-1">
                <p className="font-bold truncate">{j.apelido}{j.id === eu?.id && " (você)"}</p>
                <p className="text-sm font-semibold flex items-center gap-1">
                  {!j.conectado ? <><WifiOff className="h-4 w-4" aria-hidden="true" />Desconectado</> : j.anfitriao ? <><Crown className="h-4 w-4" aria-hidden="true" />Anfitrião</> : j.pronto ? <><Check className="h-4 w-4" aria-hidden="true" />Pronto!</> : <><Hourglass className="h-4 w-4" aria-hidden="true" />Se preparando</>}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {erro && <p role="alert" className="rounded-xl bg-[#FCE1DC] border-2 border-primary px-3 py-2 font-bold" data-testid="text-erro-lobby">{erro}</p>}

      {eu?.anfitriao ? (
        <div className="space-y-2">
          <button disabled={!podeIniciar} onClick={() => acao(salaApi.iniciar())} data-testid="button-iniciar" className={cn(btn, "w-full sm:w-auto bg-primary text-primary-foreground text-xl")}>
            <Play className="h-6 w-6" aria-hidden="true" />Dar a largada
          </button>
          {!podeIniciar && <p className="font-semibold text-muted-foreground" data-testid="text-aguardando">{conectados.length < SALA_MIN ? "Esperando mais alguém entrar na sala." : "Esperando todo mundo ficar pronto."}</p>}
        </div>
      ) : eu && (
        <button onClick={() => acao(salaApi.pronto(!eu.pronto))} aria-pressed={eu.pronto} data-testid="button-pronto" className={cn(btn, "w-full sm:w-auto text-xl", eu.pronto ? "bg-secondary text-secondary-foreground" : "bg-accent text-accent-foreground")}>
          <Check className="h-6 w-6" aria-hidden="true" />{eu.pronto ? "Estou pronto! (desfazer)" : "Estou pronto"}
        </button>
      )}
      <Cerca className="opacity-80" />
    </div>
  );
}

function Pista({ j, total, eu }: { j: JogadorSala; total: number; eu: boolean }) {
  const pct = total ? Math.min(1, j.indice / total) : 0;
  return (
    <li data-testid={"pista-jogador-" + j.id} className={cn("rounded-2xl border-[3px] border-foreground p-2 sm:p-3 min-w-0", eu ? "bg-accent/40" : "bg-card", !j.conectado && "opacity-55 border-dashed")}>
      <div className="flex items-center gap-2 min-w-0 text-sm font-bold">
        <Avatar chave={j.avatar} tamanho={28} />
        <span className="truncate flex-1 min-w-0">{j.apelido}{eu && " (você)"}</span>
        {!j.conectado ? <span className="inline-flex items-center gap-1"><WifiOff className="h-4 w-4" aria-hidden="true" />desconectado</span>
          : <span className="font-mono shrink-0">{j.wpm} ppm · {j.precisao}%</span>}
      </div>
      <div className="relative mt-2 h-10 rounded-xl bg-[#E9DDB8] palha border-2 border-foreground/40 overflow-hidden">
        <div className="absolute inset-y-0 right-2 grid place-items-center"><Espiga tamanho={30} /></div>
        <div className="absolute inset-y-0 left-0 right-12">
          <div className="h-full transition-transform duration-300 ease-out" style={{ transform: `translateX(${pct * 100}%)` }}>
            <Pintinho tamanho={38} feliz={j.conectado} className={cn("-ml-1", j.terminou && "bob")} />
          </div>
        </div>
      </div>
    </li>
  );
}

function Corrida({ estado, meuId }: { estado: EstadoSala; meuId: number }) {
  const texto = estado.texto ?? "";
  const motor = useMemo(() => new MotorDigitacao(texto), [texto]);
  const chars = useMemo(() => [...texto], [texto]);
  const [, setTick] = useState(0);
  const [agora, setAgora] = useState(agoraServidor);
  const [erroMsg, setErroMsg] = useState(false);
  const [mudo, setMudo] = useState(lerMudo);
  const mudoRef = useRef(mudo); mudoRef.current = mudo;
  const inicioEm = estado.inicioEm ?? Infinity;
  const liberado = agora >= inicioEm;

  useEffect(() => {
    if (liberado) return;
    const t = setInterval(() => setAgora(agoraServidor()), 100);
    return () => clearInterval(t);
  }, [liberado]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.ctrlKey || e.metaKey) return;
      if (e.code === "Tab" || e.code === "Escape") return;
      e.preventDefault();
      if (!e.isTrusted || agoraServidor() < inicioEm || motor.terminou) return;
      const r = motor.processar({ code: e.code, key: e.key, shiftKey: e.shiftKey, ctrlKey: e.ctrlKey, metaKey: e.metaKey, altKey: e.altKey, repeat: e.repeat, isTrusted: e.isTrusted });
      if (r.tipo === "ignorado") return;
      if (r.tipo === "acerto") { setErroMsg(false); if (r.terminou && !mudoRef.current) tocarSom("fim"); }
      else { setErroMsg(true); if (!mudoRef.current) tocarSom("erro"); }
      salaApi.progresso({ indice: motor.indiceCaractere, erros: motor.resumo().erros });
      setTick((t) => t + 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [motor, inicioEm]);

  const idx = motor.indiceCaractere;
  const restante = Math.ceil((inicioEm - agora) / 1000);
  const eu = estado.jogadores.find((j) => j.id === meuId);
  const pct = chars.length ? Math.round((idx / chars.length) * 100) : 0;

  return (
    <div className="space-y-4 min-w-0" onPaste={(e) => e.preventDefault()} onDrop={(e) => e.preventDefault()}>
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold truncate min-w-0">{estado.nome}</h1>
        <button onClick={() => setMudo((m) => { salvarMudo(!m); return !m; })} aria-pressed={mudo} aria-label={mudo ? "Ligar som" : "Desligar som"} data-testid="button-mudo"
          className="inline-flex items-center rounded-xl border-[3px] border-foreground bg-card p-2 shrink-0">
          {mudo ? <VolumeX className="h-6 w-6" aria-hidden="true" /> : <Volume2 className="h-6 w-6" aria-hidden="true" />}
        </button>
      </div>

      <ul className="grid gap-2 sm:grid-cols-2 min-w-0" aria-label="Pistas dos jogadores">
        {estado.jogadores.map((j) => <Pista key={j.id} j={j} total={chars.length} eu={j.id === meuId} />)}
      </ul>

      <section className="relative chunky rounded-3xl bg-card p-4 sm:p-6 min-w-0" aria-label="Texto para digitar">
        {!liberado && (
          <div className="absolute inset-0 z-10 grid place-items-center rounded-3xl bg-sidebar/90 text-sidebar-foreground" role="status" aria-live="assertive">
            <div className="text-center">
              <p className="font-bold text-accent">Dedos na fileira do meio...</p>
              <p key={restante} className="font-display text-8xl font-extrabold pop" data-testid="text-contagem">{Math.max(1, Math.min(CONTAGEM_SEGUNDOS, restante))}</p>
            </div>
          </div>
        )}
        <p className="font-mono text-[clamp(1.3rem,4.2vw,2.2rem)] leading-[1.6] tracking-wide break-words select-none" data-testid="text-alvo" aria-label={texto}>
          {chars.map((c, i) => (
            <span key={i} aria-hidden="true" className={cn("rounded-md px-[1px]",
              i < idx && "text-secondary",
              i === idx && (erroMsg ? "bg-[#F6B3AA] outline outline-[3px] outline-primary" : "bg-accent outline outline-[3px] outline-foreground"),
              i > idx && "text-foreground/55")}>
              {c === " " ? (i === idx ? "\u2423" : "\u00a0") : c}
            </span>
          ))}
        </p>
        <div className="min-h-[3rem] mt-3" aria-live="polite">
          {motor.terminou ? (
            <p className="inline-flex items-center gap-2 rounded-xl bg-[#D2EEDF] border-2 border-secondary px-3 py-2 font-bold rise" data-testid="text-terminou">
              <Check className="h-5 w-5" aria-hidden="true" />Você chegou na espiga! Esperando a turma terminar.
            </p>
          ) : erroMsg ? (
            <p className="inline-flex items-center gap-2 rounded-xl bg-[#FCE1DC] border-2 border-primary px-3 py-2 font-bold rise" data-testid="text-erro">
              <X className="h-5 w-5 shrink-0 rounded-full bg-primary text-primary-foreground p-0.5" aria-hidden="true" />Quase! Arrume a letra marcada para seguir.
            </p>
          ) : (
            <p className="font-semibold text-muted-foreground">Seu caminho: <span className="font-mono font-bold text-foreground">{pct}%</span>{eu && eu.wpm > 0 && <> · <span className="font-mono">{eu.precisao}%</span> de precisão</>}</p>
          )}
        </div>
      </section>
    </div>
  );
}

function Podio({ estado, eu }: { estado: EstadoSala; eu?: JogadorSala }) {
  const qc = useQueryClient();
  const [erro, setErro] = useState<string | null>(null);
  useEffect(() => { qc.invalidateQueries({ queryKey: getObterJogadorAtualQueryKey() }); }, [qc, estado.rodada]);
  const ordem = [...estado.jogadores].sort((a, b) => (a.posicao ?? 99) - (b.posicao ?? 99));
  const cores = ["bg-accent", "bg-[#E2E4E7]", "bg-[#F2C9A0]"];
  const deNovo = async () => { setErro(null); const r = await salaApi.jogarDeNovo(); if (!r.ok) setErro(r.erro); };

  return (
    <div className="space-y-5 min-w-0">
      <section className="chunky rounded-3xl bg-sidebar text-sidebar-foreground p-5 sm:p-8 text-center rise overflow-hidden">
        <Galo tamanho={100} className="mx-auto bob" />
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold">Fim da corrida!</h1>
        {eu && (
          <p className="mt-2 font-bold text-lg" data-testid="text-meu-resultado">
            {eu.invalido ? "Seu resultado ficou de fora desta vez." : eu.terminou ? `Você completou o texto e ganhou +${eu.pontos} pontos!` : `Você ganhou +${eu.pontos} pontos. Cada corrida deixa seus dedos mais rápidos!`}
          </p>
        )}
      </section>

      {eu?.invalido && (
        <p className="flex gap-3 items-start rounded-2xl bg-muted p-4 font-semibold" data-testid="text-invalido">
          <Info className="h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
          O juiz do milharal não conseguiu conferir sua corrida (às vezes a velocidade fica estranha ou a conexão tropeça). Sem problema: na próxima ela conta!
        </p>
      )}

      <ol className="space-y-3" aria-label="Pódio">
        {ordem.map((j, i) => (
          <li key={j.id} data-testid={"podio-jogador-" + j.id} className={cn("chunky rounded-2xl p-3 sm:p-4 flex flex-wrap items-center gap-3 min-w-0 rise", j.posicao && j.posicao <= 3 ? cores[j.posicao - 1] : "bg-card", j.id === eu?.id && "outline outline-[3px] outline-primary outline-offset-2")} style={{ animationDelay: i * 0.06 + "s" }}>
            <span className="grid place-items-center w-12 h-12 shrink-0 rounded-full border-[3px] border-foreground bg-card font-display text-2xl font-extrabold">{j.posicao ?? "–"}</span>
            <Avatar chave={j.avatar} tamanho={40} />
            <div className="min-w-0 flex-1">
              <p className="font-bold truncate">{j.apelido}{j.id === eu?.id && " (você)"}</p>
              <p className="text-sm font-semibold">
                {j.invalido ? "Resultado não conferido" : !j.terminou ? (j.conectado ? "Ficou pelo caminho, mas treinou bastante" : "Saiu antes do fim") : j.posicao === 1 ? "Chegou primeiro na espiga!" : "Completou o texto!"}
              </p>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono font-bold text-sm sm:text-base">
              <span className="inline-flex items-center gap-1"><Gauge className="h-4 w-4" aria-hidden="true" />{j.wpm} ppm</span>
              <span className="inline-flex items-center gap-1"><Target className="h-4 w-4" aria-hidden="true" />{j.precisao}%</span>
              <span className="inline-flex items-center gap-1"><Sparkles className="h-4 w-4" aria-hidden="true" />+{j.pontos}</span>
            </div>
          </li>
        ))}
      </ol>

      {erro && <p role="alert" className="rounded-xl bg-[#FCE1DC] border-2 border-primary px-3 py-2 font-bold">{erro}</p>}
      <div className="flex flex-col sm:flex-row gap-3">
        {eu?.anfitriao ? (
          <button onClick={deNovo} data-testid="button-jogar-de-novo" className={cn(btn, "bg-primary text-primary-foreground")}><RotateCcw className="h-5 w-5" aria-hidden="true" />Jogar de novo</button>
        ) : (
          <p className="rounded-2xl bg-muted p-4 font-semibold flex items-center gap-2" data-testid="text-esperando-anfitriao"><Hourglass className="h-5 w-5 shrink-0" aria-hidden="true" />Esperando o anfitrião chamar outra corrida.</p>
        )}
      </div>
    </div>
  );
}
