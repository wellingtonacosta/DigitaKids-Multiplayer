import { Link } from "wouter";
import { Pintinho } from "@/components/milharal";

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] dots-bg grid place-items-center p-4">
      <div className="chunky rounded-3xl bg-card p-8 text-center max-w-md rise">
        <p className="font-mono text-6xl font-bold text-primary" aria-hidden="true">404</p>
        <Pintinho tamanho={96} feliz={false} className="mx-auto mt-3 bob" />
        <h1 className="mt-3 font-display text-3xl font-extrabold">Esse pintinho se perdeu no milharal!</h1>
        <p className="mt-2 text-muted-foreground">Essa página não existe. Bora voltar e continuar treinando?</p>
        <Link href="/" data-testid="link-voltar" className="chunky-btn mt-6 inline-block rounded-xl bg-primary text-primary-foreground px-6 py-3 font-bold text-lg">Voltar ao início</Link>
      </div>
    </div>
  );
}
