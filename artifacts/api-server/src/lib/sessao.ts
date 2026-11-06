import type { Request } from "express";
import { eq } from "drizzle-orm";
import { db, usersTable, type User } from "@workspace/db";
import { SESSION_COOKIE, readSessionToken } from "./identity";

function cookieValue(header: string | undefined, name: string): string | undefined {
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return decodeURIComponent(v.join("="));
  }
  return undefined;
}

export async function jogadorDoCookie(header: string | undefined): Promise<User | null> {
  const id = readSessionToken(cookieValue(header, SESSION_COOKIE));
  if (!id) return null;
  const [u] = await db.select().from(usersTable).where(eq(usersTable.id, id));
  return u ?? null;
}

export async function jogadorDaSessao(req: Request): Promise<User | null> {
  const id = readSessionToken(cookieValue(req.headers.cookie, SESSION_COOKIE));
  if (!id) return null;
  const [u] = await db.select().from(usersTable).where(eq(usersTable.id, id));
  return u ?? null;
}
