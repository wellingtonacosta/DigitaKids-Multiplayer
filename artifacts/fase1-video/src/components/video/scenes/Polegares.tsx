import { motion } from 'framer-motion';
import { useState } from 'react';
import { useSceneTimer } from '@/lib/video';
import { sceneExit } from '../Milharal';
import { Mao, Passo, Teclado } from '../Aula';

const TODAS = ['A', 'S', 'D', 'F', 'J', 'K', 'L', 'Ç'];

export function Polegares() {
  const [f, setF] = useState(0);
  useSceneTimer([{ time: 1100, callback: () => setF(1) }, { time: 2600, callback: () => setF(2) }]);
  return (
    <motion.div className="absolute inset-0 grain overflow-hidden" style={{ background: f >= 2 ? 'var(--verde-escuro)' : '#FFF6DE', transition: 'background .5s' }}
      initial={{ x: '100%' }} animate={{ x: 0 }} transition={{ duration: 0.55, ease: [0.7, 0, 0.3, 1] }} exit={sceneExit}>
      <motion.div className="absolute" style={{ left: '6vw', right: '6vw', top: '4.5vw' }} initial={{ x: '-60vw' }} animate={{ x: 0, opacity: f >= 2 ? 0 : 1 }} transition={{ type: 'spring', damping: 16, delay: 0.2 }}>
        <Passo n={3} cor="#6F757D">Os polegares descansam na barra de espaço.</Passo>
      </motion.div>
      <motion.p className="f-display absolute" style={{ left: '6vw', right: '6vw', top: '3.5vw', fontSize: '3.6vw', color: 'var(--palha)', lineHeight: 1.1 }}
        initial={{ opacity: 0, y: 30 }} animate={f >= 2 ? { opacity: 1, y: 0 } : {}}>
        O risquinho serve para você achar a posição <span style={{ color: 'var(--milho)' }}>sem olhar para o teclado.</span>
      </motion.p>
      <motion.div className="absolute" style={{ left: '50%', top: '17vw', x: '-50%' }} animate={{ scale: f >= 2 ? 0.92 : 1 }}>
        <div className="flex justify-center" style={{ gap: '16vw', marginBottom: '-3vw', position: 'relative', zIndex: 2 }}>
          <Mao lado="esquerda" ativos={f >= 1 ? ['vermelho', 'amarelo', 'verde', 'azul', 'cinza'] : ['vermelho', 'amarelo', 'verde', 'azul']} s={15} />
          <Mao lado="direita" ativos={f >= 1 ? ['vermelho', 'amarelo', 'verde', 'azul', 'cinza'] : ['vermelho', 'amarelo', 'verde', 'azul']} s={15} />
        </div>
        <Teclado u={6} ativos={TODAS} espaco={f >= 1} semOlhar={f >= 2} />
      </motion.div>
    </motion.div>
  );
}
