import { Link } from "wouter";
import { BookOpen, Flag, Trophy, UserRound, Star, Flame, ArrowRight } from "lucide-react";
import type { Jogador } from "@workspace/api-client-react";
import { Avatar } from "@/components/avatar-jogador";
import { cn } from "@/lib/utils";

const NIVEIS = ["Aprendiz", "Digitador", "Veloz", "Mestre"];
const ATALHOS = [
  { href: "/aulas", t: "Aulas", d: "Aprenda onde cada dedo mora no teclado.", i: BookOpen, c: "bg-primary text-primary-foreground", r: "-rotate-1" },
  { href: "/corridas", t: "Corridas", d: "Digite rápido e vença o relógio.", i: Flag, c: "bg-secondary text-secondary-foreground", r: "rotate-1" },
  { href: "/ranking", t: "Ranking", d: "Veja quem está no topo da turma.", i: Trophy, c: "bg-accent text-accent-foreground", r: "rotate-1" },
  { href: "/perfil", t: "Perfil", d: "Suas conquistas e seu avatar.", i: UserRound, c: "bg-card text-foreground", r: "-rotate-1" },
];

export default function Inicio({ jogador }: { jogador: Jogador }) {
  const idx = Math.max(0, NIVEIS.indexOf(jogador.nivel));
  return (
    <div className="space-y-8">
      <section className="chunky rounded-3xl bg-sidebar text-sidebar-foreground p-5 sm:p-8 flex flex-col sm:flex-row gap-5 sm:items-center rise">
        <Avatar chave={jogador.avatar} tamanho={96} className="bob border-accent" />
        <div className="flex-1">
          <p className="font-bold text-accent" aria-live="polite">{jogador.novo ? "Que bom ter você aqui!" : "Que bom te ver de novo!"}</p>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold break-words" data-testid="text-boas-vindas">Oi, {jogador.apelido}!</h1>
          <p className="mt-1 opacity-85">Pronto para deixar os dedos mais espertos hoje?</p>
        </div>
      </section>

      <section aria-label="Seu progresso" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="chunky rounded-2xl bg-card p-5 rise" style={{animationDelay:".08s"}}>
          <p className="text-muted-foreground font-bold">Nível</p>
          <p className="font-display text-3xl font-extrabold" data-testid="text-nivel">{jogador.nivel}</p>
          <ol className="mt-3 flex gap-1.5" aria-label={"Nível " + (idx + 1) + " de 4"}>
            {NIVEIS.map((n, i) => <li key={n} title={n} className={cn("h-3 flex-1 rounded-full border-2 border-foreground", i <= idx ? "bg-primary" : "bg-muted")} />)}
          </ol>
        </div>
        <div className="chunky rounded-2xl bg-accent p-5 rise" style={{animationDelay:".16s"}}>
          <p className="font-bold flex items-center gap-2"><Star className="h-5 w-5" aria-hidden="true" />Pontos</p>
          <p className="font-mono text-4xl font-bold" data-testid="text-pontos">{jogador.pontosTotais.toLocaleString("pt-BR")}</p>
        </div>
        <div className="chunky rounded-2xl bg-card p-5 rise" style={{animationDelay:".24s"}}>
          <p className="text-muted-foreground font-bold flex items-center gap-2"><Flame className="h-5 w-5 text-primary" aria-hidden="true" />Sequência</p>
          <p className="font-mono text-4xl font-bold" data-testid="text-sequencia">{jogador.sequenciaDias}<span className="text-lg font-sans ml-2">{jogador.sequenciaDias === 1 ? "dia" : "dias"}</span></p>
          <p className="text-sm text-muted-foreground">Treine um pouquinho todo dia!</p>
        </div>
      </section>

      <section aria-labelledby="titulo-atalhos">
        <h2 id="titulo-atalhos" className="font-display text-2xl font-extrabold mb-4">Para onde vamos?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {ATALHOS.map((a, i) => (
            <Link key={a.href} href={a.href} data-testid={"card-atalho-" + a.t.toLowerCase()}
              className={cn("chunky-btn group rounded-2xl p-5 flex items-center gap-4 rise", a.c, a.r, "hover:rotate-0")}
              style={{ animationDelay: 0.3 + i * 0.08 + "s" }}>
              <span className="rounded-xl bg-background/90 text-foreground border-[3px] border-foreground p-3"><a.i className="h-7 w-7" aria-hidden="true" /></span>
              <span className="flex-1">
                <span className="block font-display text-2xl font-extrabold">{a.t}</span>
                <span className="block font-semibold opacity-90">{a.d}</span>
              </span>
              <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
