const BASE_URL = "http://localhost:3000/interviews";

export async function sendAnswerAudio(formData: FormData) {
  const response = await fetch(`${BASE_URL}/answer`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!response.ok) {
    throw new Error("Gagal mengirim recording");
  }
  return response.json();
}

export async function requestFollowUp(question: string, answer: string) {
  const response = await fetch(`${BASE_URL}/response`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      question,
      answer,
      needFollowUp: true,
    }),
  });
  if (!response.ok) {
    throw new Error("Gagal generate follow-up question");
  }
  return response.json();
}

export async function requestAcknowledgment(question: string, answer: string) {
  const response = await fetch(`${BASE_URL}/response`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      question,
      answer,
      needFollowUp: false,
    }),
  });
  if (!response.ok) {
    throw new Error("Gagal generate acknowledgment");
  }
  return response.json();
}

export async function saveInterview(interviewData: unknown) {
  const response = await fetch(`${BASE_URL}/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(interviewData),
  });
  if (!response.ok) {
    throw new Error("Failed to save interview");
  }
  return response.json();
}
