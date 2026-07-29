"use client";

import Link from "next/link";
import { useState } from "react";
import { Award, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { EmptyState, ErrorState, PageLoader, StudentLayout } from "@/components/kidclass/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAuthErrorMessage } from "@/redux/features/auth/auth-errors";
import {
  getId,
  useDownloadCertificateMutation,
  useGetCertificatesQuery,
} from "@/redux/features/learning/learningApi";

export default function StudentCertificatesPage() {
  const { data: certificates = [], isLoading, isError } = useGetCertificatesQuery();
  const [downloadCertificate, { isLoading: isDownloading }] =
    useDownloadCertificateMutation();
  const [downloadingId, setDownloadingId] = useState("");

  const download = async (certificateId: string, certificateNo?: string) => {
    setDownloadingId(certificateId);
    try {
      const file = await downloadCertificate(certificateId).unwrap();
      const url = URL.createObjectURL(file);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${certificateNo ?? "kidclass-certificate"}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      toast.success("Certificate downloaded.");
    } catch (error) {
      toast.error(getAuthErrorMessage(error, "Could not download certificate."));
    } finally {
      setDownloadingId("");
    }
  };
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
                    <h2 className="mt-4 text-2xl font-black">{certificate.courseName ?? certificate.enrollment?.course?.title ?? "Course Certificate"}</h2>
                    {certificate.className || certificate.subject ? <p className="mt-2 font-bold text-emerald-700">{[certificate.className, certificate.subject].filter(Boolean).join(" · ")}</p> : null}
                    <p className="mt-2 font-mono text-sm text-slate-500">{certificate.certificateNo}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <Button asChild className="rounded-full bg-emerald-600">
                        <Link href={`/certificates/verify/${certificate.certificateNo}`}>View Certificate</Link>
                      </Button>
                      <Button
                        className="rounded-full"
                        disabled={isDownloading}
                        onClick={() => download(getId(certificate), certificate.certificateNo)}
                        variant="outline"
                      >
                        {downloadingId === getId(certificate) ? <Loader2 className="animate-spin" /> : <Download />}
                        Download PDF
                      </Button>
                    </div>
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
