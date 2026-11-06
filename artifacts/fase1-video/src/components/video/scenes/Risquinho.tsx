import { motion } from 'framer-motion';
import { useState } from 'react';
import { useSceneTimer } from '@/lib/video';
import { sceneExit } from '../Milharal';
import { Teclado } from '../Aula';

export function Risquinho() {
  const [f, setF] = useState(0);
  useSceneTimer([{ time: 1200, callback: () => setF(1) }, { time: 2600, callback: () => setF(2) }, { time: 3900, callback: () => setF(3) }]);
  return (
    <motion.div className="absolute inset-0 dots grain overflow-hidden" style={{ background: 'var(--palha)' }}
      initial={{ clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' }} animate={{ clipPath: 'polygon(0 0, 120% 0, 100% 100%, -20% 100%)' }}
      transition={{ duration: 0.55, ease: [0.7, 0, 0.3, 1] }} exit={sceneExit}>
      <motion.h2 className="f-display absolute" style={{ left: 0, right: 0, top: '5vw', textAlign: 'center', fontSize: '5vw' }}
        initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
        Procure as teclas <span className="f-mono" style={{ color: 'var(--cerca)' }}>F</span> e <span className="f-mono" style={{ color: 'var(--cerca)' }}>J</span>.
      </motion.h2>
      <motion.div className="absolute" style={{ left: '50%', top: '14vw', x: '-50%' }} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: f >= 1 ? 1.08 : 1, opacity: 1 }} transition={{ type: 'spring', damping: 15, delay: 0.2 }}>
        <Teclado u={6.4} ativos={f >= 1 ? ['F', 'J'] : []} />
      </motion.div>
      {/* lupa no risquinho do F */}
      <motion.div className="absolute" style={{ left: '35vw', top: '21vw' }} initial={{ scale: 0 }} animate={f >= 2 ? { scale: 1 } : {}} transition={{ type: 'spring', stiffness: 260, damping: 14 }}>
        <div className="chunky grid place-items-center" style={{ width: '9vw', height: '9vw', borderRadius: '50%', background: '#FFFBEC' }}>
          <motion.div style={{ width: '4vw', height: '0.8vw', borderRadius: 9, background: 'var(--tinta)' }} animate={f >= 2 ? { scaleX: [1, 1.15, 1] } : {}} transition={{ repeat: Infinity, duration: 0.6 }} />
        </div>
      </motion.div>
      <motion.p className="absolute" style={{ left: 0, right: 0, top: '33vw', textAlign: 'center', fontSize: '3vw', fontWeight: 900 }}
        initial={{ opacity: 0, y: 30 }} animate={f >= 2 ? { opacity: 1, y: 0 } : {}}>
        Cada uma tem um <span style={{ background: 'var(--milho)', padding: '0 0.6vw', borderRadius: '0.6vw' }}>risquinho em relevo</span>.
      </motion.p>
      <motion.p className="f-display absolute" style={{ left: 0, right: 0, top: '39vw', textAlign: 'center', fontSize: '4vw', color: 'var(--verde)' }}
        initial={{ scale: 0 }} animate={f >= 3 ? { scale: 1, rotate: -2 } : {}} transition={{ type: 'spring', stiffness: 300, damping: 12 }}>
        Passe o dedo e você sente!
      </motion.p>
    </motion.div>
  );
}
