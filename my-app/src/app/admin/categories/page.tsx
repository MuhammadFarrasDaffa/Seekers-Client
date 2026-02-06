"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { LayoutGrid, Loader2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import AdminProtection from "@/components/admin/AdminProtection";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import CategoryCard from "@/components/admin/CategoryCard";
import EmptyState from "@/components/admin/EmptyState";
import LoadingSpinner from "@/components/admin/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AdminCategory } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export default function CategoryManagement() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState("Categories");

  // Form State
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    imgUrl: "",
    level: {
      junior: false,
      middle: false,
      senior: false,
    },
    published: false,
  });

  const handleNavigation = (path: string, name: string) => {
    setActiveTab(name);
  };

  // 1. Fetch Categories (GET)
  const fetchCategories = async () => {
    setLoading(true);
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
      console.error("Failed to fetch", error);
      Swal.fire({
        icon: "error",
        title: "Fetch Failed",
        text: "Failed to load categories",
        confirmButtonColor: "#3b82f6",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // 2. Handle Create/Update (POST/PUT)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");
    const payload = {
      title: formData.title,
      description: formData.description,
      imgUrl: formData.imgUrl,
      level: formData.level,
      published: formData.published,
    };

    const endpoint = formData.id
      ? `${API_URL}/categories/${formData.id}`
      : `${API_URL}/categories`;
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

      if (!res.ok) throw new Error("Failed to save category");

      const data = await res.json();

      if (data.success) {
        setFormData({
          id: "",
          title: "",
          description: "",
          imgUrl: "",
          level: { junior: false, middle: false, senior: false },
          published: false,
        });
        setIsAdding(false);
        fetchCategories();
        Swal.fire({
          icon: "success",
          title: "Success",
          text: formData.id
            ? "Category updated successfully!"
            : "Category created successfully!",
          confirmButtonColor: "#3b82f6",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        throw new Error(data.message || "Failed to save category");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Action Failed",
        text:
          error instanceof Error ? error.message : "Failed to save category",
        confirmButtonColor: "#3b82f6",
      });
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle Delete (DELETE)
  const handleDelete = async (id: string) => {
    try {
      Swal.fire({
        title: "Delete Category",
        text: "Are you sure you want to delete this category?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/categories/${id}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });

            if (!res.ok) {
              const errorData = await res.json();
              throw new Error(errorData.message || "Failed to delete category");
            }

            fetchCategories();
            Swal.fire({
              icon: "success",
              title: "Deleted",
              text: "Category deleted successfully!",
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
                  : "Failed to delete category",
              confirmButtonColor: "#3b82f6",
            });
          }
        }
      });
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // 4. Handle Edit
  const handleEdit = (category: AdminCategory) => {
    setFormData({
      id: category._id,
      title: category.title,
      description: category.description,
      imgUrl: category.imgUrl,
      level: category.level,
      published: category.published,
    });
    setIsAdding(true);
  };

  // 5. Handle Publish Toggle
  const handleTogglePublish = async (category: AdminCategory) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/categories/${category._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...category,
          published: !category.published,
        }),
      });

      if (res.ok) {
        fetchCategories();
      }
    } catch (error) {
      console.error("Toggle publish failed:", error);
    }
  };

  return (
    <AdminProtection>
      <Navbar />
      <div className="flex h-screen bg-slate-50 pt-16">
        <AdminSidebar activeTab={activeTab} onNavigate={handleNavigation} />

        <main className="flex-1 ml-64 overflow-auto">
          <div className="p-8 max-w-7xl mx-auto">
            <AdminHeader
              title="Category Management"
              description="Manage categories for interview questions"
              isAdding={isAdding}
              onToggleAdd={() => {
                setIsAdding(!isAdding);
                if (!isAdding) {
                  setFormData({
                    id: "",
                    title: "",
                    description: "",
                    imgUrl: "",
                    level: { junior: false, middle: false, senior: false },
                    published: false,
                  });
                }
              }}
            />

            {isAdding && (
              <div className="mb-8 bg-white rounded-3xl border border-slate-200 p-8">
                <h2 className="text-xl font-bold text-slate-900 mb-6">
                  {formData.id ? "Edit Category" : "Add New Category"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        type="text"
                        placeholder="Category title"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="imgUrl">Image URL</Label>
                      <Input
                        id="imgUrl"
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={formData.imgUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, imgUrl: e.target.value })
                        }
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      type="text"
                      placeholder="Category description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      required
                      className="mt-1"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Levels</Label>
                    <div className="flex gap-4">
                      {["junior", "middle", "senior"].map((level) => (
                        <label key={level} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={
                              formData.level[
                                level as keyof typeof formData.level
                              ]
                            }
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                level: {
                                  ...formData.level,
                                  [level]: e.target.checked,
                                },
                              })
                            }
                            className="rounded"
                          />
                          <span className="capitalize">{level}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="published"
                      checked={formData.published}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          published: e.target.checked,
                        })
                      }
                      className="rounded"
                    />
                    <Label htmlFor="published">Published</Label>
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <Loader2 className="animate-spin w-4 h-4 mr-2" />
                      ) : null}
                      {formData.id ? "Update" : "Create"} Category
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsAdding(false);
                        setFormData({
                          id: "",
                          title: "",
                          description: "",
                          imgUrl: "",
                          level: {
                            junior: false,
                            middle: false,
                            senior: false,
                          },
                          published: false,
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
                <LoadingSpinner text="Loading categories..." />
              </div>
            ) : categories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                  <CategoryCard
                    key={category._id}
                    id={category._id}
                    title={category.title}
                    description={category.description}
                    imgUrl={category.imgUrl}
                    level={category.level}
                    published={category.published}
                    onEdit={() => handleEdit(category)}
                    onDelete={() => handleDelete(category._id)}
                    onTogglePublish={() => handleTogglePublish(category)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={LayoutGrid}
                message="No categories found"
                subMessage="Create your first category to get started"
              />
            )}
          </div>
        </main>
      </div>
    </AdminProtection>
  );
}
