import { pgTable, serial, text, integer, real, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const raceTextsTable = pgTable("race_texts", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  difficulty: integer("difficulty").notNull(),
  source: text("source").notNull().default(""),
});

export const roomsTable = pgTable("rooms", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  hostUserId: integer("host_user_id").notNull().references(() => usersTable.id),
  status: text("status").notNull().default("aberta"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const racesTable = pgTable("races", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").notNull().references(() => roomsTable.id),
  raceTextId: integer("race_text_id").notNull().references(() => raceTextsTable.id),
  startedAt: timestamp("started_at", { withTimezone: true }),
  finishedAt: timestamp("finished_at", { withTimezone: true }),
});

export const raceResultsTable = pgTable("race_results", {
  id: serial("id").primaryKey(),
  raceId: integer("race_id").notNull().references(() => racesTable.id),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  position: integer("position").notNull(),
  wpm: real("wpm").notNull(),
  accuracy: real("accuracy").notNull(),
  pointsAwarded: integer("points_awarded").notNull().default(0),
});
