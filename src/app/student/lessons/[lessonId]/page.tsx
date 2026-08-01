"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Lock, PlayCircle } from "lucide-react";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { ErrorState, PageLoader, StudentLayout } from "@/components/kidclass/shared";
import { VideoPlayer } from "@/components/kidclass/video-player";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  useGetLessonQuery,
  useUpdateLessonProgressMutation,
} from "@/redux/features/learning/learningApi";

export default function LessonPage() {
  const params = useParams<{ lessonId: string }>();
  const { data: lesson, isLoading, isError, error } = useGetLessonQuery(params.lessonId);
  const [lockedMessage, setLockedMessage] = useState("");
  const [updateProgress, { isLoading: isUpdating }] = useUpdateLessonProgressMutation();

  const markLesson = async (status: "in-progress" | "completed") => {
    setLockedMessage("");
    try {
      await updateProgress({
        lessonId: params.lessonId,
        status,
        watchedSeconds: status === "completed" ? lesson?.duration ?? 0 : 1,
      }).unwrap();
      toast.success(status === "completed" ? "Lesson completed!" : "Lesson marked in progress.");
    } catch (mutationError) {
      const maybeStatus = (mutationError as { status?: number })?.status;
      if (maybeStatus === 403) {
        setLockedMessage("Previous lesson must be completed before this lesson unlocks.");
        toast.error("This lesson is locked.");
        return;
      }
      toast.error("Could not update lesson progress.");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <StudentLayout>
        <main className="mx-auto max-w-6xl px-3 py-6 sm:px-5 sm:py-10">
          {isLoading ? <PageLoader label="Opening lesson" /> : null}
          {isError ? <ErrorState message={(error as { status?: number })?.status === 403 ? "This lesson is locked until the previous lesson is complete." : "Lesson is unavailable."} /> : null}
          {lesson ? (
            <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
              <section className="space-y-6">
                <div className="min-w-0 overflow-hidden rounded-xl bg-slate-900 shadow-xl sm:rounded-[2rem]">
                  {lesson.contentType === "video" && lesson.videoUrl ? (
                    <VideoPlayer src={lesson.videoUrl} title={lesson.title} />
                  ) : (
                    <div className="grid aspect-video place-items-center bg-sky-700 text-white">
                      <PlayCircle className="size-24 text-yellow-300" />
                    </div>
                  )}
                </div>

                <Card className="rounded-2xl bg-white p-4 sm:rounded-[2rem] sm:p-7">
                  <CardContent>
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge variant="pink">Current Lesson</Badge>
                      <span className="font-bold text-slate-500">{lesson.contentType ?? "text"} lesson</span>
                    </div>
                    <h1 className="mt-4 break-words text-3xl font-black sm:text-5xl">{lesson.title}</h1>
                    <p className="mt-5 whitespace-pre-line text-base leading-7 text-slate-600 sm:text-xl sm:leading-8">
                      {lesson.contentNotes}
                    </p>
                    <div className="mt-8 flex flex-wrap gap-4">
                      <Button className="h-13 rounded-full bg-yellow-300 px-8 text-lg text-yellow-950" disabled={isUpdating} onClick={() => markLesson("in-progress")}>
                        Mark In Progress
                      </Button>
                      <Button className="h-13 rounded-full bg-sky-700 px-8 text-lg" disabled={isUpdating} onClick={() => markLesson("completed")}>
                        Complete Lesson
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </section>

              <aside className="space-y-6">
                <Card className="rounded-[2rem] bg-white p-7">
                  <CardContent>
                    <h2 className="text-3xl font-black text-sky-700">My Progress</h2>
                    <p className="mt-4 text-slate-600">Lesson progress enforces unlock order inside each module.</p>
                  </CardContent>
                </Card>
                {lockedMessage ? (
                  <Card className="rounded-[2rem] border-yellow-200 bg-yellow-100 p-6">
                    <CardContent className="flex gap-4">
                      <Lock className="size-7 text-yellow-700" />
                      <p className="font-bold text-yellow-900">{lockedMessage}</p>
                    </CardContent>
                  </Card>
                ) : null}
              </aside>
            </div>
          ) : null}
        </main>
      </StudentLayout>
    </ProtectedRoute>
  );
}
