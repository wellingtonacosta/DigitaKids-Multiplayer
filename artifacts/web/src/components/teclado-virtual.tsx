import { TECLAS, type TeclaFisica } from "@workspace/typing-core";
import { Check, X } from "lucide-react";
import { COR_DEDO } from "@/lib/dedos";
import { cn } from "@/lib/utils";

export type Flash = { code: string; tipo: "acerto" | "erro"; n: number } | null;

const LINHAS = [0, 1, 2, 3, 4].map((l) => TECLAS.filter((k) => k.linha === l));

function rotulo(k: TeclaFisica) {
  if (k.code === "Space" || k.code.startsWith("Shift")) return { cima: "", baixo: k.rotulo };
  if (/^[a-zç]$/.test(k.normal)) return { cima: "", baixo: k.normal.toUpperCase() };
  return { cima: k.shift, baixo: k.normal };
}

function Tecla({ k, alvo, flash, semOlhar, calor }: { k: TeclaFisica; alvo: boolean; flash: Flash; semOlhar: boolean; calor?: number }) {
  const cor = COR_DEDO[k.dedo];
  const f = flash && flash.code === k.code ? flash.tipo : null;
  const r = rotulo(k);
  let bg = cor.clara;
  if (calor !== undefined) bg = calor > 0 ? `rgba(194, 64, 47, ${0.18 + calor * 0.82})` : "hsl(48 80% 97%)";
  if (f === "acerto") bg = "#3FAE5E";
  if (f === "erro") bg = "#F6B3AA";
  const escuro = (calor !== undefined && calor > 0.55) || f === "acerto";
  return (
    <div
      key={f ? flash!.n : undefined}
      data-testid={"key-" + k.code}
      className={cn(
        "relative min-w-0 rounded-[0.35em] border-2 flex flex-col items-center justify-center leading-none font-mono font-bold select-none transition-transform",
        alvo ? "pisca z-10 border-[3px]" : "",
        f === "erro" && "chacoalha",
      )}
      style={{
        flex: `${k.largura} 1 0`,
        height: "2.6em",
        background: bg,
        color: escuro ? "#FFF8E6" : "hsl(150 38% 13%)",
        borderColor: alvo ? "hsl(150 38% 13%)" : calor !== undefined ? "hsl(42 38% 74%)" : cor.forte,
        boxShadow: alvo ? `0 0 0 3px ${cor.forte}, 0 3px 0 hsl(150 38% 13%)` : "0 2px 0 hsl(150 38% 13% / .35)",
      }}
    >
      {!semOlhar && (
        <>
          {r.cima && <span className="text-[0.6em] opacity-70">{r.cima}</span>}
          <span className={cn(k.code === "Space" || k.code.startsWith("Shift") ? "text-[0.65em] font-sans" : "")}>{r.baixo}</span>
        </>
      )}
      {(k.code === "KeyF" || k.code === "KeyJ") && <span className="absolute bottom-[0.3em] w-[0.7em] h-[2px] rounded bg-current opacity-60" aria-hidden="true" />}
      {f === "erro" && <X className="absolute -top-[0.5em] -right-[0.4em] h-[1em] w-[1em] rounded-full bg-primary text-primary-foreground p-[1px]" aria-hidden="true" />}
      {f === "acerto" && <Check className="absolute -top-[0.5em] -right-[0.4em] h-[1em] w-[1em] rounded-full bg-secondary text-secondary-foreground p-[1px]" aria-hidden="true" />}
      {calor !== undefined && calor > 0 && <span className="sr-only">{"tecla com erros"}</span>}
    </div>
  );
}

/**
 * Teclado ABNT2 escalável: tudo é medido em "em", e o tamanho da fonte acompanha a largura da tela.
 */
export function TecladoVirtual({ alvos = [], flash = null, semOlhar = false, calor, className, rotuloAria = "Teclado virtual" }: {
  alvos?: string[]; flash?: Flash; semOlhar?: boolean; calor?: Record<string, number>; className?: string; rotuloAria?: string;
}) {
  const max = calor ? Math.max(1, ...Object.values(calor)) : 1;
  return (
    <div role="img" aria-label={rotuloAria} className={cn("w-full min-w-0 rounded-2xl border-[3px] border-foreground bg-card palha p-[0.5em] text-[clamp(9px,2.35vw,19px)]", className)}>
      <div className="flex flex-col gap-[0.3em]">
        {LINHAS.map((linha, li) => {
          const esq = linha.filter((k) => k.mao === "esquerda");
          const dir = linha.filter((k) => k.mao === "direita");
          const meio = linha.filter((k) => k.mao === "ambas");
          const render = (k: TeclaFisica) => (
            <Tecla key={k.code} k={k} alvo={alvos.includes(k.code)} flash={flash} semOlhar={semOlhar} calor={calor ? (calor[k.code] ?? 0) / max : undefined} />
          );
          if (meio.length) return <div key={li} className="flex justify-center px-[18%]">{meio.map(render)}</div>;
          return (
            <div key={li} className="flex gap-[0.9em]" style={{ paddingLeft: li === 1 ? "0.4em" : li === 2 ? "0.8em" : 0 }}>
              <div className="flex gap-[0.25em] min-w-0" style={{ flex: `${esq.reduce((s, k) => s + k.largura, 0)} 1 0` }}>{esq.map(render)}</div>
              <div className="w-[3px] self-stretch rounded bg-foreground/25 shrink-0" aria-hidden="true" />
              <div className="flex gap-[0.25em] min-w-0" style={{ flex: `${dir.reduce((s, k) => s + k.largura, 0)} 1 0` }}>{dir.map(render)}</div>
            </div>
          );
        })}
      </div>
      <div className="mt-[0.4em] flex justify-between text-[0.7em] font-bold opacity-70 px-[0.3em]" aria-hidden="true">
        <span>mão esquerda</span><span>mão direita</span>
      </div>
    </div>
  );
}
