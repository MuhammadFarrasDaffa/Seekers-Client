"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { authService } from "@/services/authService";
import PixelBlast from "@/components/ui/PixelBlast";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Wiring ke Backend
      const response = await authService.login(
        formData.email,
        formData.password,
      );

      // Simpan Token
      if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
      }

      toast.success("Login Berhasil!", {
        description: "Selamat datang kembali.",
      });

      // Redirect
      router.push("/dashboard");
    } catch (error: any) {
      toast.error("Login Gagal", { description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen relative overflow-hidden flex items-center justify-center bg-black">
      {/* LAYER 1: Background Animation (Full Screen) */}
      <div className="absolute inset-0 z-0">
        <PixelBlast
          variant="square"
          pixelSize={4}
          color="#7588d7" // Warna Pixel Biru Ungu
          patternScale={2}
          patternDensity={1}
          pixelSizeJitter={0}
          enableRipples
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          liquid={false}
          speed={0.5}
          edgeFade={0.25}
          transparent={true}
        />
      </div>

      {/* LAYER 2: Centered Card Form */}
      <div className="relative z-10 w-full max-w-[420px] p-4">
        {/* Container Putih di tengah */}
        <div className="w-full bg-white rounded-2xl shadow-2xl p-8 md:p-10">
          {/* HEADER: Logo & Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
              Seekers.
            </h1>
            <p className="text-gray-500 text-sm">
              Masuk untuk melanjutkan perjalanan karirmu.
            </p>
          </div>

          {/* FORM AREA */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="nama@email.com"
                value={formData.email}
                onChange={handleChange}
                className="bg-gray-50 border-gray-200 focus:bg-white transition-all"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="text-xs text-blue-600 hover:underline"
                >
                  Lupa password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="bg-gray-50 border-gray-200 focus:bg-white transition-all"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-5"
              disabled={isLoading}
            >
              {isLoading ? "Memproses..." : "Masuk"}
            </Button>
          </form>

          {/* SEPARATOR */}
          <div className="flex items-center gap-4 my-6">
            <Separator className="flex-1" />
            <span className="text-xs text-gray-400 font-medium">ATAU</span>
            <Separator className="flex-1" />
          </div>

          {/* SOCIAL LOGIN */}
          <Button variant="outline" className="w-full py-5" type="button">
            Masuk dengan Google
          </Button>

          {/* FOOTER */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Belum punya akun?{" "}
              <Link
                href="/register"
                className="font-bold text-blue-600 hover:underline"
              >
                Daftar Gratis
              </Link>
            </p>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-[11px] text-gray-400 leading-tight">
                Dengan masuk, kamu setuju dengan{" "}
                <Link href="#" className="underline text-gray-600">
                  Ketentuan
                </Link>{" "}
                &{" "}
                <Link href="#" className="underline text-gray-600">
                  Privasi
                </Link>{" "}
                kami.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
