"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { pdfService } from "@/services/pdfService";
import { Download, ArrowLeft, FileText, Loader2 } from "lucide-react";
import PixelBlast from "@/components/ui/PixelBlast";
import { Badge } from "@/components/ui/badge";

export default function PreviewPage() {
  const router = useRouter();
  const [htmlContent, setHtmlContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPreview();
  }, []);

  const loadPreview = async () => {
    try {
      const html = await pdfService.getPreviewHTML();
      setHtmlContent(html);
    } catch (error: any) {
      setError(error.message || "Gagal memuat preview CV");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setIsDownloading(true);
      const blob = await pdfService.generatePDF("modern");
      const filename = `CV_${Date.now()}.pdf`;
      pdfService.downloadPDF(blob, filename);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      setError("Gagal download PDF. Silakan coba lagi.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50/50 relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 z-0 h-[400px] [mask-image:linear-gradient(to_bottom,black_30%,transparent_100%)]">
          <PixelBlast
            variant="square"
            pixelSize={4}
            color="#10b981" // Green color untuk preview
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

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
          {/* Header Section */}
          <div className="text-center mb-8">
            <Badge
              variant="secondary"
              className="mb-4 px-4 py-1 text-sm bg-white/80 backdrop-blur border border-gray-200 text-green-600 shadow-sm"
            >
              <FileText className="h-4 w-4 mr-2" />
              Preview CV
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-3">
              Preview CV Anda
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Lihat tampilan CV Anda sebelum didownload atau dibagikan kepada
              perusahaan.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard")}
              className="w-full sm:w-auto bg-white/80 backdrop-blur hover:bg-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Dashboard
            </Button>

            <Button
              onClick={handleDownloadPDF}
              disabled={isDownloading || isLoading}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Mengunduh...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </>
              )}
            </Button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-16 bg-white/80 backdrop-blur rounded-2xl border border-gray-200 shadow-lg">
              <Loader2 className="h-12 w-12 text-green-600 animate-spin mb-4" />
              <p className="text-gray-600 font-medium">Memuat preview CV...</p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="bg-red-50/80 backdrop-blur border border-red-200 text-red-700 px-6 py-4 rounded-xl shadow-sm">
              <p className="font-medium">⚠️ {error}</p>
              <Button
                variant="outline"
                onClick={loadPreview}
                className="mt-3 border-red-300 text-red-700 hover:bg-red-100"
              >
                Coba Lagi
              </Button>
            </div>
          )}

          {/* Preview Content */}
          {htmlContent && !isLoading && (
            <div
              className="bg-white shadow-2xl rounded-2xl overflow-hidden mx-auto border border-gray-200"
              style={{ maxWidth: "21cm" }}
            >
              <div
                className="preview-content p-8 md:p-12"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
                style={{
                  minHeight: "29.7cm",
                  fontSize: "10pt",
                  lineHeight: "1.4",
                }}
              />
            </div>
          )}

          {/* Empty State */}
          {!htmlContent && !isLoading && !error && (
            <div className="text-center py-16 bg-white/80 backdrop-blur rounded-2xl border border-gray-200 shadow-lg">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Belum Ada Data CV
              </h3>
              <p className="text-gray-600 mb-6">
                Lengkapi profil Anda terlebih dahulu untuk membuat CV.
              </p>
              <Button
                onClick={() => router.push("/profile")}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Lengkapi Profil
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
