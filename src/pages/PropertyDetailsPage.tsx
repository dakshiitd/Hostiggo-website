import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Star, Heart, MapPin, Wifi, Car, Coffee, Zap, Droplets,
  UtensilsCrossed, ArrowLeft, Mountain, CheckCircle, Users,
  BedDouble, ChevronLeft, ChevronRight, X, CalendarDays,
  Wind, MessageSquare, Award, Shield, Clock, ChevronDown,
  Share2, GridIcon, ExternalLink
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ALL_PROPERTIES } from "@/constants/data";
import { cn } from "@/lib/utils";
import type { Property, AmenityItem, Review, Host } from "@/types";

const FALLBACK = "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop&q=80";

// ── Amenity Icon Map ─────────────────────────────────────────────────
const AMENITY_ICON_MAP: Record<string, React.ReactNode> = {
  wifi:      <Wifi className="w-5 h-5" />,
  car:       <Car className="w-5 h-5" />,
  coffee:    <Coffee className="w-5 h-5" />,
  zap:       <Zap className="w-5 h-5" />,
  droplets:  <Droplets className="w-5 h-5" />,
  utensils:  <UtensilsCrossed className="w-5 h-5" />,
  mountain:  <Mountain className="w-5 h-5" />,
  wind:      <Wind className="w-5 h-5" />,
};

// ── 1. Full-Screen Gallery Modal ─────────────────────────────────────
function GalleryModal({
  images, startIdx, onClose
}: { images: string[]; startIdx: number; onClose: () => void }) {
  const [idx, setIdx] = useState(startIdx);
  const touchStart = useRef<number | null>(null);

  const prev = useCallback(() => setIdx(i => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setIdx(i => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, prev, next]);

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/95 flex flex-col"
      onClick={onClose}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 flex-shrink-0" onClick={e => e.stopPropagation()}>
        <span className="text-white/70 text-sm font-medium">{idx + 1} / {images.length}</span>
        <button
          onClick={onClose}
          className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main image */}
      <div
        className="flex-1 relative flex items-center justify-center px-14 py-4 min-h-0"
        onClick={e => e.stopPropagation()}
        onTouchStart={e => { touchStart.current = e.changedTouches[0].clientX; }}
        onTouchEnd={e => {
          if (touchStart.current === null) return;
          const diff = touchStart.current - e.changedTouches[0].clientX;
          if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
          touchStart.current = null;
        }}
      >
        <img
          key={idx}
          src={images[idx] || FALLBACK}
          alt={`Photo ${idx + 1}`}
          className="max-w-full max-h-full object-contain rounded-lg select-none"
          style={{ animation: "fadeIn 0.2s ease" }}
          draggable={false}
        />
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center text-white transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Thumbnail strip */}
      <div className="flex-shrink-0 px-5 pb-4 overflow-x-auto" onClick={e => e.stopPropagation()}>
        <div className="flex gap-2 justify-center">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={cn(
                "w-14 h-10 rounded-md overflow-hidden flex-shrink-0 border-2 transition-all",
                i === idx ? "border-white opacity-100 scale-105" : "border-transparent opacity-50 hover:opacity-80"
              )}
            >
              <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── 2. Image Gallery Grid ────────────────────────────────────────────
