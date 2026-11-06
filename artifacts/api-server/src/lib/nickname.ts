const BAD_WORDS = [
  "porra", "caralho", "merda", "bosta", "puta", "viado", "buceta", "cacete",
  "foder", "fuder", "cuzao", "arrombado", "desgraca", "babaca", "idiota", "otario",
  "retardado", "fdp", "pnc", "vsf", "tnc", "pqp", "cu",
];

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/0/g, "o")
    .replace(/1/g, "i")
    .replace(/3/g, "e")
    .replace(/4/g, "a")
    .replace(/5/g, "s")
    .replace(/7/g, "t");
}

export const NICKNAME_RE = /^[\p{L}\p{N}]{3,16}$/u;

export function hasBadWord(nickname: string): boolean {
  const n = normalize(nickname);
  return BAD_WORDS.some((w) => (w.length <= 3 ? n === w : n.includes(w)));
}

export const AVATARS = Array.from({ length: 12 }, (_, i) => `avatar-${i + 1}`);
