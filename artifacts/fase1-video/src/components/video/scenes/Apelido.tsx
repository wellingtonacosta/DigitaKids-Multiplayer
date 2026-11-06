import { motion } from 'framer-motion';
import { useState } from 'react';
import { useSceneTimer } from '@/lib/video';
import { AvatarBola, Pintinho, sceneExit } from '../Milharal';

const NOME = 'Teclinha22';
const REGRAS = ['3 a 16 letras ou números', 'sem espaços', 'só um jogador com esse nome'];

export function Apelido() {
  const [n, setN] = useState(0);
  const [regras, setRegras] = useState(0);
  const [minus, setMinus] = useState(false);
  const ev = [
    ...NOME.split('').map((_, i) => ({ time: 900 + i * 140, callback: () => setN(i + 1) })),
    { time: 1300, callback: () => setRegras(1) },
    { time: 2500, callback: () => setRegras(2) },
    { time: 3700, callback: () => setRegras(3) },
    { time: 4500, callback: () => setMinus(true) },
  ];
  useSceneTimer(ev);
  const texto = minus ? NOME.toLowerCase() : NOME.slice(0, n);
  return (
    <motion.div className="absolute inset-0 dots grain overflow-hidden" style={{ background: 'var(--palha)' }}
      initial={{ clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' }} animate={{ clipPath: 'polygon(0 0, 120% 0, 100% 100%, -20% 100%)' }}
      transition={{ duration: 0.55, ease: [0.7, 0, 0.3, 1] }} exit={sceneExit}>
      <div className="absolute" style={{ left: '6vw', top: '9vw', width: '40vw' }}>
        <motion.p className="f-display" style={{ fontSize: '2vw', color: 'var(--verde)' }} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>Passo 1</motion.p>
        <motion.h2 className="f-display" style={{ fontSize: '6.4vw', lineHeight: 0.95, margin: '0.5vw 0 2.5vw' }} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, type: 'spring', damping: 14 }}>
          Escolha um <span style={{ background: 'var(--milho)', padding: '0 0.8vw', borderRadius: '0.8vw', display: 'inline-block', transform: 'rotate(-2deg)' }}>apelido</span>
        </motion.h2>
        <div className="flex flex-col gap-[1.1vw]">
          {REGRAS.map((r, i) => (
            <motion.div key={r} className="chunky flex items-center gap-[1vw]" style={{ background: i === 2 ? 'var(--cerca)' : 'var(--verde)', color: 'var(--palha)', borderRadius: '1vw', padding: '0.8vw 1.4vw', fontSize: '2.3vw', fontWeight: 900, width: 'fit-content' }}
              initial={{ x: '-50vw', rotate: -6 }} animate={regras > i ? { x: 0, rotate: 0 } : {}} transition={{ type: 'spring', stiffness: 200, damping: 16 }}>
              <span className="f-mono" style={{ color: 'var(--milho)' }}>{i + 1}</span>{r}
            </motion.div>
          ))}
        </div>
      </div>
      <motion.div className="absolute chunky" style={{ right: '6vw', top: '11vw', width: '42vw', background: '#FFFBEC', borderRadius: '2vw', padding: '2.4vw' }}
        initial={{ y: '60vw', rotate: 8 }} animate={{ y: 0, rotate: 1.5 }} transition={{ type: 'spring', stiffness: 120, damping: 15, delay: 0.25 }}>
        <div className="f-display" style={{ fontSize: '2.2vw' }}>Seu apelido</div>
        <div className="flex items-center gap-[1vw]" style={{ marginTop: '1.2vw' }}>
          <AvatarBola i={0} s={5.4} />
          <div className="f-mono" style={{ flex: 1, border: '0.28vw solid var(--tinta)', borderRadius: '1vw', padding: '1vw 1.4vw', fontSize: '3vw', fontWeight: 700, background: 'var(--palha)', whiteSpace: 'nowrap' }}>
            <motion.span key={minus ? 'm' : 'n'} initial={minus ? { color: '#317A4A', opacity: 0.3 } : false} animate={{ color: '#142E22', opacity: 1 }}>{texto}</motion.span>
            <span className="caret" style={{ color: 'var(--cerca)' }}>|</span>
          </div>
        </div>
        <div className="f-mono" style={{ textAlign: 'right', fontSize: '1.6vw', marginTop: '0.6vw', opacity: 0.7 }}>{texto.length}/16</div>
        <motion.div className="flex items-center gap-[1vw]" style={{ marginTop: '1.2vw', background: 'var(--milho)', border: '0.22vw solid var(--tinta)', borderRadius: '1vw', padding: '0.8vw 1.2vw', fontSize: '1.9vw', fontWeight: 900 }}
          initial={{ scale: 0, opacity: 0 }} animate={minus ? { scale: 1, opacity: 1 } : {}} transition={{ type: 'spring', stiffness: 300, damping: 13 }}>
          <span className="f-mono">Aa → aa</span> guardado em minúsculas
        </motion.div>
      </motion.div>
      <motion.div className="absolute" style={{ right: '3vw', bottom: '1vw' }} initial={{ y: '20vw' }} animate={{ y: 0, rotate: [0, -8, 8, 0] }} transition={{ delay: 1, duration: 0.8 }}>
        <Pintinho s={9} />
      </motion.div>
    </motion.div>
  );
}
