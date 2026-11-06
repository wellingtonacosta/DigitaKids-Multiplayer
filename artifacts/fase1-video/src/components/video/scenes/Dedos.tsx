import { motion } from 'framer-motion';
import { useState } from 'react';
import { useSceneTimer } from '@/lib/video';
import { sceneExit } from '../Milharal';
import { COR, Mao, Passo, Teclado, type CorDedo } from '../Aula';

const ETAPAS: { teclas: string[]; cor: CorDedo }[] = [
  { teclas: ['D', 'K'], cor: 'amarelo' },
  { teclas: ['S', 'L'], cor: 'verde' },
  { teclas: ['A', 'Ç'], cor: 'azul' },
];
const LEGENDA: { nome: string; c: CorDedo }[] = [
  { nome: 'Mindinho', c: 'azul' }, { nome: 'Anelar', c: 'verde' }, { nome: 'Dedo do meio', c: 'amarelo' }, { nome: 'Indicador', c: 'vermelho' }, { nome: 'Polegar', c: 'cinza' },
];

export function Dedos() {
  const [f, setF] = useState(0);
  useSceneTimer([{ time: 1300, callback: () => setF(1) }, { time: 2000, callback: () => setF(2) }, { time: 2700, callback: () => setF(3) }]);
  const ativos = ['F', 'J', ...ETAPAS.slice(0, f).flatMap((e) => e.teclas)];
  const cores: CorDedo[] = ['vermelho', ...ETAPAS.slice(0, f).map((e) => e.cor)];
  return (
    <motion.div className="absolute inset-0 dots grain overflow-hidden" style={{ background: 'var(--palha)' }}
      initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ duration: 0.55, ease: [0.7, 0, 0.3, 1] }} exit={sceneExit}>
      <motion.div className="absolute" style={{ left: '6vw', right: '6vw', top: '4.5vw' }} initial={{ x: '-60vw' }} animate={{ x: 0 }} transition={{ type: 'spring', damping: 16, delay: 0.2 }}>
        <Passo n={2} cor="var(--verde)">Os outros dedos ficam ao lado:<br /><span className="f-mono">A S D</span> na mão esquerda e <span className="f-mono">K L Ç</span> na mão direita.</Passo>
      </motion.div>
      <div className="absolute flex items-end" style={{ left: '50%', top: '14vw', transform: 'translateX(-50%)', gap: '20vw' }}>
        <Mao lado="esquerda" ativos={cores} s={14} />
        <Mao lado="direita" ativos={cores} s={14} />
      </div>
      <div className="absolute" style={{ left: '50%', top: '29vw', transform: 'translateX(-50%)' }}>
        <Teclado u={6} ativos={ativos} />
      </div>
      <div className="absolute flex justify-center" style={{ left: 0, right: 0, bottom: '2.6vw', gap: '1.6vw' }}>
        {LEGENDA.map((l, i) => (
          <motion.div key={l.nome} className="flex items-center gap-[0.6vw]" style={{ fontSize: '1.9vw', fontWeight: 900 }}
            initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 3.1 + i * 0.1 }}>
            <span style={{ width: '1.8vw', height: '1.8vw', borderRadius: '0.4vw', background: COR[l.c].clara, border: `0.25vw solid ${COR[l.c].forte}` }} />{l.nome}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
