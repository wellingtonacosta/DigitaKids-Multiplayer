import type { Request, Response, NextFunction } from "express";
import { clientIp } from "./identity";

export function rateLimit(max: number, windowMs: number) {
  const hits = new Map<string, { count: number; reset: number }>();
  return (req: Request, res: Response, next: NextFunction): void => {
    const now = Date.now();
    const key = clientIp(req);
    const entry = hits.get(key);
    if (!entry || entry.reset < now) {
      hits.set(key, { count: 1, reset: now + windowMs });
      next();
      return;
    }
    entry.count += 1;
    if (entry.count > max) {
      res.status(429).json({ erro: "Calma! Tente de novo em alguns instantes." });
      return;
    }
    next();
  };
}
