"use client";

import {
  Package,
  Edit3,
  Trash2,
  Star,
  CheckCircle2,
  Coins,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PackageCardProps {
  name: string;
  type: string;
  tokens: number;
  price: number;
  description: string;
  features: string[];
  popular: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export default function PackageCard({
  id,
  name,
  type,
  tokens,
  price,
  description,
  features,
  popular,
  onEdit,
  onDelete,
}: PackageCardProps) {
  return (
    <div
      className={`relative bg-white rounded-[2rem] p-8 border transition-all ${
        popular
          ? "border-blue-400 shadow-xl shadow-blue-200/50"
          : "border-slate-200 shadow-sm hover:shadow-lg"
      }`}
    >
      {popular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="flex items-center gap-1 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold">
            <Star size={14} /> Popular
          </div>
        </div>
      )}

      <div className="flex justify-between items-start mb-6">
        <div className="bg-slate-100 p-3 rounded-2xl text-slate-600">
          <Package size={24} />
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="p-2 text-slate-400 hover:text-blue-600 transition"
          >
            <Edit3 size={18} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="p-2 text-slate-400 hover:text-red-600 transition"
          >
            <Trash2 size={18} />
          </Button>
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-1">{name}</h3>
      <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-4">
        {type}
      </p>
      <p className="text-sm text-slate-500 mb-6">{description}</p>

      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-3">
          <Coins className="text-slate-400" size={18} />
          <span className="text-sm text-slate-600">
            <span className="font-bold text-slate-900">
              {tokens.toLocaleString()}
            </span>{" "}
            Tokens
          </span>
        </div>
        <div className="flex items-center gap-3">
          <DollarSign className="text-slate-400" size={18} />
          <span className="text-sm text-slate-600">
            <span className="font-bold text-slate-900">${price}</span> USD
          </span>
        </div>
      </div>

      <div className="mb-8 pb-8 border-t border-slate-200">
        <p className="text-xs font-bold text-slate-400 uppercase mb-3 mt-4">
          Features
        </p>
        <div className="space-y-2">
          {features.slice(0, 3).map((feature, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 text-sm text-slate-600"
            >
              <CheckCircle2
                size={16}
                className="text-green-500 mt-0.5 shrink-0"
              />
              <span>{feature.trim()}</span>
            </div>
          ))}
          {features.length > 3 && (
            <p className="text-xs text-slate-400 mt-2">
              +{features.length - 3} more features
            </p>
          )}
        </div>
      </div>

      <Button
        className="w-full py-3 rounded-xl bg-slate-950 text-white font-bold text-sm hover:bg-slate-900 transition"
        disabled
      >
        Select Package
      </Button>
    </div>
  );
}
