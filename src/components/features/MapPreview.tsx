import { MapPin } from "lucide-react";

interface MapPreviewProps {
  city?: string;
  count?: number;
}

// Fake marker positions
const MARKERS = [
  { x: 38, y: 42 },
  { x: 55, y: 30 },
  { x: 48, y: 58 },
  { x: 65, y: 45 },
  { x: 30, y: 65 },
  { x: 70, y: 25 },
  { x: 25, y: 38 },
];

export default function MapPreview({ city = "New Delhi", count = 0 }: MapPreviewProps) {
  return (
    <div className="rounded-2xl overflow-hidden border border-gray-100 relative" style={{ height: 160 }}>
      {/* Map background */}
      <img
        src={`https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(city)}&zoom=12&size=300x160&style=feature:all|saturation:-20&key=DEMO`}
        alt=""
        className="hidden"
      />
      {/* Fallback SVG map */}
      <svg width="100%" height="160" className="absolute inset-0" viewBox="0 0 280 160">
        <rect width="280" height="160" fill="#e8f0fe" />
        {/* roads */}
        <line x1="0" y1="80" x2="280" y2="80" stroke="#c5d4f5" strokeWidth="8" />
        <line x1="140" y1="0" x2="140" y2="160" stroke="#c5d4f5" strokeWidth="8" />
        <line x1="0" y1="40" x2="280" y2="55" stroke="#d0ddf8" strokeWidth="4" />
        <line x1="0" y1="120" x2="280" y2="108" stroke="#d0ddf8" strokeWidth="4" />
        <line x1="70" y1="0" x2="55" y2="160" stroke="#d0ddf8" strokeWidth="3" />
        <line x1="200" y1="0" x2="210" y2="160" stroke="#d0ddf8" strokeWidth="3" />
        {/* blocks */}
        <rect x="10" y="10" width="50" height="25" rx="3" fill="#d4e0fb" />
        <rect x="70" y="10" width="60" height="25" rx="3" fill="#dce7fc" />
        <rect x="150" y="10" width="45" height="25" rx="3" fill="#d4e0fb" />
        <rect x="205" y="10" width="65" height="25" rx="3" fill="#dce7fc" />
        <rect x="10" y="90" width="55" height="30" rx="3" fill="#d4e0fb" />
        <rect x="75" y="90" width="55" height="30" rx="3" fill="#dce7fc" />
        <rect x="150" y="90" width="55" height="30" rx="3" fill="#d4e0fb" />
        <rect x="215" y="90" width="55" height="30" rx="3" fill="#dce7fc" />
        <rect x="10" y="130" width="50" height="20" rx="3" fill="#dce7fc" />
        <rect x="70" y="128" width="60" height="22" rx="3" fill="#d4e0fb" />
      </svg>

      {/* Markers */}
      {MARKERS.map((m, i) => (
        <div
          key={i}
          className="absolute flex items-center justify-center"
          style={{ left: `${m.x}%`, top: `${m.y}%`, transform: "translate(-50%, -100%)" }}
        >
          <div className="bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-md whitespace-nowrap">
            ₹{(20000 + i * 3000).toLocaleString("en-IN")}
          </div>
        </div>
      ))}

      {/* Overlay label */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-white/90 to-transparent py-2 px-3">
        <p className="text-[11px] font-semibold text-gray-600 flex items-center gap-1">
          <MapPin className="w-3 h-3 text-blue-500" />
          {city} · {count} properties on map
        </p>
      </div>
    </div>
  );
}
