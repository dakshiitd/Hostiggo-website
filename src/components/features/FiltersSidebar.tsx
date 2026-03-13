import { useState, useCallback } from "react";
import { ChevronDown, ChevronUp, RotateCcw, Star, Wifi, Car, Coffee, Wind, Droplets } from "lucide-react";
import type { SearchFilters } from "@/types";
import { cn } from "@/lib/utils";
import MapPreview from "@/components/features/MapPreview";

interface FiltersSidebarProps {
  filters: SearchFilters;
  onChange: <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => void;
  onReset: () => void;
  city?: string;
  count?: number;
}

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 pb-4 mb-4">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between mb-3 group"
      >
        <span className="text-[13px] font-bold text-gray-800">{title}</span>
        {open
          ? <ChevronUp className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600" />
          : <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600" />}
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}

function CheckChip({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        "px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-all",
        checked
          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
          : "bg-gray-50 text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-600"
      )}
    >
      {label}
    </button>
  );
}

function CheckRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="w-full flex items-center gap-2.5 cursor-pointer py-1.5 group text-left"
    >
      <div className={cn(
        "w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all",
        checked ? "bg-blue-600 border-blue-600" : "border-gray-300 group-hover:border-blue-400"
      )}>
        {checked && <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
      </div>
      <span className={cn("text-[13px] transition-colors", checked ? "text-gray-800 font-semibold" : "text-gray-600 group-hover:text-gray-800")}>{label}</span>
    </button>
  );
}

const PROPERTY_TYPES = ["Homestay", "Villa", "Cottage", "Apartment", "Resort"];
const AMENITY_LIST = ["WiFi", "Kitchen", "Parking", "Pool", "Mountain view", "Balcony"];
const BED_TYPES = ["Single bed", "Double bed", "Queen bed", "King bed"];

function toggleArr(arr: string[], val: string) {
  return arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];
}

function PriceSlider({ min, max, onMin, onMax }: { min: number; max: number; onMin: (v: number) => void; onMax: (v: number) => void }) {
  const MIN = 0, MAX = 100000;
  const pct1 = ((min - MIN) / (MAX - MIN)) * 100;
  const pct2 = ((max - MIN) / (MAX - MIN)) * 100;

  return (
    <div>
      <div className="relative h-5 my-3">
        <div className="absolute inset-y-0 flex items-center w-full">
          <div className="w-full h-1 bg-gray-200 rounded-full relative">
            <div
              className="absolute h-full bg-blue-500 rounded-full"
              style={{ left: `${pct1}%`, right: `${100 - pct2}%` }}
            />
          </div>
        </div>
        <input
          type="range" min={MIN} max={MAX} step={500} value={min}
          onChange={e => { const v = +e.target.value; if (v < max) onMin(v); }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          style={{ zIndex: 2 }}
        />
        <input
          type="range" min={MIN} max={MAX} step={500} value={max}
          onChange={e => { const v = +e.target.value; if (v > min) onMax(v); }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          style={{ zIndex: 3 }}
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1">
          <p className="text-[9px] text-gray-400 font-semibold uppercase">Min</p>
          <p className="text-[12px] font-bold text-gray-800">₹{min.toLocaleString("en-IN")}</p>
        </div>
        <div className="h-px flex-1 bg-gray-200 mx-2" />
        <div className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-right">
          <p className="text-[9px] text-gray-400 font-semibold uppercase">Max</p>
          <p className="text-[12px] font-bold text-gray-800">₹{max.toLocaleString("en-IN")}</p>
        </div>
      </div>
    </div>
  );
}

export default function FiltersSidebar({ filters, onChange, onReset, city = "New Delhi", count = 0 }: FiltersSidebarProps) {
  return (
    <aside className="w-full lg:w-[220px] xl:w-[240px] flex-shrink-0">
      <div className="bg-white rounded-2xl p-4 sticky top-20" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.07)" }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[14px] font-bold text-gray-800">Filters</h2>
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset all
          </button>
        </div>

        {/* Map preview */}
        <div className="mb-4">
          <MapPreview city={city} count={count} />
        </div>

        {/* Price range */}
        <Section title="Price Range">
          <PriceSlider
            min={filters.priceMin}
            max={filters.priceMax}
            onMin={v => onChange("priceMin", v)}
            onMax={v => onChange("priceMax", v)}
          />
        </Section>

        {/* Popular filters */}
        <Section title="Popular Filters">
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: "Free cancellation", key: "freeCancellation" as const },
              { label: "Breakfast", key: "breakfast" as const },
              { label: "Parking", key: "parking" as const },
              { label: "WiFi", key: "wifi" as const },
              { label: "AC", key: "ac" as const },
            ].map(({ label, key }) => (
              <CheckChip
                key={key}
                label={label}
                checked={filters[key] as boolean}
                onChange={v => onChange(key, v)}
              />
            ))}
          </div>
        </Section>

        {/* Guest rating */}
        <Section title="Guest rating">
          <div className="flex gap-2">
            {[3, 4, 4.5].map(r => (
              <button
                key={r}
                onClick={() => onChange("guestRating", filters.guestRating === r ? null : r)}
                className={cn(
                  "flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-[12px] font-semibold transition-all",
                  filters.guestRating === r
                    ? "bg-amber-400 border-amber-400 text-white shadow-sm"
                    : "border-gray-200 text-gray-600 hover:border-amber-300"
                )}
              >
                <Star className={cn("w-3 h-3", filters.guestRating === r ? "fill-white text-white" : "fill-amber-400 text-amber-400")} />
                {r}+
              </button>
            ))}
          </div>
        </Section>

        {/* Property type */}
        <Section title="Property Type">
          <div className="flex flex-wrap gap-1.5">
            {PROPERTY_TYPES.map(pt => (
              <CheckChip
                key={pt}
                label={pt}
                checked={filters.propertyTypes.includes(pt)}
                onChange={() => onChange("propertyTypes", toggleArr(filters.propertyTypes, pt))}
              />
            ))}
          </div>
        </Section>

        {/* Facilities */}
        <Section title="Facilities">
          <div className="space-y-0.5">
            {AMENITY_LIST.map(am => (
              <CheckRow
                key={am}
                label={am}
                checked={filters.amenities.includes(am)}
                onChange={() => onChange("amenities", toggleArr(filters.amenities, am))}
              />
            ))}
          </div>
        </Section>

        {/* Bed type */}
        <Section title="Bed Type" defaultOpen={false}>
          <div className="space-y-0.5">
            {BED_TYPES.map(bt => (
              <CheckRow
                key={bt}
                label={bt}
                checked={filters.bedTypes.includes(bt)}
                onChange={() => onChange("bedTypes", toggleArr(filters.bedTypes, bt))}
              />
            ))}
          </div>
        </Section>
      </div>
    </aside>
  );
}
