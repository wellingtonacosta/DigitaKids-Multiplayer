import { Wheat, Star, Target, Zap, EyeOff, Map, Flame, CalendarCheck, Flag, Crown, Award, Lock, type LucideIcon } from "lucide-react";
import type { Medalha } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";

export const ICONES_MEDALHA: Record<string, { icone: LucideIcon; cor: string }> = {
  "primeira-espiga": { icone: Wheat, cor: "bg-accent" },
  "tres-estrelas": { icone: Star, cor: "bg-accent" },
  "precisao-total": { icone: Target, cor: "bg-[#D2EEDF]" },
  "dedos-rapidos": { icone: Zap, cor: "bg-[#FBE6B8]" },
  "de-olhos-fechados": { icone: EyeOff, cor: "bg-[#C9D6E8]" },
  "trilha-completa": { icone: Map, cor: "bg-[#D2EEDF]" },
  "sequencia-3": { icone: Flame, cor: "bg-[#FCE1DC]" },
  "sequencia-7": { icone: CalendarCheck, cor: "bg-[#FCE1DC]" },
  "primeira-corrida": { icone: Flag, cor: "bg-[#FBE6B8]" },
  campeao: { icone: Crown, cor: "bg-accent" },
};

export function SeloMedalha({ m, tamanho = "md" }: { m: Medalha; tamanho?: "md" | "lg" }) {
  const info = ICONES_MEDALHA[m.chave] ?? { icone: Award, cor: "bg-accent" };
  const I = m.conquistada ? info.icone : Lock;
  const g = tamanho === "lg";
  return (
    <span className={cn("grid place-items-center shrink-0 rounded-full border-[3px]",
      g ? "h-20 w-20" : "h-14 w-14",
      m.conquistada ? cn(info.cor, "border-foreground text-foreground") : "bg-muted border-dashed border-foreground/40 text-muted-foreground")} aria-hidden="true">
      <I className={g ? "h-10 w-10" : "h-7 w-7"} strokeWidth={2.4} />
    </span>
  );
}

export function dataBR(s: string | null) {
  if (!s) return "";
  const d = new Date(s);
  return isNaN(d.getTime()) ? "" : d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}
