import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import type { Request } from "express";

function secret(): string {
  const s = process.env["SESSION_SECRET"];
  if (!s) throw new Error("SESSION_SECRET must be set");
  return s;
}

// Salt do IP: usa IP_SALT se existir; senão deriva da SESSION_SECRET.
function ipSalt(): string {
  return (
    process.env["IP_SALT"] ??
    createHmac("sha256", secret()).update("digitakids-ip-salt").digest("hex")
  );
}

export function clientIp(req: Request): string {
  const fwd = req.headers["x-forwarded-for"];
  const first = (Array.isArray(fwd) ? fwd[0] : fwd)?.split(",")[0]?.trim();
  return first || req.socket.remoteAddress || "desconhecido";
}

export function hashIp(ip: string): string {
  return createHash("sha256").update(`${ipSalt()}:${ip}`).digest("hex");
}

const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;
export const SESSION_COOKIE = "dk_sessao";
export const SESSION_MAX_AGE_MS = MAX_AGE_MS;

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createSessionToken(userId: number): string {
  const payload = `${userId}.${Date.now() + MAX_AGE_MS}`;
  return `${payload}.${sign(payload)}`;
}

export function readSessionToken(token: string | undefined): number | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [id, exp, sig] = parts as [string, string, string];
  const expected = sign(`${id}.${exp}`);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  if (Number(exp) < Date.now()) return null;
  const userId = Number(id);
  return Number.isInteger(userId) ? userId : null;
}
