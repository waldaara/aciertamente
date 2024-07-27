import {
  serial,
  text,
  timestamp,
  pgTable,
  integer,
  doublePrecision,
} from "drizzle-orm/pg-core";

export const data = pgTable("data", {
  id: serial("id").primaryKey(),
  age: integer("age").notNull(),
  decibels: integer("decibels").notNull(),
  duration: doublePrecision("duration").notNull(),
  points: integer("points").notNull(),
  sex: text("sex").$type<"male" | "female">().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