function ImageGallery({ images, propertyName }: { images: string[]; propertyName: string }) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryStart, setGalleryStart] = useState(0);

  const open = (i: number) => { setGalleryStart(i); setGalleryOpen(true); };
  const imgs = images.length >= 5 ? images : [...images, ...Array(5 - images.length).fill(FALLBACK)];

  return (
    <>
      {/* Grid: 1 large + 4 small */}
      <div className="relative rounded-2xl overflow-hidden mb-6" style={{ height: "clamp(260px, 44vw, 440px)" }}>
        <div className="grid grid-cols-2 grid-rows-2 gap-1.5 h-full">
          {/* Primary large image */}
          <div
            className="row-span-2 relative overflow-hidden cursor-pointer group"
            onClick={() => open(0)}
          >
            <img
              src={imgs[0]}
              alt={`${propertyName} main`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="eager"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </div>

          {/* 4 small images */}
          <div className="grid grid-cols-2 gap-1.5 col-span-1 row-span-2">
            {imgs.slice(1, 5).map((src, i) => (
              <div
                key={i}
                className={cn(
                  "relative overflow-hidden cursor-pointer group",
                  i === 3 && "relative"
                )}
                onClick={() => open(i + 1)}
              >
                <img
                  src={src}
                  alt={`${propertyName} ${i + 2}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                {/* "Show all" on last tile */}
                {i === 3 && images.length > 5 && (
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
                    <GridIcon className="w-5 h-5 mb-1" />
                    <span className="text-sm font-bold">+{images.length - 5} more</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Show all button overlay */}
        <button
          onClick={() => open(0)}
          className="absolute bottom-3 right-3 bg-white hover:bg-gray-50 text-gray-800 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg border border-gray-200 transition-colors"
        >
          <GridIcon className="w-3.5 h-3.5" />
          Show all photos
        </button>
      </div>

      {galleryOpen && (
        <GalleryModal images={images} startIdx={galleryStart} onClose={() => setGalleryOpen(false)} />
      )}
    </>
  );
}

// ── 3. Property Map ──────────────────────────────────────────────────
function PropertyMap({ property }: { property: Property }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const [loaded, setLoaded] = useState(false);

  const CITY_CENTERS: Record<string, [number, number]> = {
    "New Delhi": [28.6139, 77.2090], "Manali": [32.2396, 77.1887],
    "Shimla": [31.1048, 77.1734], "Jaipur": [26.9124, 75.7873],
    "Bangalore": [12.9716, 77.5946], "Rishikesh": [30.0869, 78.2676],
    "Goa": [15.2993, 74.1240], "Dharamshala": [32.2190, 76.3234],
    "Kasol": [32.0109, 77.3130], "Kolkata": [22.5726, 88.3639],
  };

  const getCenter = (): [number, number] => {
    if (property.coordinates) return [property.coordinates.lat, property.coordinates.lng];
    for (const [name, coords] of Object.entries(CITY_CENTERS)) {
      if (property.city.toLowerCase().includes(name.toLowerCase())) return coords;
    }
    return [22.5937, 78.9629];
  };

  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
    const init = (L: any) => {
      if (!mapRef.current || leafletMapRef.current) return;
      const center = getCenter();
      const map = L.map(mapRef.current, { center, zoom: 14, zoomControl: true, attributionControl: false, scrollWheelZoom: false });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(map);
      const icon = L.divIcon({
        className: "",
        html: `<div style="background:#2563eb;width:20px;height:20px;border-radius:50%;border:3px solid white;box-shadow:0 3px 10px rgba(37,99,235,0.6)"></div>`,
        iconSize: [20, 20], iconAnchor: [10, 10],
      });
      L.marker(center, { icon }).addTo(map)
        .bindPopup(`<b style="font-size:13px">${property.propertyName}</b><br/><span style="font-size:11px;color:#6b7280">${property.city}, ${property.state}</span>`, { maxWidth: 220 })
        .openPopup();
      leafletMapRef.current = map;
      setLoaded(true);
    };
    if ((window as any).L) { init((window as any).L); return; }
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => init((window as any).L);
    document.head.appendChild(script);
    return () => { if (leafletMapRef.current) { leafletMapRef.current.remove(); leafletMapRef.current = null; } };
  }, []);

  const center = getCenter();
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${center[0]},${center[1]}`;

  return (
    <div className="space-y-3">
      <div className="rounded-xl overflow-hidden border border-gray-100 relative" style={{ height: 280 }}>
        <div ref={mapRef} className="w-full h-full" />
        {!loaded && (
          <div className="absolute inset-0 bg-blue-50 flex items-center justify-center">
            <div className="text-center">
              <div className="w-7 h-7 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-[12px] text-blue-500 font-medium">Loading map…</p>
            </div>
          </div>
        )}
      </div>
      <a
        href={googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-[12px] text-blue-600 hover:text-blue-700 font-semibold transition-colors"
      >
        <ExternalLink className="w-3.5 h-3.5" />
        View on Google Maps
      </a>
    </div>
  );
}

// ── 4. Rating Breakdown ──────────────────────────────────────────────
function RatingBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[12px] text-gray-600 w-28 flex-shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gray-800 rounded-full"
          style={{ width: `${(value / 5) * 100}%` }}
        />
      </div>
      <span className="text-[12px] font-bold text-gray-700 w-6 text-right">{value.toFixed(1)}</span>
    </div>
  );
}

// ── 5. Review Card ───────────────────────────────────────────────────
function ReviewCard({ review }: { review: Review }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = review.reviewText.length > 120;

  return (
    <div className="pb-5 border-b border-gray-100 last:border-0 last:pb-0">
      <div className="flex items-center gap-3 mb-2.5">
        <img
          src={review.userAvatar}
          alt={review.userName}
          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          loading="lazy"
        />
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold text-gray-800 leading-none">{review.userName}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">{review.reviewDate}</p>
        </div>
        <div className="flex items-center gap-0.5 flex-shrink-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={cn("w-3 h-3", i < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200")} />
          ))}
        </div>
      </div>
      <p className="text-[13px] text-gray-600 leading-relaxed">
        {isLong && !expanded ? `${review.reviewText.slice(0, 120)}…` : review.reviewText}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded(v => !v)}
          className="text-[12px] text-gray-800 font-bold underline mt-1 hover:text-blue-600 transition-colors"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}

