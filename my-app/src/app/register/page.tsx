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
import AuthLogo from "@/components/auth/AuthLogo"; // Import logo
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
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
      await authService.register(
        formData.name,
        formData.email,
        formData.password,
      );
      toast.success("Akun Berhasil Dibuat!", { description: "Silakan login." });
      router.push("/login");
    } catch (error: any) {
      toast.error("Gagal Mendaftar", { description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen relative overflow-hidden flex items-center justify-center bg-black">
      {/* LAYER 0: LOGO */}
      <AuthLogo />

      {/* LAYER 1: Background Animation (Emerald Accent) */}
      <div className="absolute inset-0 z-0">
        <PixelBlast
          variant="square"
          pixelSize={4}
          color="#7588d7" // Ungu/Biru
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

      {/* LAYER 2: HORIZONTAL CARD FORM */}
      <div className="relative z-10 w-full max-w-4xl p-4">
        <div className="w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
          {/* SISI KIRI: Welcome Section */}
          <div className="w-full md:w-5/12 bg-gray-50 p-8 md:p-10 flex flex-col justify-center border-b md:border-b-0 md:border-r border-gray-100">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
              Mulai Langkah <br /> Profesionalmu.
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Buat akun dalam hitungan detik. Gratis selamanya untuk para
              pencari kerja.
            </p>
            {/* Feature list kecil */}
            <ul className="space-y-2 text-sm text-gray-500 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" /> Analisis CV
                dengan AI
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" /> Rekomendasi
                Job Akurat
              </li>
            </ul>
          </div>

          {/* SISI KANAN: Form Section */}
          <div className="w-full md:w-7/12 p-8 md:p-10">
            <div className="mb-8 text-center md:text-middle">
              <h1 className="text-xl font-bold text-gray-900">
                Buat Akun Baru
              </h1>
              <p className="text-sm text-gray-600">
                Sudah punya akun?{" "}
                <Link
                  href="/login"
                  className="font-bold text-blue-600 hover:underline"
                >
                  Login disini
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700">
                  Nama Lengkap
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="h-11 bg-white border-gray-200 focus:border-blue-600 focus:ring-blue-600/20 transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="h-11 bg-white border-gray-200 focus:border-blue-600 focus:ring-blue-600/20 transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="h-11 bg-white border-gray-200 focus:border-blue-600 focus:ring-blue-600/20 transition-all"
                />
              </div>

              <Button
                type="submit"
                // Gunakan warna biru untuk tombol register
                className="w-full h-11 bg-black hover:bg-gray-900 text-white font-semibold text-md mt-2 cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? "Membuat Akun..." : "Daftar Sekarang"}
              </Button>
            </form>

            {/* SEPARATOR & SOCIAL */}
            <div className="flex items-center gap-4 my-6">
              <Separator className="flex-1" />
              <span className="text-xs text-gray-400 font-medium">ATAU</span>
              <Separator className="flex-1" />
            </div>
            <Button
              variant="outline"
              className="w-full h-11 font-medium"
              type="button"
            >
              <svg
                className="mr-2 h-4 w-4"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="google"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 488 512"
              >
                <path
                  fill="currentColor"
                  d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                ></path>
              </svg>
              Daftar dengan Google
            </Button>

            {/* FOOTER LINK */}
            <div className="mt-8 text-center md:text-middle">
              <p className="text-[11px] text-gray-400 leading-tight mt-4">
                Dengan mendaftar, kamu setuju dengan{" "}
                <Link
                  href="#"
                  className="underline text-blue-600 hover:text-blue-700"
                >
                  Ketentuan
                </Link>{" "}
                &{" "}
                <Link
                  href="#"
                  className="underline text-blue-600 hover:text-blue-700"
                >
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
