"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FollowUpQuestion, Question } from "@/types";
import {
  MessageCircle,
  Loader2,
  Volume2,
  Mic,
  User,
  Crown,
  Zap,
} from "lucide-react";

// Sound Wave Animation Component
function SoundWaveAnimation() {
  return (
    <div className="flex items-center justify-center gap-1 h-6">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="w-1 bg-blue-500 rounded-full animate-pulse"
          style={{
            height: `${12 + Math.random() * 12}px`,
            animationDelay: `${i * 0.15}s`,
            animationDuration: "0.6s",
          }}
        />
      ))}
    </div>
  );
}

interface QuestionCardProps {
  question: Question | null;
  followUpQuestion: FollowUpQuestion | null;
  isWaitingFollowUp: boolean;
  isWaitingAck: boolean;
  acknowledgmentText: string | null;
  showQuestion: boolean;
  isGreeting: boolean;
  isAudioPlaying?: boolean;
  lastTranscription?: string | null;
}

export function QuestionCard({
  question,
  followUpQuestion,
  isWaitingFollowUp,
  isWaitingAck,
  acknowledgmentText,
  showQuestion,
  isGreeting,
  isAudioPlaying = false,
  lastTranscription = null,
}: QuestionCardProps) {
  // Determine what to display
  const displayFollowUp = followUpQuestion && !acknowledgmentText;
  const displayAcknowledgment = acknowledgmentText;
  const displayQuestion =
    showQuestion && question && !displayFollowUp && !displayAcknowledgment;

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-8 pb-40">
      <div className="w-full max-w-2xl">
        {/* Loading States */}
        {isWaitingFollowUp && (
          <Card className="p-8 bg-white border border-purple-200 shadow-lg animate-pulse">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
              </div>
              <p className="text-purple-700 font-medium">
                Menyiapkan pertanyaan lanjutan...
              </p>
            </div>
          </Card>
        )}

        {isWaitingAck && (
          <Card className="p-8 bg-white border border-gray-200 shadow-lg animate-pulse">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Loader2 className="w-6 h-6 text-gray-600 animate-spin" />
              </div>
              <p className="text-gray-700 font-medium">
                Memproses jawaban Anda...
              </p>
            </div>
          </Card>
        )}

        {/* Acknowledgment Display */}
        {displayAcknowledgment && !isWaitingFollowUp && !isWaitingAck && (
          <Card className="p-8 bg-gradient-to-br from-blue-50 to-white border border-blue-200 shadow-lg">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-200">
                  <Mic className="w-7 h-7 text-white" />
                </div>
                {isAudioPlaying && (
                  <>
                    <div className="absolute inset-0 w-14 h-14 rounded-full border-2 border-blue-400 animate-ping opacity-20" />
                    <div className="absolute -inset-1.5 w-17 h-17 rounded-full border-2 border-blue-300 animate-pulse opacity-30" />
                  </>
                )}
              </div>
              {isAudioPlaying && (
                <div className="mb-4">
                  <SoundWaveAnimation />
                </div>
              )}
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 mb-4">
                Respon Pewawancara
              </Badge>
              <p className="text-lg text-gray-700 italic leading-relaxed">
                "{acknowledgmentText}"
              </p>
            </div>
          </Card>
        )}

        {/* Follow-up Question Display */}
        {displayFollowUp && !isWaitingFollowUp && !isWaitingAck && (
          <div className="space-y-4">
            {/* User's Previous Answer */}
            {lastTranscription && (
              <Card className="p-4 bg-gray-50 border border-gray-200 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      Jawaban Anda sebelumnya:
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      "{lastTranscription}"
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Follow-up Question Card */}
            <Card className="p-8 bg-gradient-to-br from-purple-50 to-white border-2 border-purple-200 shadow-lg">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-200">
                    <MessageCircle className="w-7 h-7 text-white" />
                  </div>
                  {isAudioPlaying && (
                    <>
                      <div className="absolute inset-0 w-14 h-14 rounded-full border-2 border-purple-400 animate-ping opacity-20" />
                      <div className="absolute -inset-1.5 w-17 h-17 rounded-full border-2 border-purple-300 animate-pulse opacity-30" />
                    </>
                  )}
                </div>
                {isAudioPlaying && (
                  <div className="mb-4">
                    <SoundWaveAnimation />
                  </div>
                )}
                <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 mb-4">
                  Pertanyaan Lanjutan
                </Badge>
                <p className="text-xl text-gray-800 font-medium leading-relaxed">
                  {followUpQuestion.text}
                </p>
              </div>
            </Card>
          </div>
        )}

        {/* Main Question Display */}
        {displayQuestion && !isWaitingFollowUp && !isWaitingAck && (
          <Card className="p-8 bg-white border border-gray-200 shadow-lg">
            <div className="flex flex-col items-center text-center">
              {/* Interviewer Avatar with Sound Wave */}
              <div className="relative mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-200">
                  <Mic className="w-8 h-8 text-white" />
                </div>
                {/* Animated rings when audio is playing */}
                {isAudioPlaying && (
                  <>
                    <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-blue-400 animate-ping opacity-20" />
                    <div className="absolute -inset-2 w-20 h-20 rounded-full border-2 border-blue-300 animate-pulse opacity-30" />
                  </>
                )}
              </div>

              {/* Sound Wave Animation */}
              {isAudioPlaying && (
                <div className="mb-4">
                  <SoundWaveAnimation />
                </div>
              )}

              {/* Question Content */}
              <p className="text-xl text-gray-800 font-medium leading-relaxed">
                {question.content}
              </p>

              {/* Audio Indicator */}
              <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
                {isAudioPlaying ? (
                  <>
                    <Volume2 className="w-4 h-4 text-blue-500 animate-pulse" />
                    <span className="text-blue-600">
                      Pewawancara sedang berbicara...
                    </span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>Dengarkan pertanyaan dengan seksama</span>
                  </>
                )}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
