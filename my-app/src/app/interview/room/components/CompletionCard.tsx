"use client";

interface CompletionCardProps {
  totalQuestions: number;
  onReset: () => void;
  onViewEvaluation: () => void;
}

export function CompletionCard({
  totalQuestions,
  onReset,
  onViewEvaluation,
}: CompletionCardProps) {
  return (
    <div className="flex justify-center">
      <div className="bg-green-50 border-2 border-green-500 rounded-2xl px-6 py-4 text-center max-w-md">
        <div className="text-4xl mb-2">🎉</div>
        <h3 className="text-lg font-bold text-green-800 mb-1">
          Interview Completed!
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          You have successfully answered all {totalQuestions} questions.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onReset}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium text-sm"
          >
            🔄 Start New Interview
          </button>
          <button
            onClick={onViewEvaluation}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm"
          >
            📊 View Evaluation
          </button>
        </div>
      </div>
    </div>
  );
}
