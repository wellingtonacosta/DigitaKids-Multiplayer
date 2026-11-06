import { motion } from 'framer-motion';
import { useState } from 'react';
import { useSceneTimer } from '@/lib/video';
import { Pintinho, sceneExit } from '../Milharal';

const ITENS = ['Senha', 'E-mail', 'Dados pessoais'];

export function Privacidade() {
  const [r, setR] = useState(0);
  useSceneTimer([
    { time: 1300, callback: () => setR(1) },
    { time: 1900, callback: () => setR(2) },
    { time: 2500, callback: () => setR(3) },
    { time: 3300, callback: () => setR(4) },
  ]);
  return (
    <motion.div className="absolute inset-0 dots grain overflow-hidden" style={{ background: 'var(--palha)' }}
      initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ duration: 0.55, ease: [0.7, 0, 0.3, 1] }} exit={sceneExit}>
      <motion.p className="f-display absolute" style={{ left: '6vw', top: '5vw', fontSize: '2.6vw', color: 'var(--verde)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        Para entrar, você <u>não</u> precisa de…
      </motion.p>
      <div className="absolute flex flex-col" style={{ left: '6vw', top: '10vw', gap: '1.4vw' }}>
        {ITENS.map((t, i) => (
          <motion.div key={t} className="relative f-display" style={{ fontSize: '7.4vw', lineHeight: 1, width: 'fit-content' }}
            initial={{ x: '-70vw' }} animate={{ x: 0, opacity: r > i ? 0.45 : 1 }} transition={{ x: { type: 'spring', stiffness: 160, damping: 17, delay: 0.3 + i * 0.18 }, opacity: { duration: 0.2 } }}>
            {t}
            <motion.div className="absolute" style={{ left: '-1vw', right: '-1vw', top: '48%', height: '1.1vw', background: 'var(--cerca)', borderRadius: '1vw', transformOrigin: 'left', rotate: -3 }}
              initial={{ scaleX: 0 }} animate={{ scaleX: r > i ? 1 : 0 }} transition={{ duration: 0.25, ease: 'easeOut' }} />
          </motion.div>
        ))}
      </div>
      <motion.div className="absolute chunky f-display" style={{ right: '5vw', bottom: '6vw', background: 'var(--milho)', borderRadius: '1.6vw', padding: '1.6vw 2.4vw', fontSize: '4.4vw', lineHeight: 1 }}
        initial={{ scale: 0, rotate: 12 }} animate={r >= 4 ? { scale: 1, rotate: -3 } : {}} transition={{ type: 'spring', stiffness: 260, damping: 12 }}>
        Só apelido<br />+ avatar.
      </motion.div>
      <motion.div className="absolute" style={{ right: '9vw', top: '5vw' }} initial={{ scale: 0 }} animate={{ scale: 1, y: r >= 4 ? [0, -30, 0] : 0 }} transition={{ delay: 0.5 }}>
        <Pintinho s={15} />
      </motion.div>
    </motion.div>
  );
}
