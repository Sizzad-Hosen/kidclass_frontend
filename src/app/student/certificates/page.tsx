"use client";

import Link from "next/link";
import { Award } from "lucide-react";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { EmptyState, ErrorState, PageLoader, StudentLayout } from "@/components/kidclass/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getId, useGetCertificatesQuery } from "@/redux/features/learning/learningApi";

export default function StudentCertificatesPage() {
  const { data: certificates = [], isLoading, isError } = useGetCertificatesQuery();
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <StudentLayout>
        <main className="mx-auto max-w-6xl px-5 py-10">
          <h1 className="text-5xl font-black text-sky-700">My Certificates</h1>
          <p className="mt-3 text-lg text-slate-600">Certificates earned from completed KidClass courses.</p>
          <div className="mt-9">
            {isLoading ? <PageLoader label="Loading certificates" /> : null}
            {isError ? <ErrorState message="Could not load certificates." /> : null}
            {!isLoading && !isError && !certificates.length ? (
              <EmptyState icon={<Award />} title="No certificates yet" message="Complete all course requirements to unlock a certificate." />
            ) : null}
            <div className="grid gap-5 md:grid-cols-2">
              {certificates.map((certificate) => (
                <Card className="rounded-[2rem] border-emerald-100 bg-white p-6" key={getId(certificate)}>
                  <CardContent>
                    <Award className="size-12 text-amber-500" />
                    <h2 className="mt-4 text-2xl font-black">{certificate.enrollment?.course?.title ?? "Course Certificate"}</h2>
                    <p className="mt-2 font-mono text-sm text-slate-500">{certificate.certificateNo}</p>
                    <Button asChild className="mt-5 rounded-full bg-emerald-600">
                      <Link href={`/certificates/verify/${certificate.certificateNo}`}>View Certificate</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </StudentLayout>
    </ProtectedRoute>
  );
}
