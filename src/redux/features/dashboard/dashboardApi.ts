import { baseApi } from "@/redux/api/baseApi";
import type { ApiResponse } from "@/redux/features/auth/types";

export type DashboardOverview = {
  users: { total: number; students: number; admins: number; superAdmins: number; active: number };
  courses: { total: number; published: number; draft: number };
  enrollments: { total: number; active: number; completed: number; cancelled: number };
  content: { lessons: number; quizzes: number; assignments: number };
  certificates: { issued: number };
  assignments: { pendingReview: number };
  revenue: { totalPaid: number };
};

export type DashboardMetadata = {
  categories?: number;
  classes?: number;
  roles?: string[];
  [key: string]: unknown;
};

export type DashboardActivity = {
  _id?: string;
  id?: string;
  user?: string;
  userName?: string;
  action?: string;
  target?: string;
  status?: string;
  time?: string;
  createdAt?: string;
  [key: string]: unknown;
};

export type DashboardRevenue = {
  total?: number;
  monthly?: number;
  currency?: string;
  series?: Array<{ label: string; value: number }>;
  [key: string]: unknown;
};

export type DashboardCourseSummary = {
  _id?: string;
  title?: string;
  category?: string;
  price?: number;
  isPublished?: boolean;
  enrollmentCount?: number;
  milestoneCount?: number;
  progress?: number;
  completionRate?: number;
  [key: string]: unknown;
};

export type DashboardStudentSummary = {
  total?: number;
  active?: number;
  newThisMonth?: number;
  averageProgress?: number;
  [key: string]: unknown;
};

export type DashboardEnrollmentSummary = {
  total?: number;
  active?: number;
  newThisMonth?: number;
  [key: string]: unknown;
};

const unwrap = <T>(response: ApiResponse<T>) => response.data;

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardOverview: builder.query<DashboardOverview, void>({
      query: () => "/dashboard/overview",
      transformResponse: unwrap<DashboardOverview>,
      providesTags: ["Dashboard"],
    }),
    getDashboardMetadata: builder.query<DashboardMetadata, void>({
      query: () => "/dashboard/metadata",
      transformResponse: unwrap<DashboardMetadata>,
      providesTags: ["Dashboard"],
    }),
    getDashboardRecentActivity: builder.query<DashboardActivity[], void>({
      query: () => "/dashboard/recent-activity",
      transformResponse: unwrap<DashboardActivity[]>,
      providesTags: ["Dashboard"],
    }),
    getDashboardRevenue: builder.query<DashboardRevenue, void>({
      query: () => "/dashboard/revenue",
      transformResponse: unwrap<DashboardRevenue>,
      providesTags: ["Dashboard"],
    }),
    getDashboardCourses: builder.query<DashboardCourseSummary[], void>({
      query: () => "/dashboard/courses",
      transformResponse: unwrap<DashboardCourseSummary[]>,
      providesTags: ["Dashboard"],
    }),
    getDashboardStudents: builder.query<DashboardStudentSummary, void>({
      query: () => "/dashboard/students",
      transformResponse: unwrap<DashboardStudentSummary>,
      providesTags: ["Dashboard"],
    }),
    getDashboardEnrollments: builder.query<DashboardEnrollmentSummary, void>({
      query: () => "/dashboard/enrollments",
      transformResponse: unwrap<DashboardEnrollmentSummary>,
      providesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useGetDashboardCoursesQuery,
  useGetDashboardEnrollmentsQuery,
  useGetDashboardMetadataQuery,
  useGetDashboardOverviewQuery,
  useGetDashboardRecentActivityQuery,
  useGetDashboardRevenueQuery,
  useGetDashboardStudentsQuery,
} = dashboardApi;
