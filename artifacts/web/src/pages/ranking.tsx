import { useState } from "react";
import { Link } from "wouter";
import { Star, Gauge, RefreshCw, Sprout, BookOpen } from "lucide-react";
import { useObterRanking, getObterRankingQueryKey, type ItemRanking } from "@workspace/api-client-react";
import { Avatar } from "@/components/avatar-jogador";
import { Pintinho, Galo } from "@/components/milharal";
import { useSessao } from "@/hooks/use-sessao";
import { cn } from "@/lib/utils";

type Tipo = "pontos" | "velocidade";
const ABAS: { id: Tipo; t: string; i: typeof Star; d: string }[] = [
  { id: "pontos", t: "Pontos", i: Star, d: "Quem já colheu mais espigas somando tudo." },
  { id: "velocidade", t: "Velocidade", i: Gauge, d: "A melhor marca de palavras por minuto de cada um." },
];
const CORES_PODIO = ["bg-accent", "bg-[#D2EEDF]", "bg-[#FBE6B8]"];

function fmt(v: number, tipo: Tipo) {
  return tipo === "pontos" ? v.toLocaleString("pt-BR") + " pts" : v + " ppm";
}

function Linha({ it, tipo, voce, i }: { it: ItemRanking; tipo: Tipo; voce: boolean; i: number }) {
  const podio = it.posicao <= 3;
  return (
    <li className="rise" style={{ animationDelay: Math.min(i, 12) * 0.04 + "s" }} data-testid={"row-ranking-" + it.jogadorId} aria-current={voce ? "true" : undefined}>
      <div className={cn("flex items-center gap-3 rounded-2xl p-3 min-w-0 border-[3px] border-foreground",
        voce ? "chunky bg-primary text-primary-foreground" : podio ? CORES_PODIO[it.posicao - 1] : "bg-card")}>
        <span className={cn("grid place-items-center h-10 w-10 shrink-0 rounded-full border-[3px] border-foreground font-display text-lg font-extrabold",
          voce ? "bg-accent text-accent-foreground" : "bg-background")} aria-label={"Posição " + it.posicao}>{it.posicao}</span>
        <Avatar chave={it.avatar} tamanho={44} />
        <span className="flex-1 min-w-0">
          <span className="block font-display text-lg font-extrabold truncate">{it.apelido}{voce && <span className="ml-2 text-sm font-sans font-bold">(você)</span>}</span>
          <span className={cn("block text-sm font-semibold truncate", voce ? "opacity-90" : "text-muted-foreground")}>{it.nivel}</span>
        </span>
        <span className="font-mono font-bold text-right shrink-0" data-testid={"text-valor-" + it.jogadorId}>{fmt(it.valor, tipo)}</span>
      </div>
    </li>
  );
}

