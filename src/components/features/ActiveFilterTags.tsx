import { X } from "lucide-react";
import type { SearchFilters } from "@/types";
import { cn } from "@/lib/utils";

interface ActiveFilterTagsProps {
  filters: SearchFilters;
  onRemove: (key: keyof SearchFilters, value?: string) => void;
  onClearAll: () => void;
}

export default function ActiveFilterTags({ filters, onRemove, onClearAll }: ActiveFilterTagsProps) {
  const tags: { label: string; onRemove: () => void }[] = [];

  if (filters.priceMin > 0 || filters.priceMax < 100000) {
    tags.push({
      label: `₹${filters.priceMin.toLocaleString("en-IN")} – ₹${filters.priceMax.toLocaleString("en-IN")}`,
      onRemove: () => { onRemove("priceMin"); onRemove("priceMax"); },
    });
  }
  if (filters.guestRating) {
    tags.push({ label: `Rating ${filters.guestRating}+`, onRemove: () => onRemove("guestRating") });
  }
  if (filters.freeCancellation) {
    tags.push({ label: "Free cancellation", onRemove: () => onRemove("freeCancellation") });
  }
  if (filters.breakfast) {
    tags.push({ label: "Breakfast included", onRemove: () => onRemove("breakfast") });
  }
  if (filters.parking) {
    tags.push({ label: "Parking", onRemove: () => onRemove("parking") });
  }
  if (filters.wifi) {
    tags.push({ label: "WiFi", onRemove: () => onRemove("wifi") });
  }
  if (filters.ac) {
    tags.push({ label: "AC", onRemove: () => onRemove("ac") });
  }
  filters.propertyTypes.forEach(pt => {
    tags.push({
      label: pt,
      onRemove: () => onRemove("propertyTypes", pt),
    });
  });
  filters.amenities.forEach(am => {
    tags.push({
      label: am,
      onRemove: () => onRemove("amenities", am),
    });
  });
  filters.bedTypes.forEach(bt => {
    tags.push({
      label: bt,
      onRemove: () => onRemove("bedTypes", bt),
    });
  });

  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {tags.map((tag, i) => (
        <span
          key={i}
          className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 text-blue-700 text-[12px] font-semibold px-3 py-1 rounded-full"
        >
          {tag.label}
          <button
            onClick={tag.onRemove}
            className="w-4 h-4 rounded-full bg-blue-200 hover:bg-blue-300 flex items-center justify-center transition-colors flex-shrink-0"
          >
            <X className="w-2.5 h-2.5 text-blue-700" />
          </button>
        </span>
      ))}
      <button
        onClick={onClearAll}
        className="text-[12px] font-semibold text-gray-400 hover:text-red-500 transition-colors underline underline-offset-2 ml-1"
      >
        Clear all
      </button>
    </div>
  );
}
