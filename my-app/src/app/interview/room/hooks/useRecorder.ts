"use client";

import { useRef, useState } from "react";

interface UseRecorderResult {
  isRecording: boolean;
  audioURL: string;
  duration: number;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  resetRecording: () => void;
  getAudioBlob: () => Blob | null;
}

/**
 * Handles microphone recording, keeps track of duration, audio URL, and blob data.
 */
export function useRecorder(): UseRecorderResult {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingStartRef = useRef<number | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const [duration, setDuration] = useState(0);

  const resetRecording = () => {
    setAudioURL("");
    setDuration(0);
    audioChunksRef.current = [];
    recordingStartRef.current = null;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      recordingStartRef.current = Date.now();
      setDuration(0);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/mp3",
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Tidak dapat mengakses microphone. Pastikan Anda memberikan izin.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (recordingStartRef.current) {
        setDuration((Date.now() - recordingStartRef.current) / 1000);
      }
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      recordingStartRef.current = null;
    }
  };

  const getAudioBlob = () => {
    if (!audioChunksRef.current.length) return null;
    return new Blob(audioChunksRef.current, { type: "audio/mp3" });
  };

  return {
    isRecording,
    audioURL,
    duration,
    startRecording,
    stopRecording,
    resetRecording,
    getAudioBlob,
  };
}
