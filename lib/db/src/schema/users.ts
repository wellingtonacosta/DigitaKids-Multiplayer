import { pgTable, serial, text, integer, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const usersTable = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    nickname: text("nickname").notNull(),
    ipHash: text("ip_hash").notNull(),
    avatar: text("avatar").notNull(),
    totalPoints: integer("total_points").notNull().default(0),
    level: text("level").notNull().default("Pintinho"),
    streak: integer("streak").notNull().default(0),
    lastPlayedAt: timestamp("last_played_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("users_nickname_unique").on(t.nickname),
    uniqueIndex("users_nickname_ip_unique").on(t.nickname, t.ipHash),
  ],
);

export type User = typeof usersTable.$inferSelect;
