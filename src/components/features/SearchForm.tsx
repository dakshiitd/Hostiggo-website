import { useState, useRef, useEffect } from "react";
import { Search, MapPin, Calendar, Users, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import DestinationDropdown from "@/components/features/DestinationDropdown";
import DateRangePicker from "@/components/features/DateRangePicker";
import GuestDropdown from "@/components/features/GuestDropdown";
import { useSearchContext } from "@/context/SearchContext";
import { cn } from "@/lib/utils";

type Panel = "destination" | "date" | "guests" | null;

function fmtDate(d: Date | null) {
  if (!d) return null;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

/** Compact search bar used on the SearchResultsPage */
export function CompactSearchBar() {
  const { search, updateSearch } = useSearchContext();
  const [activePanel, setActivePanel] = useState<Panel>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setActivePanel(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (p: Panel) => setActivePanel(cur => cur === p ? null : p);

  const guestSummary = () => {
    const g = search.guests;
    const parts = [`${g.adults} Adult${g.adults !== 1 ? "s" : ""}`];
    if (g.children > 0) parts.push(`${g.children} Child${g.children !== 1 ? "ren" : ""}`);
    parts.push(`${g.rooms} Room${g.rooms !== 1 ? "s" : ""}`);
    return parts.join(", ");
  };

  const handleSearch = () => {
    if (!search.destination.trim()) { toast.error("Please enter a destination"); return; }
    navigate(`/search?destination=${encodeURIComponent(search.destination)}`);
    setActivePanel(null);
  };

  return (
    <div ref={wrapRef} className="relative w-full">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex items-stretch h-11 overflow-visible">
        {/* Destination */}
        <div className="relative flex-1 min-w-0 border-r border-gray-100">
          <button
            onClick={() => toggle("destination")}
            className={cn("w-full h-full flex items-center gap-2 px-3 transition-colors text-left", activePanel === "destination" ? "bg-blue-50" : "hover:bg-gray-50")}
          >
            <MapPin className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
            <span className={cn("text-[13px] font-medium truncate", search.destination ? "text-gray-800" : "text-gray-400")}>
              {search.destination || "New Delhi"}
            </span>
          </button>
          {activePanel === "destination" && (
            <div className="absolute top-full left-0 mt-1 z-50">
              <DestinationDropdown value={search.destination} onChange={v => { updateSearch({ destination: v }); setActivePanel("date"); }} onClose={() => setActivePanel(null)} />
            </div>
          )}
        </div>

        {/* Dates */}
        <div className="relative border-r border-gray-100">
          <button
            onClick={() => toggle("date")}
            className={cn("h-full flex items-center gap-2 px-3 transition-colors text-left whitespace-nowrap", activePanel === "date" ? "bg-blue-50" : "hover:bg-gray-50")}
          >
            <Calendar className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
            <span className="text-[13px] font-medium text-gray-700">
              {search.checkIn ? fmtDate(search.checkIn) : "Check in"} · {search.checkOut ? fmtDate(search.checkOut) : "Check out"}
            </span>
          </button>
          {activePanel === "date" && (
            <div className="absolute top-full left-0 mt-1 z-50">
              <DateRangePicker checkIn={search.checkIn} checkOut={search.checkOut} onChange={(ci, co) => updateSearch({ checkIn: ci, checkOut: co })} onClose={() => setActivePanel(null)} />
            </div>
          )}
        </div>

        {/* Guests */}
        <div className="relative border-r border-gray-100">
          <button
            onClick={() => toggle("guests")}
            className={cn("h-full flex items-center gap-2 px-3 transition-colors text-left whitespace-nowrap", activePanel === "guests" ? "bg-blue-50" : "hover:bg-gray-50")}
          >
            <Users className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
            <span className="text-[13px] font-medium text-gray-700">{guestSummary()}</span>
            <ChevronDown className={cn("w-3 h-3 text-gray-400 transition-transform", activePanel === "guests" && "rotate-180")} />
          </button>
          {activePanel === "guests" && (
            <div className="absolute top-full right-0 mt-1 z-50">
              <GuestDropdown guests={search.guests} onChange={g => updateSearch({ guests: g })} onClose={() => setActivePanel(null)} />
            </div>
          )}
        </div>

        {/* Search btn */}
        <button onClick={handleSearch} className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-5 font-semibold text-sm rounded-r-xl transition-colors flex-shrink-0">
          <Search className="w-4 h-4" strokeWidth={2.5} />
          Search
        </button>
      </div>
    </div>
  );
}

/** Full search form used on home page hero */
export default function SearchForm() {
  const { search, updateSearch } = useSearchContext();
  const [activePanel, setActivePanel] = useState<Panel>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setActivePanel(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (p: Panel) => setActivePanel(cur => cur === p ? null : p);

  const guestSummary = () => {
    const g = search.guests;
    const parts = [`${g.adults} Adult${g.adults !== 1 ? "s" : ""}`];
    if (g.children > 0) parts.push(`${g.children} Child${g.children !== 1 ? "ren" : ""}`);
    parts.push(`${g.rooms} Room${g.rooms !== 1 ? "s" : ""}`);
    return parts.join(", ");
  };

  const handleSearch = () => {
    if (!search.destination.trim()) { toast.error("Please enter a destination"); return; }
    navigate(`/search?destination=${encodeURIComponent(search.destination)}`);
    setActivePanel(null);
  };

  const HERO_FILTERS = [
    { id: "budget", label: "₹1000 – 2000" },
    { id: "breakfast", label: "Free breakfast" },
    { id: "couple", label: "Couple friendly" },
    { id: "pet", label: "Pet friendly" },
    { id: "family", label: "Family friendly" },
  ];

  return (
    <div ref={wrapRef} className="w-full max-w-2xl">
      <div className="bg-white rounded-2xl shadow-lg p-1.5 flex flex-col sm:flex-row items-stretch">
        {/* Destination */}
        <div className="relative flex-1 min-w-0">
          <button
            onClick={() => toggle("destination")}
            className={cn("w-full flex items-center gap-2.5 px-4 py-3 rounded-xl transition-colors text-left", activePanel === "destination" ? "bg-blue-50" : "hover:bg-gray-50")}
          >
            <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Destination</p>
              <p className={cn("text-[13px] font-semibold truncate", search.destination ? "text-gray-800" : "text-gray-400")}>
                {search.destination || "Search destinations"}
              </p>
            </div>
          </button>
          {activePanel === "destination" && (
            <div className="absolute top-full left-0 mt-2 z-50">
              <DestinationDropdown value={search.destination} onChange={v => { updateSearch({ destination: v }); setActivePanel("date"); }} onClose={() => setActivePanel(null)} />
            </div>
          )}
        </div>

        <div className="hidden sm:block w-px bg-gray-100 my-2" />

        {/* Dates */}
        <div className="relative">
          <button
            onClick={() => toggle("date")}
            className={cn("flex items-center gap-2.5 px-4 py-3 rounded-xl transition-colors text-left w-full sm:w-auto", activePanel === "date" ? "bg-blue-50" : "hover:bg-gray-50")}
          >
            <Calendar className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Check in → Check out</p>
              <p className={cn("text-[13px] font-semibold whitespace-nowrap", (search.checkIn || search.checkOut) ? "text-gray-800" : "text-gray-400")}>
                {search.checkIn || search.checkOut ? `${fmtDate(search.checkIn) ?? "—"} → ${fmtDate(search.checkOut) ?? "—"}` : "Add dates"}
              </p>
            </div>
          </button>
          {activePanel === "date" && (
            <div className="absolute top-full left-0 sm:right-0 sm:left-auto mt-2 z-50">
              <DateRangePicker checkIn={search.checkIn} checkOut={search.checkOut} onChange={(ci, co) => updateSearch({ checkIn: ci, checkOut: co })} onClose={() => setActivePanel(null)} />
            </div>
          )}
        </div>

        <div className="hidden sm:block w-px bg-gray-100 my-2" />

        {/* Guests */}
        <div className="relative">
          <button
            onClick={() => toggle("guests")}
            className={cn("flex items-center gap-2 px-4 py-3 rounded-xl transition-colors text-left w-full sm:w-auto", activePanel === "guests" ? "bg-blue-50" : "hover:bg-gray-50")}
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
              <GuestDropdown guests={search.guests} onChange={g => updateSearch({ guests: g })} onClose={() => setActivePanel(null)} />
            </div>
          )}
        </div>

        <button
          onClick={handleSearch}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-xl m-1 px-5 py-3 transition-colors shadow-sm flex-shrink-0"
        >
          <Search className="w-4 h-4" strokeWidth={2.5} />
          <span>Search</span>
        </button>
      </div>

      {/* Popular filters */}
      <div className="flex flex-wrap items-center gap-2 mt-3">
        {HERO_FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(cur => cur === f.id ? null : f.id)}
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
