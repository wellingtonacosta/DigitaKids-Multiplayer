import { motion } from 'framer-motion';
import { useState } from 'react';
import { useSceneTimer } from '@/lib/video';
import { sceneExit } from '../Milharal';

const IP = '189.42.17.8';
const HASH = 'a3f9c27e1b…';
const EMB = '#$%&*@!?=+';

export function Volta() {
  const [dias, setDias] = useState(0);
  const [h, setH] = useState(0);
  const [fim, setFim] = useState(false);
  useSceneTimer([
    ...Array.from({ length: 10 }, (_, i) => ({ time: 700 + i * 70, callback: () => setDias((i + 1) * 3) })),
    ...Array.from({ length: 12 }, (_, i) => ({ time: 1500 + i * 90, callback: () => setH(i + 1) })),
    { time: 3400, callback: () => setFim(true) },
  ]);
  const ipTxt = h === 0 ? IP : h >= 12 ? HASH : HASH.slice(0, h).padEnd(11, EMB[h % EMB.length]).slice(0, 11);
  const card = { background: '#FFFBEC', borderRadius: '2vw', padding: '2.2vw', width: '38vw' } as const;
  return (
    <motion.div className="absolute inset-0 grain overflow-hidden" style={{ background: 'var(--verde-escuro)' }}
      initial={{ x: '100%' }} animate={{ x: 0 }} transition={{ duration: 0.55, ease: [0.7, 0, 0.3, 1] }} exit={sceneExit}>
      <p className="f-display absolute" style={{ left: '6vw', top: '4vw', fontSize: '2vw', color: 'var(--milho)' }}>Passo 3</p>
      <h2 className="f-display absolute" style={{ left: '6vw', top: '6.6vw', fontSize: '4.6vw', color: 'var(--palha)' }}>Como o jogo lembra de você</h2>
      <motion.div className="absolute chunky" style={{ ...card, left: '6vw', top: '15vw' }} initial={{ y: '40vw', rotate: -8 }} animate={{ y: fim ? '-1vw' : 0, rotate: -1.5 }} transition={{ type: 'spring', stiffness: 130, damping: 15, delay: 0.15 }}>
        <svg viewBox="0 0 60 60" style={{ width: '7vw' }}><circle cx="30" cy="30" r="26" fill="#E8B26A" stroke="#142E22" strokeWidth="3" />{[[20, 20], [38, 18], [30, 34], [18, 40], [42, 40]].map(([x, y]) => <circle key={x + '' + y} cx={x} cy={y} r="3.5" fill="#6B3E1F" />)}</svg>
        <div className="f-display" style={{ fontSize: '2.8vw', marginTop: '0.6vw' }}>Cookie de sessão assinado</div>
        <div style={{ fontSize: '1.8vw', fontWeight: 800, opacity: 0.75 }}>guardado no seu navegador</div>
        <div className="f-mono" style={{ fontSize: '4.2vw', fontWeight: 700, color: 'var(--cerca)', marginTop: '0.6vw' }}>{dias} dias</div>
      </motion.div>
      <motion.div className="absolute chunky" style={{ ...card, right: '6vw', top: '15vw' }} initial={{ y: '40vw', rotate: 8 }} animate={{ y: fim ? '-1vw' : 0, rotate: 1.5 }} transition={{ type: 'spring', stiffness: 130, damping: 15, delay: 0.3 }}>
        <div className="f-display" style={{ fontSize: '2.8vw' }}>IP com hash</div>
        <div style={{ fontSize: '1.8vw', fontWeight: 800, opacity: 0.75 }}>o IP nunca fica salvo em texto puro</div>
        <div className="f-mono" style={{ fontSize: '3.6vw', fontWeight: 700, marginTop: '1.4vw', background: 'var(--tinta)', color: h >= 12 ? 'var(--milho)' : 'var(--palha)', borderRadius: '1vw', padding: '0.8vw 1.2vw' }}>
          {ipTxt}
        </div>
      </motion.div>
      <motion.div className="absolute f-display" style={{ left: 0, right: 0, bottom: '4vw', textAlign: 'center', fontSize: '3.8vw', color: 'var(--palha)' }}
        initial={{ opacity: 0, y: 40 }} animate={fim ? { opacity: 1, y: 0 } : {}} transition={{ type: 'spring', damping: 14 }}>
        Voltou no mesmo aparelho? <span style={{ color: 'var(--milho)' }}>Entra direto.</span>
      </motion.div>
    </motion.div>
  );
}
