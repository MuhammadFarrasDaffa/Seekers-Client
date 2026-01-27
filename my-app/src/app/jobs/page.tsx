"use client";

import { useEffect, useState } from "react";
import { Search, Filter } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { jobService } from "@/services/jobService";
import JobCard from "@/components/jobs/JobCard";
import JobSkeleton from "@/components/jobs/JobSkeleton";
import { Job } from "@/types";

export default function JobListPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Fetch Data
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const result = await jobService.getAllJobs();
        // Pastikan result.data ada, jika tidak array kosong
        const data = result.data || [];
        setJobs(data);
        setFilteredJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // 2. Logic Filter Client-Side (Realtime Search)
  useEffect(() => {
    const results = jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills.some((skill) =>
          skill.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
    );
    setFilteredJobs(results);
  }, [searchTerm, jobs]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* HEADER SECTION */}
      <div className="bg-white border-b border-gray-200 pt-24 pb-10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Lowongan Pekerjaan Terbaru
            </h1>
            <p className="text-gray-500 mb-8">
              Temukan peluang karir terbaik dari perusahaan teknologi terkemuka.
            </p>

            {/* SEARCH BAR */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Cari posisi, perusahaan, atau skill..."
                  className="pl-10 h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                className="h-12 px-4 gap-2 hidden md:flex"
              >
                <Filter className="w-4 h-4" /> Filter
              </Button>
            </div>

            {/* TAGS POPULER (Hardcoded for UI) */}
            <div className="flex flex-wrap gap-2 mt-4 text-sm text-gray-500">
              <span>Populer:</span>
              <button
                onClick={() => setSearchTerm("React")}
                className="hover:text-blue-600 underline"
              >
                React
              </button>
              <button
                onClick={() => setSearchTerm("Backend")}
                className="hover:text-blue-600 underline"
              >
                Backend
              </button>
              <button
                onClick={() => setSearchTerm("UI/UX")}
                className="hover:text-blue-600 underline"
              >
                UI/UX
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* JOB LIST GRID */}
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          // LOADING STATE: Tampilkan 6 Skeleton
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <JobSkeleton key={i} />
            ))}
          </div>
        ) : filteredJobs.length > 0 ? (
          // DATA STATE: Tampilkan JobCard
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        ) : (
          // EMPTY STATE
          <div className="text-center py-20">
            <div className="bg-white inline-flex p-4 rounded-full shadow-sm mb-4">
              <Search className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Lowongan tidak ditemukan
            </h3>
            <p className="text-gray-500 mt-1">
              Coba gunakan kata kunci lain atau hapus filter.
            </p>
            <Button
              variant="link"
              className="mt-2 text-blue-600"
              onClick={() => setSearchTerm("")}
            >
              Reset Pencarian
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
