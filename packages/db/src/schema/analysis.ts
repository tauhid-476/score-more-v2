import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const analyses = pgTable("analyses", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  subject: text("subject").notNull(),
  paperCount: integer("paper_count").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const questions = pgTable("questions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  analysisId: text("analysis_id")
    .notNull()
    .references(() => analyses.id, { onDelete: "cascade" }),
  question: text("question").notNull(),
  marks: integer("marks"),
  frequency: text("frequency").notNull(),
  solution: text("solution").notNull(),
  category: text("category", { enum: ["hot", "cool", "extras"] }).notNull(),
});

export const uploadedFiles = pgTable("uploaded_files", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  analysisId: text("analysis_id")
    .notNull()
    .references(() => analyses.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  name: text("name").notNull(),
});

// Relations
export const analysesRelations = relations(analyses, ({ one, many }) => ({
  user: one(user, { fields: [analyses.userId], references: [user.id] }),
  questions: many(questions),
  files: many(uploadedFiles),
}));

export const questionsRelations = relations(questions, ({ one }) => ({
  analysis: one(analyses, {
    fields: [questions.analysisId],
    references: [analyses.id],
  }),
}));

export const uploadedFilesRelations = relations(uploadedFiles, ({ one }) => ({
  analysis: one(analyses, {
    fields: [uploadedFiles.analysisId],
    references: [analyses.id],
  }),
}));
