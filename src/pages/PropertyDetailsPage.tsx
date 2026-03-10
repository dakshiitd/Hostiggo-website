import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, Heart, MapPin, Wifi, Car, Coffee, Zap, Droplets, UtensilsCrossed, ArrowLeft, Mountain, CheckCircle, Users, BedDouble, ChevronLeft, ChevronRight, X, CalendarDays } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ALL_PROPERTIES } from "@/constants/data";
import { cn } from "@/lib/utils";

const FALLBACK = "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop&q=80";

const AMENITY_MAP: Record<string, { icon: React.ReactNode; label: string }> = {
  "WiFi":         { icon: <Wifi className="w-4 h-4" />, label: "Free WiFi" },
  "Parking":      { icon: <Car className="w-4 h-4" />, label: "Free Parking" },
  "Kitchen":      { icon: <UtensilsCrossed className="w-4 h-4" />, label: "Kitchen" },
  "AC":           { icon: <Zap className="w-4 h-4" />, label: "Air Conditioning" },
  "Pool":         { icon: <Droplets className="w-4 h-4" />, label: "Swimming Pool" },
  "Mountain View":{ icon: <Mountain className="w-4 h-4" />, label: "Mountain View" },
  "Balcony":      { icon: <Mountain className="w-4 h-4" />, label: "Balcony" },
};

const MOCK_REVIEWS = [
  { name: "Priya S.", rating: 5, comment: "Amazing place! Super clean and comfortable. Host was very responsive.", date: "Feb 2025" },
  { name: "Rahul M.", rating: 4, comment: "Great location and amenities. Breakfast was delicious. Will definitely visit again!", date: "Jan 2025" },
  { name: "Anita K.", rating: 5, comment: "One of the best stays I've had. Beautiful property with stunning views.", date: "Dec 2024" },
];

