"use client";

import {
  AcknowledgmentResponse,
  Answer,
  FollowUpQuestion,
  Question,
} from "@/app/types";
import { RefObject } from "react";

interface ChatThreadProps {
  answers: Answer[];
  questions: Question[];
  currentQuestion?: Question;
  greetingQuestion?: Question;
  followUpQuestion: FollowUpQuestion | null;
  acknowledgment: AcknowledgmentResponse | null;
  interviewCompleted: boolean;
  isWaitingFollowUp: boolean;
  isWaitingAck: boolean;
  showCurrentQuestion: boolean;
  showGreeting: boolean;
  chatEndRef: RefObject<HTMLDivElement>;
}

export function ChatThread({
  answers,
  questions,
  currentQuestion,
  greetingQuestion,
  followUpQuestion,
  acknowledgment,
  interviewCompleted,
  isWaitingFollowUp,
  isWaitingAck,
  showCurrentQuestion,
  showGreeting,
  chatEndRef,
}: ChatThreadProps) {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 pb-32">
      <div className="max-w-4xl mx-auto space-y-4">
        {greetingQuestion && (
          <div className="flex justify-start">
            <div className="max-w-[70%]">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-gray-500">
                  Interviewer
                </span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full capitalize">
                  {greetingQuestion.type}
                </span>
              </div>
              <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-sm border">
                <p className="text-gray-800">{greetingQuestion.content}</p>
              </div>
            </div>
          </div>
        )}

        {answers.map((answer, index) => (
          <div key={answer.questionId} className="space-y-4">
            <div className="flex justify-start">
              <div className="max-w-[70%]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-gray-500">
                    Interviewer
                  </span>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {questions[index]?.type}
                  </span>
                </div>
                <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-sm border">
                  <p className="text-gray-800">{answer.question}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="max-w-[70%]">
                <div className="flex items-center justify-end gap-2 mb-1">
                  <span className="text-xs font-semibold text-gray-500">
                    You
                  </span>
                </div>
                <div className="bg-blue-600 text-white rounded-2xl rounded-tr-none px-4 py-3 shadow-sm">
                  <p>{answer.transcription}</p>
                  {answer.duration !== undefined && (
                    <p className="text-xs text-blue-100 mt-1">
                      {Math.max(1, Math.round(answer.duration))}s
                    </p>
                  )}
                </div>
              </div>
            </div>

            {answer.acknowledgment && (
              <div className="flex justify-start">
                <div className="max-w-[70%]">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-gray-500">
                      Interviewer
                    </span>
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-sm border">
                    <p className="text-gray-800 italic">
                      {answer.acknowledgment}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {!interviewCompleted &&
          currentQuestion &&
          !followUpQuestion &&
          !acknowledgment &&
          !isWaitingFollowUp &&
          !isWaitingAck &&
          showCurrentQuestion &&
          !showGreeting && (
            <div className="flex justify-start">
              <div className="max-w-[70%]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-gray-500">
                    Interviewer
                  </span>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {currentQuestion.type}
                  </span>
                  {currentQuestion.followUp && (
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                      Follow-up
                    </span>
                  )}
                </div>
                <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-sm border">
                  <p className="text-gray-800">{currentQuestion.content}</p>
                </div>
              </div>
            </div>
          )}

        {followUpQuestion &&
          !interviewCompleted &&
          !acknowledgment &&
          !isWaitingAck && (
            <div className="flex justify-start">
              <div className="max-w-[70%]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-gray-500">
                    Interviewer
                  </span>
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                    Follow-up Question
                  </span>
                </div>
                <div className="bg-purple-50 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm border border-purple-200">
                  <p className="text-gray-800">{followUpQuestion.text}</p>
                </div>
              </div>
            </div>
          )}

        {acknowledgment && !interviewCompleted && (
          <div className="flex justify-start">
            <div className="max-w-[70%]">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-gray-500">
                  Interviewer
                </span>
              </div>
              <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-sm border">
                <p className="text-gray-800 italic">{acknowledgment.text}</p>
              </div>
            </div>
          </div>
        )}

        {isWaitingFollowUp && (
          <div className="flex justify-center">
            <div className="bg-purple-50 rounded-full px-4 py-2 flex items-center gap-2">
              <span className="loading loading-spinner loading-sm"></span>
              <span className="text-sm text-purple-700">
                Generating follow-up question...
              </span>
            </div>
          </div>
        )}

        {isWaitingAck && (
          <div className="flex justify-center">
            <div className="bg-gray-100 rounded-full px-4 py-2 flex items-center gap-2">
              <span className="loading loading-spinner loading-sm"></span>
              <span className="text-sm text-gray-700">
                Processing your answer...
              </span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>
    </div>
  );
}
