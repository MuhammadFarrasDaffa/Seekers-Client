"use client";

import { EvaluationScore } from "../types";

interface EvaluationCardProps {
  data: EvaluationScore;
  scoreColor: (score: number) => string;
}

export function EvaluationCard({ data, scoreColor }: EvaluationCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">{data.category}</h3>
        <div className="text-2xl font-bold text-blue-600">
          {data.score}/{data.maxScore}
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
        <div
          className={`h-3 rounded-full ${scoreColor(data.score)}`}
          style={{ width: `${(data.score / data.maxScore) * 100}%` }}
        />
      </div>

      <p className="text-gray-700 mb-4">{data.feedback}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
            <span>✓</span>
            <span>Strengths</span>
          </h4>
          <ul className="space-y-2">
            {data.strengths.map((strength, idx) => (
              <li
                key={idx}
                className="text-sm text-gray-700 flex items-start gap-2"
              >
                <span className="text-green-600 mt-1">•</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
            <span>⚡</span>
            <span>Areas for Improvement</span>
          </h4>
          <ul className="space-y-2">
            {data.improvements.map((improvement, idx) => (
              <li
                key={idx}
                className="text-sm text-gray-700 flex items-start gap-2"
              >
                <span className="text-orange-600 mt-1">•</span>
                <span>{improvement}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
