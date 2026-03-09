import { useState, useRef, useEffect, useCallback } from "react";
import { Search, MapPin, Calendar, Users, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import DestinationDropdown from "@/components/features/DestinationDropdown";
import DateRangePicker from "@/components/features/DateRangePicker";
import GuestDropdown from "@/components/features/GuestDropdown";
import { POPULAR_FILTERS } from "@/constants/data";
import type { GuestCount } from "@/types";
import { cn } from "@/lib/utils";

type Panel = "destination" | "date" | "guests" | null;

function fmtDate(d: Date | null) {
  if (!d) return null;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default function SearchForm() {
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState<GuestCount>({ adults: 2, children: 0, rooms: 1, pets: false });
  const [activePanel, setActivePanel] = useState<Panel>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setActivePanel(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = useCallback((p: Panel) => {
    setActivePanel((cur) => (cur === p ? null : p));
  }, []);

  const guestSummary = () => {
    const parts: string[] = [`${guests.adults} Adult${guests.adults !== 1 ? "s" : ""}`];
    if (guests.children > 0) parts.push(`${guests.children} Child${guests.children !== 1 ? "ren" : ""}`);
    parts.push(`${guests.rooms} Room${guests.rooms !== 1 ? "s" : ""}`);
    return parts.join(", ");
  };

  const handleSearch = () => {
    if (!destination.trim()) { toast.error("Please enter a destination"); return; }
    if (!checkIn)  { toast.error("Please select a check-in date"); return; }
    if (!checkOut) { toast.error("Please select a check-out date"); return; }
    toast.success(`Searching stays in ${destination}…`);
    setActivePanel(null);
  };

  return (
    <div ref={wrapRef} className="w-full max-w-2xl">
      {/* ── Search card ── */}
      <div className="bg-white rounded-2xl shadow-lg p-1.5 flex flex-col sm:flex-row items-stretch">

        {/* Destination */}
        <div className="relative flex-1 min-w-0">
          <button
            onClick={() => toggle("destination")}
            className={cn(
              "w-full flex items-center gap-2.5 px-4 py-3 rounded-xl transition-colors text-left",
              activePanel === "destination" ? "bg-blue-50" : "hover:bg-gray-50"
            )}
          >
            <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Destination</p>
              <p className={cn("text-[13px] font-semibold truncate", destination ? "text-gray-800" : "text-gray-400")}>
                {destination || "Search destinations"}
              </p>
            </div>
          </button>

          {activePanel === "destination" && (
            <div className="absolute top-full left-0 mt-2 z-50">
              <DestinationDropdown
                value={destination}
                onChange={(v) => { setDestination(v); setActivePanel("date"); }}
                onClose={() => setActivePanel(null)}
              />
            </div>
          )}
        </div>

        <div className="hidden sm:block w-px bg-gray-100 my-2 flex-shrink-0" />

        {/* Date range (combined button) */}
        <div className="relative">
          <button
            onClick={() => toggle("date")}
            className={cn(
              "flex items-center gap-2.5 px-4 py-3 rounded-xl transition-colors text-left w-full sm:w-auto",
              activePanel === "date" ? "bg-blue-50" : "hover:bg-gray-50"
            )}
          >
            <Calendar className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Check in → Check out</p>
              <p className={cn("text-[13px] font-semibold whitespace-nowrap", (checkIn || checkOut) ? "text-gray-800" : "text-gray-400")}>
                {checkIn || checkOut
                  ? `${fmtDate(checkIn) ?? "—"} → ${fmtDate(checkOut) ?? "—"}`
                  : "Add dates"}
              </p>
            </div>
          </button>

          {activePanel === "date" && (
            <div className="absolute top-full left-0 sm:right-0 sm:left-auto mt-2 z-50">
              <DateRangePicker
                checkIn={checkIn}
                checkOut={checkOut}
                onChange={(ci, co) => { setCheckIn(ci); setCheckOut(co); }}
                onClose={() => setActivePanel(null)}
              />
            </div>
          )}
        </div>

        <div className="hidden sm:block w-px bg-gray-100 my-2 flex-shrink-0" />

        {/* Guests */}
        <div className="relative">
          <button
            onClick={() => toggle("guests")}
            className={cn(
              "flex items-center gap-2 px-4 py-3 rounded-xl transition-colors text-left w-full sm:w-auto",
              activePanel === "guests" ? "bg-blue-50" : "hover:bg-gray-50"
            )}
          >
            <Users className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <div className="min-w-0 flex-1 sm:flex-none">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Guests</p>
              <p className="text-[13px] font-semibold text-gray-800 whitespace-nowrap">{guestSummary()}</p>
            </div>
            <ChevronDown className={cn("w-3 h-3 text-gray-400 flex-shrink-0 transition-transform duration-200", activePanel === "guests" && "rotate-180")} />
          </button>

          {activePanel === "guests" && (
            <div className="absolute top-full right-0 mt-2 z-50">
              <GuestDropdown
                guests={guests}
                onChange={setGuests}
                onClose={() => setActivePanel(null)}
              />
            </div>
          )}
        </div>

        {/* Search button */}
        <button
          onClick={handleSearch}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-xl m-1 px-5 py-3 transition-colors shadow-sm flex-shrink-0"
        >
          <Search className="w-4 h-4" strokeWidth={2.5} />
          <span>Search</span>
        </button>
      </div>

      {/* ── Popular Filters ── */}
      <div className="flex flex-wrap items-center gap-2 mt-3">
        {POPULAR_FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter((cur) => (cur === f.id ? null : f.id))}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border",
              activeFilter === f.id
                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                : "bg-white/80 text-gray-700 border-white/50 hover:bg-white hover:border-gray-200 backdrop-blur-sm"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}
