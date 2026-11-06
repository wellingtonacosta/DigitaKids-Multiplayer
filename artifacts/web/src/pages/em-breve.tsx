import { Link } from "wouter";
import { Keyboard, ArrowLeft, type LucideIcon } from "lucide-react";
import { useTecladoFisico } from "@/hooks/use-sessao";

export default function EmBreve({ titulo, frase, icone: Icone, precisaTeclado = false }: { titulo: string; frase: string; icone: LucideIcon; precisaTeclado?: boolean }) {
  const temTeclado = useTecladoFisico();
  return (
    <div className="space-y-6">
      <h1 className="font-display text-4xl sm:text-5xl font-extrabold rise">{titulo}</h1>
      {precisaTeclado && !temTeclado && (
        <div role="status" aria-live="polite" data-testid="status-sem-teclado" className="chunky rounded-2xl bg-accent p-4 flex gap-3 items-start font-bold text-lg rise">
          <Keyboard className="h-7 w-7 shrink-0" aria-hidden="true" />
          Para treinar digitação, use um computador com teclado físico
        </div>
      )}
      <section className="chunky rounded-3xl bg-card p-6 sm:p-10 text-center rise" style={{animationDelay:".1s"}}>
        <div className="mx-auto w-24 h-24 rounded-3xl bg-primary text-primary-foreground border-[3px] border-foreground grid place-items-center bob">
          <Icone className="h-12 w-12" aria-hidden="true" />
        </div>
        <p className="mt-5 inline-block rounded-full bg-secondary text-secondary-foreground px-4 py-1 font-bold">Em breve</p>
        <p className="mt-3 font-display text-2xl font-extrabold max-w-md mx-auto">{frase}</p>
        <p className="mt-2 text-muted-foreground">Estamos preparando tudo com carinho. Volte logo!</p>
        <Link href="/" data-testid="link-voltar-inicio" className="chunky-btn mt-6 inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 font-bold">
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />Voltar ao início
        </Link>
      </section>
    </div>
  );
}