export default function PropertyDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const property = ALL_PROPERTIES.find(p => p.id === id);

  const [liked, setLiked] = useState(property?.isFavorite ?? false);
  const [imgIdx, setImgIdx] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  if (!property) {
    return (
      <div className="min-h-screen bg-[#f0f2f5]">
        <Navbar />
        <div className="container-main py-20 text-center">
          <div className="text-6xl mb-4">🏨</div>
          <h1 className="text-2xl font-bold text-gray-700 mb-4">Property not found</h1>
          <button onClick={() => navigate(-1)} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">Go back</button>
        </div>
        <Footer />
      </div>
    );
  }

  const images = property.images.length > 0 ? property.images : [FALLBACK];
  const nights = checkIn && checkOut
    ? Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))
    : 1;
  const total = property.price * nights;
  const taxes = Math.round(total * 0.12);

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <Navbar />

      <div className="container-main py-6">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium text-sm mb-4 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to results
        </button>

        {/* ── Image Gallery ── */}
        <div className="relative rounded-2xl overflow-hidden mb-6 bg-gray-100" style={{ height: "clamp(240px, 45vw, 420px)" }}>
          <img
            src={images[imgIdx] || FALLBACK}
            alt={property.propertyName}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => setLightbox(true)}
          />
          {/* Overlays */}
          <button
            onClick={() => setLiked(v => !v)}
            className={cn("absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all", liked ? "bg-rose-500 text-white" : "bg-white/90 text-gray-600 hover:text-rose-500")}
          >
            <Heart className={cn("w-5 h-5", liked && "fill-white")} />
          </button>
          {images.length > 1 && (
            <>
              <button
                onClick={() => setImgIdx(i => (i - 1 + images.length) % images.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all"
              >
                <ChevronLeft className="w-4 h-4 text-gray-700" />
              </button>
              <button
                onClick={() => setImgIdx(i => (i + 1) % images.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all"
              >
                <ChevronRight className="w-4 h-4 text-gray-700" />
              </button>
              {/* Thumbnail strip */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className={cn("w-12 h-8 rounded-md overflow-hidden border-2 transition-all", i === imgIdx ? "border-white shadow-md" : "border-transparent opacity-70 hover:opacity-100")}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Lightbox */}
        {lightbox && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={() => setLightbox(false)}>
            <button className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
            <img src={images[imgIdx]} alt="" className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl" />
          </div>
        )}

        {/* ── Main grid ── */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left column */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* Title card */}
            <div className="bg-white rounded-2xl p-5" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.07)" }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{property.propertyType}</span>
                {property.isInstantBook && <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1"><Zap className="w-2.5 h-2.5" />Instant Book</span>}
              </div>
              <h1 className="text-xl font-extrabold text-gray-800 mb-1">{property.propertyName}</h1>
              <p className="text-[13px] text-gray-500 flex items-center gap-1 mb-3">
                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                {property.city}, {property.state}
              </p>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="text-[14px] font-bold text-amber-700">{property.rating.toFixed(1)}</span>
                  <span className="text-[12px] text-amber-600">({property.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-[13px] text-gray-500">
                  <Users className="w-3.5 h-3.5" /> Up to {property.maxGuests} guests
                </div>
                {property.bedType && (
                  <div className="flex items-center gap-1 text-[13px] text-gray-500">
                    <BedDouble className="w-3.5 h-3.5" /> {property.bedType}
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-5" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.07)" }}>
              <h2 className="text-[15px] font-bold text-gray-800 mb-2">About this property</h2>
              <p className="text-[13px] text-gray-600 leading-relaxed">
                {property.description ?? `Experience the charm of ${property.city} in this beautifully curated ${property.propertyType.toLowerCase()}. Thoughtfully designed interiors meet warm hospitality to give you a home away from home. Enjoy the local culture, explore nearby attractions, and return each evening to comfort and relaxation.`}
              </p>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-2xl p-5" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.07)" }}>
              <h2 className="text-[15px] font-bold text-gray-800 mb-3">What this place offers</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map(am => {
                  const meta = AMENITY_MAP[am];
                  return (
                    <div key={am} className="flex items-center gap-2.5 p-2.5 bg-gray-50 rounded-xl">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                        {meta?.icon ?? <CheckCircle className="w-4 h-4" />}
                      </div>
                      <span className="text-[12px] font-semibold text-gray-700">{meta?.label ?? am}</span>
                    </div>
                  );
                })}
              </div>
              {property.freeCancellation && (
                <div className="flex items-center gap-2.5 mt-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <div>
                    <p className="text-[13px] font-bold text-emerald-700">Free Cancellation</p>
                    <p className="text-[11px] text-emerald-600">Cancel anytime before check-in for a full refund</p>
                  </div>
                </div>
              )}
            </div>

            {/* Map */}
            <div className="bg-white rounded-2xl p-5" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.07)" }}>
              <h2 className="text-[15px] font-bold text-gray-800 mb-3">Location</h2>
              <div className="rounded-xl overflow-hidden border border-gray-100" style={{ height: 200 }}>
                <svg width="100%" height="200" viewBox="0 0 400 200" className="w-full">
                  <rect width="400" height="200" fill="#e8f0fe" />
                  <line x1="0" y1="100" x2="400" y2="100" stroke="#c5d4f5" strokeWidth="10" />
                  <line x1="200" y1="0" x2="200" y2="200" stroke="#c5d4f5" strokeWidth="10" />
                  <line x1="0" y1="50" x2="400" y2="65" stroke="#d0ddf8" strokeWidth="5" />
                  <line x1="0" y1="150" x2="400" y2="140" stroke="#d0ddf8" strokeWidth="5" />
                  <rect x="20" y="15" width="70" height="30" rx="4" fill="#d4e0fb" />
                  <rect x="100" y="15" width="90" height="30" rx="4" fill="#dce7fc" />
                  <rect x="220" y="15" width="70" height="30" rx="4" fill="#d4e0fb" />
                  <rect x="310" y="15" width="80" height="30" rx="4" fill="#dce7fc" />
                  <rect x="20" y="115" width="80" height="35" rx="4" fill="#d4e0fb" />
                  <rect x="115" y="115" width="75" height="35" rx="4" fill="#dce7fc" />
                  <rect x="220" y="115" width="80" height="35" rx="4" fill="#d4e0fb" />
                  <rect x="315" y="115" width="75" height="35" rx="4" fill="#dce7fc" />
                  {/* Pin */}
                  <circle cx="200" cy="100" r="16" fill="#2563eb" opacity="0.2" />
                  <circle cx="200" cy="100" r="8" fill="#2563eb" />
                  <circle cx="200" cy="100" r="3" fill="white" />
                </svg>
              </div>
              <p className="text-[12px] text-gray-400 mt-2 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-blue-500" />
                {property.city}, {property.state}
              </p>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl p-5" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.07)" }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[15px] font-bold text-gray-800">Guest Reviews</h2>
                <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="font-bold text-amber-700">{property.rating.toFixed(1)}</span>
                  <span className="text-[12px] text-amber-600">/ 5</span>
                </div>
              </div>
              <div className="space-y-3">
                {MOCK_REVIEWS.map((r, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">{r.name[0]}</div>
                        <div>
                          <p className="text-[12px] font-bold text-gray-700">{r.name}</p>
                          <p className="text-[10px] text-gray-400">{r.date}</p>
                        </div>
                      </div>
                      <div className="flex">
                        {Array.from({ length: r.rating }).map((_, j) => (
                          <Star key={j} className="w-3 h-3 text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-[12px] text-gray-600 leading-relaxed">{r.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Booking panel ── */}
          <div className="lg:w-[300px] xl:w-[320px] flex-shrink-0 w-full">
            <div className="bg-white rounded-2xl p-5 sticky top-32" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.10)" }}>
              <div className="flex items-baseline gap-1 mb-4">
                {property.originalPrice && (
                  <span className="text-[13px] text-gray-400 line-through">₹{property.originalPrice.toLocaleString("en-IN")}</span>
                )}
                <span className="text-[22px] font-extrabold text-blue-700">₹{property.price.toLocaleString("en-IN")}</span>
                <span className="text-[12px] text-gray-400">/night</span>
              </div>

              {/* Date inputs */}
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="border border-gray-200 rounded-xl p-2.5">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">Check in</p>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={e => setCheckIn(e.target.value)}
                    className="w-full text-[12px] font-semibold text-gray-800 outline-none bg-transparent"
                  />
                </div>
                <div className="border border-gray-200 rounded-xl p-2.5">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">Check out</p>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={e => setCheckOut(e.target.value)}
                    className="w-full text-[12px] font-semibold text-gray-800 outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Guests */}
              <div className="border border-gray-200 rounded-xl p-2.5 mb-4">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">Guests</p>
                <div className="flex items-center gap-2">
                  <button onClick={() => setGuests(g => Math.max(1, g - 1))} className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-blue-400 transition-colors text-sm">−</button>
                  <span className="flex-1 text-center text-[13px] font-bold text-gray-800">{guests} Guest{guests !== 1 ? "s" : ""}</span>
                  <button onClick={() => setGuests(g => Math.min(property.maxGuests, g + 1))} className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-blue-400 transition-colors text-sm">+</button>
                </div>
              </div>

              {/* Price breakdown */}
              {checkIn && checkOut && (
                <div className="mb-4 space-y-1.5 text-[13px]">
                  <div className="flex justify-between text-gray-600">
                    <span>₹{property.price.toLocaleString("en-IN")} × {nights} night{nights > 1 ? "s" : ""}</span>
                    <span>₹{(property.price * nights).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Taxes & fees (12%)</span>
                    <span>₹{taxes.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-800 pt-1.5 border-t border-gray-100">
                    <span>Total</span>
                    <span className="text-blue-700">₹{(total + taxes).toLocaleString("en-IN")}</span>
                  </div>
                </div>
              )}

              <button className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-3 rounded-xl font-bold text-[14px] transition-colors shadow-md shadow-blue-200 flex items-center justify-center gap-2">
                <CalendarDays className="w-4 h-4" />
                Book Now
              </button>

              {property.freeCancellation && (
                <p className="text-center text-[11px] text-emerald-600 mt-2 font-semibold flex items-center justify-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Free cancellation available
                </p>
              )}
              {property.isInstantBook && (
                <p className="text-center text-[11px] text-blue-500 mt-1 font-medium">⚡ Instant confirmation</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
