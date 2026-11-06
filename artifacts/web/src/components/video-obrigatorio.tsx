import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

const DURACAO_S = 31;

/** Animação da lição 1 em tela cheia; só libera o botão de continuar quando termina. */
export function VideoObrigatorio({ onContinuar }: { onContinuar: () => void }) {
  const [restam, setRestam] = useState(DURACAO_S);

  useEffect(() => {
    const t = setInterval(() => setRestam((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div role="dialog" aria-modal="true" aria-label="Animação da lição 1" data-testid="video-obrigatorio"
      className="fixed inset-0 z-50 flex flex-col bg-black">
      <div className="min-h-0 flex-1">
        <iframe src="/fase1-video/" title="Animação: onde ficam as mãos" allow="autoplay" className="h-full w-full border-0" data-testid="iframe-animacao-obrigatoria" />
      </div>
      <div className="flex items-center justify-center gap-4 bg-black p-3">
        {restam > 0 ? (
          <p className="font-bold text-white" aria-live="polite" data-testid="text-video-restam">Assista até o fim · {restam}s</p>
        ) : (
          <button onClick={onContinuar} autoFocus data-testid="button-continuar-video"
            className="chunky-btn inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-3 font-bold text-lg">
            Continuar<ArrowRight className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}
