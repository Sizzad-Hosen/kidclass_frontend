"use client";

import { useParams } from "next/navigation";
import { BadgeCheck, ShieldX } from "lucide-react";

import { ErrorState, PageLoader, PageShell } from "@/components/kidclass/shared";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useVerifyCertificateQuery } from "@/redux/features/learning/learningApi";

export default function VerifyCertificatePage() {
  const params = useParams<{ certificateNo: string }>();
  const { data, isLoading, isError } = useVerifyCertificateQuery(params.certificateNo);

  return (
    <PageShell>
      <section className="mx-auto max-w-4xl px-5 py-16">
        {isLoading ? <PageLoader label="Checking certificate" /> : null}
        {isError ? (
          <Card className="rounded-[2rem] border-red-100 bg-white p-8 text-center">
            <CardContent>
              <div className="mx-auto grid size-20 place-items-center rounded-full bg-red-100 text-red-600">
                <ShieldX className="size-10" />
              </div>
              <h1 className="mt-6 text-4xl font-black">Certificate Invalid</h1>
              <p className="mt-3 text-slate-600">We could not verify certificate number {params.certificateNo}.</p>
            </CardContent>
          </Card>
        ) : null}
        {data ? (
          <Card className="rounded-[2rem] border-emerald-100 bg-white p-8 text-center shadow-lg">
            <CardContent>
              <div className="mx-auto grid size-20 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                <BadgeCheck className="size-10" />
              </div>
              <Badge className="mt-6" variant="green">Valid Certificate</Badge>
              <h1 className="mt-4 text-4xl font-black text-sky-700">{data.certificateNo}</h1>
              <p className="mt-3 text-slate-600">
                Issued {data.issuedAt ? new Date(data.issuedAt).toLocaleDateString() : "recently"}
              </p>
              <p className="mt-6 text-lg font-bold">
                This KidClass certificate is active and publicly verified.
              </p>
            </CardContent>
          </Card>
        ) : null}
        {!isLoading && !isError && !data ? <ErrorState message="No certificate result returned." /> : null}
      </section>
    </PageShell>
  );
}