export default function Ranking() {
  const [tipo, setTipo] = useState<Tipo>("pontos");
  const { jogador } = useSessao();
  const params = { tipo };
  const q = useObterRanking(params, { query: { queryKey: getObterRankingQueryKey(params) } });
  const aba = ABAS.find((a) => a.id === tipo)!;
  const r = q.data;
  const voce = r?.voce ?? null;
  const voceNaLista = !!voce && !!r?.itens.some((x) => x.jogadorId === voce.jogadorId);

  function onKeyAbas(e: React.KeyboardEvent) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const n = tipo === "pontos" ? "velocidade" : "pontos";
    setTipo(n);
    document.getElementById("aba-" + n)?.focus();
  }

  return (
    <div className="space-y-6 min-w-0">
      <header className="chunky rounded-3xl bg-accent text-accent-foreground p-5 sm:p-7 flex items-center gap-4 rise overflow-hidden">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-primary">A turma do milharal</p>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold">Ranking</h1>
          <p className="mt-1 font-semibold">Cada um no seu ritmo. Aqui a gente comemora quem está treinando!</p>
        </div>
        <Galo tamanho={100} className="bob shrink-0 hidden sm:block" />
      </header>

      <div role="tablist" aria-label="Tipo de ranking" className="flex gap-3" onKeyDown={onKeyAbas}>
        {ABAS.map((a) => {
          const sel = a.id === tipo;
          return (
            <button key={a.id} id={"aba-" + a.id} role="tab" aria-selected={sel} aria-controls="painel-ranking" tabIndex={sel ? 0 : -1}
              onClick={() => setTipo(a.id)} data-testid={"tab-ranking-" + a.id}
              className={cn("chunky-btn flex-1 sm:flex-none inline-flex justify-center items-center gap-2 rounded-xl px-4 py-2.5 font-bold text-lg focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary",
                sel ? "bg-secondary text-secondary-foreground" : "bg-card")}>
              <a.i className="h-5 w-5" aria-hidden="true" />{a.t}
            </button>
          );
        })}
      </div>
      <p className="sr-only" aria-live="polite" data-testid="status-aba">Mostrando ranking de {aba.t.toLowerCase()}</p>

      <section id="painel-ranking" role="tabpanel" aria-labelledby={"aba-" + tipo} className="space-y-4 min-w-0">
        <p className="font-semibold text-muted-foreground">{aba.d}{r ? ` ${r.totalJogadores} ${r.totalJogadores === 1 ? "jogador" : "jogadores"} no milharal.` : ""}</p>

        {q.isLoading && (
          <ul className="space-y-3" aria-busy="true" aria-label="Carregando ranking">
            {[0, 1, 2, 3, 4].map((i) => <li key={i} className="h-[70px] rounded-2xl bg-muted animate-pulse" />)}
          </ul>
        )}

        {q.isError && (
          <div className="chunky rounded-2xl bg-card p-6 text-center" role="status">
            <Pintinho tamanho={80} feliz={false} className="mx-auto" />
            <p className="font-display text-2xl font-extrabold">A tabela se escondeu no milho</p>
            <p className="text-muted-foreground">Não conseguimos carregar o ranking agora.</p>
            <button onClick={() => q.refetch()} data-testid="button-recarregar-ranking" className="chunky-btn mt-4 inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-3 font-bold">
              <RefreshCw className="h-5 w-5" aria-hidden="true" />Tentar de novo
            </button>
          </div>
        )}

        {r && r.itens.length === 0 && (
          <div className="chunky rounded-2xl bg-card p-8 text-center" data-testid="status-ranking-vazio">
            <Sprout className="mx-auto h-12 w-12 text-secondary" aria-hidden="true" />
            <p className="mt-2 font-display text-2xl font-extrabold">A tabela ainda está brotando</p>
            <p className="text-muted-foreground">Faça uma lição e seja a primeira semente daqui!</p>
            <Link href="/aulas" data-testid="link-ir-aulas" className="chunky-btn mt-4 inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-3 font-bold"><BookOpen className="h-5 w-5" aria-hidden="true" />Ir para as aulas</Link>
          </div>
        )}

        {r && r.itens.length > 0 && (
          <>
            <ol className="space-y-3" aria-label={"Ranking de " + aba.t.toLowerCase()} data-testid="list-ranking">
              {r.itens.map((it, i) => <Linha key={it.jogadorId} it={it} tipo={tipo} voce={voce?.jogadorId === it.jogadorId} i={i} />)}
            </ol>
            {voce && !voceNaLista && (
              <div className="space-y-2" data-testid="card-sua-posicao">
                <p className="text-center font-bold text-muted-foreground" aria-hidden="true">· · ·</p>
                <ol aria-label="Sua posição"><Linha it={voce} tipo={tipo} voce i={0} /></ol>
                <p className="text-center font-semibold text-muted-foreground">Cada lição te leva um degrau acima. Bora subir juntos!</p>
              </div>
            )}
            {!voce && (
              <p className="rounded-2xl bg-muted p-4 font-semibold" data-testid="text-sem-marca">
                {jogador ? jogador.apelido + ", você" : "Você"} ainda não tem marca aqui. {tipo === "velocidade" ? "Termine uma lição para registrar sua velocidade!" : "Termine uma lição para ganhar seus primeiros pontos!"}
              </p>
            )}
          </>
        )}
      </section>
    </div>
  );
}
