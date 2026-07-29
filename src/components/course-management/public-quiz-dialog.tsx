"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, CircleHelp, Loader2, RotateCcw, XCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getAuthErrorMessage } from "@/redux/features/auth/auth-errors";
import {
  useGetPublicQuizQuery,
  useSubmitPublicQuizMutation,
} from "@/redux/features/learning/learningApi";

export function PublicQuizDialog({
  quizId,
  onClose,
}: {
  quizId: string;
  onClose: () => void;
}) {
  const { data: quiz, isLoading, isError } = useGetPublicQuizQuery(quizId, {
    skip: !quizId,
  });
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitQuiz, { data: result, isLoading: isSubmitting, reset }] =
    useSubmitPublicQuizMutation();

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!quiz) return;

    if (Object.keys(answers).length !== quiz.questions.length) {
      toast.error("Answer every question before submitting.");
      return;
    }

    try {
      await submitQuiz({
        quizId,
        answers: quiz.questions.map((_, index) => answers[index]),
      }).unwrap();
    } catch (error) {
      toast.error(getAuthErrorMessage(error, "Could not submit this quiz."));
    }
  };

  const tryAgain = () => {
    setAnswers({});
    reset();
  };

  return (
    <Dialog open={Boolean(quizId)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-h-[92vh] max-w-2xl overflow-y-auto"
        onClose={onClose}
      >
        {isLoading ? (
          <div className="grid min-h-72 place-items-center text-sky-700">
            <Loader2 className="size-8 animate-spin" />
          </div>
        ) : isError || !quiz ? (
          <div className="py-14 text-center">
            <XCircle className="mx-auto size-12 text-red-400" />
            <DialogTitle className="mt-4">Quiz unavailable</DialogTitle>
            <DialogDescription className="mt-2">
              This quiz is not available in a published course.
            </DialogDescription>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-start gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-700">
                  <CircleHelp />
                </span>
                <div>
                  <DialogTitle>{quiz.title}</DialogTitle>
                  <DialogDescription>
                    Answer {quiz.questions.length} questions. You need {quiz.passingScore}% to pass.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {result ? (
              <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center">
                {result.passed ? (
                  <CheckCircle2 className="mx-auto size-14 text-emerald-600" />
                ) : (
                  <XCircle className="mx-auto size-14 text-amber-600" />
                )}
                <h3 className="mt-3 text-2xl font-black">
                  {result.passed ? "Quiz passed!" : "Keep practicing!"}
                </h3>
                <p className="mt-2 text-4xl font-black text-sky-700">
                  {result.scorePercentage}%
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {result.score} of {result.totalPoints} points
                </p>
              </div>
            ) : null}

            <form className="mt-6 space-y-5" onSubmit={submit}>
              {quiz.questions.map((question, questionIndex) => (
                <fieldset
                  className="rounded-2xl border border-slate-200 p-4"
                  disabled={Boolean(result)}
                  key={questionIndex}
                >
                  <legend className="px-2 font-black text-slate-800">
                    {questionIndex + 1}. {question.questionText}
                    <span className="ml-2 text-xs font-semibold text-slate-400">
                      {question.points} pt
                    </span>
                  </legend>
                  <div className="mt-3 space-y-2">
                    {question.options.map((option, optionIndex) => {
                      const selected = answers[questionIndex] === optionIndex;
                      const correct =
                        result?.correctOptionIndexes[questionIndex] === optionIndex;
                      return (
                        <label
                          className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                            result && correct
                              ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                              : result && selected
                                ? "border-red-300 bg-red-50 text-red-700"
                                : selected
                                  ? "border-sky-500 bg-sky-50 text-sky-800"
                                  : "border-slate-200 hover:bg-slate-50"
                          }`}
                          key={optionIndex}
                        >
                          <input
                            checked={selected}
                            className="size-4 accent-sky-700"
                            name={`question-${questionIndex}`}
                            onChange={() =>
                              setAnswers((current) => ({
                                ...current,
                                [questionIndex]: optionIndex,
                              }))
                            }
                            type="radio"
                          />
                          {option.text}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              ))}

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                {result ? (
                  <Button onClick={tryAgain} type="button" variant="outline">
                    <RotateCcw /> Try again
                  </Button>
                ) : (
                  <Button
                    className="bg-[#14698d] hover:bg-[#0d5877]"
                    disabled={isSubmitting}
                    type="submit"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : <CheckCircle2 />}
                    {isSubmitting ? "Checking..." : "Submit Quiz"}
                  </Button>
                )}
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
