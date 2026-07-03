"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { ErrorState, PageLoader, StudentLayout } from "@/components/kidclass/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  getId,
  useGetAssignmentQuery,
  useSubmitAssignmentMutation,
} from "@/redux/features/learning/learningApi";

const assignmentSchema = z.object({
  content: z.string().optional(),
  picture: z
    .custom<FileList>()
    .optional(),
  answers: z.record(z.string(), z.string()).optional(),
});

type AssignmentFormValues = z.infer<typeof assignmentSchema>;

export default function AssignmentPage() {
  const params = useParams<{ assignmentId: string }>();
  const router = useRouter();
  const { data: assignment, isLoading, isError } = useGetAssignmentQuery(params.assignmentId);
  const [submitAssignment, { isLoading: isSubmitting }] = useSubmitAssignmentMutation();
  const parts = useMemo(
    () => (assignment?.assessmentParts?.length ? assignment.assessmentParts : ["writing"]),
    [assignment],
  );

  const schema = useMemo(
    () =>
      assignmentSchema.superRefine((values, ctx) => {
        if (parts.includes("writing") && !values.content?.trim()) {
          ctx.addIssue({ code: "custom", path: ["content"], message: "Writing answer is required." });
        }
        if (parts.includes("picture") && !values.picture?.length) {
          ctx.addIssue({ code: "custom", path: ["picture"], message: "Picture is required." });
        }
        if (parts.includes("quiz")) {
          for (const question of assignment?.questions ?? []) {
            if (!values.answers?.[getId(question)]) {
              ctx.addIssue({ code: "custom", path: ["answers"], message: "Please answer every quiz question." });
              break;
            }
          }
        }
      }),
    [assignment?.questions, parts],
  );

  const form = useForm<AssignmentFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { content: "", answers: {} },
  });

  const onSubmit = async (values: AssignmentFormValues) => {
    const answers = (assignment?.questions ?? []).map((question) => ({
      question: getId(question),
      selectedOptionIndexes: values.answers?.[getId(question)] ? [Number(values.answers[getId(question)])] : [],
    }));

    try {
      await submitAssignment({
        assignmentId: params.assignmentId,
        payload: {
          content: values.content,
          picture: values.picture,
          answers: answers.length ? answers : undefined,
        },
      }).unwrap();
      toast.success("Assignment submitted successfully!");
      router.push("/student/enrollments");
    } catch {
      toast.error("Could not submit assignment.");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <StudentLayout>
        <main className="mx-auto max-w-5xl px-5 py-10">
          {isLoading ? <PageLoader label="Opening assignment" /> : null}
          {isError ? <ErrorState message="Assignment is unavailable." /> : null}
          {assignment ? (
            <Card className="rounded-[2rem] bg-white p-8 shadow-sm">
              <CardContent>
                <Badge variant="pink">{assignment.points ?? 0} points</Badge>
                <h1 className="mt-5 text-5xl font-black text-sky-700">{assignment.title}</h1>
                <p className="mt-5 whitespace-pre-line text-xl leading-8 text-slate-600">
                  {assignment.instructions}
                </p>

                <form className="mt-8 space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
                  {parts.includes("writing") ? (
                    <div>
                      <label className="mb-3 block text-xl font-bold">Writing Answer</label>
                      <Textarea placeholder="Write your answer here..." {...form.register("content")} />
                      <FieldError message={form.formState.errors.content?.message} />
                    </div>
                  ) : null}

                  {parts.includes("quiz") ? (
                    <div className="space-y-5">
                      <h2 className="text-2xl font-black">Quiz Questions</h2>
                      {assignment.questions?.map((question, questionIndex) => (
                        <div className="rounded-3xl bg-slate-100 p-5" key={getId(question)}>
                          <p className="font-bold">{questionIndex + 1}. {question.questionText}</p>
                          <div className="mt-4 grid gap-3 md:grid-cols-2">
                            {question.options.map((option, optionIndex) => (
                              <label className="flex cursor-pointer items-center gap-3 rounded-2xl bg-white p-4 font-semibold" key={option.text}>
                                <input
                                  type="radio"
                                  value={optionIndex}
                                  {...form.register(`answers.${getId(question)}`)}
                                />
                                {option.text}
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                      <FieldError
                        message={
                          typeof form.formState.errors.answers?.message === "string"
                            ? form.formState.errors.answers.message
                            : undefined
                        }
                      />
                    </div>
                  ) : null}

                  {parts.includes("picture") ? (
                    <div>
                      <label className="mb-3 block text-xl font-bold">Picture Upload</label>
                      <Input
                        accept="image/*"
                        className="h-14 rounded-2xl"
                        type="file"
                        {...form.register("picture")}
                      />
                      <FieldError message={form.formState.errors.picture?.message} />
                    </div>
                  ) : null}

                  <Button className="h-14 rounded-full bg-sky-700 px-10 text-lg" disabled={isSubmitting} type="submit">
                    {isSubmitting ? "Submitting..." : "Submit Assignment"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : null}
        </main>
      </StudentLayout>
    </ProtectedRoute>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-sm font-semibold text-red-600">{message}</p>;
}
