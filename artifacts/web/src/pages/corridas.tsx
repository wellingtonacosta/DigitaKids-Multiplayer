import { useState, type FormEvent } from "react";
import { useLocation } from "wouter";
import { Flag, LogIn, Plus, AlertCircle } from "lucide-react";
import { codigoValido, SALA_MIN, SALA_MAX } from "@workspace/typing-core";
import { useTecladoFisico } from "@/hooks/use-sessao";
import { salaApi } from "@/hooks/use-sala";
import { Galo, Cerca } from "@/components/milharal";
import { AvisoTeclado } from "@/pages/aulas";

export default function Corridas() {
  const temTeclado = useTecladoFisico();
  const [, go] = useLocation();
  const [nome, setNome] = useState("");
  const [codigo, setCodigo] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState<"criar" | "entrar" | null>(null);

  async function criar(e: FormEvent) {
    e.preventDefault(); setErro(null); setOcupado("criar");
    const r = await salaApi.criar(nome.trim() || "Corrida no milharal");
    setOcupado(null);
    if (r.ok && "codigo" in r) go("/sala/" + r.codigo); else if (!r.ok) setErro(r.erro);
  }
  function entrar(e: FormEvent) {
    e.preventDefault(); setErro(null);
    const c = codigo.trim().toUpperCase();
    if (!codigoValido(c)) { setErro("O código tem 5 letras ou números. Confira com quem te convidou!"); return; }
    setOcupado("entrar");
    go("/sala/" + c);
  }

  return (
    <div className="space-y-6 min-w-0">
      <header className="chunky rounded-3xl bg-primary text-primary-foreground p-5 sm:p-7 flex items-center gap-4 rise overflow-hidden">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-accent">Pista do milharal</p>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold leading-tight">Corridas</h1>
          <p className="mt-1 opacity-90">Chame de {SALA_MIN} a {SALA_MAX} amigos, todo mundo digita o mesmo texto. Quem chega primeiro no fim da cerca ganha mais milho!</p>
        </div>
        <Galo tamanho={100} className="bob shrink-0 hidden sm:block" />
      </header>

      {!temTeclado && <AvisoTeclado />}

      {erro && (
        <p role="alert" data-testid="text-erro-corrida" className="flex items-start gap-2 rounded-2xl bg-[#FCE1DC] border-[3px] border-primary p-4 font-bold rise">
          <AlertCircle className="h-6 w-6 shrink-0 text-primary" aria-hidden="true" />{erro}
        </p>
      )}

      <div className="grid gap-5 md:grid-cols-2 min-w-0">
        <form onSubmit={criar} className="chunky rounded-3xl bg-card p-5 sm:p-6 space-y-4 min-w-0 rise">
          <div className="w-14 h-14 rounded-2xl bg-accent border-[3px] border-foreground grid place-items-center"><Plus className="h-7 w-7" aria-hidden="true" /></div>
          <h2 className="font-display text-2xl font-extrabold">Criar uma sala</h2>
          <label className="block font-bold" htmlFor="nome-sala">Nome da sala</label>
          <input id="nome-sala" value={nome} onChange={(e) => setNome(e.target.value)} maxLength={40} placeholder="Ex.: Turma do 7º B"
            data-testid="input-nome-sala" className="w-full min-w-0 rounded-xl border-[3px] border-foreground bg-background px-4 py-3 text-lg font-semibold" />
          <button disabled={!!ocupado} data-testid="button-criar-sala" className="chunky-btn w-full inline-flex justify-center items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-3 font-bold text-lg disabled:opacity-60">
            <Flag className="h-5 w-5" aria-hidden="true" />{ocupado === "criar" ? "Abrindo a porteira..." : "Criar sala"}
          </button>
          <p className="text-sm text-muted-foreground">Você vira o anfitrião e dá a largada.</p>
        </form>

        <form onSubmit={entrar} className="chunky rounded-3xl bg-secondary text-secondary-foreground p-5 sm:p-6 space-y-4 min-w-0 rise" style={{ animationDelay: ".08s" }}>
          <div className="w-14 h-14 rounded-2xl bg-accent text-accent-foreground border-[3px] border-foreground grid place-items-center"><LogIn className="h-7 w-7" aria-hidden="true" /></div>
          <h2 className="font-display text-2xl font-extrabold">Entrar com código</h2>
          <label className="block font-bold" htmlFor="codigo-sala">Código da sala</label>
          <input id="codigo-sala" value={codigo} onChange={(e) => setCodigo(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 5))}
            placeholder="ABC23" autoCapitalize="characters" autoComplete="off" data-testid="input-codigo-sala"
            className="w-full min-w-0 rounded-xl border-[3px] border-foreground bg-background text-foreground px-4 py-3 font-mono text-3xl tracking-[0.4em] uppercase text-center" />
          <button disabled={!!ocupado || codigo.length !== 5} data-testid="button-entrar-sala" className="chunky-btn w-full inline-flex justify-center items-center gap-2 rounded-xl bg-accent text-accent-foreground px-5 py-3 font-bold text-lg disabled:opacity-60">
            <LogIn className="h-5 w-5" aria-hidden="true" />Entrar
          </button>
        </form>
      </div>
      <Cerca className="opacity-80" />
    </div>
  );
}
