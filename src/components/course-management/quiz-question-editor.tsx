"use client";

import { CirclePlus, GripVertical, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { QuizQuestion } from "@/types/course-management";

export const emptyQuestion = (): QuizQuestion => ({
  questionText: "",
  points: 1,
  options: [
    { text: "", isCorrect: true },
    { text: "", isCorrect: false },
  ],
});

export function QuizQuestionEditor({
  questions,
  onChange,
}: {
  questions: QuizQuestion[];
  onChange: (questions: QuizQuestion[]) => void;
}) {
  const updateQuestion = (index: number, patch: Partial<QuizQuestion>) => {
    onChange(
      questions.map((question, itemIndex) =>
        itemIndex === index ? { ...question, ...patch } : question,
      ),
    );
  };

  const updateOption = (
    questionIndex: number,
    optionIndex: number,
    text: string,
  ) => {
    const question = questions[questionIndex];
    updateQuestion(questionIndex, {
      options: question.options.map((option, itemIndex) =>
        itemIndex === optionIndex ? { ...option, text } : option,
      ),
    });
  };

  const selectCorrect = (questionIndex: number, optionIndex: number) => {
    const question = questions[questionIndex];
    updateQuestion(questionIndex, {
      options: question.options.map((option, itemIndex) => ({
        ...option,
        isCorrect: itemIndex === optionIndex,
      })),
    });
  };

  const addOption = (questionIndex: number) => {
    const question = questions[questionIndex];
    updateQuestion(questionIndex, {
      options: [...question.options, { text: "", isCorrect: false }],
    });
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const question = questions[questionIndex];
    if (question.options.length <= 2) return;
    const options = question.options.filter(
      (_, itemIndex) => itemIndex !== optionIndex,
    );
    if (!options.some((option) => option.isCorrect))
      options[0] = { ...options[0], isCorrect: true };
    updateQuestion(questionIndex, { options });
  };

  const totalPoints = questions.reduce(
    (sum, question) => sum + Number(question.points || 0),
    0,
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-black text-slate-800">Questions</p>
          <p className="text-xs text-slate-500">
            {questions.length} questions · {totalPoints} total points
          </p>
        </div>
        <Button
          onClick={() => onChange([...questions, emptyQuestion()])}
          size="sm"
          type="button"
          variant="outline"
        >
          <CirclePlus /> Add Question
        </Button>
      </div>

      {questions.map((question, questionIndex) => (
        <section
          className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
          key={questionIndex}
        >
          <div className="mb-3 flex items-center gap-2">
            <GripVertical className="size-4 text-slate-400" />
            <span className="flex-1 text-sm font-black">
              Question {questionIndex + 1}
            </span>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-600">
              Points
              <Input
                className="h-8 w-20"
                min={1}
                onChange={(event) =>
                  updateQuestion(questionIndex, {
                    points: Number(event.target.value),
                  })
                }
                required
                type="number"
                value={question.points}
              />
            </label>
            <Button
              aria-label="Remove question"
              className="text-red-600"
              disabled={questions.length === 1}
              onClick={() =>
                onChange(
                  questions.filter((_, index) => index !== questionIndex),
                )
              }
              size="icon-sm"
              type="button"
              variant="ghost"
            >
              <Trash2 />
            </Button>
          </div>
          <Input
            minLength={1}
            onChange={(event) =>
              updateQuestion(questionIndex, {
                questionText: event.target.value,
              })
            }
            placeholder="Enter the question"
            required
            value={question.questionText}
          />
          <div className="mt-3 space-y-2">
            {question.options.map((option, optionIndex) => (
              <div className="flex items-center gap-2" key={optionIndex}>
                <input
                  aria-label={`Mark option ${optionIndex + 1} correct`}
                  checked={option.isCorrect}
                  className="size-4 accent-emerald-600"
                  name={`correct-${questionIndex}`}
                  onChange={() => selectCorrect(questionIndex, optionIndex)}
                  type="radio"
                />
                <Input
                  onChange={(event) =>
                    updateOption(questionIndex, optionIndex, event.target.value)
                  }
                  placeholder={`Option ${optionIndex + 1}`}
                  required
                  value={option.text}
                />
                <Button
                  aria-label="Remove option"
                  className="text-red-500"
                  disabled={question.options.length <= 2}
                  onClick={() => removeOption(questionIndex, optionIndex)}
                  size="icon-sm"
                  type="button"
                  variant="ghost"
                >
                  <Trash2 />
                </Button>
              </div>
            ))}
          </div>
          <Button
            className="mt-3"
            onClick={() => addOption(questionIndex)}
            size="sm"
            type="button"
            variant="ghost"
          >
            <CirclePlus />
            Add Option
          </Button>
        </section>
      ))}
    </div>
  );
}