// ── 6. Host Card ─────────────────────────────────────────────────────
function HostCard({ host }: { host: Host }) {
  const { toast } = { toast: (m: { title: string }) => console.log(m.title) };
  return (
    <div className="bg-white rounded-2xl p-5" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.07)" }}>
      <h2 className="text-[15px] font-bold text-gray-800 mb-4">Meet your host</h2>
      <div className="flex items-start gap-4">
        <div className="relative flex-shrink-0">
          <img
            src={host.avatar}
            alt={host.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
          />
          {host.isSuperhost && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center shadow">
              <Award className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-[15px] font-extrabold text-gray-800">{host.name}</h3>
            {host.isSuperhost && (
              <span className="text-[10px] font-bold bg-rose-50 border border-rose-200 text-rose-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Award className="w-2.5 h-2.5" /> Superhost
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 mt-1.5 flex-wrap">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-[12px] font-bold text-gray-700">{host.rating}</span>
            </div>
            <div className="flex items-center gap-1 text-[12px] text-gray-500">
              <Users className="w-3 h-3" /> {host.tripsHosted} trips hosted
            </div>
            <div className="flex items-center gap-1 text-[12px] text-gray-500">
              <CalendarDays className="w-3 h-3" /> Joined {host.joinDate}
            </div>
          </div>
        </div>
      </div>

      {host.bio && (
        <p className="text-[13px] text-gray-600 leading-relaxed mt-3">{host.bio}</p>
      )}

      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="bg-gray-50 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-0.5">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[11px] font-bold text-gray-600">Response rate</span>
          </div>
          <p className="text-[14px] font-extrabold text-gray-800">{host.responseRate}%</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-0.5">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-[11px] font-bold text-gray-600">Response time</span>
          </div>
          <p className="text-[13px] font-bold text-gray-800 capitalize">{host.responseTime}</p>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => alert("Message host feature coming soon!")}
          className="flex-1 flex items-center justify-center gap-1.5 border border-gray-800 text-gray-800 hover:bg-gray-50 py-2.5 rounded-xl text-[13px] font-bold transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          Message Host
        </button>
        <button
          onClick={() => alert("Host profile coming soon!")}
          className="flex-1 flex items-center justify-center gap-1.5 bg-gray-800 hover:bg-gray-900 text-white py-2.5 rounded-xl text-[13px] font-bold transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          View Profile
        </button>
      </div>
    </div>
  );
}

// ── 7. Suggested Properties (Horizontal scroll) ──────────────────────
function SuggestedStays({ current }: { current: Property }) {
  const navigate = useNavigate();
  const suggested = ALL_PROPERTIES
    .filter(p => p.id !== current.id && (
      p.city === current.city ||
      p.state === current.state ||
      Math.abs(p.price - current.price) < 15000
    ))
    .slice(0, 8);

  if (suggested.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl p-5" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.07)" }}>
      <h2 className="text-[15px] font-bold text-gray-800 mb-4">You might also like</h2>
      <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1" style={{ scrollbarWidth: "none" }}>
        {suggested.map(p => (
          <div
            key={p.id}
            className="flex-shrink-0 w-[200px] bg-gray-50 rounded-xl overflow-hidden cursor-pointer group hover:-translate-y-0.5 transition-transform"
            style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}
            onClick={() => { navigate(`/property/${p.id}`); window.scrollTo(0, 0); }}
          >
            <div className="relative h-28 overflow-hidden">
              <img
                src={p.images[0] || FALLBACK}
                alt={p.propertyName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                loading="lazy"
              />
              {p.originalPrice && (
                <span className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  -{Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}%
                </span>
              )}
            </div>
            <div className="p-2.5">
              <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full">{p.propertyType}</span>
              <p className="text-[11px] font-bold text-gray-800 mt-1 line-clamp-1">{p.propertyName}</p>
              <p className="text-[10px] text-gray-400 mb-1.5 line-clamp-1">{p.city}, {p.state}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                  <span className="text-[10px] font-bold text-gray-700">{p.rating.toFixed(1)}</span>
                </div>
                <div>
                  <span className="text-[12px] font-extrabold text-blue-700">₹{Math.round(p.price / 1000)}k</span>
                  <span className="text-[9px] text-gray-400">/night</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 8. Booking Widget ────────────────────────────────────────────────
function BookingWidget({ property }: { property: Property }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [dateError, setDateError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const nights = checkIn && checkOut
    ? Math.max(0, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))
    : 0;

  const subtotal = property.price * (nights || 1);
  const serviceFee = Math.round(subtotal * 0.08);
  const taxes = Math.round(subtotal * 0.12);
  const total = subtotal + serviceFee + taxes;

  const validateAndBook = () => {
    setDateError("");
    if (!checkIn || !checkOut) { setDateError("Please select check-in and check-out dates."); return; }
    if (checkOut <= checkIn) { setDateError("Check-out must be after check-in."); return; }
    if (nights === 0) { setDateError("Minimum 1 night stay required."); return; }
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div
      className="bg-white rounded-2xl p-5 sticky top-28"
      style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.10)" }}
    >
      {/* Price header */}
      <div className="flex items-baseline gap-2 mb-4">
        {property.originalPrice && (
          <span className="text-[13px] text-gray-400 line-through">₹{property.originalPrice.toLocaleString("en-IN")}</span>
        )}
        <span className="text-[24px] font-extrabold text-blue-700">₹{property.price.toLocaleString("en-IN")}</span>
        <span className="text-[12px] text-gray-400">/night</span>
        {property.originalPrice && (
          <span className="ml-auto text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            {Math.round(((property.originalPrice - property.price) / property.originalPrice) * 100)}% off
          </span>
        )}
      </div>

      {/* Date inputs */}
      <div className="border border-gray-200 rounded-xl overflow-hidden mb-2">
        <div className="grid grid-cols-2 divide-x divide-gray-200">
          <div className="p-2.5">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">Check in</p>
            <input
              type="date"
              value={checkIn}
              min={today}
              onChange={e => { setCheckIn(e.target.value); setDateError(""); }}
              className="w-full text-[12px] font-semibold text-gray-800 outline-none bg-transparent cursor-pointer"
            />
          </div>
          <div className="p-2.5">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">Check out</p>
            <input
              type="date"
              value={checkOut}
              min={checkIn || today}
              onChange={e => { setCheckOut(e.target.value); setDateError(""); }}
              className="w-full text-[12px] font-semibold text-gray-800 outline-none bg-transparent cursor-pointer"
            />
          </div>
        </div>
        {/* Guests */}
        <div className="border-t border-gray-200 p-2.5">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">Guests</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setGuests(g => Math.max(1, g - 1))}
              className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-400 transition-colors text-sm"
            >−</button>
            <span className="flex-1 text-center text-[13px] font-bold text-gray-800">
              {guests} Guest{guests !== 1 ? "s" : ""}
            </span>
            <button
              onClick={() => setGuests(g => Math.min(property.maxGuests, g + 1))}
              className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-400 transition-colors text-sm"
            >+</button>
          </div>
        </div>
      </div>

      {/* Date error */}
      {dateError && (
        <p className="text-[11px] text-red-500 font-medium mb-2 flex items-center gap-1">
          <X className="w-3 h-3" /> {dateError}
        </p>
      )}

      {/* Price breakdown */}
      {nights > 0 && (
        <div className="mb-4 bg-gray-50 rounded-xl p-3 space-y-2 text-[12px]">
          <div className="flex justify-between text-gray-600">
            <span>₹{property.price.toLocaleString("en-IN")} × {nights} night{nights > 1 ? "s" : ""}</span>
            <span className="font-semibold">₹{subtotal.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Service fee (8%)</span>
            <span className="font-semibold">₹{serviceFee.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Taxes (12%)</span>
            <span className="font-semibold">₹{taxes.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between font-bold text-gray-800 pt-2 border-t border-gray-200 text-[13px]">
            <span>Total</span>
            <span className="text-blue-700">₹{total.toLocaleString("en-IN")}</span>
          </div>
        </div>
      )}

      {showSuccess ? (
        <div className="w-full bg-emerald-500 text-white py-3 rounded-xl font-bold text-[14px] flex items-center justify-center gap-2">
          <CheckCircle className="w-5 h-5" /> Booking confirmed!
        </div>
      ) : (
        <button
          onClick={validateAndBook}
          className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-3 rounded-xl font-bold text-[14px] transition-colors shadow-md shadow-blue-200 flex items-center justify-center gap-2"
        >
          <CalendarDays className="w-4 h-4" />
          {nights > 0 ? `Book for ${nights} Night${nights > 1 ? "s" : ""}` : "Check Availability"}
        </button>
      )}

      <div className="flex flex-col gap-1 mt-3">
        {property.freeCancellation && (
          <p className="text-center text-[11px] text-emerald-600 font-semibold flex items-center justify-center gap-1">
            <CheckCircle className="w-3 h-3" /> Free cancellation available
          </p>
        )}
        {property.isInstantBook && (
          <p className="text-center text-[11px] text-blue-500 font-medium flex items-center justify-center gap-1">
            <Zap className="w-3 h-3" /> Instant confirmation
          </p>
        )}
      </div>
      <p className="text-center text-[10px] text-gray-400 mt-2">You won't be charged yet</p>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────
export default function PropertyDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const property = ALL_PROPERTIES.find(p => p.id === id);

  const [liked, setLiked] = useState(property?.isFavorite ?? false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  if (!property) {
    return (
      <div className="min-h-screen bg-[#f0f2f5]">
        <Navbar />
        <div className="container-main py-20 text-center">
          <div className="text-6xl mb-4">🏨</div>
          <h1 className="text-2xl font-bold text-gray-700 mb-4">Property not found</h1>
          <button onClick={() => navigate(-1)} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
            Go back
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const images = property.images.length > 0 ? property.images : [FALLBACK];
  const amenities = property.amenityDetails ?? property.amenities.map(a => ({ name: a, icon: "wifi", available: true }));
  const visibleAmenities = showAllAmenities ? amenities : amenities.slice(0, 8);
  const reviews = property.reviews ?? [];
  const visibleReviews = showAllReviews ? reviews : reviews.slice(0, 3);
  const rb = property.ratingBreakdown;

  const descIsLong = (property.description?.length ?? 0) > 200;

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <Navbar />

      <div className="container-main py-6 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Back + Actions */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium text-sm transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to results
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { navigator.clipboard?.writeText(window.location.href); alert("Link copied!"); }}
              className="flex items-center gap-1.5 text-[12px] text-gray-600 hover:text-blue-600 font-semibold bg-white border border-gray-200 px-3 py-1.5 rounded-xl transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" /> Share
            </button>
            <button
              onClick={() => setLiked(v => !v)}
              className={cn(
                "flex items-center gap-1.5 text-[12px] font-semibold bg-white border px-3 py-1.5 rounded-xl transition-all",
                liked ? "border-rose-300 text-rose-500 bg-rose-50" : "border-gray-200 text-gray-600 hover:border-gray-300"
              )}
            >
              <Heart className={cn("w-3.5 h-3.5", liked && "fill-rose-500")} />
              {liked ? "Saved" : "Save"}
            </button>
          </div>
        </div>

        {/* ── 1. IMAGE GALLERY ── */}
        <ImageGallery images={images} propertyName={property.propertyName} />

        {/* ── Main grid ── */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* ══ LEFT COLUMN ══ */}
          <div className="flex-1 min-w-0 space-y-4">

            {/* ── 2. PROPERTY OVERVIEW ── */}
            <div className="bg-white rounded-2xl p-5" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.07)" }}>
              {/* Badges */}
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">{property.propertyType}</span>
                {property.isInstantBook && (
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Zap className="w-2.5 h-2.5" />Instant Book
                  </span>
                )}
                {property.freeCancellation && (
                  <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-2.5 h-2.5" />Free Cancellation
                  </span>
                )}
              </div>

              <h1 className="text-[20px] sm:text-[22px] font-extrabold text-gray-800 leading-tight mb-1">
                {property.propertyName}
              </h1>
              <p className="text-[13px] text-gray-500 flex items-center gap-1 mb-3">
                <MapPin className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                {property.city}, {property.state}
              </p>

              {/* Host line */}
              {property.host && (
                <div className="flex items-center gap-2.5 mb-3 pb-3 border-b border-gray-100">
                  <img
                    src={property.host.avatar}
                    alt={property.host.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-[13px] text-gray-600">
                    Hosted by <strong className="text-gray-800">{property.host.name}</strong>
                    {property.host.isSuperhost && (
                      <span className="ml-1.5 text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-full">Superhost</span>
                    )}
                  </span>
                </div>
              )}

              {/* Quick stats */}
              <div className="flex items-center gap-4 flex-wrap mb-4">
                <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-xl px-3 py-1.5">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="text-[14px] font-extrabold text-amber-700">{property.rating.toFixed(1)}</span>
                  <span className="text-[12px] text-amber-600">({property.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-[13px] text-gray-500">
                  <Users className="w-3.5 h-3.5 text-gray-400" /> Up to {property.maxGuests} guests
                </div>
                {property.bedType && (
                  <div className="flex items-center gap-1 text-[13px] text-gray-500">
                    <BedDouble className="w-3.5 h-3.5 text-gray-400" /> {property.bedType}
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <p className="text-[13px] text-gray-600 leading-relaxed">
                  {descIsLong && !descExpanded
                    ? `${(property.description ?? "").slice(0, 200)}…`
                    : (property.description ?? `Experience the charm of ${property.city} in this beautifully curated ${property.propertyType.toLowerCase()}.`)
                  }
                </p>
                {descIsLong && (
                  <button
                    onClick={() => setDescExpanded(v => !v)}
                    className="flex items-center gap-1 text-[13px] font-bold text-gray-800 underline mt-2 hover:text-blue-600 transition-colors"
                  >
                    {descExpanded ? "Show less" : "Read more"}
                    <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", descExpanded && "rotate-180")} />
                  </button>
                )}
              </div>
            </div>

            {/* ── 3. AMENITIES / FACILITIES ── */}
            <div className="bg-white rounded-2xl p-5" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.07)" }}>
              <h2 className="text-[15px] font-bold text-gray-800 mb-4">Facilities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {visibleAmenities.map((am, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex items-center gap-2.5 p-2.5 rounded-xl border transition-colors",
                      am.available
                        ? "bg-gray-50 border-gray-100"
                        : "bg-gray-50/50 border-dashed border-gray-200 opacity-50"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                      am.available ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"
                    )}>
                      {AMENITY_ICON_MAP[am.icon] ?? <CheckCircle className="w-4 h-4" />}
                    </div>
                    <span className={cn(
                      "text-[12px] font-semibold",
                      am.available ? "text-gray-700" : "text-gray-400 line-through"
                    )}>
                      {am.name}
                    </span>
                    {!am.available && (
                      <X className="w-3 h-3 text-gray-300 ml-auto flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
              {amenities.length > 8 && (
                <button
                  onClick={() => setShowAllAmenities(v => !v)}
                  className="mt-3 text-[13px] font-bold text-gray-800 underline hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  {showAllAmenities ? "Show less" : `Show all ${amenities.length} amenities`}
                  <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", showAllAmenities && "rotate-180")} />
                </button>
              )}
            </div>

            {/* ── 5. MAP LOCATION ── */}
            <div className="bg-white rounded-2xl p-5" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.07)" }}>
              <h2 className="text-[15px] font-bold text-gray-800 mb-3">Location</h2>
              <PropertyMap property={property} />
              <p className="text-[12px] text-gray-400 mt-2 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-blue-500" />
                {property.city}, {property.state}
              </p>
            </div>

            {/* ── 6. RATINGS & REVIEWS ── */}
            <div className="bg-white rounded-2xl p-5" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.07)" }}>
              {/* Overall rating */}
              <div className="flex items-center gap-4 mb-5">
                <div className="text-center">
                  <p className="text-[42px] font-extrabold text-gray-800 leading-none">{property.rating.toFixed(1)}</p>
                  <div className="flex justify-center mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={cn("w-3.5 h-3.5", i < Math.round(property.rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200")} />
                    ))}
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5 font-medium">{property.reviewCount} reviews</p>
                </div>
                {rb && (
                  <div className="flex-1 space-y-2 pl-4 border-l border-gray-100">
                    <RatingBar label="Cleanliness" value={rb.cleanliness} />
                    <RatingBar label="Accuracy" value={rb.accuracy} />
                    <RatingBar label="Communication" value={rb.communication} />
                    <RatingBar label="Location" value={rb.location} />
                    <RatingBar label="Check-in" value={rb.checkIn} />
                    <RatingBar label="Value" value={rb.value} />
                  </div>
                )}
              </div>

              {/* Reviews list */}
              {reviews.length > 0 && (
                <>
                  <div className="space-y-4">
                    {visibleReviews.map(review => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                  {reviews.length > 3 && (
                    <button
                      onClick={() => setShowAllReviews(v => !v)}
                      className="mt-4 flex items-center gap-1.5 text-[13px] font-bold text-gray-800 border border-gray-300 hover:border-gray-400 px-4 py-2 rounded-xl transition-colors"
                    >
                      {showAllReviews ? "Show fewer reviews" : `Show all ${reviews.length} reviews`}
                      <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", showAllReviews && "rotate-180")} />
                    </button>
                  )}
                </>
              )}
            </div>

            {/* ── 7. SUGGESTED STAYS ── */}
            <SuggestedStays current={property} />

            {/* ── 8. HOST INFORMATION ── */}
            {property.host && <HostCard host={property.host} />}
          </div>

          {/* ══ RIGHT COLUMN: Booking Widget ══ */}
          <div className="lg:w-[310px] xl:w-[330px] flex-shrink-0 w-full">
            <BookingWidget property={property} />
          </div>
        </div>

        {/* Mobile booking bar (fixed bottom) */}
        <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 px-4 py-3 z-50" style={{ boxShadow: "0 -4px 16px rgba(0,0,0,0.08)" }}>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[18px] font-extrabold text-blue-700">₹{property.price.toLocaleString("en-IN")}</span>
              <span className="text-[12px] text-gray-400 ml-1">/night</span>
              {property.rating && (
                <div className="flex items-center gap-1 mt-0.5">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-[11px] font-bold text-gray-600">{property.rating.toFixed(1)}</span>
                  <span className="text-[11px] text-gray-400">({property.reviewCount})</span>
                </div>
              )}
            </div>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold text-[14px] transition-colors shadow-md shadow-blue-200"
            >
              Reserve
            </button>
          </div>
        </div>

        {/* Spacer for mobile fixed bar */}
        <div className="lg:hidden h-20" />
      </div>

      <Footer />

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
}
