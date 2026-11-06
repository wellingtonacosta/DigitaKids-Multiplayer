import { cn } from "@/lib/utils";

export const AVATARES: { chave: string; emoji: string; nome: string; cor: string }[] = [
  { chave: "avatar-1", emoji: "🦊", nome: "Raposa", cor: "#FF8A5B" },
  { chave: "avatar-2", emoji: "🐼", nome: "Panda", cor: "#B8E0D2" },
  { chave: "avatar-3", emoji: "🦁", nome: "Leão", cor: "#FFD45C" },
  { chave: "avatar-4", emoji: "🐸", nome: "Sapo", cor: "#8FE38F" },
  { chave: "avatar-5", emoji: "🦄", nome: "Unicórnio", cor: "#F5B8E8" },
  { chave: "avatar-6", emoji: "🐙", nome: "Polvo", cor: "#C7B8FF" },
  { chave: "avatar-7", emoji: "🐧", nome: "Pinguim", cor: "#9CD3FF" },
  { chave: "avatar-8", emoji: "🦖", nome: "Dinossauro", cor: "#A6E3A1" },
  { chave: "avatar-9", emoji: "🚀", nome: "Foguete", cor: "#FFB4A2" },
  { chave: "avatar-10", emoji: "🤖", nome: "Robô", cor: "#C9D6E8" },
  { chave: "avatar-11", emoji: "🦉", nome: "Coruja", cor: "#E8C39E" },
  { chave: "avatar-12", emoji: "🐯", nome: "Tigre", cor: "#FFC46B" },
];

export function Avatar({ chave, tamanho = 56, className }: { chave: string; tamanho?: number; className?: string }) {
  const a = AVATARES.find((x) => x.chave === chave) ?? AVATARES[0];
  return (
    <span
      role="img"
      aria-label={"Avatar " + a.nome}
      data-testid={"img-avatar-" + a.chave}
      className={cn("inline-flex shrink-0 items-center justify-center rounded-full border-[3px] border-foreground select-none", className)}
      style={{ width: tamanho, height: tamanho, background: a.cor, fontSize: tamanho * 0.55, lineHeight: 1 }}
    >
      <span aria-hidden="true">{a.emoji}</span>
    </span>
  );
}
