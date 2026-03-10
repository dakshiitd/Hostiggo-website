import { useState, useRef, useCallback } from "react";
import { ChevronDown, X } from "lucide-react";
import type { SortOption } from "@/types";
import { cn } from "@/lib/utils";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "recommended", label: "Sort: Recommended" },
  { value: "price_asc",   label: "Price: Low to High" },
  { value: "price_desc",  label: "Price: High to Low" },
  { value: "top_rated",   label: "Top Rated" },
  { value: "most_popular", label: "Most Popular" },
];

interface SortDropdownProps {
  value: SortOption;
  onChange: (v: SortOption) => void;
}

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = SORT_OPTIONS.find(o => o.value === value);

  const handleSelect = useCallback((v: SortOption) => { onChange(v); setOpen(false); }, [onChange]);

  // Close on outside click
  useState(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  });

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen(o => !o)}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[13px] font-semibold transition-all",
          open ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
        )}
      >
        <span>{current?.label ?? "Sort"}</span>
        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="dropdown-panel animate-fade-in-down absolute top-full left-0 mt-1 w-52 py-1 z-50">
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className={cn(
                "w-full text-left px-4 py-2.5 text-[13px] transition-colors",
                value === opt.value
                  ? "text-blue-600 font-semibold bg-blue-50"
                  : "text-gray-700 font-medium hover:bg-gray-50"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
