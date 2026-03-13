import { useState, useRef, useEffect } from "react";
import { Search, MapPin, Calendar, Users, ChevronDown, X } from "lucide-react";
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
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
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

  const handleSearch = () => {
    if (!search.destination.trim()) { toast.error("Please enter a destination"); return; }
    navigate(`/search?destination=${encodeURIComponent(search.destination)}`);
    setActivePanel(null);
  };

  return (
    <div ref={wrapRef} className="flex items-center gap-3 w-full">
      {/* Destination Pill */}
      <div className="relative flex-[1.2] min-w-0">
        <button
          onClick={() => toggle("destination")}
          className={cn(
            "w-full h-[52px] flex items-center gap-3 px-5 rounded-full bg-white transition-all text-left border-2",
            activePanel === "destination" ? "border-blue-400" : "border-transparent"
          )}
        >
          <Search className="w-5 h-5 text-gray-400 flex-shrink-0" strokeWidth={2.5} />
          <span className={cn("text-[14px] font-medium truncate", search.destination ? "text-gray-900" : "text-gray-400")}>
            {search.destination || "New Delhi"}
          </span>
          {search.destination && (
            <button
              className="ml-auto p-1 hover:bg-gray-100 rounded-full"
              onClick={(e) => { e.stopPropagation(); updateSearch({ destination: "" }); }}
            >
              <X className="w-3.5 h-3.5 text-gray-400" />
            </button>
          )}
        </button>
        {activePanel === "destination" && (
          <div className="absolute top-[calc(100%+12px)] left-0 w-full min-w-[320px] z-50">
            <DestinationDropdown
              value={search.destination}
              onChange={v => { updateSearch({ destination: v }); setActivePanel("date"); }}
              onClose={() => setActivePanel(null)}
            />
          </div>
        )}
      </div>

      {/* Date Pill */}
      <div className="relative flex-[1.5] min-w-0">
        <button
          onClick={() => toggle("date")}
          className={cn(
            "w-full h-[52px] flex items-center gap-4 px-5 rounded-full bg-white transition-all text-left border-2",
            activePanel === "date" ? "border-blue-400" : "border-transparent"
          )}
        >
          <Calendar className="w-5 h-5 text-gray-600 flex-shrink-0" strokeWidth={1.5} />
          <div className="flex items-center gap-6 min-w-0 flex-1">
            <div className="min-w-0">
              {search.checkIn ? (
                <>
                  <p className="text-[13px] font-bold text-gray-900 leading-none mb-1">{fmtDate(search.checkIn)}</p>
                  <p className="text-[11px] text-gray-400">{search.checkIn.toLocaleDateString("en-US", { weekday: 'long' })}</p>
                </>
              ) : (
                <p className="text-[13px] text-gray-400">Add dates</p>
              )}
            </div>

            <svg width="14" height="12" viewBox="0 0 14 12" fill="none" className="text-gray-300 flex-shrink-0">
              <path d="M1 6H13M13 6L8.5 1.5M13 6L8.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            <div className="min-w-0">
              {search.checkOut ? (
                <>
                  <p className="text-[13px] font-bold text-gray-900 leading-none mb-1">{fmtDate(search.checkOut)}</p>
                  <p className="text-[11px] text-gray-400">{search.checkOut.toLocaleDateString("en-US", { weekday: 'long' })}</p>
                </>
              ) : (
                <p className="text-[13px] text-gray-400">Add dates</p>
              )}
            </div>
          </div>
        </button>
        {activePanel === "date" && (
          <div className="absolute top-[calc(100%+12px)] left-1/2 -translate-x-1/2 z-50">
            <DateRangePicker
              checkIn={search.checkIn}
              checkOut={search.checkOut}
              onChange={(ci, co) => updateSearch({ checkIn: ci, checkOut: co })}
              onClose={() => setActivePanel(null)}
            />
          </div>
        )}
      </div>

      {/* Guests Pill */}
      <div className="relative flex-[1.3] min-w-0">
        <button
          onClick={() => toggle("guests")}
          className={cn(
            "w-full h-[52px] flex items-center gap-3 px-5 rounded-full bg-white transition-all text-left border-2",
            activePanel === "guests" ? "border-blue-400" : "border-transparent"
          )}
        >
          <Users className="w-5 h-5 text-gray-500 flex-shrink-0" strokeWidth={1.5} />
          <div className="flex-1 truncate">
            <p className="text-[13px] font-bold text-gray-800">
              {search.guests.adults} Adults • {search.guests.rooms} Room
            </p>
            <p className="text-[11px] text-gray-400">{search.guests.children} Children</p>
          </div>
          <ChevronDown className={cn("w-5 h-5 text-gray-400 transition-transform", activePanel === "guests" && "rotate-180")} />
        </button>
        {activePanel === "guests" && (
          <div className="absolute top-[calc(100%+12px)] right-0 z-50">
            <GuestDropdown
              guests={search.guests}
              onChange={g => updateSearch({ guests: g })}
              onClose={() => setActivePanel(null)}
            />
          </div>
        )}
      </div>

      {/* Search Button */}
      <button
        onClick={handleSearch}
        className="h-[52px] px-8 bg-blue-500 border-2 border-white/20 hover:bg-blue-600 text-white font-bold text-[15px] rounded-full transition-all shadow-md active:scale-95 flex-shrink-0"
      >
        Search
      </button>
    </div>
  );
}

