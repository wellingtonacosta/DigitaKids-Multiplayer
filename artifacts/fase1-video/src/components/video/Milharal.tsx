import type { TargetAndTransition } from 'framer-motion';
const T = '#142E22';

export function Espiga({ h = 10, style }: { h?: number; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 40 64" style={{ width: `${h * 0.625}vw`, height: `${h}vw`, ...style }}>
      <path d="M20 60 C6 52 4 40 8 30 C12 44 16 50 20 60Z" fill="#4E9A5A" stroke={T} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M20 60 C34 52 36 40 32 30 C28 44 24 50 20 60Z" fill="#3E8450" stroke={T} strokeWidth="2.5" strokeLinejoin="round" />
      <ellipse cx="20" cy="27" rx="10" ry="22" fill="#F7C531" stroke={T} strokeWidth="2.5" />
      {[12, 19, 26, 33, 40].map((y) => (
        <g key={y} fill="#E09E1B"><circle cx="15.5" cy={y} r="2.2" /><circle cx="20" cy={y - 2} r="2.2" /><circle cx="24.5" cy={y} r="2.2" /></g>
      ))}
    </svg>
  );
}

export function Pintinho({ s = 12, feliz = true, style }: { s?: number; feliz?: boolean; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 100 100" style={{ width: `${s}vw`, height: `${s}vw`, overflow: 'visible', ...style }}>
      <ellipse cx="50" cy="92" rx="26" ry="5" fill={T} opacity=".15" />
      <path d="M40 84 l-4 8 M40 84 l0 9 M60 84 l4 8 M60 84 l0 9" stroke="#E07B1F" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="50" cy="62" rx="30" ry="25" fill="#FBD545" stroke={T} strokeWidth="3" />
      <circle cx="50" cy="36" r="20" fill="#FBD545" stroke={T} strokeWidth="3" />
      <path d="M46 17 q2 -8 6 -2 q3 -6 5 2" fill="#FBD545" stroke={T} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M24 60 q-10 4 -6 14 q8 0 12 -6" fill="#F2B92C" stroke={T} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M76 60 q10 4 6 14 q-8 0 -12 -6" fill="#F2B92C" stroke={T} strokeWidth="2.5" strokeLinejoin="round" />
      {feliz ? (
        <><path d="M39 34 q3 -4 6 0" stroke={T} strokeWidth="3" fill="none" strokeLinecap="round" /><path d="M55 34 q3 -4 6 0" stroke={T} strokeWidth="3" fill="none" strokeLinecap="round" /></>
      ) : (
        <><circle cx="42" cy="34" r="3" fill={T} /><circle cx="58" cy="34" r="3" fill={T} /></>
      )}
      <path d="M45 42 l5 6 l5 -6 z" fill="#E07B1F" stroke={T} strokeWidth="2" strokeLinejoin="round" />
      <circle cx="36" cy="44" r="3.5" fill="#F49A8C" opacity=".8" /><circle cx="64" cy="44" r="3.5" fill="#F49A8C" opacity=".8" />
    </svg>
  );
}

export function Galo({ s = 14, style }: { s?: number; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 120 120" style={{ width: `${s}vw`, height: `${s}vw`, ...style }}>
      <path d="M78 70 q30 -30 22 -50 q-10 14 -18 18 q8 -20 -2 -30 q-4 20 -12 30" fill="#2F7A4A" stroke={T} strokeWidth="3" strokeLinejoin="round" />
      <path d="M86 52 q20 -6 26 6 q-14 -2 -22 6" fill="#C2402F" stroke={T} strokeWidth="3" strokeLinejoin="round" />
      <ellipse cx="62" cy="76" rx="30" ry="24" fill="#FFF4D8" stroke={T} strokeWidth="3" />
      <path d="M40 64 q-6 -26 8 -38 q14 -6 18 8 q2 16 -6 30" fill="#FFF4D8" stroke={T} strokeWidth="3" strokeLinejoin="round" />
      <path d="M44 26 q0 -12 6 -10 q2 -10 8 -4 q4 -8 8 2 q-4 6 -8 6 z" fill="#C2402F" stroke={T} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M40 36 l-12 5 l12 4 z" fill="#F2B92C" stroke={T} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M42 45 q-4 10 4 12 q3 -6 0 -12" fill="#C2402F" stroke={T} strokeWidth="2.5" />
      <circle cx="51" cy="34" r="3" fill={T} />
      <path d="M58 72 q12 -6 22 4 q-10 10 -22 6" fill="#F2B92C" stroke={T} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M54 98 v14 M70 98 v14 M48 112 h12 M64 112 h12" stroke="#E07B1F" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

export function Cerca({ style }: { style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 400 40" preserveAspectRatio="none" style={{ width: '100%', height: '4vw', display: 'block', ...style }}>
      <rect x="0" y="12" width="400" height="6" fill="#B24A35" />
      <rect x="0" y="26" width="400" height="6" fill="#B24A35" />
      {Array.from({ length: 11 }, (_, i) => (
        <path key={i} d={`M${i * 40 + 4} 40 V6 l6 -5 l6 5 V40 z`} fill="#C9573F" stroke={T} strokeWidth="2" />
      ))}
    </svg>
  );
}

export const AVATARES = [
  { n: 'Raposa', c: '#FF8A5B' }, { n: 'Panda', c: '#B8E0D2' }, { n: 'Leão', c: '#FFD45C' }, { n: 'Sapo', c: '#8FE38F' },
  { n: 'Unicórnio', c: '#F5B8E8' }, { n: 'Polvo', c: '#C7B8FF' }, { n: 'Pinguim', c: '#9CD3FF' }, { n: 'Dinossauro', c: '#A6E3A1' },
  { n: 'Foguete', c: '#FFB4A2' }, { n: 'Robô', c: '#C9D6E8' }, { n: 'Coruja', c: '#E8C39E' }, { n: 'Tigre', c: '#FFC46B' },
];

export function AvatarBola({ i, s = 6 }: { i: number; s?: number }) {
  const a = AVATARES[i];
  return (
    <div className="f-display" style={{ width: `${s}vw`, height: `${s}vw`, borderRadius: '50%', background: a.c, border: `${s * 0.05}vw solid ${T}`,
      display: 'grid', placeItems: 'center', fontSize: `${s * 0.48}vw`, color: T, flexShrink: 0 }}>
      {a.n[0]}
    </div>
  );
}

/** Wipe de palha: faixa amarela diagonal que varre a tela na saída de cada cena. */
export const sceneExit: TargetAndTransition = { opacity: 0, scale: 1.04, transition: { duration: 0.45, ease: [0.6, 0, 0.8, 0.2] } };
