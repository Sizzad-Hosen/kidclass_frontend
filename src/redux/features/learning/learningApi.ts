import { baseApi } from "@/redux/api/baseApi";
import type { ApiResponse } from "@/redux/features/auth/types";

export type Id = string;

export type Course = {
  _id?: Id;
  id?: Id;
  title: string;
  description?: string;
  thumbnailImage?: string;
  price?: number;
  category?: string;
  isPublished?: boolean;
};

export type Lesson = {
  _id?: Id;
  id?: Id;
  title: string;
  order?: number;
  contentType?: "video" | "pdf" | "text" | "image" | string;
  duration?: number;
  videoUrl?: string;
  contentNotes?: string;
  status?: LessonProgressStatus;
};

export type Quiz = {
  _id?: Id;
  id?: Id;
  title?: string;
};

export type Assignment = {
  _id?: Id;
  id?: Id;
  title: string;
  instructions?: string;
  assessmentParts?: Array<"quiz" | "writing" | "picture" | string>;
  questions?: AssignmentQuestion[];
  points?: number;
  dueDate?: string;
  submission?: AssignmentSubmission | null;
};

export type AssignmentSubmission = {
  _id?: Id;
  id?: Id;
  score?: number;
  totalPoints?: number;
  passed?: boolean;
  submittedAt?: string;
  gradedAt?: string;
};

export type AssignmentQuestion = {
  _id?: Id;
  id?: Id;
  questionText: string;
  options: { text: string; isCorrect?: boolean }[];
  points?: number;
};

export type CourseModule = {
  _id?: Id;
  id?: Id;
  title: string;
  order?: number;
  lessons?: Lesson[];
  quizzes?: Quiz[];
};

export type Milestone = {
  _id?: Id;
  id?: Id;
  title: string;
  order?: number;
  modules?: CourseModule[];
  assignments?: Assignment[];
};

export type CourseStructure = {
  course: Course;
  milestones: Milestone[];
};

export type EnrollmentStatus = "active" | "completed" | "cancelled";

export type Enrollment = {
  _id?: Id;
  id?: Id;
  course?: Course;
  status?: EnrollmentStatus;
  enrolledAt?: string;
  completedAt?: string;
};

export type LessonProgressStatus = "not-started" | "in-progress" | "completed";

export type ProgressRecord = {
  _id?: Id;
  id?: Id;
  lesson?: Lesson;
  status?: LessonProgressStatus;
  watchedSeconds?: number;
  completedAt?: string;
};

export type CourseProgress = {
  enrollment?: Enrollment;
  completionPercentage?: number;
  lessons?: {
    completed?: number;
    total?: number;
    progress?: ProgressRecord[];
  };
  quizzes?: {
    passed?: number;
    total?: number;
  };
  finalAssignment?: {
    required?: boolean;
    submitted?: boolean;
    passed?: boolean;
    scorePercentage?: number | null;
  };
};

export type StudentLearningSummary = {
  enrolledCourses: number;
  completedLessons: number;
};

export type Certificate = {
  _id?: Id;
  id?: Id;
  certificateNo?: string;
  issuedAt?: string;
  certificateUrl?: string;
  recipientName?: string;
  recipientEmail?: string;
  courseName?: string;
  className?: string;
  subject?: string;
  issuerName?: string;
  issuerEmail?: string;
  enrollment?: Enrollment;
  status?: "valid" | string;
};

export type AssignmentSubmissionPayload = {
  content?: string;
  fileUrl?: string;
  answers?: { question: string; selectedOptionIndexes: number[] }[];
  picture?: FileList;
};

const unwrap = <T>(response: ApiResponse<T>) => response.data;
export const getId = (item?: { _id?: Id; id?: Id } | string | null) =>
  typeof item === "string" ? item : item?._id ?? item?.id ?? "";

