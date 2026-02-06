"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AdminProtection({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAccess = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const userStr = localStorage.getItem("user");
      if (!userStr) {
        router.push("/login");
        return;
      }

      try {
        const user = JSON.parse(userStr);
        if (user.role !== "admin") {
          router.push("/dashboard");
          return;
        }
      } catch (error) {
        console.error("Failed to parse user data:", error);
        router.push("/login");
        return;
      }

      setLoading(false);
    };

    checkAccess();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2
            className="animate-spin mx-auto mb-4 text-slate-900"
            size={40}
          />
          <p className="text-slate-600 font-medium">
            Verifying admin access...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
