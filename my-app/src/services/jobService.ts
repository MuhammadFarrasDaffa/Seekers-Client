// src/services/jobService.ts
const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const jobService = {
  // Ambil semua lowongan
  getAllJobs: async () => {
    // Kita asumsikan endpoint public, kalau butuh token nanti kita tambah header Authorization
    const res = await fetch(`${API_URL}/jobs`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store", // Agar data selalu fresh (SSR/ISR)
    });

    if (!res.ok) {
      const error: any = new Error("Gagal mengambil data lowongan");
      error.status = res.status;
      throw error;
    }
    return await res.json();
  },
};
