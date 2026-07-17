import { baseApi } from "@/redux/api/baseApi";

import type { ApiResponse } from "@/redux/features/auth/types";
import type {
  Course,
  CoursePayload,
  CourseStructure,
  Lesson,
  LessonPayload,
  Milestone,
  MilestonePayload,
  CourseModule,
  ModulePayload,
  Quiz,
  QuizPayload,
} from "@/types/course-management";

const data = <T>(response: ApiResponse<T>) => response.data;
const structureTags = [
  "CourseStructure" as const,
  "Milestones" as const,
  "Modules" as const,
  "Lessons" as const,
  "Quizzes" as const,
];

export const courseManagementApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getManagedCourses: builder.query<Course[], void>({
      query: () => "/courses",
      transformResponse: data<Course[]>,
      providesTags: (result) => [
        "Courses",
        ...(result?.map(({ _id }) => ({ type: "Course" as const, id: _id })) ??
          []),
      ],
    }),
    getManagedCourse: builder.query<Course, string>({
      query: (id) => `/courses/${id}`,
      transformResponse: data<Course>,
      providesTags: (_r, _e, id) => [{ type: "Course", id }],
    }),
    getManagedCourseStructure: builder.query<CourseStructure, string>({
      query: (id) => `/courses/${id}/structure`,
      transformResponse: data<CourseStructure>,
      providesTags: (_r, _e, id) => [{ type: "CourseStructure", id }],
    }),
    createCourse: builder.mutation<Course, CoursePayload | FormData>({
      query: (body) => ({ url: "/courses", method: "POST", body }),
      transformResponse: data<Course>,
      invalidatesTags: ["Courses"],
    }),
    updateCourse: builder.mutation<
      Course,
      { id: string; body: Partial<CoursePayload> | FormData }
    >({
      query: ({ id, body }) => ({
        url: `/courses/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: data<Course>,
      invalidatesTags: (_r, _e, { id }) => [
        "Courses",
        { type: "Course", id },
        { type: "CourseStructure", id },
      ],
    }),
    publishCourse: builder.mutation<Course, string>({
      query: (id) => ({ url: `/courses/${id}/publish`, method: "PATCH" }),
      transformResponse: data<Course>,
      invalidatesTags: (_r, _e, id) => [
        "Courses",
        { type: "Course", id },
        { type: "CourseStructure", id },
      ],
    }),
    archiveCourse: builder.mutation<Course, string>({
      query: (id) => ({ url: `/courses/${id}/archive`, method: "PATCH" }),
      transformResponse: data<Course>,
      invalidatesTags: (_r, _e, id) => [
        "Courses",
        { type: "Course", id },
        { type: "CourseStructure", id },
      ],
    }),
    deleteCourse: builder.mutation<Course, string>({
      query: (id) => ({ url: `/courses/${id}`, method: "DELETE" }),
      transformResponse: data<Course>,
      invalidatesTags: ["Courses"],
    }),
    getMilestones: builder.query<Milestone[], void>({
      query: () => "/milestones",
      transformResponse: data<Milestone[]>,
      providesTags: ["Milestones"],
    }),
    getMilestone: builder.query<Milestone, string>({
      query: (id) => `/milestones/${id}`,
      transformResponse: data<Milestone>,
      providesTags: (_result, _error, id) => [{ type: "Milestone", id }],
    }),
    createMilestone: builder.mutation<Milestone, MilestonePayload>({
      query: (body) => ({ url: "/milestones", method: "POST", body }),
      transformResponse: data<Milestone>,
      invalidatesTags: structureTags,
    }),
    updateMilestone: builder.mutation<
      Milestone,
      { id: string; body: Partial<Omit<MilestonePayload, "course">> }
    >({
      query: ({ id, body }) => ({
        url: `/milestones/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: data<Milestone>,
      invalidatesTags: (_r, _e, { id }) => [
        ...structureTags,
        { type: "Milestone", id },
      ],
    }),
    deleteMilestone: builder.mutation<Milestone, string>({
      query: (id) => ({ url: `/milestones/${id}`, method: "DELETE" }),
      transformResponse: data<Milestone>,
      invalidatesTags: (_r, _e, id) => [
        ...structureTags,
        { type: "Milestone", id },
      ],
    }),
    getModules: builder.query<CourseModule[], void>({
      query: () => "/modules",
      transformResponse: data<CourseModule[]>,
      providesTags: ["Modules"],
    }),
    getModule: builder.query<CourseModule, string>({
      query: (id) => `/modules/${id}`,
      transformResponse: data<CourseModule>,
      providesTags: (_result, _error, id) => [{ type: "Module", id }],
    }),
    createModule: builder.mutation<CourseModule, ModulePayload>({
      query: (body) => ({ url: "/modules", method: "POST", body }),
      transformResponse: data<CourseModule>,
      invalidatesTags: structureTags,
    }),
    updateModule: builder.mutation<
      CourseModule,
      { id: string; body: Partial<Omit<ModulePayload, "milestone">> }
    >({
      query: ({ id, body }) => ({
        url: `/modules/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: data<CourseModule>,
      invalidatesTags: (_r, _e, { id }) => [
        ...structureTags,
        { type: "Module", id },
      ],
    }),
    deleteModule: builder.mutation<CourseModule, string>({
      query: (id) => ({ url: `/modules/${id}`, method: "DELETE" }),
      transformResponse: data<CourseModule>,
      invalidatesTags: (_r, _e, id) => [
        ...structureTags,
        { type: "Module", id },
      ],
    }),
    getLessons: builder.query<Lesson[], void>({
      query: () => "/lessons",
      transformResponse: data<Lesson[]>,
      providesTags: ["Lessons"],
    }),
    getManagedLesson: builder.query<Lesson, string>({
      query: (id) => `/lessons/${id}`,
      transformResponse: data<Lesson>,
      providesTags: (_result, _error, id) => [{ type: "Lesson", id }],
    }),
    createLesson: builder.mutation<Lesson, LessonPayload | FormData>({
      query: (body) => ({ url: "/lessons", method: "POST", body }),
      transformResponse: data<Lesson>,
      invalidatesTags: structureTags,
    }),
    updateLesson: builder.mutation<
      Lesson,
      { id: string; body: Partial<LessonPayload> | FormData }
    >({
      query: ({ id, body }) => ({
        url: `/lessons/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: data<Lesson>,
      invalidatesTags: (_r, _e, { id }) => [
        ...structureTags,
        { type: "Lesson", id },
      ],
    }),
    deleteLesson: builder.mutation<Lesson, string>({
      query: (id) => ({ url: `/lessons/${id}`, method: "DELETE" }),
      transformResponse: data<Lesson>,
      invalidatesTags: (_r, _e, id) => [
        ...structureTags,
        { type: "Lesson", id },
      ],
    }),
    getQuizzes: builder.query<Quiz[], void>({
      query: () => "/quizzes",
      transformResponse: data<Quiz[]>,
      providesTags: ["Quizzes"],
    }),
    getQuiz: builder.query<Quiz, string>({
      query: (id) => `/quizzes/${id}`,
      transformResponse: data<Quiz>,
      providesTags: (_result, _error, id) => [{ type: "Quiz", id }],
    }),
    createQuiz: builder.mutation<Quiz, QuizPayload>({
      query: (body) => ({ url: "/quizzes", method: "POST", body }),
      transformResponse: data<Quiz>,
      invalidatesTags: structureTags,
    }),
    updateQuiz: builder.mutation<
      Quiz,
      { id: string; body: Partial<Omit<QuizPayload, "module">> }
    >({
      query: ({ id, body }) => ({
        url: `/quizzes/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: data<Quiz>,
      invalidatesTags: (_r, _e, { id }) => [
        ...structureTags,
        { type: "Quiz", id },
      ],
    }),
    deleteQuiz: builder.mutation<Quiz, string>({
      query: (id) => ({ url: `/quizzes/${id}`, method: "DELETE" }),
      transformResponse: data<Quiz>,
      invalidatesTags: (_r, _e, id) => [...structureTags, { type: "Quiz", id }],
    }),
  }),
});

export const {
  useGetManagedCoursesQuery,
  useGetManagedCourseQuery,
  useGetManagedCourseStructureQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  usePublishCourseMutation,
  useArchiveCourseMutation,
  useDeleteCourseMutation,
  useGetMilestonesQuery,
  useGetMilestoneQuery,
  useCreateMilestoneMutation,
  useUpdateMilestoneMutation,
  useDeleteMilestoneMutation,
  useGetModulesQuery,
  useGetModuleQuery,
  useCreateModuleMutation,
  useUpdateModuleMutation,
  useDeleteModuleMutation,
  useGetLessonsQuery,
  useGetManagedLessonQuery,
  useCreateLessonMutation,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
  useGetQuizzesQuery,
  useGetQuizQuery,
  useCreateQuizMutation,
  useUpdateQuizMutation,
  useDeleteQuizMutation,
} = courseManagementApi;
