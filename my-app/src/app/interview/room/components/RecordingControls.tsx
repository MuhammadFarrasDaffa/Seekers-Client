"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, Square, RotateCcw, Send, Loader2 } from "lucide-react";

interface RecordingControlsProps {
  audioURL: string;
  isRecording: boolean;
  isSubmitting: boolean;
  onStartRecording: () => Promise<void>;
  onStopRecording: () => void;
  onSubmitAnswer: () => Promise<void>;
  onReRecord: () => Promise<void>;
}

export function RecordingControls({
  audioURL,
  isRecording,
  isSubmitting,
  onStartRecording,
  onStopRecording,
  onSubmitAnswer,
  onReRecord,
}: RecordingControlsProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-200 px-6 py-5">
      <div className="container mx-auto max-w-3xl">
        {/* Audio Preview */}
        {audioURL && (
          <Card className="mb-4 p-4 bg-gray-50 border border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Preview jawaban Anda:
            </p>
            <audio src={audioURL} controls className="w-full h-10" />
          </Card>
        )}

        {/* Recording Indicator */}
        {isRecording && (
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-sm font-medium text-red-600">
              Merekam jawaban Anda...
            </span>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-4">
          {/* Start Recording */}
          {!isRecording && !audioURL && (
            <Button
              onClick={onStartRecording}
              className="h-14 px-8 bg-black hover:bg-gray-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <Mic className="w-5 h-5 mr-2" />
              Mulai Rekam Jawaban
            </Button>
          )}

          {/* Stop Recording */}
          {isRecording && (
            <Button
              onClick={onStopRecording}
              className="h-14 px-8 bg-gray-700 hover:bg-gray-800 text-white font-semibold rounded-xl shadow-lg transition-all"
            >
              <Square className="w-5 h-5 mr-2" />
              Berhenti Merekam
            </Button>
          )}

          {/* Re-record & Submit */}
          {audioURL && !isRecording && (
            <>
              <Button
                onClick={onReRecord}
                variant="outline"
                className="h-14 px-6 border-2 border-gray-300 hover:border-gray-400 font-semibold rounded-xl transition-all"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Rekam Ulang
              </Button>
              <Button
                onClick={onSubmitAnswer}
                disabled={isSubmitting}
                className="h-14 px-8 bg-black hover:bg-gray-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Kirim Jawaban
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
