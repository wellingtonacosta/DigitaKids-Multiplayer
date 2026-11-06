import { motion } from 'framer-motion';
import { useState } from 'react';
import { useSceneTimer } from '@/lib/video';
import { Pintinho, Espiga, sceneExit } from '../Milharal';

const TECLAS = ['A', 'S', 'D', 'F', 'J', 'K', 'L', 'Ç'];
const BICADAS = [1, 3, 6]; // índices das teclas bicadas

export function Abertura() {
  const [fase, setFase] = useState(0);
  useSceneTimer([
    { time: 350, callback: () => setFase(1) },
    { time: 750, callback: () => setFase(2) },
    { time: 1150, callback: () => setFase(3) },
    { time: 2200, callback: () => setFase(4) },
  ]);
  const bicada = fase >= 1 && fase <= 3 ? BICADAS[fase - 1] : -1;
  return (
    <motion.div className="absolute inset-0 grain overflow-hidden" style={{ background: 'var(--verde-escuro)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={sceneExit}>
      {/* parte 1: catando milho */}
      <motion.div className="absolute inset-0 flex flex-col items-center justify-center"
        animate={fase >= 4 ? { y: '-110%', rotate: -4 } : { y: 0 }} transition={{ duration: 0.6, ease: [0.7, 0, 0.3, 1] }}>
        <motion.h2 className="f-display" style={{ fontSize: '7.5vw', color: 'var(--milho)', marginBottom: '2vw' }}
          initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 14, delay: 0.1 }}>
          Catar milho?
        </motion.h2>
        <div className="relative flex gap-[1vw]">
          {TECLAS.map((k, i) => (
            <motion.div key={k} className="chunky f-mono grid place-items-center"
              style={{ width: '7vw', height: '7vw', borderRadius: '1vw', fontSize: '3vw', fontWeight: 700,
                background: i === bicada ? 'var(--milho)' : 'var(--palha)' }}
              animate={{ y: i === bicada ? '0.6vw' : 0 }} transition={{ duration: 0.08 }}>{k}</motion.div>
          ))}
          <motion.div className="absolute" style={{ top: '-10.5vw', left: 0 }}
            animate={{ x: bicada >= 0 ? `${bicada * 8 + 0.5}vw` : '-12vw', rotate: bicada >= 0 ? 18 : 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}>
            <Pintinho s={10} feliz={false} />
          </motion.div>
        </div>
        <p style={{ fontSize: '2.2vw', color: 'var(--palha)', marginTop: '2.5vw', fontWeight: 800 }}>uma tecla de cada vez…</p>
      </motion.div>
      {/* parte 2: logo */}
      <motion.div className="absolute inset-0 flex items-center justify-center gap-[2vw]"
        initial={{ y: '110%' }} animate={fase >= 4 ? { y: 0 } : { y: '110%' }} transition={{ duration: 0.6, ease: [0.7, 0, 0.3, 1] }}>
        <motion.div animate={fase >= 4 ? { rotate: [-20, 12] } : {}} transition={{ duration: 0.8 }}><Espiga h={16} /></motion.div>
        <div>
          <div className="f-display" style={{ fontSize: '12vw', lineHeight: 0.9, color: 'var(--palha)' }}>
            Digita<span style={{ color: 'var(--milho)' }}>Kids</span>
          </div>
          <motion.div className="inline-block f-display chunky"
            style={{ background: 'var(--cerca)', color: 'var(--palha)', fontSize: '3.4vw', padding: '0.4vw 1.6vw', borderRadius: '1vw', marginTop: '1.4vw', borderColor: 'var(--palha)', boxShadow: '0.5vw 0.5vw 0 var(--milho)' }}
            initial={{ scale: 0, rotate: -10 }} animate={fase >= 4 ? { scale: 1, rotate: -3 } : {}} transition={{ type: 'spring', stiffness: 320, damping: 12, delay: 0.5 }}>
            Fase 1 · a entrada
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
