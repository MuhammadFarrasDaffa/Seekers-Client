"use client";

import { useEffect, useState, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Search, MapPin, X, Briefcase, GraduationCap } from "lucide-react";
import { debounce } from "lodash";

import Navbar from "@/components/layout/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { jobService } from "@/services/jobService";
import JobCard from "@/components/jobs/JobCard";
import JobSkeleton from "@/components/jobs/JobSkeleton";
import GridBackground from "@/components/ui/GridBackground";
import TrueFocus from "@/components/ui/TrueFocus";
import { Job } from "@/types";
import PixelBlast from "@/components/ui/PixelBlast";

// --- HELPER 1: PARSE GAJI (String -> Number) ---
const parseSalaryValue = (salary: any): number => {
  if (!salary) return 0;
  if (typeof salary === "object" && salary.max) return salary.max;
  if (typeof salary === "string") {
    const lower = salary.toLowerCase();
    if (lower.includes("confidential")) return 0;
    const isJuta = lower.includes("jt") || lower.includes("juta");
    const multiplier = isJuta ? 1000000 : 1;
    const matches = lower.match(/(\d+[,.]?\d*)/g);
    if (matches && matches.length > 0) {
      const maxValStr = matches[matches.length - 1].replace(",", ".");
      return parseFloat(maxValStr) * multiplier;
    }
  }
  return 0;
};

// --- HELPER 2: PARSE WAKTU "YANG LALU" (String -> Menit) ---
// Mengubah "Diperbarui 2 jam yang lalu" menjadi angka menit (120) untuk sorting
const parseTimeAgo = (timeString: string | undefined): number => {
  if (!timeString) return 999999999; // Sangat lama

  const lower = timeString.toLowerCase();

  // Ambil angka
  const matches = lower.match(/(\d+)/);
  const number = matches ? parseInt(matches[0]) : 0;

  // Konversi ke menit
  if (lower.includes("menit") || lower.includes("minute")) return number;
  if (lower.includes("jam") || lower.includes("hour")) return number * 60;
  if (lower.includes("hari") || lower.includes("day")) return number * 60 * 24;
  if (lower.includes("bulan") || lower.includes("month"))
    return number * 60 * 24 * 30;
  if (lower.includes("kemarin") || lower.includes("yesterday")) return 60 * 24;
  if (lower.includes("baru") || lower.includes("just")) return 0;

  return 999999999;
};

