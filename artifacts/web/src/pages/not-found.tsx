import { Link } from "wouter";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] dots-bg grid place-items-center p-4">
      <div className="chunky rounded-3xl bg-card p-8 text-center max-w-md rise">
        <p className="font-mono text-6xl font-bold text-primary" aria-hidden="true">404</p>
        <Compass className="mx-auto mt-3 h-12 w-12 bob" aria-hidden="true" />
        <h1 className="mt-3 font-display text-3xl font-extrabold">Ops, essa tecla não leva a lugar nenhum!</h1>
        <p className="mt-2 text-muted-foreground">Essa página não existe. Bora voltar e continuar treinando?</p>
        <Link href="/" data-testid="link-voltar" className="chunky-btn mt-6 inline-block rounded-xl bg-primary text-primary-foreground px-6 py-3 font-bold text-lg">Voltar ao início</Link>
      </div>
    </div>
  );
}
