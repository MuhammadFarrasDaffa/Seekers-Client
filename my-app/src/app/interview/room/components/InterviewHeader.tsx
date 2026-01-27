"use client";

import { Question } from "@/app/types";

interface InterviewHeaderProps {
  title?: string;
  level?: string;
  currentIndex: number;
  total: number;
  currentQuestion?: Question;
  interviewCompleted: boolean;
  isGreeting?: boolean;
}

export function InterviewHeader({
  title,
  level,
  currentIndex,
  total,
  currentQuestion,
  interviewCompleted,
  isGreeting,
}: InterviewHeaderProps) {
  return (
    <div className="bg-white border-b px-6 py-4 shadow-sm">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-gray-800">Interview Room</h2>
        <div className="flex items-center gap-3 mt-1">
          <p className="text-sm text-gray-600">{title || "Interview"}</p>
          {!interviewCompleted && (
            <>
              <span className="text-gray-400">•</span>
              {isGreeting ? (
                <p className="text-sm text-gray-600">Intro</p>
              ) : (
                <p className="text-sm text-gray-600">
                  {level && (
                    <span className="capitalize">{level} Level • </span>
                  )}
                  Question {currentIndex + 1} of {total}
                </p>
              )}
              {currentQuestion?.type && (
                <>
                  <span className="text-gray-400">•</span>
                  <p className="text-sm text-gray-600 capitalize">
                    {currentQuestion.type}
                  </p>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
