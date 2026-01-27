import Link from "next/link";

export default function AuthLogo() {
  return (
    // Posisi Absolute di pojok kiri atas z-20 agar di atas background animasi
    <div className="absolute top-8 left-8 z-20">
      <Link href="/" className="flex items-center gap-2 group">
        {/* Container Icon SVG */}
        <div className="bg-white/10 backdrop-blur-sm p-2 rounded-xl border border-white/20 transition-transform group-hover:scale-105">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 text-white"
          >
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          </svg>
        </div>
        {/* Teks Logo */}
        <span className="text-xl font-bold tracking-tight text-white">
          Seekers<span className="text-emerald-400">.</span>
        </span>
      </Link>
    </div>
  );
}
