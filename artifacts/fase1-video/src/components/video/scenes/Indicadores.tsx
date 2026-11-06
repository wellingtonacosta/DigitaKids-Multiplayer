import { motion } from 'framer-motion';
import { useState } from 'react';
import { useSceneTimer } from '@/lib/video';
import { sceneExit } from '../Milharal';
import { Mao, Passo, Teclado } from '../Aula';

export function Indicadores() {
  const [f, setF] = useState(0);
  useSceneTimer([{ time: 1300, callback: () => setF(1) }, { time: 1700, callback: () => setF(2) }]);
  return (
    <motion.div className="absolute inset-0 grain overflow-hidden" style={{ background: '#FFF6DE' }}
      initial={{ clipPath: 'circle(0% at 50% 50%)' }} animate={{ clipPath: 'circle(80% at 50% 50%)' }} transition={{ duration: 0.6, ease: [0.7, 0, 0.3, 1] }} exit={sceneExit}>
      <motion.div className="absolute" style={{ left: '6vw', right: '6vw', top: '4.5vw' }} initial={{ x: '-60vw' }} animate={{ x: 0 }} transition={{ type: 'spring', damping: 16, delay: 0.2 }}>
        <Passo n={1}>Coloque os dois indicadores sobre o risquinho:<br />o <span style={{ color: '#D6453A' }}>esquerdo no F</span> e o <span style={{ color: '#D6453A' }}>direito no J</span>.</Passo>
      </motion.div>
      <div className="absolute" style={{ left: '50%', top: '27vw', transform: 'translateX(-50%)' }}>
        <Teclado u={6} ativos={f >= 1 ? ['F', 'J'] : []} pressionada={f === 1 ? 'F' : undefined} />
      </div>
      <motion.div className="absolute" style={{ left: '17vw', top: '13vw' }} initial={{ y: '-30vw' }} animate={{ y: f >= 1 ? '2vw' : 0 }} transition={{ type: 'spring', stiffness: 200, damping: 14 }}>
        <Mao lado="esquerda" ativos={['vermelho']} s={17} />
      </motion.div>
      <motion.div className="absolute" style={{ right: '17vw', top: '13vw' }} initial={{ y: '-30vw' }} animate={{ y: f >= 2 ? '2vw' : 0 }} transition={{ type: 'spring', stiffness: 200, damping: 14 }}>
        <Mao lado="direita" ativos={['vermelho']} s={17} />
      </motion.div>
      <motion.div className="absolute chunky f-display" style={{ right: '5vw', bottom: '4vw', background: '#D6453A', color: '#FFF8E6', borderRadius: '1vw', padding: '0.6vw 1.4vw', fontSize: '2.4vw' }}
        initial={{ scale: 0 }} animate={f >= 2 ? { scale: 1, rotate: -3 } : {}} transition={{ type: 'spring', stiffness: 300, damping: 12, delay: 0.3 }}>
        Indicadores em F e J
      </motion.div>
    </motion.div>
  );
}
