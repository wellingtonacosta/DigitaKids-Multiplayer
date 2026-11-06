import { Star, Flame, Gauge, Target, Flag, Trophy, BookOpen, RefreshCw, Medal, Lock } from "lucide-react";
import { useObterPerfil, getObterPerfilQueryKey } from "@workspace/api-client-react";
import { Avatar } from "@/components/avatar-jogador";
import { Galo, Pintinho } from "@/components/milharal";
import { SeloMedalha, dataBR } from "@/components/medalhas";
import { cn } from "@/lib/utils";

export default function Perfil() {
  const q = useObterPerfil({ query: { queryKey: getObterPerfilQueryKey() } });

  if (q.isLoading) return (
    <div className="space-y-5" aria-busy="true" aria-label="Carregando perfil">
      <div className="h-44 rounded-3xl bg-muted animate-pulse" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">{[0, 1, 2, 3].map((i) => <div key={i} className="h-24 rounded-2xl bg-muted animate-pulse" />)}</div>
      <div className="h-64 rounded-3xl bg-muted animate-pulse" />
    </div>
  );
  if (q.isError || !q.data) return (
    <div className="chunky rounded-2xl bg-card p-6 text-center" role="status">
      <Pintinho tamanho={80} feliz={false} className="mx-auto" />
      <p className="font-display text-2xl font-extrabold">Seu perfil foi dar uma voltinha</p>
      <p className="text-muted-foreground">Não conseguimos carregar agora.</p>
      <button onClick={() => q.refetch()} data-testid="button-recarregar-perfil" className="chunky-btn mt-4 inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-3 font-bold">
        <RefreshCw className="h-5 w-5" aria-hidden="true" />Tentar de novo
      </button>
    </div>
  );

  const p = q.data;
  const falta = p.pontosProximoNivel;
  const pct = falta === null ? 100 : Math.max(4, Math.min(100, Math.round((p.pontosTotais / Math.max(1, p.pontosTotais + falta)) * 100)));
  const ganhas = p.medalhas.filter((m) => m.conquistada);
  const trancadas = p.medalhas.filter((m) => !m.conquistada);
  const pctTrilha = p.totalLicoes ? Math.round((p.licoesConcluidas / p.totalLicoes) * 100) : 0;

  const recordes = [
    { t: "Pontos", v: p.pontosTotais.toLocaleString("pt-BR"), i: Star, id: "pontos", c: "bg-accent" },
    { t: "Sequência", v: p.sequenciaDias + (p.sequenciaDias === 1 ? " dia" : " dias"), i: Flame, id: "sequencia", c: "bg-card" },
    { t: "Melhor velocidade", v: p.melhorWpm + " ppm", i: Gauge, id: "wpm", c: "bg-card" },
    { t: "Melhor precisão", v: p.melhorPrecisao + "%", i: Target, id: "precisao", c: "bg-card" },
  ];

  return (
    <div className="space-y-6 min-w-0">
      <section aria-labelledby="titulo-perfil" className="chunky rounded-3xl bg-sidebar text-sidebar-foreground p-5 sm:p-8 flex flex-col sm:flex-row gap-5 sm:items-center rise relative overflow-hidden">
        <Galo tamanho={120} className="hidden md:block absolute -right-2 -bottom-4" />
        <Avatar chave={p.avatar} tamanho={104} className="bob border-accent" />
        <div className="flex-1 min-w-0 md:pr-28">
          <p className="font-bold text-accent">No milharal desde {dataBR(p.entrouEm)}</p>
          <h1 id="titulo-perfil" className="font-display text-3xl sm:text-5xl font-extrabold break-words" data-testid="text-apelido">{p.apelido}</h1>
          <p className="mt-1 font-display text-2xl font-extrabold" data-testid="text-nivel">{p.nivel}</p>
          <div className="mt-3 h-4 rounded-full bg-sidebar-accent border-2 border-sidebar-foreground overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Progresso até o próximo nível">
            <div className="h-full bg-accent origin-left" style={{ transform: `scaleX(${pct / 100})` }} />
          </div>
          <p className="mt-1 text-sm font-semibold opacity-90" data-testid="text-proximo-nivel">
            {falta !== null && p.proximoNivel ? `Faltam ${falta.toLocaleString("pt-BR")} pontos para virar ${p.proximoNivel}` : "Você chegou ao topo do milharal!"}
          </p>
        </div>
      </section>

      <section aria-label="Seus recordes">
        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {recordes.map((c, i) => (
            <li key={c.id} className={cn("chunky rounded-2xl p-4 min-w-0 rise", c.c)} style={{ animationDelay: 0.06 * i + "s" }}>
              <p className="text-sm font-bold flex items-center gap-1"><c.i className="h-4 w-4 shrink-0" aria-hidden="true" />{c.t}</p>
              <p className="font-mono text-xl sm:text-3xl font-bold break-words" data-testid={"text-recorde-" + c.id}>{c.v}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <section aria-labelledby="titulo-trilha" className="chunky rounded-2xl bg-secondary text-secondary-foreground p-5 min-w-0">
          <h2 id="titulo-trilha" className="font-display text-xl font-extrabold flex items-center gap-2"><BookOpen className="h-5 w-5" aria-hidden="true" />Trilha</h2>
          <p className="mt-1 font-mono text-3xl font-bold" data-testid="text-licoes">{p.licoesConcluidas}/{p.totalLicoes}<span className="font-sans text-base ml-2">lições</span></p>
          <div className="mt-2 h-3 rounded-full bg-secondary-foreground/25 border-2 border-foreground overflow-hidden" role="progressbar" aria-valuenow={pctTrilha} aria-valuemin={0} aria-valuemax={100} aria-label="Lições concluídas">
            <div className="h-full bg-accent origin-left" style={{ transform: `scaleX(${pctTrilha / 100})` }} />
          </div>
          <p className="mt-2 font-semibold flex items-center gap-1" data-testid="text-estrelas"><Star className="h-4 w-4 fill-accent" aria-hidden="true" />{p.estrelasTotais} estrelas colhidas</p>
        </section>
        <section aria-labelledby="titulo-corridas" className="chunky rounded-2xl bg-card p-5 min-w-0">
          <h2 id="titulo-corridas" className="font-display text-xl font-extrabold flex items-center gap-2"><Flag className="h-5 w-5 text-primary" aria-hidden="true" />Corridas</h2>
          <dl className="mt-1 grid grid-cols-3 gap-2">
            <div><dt className="text-sm font-bold text-muted-foreground">Disputadas</dt><dd className="font-mono text-2xl font-bold" data-testid="text-corridas">{p.corridasDisputadas}</dd></div>
            <div><dt className="text-sm font-bold text-muted-foreground">Vitórias</dt><dd className="font-mono text-2xl font-bold" data-testid="text-vitorias">{p.vitorias}</dd></div>
            <div><dt className="text-sm font-bold text-muted-foreground flex items-center gap-1"><Trophy className="h-3.5 w-3.5" aria-hidden="true" />Ranking</dt><dd className="font-mono text-2xl font-bold" data-testid="text-posicao">{p.posicaoPontos > 0 ? p.posicaoPontos + "º" : "-"}</dd></div>
          </dl>
        </section>
      </div>

      <section aria-labelledby="titulo-medalhas" className="space-y-4">
        <h2 id="titulo-medalhas" className="font-display text-2xl font-extrabold flex items-center gap-2"><Medal className="h-6 w-6 text-primary" aria-hidden="true" />Medalhas <span className="font-mono text-lg" data-testid="text-total-medalhas">{ganhas.length}/{p.medalhas.length}</span></h2>
        {p.medalhas.length === 0 ? (
          <p className="chunky rounded-2xl bg-card p-5 font-semibold">As medalhas ainda estão sendo forjadas. Volte logo!</p>
        ) : (
          <>
            {ganhas.length === 0 && <p className="rounded-2xl bg-muted p-4 font-semibold" data-testid="text-sem-medalhas">Sua primeira medalha está bem pertinho. Termine uma lição para começar a coleção!</p>}
            <ul className="grid gap-3 sm:grid-cols-2" aria-label="Coleção de medalhas">
              {[...ganhas, ...trancadas].map((m, i) => (
                <li key={m.chave} data-testid={"card-medalha-" + m.chave} className={cn("rounded-2xl p-4 flex gap-3 items-center min-w-0 rise",
                  m.conquistada ? "chunky bg-card" : "border-[3px] border-dashed border-foreground/35 bg-card/60")} style={{ animationDelay: Math.min(i, 10) * 0.04 + "s" }}>
                  <SeloMedalha m={m} />
                  <div className="min-w-0">
                    <p className="font-display text-lg font-extrabold break-words">{m.titulo}
                      <span className="sr-only">{m.conquistada ? " (conquistada)" : " (ainda bloqueada)"}</span></p>
                    <p className={cn("text-sm font-semibold", m.conquistada ? "" : "text-muted-foreground")}>
                      {!m.conquistada && <Lock className="inline h-3.5 w-3.5 mr-1 -mt-0.5" aria-hidden="true" />}{m.conquistada ? m.descricao : "Como ganhar: " + m.descricao}
                    </p>
                    {m.conquistada && m.conquistadaEm && <p className="text-xs font-bold text-secondary mt-0.5">Ganhou em {dataBR(m.conquistadaEm)}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </div>
  );
}
