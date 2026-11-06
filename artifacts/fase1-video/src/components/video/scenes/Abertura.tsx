import { motion } from 'framer-motion';
import { useState } from 'react';
import { useSceneTimer } from '@/lib/video';
import { Pintinho, Espiga, sceneExit } from '../Milharal';
import { Mao } from '../Aula';

export function Abertura() {
  const [f, setF] = useState(0);
  useSceneTimer([{ time: 900, callback: () => setF(1) }, { time: 2000, callback: () => setF(2) }]);
  return (
    <motion.div className="absolute inset-0 grain overflow-hidden" style={{ background: 'var(--verde-escuro)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={sceneExit}>
      <motion.p className="f-display absolute" style={{ left: '7vw', top: '8vw', fontSize: '2.6vw', color: 'var(--milho)' }}
        initial={{ x: -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
        Lição 1 · antes de começar
      </motion.p>
      <div className="absolute f-display" style={{ left: '7vw', top: '12vw', fontSize: '10vw', lineHeight: 0.9, color: 'var(--palha)' }}>
        {['Onde ficam', 'as mãos'].map((l, i) => (
          <div key={l} style={{ overflow: 'hidden' }}>
            <motion.div initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ delay: 0.35 + i * 0.18, duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}>
              {i === 1 ? <>as <span style={{ color: 'var(--milho)' }}>mãos</span></> : l}
            </motion.div>
          </div>
        ))}
      </div>
      <motion.div className="absolute chunky f-display" style={{ left: '7vw', bottom: '7vw', background: 'var(--cerca)', color: 'var(--palha)', borderColor: 'var(--palha)', boxShadow: '0.5vw 0.5vw 0 var(--milho)', borderRadius: '1vw', padding: '0.5vw 1.6vw', fontSize: '3vw' }}
        initial={{ scale: 0, rotate: -10 }} animate={f >= 2 ? { scale: 1, rotate: -3 } : {}} transition={{ type: 'spring', stiffness: 320, damping: 12 }}>
        Linha base
      </motion.div>
      <motion.div className="absolute flex items-end" style={{ right: '5vw', bottom: '5vw', gap: '1vw' }}>
        <motion.div initial={{ y: '40vw', rotate: -20 }} animate={{ y: 0, rotate: f >= 1 ? -6 : -20 }} transition={{ type: 'spring', damping: 13 }}><Mao lado="esquerda" ativos={[]} s={15} /></motion.div>
        <motion.div initial={{ y: '40vw', rotate: 20 }} animate={{ y: 0, rotate: f >= 1 ? 6 : 20 }} transition={{ type: 'spring', damping: 13, delay: 0.12 }}><Mao lado="direita" ativos={[]} s={15} /></motion.div>
      </motion.div>
      <motion.div className="absolute" style={{ right: '13vw', top: '4vw' }} initial={{ scale: 0 }} animate={{ scale: 1, rotate: [0, -10, 10, 0] }} transition={{ delay: 0.8, duration: 0.7 }}>
        <Pintinho s={11} />
      </motion.div>
      <motion.div className="absolute" style={{ right: '3vw', top: '6vw' }} initial={{ rotate: -40, opacity: 0 }} animate={{ rotate: 14, opacity: 1 }} transition={{ delay: 1 }}><Espiga h={9} /></motion.div>
    </motion.div>
  );
}
