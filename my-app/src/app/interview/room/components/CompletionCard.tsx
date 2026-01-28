"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, RotateCcw, BarChart3 } from "lucide-react";

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
      <Card className="bg-gradient-to-b from-white to-green-50/50 border-2 border-green-200 rounded-2xl px-8 py-8 text-center max-w-lg shadow-lg">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Interview Selesai! 🎉
        </h3>
        <p className="text-gray-600 mb-6">
          Anda telah berhasil menjawab semua{" "}
          <strong>{totalQuestions} pertanyaan</strong>. Lihat evaluasi untuk
          mengetahui performa Anda.
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            onClick={onReset}
            variant="outline"
            className="px-6 py-3 h-auto border-2 border-gray-300 hover:border-gray-400 font-semibold rounded-xl transition-all"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Interview Baru
          </Button>
          <Button
            onClick={onViewEvaluation}
            className="px-6 py-3 h-auto bg-black hover:bg-gray-800 text-white font-semibold rounded-xl shadow-lg transition-all"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Lihat Evaluasi
          </Button>
        </div>
      </Card>
    </div>
  );
}
