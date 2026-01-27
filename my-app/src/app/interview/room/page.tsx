"use client";

import {
  Answer,
  FollowUpQuestion,
  Question,
  AcknowledgmentResponse,
} from "@/types";
import { useEffect, useState, useRef } from "react";
import { useRecorder } from "./hooks/useRecorder";
import { ChatThread } from "./components/ChatThread";
import { RecordingControls } from "./components/RecordingControls";
import { CompletionCard } from "./components/CompletionCard";
import { InterviewHeader } from "./components/InterviewHeader";
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

  const {
    isRecording,
    audioURL,
    duration,
    startRecording,
    stopRecording,
    resetRecording,
    getAudioBlob,
  } = useRecorder();
  const chatEndRef = useRef<HTMLDivElement>(null);
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
          // Fallback: Jika tidak ada data di sessionStorage, redirect ke selection page
          console.warn("No interview data found, redirecting to selection...");
          // window.location.href = '/interview/selection';

          // Atau bisa fetch ulang dari API (tidak recommended)
          const response = await fetch(
            "http://localhost:3000/interviews/start",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            },
          );
          const data: Question[] = await response.json();
          setQuestions(data);
          setShowGreeting(false);
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

      // Tampilkan konfirmasi
      const shouldLeave = window.confirm(
        "Apakah Anda yakin ingin meninggalkan interview? Progress Anda akan hilang.",
      );

      if (shouldLeave) {
        // Clear sessionStorage dan redirect ke halaman interviews
        sessionStorage.removeItem("interviewData");
        window.location.href = "/interview";
      }
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

  // Auto scroll to bottom when new message appears
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentQuestionIndex, answers, showGreeting]);

  // Auto play audio when question changes or follow-up appears
  useEffect(() => {
    // Biarkan Greeting mencoba jalan tanpa interaksi (beberapa browser mengizinkan jika volume pelan/muted)
    // Tapi pertanyaan selanjutnya butuh interaksi.
    if (!hasUserInteracted && !showGreeting) {
      return;
    }

    let activeAudio: HTMLAudioElement | null = null;

    const playAudio = async (url: string, onEndedCallback?: () => void) => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }

      const audio = new Audio(url);
      activeAudio = audio;
      audioRef.current = audio;

      if (onEndedCallback) {
        audio.onended = onEndedCallback;
      }

      try {
        await audio.play();
        setAudioBlocked(false);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Playback failed:", error);
          setAudioBlocked(true);
        }
      }
    };

    // LOGIK PEMILIHAN AUDIO
    if (acknowledgment && !interviewCompleted) {
      const audioBlob = base64ToBlob(acknowledgment.audioBase64, "audio/mp3");
      playAudio(URL.createObjectURL(audioBlob), () => {
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
        }, 500);
      });
    } else if (followUpQuestion && !interviewCompleted) {
      const audioBlob = base64ToBlob(followUpQuestion.audioBase64, "audio/mp3");
      playAudio(URL.createObjectURL(audioBlob));
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
      alert("Tidak ada recording untuk dikirim");
      return;
    }

    try {
      setIsSubmitting(true);

      // Hide current question saat mulai proses
      setShowCurrentQuestion(false);

      const audioBlob = getAudioBlob();
      if (!audioBlob) {
        alert("Tidak ada recording untuk dikirim");
        return;
      }
      const formData = new FormData();
      formData.append("file", audioBlob, `recording-${Date.now()}.mp3`);

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

        // Clear follow-up setelah dijawab
        setFollowUpQuestion(null);
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

        setIsWaitingAck(false);
      }
    } catch (error) {
      console.error("Error submitting recording:", error);
      alert("Gagal mengirim recording. Silakan coba lagi.");
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
      alert("Gagal menyimpan interview. Silakan coba lagi.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <InterviewHeader
        title={
          showGreeting
            ? greetingQuestion.category?.title
            : questions[0]?.category?.title || interviewConfig?.categoryTitle
        }
        level={showGreeting ? greetingQuestion.level : questions[0]?.level}
        currentIndex={currentQuestionIndex}
        total={questions.length}
        currentQuestion={activeQuestion}
        interviewCompleted={interviewCompleted}
        isGreeting={showGreeting}
      />

      <ChatThread
        answers={answers}
        questions={questions}
        currentQuestion={activeQuestion}
        greetingQuestion={greetingQuestion}
        followUpQuestion={followUpQuestion}
        acknowledgment={acknowledgment}
        interviewCompleted={interviewCompleted}
        isWaitingFollowUp={isWaitingFollowUp}
        isWaitingAck={isWaitingAck}
        showCurrentQuestion={showCurrentQuestion}
        showGreeting={showGreeting}
        chatEndRef={chatEndRef as React.RefObject<HTMLDivElement>}
      />

      {interviewCompleted && (
        <div className="px-6 pb-24">
          <div className="max-w-4xl mx-auto">
            <CompletionCard
              totalQuestions={questions.length}
              onReset={resetInterview}
              onViewEvaluation={handleViewEvaluation}
            />
          </div>
        </div>
      )}

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
    </div>
  );
}
