import { Link } from "wouter";
import { Lock, Star, Keyboard, RefreshCw, ArrowRight, Gauge, Target } from "lucide-react";
import { useListarLicoes } from "@workspace/api-client-react";
import { useTecladoFisico } from "@/hooks/use-sessao";
import { Espiga, Pintinho } from "@/components/milharal";
import { cn } from "@/lib/utils";

export function Estrelas({ n, tamanho = "h-5 w-5" }: { n: number; tamanho?: string }) {
  return (
    <span className="inline-flex gap-0.5" role="img" aria-label={n + " de 3 estrelas"}>
      {[0, 1, 2].map((i) => (
        <Star key={i} aria-hidden="true" className={cn(tamanho, i < n ? "fill-accent text-foreground" : "text-foreground/30")} strokeWidth={2.5} />
      ))}
    </span>
  );
}

export function AvisoTeclado() {
  return (
    <div role="status" aria-live="polite" data-testid="status-sem-teclado" className="chunky rounded-2xl bg-accent p-4 flex gap-3 items-start font-bold text-lg rise">
      <Keyboard className="h-7 w-7 shrink-0" aria-hidden="true" />
      <span>Para treinar as lições, use um computador com teclado. Aqui dá para espiar a trilha!</span>
    </div>
  );
}

export default function Aulas() {
  const temTeclado = useTecladoFisico();
  const q = useListarLicoes();
  const licoes = q.data ?? [];
  const feitas = licoes.filter((l) => l.estrelas > 0).length;
  const atual = licoes.find((l) => l.desbloqueada && l.estrelas === 0);

  return (
    <div className="space-y-6">
      <header className="chunky rounded-3xl bg-secondary text-secondary-foreground p-5 sm:p-7 flex items-center gap-4 rise overflow-hidden">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-accent">A trilha do milharal</p>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold leading-tight">Aulas</h1>
          <p className="mt-1 opacity-90">Uma lição de cada vez, até os dez dedos acharem suas casas.</p>
          {licoes.length > 0 && <p className="mt-3 font-mono font-bold" data-testid="text-progresso-trilha">{feitas}/{licoes.length} espigas colhidas</p>}
        </div>
        <Pintinho tamanho={96} className="bob shrink-0 hidden sm:block" />
      </header>

      {!temTeclado && <AvisoTeclado />}

      {q.isLoading && (
        <div className="space-y-4" aria-busy="true" aria-label="Carregando lições">
          {[0, 1, 2, 3].map((i) => <div key={i} className="h-24 rounded-2xl bg-muted animate-pulse" />)}
        </div>
      )}

      {q.isError && (
        <div className="chunky rounded-2xl bg-card p-6 text-center" role="status">
          <p className="font-display text-2xl font-extrabold">A trilha sumiu no meio do milho</p>
          <p className="text-muted-foreground">Não conseguimos carregar as lições agora.</p>
          <button onClick={() => q.refetch()} data-testid="button-recarregar-licoes" className="chunky-btn mt-4 inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-3 font-bold">
            <RefreshCw className="h-5 w-5" aria-hidden="true" />Tentar de novo
          </button>
        </div>
      )}

      {q.isSuccess && licoes.length === 0 && (
        <div className="chunky rounded-2xl bg-card p-8 text-center"><Espiga tamanho={56} className="mx-auto" /><p className="mt-3 font-display text-2xl font-extrabold">O milho ainda está brotando. Volte logo!</p></div>
      )}

      <ol className="relative space-y-4 before:absolute before:left-[27px] before:top-4 before:bottom-4 before:border-l-[4px] before:border-dashed before:border-foreground/30">
        {[...licoes].sort((a, b) => a.ordem - b.ordem).map((l, i) => {
          const eAtual = atual?.id === l.id;
          const conteudo = (
            <>
              <span className={cn("relative z-10 grid place-items-center w-14 h-14 shrink-0 rounded-full border-[3px] border-foreground font-display text-2xl font-extrabold",
                !l.desbloqueada ? "bg-muted text-muted-foreground" : l.estrelas > 0 ? "bg-accent" : "bg-primary text-primary-foreground")}>
                {l.desbloqueada ? l.ordem : <Lock className="h-6 w-6" aria-hidden="true" />}
              </span>
              <span className="flex-1 min-w-0">
                <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-display text-xl sm:text-2xl font-extrabold">{l.titulo}</span>
                  {eAtual && <span className="rounded-full bg-primary text-primary-foreground px-3 py-0.5 text-sm font-bold">próxima</span>}
                </span>
                <span className="block text-muted-foreground font-semibold">{l.desbloqueada ? l.descricao : "Complete a lição anterior para abrir esta."}</span>
                <span className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-bold">
                  <span className="font-mono rounded-md bg-muted px-2 py-0.5 border-2 border-foreground/20">{l.teclasFoco}</span>
                  <Estrelas n={l.estrelas} />
                  {l.melhorWpm > 0 && <span className="inline-flex items-center gap-1"><Gauge className="h-4 w-4" aria-hidden="true" />{l.melhorWpm} ppm</span>}
                  {l.melhorPrecisao > 0 && <span className="inline-flex items-center gap-1"><Target className="h-4 w-4" aria-hidden="true" />{l.melhorPrecisao}%</span>}
                </span>
              </span>
              {l.desbloqueada && <ArrowRight className="h-6 w-6 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />}
            </>
          );
          return (
            <li key={l.id} className="rise" style={{ animationDelay: i * 0.05 + "s" }}>
              {l.desbloqueada ? (
                <Link href={"/aulas/" + l.id} data-testid={"card-licao-" + l.id}
                  className={cn("group chunky-btn flex items-center gap-4 rounded-2xl p-3 sm:p-4", eAtual ? "bg-accent/40" : "bg-card", i % 2 ? "sm:ml-10" : "")}>
                  {conteudo}
                </Link>
              ) : (
                <div data-testid={"card-licao-" + l.id} aria-disabled="true" className={cn("flex items-center gap-4 rounded-2xl p-3 sm:p-4 border-[3px] border-dashed border-foreground/30 bg-card/60 opacity-80", i % 2 ? "sm:ml-10" : "")}>
                  {conteudo}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
