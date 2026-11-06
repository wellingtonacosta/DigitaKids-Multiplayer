import { useState, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useEntrar, getObterJogadorAtualQueryKey } from "@workspace/api-client-react";
import { ShieldCheck, ArrowRight, Check } from "lucide-react";
import { Avatar, AVATARES } from "@/components/avatar-jogador";
import { Logo } from "@/components/layout";
import { cn } from "@/lib/utils";
import { Pintinho, Espiga } from "@/components/milharal";

function validar(a: string): string | null {
  if (a.length === 0) return "Escreva um apelido para começar.";
  if (/\s/.test(a)) return "O apelido não pode ter espaços.";
  if (!/^[A-Za-z0-9]+$/.test(a)) return "Use só letras e números, sem acentos ou símbolos.";
  if (a.length < 3) return "Falta pouco! O apelido precisa de pelo menos 3 letras ou números.";
  if (a.length > 16) return "O apelido pode ter no máximo 16 letras ou números.";
  return null;
}

export default function Entrada() {
  const qc = useQueryClient();
  const entrar = useEntrar();
  const [apelido, setApelido] = useState("");
  const [avatar, setAvatar] = useState("avatar-1");
  const [tocado, setTocado] = useState(false);
  const [msgServidor, setMsgServidor] = useState<string | null>(null);
  const erroLocal = validar(apelido);
  const msg = msgServidor ?? (tocado ? erroLocal : null);

  function enviar(e: FormEvent) {
    e.preventDefault();
    setTocado(true);
    setMsgServidor(null);
    if (erroLocal) return;
    entrar.mutate({ data: { apelido, avatar } }, {
      onSuccess: (j) => qc.setQueryData(getObterJogadorAtualQueryKey(), j),
      onError: (err) => {
        const e2 = err as { status?: number; data?: { erro?: string } | null };
        if (e2.status === 409) setMsgServidor("Esse apelido já está em uso, escolha outro");
        else if (e2.data?.erro) setMsgServidor(e2.data.erro);
        else setMsgServidor("Não conseguimos conectar agora. Tente de novo em alguns segundos.");
      },
    });
  }

  return (
    <div className="min-h-[100dvh] dots-bg flex flex-col">
      <div className="bg-sidebar px-5 py-4 border-b-[3px] border-foreground"><Logo claro /></div>
      <div className="flex-1 grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[1fr_1.1fr] gap-8 px-4 py-8 md:px-10 max-w-6xl mx-auto w-full items-center">
        <section className="rise min-w-0">
          <div className="flex items-end gap-2 mb-4" aria-hidden="true"><Pintinho tamanho={72} className="bob" /><Espiga tamanho={44} className="rotate-12" /><Espiga tamanho={36} className="-rotate-6" /></div>
          <p className="inline-block rounded-full bg-secondary text-secondary-foreground px-4 py-1 font-bold text-sm mb-4">Do catar milho aos dez dedos</p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.02]">
            Chega de catar milho. <span className="bg-accent px-2 -rotate-1 inline-block border-[3px] border-foreground rounded-lg">Bora usar os dez dedos!</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-md">Todo mundo começa pintinho, catando uma tecla de cada vez. Treine aqui e vire o mestre do milharal. Cada tecla certa vale pontos!</p>
          <div className="mt-6 hidden lg:flex gap-2 font-mono" aria-hidden="true">
            {["A","S","D","F"," ","J","K","L","Ç"].map((k,i)=> k===" " ? <span key={i} className="w-6" /> :
              <span key={i} className={cn("chunky rounded-lg w-12 h-12 grid place-items-center text-xl bg-card bob", (k==="F"||k==="J") && "bg-primary text-primary-foreground")} style={{animationDelay: i*0.15+"s"}}>{k}</span>)}
          </div>
        </section>

        <form onSubmit={enviar} noValidate className="min-w-0 chunky rounded-3xl bg-card p-5 sm:p-7 rise" style={{animationDelay:".1s"}} data-testid="form-entrar">
          <label htmlFor="apelido" className="font-display text-xl font-extrabold">Seu apelido</label>
          <p id="apelido-dica" className="text-muted-foreground text-base">De 3 a 16 letras ou números, sem espaços.</p>
          <div className="mt-2 flex items-center gap-3">
            <Avatar chave={avatar} tamanho={56} />
            <input id="apelido" value={apelido} maxLength={16} autoComplete="off" autoFocus
              onChange={(e) => { setApelido(e.target.value); setMsgServidor(null); }}
              onBlur={() => apelido && setTocado(true)}
              aria-invalid={!!msg} aria-describedby="apelido-dica apelido-msg" data-testid="input-apelido"
              className="flex-1 min-w-0 rounded-xl border-[3px] border-foreground bg-background px-4 py-3 text-xl font-bold font-mono outline-none focus:ring-4 focus:ring-ring/40"
              placeholder="ex: Teclinha22" />
          </div>
          <div className="flex justify-end text-sm text-muted-foreground mt-1 font-mono">{apelido.length}/16</div>
          <div id="apelido-msg" role="status" aria-live="polite" data-testid="status-entrar" className="min-h-[1.75rem]">
            {msg && <p className="flex items-start gap-2 rounded-lg bg-accent/40 border-2 border-foreground px-3 py-2 font-bold text-base rise"><span aria-hidden="true" className="font-display">!</span>{msg}</p>}
          </div>

          <fieldset className="mt-4 min-w-0">
            <legend className="font-display text-xl font-extrabold mb-3">Escolha seu avatar</legend>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5" role="radiogroup">
              {AVATARES.map((a, i) => {
                const sel = avatar === a.chave;
                return (
                  <button key={a.chave} type="button" role="radio" aria-checked={sel} aria-label={a.nome}
                    onClick={() => setAvatar(a.chave)} data-testid={"button-avatar-" + a.chave}
                    className={cn("relative rounded-2xl p-1.5 grid place-items-center transition-all rise border-[3px]",
                      sel ? "border-foreground bg-accent scale-105 shadow-[3px_3px_0_hsl(var(--foreground))]" : "border-transparent hover:bg-muted hover:-translate-y-1")}
                    style={{ animationDelay: 0.15 + i * 0.03 + "s" }}>
                    <Avatar chave={a.chave} tamanho={48} />
                    {sel && <span className="absolute -top-2 -right-2 rounded-full bg-secondary text-secondary-foreground border-2 border-foreground p-0.5"><Check className="h-3.5 w-3.5" aria-hidden="true" /></span>}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <button type="submit" disabled={entrar.isPending} data-testid="button-entrar"
            className="chunky-btn mt-6 w-full rounded-2xl bg-primary text-primary-foreground py-4 text-xl font-display font-extrabold flex items-center justify-center gap-2 disabled:opacity-70">
            {entrar.isPending ? "Entrando..." : <>Entrar no jogo <ArrowRight className="h-6 w-6" aria-hidden="true" /></>}
          </button>

          <p className="mt-5 flex gap-3 items-start rounded-xl bg-muted p-3 text-base font-semibold" data-testid="text-aviso-privacidade">
            <ShieldCheck className="h-6 w-6 shrink-0 text-secondary" aria-hidden="true" />
            Seu nome e a identificação do seu computador ficam salvos para guardar seus pontos.
          </p>
        </form>
      </div>
    </div>
  );
}
