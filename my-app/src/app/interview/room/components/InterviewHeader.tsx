"use client";

import { Question } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Mic, Crown, Zap } from "lucide-react"; // Tambah icon Crown/Zap

interface InterviewHeaderProps {
  title?: string;
  level?: string;
  tier?: string; // UPDATE 1: Tambahkan props Tier
  currentIndex: number;
  total: number;
  currentQuestion?: Question;
  interviewCompleted: boolean;
  isGreeting?: boolean;
}

export function InterviewHeader({
  title,
  level,
  tier = "Free", // Default value
  currentIndex,
  total,
  currentQuestion,
  interviewCompleted,
  isGreeting,
}: InterviewHeaderProps) {
  const progress = ((currentIndex + 1) / total) * 100;

  // Helper untuk style badge tier - Support untuk Pro, Premium, Basic, Free
  const tierLower = tier?.toLowerCase();
  const isPro = tierLower === "pro" || tierLower === "pro plan";
  const isPremium = tierLower === "premium" || tierLower === "premium plan";
  const isBasic = tierLower === "basic" || tierLower === "basic plan";

  // Tentukan display name untuk tier
  const getTierDisplayName = () => {
    if (isPro) return "Pro Plan";
    if (isPremium) return "Premium Plan";
    if (isBasic) return "Basic Plan";
    return "Free Plan";
  };

  // Tentukan styling untuk tier badge
  const getTierStyling = () => {
    if (isPro) {
      return "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md shadow-purple-200 hover:from-purple-600 hover:to-pink-600";
    }
    if (isPremium) {
      return "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-orange-200 hover:from-amber-600 hover:to-orange-600";
    }
    if (isBasic) {
      return "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-200 hover:from-blue-600 hover:to-blue-700";
    }
    return "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200";
  };

  // Tentukan icon untuk tier
  const getTierIcon = () => {
    if (isPro) return <Crown className="w-3.5 h-3.5 fill-current" />;
    if (isPremium) return <Crown className="w-3.5 h-3.5 fill-current" />;
    if (isBasic) return <Zap className="w-3.5 h-3.5 fill-current" />;
    return <Zap className="w-3.5 h-3.5" />;
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="container mx-auto px-4 py-4 max-w-5xl">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Icon & Info */}
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
              <Mic className="w-6 h-6 text-blue-600" />
            </div>

            <div>
              <h1 className="text-lg font-bold text-gray-900 tracking-tight leading-tight">
                Interview Room
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-gray-500 mt-1">
                <span className="text-gray-900">{title || "Interview"}</span>
                {level && (
                  <>
                    <span className="text-gray-300">•</span>
                    <Badge
                      variant="secondary"
                      className="rounded-md px-1.5 py-0 text-[10px] bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200 capitalize"
                    >
                      {level}
                    </Badge>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right: Status Badges */}
          {!interviewCompleted && !isGreeting && (
            <div className="flex flex-col md:flex-row items-end md:items-center gap-2">
              {/* Question Counter */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg shadow-sm">
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider hidden sm:inline-block">
                  Question
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-bold text-gray-900">
                    {currentIndex + 1}
                  </span>
                  <span className="text-xs text-gray-400">/</span>
                  <span className="text-xs text-gray-500">{total}</span>
                </div>
              </div>

              {/* UPDATE 2: TIER BADGE (Gantikan Type Question) */}
              <Badge
                className={`border-0 capitalize px-3 py-1.5 flex items-center gap-1.5 ${getTierStyling()}`}
              >
                {getTierIcon()}
                {getTierDisplayName()}
              </Badge>
            </div>
          )}

          {/* Greeting Badge */}
          {isGreeting && (
            <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 px-3 py-1 shadow-sm">
              Introduction Phase
            </Badge>
          )}
        </div>

        {/* Progress Bar */}
        {!interviewCompleted && !isGreeting && (
          <div className="mt-5 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(37,99,235,0.3)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </header>
  );
}
