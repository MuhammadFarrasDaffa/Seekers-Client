"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Loader2, DollarSign, Users, Layers } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import AdminProtection from "@/components/admin/AdminProtection";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import TierCard from "@/components/admin/TierCard";
import EmptyState from "@/components/admin/EmptyState";
import LoadingSpinner from "@/components/admin/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AdminTier } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export default function TierManagement() {
  const [tiers, setTiers] = useState<AdminTier[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState("Tiers");

  // Form State
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    price: "",
    benefits: "",
    quota: "",
    description: "",
  });

  const handleNavigation = (path: string, name: string) => {
    setActiveTab(name);
  };

  // Fetch Tiers
  const fetchTiers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/tiers`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch tiers");

      const data = await res.json();
      if (data.success && data.tiers) {
        setTiers(data.tiers);
      }
    } catch (error) {
      console.error("Failed to fetch tiers", error);
      Swal.fire({
        icon: "error",
        title: "Fetch Failed",
        text: "Failed to load tiers",
        confirmButtonColor: "#3b82f6",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTiers();
  }, []);

  // Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");
    const benefitsArray = formData.benefits
      .split(",")
      .map((benefit) => benefit.trim())
      .filter((b) => b.length > 0);

    const payload = {
      title: formData.title,
      price: parseInt(formData.price),
      benefits: benefitsArray,
      quota: parseInt(formData.quota),
      description: formData.description,
    };

    const endpoint = formData.id
      ? `${API_URL}/tiers/${formData.id}`
      : `${API_URL}/tiers`;
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

      if (!res.ok) throw new Error("Failed to save tier");

      const data = await res.json();

      if (data.success) {
        setFormData({
          id: "",
          title: "",
          price: "",
          benefits: "",
          quota: "",
          description: "",
        });
        setIsAdding(false);
        fetchTiers();
        Swal.fire({
          icon: "success",
          title: "Success",
          text: formData.id
            ? "Tier updated successfully!"
            : "Tier created successfully!",
          confirmButtonColor: "#3b82f6",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        throw new Error(data.message || "Failed to save tier");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Action Failed",
        text: error instanceof Error ? error.message : "Failed to save tier",
        confirmButtonColor: "#3b82f6",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "Delete Tier",
      text: "Are you sure you want to delete this tier?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(`${API_URL}/tiers/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Failed to delete tier");
          }

          fetchTiers();
          Swal.fire({
            icon: "success",
            title: "Deleted",
            text: "Tier deleted successfully!",
            confirmButtonColor: "#3b82f6",
            timer: 1500,
            showConfirmButton: false,
          });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Delete Failed",
            text:
              error instanceof Error ? error.message : "Failed to delete tier",
            confirmButtonColor: "#3b82f6",
          });
        }
      }
    });
  };

  // Handle Edit
  const handleEdit = (tier: AdminTier) => {
    setFormData({
      id: tier._id,
      title: tier.title,
      price: tier.price.toString(),
      benefits: tier.benefits.join(", "),
      quota: tier.quota.toString(),
      description: tier.description,
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
              title="Subscription Tiers"
              description="Manage pricing, benefits, and user limits for your platform"
              isAdding={isAdding}
              onToggleAdd={() => {
                setIsAdding(!isAdding);
                if (!isAdding) {
                  setFormData({
                    id: "",
                    title: "",
                    price: "",
                    benefits: "",
                    quota: "",
                    description: "",
                  });
                }
              }}
            />

            {isAdding && (
              <div className="mb-8 bg-white rounded-3xl border border-slate-200 p-8">
                <h2 className="text-xl font-bold text-slate-900 mb-6">
                  {formData.id ? "Edit Tier" : "Add New Tier"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="title">Tier Title</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Pro Plan"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="price">Token Cost</Label>
                      <div className="relative mt-1">
                        <DollarSign className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                        <Input
                          id="price"
                          type="number"
                          placeholder="e.g., 50"
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
                    <Label htmlFor="quota">Question Quota</Label>
                    <div className="relative mt-1">
                      <Users className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                      <Input
                        id="quota"
                        type="number"
                        placeholder="e.g., 100"
                        value={formData.quota}
                        onChange={(e) =>
                          setFormData({ ...formData, quota: e.target.value })
                        }
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <textarea
                      id="description"
                      placeholder="Tier description..."
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
                    <Label htmlFor="benefits">Benefits (comma-separated)</Label>
                    <textarea
                      id="benefits"
                      placeholder="e.g., Unlimited AI, 24/7 Support, No Ads"
                      value={formData.benefits}
                      onChange={(e) =>
                        setFormData({ ...formData, benefits: e.target.value })
                      }
                      required
                      rows={3}
                      className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <Loader2 className="animate-spin w-4 h-4 mr-2" />
                      ) : null}
                      {formData.id ? "Update" : "Create"} Tier
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsAdding(false);
                        setFormData({
                          id: "",
                          title: "",
                          price: "",
                          benefits: "",
                          quota: "",
                          description: "",
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
                <LoadingSpinner text="Loading tiers..." />
              </div>
            ) : tiers.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {tiers.map((tier) => (
                  <TierCard
                    key={tier._id}
                    id={tier._id}
                    title={tier.title}
                    description={tier.description}
                    price={tier.price}
                    quota={tier.quota}
                    benefits={tier.benefits}
                    onEdit={() => handleEdit(tier)}
                    onDelete={() => handleDelete(tier._id)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Layers}
                message="No tiers found"
                subMessage="Create your first tier to get started"
              />
            )}
          </div>
        </main>
      </div>
    </AdminProtection>
  );
}