export default function JobListPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [userTitle, setUserTitle] = useState(""); // Untuk sorting relevan

  // --- FILTER STATES ---
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterLevel, setFilterLevel] = useState("all");
  const [filterEdu, setFilterEdu] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Ambil data User Title saat mount untuk sorting Relevan
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          // Asumsikan user punya field 'jobTitle' atau 'title' atau kita ambil dari nama role
          // Jika tidak ada, fallback ke string kosong
          setUserTitle(user.jobTitle || user.title || "");
        } catch (e) {
          console.error("Gagal parse user data", e);
        }
      }
    }
  }, []);

  const fetchJobs = async (
    pageNum: number,
    sTitle: string,
    sLoc: string,
    fType: string,
    fLevel: string,
    fEdu: string,
    fSort: string,
    isNewSearch: boolean = false,
  ) => {
    try {
      const limit = 15; // Naikkan limit fetch agar filter client-side lebih akurat
      const result = await jobService.getAllJobs(pageNum, limit, sTitle);
      const newJobs = result.data || [];

      // --- CLIENT SIDE FILTERING ---
      let processedJobs = [...newJobs];

      if (fType !== "all") {
        processedJobs = processedJobs.filter((job) =>
          (job.jobType || "").toLowerCase().includes(fType.toLowerCase()),
        );
      }

      if (fLevel !== "all") {
        processedJobs = processedJobs.filter((job) =>
          (job.experienceLevel || "")
            .toLowerCase()
            .includes(fLevel.toLowerCase()),
        );
      }

      if (sLoc) {
        processedJobs = processedJobs.filter((job) =>
          (job.location || "").toLowerCase().includes(sLoc.toLowerCase()),
        );
      }

      if (fEdu !== "all") {
        processedJobs = processedJobs.filter((job) =>
          (job.minEducation || "").toLowerCase().includes(fEdu.toLowerCase()),
        );
      }

      // --- CLIENT SIDE SORTING (FIXED) ---
      if (fSort === "salary_desc") {
        processedJobs.sort(
          (a, b) => parseSalaryValue(b.salary) - parseSalaryValue(a.salary),
        );
      } else if (fSort === "newest") {
        // Sort Ascending berdasarkan "Menit yang lalu" (Semakin kecil semakin baru)
        processedJobs.sort((a, b) => {
          // Prioritas 1: lastUpdated (String "7 hari lalu")
          if (a.lastUpdated || b.lastUpdated) {
            return parseTimeAgo(a.lastUpdated) - parseTimeAgo(b.lastUpdated);
          }
          // Prioritas 2: createdAt (ISO Date)
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA; // Descending (Terbaru di atas)
        });
      } else if (fSort === "relevance") {
        // Sort berdasarkan kemiripan Title Job dengan User Title
        if (userTitle) {
          processedJobs.sort((a, b) => {
            const titleA = (a.title || "").toLowerCase();
            const titleB = (b.title || "").toLowerCase();
            const target = userTitle.toLowerCase();

            // Cek apakah mengandung kata kunci user
            const scoreA = titleA.includes(target) ? 1 : 0;
            const scoreB = titleB.includes(target) ? 1 : 0;

            return scoreB - scoreA; // Yang match ditaruh di atas
          });
        }
      }

      // --- UPDATE STATE & HANDLE EMPTY ---
      if (isNewSearch) {
        setJobs(processedJobs);
        // FIX BUG SKELETON: Matikan loading segera jika ini search baru
        setInitialLoading(false);

        // Jika hasil filter kosong, matikan hasMore agar tidak load terus
        if (processedJobs.length === 0) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      } else {
        setJobs((prevJobs) => {
          const existingIds = new Set(prevJobs.map((job) => job._id));
          const uniqueNewJobs = processedJobs.filter(
            (job) => !existingIds.has(job._id),
          );
          return [...prevJobs, ...uniqueNewJobs];
        });

        if (processedJobs.length === 0 || newJobs.length < limit) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setInitialLoading(false);
    }
  };

  const triggerFetch = useCallback(
    debounce((sTitle, sLoc, fType, fLevel, fEdu, fSort) => {
      setPage(1);
      setInitialLoading(true);
      // Reset jobs sementara agar user tau sedang loading ulang (opsional, tapi bagus UX-nya)
      setJobs([]);
      fetchJobs(1, sTitle, sLoc, fType, fLevel, fEdu, fSort, true);
    }, 500),
    [userTitle], // Dependency userTitle untuk sorting relevan
  );

  useEffect(() => {
    triggerFetch(
      searchTerm,
      searchLocation,
      filterType,
      filterLevel,
      filterEdu,
      sortBy,
    );
  }, [
    searchTerm,
    searchLocation,
    filterType,
    filterLevel,
    filterEdu,
    sortBy,
    triggerFetch,
  ]);

  const loadMoreData = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchJobs(
      nextPage,
      searchTerm,
      searchLocation,
      filterType,
      filterLevel,
      filterEdu,
      sortBy,
      false,
    );
  };

  const resetFilters = () => {
    setFilterType("all");
    setFilterLevel("all");
    setFilterEdu("all");
    setSearchTerm("");
    setSearchLocation("");
    setSortBy("newest");
  };

  const isFilterActive =
    filterType !== "all" ||
    filterLevel !== "all" ||
    filterEdu !== "all" ||
    searchTerm !== "" ||
    searchLocation !== "";

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
            <Briefcase className="w-4 h-4" />
            <span>Platform Karir Bertenaga AI</span>
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
            Algoritma kami mempertemukan potensimu dengan peluang yang tepat.
            <br className="hidden md:block" />
            Efisien, akurat, dan dirancang untuk pertumbuhanmu.
          </p>
        </div>
      </div>

      {/* STICKY SEARCH & FILTER BAR */}
      <div className="sticky top-16 z-30 transition-all duration-200 -mt-8 mb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl shadow-blue-900/5 border border-gray-100 p-4 md:p-5">
            {/* SEARCH ROW */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Cari posisi, perusahaan, atau skill..."
                  className="pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500 rounded-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative md:w-[30%]">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Lokasi (e.g. Jakarta)"
                  className="pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500 rounded-lg"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                />
              </div>
              <Button className="h-11 px-8 bg-black hover:bg-gray-800 text-white font-semibold rounded-lg">
                Cari Loker
              </Button>
            </div>

            {/* FILTER ROW */}
            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-gray-100">
              <span className="text-sm font-medium text-gray-500 mr-1">
                Filter:
              </span>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[130px] h-9 text-sm bg-white border-gray-300 rounded-lg">
                  <SelectValue placeholder="Tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tipe</SelectItem>
                  <SelectItem value="Penuh Waktu">Penuh Waktu</SelectItem>
                  <SelectItem value="Kontrak">Kontrak</SelectItem>
                  <SelectItem value="Magang">Magang</SelectItem>
                  <SelectItem value="Paruh Waktu">Paruh Waktu</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterLevel} onValueChange={setFilterLevel}>
                <SelectTrigger className="w-[150px] h-9 text-sm bg-white border-gray-300 rounded-lg">
                  <SelectValue placeholder="Pengalaman" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Level</SelectItem>
                  <SelectItem value="kurang dari 1 tahun">
                    Fresh Graduate
                  </SelectItem>
                  <SelectItem value="1 - 3 tahun">Junior (1-3 thn)</SelectItem>
                  <SelectItem value="3 - 5 tahun">Mid (3-5 thn)</SelectItem>
                  <SelectItem value="5 - 10 tahun">Senior (5+ thn)</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterEdu} onValueChange={setFilterEdu}>
                <SelectTrigger className="w-[140px] h-9 text-sm bg-white border-gray-300 rounded-lg">
                  <div className="flex items-center gap-2 truncate">
                    <GraduationCap className="w-3 h-3 text-gray-500" />
                    <SelectValue placeholder="Pendidikan" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="SMA">SMA/SMK</SelectItem>
                  <SelectItem value="Diploma">Diploma (D3/D4)</SelectItem>
                  <SelectItem value="Sarjana">Sarjana (S1)</SelectItem>
                  <SelectItem value="Magister">Magister (S2)</SelectItem>
                </SelectContent>
              </Select>

              <div className="ml-auto flex items-center gap-2">
                <span className="text-xs text-gray-400 hidden md:inline">
                  Urutkan:
                </span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[130px] h-9 text-sm border-transparent hover:bg-gray-50 text-gray-600 font-medium text-right">
                    <SelectValue placeholder="Urutkan" />
                  </SelectTrigger>
                  <SelectContent align="end">
                    <SelectItem value="newest">Terbaru</SelectItem>
                    <SelectItem value="relevance">Paling Relevan</SelectItem>
                    <SelectItem value="salary_desc">Gaji Tertinggi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {isFilterActive && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="h-9 px-2 text-red-500 hover:bg-red-50"
                >
                  <X className="w-4 h-4 mr-1" /> Reset
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="container mx-auto px-4 pb-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {isFilterActive ? "Hasil Pencarian" : "Lowongan Rekomendasi"}
            </h2>
            <span className="text-sm text-gray-500">
              {jobs.length} Pekerjaan
            </span>
          </div>

          <InfiniteScroll
            dataLength={jobs.length}
            next={loadMoreData}
            hasMore={hasMore}
            loader={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <JobSkeleton key={i} />
                ))}
              </div>
            }
            style={{ overflow: "visible" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* SKELETON: Hanya muncul jika initialLoading TRUE */}
              {initialLoading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <JobSkeleton key={i} />
                ))}

              {/* JOBS: Muncul jika initialLoading FALSE */}
              {!initialLoading &&
                jobs.map((job) => <JobCard key={job._id} job={job} />)}
            </div>
          </InfiniteScroll>

          {/* EMPTY STATE: Muncul jika initialLoading FALSE DAN jobs kosong */}
          {!initialLoading && jobs.length === 0 && (
            <div className="text-center py-20 bg-white rounded-xl border border-gray-200 mt-6 shadow-sm">
              <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Lowongan tidak ditemukan
              </h3>
              <p className="text-gray-500 mt-1 max-w-sm mx-auto">
                Maaf, tidak ada lowongan yang cocok dengan filter atau kata
                kunci tersebut.
              </p>
              <Button
                variant="link"
                className="mt-2 text-blue-600"
                onClick={resetFilters}
              >
                Reset Semua Filter
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
