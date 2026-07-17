import { z } from "zod";

export const courseSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(150),
  description: z.string().trim().max(2000).optional(),
  thumbnailImage: z.union([z.literal(""), z.string().url("Enter a valid image URL")]).optional(),
  price: z.number().min(0, "Price cannot be negative"),
  category: z.enum(["english", "bangla", "math", "science", "art", "coding", "general"]),
  isPublished: z.boolean(),
});

export const hierarchyItemSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(150),
  order: z.number().int().min(1, "Order must be at least 1"),
});

export const lessonSchema = hierarchyItemSchema.extend({
  contentType: z.enum(["video", "text", "pdf", "image"]),
  duration: z.number().int().min(0).optional(),
  videoUrl: z.union([z.literal(""), z.string().url("Enter a valid video URL")]).optional(),
  contentNotes: z.string().trim().min(1, "Lesson content is required"),
});

export const quizSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
  passingScore: z.number().min(0).max(100),
  questions: z.array(z.object({
    questionText: z.string().trim().min(1, "Question is required"),
    points: z.number().int().min(1),
    options: z.array(z.object({ text: z.string().trim().min(1), isCorrect: z.boolean() }))
      .min(2, "Add at least two options")
      .refine((options) => options.some((option) => option.isCorrect), "Select a correct answer"),
  })).min(1, "Add at least one question"),
});

export type CourseFormValues = z.infer<typeof courseSchema>;
export type HierarchyItemValues = z.infer<typeof hierarchyItemSchema>;
export type LessonFormValues = z.infer<typeof lessonSchema>;
export type QuizFormValues = z.infer<typeof quizSchema>;
