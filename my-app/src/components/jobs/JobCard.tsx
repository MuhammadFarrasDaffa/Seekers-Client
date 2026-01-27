import Link from "next/link";
import Image from "next/image";
import { MapPin, Briefcase, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Job } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  // --- HELPER: Format Gaji Pintar ---
  const getFormattedSalary = (salary: Job["salary"]) => {
    // 1. Jika kosong / null
    if (!salary) return "Confidential";

    // 2. Jika tipe Object (Format Ideal)
    if (typeof salary === "object" && "min" in salary) {
      if (salary.min === 0) return "Confidential";
      return `${formatCurrency(salary.min)} - ${formatCurrency(salary.max)}`;
    }

    // 3. Jika tipe String (Hasil Scraping Glints)
    if (typeof salary === "string") {
      if (salary.toLowerCase().includes("confidential")) return "Confidential";

      // Data di DB kotor: "UI/UX Designer\nRp 6 jt - 11 jt"
      // Kita ambil baris yang ada "Rp" atau angka
      const lines = salary.split("\n");
      const salaryLine = lines.find(
        (line) => line.includes("Rp") || line.match(/\d/),
      );

      return salaryLine ? salaryLine.trim() : salary;
    }

    return "Confidential";
  };

  return (
    <Card className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-gray-200 overflow-hidden flex flex-col h-full bg-white ring-1 ring-gray-950/5">
      <CardContent className="p-6 flex-grow">
        {/* HEADER: Logo & Type */}
        <div className="flex justify-between items-start mb-5">
          <div className="relative h-14 w-14 bg-white border border-gray-100 rounded-xl flex items-center justify-center overflow-hidden shadow-sm">
            {job.companyLogo ? (
              <Image
                src={job.companyLogo}
                alt={`${job.company} logo`}
                fill
                sizes="56px"
                className="object-contain p-1"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-lg font-bold text-blue-600">
                {job.company.substring(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          <Badge
            variant="secondary"
            className="bg-gray-100 text-gray-600 hover:bg-gray-200 font-medium"
          >
            {job.type}
          </Badge>
        </div>

        {/* TITLE & COMPANY */}
        <div className="mb-4">
          <h3
            className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight"
            title={job.title}
          >
            {job.title}
          </h3>
          <p className="text-sm font-medium text-gray-500">{job.company}</p>
        </div>

        {/* METADATA */}
        <div className="flex flex-col gap-2 mb-5 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-gray-400 shrink-0" />
            <span>{job.experienceLevel}</span>
          </div>
        </div>

        {/* SKILLS TAGS */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {job.skills.slice(0, 3).map((skill, index) => (
            <Badge
              key={index}
              variant="outline"
              className="border-blue-100 text-blue-600 bg-blue-50/30 hover:bg-blue-50 text-[10px] px-2 py-0.5 h-6 font-medium rounded-md"
            >
              {skill}
            </Badge>
          ))}
          {job.skills.length > 3 && (
            <span className="text-[10px] text-gray-400 flex items-center bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
              +{job.skills.length - 3}
            </span>
          )}
        </div>
      </CardContent>

      {/* FOOTER: Gaji & Button */}
      <CardFooter className="p-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between backdrop-blur-sm">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
            Gaji / Bulan
          </span>
          {/* PANGGIL FUNGSI FORMAT GAJI DISINI */}
          <span className="text-sm font-bold text-gray-900">
            {getFormattedSalary(job.salary)}
          </span>
        </div>

        <Link href={`/jobs/${job._id}`}>
          <Button
            size="sm"
            className="bg-white hover:bg-black text-black hover:text-white border border-gray-200 hover:border-black transition-all rounded-lg group/btn shadow-sm"
          >
            Detail
            <ArrowRight className="w-3 h-3 ml-1 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