export const learningApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCourses: builder.query<Course[], void>({
      query: () => "/courses",
      transformResponse: unwrap<Course[]>,
      providesTags: ["Courses"],
    }),
    getCourse: builder.query<Course, Id>({
      query: (courseId) => `/courses/${courseId}`,
      transformResponse: unwrap<Course>,
      providesTags: (_result, _error, courseId) => [{ type: "Course", id: courseId }],
    }),
    getCourseDetails: builder.query<CourseStructure, Id>({
      query: (courseId) => `/courses/${courseId}/details`,
      transformResponse: unwrap<CourseStructure>,
      providesTags: (_result, _error, courseId) => [{ type: "Course", id: courseId }],
    }),
    getCourseStructure: builder.query<CourseStructure, Id>({
      query: (courseId) => `/courses/${courseId}/structure`,
      transformResponse: unwrap<CourseStructure>,
      providesTags: (_result, _error, courseId) => [{ type: "Course", id: courseId }],
    }),
    createEnrollment: builder.mutation<Enrollment, { course: Id }>({
      query: (body) => ({
        url: "/enrollments",
        method: "POST",
        body,
      }),
      transformResponse: unwrap<Enrollment>,
      invalidatesTags: ["Enrollments", "Progress"],
    }),
    getMyEnrollments: builder.query<Enrollment[], void>({
      query: () => "/enrollments/me",
      transformResponse: unwrap<Enrollment[]>,
      providesTags: ["Enrollments"],
    }),
    getEnrollment: builder.query<Enrollment, Id>({
      query: (enrollmentId) => `/enrollments/${enrollmentId}`,
      transformResponse: unwrap<Enrollment>,
      providesTags: (_result, _error, enrollmentId) => [
        { type: "Enrollments", id: enrollmentId },
      ],
    }),
    cancelEnrollment: builder.mutation<Enrollment, Id>({
      query: (enrollmentId) => ({
        url: `/enrollments/${enrollmentId}/cancel`,
        method: "PATCH",
      }),
      transformResponse: unwrap<Enrollment>,
      invalidatesTags: ["Enrollments", "Progress"],
    }),
    getProgressByCourse: builder.query<CourseProgress, Id>({
      query: (courseId) => `/progress/courses/${courseId}`,
      transformResponse: unwrap<CourseProgress>,
      providesTags: ["Progress"],
    }),
    getProgressByEnrollment: builder.query<CourseProgress, Id>({
      query: (enrollmentId) => `/progress/enrollments/${enrollmentId}`,
      transformResponse: unwrap<CourseProgress>,
      providesTags: ["Progress"],
    }),
    getStudentLearningSummary: builder.query<StudentLearningSummary, void>({
      query: () => "/progress/me/summary",
      transformResponse: unwrap<StudentLearningSummary>,
      providesTags: ["Progress"],
    }),
    getLesson: builder.query<Lesson, Id>({
      query: (lessonId) => `/lessons/${lessonId}`,
      transformResponse: unwrap<Lesson>,
    }),
    updateLessonProgress: builder.mutation<
      ProgressRecord,
      { lessonId: Id; status: LessonProgressStatus; watchedSeconds?: number }
    >({
      query: ({ lessonId, status, watchedSeconds = 0 }) => ({
        url: `/progress/lessons/${lessonId}`,
        method: "PATCH",
        body: { status, watchedSeconds },
      }),
      transformResponse: unwrap<ProgressRecord>,
      invalidatesTags: ["Progress", "Enrollments"],
    }),
    getAssignment: builder.query<Assignment, Id>({
      query: (assignmentId) => `/assignments/${assignmentId}`,
      transformResponse: unwrap<Assignment>,
    }),
    getMyAssignments: builder.query<Assignment[], void>({
      query: () => "/assignments/me",
      transformResponse: unwrap<Assignment[]>,
      providesTags: ["Assignments"],
    }),
    submitAssignment: builder.mutation<
      unknown,
      { assignmentId: Id; payload: AssignmentSubmissionPayload }
    >({
      query: ({ assignmentId, payload }) => {
        const picture = payload.picture?.[0];

        if (picture) {
          const formData = new FormData();
          formData.append("content", payload.content || "Picture submission attached.");
          if (payload.answers?.length) {
            formData.append("answers", JSON.stringify(payload.answers));
          }
          formData.append("picture", picture);

          return {
            url: `/assignments/${assignmentId}/submissions`,
            method: "POST",
            body: formData,
          };
        }

        return {
          url: `/assignments/${assignmentId}/submissions`,
          method: "POST",
          body: payload,
        };
      },
      transformResponse: unwrap<unknown>,
      invalidatesTags: ["Progress", "Certificates", "Assignments"],
    }),
    getCertificates: builder.query<Certificate[], void>({
      query: () => "/certificates",
      transformResponse: (response: ApiResponse<Certificate[]>) =>
        response.data.filter((certificate) => Boolean(certificate.enrollment)),
      providesTags: ["Certificates"],
    }),
    verifyCertificate: builder.query<Certificate, Id>({
      query: (certificateNo) => `/certificates/verify/${certificateNo}`,
      transformResponse: unwrap<Certificate>,
    }),
  }),
});

export const {
  useCancelEnrollmentMutation,
  useCreateEnrollmentMutation,
  useGetAssignmentQuery,
  useGetCertificatesQuery,
  useGetCourseDetailsQuery,
  useGetCourseQuery,
  useGetCoursesQuery,
  useGetCourseStructureQuery,
  useGetEnrollmentQuery,
  useGetLessonQuery,
  useGetMyAssignmentsQuery,
  useGetMyEnrollmentsQuery,
  useGetProgressByCourseQuery,
  useGetProgressByEnrollmentQuery,
  useGetStudentLearningSummaryQuery,
  useSubmitAssignmentMutation,
  useUpdateLessonProgressMutation,
  useVerifyCertificateQuery,
} = learningApi;
