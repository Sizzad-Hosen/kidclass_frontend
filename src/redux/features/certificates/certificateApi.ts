import { baseApi } from "@/redux/api/baseApi";
import type { ApiResponse } from "@/redux/features/auth/types";
import type { Course } from "@/types/course-management";

export type CertificateTemplatePayload = {
  title: string;
  course: string;
  className: string;
  subject: string;
  issuerName: string;
  issuerEmail: string;
};

export type CertificateTemplate = Omit<CertificateTemplatePayload, "course"> & {
  _id: string;
  course: Course | string;
  isPublished?: boolean;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CertificatePublishResult = {
  totalEnrollments: number;
  eligible: number;
  published: number;
  alreadyPublished: number;
};

const unwrap = <T>(response: ApiResponse<T>) => response.data;

export const certificateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCertificateTemplates: builder.query<CertificateTemplate[], void>({
      query: () => "/certificates/templates",
      transformResponse: unwrap<CertificateTemplate[]>,
      providesTags: ["Certificates"],
    }),
    createCertificateTemplate: builder.mutation<CertificateTemplate, CertificateTemplatePayload>({
      query: (body) => ({ url: "/certificates/templates", method: "POST", body }),
      transformResponse: unwrap<CertificateTemplate>,
      invalidatesTags: ["Certificates"],
    }),
    updateCertificateTemplate: builder.mutation<
      CertificateTemplate,
      { id: string; body: Partial<CertificateTemplatePayload> }
    >({
      query: ({ id, body }) => ({ url: `/certificates/templates/${id}`, method: "PATCH", body }),
      transformResponse: unwrap<CertificateTemplate>,
      invalidatesTags: ["Certificates"],
    }),
    deleteCertificateTemplate: builder.mutation<CertificateTemplate, string>({
      query: (id) => ({ url: `/certificates/templates/${id}`, method: "DELETE" }),
      transformResponse: unwrap<CertificateTemplate>,
      invalidatesTags: ["Certificates"],
    }),
    publishCertificateTemplate: builder.mutation<CertificatePublishResult, string>({
      query: (id) => ({ url: `/certificates/templates/${id}/publish`, method: "POST" }),
      transformResponse: unwrap<CertificatePublishResult>,
      invalidatesTags: ["Certificates", "Enrollments", "Dashboard"],
    }),
  }),
});

export const {
  useGetCertificateTemplatesQuery,
  useCreateCertificateTemplateMutation,
  useUpdateCertificateTemplateMutation,
  useDeleteCertificateTemplateMutation,
  usePublishCertificateTemplateMutation,
} = certificateApi;
