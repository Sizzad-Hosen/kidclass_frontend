"use client";

import { CircleHelp } from "lucide-react";
import { StructureManagementIndex } from "@/components/course-management/structure-management-index";
export default function QuizzesPage() {
  return (
    <StructureManagementIndex
      description="Select a course to create and edit quizzes with dynamic questions, options, answers, points, and passing scores."
      icon={CircleHelp}
      title="Quizzes"
    />
  );
}
