"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  PlusCircle,
  Database,
  Loader2,
  HelpCircle,
  Trash2,
  Send,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import AdminProtection from "@/components/admin/AdminProtection";
import AdminSidebar from "@/components/admin/AdminSidebar";
import EmptyState from "@/components/admin/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AdminCategory } from "@/types";

const SERVER_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
const API_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

interface BulkQuestion {
  categoryId: string;
  level: string;
  type: string;
  content: string;
  followUp: boolean;
  audioUrl?: string;
}

export default function BulkQuestionsPage() {
  const [questions, setQuestions] = useState<BulkQuestion[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("Create Questions");

  // Form inputs
  const [categoryId, setCategoryId] = useState("");
  const [level, setLevel] = useState("");
  const [type, setType] = useState("");
  const [count, setCount] = useState(10);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [questionContent, setQuestionContent] = useState("");
  const [followUp, setFollowUp] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [mode, setMode] = useState<"individual" | "bulk">("individual");

  const handleNavigation = (path: string, name: string) => {
    setActiveTab(name);
  };

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch categories");

      const data = await res.json();
      if (data.success && data.categories) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddQuestion = async () => {
    if (!categoryId || !level || !type || !questionContent) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill in all fields including question content",
        confirmButtonColor: "#3b82f6",
      });
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const payload = {
        categoryId,
        level,
        type,
        content: questionContent,
        followUp,
      };

      const res = await fetch(`${API_URL}/questions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create question");

      const data = await res.json();
      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Question created successfully!",
          confirmButtonColor: "#3b82f6",
          timer: 1500,
          showConfirmButton: false,
        });
        // Clear form
        setQuestionContent("");
        setFollowUp(false);
        setError(null);
      } else {
        throw new Error(data.message || "Failed to create question");
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Creation Failed",
        text: err instanceof Error ? err.message : "Failed to create question",
        confirmButtonColor: "#3b82f6",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleGenerateBulk = async () => {
    if (!categoryId || !level || !type) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill in category, level, and type for bulk generation",
        confirmButtonColor: "#3b82f6",
      });
      return;
    }
    if (questions.length + count > 20) {
      Swal.fire({
        icon: "warning",
        title: "Limit Exceeded",
        text: `You can only generate a maximum of 20 questions. You already have ${questions.length} question(s), so you can only add ${20 - questions.length} more.`,
        confirmButtonColor: "#3b82f6",
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      console.log("🔍 Debug Generate Bulk:", {
        SERVER_URL,
        endpoint: `${SERVER_URL}/questions/bulk`,
        token: token ? "✅ Token exists" : "❌ No token",
        payload: { categoryId, level, type, count },
      });

      const res = await fetch(`${SERVER_URL}/questions/bulk`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoryId,
          level,
          type,
          count,
        }),
      });

      console.log("📡 Response:", {
        status: res.status,
        statusText: res.statusText,
        ok: res.ok,
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ Response Error:", errorText);
        throw new Error(
          `Failed to generate questions: ${res.status} ${res.statusText}`,
        );
      }

      const data = await res.json();
      if (data.success && data.questions) {
        setQuestions([...questions, ...data.questions]);
        setError(null);

        Swal.fire({
          icon: "success",
          title: "Questions Generated",
          text: `Generated ${data.questions.length} questions successfully with AI!`,
          confirmButtonColor: "#3b82f6",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        throw new Error(data.message || "Failed to generate questions");
      }
    } catch (err) {
      console.error("🚨 Generate Bulk Error:", {
        error: err,
        message: err instanceof Error ? err.message : "Unknown error",
        name: err instanceof Error ? err.name : "N/A",
      });

      const errorMessage =
        err instanceof Error ? err.message : "Failed to generate questions";
      setError(errorMessage);

      Swal.fire({
        icon: "error",
        title: "Generation Error",
        text: errorMessage.includes("Failed to fetch")
          ? "Cannot connect to server. Please check if server is running on port 3000."
          : errorMessage,
        confirmButtonColor: "#3b82f6",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitBulk = async () => {
    if (questions.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Questions",
        text: "Please add at least one question",
        confirmButtonColor: "#3b82f6",
      });
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      // Submit questions using bulk insert API (with voice generation)
      const res = await fetch(`${SERVER_URL}/questions/insert-bulk`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questions: questions,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit questions");

      const data = await res.json();
      if (data.success) {
        setError(null);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: `Successfully created ${data.inserted} of ${data.total} question(s) with voice generation!`,
          confirmButtonColor: "#3b82f6",
        });
        setQuestions([]);

        if (data.errors && data.errors.length > 0) {
          console.warn("Some questions failed:", data.errors);
        }
      } else {
        throw new Error(data.message || "Failed to submit questions");
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Submission Error",
        text: err instanceof Error ? err.message : "Failed to submit questions",
        confirmButtonColor: "#3b82f6",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminProtection>
      <Navbar />
      <div className="flex h-screen bg-slate-50 pt-16">
        <AdminSidebar activeTab={activeTab} onNavigate={handleNavigation} />

        <main className="flex-1 ml-64 overflow-auto">
          <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                Create Questions
              </h1>
              <p className="text-slate-500 text-sm">
                Add interview questions individually or generate them in bulk
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Mode Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setMode("individual")}
                disabled={questions.length > 0}
                className={`px-6 py-2 rounded-lg font-semibold transition ${
                  mode === "individual"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                } ${questions.length > 0 ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                Individual Creation
              </button>
              <button
                onClick={() => setMode("bulk")}
                disabled={questions.length > 0}
                className={`px-6 py-2 rounded-lg font-semibold transition ${
                  mode === "bulk"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                } ${questions.length > 0 ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                Bulk Generation
              </button>
            </div>

            {/* Individual Form */}
            {mode === "individual" && (
              <div className="bg-white p-8 rounded-3xl border border-slate-200 mb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6">
                  Add Question
                </h3>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="categoryId">Category</Label>
                      <select
                        id="categoryId"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        disabled={submitting}
                        className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="level">Level</Label>
                      <select
                        id="level"
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                        disabled={submitting}
                        className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                      >
                        <option value="">Select Level</option>
                        <option value="junior">Junior</option>
                        <option value="middle">Middle</option>
                        <option value="senior">Senior</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="type">Type</Label>
                    <select
                      id="type"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      disabled={submitting}
                      className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                    >
                      <option value="">Select Type</option>
                      <option value="intro">Intro</option>
                      <option value="core">Core</option>
                      <option value="closing">Closing</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="questionContent">Question Content</Label>
                    <textarea
                      id="questionContent"
                      placeholder="Enter question content..."
                      value={questionContent}
                      onChange={(e) => setQuestionContent(e.target.value)}
                      disabled={submitting}
                      rows={4}
                      className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="followUp"
                      checked={followUp}
                      onChange={(e) => setFollowUp(e.target.checked)}
                      disabled={submitting}
                      className="rounded"
                    />
                    <Label htmlFor="followUp">Follow Up Question</Label>
                  </div>

                  <Button
                    onClick={handleAddQuestion}
                    disabled={submitting}
                    className="w-full"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="animate-spin w-4 h-4 mr-2" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Create Question
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Bulk Generation Form */}
            {mode === "bulk" && (
              <>
                <div className="bg-white p-8 rounded-3xl border border-slate-200 mb-8">
                  <h3 className="text-xl font-bold text-slate-900 mb-6">
                    Generate Questions in Bulk
                  </h3>
                  <p className="text-sm text-slate-600 mb-6">
                    Generate multiple questions based on your criteria using AI.
                    Each question will be created with voice audio automatically
                    and optimized to 100-120 characters for better readability.
                  </p>

                  {questions.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-blue-700 text-sm">
                      You have {questions.length} question(s). You can add up to{" "}
                      {20 - questions.length} more questions (maximum 20 total).
                    </div>
                  )}

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="bulkCategoryId">Category</Label>
                        <select
                          id="bulkCategoryId"
                          value={categoryId}
                          onChange={(e) => setCategoryId(e.target.value)}
                          className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Category</option>
                          {categories.map((category) => (
                            <option key={category._id} value={category._id}>
                              {category.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="bulkLevel">Level</Label>
                        <select
                          id="bulkLevel"
                          value={level}
                          onChange={(e) => setLevel(e.target.value)}
                          className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Level</option>
                          <option value="junior">Junior</option>
                          <option value="middle">Middle</option>
                          <option value="senior">Senior</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="bulkType">Type</Label>
                        <select
                          id="bulkType"
                          value={type}
                          onChange={(e) => setType(e.target.value)}
                          className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Type</option>
                          <option value="intro">Intro</option>
                          <option value="core">Core</option>
                          <option value="closing">Closing</option>
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="count">
                          Number of Questions (Max 20)
                        </Label>
                        <Input
                          id="count"
                          type="number"
                          min="1"
                          max="20"
                          value={count}
                          onChange={(e) =>
                            setCount(
                              Math.min(20, parseInt(e.target.value) || 10),
                            )
                          }
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleGenerateBulk}
                      disabled={loading || questions.length >= 20}
                      className="w-full"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin w-4 h-4 mr-2" />
                          Generating with AI...
                        </>
                      ) : (
                        <>
                          <Database className="w-4 h-4 mr-2" />
                          Generate Questions with AI
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Questions List */}
                {questions.length > 0 && (
                  <div className="bg-white rounded-3xl border border-slate-200 mb-8">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                      <h3 className="text-xl font-bold text-slate-900">
                        Questions to Submit
                      </h3>
                      <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-bold">
                        {questions.length} Items
                      </span>
                    </div>

                    <div className="divide-y divide-slate-200">
                      {questions.map((q, i) => (
                        <div
                          key={i}
                          className="p-6 hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              {editingId === `${i}` ? (
                                <div>
                                  <textarea
                                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    value={editContent}
                                    onChange={(e) =>
                                      setEditContent(e.target.value)
                                    }
                                    rows={4}
                                  />
                                  <div className="text-xs text-slate-500 mt-1">
                                    Characters: {editContent.length}{" "}
                                    {editContent.length >= 100 &&
                                    editContent.length <= 120
                                      ? "✅"
                                      : "⚠️"}
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <p className="text-slate-600 text-sm leading-relaxed">
                                    {q.content}
                                  </p>
                                  <div className="text-xs text-slate-500 mt-1">
                                    Characters: {q.content.length}{" "}
                                    {q.content.length >= 100 &&
                                    q.content.length <= 120
                                      ? "✅"
                                      : "⚠️"}
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2 ml-4">
                              {editingId === `${i}` ? (
                                <>
                                  <button
                                    onClick={() => {
                                      setQuestions(
                                        questions.map((question, idx) =>
                                          idx === i
                                            ? {
                                                ...question,
                                                content: editContent,
                                              }
                                            : question,
                                        ),
                                      );
                                      setEditingId(null);
                                      setEditContent("");
                                    }}
                                    className="text-green-600 text-xs font-bold hover:underline"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingId(null)}
                                    className="text-red-600 text-xs font-bold hover:underline"
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => {
                                      setEditingId(`${i}`);
                                      setEditContent(q.content);
                                    }}
                                    className="text-blue-600 text-xs font-bold hover:underline"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleRemoveQuestion(i)}
                                    className="text-red-600 text-xs font-bold hover:underline flex items-center gap-1"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    Remove
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-6 border-t border-slate-100 flex gap-3 justify-end">
                      <Button
                        variant="outline"
                        onClick={() => setQuestions([])}
                        disabled={submitting}
                      >
                        Clear All
                      </Button>
                      <Button onClick={handleSubmitBulk} disabled={submitting}>
                        {submitting ? (
                          <>
                            <Loader2 className="animate-spin w-4 h-4 mr-2" />
                            Creating & Generating Voice...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Submit All Questions (+ Voice)
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {questions.length === 0 && (
                  <EmptyState
                    icon={HelpCircle}
                    message="No questions generated yet"
                    subMessage="Use the form above to generate questions"
                  />
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </AdminProtection>
  );
}
