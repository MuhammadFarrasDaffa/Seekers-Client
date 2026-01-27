import Link from "next/link";
import Image from "next/image";
import { MapPin, Briefcase, ArrowRight, Clock } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Job } from "@/types";
import { formatCurrency, timeAgo } from "@/lib/utils";

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  const getFormattedSalary = (salary: Job["salary"]) => {
    if (!salary) return "Confidential";
    if (typeof salary === "object" && "min" in salary) {
      if (salary.min === 0) return "Confidential";
      return `${formatCurrency(salary.min)} - ${formatCurrency(salary.max)}`;
    }
    if (typeof salary === "string") {
      if (salary.toLowerCase().includes("confidential")) return "Confidential";
      const lines = salary.split("\n");
      const salaryLine = lines.find(
        (line) => line.includes("Rp") || line.match(/\d/),
      );
      return salaryLine ? salaryLine.trim() : salary;
    }
    return "Confidential";
  };

  const getJobDate = () => {
    if (job.lastUpdated) {
      const cleanDate = job.lastUpdated.replace("Diperbarui", "").trim();
      return cleanDate;
    }
    if (job.createdAt) {
      return timeAgo(job.createdAt);
    }
    return "Baru saja";
  };

  return (
    // CONTAINER CARD
    <Card className="group relative flex flex-col h-full bg-white transition-all duration-300 border border-gray-100 hover:border-blue-500/30 shadow-sm hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] rounded-2xl overflow-hidden">
      <CardContent className="p-6 flex-grow">
        {/* HEADER: Logo & Badges */}
        <div className="flex justify-between items-start mb-6">
          {/* Logo dengan Shadow Halus */}
          <div className="relative h-14 w-14 bg-white border border-gray-100 rounded-2xl flex items-center justify-center overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            {job.companyLogo ? (
              <Image
                src={job.companyLogo}
                alt={`${job.company} logo`}
                fill
                sizes="56px"
                className="object-contain p-1.5"
              />
            ) : (
              <div className="h-full w-full bg-gray-50 flex items-center justify-center text-lg font-bold text-gray-400">
                {job.company.substring(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex flex-col items-end gap-1.5">
            {/* Date Badge: Lebih minimalis */}
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
              <Clock className="w-3 h-3" />
              {getJobDate()}
            </div>
          </div>
        </div>

        {/* JOB INFO */}
        <div className="mb-5">
          <h3
            className="text-lg font-bold text-gray-900 mb-1.5 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug"
            title={job.title}
          >
            {job.title}
          </h3>
          <p className="text-sm font-medium text-gray-500">{job.company}</p>
        </div>

        {/* METADATA ICONS */}
        <div className="flex flex-col gap-2.5 mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Briefcase className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="truncate">{job.experienceLevel}</span>
          </div>
        </div>

        {/* SKILLS TAGS (Soft Blue) */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {job.skills.slice(0, 3).map((skill, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-blue-50/50 text-blue-600 hover:bg-blue-100 border border-blue-100/50 px-2.5 py-1 rounded-lg font-normal text-[11px]"
            >
              {skill}
            </Badge>
          ))}
          {job.skills.length > 3 && (
            <span className="text-[10px] font-medium text-gray-400 flex items-center bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
              +{job.skills.length - 3}
            </span>
          )}
        </div>
      </CardContent>

      {/* FOOTER: Bersih tanpa background color */}
      <CardFooter className="p-6 pt-0 mt-auto flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-0.5">
            Gaji / Bulan
          </span>
          <span className="text-sm font-bold text-gray-900">
            {getFormattedSalary(job.salary)}
          </span>
        </div>

        {/* BUTTON: Pill Shape, Black -> Blue Hover */}
        <Link href={`/jobs/${job._id}`}>
          <Button
            size="sm"
            className="rounded-full h-10 px-5 bg-black text-white hover:bg-blue-600 border border-transparent hover:shadow-lg hover:shadow-blue-600/20 transition-all duration-300 group/btn"
          >
            <span className="font-medium mr-1">Detail</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </Link>
      </CardFooter>

      {/* DEKORASI: Garis Type di Atas (Opsional, memberikan aksen warna) */}
      <div
        className={`absolute top-0 left-0 w-full h-1 ${
          job.jobType?.toLowerCase().includes("magang")
            ? "bg-purple-500"
            : job.jobType?.toLowerCase().includes("kontrak")
              ? "bg-orange-500"
              : "bg-blue-500" // Full time
        }`}
      />
    </Card>
  );
}
