// src/lib/validations/todo.ts
import { z } from "zod"

export const todoSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  project: z.string().default("Default"),
  dueDate: z.date().optional(),
  dueTime: z.date().optional(), // This will hold the time component
  completed: z.boolean().default(false),
})

export type TodoFormValues = z.infer<typeof todoSchema>