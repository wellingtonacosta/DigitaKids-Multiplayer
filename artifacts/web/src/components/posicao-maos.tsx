import { ArrowRight, PlayCircle } from "lucide-react";
import type { Dedo } from "@workspace/typing-core";
import { Maos } from "@/components/maos";
import { TecladoVirtual } from "@/components/teclado-virtual";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const REPOUSO: Dedo[] = [
  "mindinho-esquerdo", "anelar-esquerdo", "medio-esquerdo", "indicador-esquerdo",
  "indicador-direito", "medio-direito", "anelar-direito", "mindinho-direito", "polegar",
];
const TECLAS_REPOUSO = ["KeyA", "KeyS", "KeyD", "KeyF", "KeyJ", "KeyK", "KeyL", "Semicolon", "Space"];

/** Introdução da lição 1: onde ficam as mãos no teclado. */
export function PosicaoMaos({ onComecar }: { onComecar: () => void }) {
  return (
    <div className="space-y-4 min-w-0" data-testid="intro-posicao-maos">
      <div>
        <p className="font-bold text-secondary">Lição 1 · antes de começar</p>
        <h1 className="font-display text-2xl sm:text-4xl font-extrabold">Onde ficam as mãos</h1>
      </div>

      <section className="chunky rounded-3xl bg-card p-4 sm:p-6 space-y-3 text-base sm:text-lg">
        <p>
          Procure as teclas <strong className="font-mono">F</strong> e <strong className="font-mono">J</strong>. Cada uma tem um
          risquinho em relevo. Passe o dedo e você sente!
        </p>
        <ol className="list-decimal pl-6 space-y-1 font-semibold">
          <li>Coloque os dois indicadores sobre o risquinho: o esquerdo no F e o direito no J.</li>
          <li>Os outros dedos ficam ao lado: A S D na mão esquerda e K L Ç na mão direita.</li>
          <li>Os polegares descansam na barra de espaço.</li>
        </ol>
        <p className="text-muted-foreground">
          O risquinho serve para você achar a posição sem olhar para o teclado. Depois de cada tecla, volte para ela.
        </p>
      </section>

      <Dialog>
        <DialogTrigger asChild>
          <button data-testid="button-ver-animacao"
            className="chunky-btn inline-flex items-center gap-2 rounded-xl bg-accent text-accent-foreground px-5 py-3 font-bold">
            <PlayCircle className="h-5 w-5" aria-hidden="true" />Ver a animação da aula
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl w-[95vw] p-3 sm:p-4">
          <DialogTitle className="font-display text-xl font-extrabold">Onde ficam as mãos</DialogTitle>
          <DialogDescription className="sr-only">Animação de 31 segundos que mostra a posição das mãos no teclado.</DialogDescription>
          <div className="aspect-video w-full overflow-hidden rounded-xl border-2 border-foreground bg-black">
            <iframe src="/fase1-video/" title="Animação: onde ficam as mãos" allow="autoplay" className="h-full w-full border-0" data-testid="iframe-animacao" />
          </div>
        </DialogContent>
      </Dialog>

      <Maos dedos={REPOUSO} legenda="Indicadores em F e J" />
      <TecladoVirtual alvos={TECLAS_REPOUSO} rotuloAria="Teclado com as mãos na posição inicial: A S D F e J K L Ç" />

      <button onClick={onComecar} data-testid="button-comecar-treino"
        className="chunky-btn inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-3 font-bold text-lg">
        Começar o treino<ArrowRight className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );
}