/** Full search form used on home page hero */
export default function SearchForm() {
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
    <div ref={wrapRef} className="w-full flex-1 max-w-lg mx-auto lg:ml-auto lg:mr-0">
      <div className="flex flex-col gap-3.5">
        {/* Destination */}
        <div className="relative">
          <button
            onClick={() => toggle("destination")}
            className={cn(
              "w-full flex items-center gap-3 px-5 py-4 rounded-2xl border transition-all text-left bg-white",
              activePanel === "destination" ? "border-blue-500 shadow-md ring-4 ring-blue-500/10" : "border-gray-200 hover:border-gray-300 shadow-sm hover:shadow"
            )}
          >
            <Search className="w-5 h-5 text-gray-400 flex-shrink-0" strokeWidth={2} />
            <div className="min-w-0 flex-1">
              {search.destination ? (
                <p className="text-[14px] font-medium text-gray-900 truncate">{search.destination}</p>
              ) : (
                <p className="text-[14px] font-medium text-gray-400 truncate">Search destination or homestay</p>
              )}
            </div>
          </button>
          {activePanel === "destination" && (
            <div className="absolute top-[calc(100%+8px)] left-0 w-full z-50">
              <DestinationDropdown value={search.destination} onChange={v => { updateSearch({ destination: v }); setActivePanel("date"); }} onClose={() => setActivePanel(null)} />
            </div>
          )}
        </div>

        {/* Dates Row */}
        <div className="flex gap-3.5 relative">
          {/* Check In */}
          <div className="relative flex-1">
            <button
              onClick={() => toggle("date")}
              className={cn(
                "w-full flex items-start gap-3 px-4 py-3.5 rounded-2xl border transition-all text-left bg-white",
                activePanel === "date" ? "border-blue-500 shadow-md ring-4 ring-blue-500/10" : "border-gray-200 hover:border-gray-300 shadow-sm hover:shadow"
              )}
            >
              <Calendar className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-bold text-gray-900 mb-1">Check In</p>
                {search.checkIn ? (
                  <>
                    <p className="text-[11px] text-gray-500">{search.checkIn.toLocaleDateString("en-US", { weekday: 'long' })}</p>
                    <p className="text-[13px] font-medium text-gray-900">{fmtDate(search.checkIn)}</p>
                  </>
                ) : (
                  <p className="text-[13px] text-gray-400 mt-1">Add date</p>
                )}
              </div>
            </button>
          </div>

          {/* Check Out */}
          <div className="relative flex-1">
            <button
              onClick={() => toggle("date")}
              className={cn(
                "w-full flex items-start gap-3 px-4 py-3.5 rounded-2xl border transition-all text-left bg-white",
                activePanel === "date" ? "border-blue-500 shadow-md ring-4 ring-blue-500/10" : "border-gray-200 hover:border-gray-300 shadow-sm hover:shadow"
              )}
            >
              <Calendar className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-bold text-gray-900 mb-1">Check Out</p>
                {search.checkOut ? (
                  <>
                    <p className="text-[11px] text-gray-500">{search.checkOut.toLocaleDateString("en-US", { weekday: 'long' })}</p>
                    <p className="text-[13px] font-medium text-gray-900">{fmtDate(search.checkOut)}</p>
                  </>
                ) : (
                  <p className="text-[13px] text-gray-400 mt-1">Add date</p>
                )}
              </div>
            </button>
          </div>

          {/* Shared DatePicker Popover */}
          {activePanel === "date" && (
            <div className="absolute top-[calc(100%+8px)] left-0 w-full flex justify-center z-50">
              <DateRangePicker checkIn={search.checkIn} checkOut={search.checkOut} onChange={(ci, co) => updateSearch({ checkIn: ci, checkOut: co })} onClose={() => setActivePanel(null)} />
            </div>
          )}
        </div>

        {/* Guests */}
        <div className="relative">
          <button
            onClick={() => toggle("guests")}
            className={cn(
              "w-full flex items-center gap-3 px-5 py-4 rounded-2xl border transition-all text-left bg-white",
              activePanel === "guests" ? "border-blue-500 shadow-md ring-4 ring-blue-500/10" : "border-gray-200 hover:border-gray-300 shadow-sm hover:shadow"
            )}
          >
            <Users className="w-5 h-5 text-gray-600 flex-shrink-0" strokeWidth={1.5} />
            <div className="min-w-0 flex-1 flex items-center gap-1.5">
              <span className="text-[14px] font-medium text-gray-800">{search.guests.adults} Adults</span>
              <span className="text-gray-300 text-xs">•</span>
              <span className="text-[14px] font-medium text-gray-800">{search.guests.rooms} Room</span>
              <span className="text-gray-300 text-xs">•</span>
              <span className="text-[14px] font-medium text-gray-500">{search.guests.children} Children</span>
            </div>
            <ChevronDown className={cn("w-5 h-5 text-gray-800 flex-shrink-0 transition-transform duration-200", activePanel === "guests" && "rotate-180")} strokeWidth={2} />
          </button>
          {activePanel === "guests" && (
            <div className="absolute top-[calc(100%+8px)] left-0 w-full z-50">
              <GuestDropdown guests={search.guests} onChange={g => updateSearch({ guests: g })} onClose={() => setActivePanel(null)} />
            </div>
          )}
        </div>

        {/* Search Button */}
        <div className="mt-2 flex justify-center">
          <button
            onClick={handleSearch}
            className="w-full max-w-[240px] flex items-center justify-center bg-[#0266b3] hover:bg-[#025699] active:bg-[#02467f] text-white font-bold text-[15px] rounded-full px-6 py-3.5 transition-colors shadow-md hover:shadow-lg"
          >
            Search
          </button>
        </div>
      </div>

    </div>
  );
}
