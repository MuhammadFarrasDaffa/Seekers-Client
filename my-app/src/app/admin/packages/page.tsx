"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Package, Loader2, DollarSign, Coins } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import AdminProtection from "@/components/admin/AdminProtection";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import PackageCard from "@/components/admin/PackageCard";
import EmptyState from "@/components/admin/EmptyState";
import LoadingSpinner from "@/components/admin/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AdminPackage } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export default function PackageManagement() {
  const [packages, setPackages] = useState<AdminPackage[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState("Packages");

  // Form State
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    type: "",
    tokens: "",
    price: "",
    description: "",
    features: "",
    popular: false,
  });

  const handleNavigation = (path: string, name: string) => {
    setActiveTab(name);
  };

  // Fetch Packages
  const fetchPackages = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/packages`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch packages");

      const data = await res.json();
      if (data.success && data.packages) {
        setPackages(data.packages);
      }
    } catch (error) {
      console.error("Failed to fetch packages", error);
      Swal.fire({
        icon: "error",
        title: "Fetch Failed",
        text: "Failed to load packages",
        confirmButtonColor: "#3b82f6",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");
    const featuresArray = formData.features
      .split(",")
      .map((feature) => feature.trim())
      .filter((f) => f.length > 0);

    const payload = {
      name: formData.name,
      type: formData.type,
      tokens: parseInt(formData.tokens),
      price: parseFloat(formData.price),
      description: formData.description,
      features: featuresArray,
      popular: formData.popular,
    };

    const endpoint = formData.id
      ? `${API_URL}/packages/${formData.id}`
      : `${API_URL}/packages`;
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

      if (!res.ok) throw new Error("Failed to save package");

      const data = await res.json();

      if (data.success) {
        setFormData({
          id: "",
          name: "",
          type: "",
          tokens: "",
          price: "",
          description: "",
          features: "",
          popular: false,
        });
        setIsAdding(false);
        fetchPackages();
        Swal.fire({
          icon: "success",
          title: "Success",
          text: formData.id
            ? "Package updated successfully!"
            : "Package created successfully!",
          confirmButtonColor: "#3b82f6",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        throw new Error(data.message || "Failed to save package");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Action Failed",
        text: error instanceof Error ? error.message : "Failed to save package",
        confirmButtonColor: "#3b82f6",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "Delete Package",
      text: "Are you sure you want to delete this package?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(`${API_URL}/packages/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Failed to delete package");
          }

          fetchPackages();
          Swal.fire({
            icon: "success",
            title: "Deleted",
            text: "Package deleted successfully!",
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
                : "Failed to delete package",
            confirmButtonColor: "#3b82f6",
          });
        }
      }
    });
  };

  // Handle Edit
  const handleEdit = (pkg: AdminPackage) => {
    setFormData({
      id: pkg._id,
      name: pkg.name,
      type: pkg.type,
      tokens: pkg.tokens.toString(),
      price: pkg.price.toString(),
      description: pkg.description,
      features: pkg.features.join(", "),
      popular: pkg.popular,
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
              title="Package Management"
              description="Manage pricing packages, tokens, and features"
              isAdding={isAdding}
              onToggleAdd={() => {
                setIsAdding(!isAdding);
                if (!isAdding) {
                  setFormData({
                    id: "",
                    name: "",
                    type: "",
                    tokens: "",
                    price: "",
                    description: "",
                    features: "",
                    popular: false,
                  });
                }
              }}
            />

            {isAdding && (
              <div className="mb-8 bg-white rounded-3xl border border-slate-200 p-8">
                <h2 className="text-xl font-bold text-slate-900 mb-6">
                  {formData.id ? "Edit Package" : "Add New Package"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Package Name</Label>
                      <Input
                        id="name"
                        placeholder="e.g., Premium Package"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                        className="mt-1"
                      />
                    </div>

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
                        <option value="">Select Type</option>
                        <option value="basic">Basic</option>
                        <option value="premium">Premium</option>
                        <option value="pro">Pro</option>
                        <option value="enterprise">Enterprise</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="tokens">Tokens</Label>
                      <div className="relative mt-1">
                        <Coins className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                        <Input
                          id="tokens"
                          type="number"
                          placeholder="e.g., 100"
                          value={formData.tokens}
                          onChange={(e) =>
                            setFormData({ ...formData, tokens: e.target.value })
                          }
                          required
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="price">Price (IDR)</Label>
                      <div className="relative mt-1">
                        <DollarSign className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                        <Input
                          id="price"
                          type="number"
                          placeholder="e.g., 50000"
                          value={formData.price}
                          onChange={(e) =>
                            setFormData({ ...formData, price: e.target.value })
                          }
                          required
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <textarea
                      id="description"
                      placeholder="Package description..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      required
                      rows={3}
                      className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="features">Features (comma-separated)</Label>
                    <textarea
                      id="features"
                      placeholder="e.g., AI Interview Practice, CV Analysis, 1 Year Access"
                      value={formData.features}
                      onChange={(e) =>
                        setFormData({ ...formData, features: e.target.value })
                      }
                      required
                      rows={3}
                      className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="popular"
                      checked={formData.popular}
                      onChange={(e) =>
                        setFormData({ ...formData, popular: e.target.checked })
                      }
                      className="rounded"
                    />
                    <Label htmlFor="popular">Mark as Popular</Label>
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <Loader2 className="animate-spin w-4 h-4 mr-2" />
                      ) : null}
                      {formData.id ? "Update" : "Create"} Package
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsAdding(false);
                        setFormData({
                          id: "",
                          name: "",
                          type: "",
                          tokens: "",
                          price: "",
                          description: "",
                          features: "",
                          popular: false,
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
                <LoadingSpinner text="Loading packages..." />
              </div>
            ) : packages.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {packages.map((pkg) => (
                  <PackageCard
                    key={pkg._id}
                    name={pkg.name}
                    type={pkg.type}
                    tokens={pkg.tokens}
                    price={pkg.price}
                    description={pkg.description}
                    features={pkg.features}
                    popular={pkg.popular}
                    onEdit={() => handleEdit(pkg)}
                    onDelete={() => handleDelete(pkg._id)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Package}
                message="No packages found"
                subMessage="Create your first package to get started"
              />
            )}
          </div>
        </main>
      </div>
    </AdminProtection>
  );
}
