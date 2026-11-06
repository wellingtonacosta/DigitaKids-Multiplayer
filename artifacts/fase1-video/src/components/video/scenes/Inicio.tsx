import { motion } from 'framer-motion';
import { useState } from 'react';
import { useSceneTimer } from '@/lib/video';
import { AvatarBola, Cerca, Espiga, Pintinho } from '../Milharal';

export function Inicio() {
  const [f, setF] = useState(0);
  useSceneTimer([
    { time: 600, callback: () => setF(1) },
    { time: 1100, callback: () => setF(2) },
    { time: 1600, callback: () => setF(3) },
    { time: 3000, callback: () => setF(4) },
  ]);
  const pop = (on: boolean) => ({ initial: { scale: 0, opacity: 0 }, animate: on ? { scale: 1, opacity: 1 } : {}, transition: { type: 'spring' as const, stiffness: 300, damping: 14 } });
  return (
    <motion.div className="absolute inset-0 dots grain overflow-hidden" style={{ background: 'var(--palha)' }}
      initial={{ clipPath: 'inset(50% 0 50% 0)' }} animate={{ clipPath: 'inset(0% 0 0% 0)' }} transition={{ duration: 0.55, ease: [0.7, 0, 0.3, 1] }}
      exit={{ opacity: 0, transition: { duration: 0.4 } }}>
      <div className="absolute" style={{ left: '6vw', top: '6vw' }}>
        <p className="f-display" style={{ fontSize: '2vw', color: 'var(--verde)' }}>Pronto!</p>
        <h2 className="f-display" style={{ fontSize: '5.6vw', lineHeight: 0.95 }}>Bem-vindo à<br />tela inicial</h2>
      </div>
      <motion.div className="absolute chunky" style={{ right: '6vw', top: '5vw', width: '46vw', background: '#FFFBEC', borderRadius: '2vw', overflow: 'hidden' }}
        initial={{ y: '50vw', rotate: 6 }} animate={{ y: 0, rotate: -1 }} transition={{ type: 'spring', stiffness: 120, damping: 15, delay: 0.1 }}>
        <div className="flex items-center gap-[1vw]" style={{ background: 'var(--verde-escuro)', padding: '1.2vw 1.8vw', color: 'var(--palha)' }}>
          <AvatarBola i={10} s={4.2} /><span className="f-mono" style={{ fontSize: '2.2vw', fontWeight: 700 }}>teclinha22</span>
        </div>
        <div style={{ padding: '2vw 2.2vw' }} className="flex flex-col gap-[1.4vw]">
          <div className="flex gap-[1.4vw]">
            <motion.div {...pop(f >= 1)} className="flex items-center gap-[0.6vw]" style={{ flex: 1, background: 'var(--milho)', border: '0.25vw solid var(--tinta)', borderRadius: '1.2vw', padding: '0.8vw 1vw' }}>
              <Pintinho s={5.4} />
              <div><div style={{ fontSize: '1.4vw', fontWeight: 800 }}>nível</div><div className="f-display" style={{ fontSize: '2.8vw' }}>Pintinho</div></div>
            </motion.div>
            <motion.div {...pop(f >= 2)} className="flex items-center gap-[0.6vw]" style={{ flex: 1, background: 'var(--palha)', border: '0.25vw solid var(--tinta)', borderRadius: '1.2vw', padding: '0.8vw 1vw' }}>
              <Espiga h={5.4} />
              <div><div style={{ fontSize: '1.4vw', fontWeight: 800 }}>pontos</div><div className="f-mono" style={{ fontSize: '3.4vw', fontWeight: 700 }}>0</div></div>
            </motion.div>
          </div>
          <motion.div {...pop(f >= 3)} className="f-display grid place-items-center" style={{ background: 'var(--cerca)', color: 'var(--palha)', border: '0.28vw solid var(--tinta)', boxShadow: '0.45vw 0.45vw 0 var(--tinta)', borderRadius: '1.4vw', padding: '1.2vw', fontSize: '3.2vw' }}>
            <motion.span animate={f >= 3 ? { scale: [1, 1.08, 1] } : {}} transition={{ repeat: Infinity, duration: 0.9 }}>Começar</motion.span>
          </motion.div>
        </div>
      </motion.div>
      <motion.div className="absolute chunky f-display" style={{ left: '6vw', top: '21vw', background: 'var(--verde)', color: 'var(--palha)', borderRadius: '1.4vw', padding: '1.2vw 2vw', fontSize: '3vw', lineHeight: 1.05 }}
        {...pop(f >= 4)} animate={f >= 4 ? { scale: 1, opacity: 1, rotate: -4 } : {}}>
        Fase 1 concluída:<br /><span style={{ color: 'var(--milho)' }}>a porta está aberta.</span>
      </motion.div>
      <motion.div className="absolute" style={{ left: 0, right: 0, bottom: 0 }} initial={{ y: '6vw' }} animate={{ y: 0 }} transition={{ delay: 0.4, type: 'spring', damping: 14 }}>
        <Cerca />
      </motion.div>
    </motion.div>
  );
}
