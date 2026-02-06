"use client";

import {
  Answer,
  FollowUpQuestion,
  Question,
  AcknowledgmentResponse,
} from "@/types";
import { useEffect, useState, useRef } from "react";
import { useRecorder } from "./hooks/useRecorder";
import { QuestionCard } from "./components/QuestionCard";
import { RecordingControls } from "./components/RecordingControls";
import { CompletionCard } from "./components/CompletionCard";
import { InterviewHeader } from "./components/InterviewHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, Play } from "lucide-react";
import { useModal } from "@/components/ui/modal";
import {
  requestAcknowledgment,
  requestFollowUp,
  saveInterview,
  sendAnswerAudio,
} from "./lib/interviewApi";

interface InterviewConfig {
  categoryId: string;
  categoryTitle: string;
  level: string;
  tier: string;
}

export default function Room() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Interview flow states
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [interviewCompleted, setInterviewCompleted] = useState(false);
  const [followUpQuestion, setFollowUpQuestion] =
    useState<FollowUpQuestion | null>(null);
  const [acknowledgment, setAcknowledgment] =
    useState<AcknowledgmentResponse | null>(null);
  const [isWaitingFollowUp, setIsWaitingFollowUp] = useState(false);
  const [isWaitingAck, setIsWaitingAck] = useState(false);
  const [showCurrentQuestion, setShowCurrentQuestion] = useState(true);
  const [interviewConfig, setInterviewConfig] =
    useState<InterviewConfig | null>(null);
  const [showGreeting, setShowGreeting] = useState(true);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [showStartModal, setShowStartModal] = useState(true);
  const [lastTranscription, setLastTranscription] = useState<string | null>(
    null,
  );

  // Modal hook untuk mengganti browser alerts
  const { modal, showAlert, showConfirm, closeModal, Modal } = useModal();

  const {
    isRecording,
    audioURL,
    duration,
    startRecording,
    stopRecording,
    resetRecording,
    getAudioBlob,
  } = useRecorder();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const greetingQuestion: Question = {
    _id: "greeting",
    categoryId:
      interviewConfig?.categoryId || questions[0]?.categoryId || "greeting",
    level: interviewConfig?.level || questions[0]?.level || "",
    type: "greeting",
    content:
      "Halo, perkenalkan nama saya Bella, dalam kesempatan kali ini saya akan menjadi pewawancara Anda untuk posisi yang Anda lamar. Mari kita mulai wawancaranya.",
    followUp: false,
    audioUrl:
      "https://res.cloudinary.com/dx8d5yjt2/video/upload/v1769408059/interview_questions/mobile_senior_greeting_135.mp3",
    category: {
      title:
        interviewConfig?.categoryTitle ||
        questions[0]?.category?.title ||
        "Interview",
    },
  };
  const activeQuestion = showGreeting ? greetingQuestion : currentQuestion;

  useEffect(() => {
    async function fetchQuestions() {
      try {
        setLoading(true);

        // Ambil data dari sessionStorage
        const storedData = sessionStorage.getItem("interviewData");

        if (storedData) {
          const { config, questions: questionData } = JSON.parse(storedData);

          setQuestions(questionData);
          setInterviewConfig(config);

          // Optional: Log config untuk debugging
          console.log("Interview Config:", config);

          // Optional: Clear data setelah digunakan agar tidak tertinggal
          // sessionStorage.removeItem('interviewData');
        } else {
          // Fallback: Jika tidak ada data di sessionStorage, redirect ke setup page
          console.warn("No interview data found, redirecting to setup...");
          window.location.href = "/interview/setup";
          return;
        }
      } catch (error) {
        console.log("🚀 ~ fetch ~ error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions();
  }, []);

  // Detect first user interaction to allow autoplay in browsers
  useEffect(() => {
    const markInteracted = () => setHasUserInteracted(true);
    window.addEventListener("pointerdown", markInteracted, { once: true });
    window.addEventListener("keydown", markInteracted, { once: true });
    return () => {
      window.removeEventListener("pointerdown", markInteracted);
      window.removeEventListener("keydown", markInteracted);
    };
  }, []);

  // Prevent back navigation during interview
  useEffect(() => {
    if (interviewCompleted) return;

    // Tambahkan entry ke history untuk mencegah back
    window.history.pushState(null, "", window.location.href);

    const handlePopState = (event: PopStateEvent) => {
      if (interviewCompleted) return;

      // Push state kembali untuk mencegah back
      window.history.pushState(null, "", window.location.href);

      // Tampilkan konfirmasi menggunakan modal
      showConfirm(
        "Konfirmasi Keluar",
        "Apakah Anda yakin ingin meninggalkan interview? Progress Anda akan hilang.",
        () => {
          // Clear sessionStorage dan redirect ke halaman interviews
          sessionStorage.removeItem("interviewData");
          window.location.href = "/interview";
        },
        {
          confirmText: "Ya, Keluar",
          cancelText: "Tetap di Interview",
        },
      );
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!interviewCompleted) {
        event.preventDefault();
        event.returnValue = "";
        return "";
      }
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [interviewCompleted]);

  // Auto play audio when question changes or follow-up appears
  useEffect(() => {
    // Only play audio after user has clicked "Mulai Interview" button
    if (!hasUserInteracted) {
      return;
    }

    let activeAudio: HTMLAudioElement | null = null;

    const playAudio = async (url: string, onEndedCallback?: () => void) => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }

      // Use simple Audio constructor with URL directly
      const audio = new Audio(url);

      // Set crossOrigin for external URLs (Cloudinary), not needed for blob URLs
      if (url.startsWith("http") && !url.startsWith("blob:")) {
        audio.crossOrigin = "anonymous";
      }

      activeAudio = audio;
      audioRef.current = audio;

      // Set audio playing state
      audio.onplay = () => setIsAudioPlaying(true);
      audio.onended = () => {
        setIsAudioPlaying(false);
        if (onEndedCallback) onEndedCallback();
      };
      audio.onpause = () => setIsAudioPlaying(false);

      try {
        await audio.play();
        setAudioBlocked(false);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Playback failed:", error);
          setAudioBlocked(true);
          setIsAudioPlaying(false);
        }
      }
    };

    // LOGIK PEMILIHAN AUDIO
    if (acknowledgment && !interviewCompleted) {
      // VOICE ENABLED: Play audio for acknowledgment response
      if (acknowledgment.audioBase64) {
        const audioBlob = base64ToBlob(acknowledgment.audioBase64, "audio/mp3");
        playAudio(URL.createObjectURL(audioBlob), () => {
          setAnswers((prev) => {
            const updated = [...prev];
            if (updated.length > 0)
              updated[updated.length - 1].acknowledgment = acknowledgment.text;
            return updated;
          });
          setAcknowledgment(null);
          setShowCurrentQuestion(true);
          if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
          } else {
            setInterviewCompleted(true);
          }
        });
      } else {
        // Fallback if no audio provided
        setTimeout(() => {
          setAnswers((prev) => {
            const updated = [...prev];
            if (updated.length > 0)
              updated[updated.length - 1].acknowledgment = acknowledgment.text;
            return updated;
          });
          setAcknowledgment(null);
          setShowCurrentQuestion(true);
          if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
          } else {
            setInterviewCompleted(true);
          }
        }, 1500);
      }
    } else if (followUpQuestion && !interviewCompleted) {
      // VOICE ENABLED: Play audio for follow-up response
      if (followUpQuestion.audioBase64) {
        const audioBlob = base64ToBlob(
          followUpQuestion.audioBase64,
          "audio/mp3",
        );
        playAudio(URL.createObjectURL(audioBlob));
      } else {
        console.log(
          "Follow-up question displayed (no audio available):",
          followUpQuestion.text,
        );
      }
    } else if (!interviewCompleted && activeQuestion?.audioUrl) {
      // Memutar Greeting atau Pertanyaan Reguler
      playAudio(activeQuestion.audioUrl, () => {
        if (showGreeting) {
          // Transisi dari Greeting ke Question 0
          setHasUserInteracted(true); // Paksa true karena sistem sudah "aktif"
          setShowGreeting(false);
          setShowCurrentQuestion(true);
          setCurrentQuestionIndex(0);
        }
      });
    }

    return () => {
      if (activeAudio) {
        activeAudio.pause();
        activeAudio.src = "";
      }
    };
  }, [
    currentQuestionIndex,
    interviewCompleted,
    activeQuestion?.audioUrl, // Gunakan property spesifik agar tidak trigger berlebihan
    followUpQuestion,
    acknowledgment,
    showGreeting,
    hasUserInteracted,
  ]);

  // Auto play audio when question changes or follow-up appears

  // Helper function to convert base64 to blob
  const base64ToBlob = (base64: string, mimeType: string) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  };

  const handleReRecord = async () => {
    resetRecording();
    await startRecording();
  };

  const submitAnswer = async () => {
    if (!audioURL) {
      showAlert("Peringatan", "Tidak ada recording untuk dikirim", "warning");
      return;
    }

    try {
      setIsSubmitting(true);

      // Hide current question saat mulai proses
      setShowCurrentQuestion(false);

      const audioBlob = getAudioBlob();
      if (!audioBlob) {
        showAlert("Peringatan", "Tidak ada recording untuk dikirim", "warning");
        return;
      }

      // Determine file extension based on MIME type
      const mimeType = audioBlob.type;
      let extension = "webm";
      if (mimeType.includes("mp4")) extension = "mp4";
      else if (mimeType.includes("ogg")) extension = "ogg";
      else if (mimeType.includes("mpeg") || mimeType.includes("mp3"))
        extension = "mp3";

      const formData = new FormData();
      formData.append(
        "file",
        audioBlob,
        `recording-${Date.now()}.${extension}`,
      );

      const result = await sendAnswerAudio(formData);

      // Tentukan pertanyaan yang sedang dijawab (regular atau follow-up)
      const currentQuestion = followUpQuestion
        ? {
            _id: `followup-${Date.now()}`,
            content: followUpQuestion.text,
            followUp: false,
          }
        : questions[currentQuestionIndex];

      const newAnswer: Answer = {
        questionId: currentQuestion._id,
        question: followUpQuestion
          ? followUpQuestion.text
          : currentQuestion.content,
        transcription: result.transcription,
        audioURL: audioURL,
        duration,
        isFollowUp: !!followUpQuestion,
      };

      // Save last transcription for follow-up display
      setLastTranscription(result.transcription);

      setAnswers([...answers, newAnswer]);
      resetRecording();

      // Check apakah pertanyaan ini membutuhkan follow-up
      const needsFollowUp =
        !followUpQuestion && questions[currentQuestionIndex]?.followUp;

      if (needsFollowUp) {
        // Generate follow-up question
        setIsWaitingFollowUp(true);

        const followUpData = await requestFollowUp(
          currentQuestion.content,
          result.transcription,
        );

        setFollowUpQuestion({
          text: followUpData.text,
          audioBase64: followUpData.audioBase64,
          parentQuestionId: currentQuestion._id,
        });

        setIsWaitingFollowUp(false);
        setShowCurrentQuestion(true); // Show follow-up question
      } else if (followUpQuestion) {
        // Jika ini adalah jawaban dari follow-up question,
        // generate acknowledgment lalu move ke pertanyaan berikutnya
        setIsWaitingAck(true);

        const ackData = await requestAcknowledgment(
          followUpQuestion.text,
          result.transcription,
        );

        setAcknowledgment({
          text: ackData.text,
          audioBase64: ackData.audioBase64,
          questionId: currentQuestion._id,
        });

        // Clear follow-up dan last transcription setelah dijawab
        setFollowUpQuestion(null);
        setLastTranscription(null);
        setIsWaitingAck(false);
      } else {
        // Generate acknowledgment response untuk pertanyaan biasa tanpa follow-up
        setIsWaitingAck(true);

        const ackData = await requestAcknowledgment(
          currentQuestion.content,
          result.transcription,
        );

        setAcknowledgment({
          text: ackData.text,
          audioBase64: ackData.audioBase64,
          questionId: currentQuestion._id,
        });

        // Clear last transcription for non-follow-up questions
        setLastTranscription(null);
        setIsWaitingAck(false);
      }
    } catch (error) {
      console.error("Error submitting recording:", error);
      showAlert(
        "Error",
        "Gagal mengirim recording. Silakan coba lagi.",
        "error",
      );
      setIsWaitingFollowUp(false);
      setIsWaitingAck(false);
      setShowCurrentQuestion(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetInterview = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setInterviewCompleted(false);
    resetRecording();
  };

  const saveInterviewToDatabase = async () => {
    try {
      if (!interviewConfig) {
        console.error("Interview config not found");
        return null;
      }

      const interviewData = {
        categoryId: interviewConfig.categoryId,
        category: interviewConfig.categoryTitle,
        level: interviewConfig.level,
        tier: interviewConfig.tier,
        questions: questions.map((q) => ({
          _id: q._id,
          content: q.content,
          type: q.type,
          level: q.level,
          followUp: q.followUp,
        })),
        answers: answers.map((a) => ({
          questionId: a.questionId,
          question: a.question,
          transcription: a.transcription,
          duration: a.duration,
          isFollowUp: a.isFollowUp,
          acknowledgment: a.acknowledgment,
        })),
      };

      const result = await saveInterview(interviewData);
      return result.interviewId;
    } catch (error) {
      console.error("Error saving interview:", error);
      return null;
    }
  };

  const handleViewEvaluation = async () => {
    const interviewId = await saveInterviewToDatabase();

    if (interviewId) {
      // Redirect ke halaman evaluate dengan interview ID
      window.location.href = `/interview/evaluate?id=${interviewId}`;
    } else {
      showAlert(
        "Error",
        "Gagal menyimpan interview. Silakan coba lagi.",
        "error",
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8F9FC]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Memuat interview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FC]">
      <InterviewHeader
        title={
          showGreeting
            ? greetingQuestion.category?.title
            : questions[0]?.category?.title || interviewConfig?.categoryTitle
        }
        level={showGreeting ? greetingQuestion.level : questions[0]?.level}
        tier={interviewConfig?.tier}
        currentIndex={currentQuestionIndex}
        total={questions.length}
        currentQuestion={activeQuestion}
        interviewCompleted={interviewCompleted}
        isGreeting={showGreeting}
      />

      {/* Question Card - Single Question Display */}
      {!interviewCompleted && (
        <QuestionCard
          question={activeQuestion}
          followUpQuestion={followUpQuestion}
          isWaitingFollowUp={isWaitingFollowUp}
          isWaitingAck={isWaitingAck}
          acknowledgmentText={acknowledgment?.text || null}
          showQuestion={showCurrentQuestion}
          isGreeting={showGreeting}
          isAudioPlaying={isAudioPlaying}
          lastTranscription={lastTranscription}
        />
      )}

      {/* Completion Card */}
      {interviewCompleted && (
        <div className="flex-1 flex items-center justify-center px-6 py-8">
          <CompletionCard
            totalQuestions={questions.length}
            onReset={resetInterview}
            onViewEvaluation={handleViewEvaluation}
          />
        </div>
      )}

      {/* Recording Controls */}
      {!interviewCompleted &&
        !isWaitingFollowUp &&
        !isWaitingAck &&
        !acknowledgment &&
        !showGreeting && (
          <RecordingControls
            audioURL={audioURL}
            isRecording={isRecording}
            isSubmitting={isSubmitting}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
            onSubmitAnswer={submitAnswer}
            onReRecord={handleReRecord}
          />
        )}

      {/* Start Interview Modal - Required for browser autoplay policy */}
      {showStartModal && !loading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full p-8 shadow-2xl text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-200">
              <Mic className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Siap Memulai Interview?
            </h2>
            <p className="text-gray-600 mb-6">
              Klik tombol di bawah untuk memulai sesi interview Anda.
              Pewawancara AI akan mulai berbicara.
            </p>
            <Button
              onClick={() => {
                setShowStartModal(false);
                setHasUserInteracted(true);
              }}
              className="w-full h-14 bg-black hover:bg-gray-800 text-white font-semibold rounded-xl shadow-lg text-lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Mulai Interview
            </Button>
          </Card>
        </div>
      )}

      {/* Custom Modal untuk mengganti browser alerts */}
      <Modal />
    </div>
  );
}
