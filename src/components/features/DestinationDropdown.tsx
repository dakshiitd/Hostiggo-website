import { useState, useRef, useEffect } from "react";
import { Search, MapPin, Navigation } from "lucide-react";
import { SUGGESTED_DESTINATIONS } from "@/constants/data";
import type { Destination } from "@/types";

interface DestinationDropdownProps {
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
}

export default function DestinationDropdown({ value, onChange, onClose }: DestinationDropdownProps) {
  const [query, setQuery] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filtered = query.trim().length > 0
    ? SUGGESTED_DESTINATIONS.filter(
        (d) =>
          d.name.toLowerCase().includes(query.toLowerCase()) ||
          d.state.toLowerCase().includes(query.toLowerCase())
      )
    : SUGGESTED_DESTINATIONS;

  const handleSelect = (dest: Destination) => {
    onChange(dest.name);
    onClose();
  };

  return (
    <div className="dropdown-panel animate-fade-in-down w-[420px] max-w-[92vw]">
      {/* Search input */}
      <div className="p-3 border-b border-gray-100">
        <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus-within:border-blue-400 focus-within:bg-white transition-colors">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search destinations or properties"
            className="flex-1 bg-transparent text-[13px] text-gray-800 placeholder-gray-400 outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="w-4 h-4 bg-gray-300 hover:bg-gray-400 rounded-full flex items-center justify-center transition-colors flex-shrink-0"
            >
              <span className="text-white text-[10px] font-bold leading-none">×</span>
            </button>
          )}
        </div>
      </div>

      {/* Suggestions list */}
      <div className="p-2 max-h-[360px] overflow-y-auto scrollbar-hide">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2 px-2 pt-1">
          Suggested destinations
        </p>

        {filtered.length > 0 ? (
          <div>
            {filtered.slice(0, 8).map((dest) => (
              <button
                key={dest.id}
                onClick={() => handleSelect(dest)}
                className="w-full flex items-center gap-3 px-2 py-2.5 hover:bg-gray-50 rounded-xl transition-colors text-left group"
              >
                {/* City thumbnail */}
                <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                  <img
                    src={dest.imageUrl}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(dest.name)}&background=2563eb&color=fff&size=48&bold=true`;
                    }}
                  />
                </div>

                {/* City info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-gray-800 leading-tight">{dest.name}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{dest.state}</p>
                </div>

                {/* Stay count */}
                <div className="text-right flex-shrink-0">
                  <p className="text-[11px] text-gray-400">
                    {dest.stayCount.toLocaleString("en-IN")} stays
                  </p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="py-10 flex flex-col items-center text-gray-400">
            <MapPin className="w-8 h-8 mb-2 opacity-40" />
            <p className="text-sm font-medium text-gray-500">No destinations found</p>
            <p className="text-xs text-gray-400 mt-1">Try a different search</p>
          </div>
        )}
      </div>

      {/* Use current location */}
      <div className="border-t border-gray-100 p-3">
        <button className="w-full flex items-center gap-2.5 px-2 py-2 hover:bg-blue-50 rounded-xl transition-colors text-blue-600 group">
          <div className="w-8 h-8 bg-blue-100 group-hover:bg-blue-200 rounded-lg flex items-center justify-center transition-colors">
            <Navigation className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <span className="text-[13px] font-semibold">Use my current location</span>
        </button>
      </div>
    </div>
  );
}
