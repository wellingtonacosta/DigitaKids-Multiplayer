import { motion } from 'framer-motion';
import { useState } from 'react';
import { useSceneTimer } from '@/lib/video';
import { Cerca, Pintinho } from '../Milharal';
import { Teclado } from '../Aula';

const ALVO = 'asdf jklç fdsa çlkj sala fada saco lado dado jaca ala sal';

export function Treino() {
  const [n, setN] = useState(0);
  const [fim, setFim] = useState(false);
  useSceneTimer([
    ...Array.from({ length: 19 }, (_, i) => ({ time: 900 + i * 110, callback: () => setN(i + 1) })),
    { time: 3300, callback: () => setFim(true) },
  ]);
  const atual = ALVO[n]?.toUpperCase();
  return (
    <motion.div className="absolute inset-0 dots grain overflow-hidden" style={{ background: 'var(--palha)' }}
      initial={{ clipPath: 'inset(50% 0 50% 0)' }} animate={{ clipPath: 'inset(0% 0 0% 0)' }} transition={{ duration: 0.55, ease: [0.7, 0, 0.3, 1] }}
      exit={{ opacity: 0, transition: { duration: 0.4 } }}>
      <p className="f-display absolute" style={{ left: '6vw', top: '4vw', fontSize: '2vw', color: 'var(--verde)' }}>Lição 1 · Linha base</p>
      <h2 className="f-display absolute" style={{ left: '6vw', top: '6.6vw', fontSize: '3.6vw', lineHeight: 1.05, width: '70vw' }}>
        Os dedos descansam em <span className="f-mono">A S D F</span> e <span className="f-mono">J K L Ç</span>. Aqui começa a colheita!
      </h2>
      <div className="absolute chunky f-mono" style={{ left: '6vw', right: '6vw', top: '17vw', background: '#FFFBEC', borderRadius: '1.4vw', padding: '1.2vw 1.8vw', fontSize: '2.5vw', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden' }}>
        <span style={{ color: '#2E9E52' }}>{ALVO.slice(0, n)}</span>
        <span style={{ background: 'var(--milho)', borderRadius: '0.3vw' }}>{ALVO[n] === ' ' ? '\u00a0' : ALVO[n]}</span>
        <span style={{ opacity: 0.45 }}>{ALVO.slice(n + 1)}</span>
      </div>
      <div className="absolute" style={{ left: '50%', top: '25vw', transform: 'translateX(-50%) scale(0.85)', transformOrigin: 'top center' }}>
        <Teclado u={5.6} ativos={atual && atual !== ' ' ? [atual] : []} espaco={ALVO[n] === ' '} />
      </div>
      <motion.div className="absolute chunky f-display" style={{ right: '5vw', bottom: '6vw', background: 'var(--cerca)', color: 'var(--palha)', borderRadius: '1.2vw', padding: '0.8vw 1.6vw', fontSize: '2.8vw' }}
        initial={{ scale: 0 }} animate={fim ? { scale: 1, rotate: -3 } : {}} transition={{ type: 'spring', stiffness: 300, damping: 12 }}>
        Depois de cada tecla, volte para ela.
      </motion.div>
      <motion.div className="absolute" style={{ left: '4vw', bottom: '3vw' }} animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 0.7 }}>
        <Pintinho s={8} />
      </motion.div>
      <div className="absolute" style={{ left: 0, right: 0, bottom: 0 }}><Cerca /></div>
    </motion.div>
  );
}
