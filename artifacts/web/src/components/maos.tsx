import { NOME_DEDO, type Dedo } from "@workspace/typing-core";
import { COR_DEDO } from "@/lib/dedos";

const TINTA = "hsl(150 38% 13%)";
const PELE = "#FCE9CF";

// Dedos da mão esquerda, do mindinho ao indicador: x, topo, altura.
const DEDOS_ESQ: { d: Dedo; x: number; y: number; h: number }[] = [
  { d: "mindinho-esquerdo", x: 14, y: 40, h: 46 },
  { d: "anelar-esquerdo", x: 38, y: 20, h: 64 },
  { d: "medio-esquerdo", x: 62, y: 10, h: 74 },
  { d: "indicador-esquerdo", x: 86, y: 22, h: 62 },
];

function Mao({ lado, ativos }: { lado: "esquerda" | "direita"; ativos: Dedo[] }) {
  const espelho = lado === "direita";
  const nome = (d: Dedo) => (espelho ? (d.replace("esquerdo", "direito") as Dedo) : d);
  const polegarAtivo = ativos.includes("polegar");
  return (
    <svg viewBox="0 0 150 150" className="w-full h-auto" aria-hidden="true">
      <g transform={espelho ? "translate(150 0) scale(-1 1)" : undefined}>
        <rect x="10" y="74" width="104" height="66" rx="30" fill={PELE} stroke={TINTA} strokeWidth="3" />
        {DEDOS_ESQ.map((f) => {
          const d = nome(f.d);
          const on = ativos.includes(d);
          return (
            <rect key={f.d} x={f.x} y={f.y - (on ? 6 : 0)} width="22" height={f.h + 14} rx="11"
              fill={on ? COR_DEDO[d].forte : COR_DEDO[d].clara} stroke={TINTA} strokeWidth={on ? 4 : 3}
              className="transition-all duration-150" />
          );
        })}
        <rect x="108" y="88" width="22" height="50" rx="11" transform="rotate(-48 119 113)"
          fill={polegarAtivo ? COR_DEDO.polegar.forte : COR_DEDO.polegar.clara} stroke={TINTA} strokeWidth={polegarAtivo ? 4 : 3} />
      </g>
    </svg>
  );
}

export function Maos({ dedos }: { dedos: Dedo[] }) {
  const texto = dedos.length ? "Use o " + dedos.map((d) => NOME_DEDO[d]).join(" e o ") : "";
  return (
    <div className="flex items-end justify-center gap-[8%] min-w-0">
      <div className="w-[34%] max-w-[150px]"><Mao lado="esquerda" ativos={dedos} /></div>
      <p className="flex-1 text-center font-bold text-sm sm:text-base self-center min-w-0" data-testid="text-dedo">{texto}</p>
      <div className="w-[34%] max-w-[150px]"><Mao lado="direita" ativos={dedos} /></div>
    </div>
  );
}
