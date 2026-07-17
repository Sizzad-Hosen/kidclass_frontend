export type CourseCategory =
  | "english"
  | "bangla"
  | "math"
  | "science"
  | "art"
  | "coding"
  | "general";

export type EntityRef = { _id: string; title?: string; name?: string };

export type Course = {
  _id: string;
  title: string;
  description?: string;
  thumbnailImage?: string;
  price: number;
  category: CourseCategory;
  isPublished: boolean;
  courseManager?: EntityRef | string;
  createdAt?: string;
  updatedAt?: string;
};

export type Milestone = {
  _id: string;
  course: EntityRef | string;
  title: string;
  order: number;
  modules?: CourseModule[];
  createdAt?: string;
  updatedAt?: string;
};

export type CourseModule = {
  _id: string;
  milestone: EntityRef | string;
  title: string;
  order: number;
  lessons?: Lesson[];
  quizzes?: Quiz[];
  createdAt?: string;
  updatedAt?: string;
};

export type LessonContentType = "video" | "text" | "pdf" | "image";

export type Lesson = {
  _id: string;
  module: EntityRef | string;
  order: number;
  title: string;
  contentType: LessonContentType;
  duration?: number;
  videoUrl?: string;
  contentNotes: string;
  createdAt?: string;
  updatedAt?: string;
};

export type QuizOption = { text: string; isCorrect: boolean };
export type QuizQuestion = { questionText: string; points: number; options: QuizOption[] };

export type Quiz = {
  _id: string;
  module: EntityRef | string;
  title: string;
  passingScore: number;
  questions: QuizQuestion[];
  createdAt?: string;
  updatedAt?: string;
};

export type CourseStructure = { course: Course; milestones: Milestone[] };

export type CoursePayload = {
  title: string;
  description?: string;
  thumbnailImage?: string;
  price: number;
  category: CourseCategory;
  isPublished: boolean;
};

export type MilestonePayload = { course: string; title: string; order: number };
export type ModulePayload = { milestone: string; title: string; order: number };
export type LessonPayload = {
  module: string;
  order: number;
  title: string;
  contentType: LessonContentType;
  duration?: number;
  videoUrl?: string;
  contentNotes: string;
};
export type QuizPayload = {
  module: string;
  title: string;
  passingScore: number;
  questions: QuizQuestion[];
};
