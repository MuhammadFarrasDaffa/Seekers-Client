"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { HelpCircle, Loader2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import AdminProtection from "@/components/admin/AdminProtection";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import QuestionCard from "@/components/admin/QuestionCard";
import EmptyState from "@/components/admin/EmptyState";
import LoadingSpinner from "@/components/admin/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AdminQuestion, AdminCategory } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export default function QuestionsManagement() {
  const [questions, setQuestions] = useState<AdminQuestion[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState("Questions");

  // Form State
  const [formData, setFormData] = useState({
    id: "",
    categoryId: "",
    level: "",
    type: "intro",
    content: "",
    followUp: false,
    audioUrl: "",
  });

  const handleNavigation = (path: string, name: string) => {
    setActiveTab(name);
  };

  // Fetch Questions
  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/questions`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch questions");

      const data = await res.json();
      if (data.success && data.questions) {
        setQuestions(
          data.questions.map((q: AdminQuestion) => ({
            ...q,
            categoryTitle: q.categoryId?.title || "Unknown Category",
          })),
        );
      }
    } catch (error) {
      console.error("Failed to fetch questions", error);
      Swal.fire({
        icon: "error",
        title: "Fetch Failed",
        text: "Failed to load questions",
        confirmButtonColor: "#3b82f6",
      });
    } finally {
      setLoading(false);
    }
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
    fetchQuestions();
    fetchCategories();
  }, []);

  // Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");
    const payload = {
      categoryId: formData.categoryId,
      level: formData.level,
      type: formData.type,
      content: formData.content,
      followUp: formData.followUp,
      audioUrl: formData.audioUrl,
    };

    const endpoint = formData.id
      ? `${API_URL}/questions/${formData.id}`
      : `${API_URL}/questions`;
    const method = formData.id ? "PUT" : "POST";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save question");

      const data = await res.json();

      if (data.success) {
        setFormData({
          id: "",
          categoryId: "",
          level: "",
          type: "intro",
          content: "",
          followUp: false,
          audioUrl: "",
        });
        setIsAdding(false);
        fetchQuestions();
        Swal.fire({
          icon: "success",
          title: "Success",
          text: formData.id
            ? "Question updated successfully!"
            : "Question created successfully!",
          confirmButtonColor: "#3b82f6",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        throw new Error(data.message || "Failed to save question");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Action Failed",
        text:
          error instanceof Error ? error.message : "Failed to save question",
        confirmButtonColor: "#3b82f6",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "Delete Question",
      text: "Are you sure you want to delete this question?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(`${API_URL}/questions/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Failed to delete question");
          }

          fetchQuestions();
          Swal.fire({
            icon: "success",
            title: "Deleted",
            text: "Question deleted successfully!",
            confirmButtonColor: "#3b82f6",
            timer: 1500,
            showConfirmButton: false,
          });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Delete Failed",
            text:
              error instanceof Error
                ? error.message
                : "Failed to delete question",
            confirmButtonColor: "#3b82f6",
          });
        }
      }
    });
  };

  // Handle Edit
  const handleEdit = (question: AdminQuestion) => {
    setFormData({
      id: question._id,
      categoryId: question.categoryId,
      level: question.level,
      type: question.type,
      content: question.content,
      followUp: question.followUp,
      audioUrl: question.audioUrl || "",
    });
    setIsAdding(true);
  };

  return (
    <AdminProtection>
      <Navbar />
      <div className="flex h-screen bg-slate-50 pt-16">
        <AdminSidebar activeTab={activeTab} onNavigate={handleNavigation} />

        <main className="flex-1 ml-64 overflow-auto">
          <div className="p-8 max-w-7xl mx-auto">
            <AdminHeader
              title="Question Management"
              description="Manage interview questions by category and level"
              isAdding={isAdding}
              onToggleAdd={() => {
                setIsAdding(!isAdding);
                if (!isAdding) {
                  setFormData({
                    id: "",
                    categoryId: "",
                    level: "",
                    type: "intro",
                    content: "",
                    followUp: false,
                    audioUrl: "",
                  });
                }
              }}
            />

            {isAdding && (
              <div className="mb-8 bg-white rounded-3xl border border-slate-200 p-8">
                <h2 className="text-xl font-bold text-slate-900 mb-6">
                  {formData.id ? "Edit Question" : "Add New Question"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="categoryId">Category</Label>
                      <select
                        id="categoryId"
                        value={formData.categoryId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            categoryId: e.target.value,
                          })
                        }
                        required
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
                      <Label htmlFor="level">Level</Label>
                      <select
                        id="level"
                        value={formData.level}
                        onChange={(e) =>
                          setFormData({ ...formData, level: e.target.value })
                        }
                        required
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
                      <Label htmlFor="type">Type</Label>
                      <select
                        id="type"
                        value={formData.type}
                        onChange={(e) =>
                          setFormData({ ...formData, type: e.target.value })
                        }
                        required
                        className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="intro">Intro</option>
                        <option value="core">Core</option>
                        <option value="closing">Closing</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="audioUrl">Audio URL (Optional)</Label>
                      <Input
                        id="audioUrl"
                        type="url"
                        placeholder="https://example.com/audio.mp3"
                        value={formData.audioUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, audioUrl: e.target.value })
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="content">Question Content</Label>
                    <textarea
                      id="content"
                      placeholder="Enter the interview question..."
                      value={formData.content}
                      onChange={(e) =>
                        setFormData({ ...formData, content: e.target.value })
                      }
                      required
                      rows={4}
                      className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="followUp"
                      checked={formData.followUp}
                      onChange={(e) =>
                        setFormData({ ...formData, followUp: e.target.checked })
                      }
                      className="rounded"
                    />
                    <Label htmlFor="followUp">Follow-up Question</Label>
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <Loader2 className="animate-spin w-4 h-4 mr-2" />
                      ) : null}
                      {formData.id ? "Update" : "Create"} Question
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsAdding(false);
                        setFormData({
                          id: "",
                          categoryId: "",
                          level: "",
                          type: "intro",
                          content: "",
                          followUp: false,
                          audioUrl: "",
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <LoadingSpinner text="Loading questions..." />
              </div>
            ) : questions.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {questions.map((question) => (
                  <QuestionCard
                    key={question._id}
                    id={question._id}
                    content={question.content}
                    categoryTitle={question.categoryTitle || "Unknown Category"}
                    level={question.level}
                    type={question.type}
                    followUp={question.followUp}
                    audioUrl={question.audioUrl}
                    onEdit={() => handleEdit(question)}
                    onDelete={() => handleDelete(question._id)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={HelpCircle}
                message="No questions found"
                subMessage="Create your first question to get started"
              />
            )}
          </div>
        </main>
      </div>
    </AdminProtection>
  );
}
