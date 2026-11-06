import { pgTable, serial, text, integer, real, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const lessonsTable = pgTable("lessons", {
  id: serial("id").primaryKey(),
  order: integer("order").notNull(),
  title: text("title").notNull(),
  targetText: text("target_text").notNull(),
  keysFocus: text("keys_focus").notNull(),
});

export const lessonResultsTable = pgTable("lesson_results", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  lessonId: integer("lesson_id").notNull().references(() => lessonsTable.id),
  wpm: real("wpm").notNull(),
  accuracy: real("accuracy").notNull(),
  stars: integer("stars").notNull(),
  leftHandPercent: real("left_hand_percent").notNull(),
  rightHandPercent: real("right_hand_percent").notNull(),
  errorsByKeyJson: text("errors_by_key_json").notNull().default("{}"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
