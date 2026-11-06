import { type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Home, BookOpen, Flag, Trophy, UserRound, LogOut } from "lucide-react";
import { Avatar } from "@/components/avatar-jogador";
import { useSairDoJogo } from "@/hooks/use-sessao";
import type { Jogador } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";

export const NAV = [
  { href: "/", rotulo: "Início", icone: Home },
  { href: "/aulas", rotulo: "Aulas", icone: BookOpen },
  { href: "/corridas", rotulo: "Corridas", icone: Flag },
  { href: "/ranking", rotulo: "Ranking", icone: Trophy },
  { href: "/perfil", rotulo: "Perfil", icone: UserRound },
];

export function Logo({ claro = false }: { claro?: boolean }) {
  return (
    <span className={cn("font-display text-2xl font-extrabold tracking-tight", claro ? "text-sidebar-foreground" : "text-foreground")}>
      Digita<span className="text-accent">Kids</span>
    </span>
  );
}

export function Layout({ jogador, children }: { jogador: Jogador; children: ReactNode }) {
  const [loc] = useLocation();
  const { sair, saindo } = useSairDoJogo();
  return (
    <div className="min-h-[100dvh] md:grid md:grid-cols-[240px_1fr] dots-bg">
      <aside className="hidden md:flex sticky top-0 h-[100dvh] flex-col bg-sidebar text-sidebar-foreground p-5 gap-6">
        <Link href="/" data-testid="link-logo" className="px-2"><Logo claro /></Link>
        <nav aria-label="Navegação principal" className="flex flex-col gap-2">
          {NAV.map((n) => {
            const ativo = loc === n.href;
            return (
              <Link key={n.href} href={n.href} data-testid={"link-nav-" + n.rotulo.toLowerCase()} aria-current={ativo ? "page" : undefined}
                className={cn("flex items-center gap-3 rounded-xl px-4 py-3 text-lg font-bold transition-all",
                  ativo ? "bg-accent text-accent-foreground translate-x-1" : "hover:bg-sidebar-accent hover:translate-x-1")}>
                <n.icone className="h-5 w-5" aria-hidden="true" />{n.rotulo}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto rounded-2xl bg-sidebar-accent p-3 flex items-center gap-3">
          <Avatar chave={jogador.avatar} tamanho={44} />
          <div className="min-w-0 flex-1">
            <p className="font-bold truncate" data-testid="text-apelido-lateral">{jogador.apelido}</p>
            <p className="text-sm opacity-80">{jogador.nivel}</p>
          </div>
        </div>
        <button onClick={sair} disabled={saindo} data-testid="button-sair"
          className="flex items-center justify-center gap-2 rounded-xl border-2 border-sidebar-border px-4 py-3 font-bold hover:bg-sidebar-accent transition-colors disabled:opacity-60">
          <LogOut className="h-5 w-5" aria-hidden="true" />{saindo ? "Saindo..." : "Sair"}
        </button>
      </aside>

      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between bg-sidebar px-4 py-3">
        <Link href="/" data-testid="link-logo-mobile"><Logo claro /></Link>
        <div className="flex items-center gap-2">
          <Avatar chave={jogador.avatar} tamanho={36} />
          <button onClick={sair} disabled={saindo} data-testid="button-sair-mobile" aria-label="Sair"
            className="flex items-center gap-1 rounded-lg border-2 border-sidebar-border px-3 py-2 text-sm font-bold text-sidebar-foreground">
            <LogOut className="h-4 w-4" aria-hidden="true" />Sair
          </button>
        </div>
      </header>

      <main className="px-4 pt-6 pb-28 md:px-10 md:py-10 max-w-5xl w-full">{children}</main>

      <nav aria-label="Navegação principal" className="md:hidden fixed bottom-0 inset-x-0 z-30 grid grid-cols-5 bg-sidebar border-t-4 border-accent pb-[env(safe-area-inset-bottom)]">
        {NAV.map((n) => {
          const ativo = loc === n.href;
          return (
            <Link key={n.href} href={n.href} data-testid={"link-tab-" + n.rotulo.toLowerCase()} aria-current={ativo ? "page" : undefined}
              className={cn("flex flex-col items-center gap-1 py-2.5 text-xs font-bold transition-colors",
                ativo ? "text-accent" : "text-sidebar-foreground/80")}>
              <span className={cn("rounded-full px-3 py-1 transition-transform", ativo && "bg-accent text-accent-foreground -translate-y-0.5")}>
                <n.icone className="h-5 w-5" aria-hidden="true" />
              </span>
              {n.rotulo}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
