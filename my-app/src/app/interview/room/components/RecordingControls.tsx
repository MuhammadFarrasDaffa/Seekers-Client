"use client";

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
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-6 py-4 shadow-lg">
      <div className="max-w-4xl mx-auto">
        {audioURL && (
          <div className="mb-3 bg-gray-50 rounded-lg p-3 border">
            <p className="text-xs font-medium text-gray-600 mb-2">
              Preview your answer:
            </p>
            <audio src={audioURL} controls className="w-full h-8" />
          </div>
        )}

        {isRecording && (
          <div className="mb-3 flex items-center justify-center gap-2 text-red-500">
            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium">
              Recording in progress...
            </span>
          </div>
        )}

        <div className="flex items-center justify-center gap-3">
          {!isRecording && !audioURL && (
            <button
              onClick={onStartRecording}
              className="flex items-center gap-2 px-8 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition font-medium shadow-lg hover:shadow-xl"
            >
              <span className="text-xl">🎤</span>
              <span>Start Recording</span>
            </button>
          )}

          {isRecording && (
            <button
              onClick={onStopRecording}
              className="flex items-center gap-2 px-8 py-3 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition font-medium shadow-lg"
            >
              <span className="text-xl">⏹️</span>
              <span>Stop Recording</span>
            </button>
          )}

          {audioURL && !isRecording && (
            <>
              <button
                onClick={onReRecord}
                className="flex items-center gap-2 px-6 py-3 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition font-medium shadow-lg"
              >
                <span className="text-xl">🔄</span>
                <span>Re-record</span>
              </button>
              <button
                onClick={onSubmitAnswer}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <span className="text-xl">⏳</span>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span className="text-xl">📤</span>
                    <span>Submit Answer</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
