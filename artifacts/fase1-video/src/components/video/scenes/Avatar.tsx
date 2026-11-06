import { motion } from 'framer-motion';
import { useState } from 'react';
import { useSceneTimer } from '@/lib/video';
import { AVATARES, AvatarBola, Galo, sceneExit } from '../Milharal';

const SALTOS = [2, 9, 5, 7];

export function Avatar() {
  const [k, setK] = useState(-1);
  useSceneTimer([
    { time: 1100, callback: () => setK(0) },
    { time: 1650, callback: () => setK(1) },
    { time: 2200, callback: () => setK(2) },
    { time: 2750, callback: () => setK(3) },
  ]);
  const sel = k >= 0 ? SALTOS[k] : -1;
  const travado = k === 3;
  return (
    <motion.div className="absolute inset-0 grain overflow-hidden" style={{ background: 'var(--verde)' }}
      initial={{ clipPath: 'circle(0% at 50% 50%)' }} animate={{ clipPath: 'circle(80% at 50% 50%)' }} transition={{ duration: 0.6, ease: [0.7, 0, 0.3, 1] }} exit={sceneExit}>
      <div className="absolute" style={{ left: '6vw', top: '7vw' }}>
        <p className="f-display" style={{ fontSize: '2vw', color: 'var(--milho)' }}>Passo 2</p>
        <h2 className="f-display" style={{ fontSize: '6vw', color: 'var(--palha)', lineHeight: 0.95, marginTop: '0.4vw' }}>Escolha<br />seu avatar</h2>
        <motion.div className="chunky f-display" style={{ marginTop: '2.4vw', background: 'var(--palha)', borderRadius: '1.2vw', padding: '1vw 1.6vw', fontSize: '2.6vw', width: 'fit-content' }}
          initial={{ scale: 0 }} animate={travado ? { scale: 1, rotate: -3 } : {}} transition={{ type: 'spring', stiffness: 320, damping: 12 }}>
          {sel >= 0 ? AVATARES[sel].n : ''} escolhido!
        </motion.div>
        <motion.div style={{ marginTop: '1vw' }} initial={{ x: '-30vw' }} animate={{ x: 0 }} transition={{ delay: 0.5, type: 'spring', damping: 14 }}><Galo s={13} /></motion.div>
      </div>
      <div className="absolute grid grid-cols-4" style={{ right: '6vw', top: '9vw', gap: '1.6vw', padding: '2.2vw', background: 'var(--palha)', borderRadius: '2vw', border: '0.28vw solid var(--tinta)', boxShadow: '0.6vw 0.6vw 0 var(--tinta)' }}>
        {AVATARES.map((a, i) => (
          <motion.div key={a.n} className="relative" initial={{ scale: 0, rotate: -30 }} animate={{ scale: i === sel ? 1.18 : 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 14, delay: k < 0 ? 0.3 + i * 0.05 : 0 }}>
            <div style={{ padding: '0.5vw', borderRadius: '1.4vw', background: i === sel ? 'var(--milho)' : 'transparent', border: `0.25vw solid ${i === sel ? '#142E22' : 'transparent'}` }}>
              <AvatarBola i={i} s={6.4} />
            </div>
            {i === sel && travado && (
              <motion.div className="absolute f-display grid place-items-center" style={{ top: '-1vw', right: '-1vw', width: '2.8vw', height: '2.8vw', borderRadius: '50%', background: 'var(--verde)', color: 'var(--palha)', border: '0.2vw solid var(--tinta)', fontSize: '1.6vw' }}
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 10 }}>
                <svg viewBox="0 0 24 24" style={{ width: '1.6vw' }}><path d="M5 12l5 5L19 7" stroke="#F6EFD6" strokeWidth="4" fill="none" strokeLinecap="round" /></svg>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
