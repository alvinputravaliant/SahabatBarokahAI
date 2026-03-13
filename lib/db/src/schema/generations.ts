import { pgTable, serial, text, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const generationsTable = pgTable("generations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  tool: text("tool").notNull(),
  input: jsonb("input").notNull(),
  result: text("result").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertGenerationSchema = createInsertSchema(generationsTable).omit({
  id: true,
  createdAt: true,
});

export type InsertGeneration = z.infer<typeof insertGenerationSchema>;
export type Generation = typeof generationsTable.$inferSelect;
