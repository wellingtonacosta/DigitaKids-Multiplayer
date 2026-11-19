import { Link } from "wouter";
import { BookOpen, Flag, Trophy, UserRound, Star, Flame, ArrowRight } from "lucide-react";
import type { Jogador } from "@workspace/api-client-react";
import { Avatar } from "@/components/avatar-jogador";
import { cn } from "@/lib/utils";
import { Galo } from "@/components/milharal";

const NOMES_NIVEIS = ["Aprendiz", "Digitador", "Ninja do Teclado", "Mestre das Teclas"];
const LIMIARES_PONTOS_POR_NIVEL = [0, 200, 800, 2000];
const ATALHOS = [
  { href: "/aulas", titulo: "Aulas", descricao: "Cada dedo ganha sua casinha no teclado.", icone: BookOpen, cor: "bg-primary text-primary-foreground", inclinacao: "-rotate-1" },
  { href: "/corridas", titulo: "Corridas", descricao: "Digite rápido e vença o relógio.", icone: Flag, cor: "bg-secondary text-secondary-foreground", inclinacao: "rotate-1" },
  { href: "/ranking", titulo: "Ranking", descricao: "Veja quem está no topo da turma.", icone: Trophy, cor: "bg-accent text-accent-foreground", inclinacao: "rotate-1" },
  { href: "/perfil", titulo: "Perfil", descricao: "Suas conquistas e seu avatar.", icone: UserRound, cor: "bg-card text-foreground", inclinacao: "-rotate-1" },
];

export default function Inicio({ jogador }: { jogador: Jogador }) {
  const indiceNivel = Math.max(0, NOMES_NIVEIS.indexOf(jogador.nivel));
  const limiteProximoNivel = LIMIARES_PONTOS_POR_NIVEL[indiceNivel + 1];
  const mensagemProximoNivel = limiteProximoNivel !== undefined
    ? `Faltam ${Math.max(0, limiteProximoNivel - jogador.pontosTotais).toLocaleString("pt-BR")} pontos para virar ${NOMES_NIVEIS[indiceNivel + 1]}`
    : "Você chegou ao nível máximo!";

  return (
    <div className="space-y-8">
      <section className="chunky rounded-3xl bg-sidebar text-sidebar-foreground p-5 sm:p-8 flex flex-col sm:flex-row gap-5 sm:items-center rise relative overflow-hidden">
        <Galo tamanho={130} className="hidden sm:block absolute -right-2 -bottom-4 opacity-95" />
        <Avatar chave={jogador.avatar} tamanho={96} className="bob border-accent" />
        <div className="flex-1 min-w-0 sm:pr-28">
          <p className="font-bold text-accent" aria-live="polite">{jogador.novo ? "Que bom ter você aqui!" : "Que bom te ver de novo!"}</p>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold break-words" data-testid="text-boas-vindas">Oi, {jogador.apelido}!</h1>
          <p className="mt-1 opacity-85">Hoje é dia de trocar o catar milho pelos dez dedos. Bora?</p>
        </div>
      </section>

      <section aria-label="Seu progresso" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="chunky rounded-2xl bg-card p-5 rise" style={{animationDelay:".08s"}}>
          <p className="text-muted-foreground font-bold">Nível</p>
          <p className="font-display text-3xl font-extrabold" data-testid="text-nivel">{jogador.nivel}</p>
          <ol className="mt-3 flex gap-1.5" aria-label={"Nível " + (indiceNivel + 1) + " de " + NOMES_NIVEIS.length}>
            {NOMES_NIVEIS.map((nome, indice) => <li key={nome} title={nome} className={cn("h-3 flex-1 rounded-full border-2 border-foreground", indice <= indiceNivel ? "bg-primary" : "bg-muted")} />)}
          </ol>
          <p className="mt-2 text-sm text-muted-foreground font-semibold">{mensagemProximoNivel}</p>
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
          {ATALHOS.map((atalho, indice) => (
            <Link key={atalho.href} href={atalho.href} data-testid={"card-atalho-" + atalho.titulo.toLowerCase()}
              className={cn("chunky-btn group rounded-2xl p-5 flex items-center gap-4 rise", atalho.cor, atalho.inclinacao, "hover:rotate-0")}
              style={{ animationDelay: 0.3 + indice * 0.08 + "s" }}>
              <span className="rounded-xl bg-background/90 text-foreground border-[3px] border-foreground p-3"><atalho.icone className="h-7 w-7" aria-hidden="true" /></span>
              <span className="flex-1">
                <span className="block font-display text-2xl font-extrabold">{atalho.titulo}</span>
                <span className="block font-semibold opacity-90">{atalho.descricao}</span>
              </span>
              <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
