"use client";

import { InterviewEvaluation } from "@/types";

interface OverallCardProps {
  evaluation: InterviewEvaluation;
  gradeColor: (grade: string) => string;
  scoreColor: (score: number) => string;
}

export function OverallCard({
  evaluation,
  gradeColor,
  scoreColor,
}: OverallCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Overall Performance
          </h2>
          <p className="text-gray-600">
            {evaluation.totalQuestions} questions • {evaluation.completionTime}
          </p>
        </div>
        <div className="text-center">
          <div
            className={`text-6xl font-bold ${gradeColor(evaluation.overallGrade)}`}
          >
            {evaluation.overallGrade}
          </div>
          <div className="text-gray-600 mt-2">
            {evaluation.overallScore}/100
          </div>
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className={`h-4 rounded-full ${scoreColor(evaluation.overallScore)}`}
          style={{ width: `${evaluation.overallScore}%` }}
        />
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
        <p className="text-gray-800">{evaluation.summary}</p>
      </div>
    </div>
  );
}
