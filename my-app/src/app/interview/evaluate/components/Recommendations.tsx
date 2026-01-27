"use client";

interface RecommendationsProps {
  recommendations: string[];
}

export function Recommendations({ recommendations }: RecommendationsProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">
        📚 Recommendations for Improvement
      </h3>
      <div className="space-y-3">
        {recommendations.map((rec, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
              {index + 1}
            </div>
            <p className="text-gray-700 pt-1">{rec}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
