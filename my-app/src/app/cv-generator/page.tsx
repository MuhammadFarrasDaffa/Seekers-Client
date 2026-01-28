"use client";

import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  FileText,
  CheckCircle2,
  Zap,
  ArrowRight,
  Wand2,
  LayoutTemplate,
} from "lucide-react";
import Link from "next/link";
import PixelBlast from "@/components/ui/PixelBlast";
import TrueFocus from "@/components/ui/TrueFocus";

export default function CVGeneratorLandingPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      <Navbar />

      {/* HERO HEADER */}
      <div className="relative pt-32 pb-24 overflow-hidden bg-white border-b border-gray-100">
        <div className="absolute inset-0 z-0 opacity-40">
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
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-6">
            <Wand2 className="w-4 h-4" />
            <span>AI-Powered Resume Builder</span>
          </div>
          <div className="mb-6 flex justify-center">
            <TrueFocus
              sentence="Navigasi Karir Era Digital"
              blurAmount={4}
              borderColor="#2563eb"
              glowColor="rgba(37, 99, 235, 0.4)"
            />
          </div>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Otomatis generate CV yang lolos sistem ATS. Tidak perlu desain
            manual,
            <br className="hidden md:block" />
            cukup lengkapi profil dan biarkan AI bekerja untukmu.
          </p>
        </div>
      </div>

      {/* CTA SECTION */}
      <div className="relative -mt-8 mb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl shadow-blue-900/5 border border-gray-100 p-8 text-center">
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
              <Link href="/cv-generator/create">
                <Button className="px-8 h-12 bg-black hover:bg-gray-800 text-white font-semibold rounded-lg flex items-center gap-2">
                  Buat CV Sekarang
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Button
                variant="outline"
                className="px-8 h-12 border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                Lihat Contoh
              </Button>
            </div>

            {/* Stats / Trust Badges */}
            <div className="pt-6 border-t border-gray-100 flex flex-wrap justify-center gap-6 md:gap-8">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium text-gray-600">
                  ATS-Friendly Template
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium text-gray-600">
                  Auto-fill dari Profil
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium text-gray-600">
                  Download PDF Instan
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES GRID */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Fitur Unggulan
            </h2>
            <p className="text-gray-500">
              Dirancang untuk membantu kamu mendapatkan pekerjaan lebih cepat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Zap className="w-6 h-6 text-white" />}
              color="bg-amber-500"
              title="Cepat & Mudah"
              desc="Tidak perlu pusing memikirkan layout. Cukup isi data, pilih template, dan CV siap dalam sekejap."
            />
            <FeatureCard
              icon={<LayoutTemplate className="w-6 h-6 text-white" />}
              color="bg-blue-500"
              title="Template Modern"
              desc="Pilihan desain minimalis dan profesional yang disukai oleh HRD perusahaan teknologi top."
            />
            <FeatureCard
              icon={<FileText className="w-6 h-6 text-white" />}
              color="bg-emerald-500"
              title="Optimasi ATS"
              desc="Struktur dokumen yang mudah dibaca oleh mesin (Applicant Tracking System) untuk meningkatkan peluang lolos screening."
            />
          </div>
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div className="py-16 bg-[#F8F9FC] border-t border-gray-100">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Disukai oleh Job Seekers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-gray-600 italic mb-4">
                "Gak nyangka bikin CV bisa secepat ini. Tampilannya rapi banget
                dan langsung dipanggil interview besoknya!"
              </p>
              <div className="font-bold text-gray-900">
                - Andi, Frontend Developer
              </div>
            </div>
            <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-gray-600 italic mb-4">
                "Fitur auto-fill dari profil sangat membantu. Gak perlu ngetik
                ulang pengalaman kerja dari awal."
              </p>
              <div className="font-bold text-gray-900">
                - Rina, Digital Marketer
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  color,
  title,
  desc,
}: {
  icon: React.ReactNode;
  color: string;
  title: string;
  desc: string;
}) {
  return (
    <Card className="p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 bg-white rounded-xl">
      <div
        className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-gray-200/50`}
      >
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 leading-relaxed text-sm">{desc}</p>
    </Card>
  );
}
