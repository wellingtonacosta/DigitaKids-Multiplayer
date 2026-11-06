import { motion } from 'framer-motion';

const T = '#142E22';
const PELE = '#FCE9CF';
export const COR = {
  azul: { forte: '#2563C9', clara: '#CFE0F8' },
  verde: { forte: '#2E9E52', clara: '#CDEBD6' },
  amarelo: { forte: '#D9A90B', clara: '#FBEFB0' },
  vermelho: { forte: '#D6453A', clara: '#F8CFCA' },
  cinza: { forte: '#6F757D', clara: '#E2E4E7' },
};
export type CorDedo = keyof typeof COR;

/** Linha base ABNT2 com a cor do dedo de cada tecla. */
export const LINHA_BASE: { k: string; c: CorDedo }[] = [
  { k: 'A', c: 'azul' }, { k: 'S', c: 'verde' }, { k: 'D', c: 'amarelo' }, { k: 'F', c: 'vermelho' }, { k: 'G', c: 'vermelho' },
  { k: 'H', c: 'vermelho' }, { k: 'J', c: 'vermelho' }, { k: 'K', c: 'amarelo' }, { k: 'L', c: 'verde' }, { k: 'Ç', c: 'azul' }, { k: '~', c: 'azul' },
];

export function Teclado({ ativos = [], u = 6, semOlhar = false, espaco = false, pressionada }: {
  ativos?: string[]; u?: number; semOlhar?: boolean; espaco?: boolean; pressionada?: string;
}) {
  return (
    <div className="chunky" style={{ background: '#E9DFC0', borderRadius: `${u * 0.3}vw`, padding: `${u * 0.25}vw`, display: 'inline-flex', flexDirection: 'column', gap: `${u * 0.16}vw` }}>
      <div style={{ display: 'flex', gap: `${u * 0.16}vw` }}>
        {LINHA_BASE.map(({ k, c }) => {
          const on = ativos.includes(k);
          const cor = COR[c];
          return (
            <motion.div key={k} className="f-mono relative grid place-items-center"
              animate={{ y: pressionada === k ? u * 0.08 + 'vw' : '0vw', backgroundColor: on ? cor.forte : cor.clara }} transition={{ duration: 0.18 }}
              style={{ width: `${u}vw`, height: `${u}vw`, borderRadius: `${u * 0.18}vw`, border: `${u * 0.045}vw solid ${on ? T : cor.forte}`,
                boxShadow: `0 ${u * 0.06}vw 0 ${T}`, fontSize: `${u * 0.42}vw`, fontWeight: 700, color: on ? '#FFF8E6' : T }}>
              <span style={{ opacity: semOlhar ? 0 : 1, transition: 'opacity .3s' }}>{k}</span>
              {(k === 'F' || k === 'J') && (
                <span style={{ position: 'absolute', bottom: `${u * 0.16}vw`, width: `${u * 0.3}vw`, height: `${u * 0.06}vw`, borderRadius: 9, background: on ? '#FFF8E6' : T }} />
              )}
            </motion.div>
          );
        })}
      </div>
      <motion.div animate={{ backgroundColor: espaco ? COR.cinza.forte : COR.cinza.clara }}
        style={{ alignSelf: 'center', width: `${u * 6}vw`, height: `${u * 0.8}vw`, borderRadius: `${u * 0.18}vw`, border: `${u * 0.045}vw solid ${espaco ? T : COR.cinza.forte}`, boxShadow: `0 ${u * 0.06}vw 0 ${T}` }} />
    </div>
  );
}

const DEDOS: { c: CorDedo; x: number; y: number; h: number }[] = [
  { c: 'azul', x: 14, y: 40, h: 46 }, { c: 'verde', x: 38, y: 20, h: 64 }, { c: 'amarelo', x: 62, y: 10, h: 74 }, { c: 'vermelho', x: 86, y: 22, h: 62 },
];

/** Mão do app: lado direito é espelhado. `ativos` = cores dos dedos realçados (cinza = polegar). */
export function Mao({ lado, ativos, s = 14 }: { lado: 'esquerda' | 'direita'; ativos: CorDedo[]; s?: number }) {
  const pol = ativos.includes('cinza');
  return (
    <svg viewBox="0 0 150 150" style={{ width: `${s}vw`, height: `${s}vw`, overflow: 'visible' }}>
      <g transform={lado === 'direita' ? 'translate(150 0) scale(-1 1)' : undefined}>
        <rect x="10" y="74" width="104" height="66" rx="30" fill={PELE} stroke={T} strokeWidth="3" />
        {DEDOS.map((f) => {
          const on = ativos.includes(f.c);
          return <rect key={f.c} x={f.x} y={f.y - (on ? 6 : 0)} width="22" height={f.h + 14} rx="11" fill={on ? COR[f.c].forte : COR[f.c].clara} stroke={T} strokeWidth={on ? 4 : 3} />;
        })}
        <rect x="108" y="88" width="22" height="50" rx="11" transform="rotate(-48 119 113)" fill={pol ? COR.cinza.forte : COR.cinza.clara} stroke={T} strokeWidth={pol ? 4 : 3} />
      </g>
    </svg>
  );
}

export function Passo({ n, children, cor = 'var(--cerca)' }: { n: number; children: React.ReactNode; cor?: string }) {
  return (
    <div className="flex items-start gap-[1.4vw]">
      <div className="f-display chunky grid place-items-center" style={{ background: cor, color: 'var(--palha)', width: '5.4vw', height: '5.4vw', borderRadius: '50%', fontSize: '3.2vw', flexShrink: 0 }}>{n}</div>
      <div style={{ fontSize: '2.7vw', fontWeight: 900, lineHeight: 1.2 }}>{children}</div>
    </div>
  );
}
