import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, Heart, MapPin, Wifi, Car, Coffee, Zap, Droplets, UtensilsCrossed, ArrowLeft, Mountain, CheckCircle, Users, BedDouble, ChevronLeft, ChevronRight, X, CalendarDays, Camera, ChevronDown, Info, Clock, Share2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ALL_PROPERTIES } from "@/constants/data";
import { cn } from "@/lib/utils";
import { CompactSearchBar } from "@/components/features/SearchForm";

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

// ── Inline property location map ──────────────────────────────────────
function PropertyMap({ property, className }: { property: import("@/types").Property; className?: string }) {
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
      const map = L.map(mapRef.current, {
        center, zoom: 14,
        zoomControl: true, attributionControl: false,
        scrollWheelZoom: false,
      });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(map);
      const icon = L.divIcon({
        className: "",
        html: `<div style="background:#2563eb;width:18px;height:18px;border-radius:50%;border:3px solid white;box-shadow:0 3px 10px rgba(37,99,235,0.55)"></div>`,
        iconSize: [18, 18], iconAnchor: [9, 9],
      });
      L.marker(center, { icon }).addTo(map)
        .bindPopup(`<b style="font-size:13px">${property.propertyName}</b><br/><span style="font-size:11px;color:#6b7280">${property.city}, ${property.state}</span>`, { maxWidth: 200 })
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

  return (
    <div className={cn("rounded-xl overflow-hidden relative border border-gray-100", className)} style={className ? undefined : { height: 240 }}>
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
  );
}

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
      <div className="min-h-screen bg-[#FFFEF9]">
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
    <div className="min-h-screen bg-[#FFFEF9] pb-24">
      <Navbar />

      {/* Top Search Strip */}
      <div className="bg-[#005a9c] py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <CompactSearchBar />
        </div>
      </div>

      {/* Sticky Action Bar & Tabs */}
      <div className="sticky top-0 z-40 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] border-b border-gray-100 transition-all">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center gap-6">
              <button className="bg-primary-gradient border-2 border-white/20 text-white px-8 py-2.5 rounded-full font-bold text-[14px] transition-all shadow-md active:scale-95">
                Reserve
              </button>
              <div className="hidden sm:flex items-baseline gap-2">
                {property.originalPrice && (
                  <span className="text-[13px] text-gray-400 line-through">₹{(property.originalPrice * nights).toLocaleString("en-IN")}</span>
                )}
                <span className="text-[18px] font-extrabold text-[#1A1A1A]">₹{total.toLocaleString("en-IN")}</span>
                <span className="text-[13px] text-gray-500 font-medium ml-1">• for {nights} night{nights !== 1 ? "s" : ""} • {guests} Adult{guests !== 1 ? "s" : ""}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors">
                 <Share2 className="w-4 h-4" />
              </button>
              <button onClick={() => setLiked(!liked)} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors">
                 <Heart className={cn("w-4 h-4", liked && "fill-rose-500 text-rose-500")} />
              </button>
            </div>
          </div>
          {/* Tabs */}
          <div className="flex items-center gap-8 overflow-x-auto no-scrollbar py-3.5">
            {["Overview", "Facilities", "Availability", "Location", "Ratings & reviews", "Add-ons", "House rules"].map(tab => (
               <a href={`#${tab.toLowerCase().replace(/ /g, "-")}`} key={tab} className={cn("text-[13.5px] font-bold whitespace-nowrap pb-3.5 -mb-3.5 border-b-[3px] transition-colors mt-0.5", tab === "Overview" ? "text-[#1A1A1A] border-[#1A1A1A]" : "text-gray-500 border-transparent hover:text-gray-800")}>
                 {tab}
               </a>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Title & Location */}
        <div className="mb-6">
          <h1 className="text-[28px] font-extrabold text-[#1A1A1A] mb-1.5">{property.propertyName}</h1>
          <p className="text-[14px] font-medium text-[#4A4A4A]">{property.city}, {property.state}</p>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-3 rounded-[24px] overflow-hidden mb-12 h-[380px] sm:h-[460px] relative">
          {/* Left Large Image */}
          <div className="relative h-full w-full">
            <img src={images[0] || FALLBACK} alt="" className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity" onClick={() => setLightbox(true)} />
          </div>
          {/* Right 4 Small Images */}
          <div className="hidden md:grid grid-cols-2 grid-rows-2 gap-[12px] h-full">
            {images.slice(1, 5).map((img, i) => (
               <div key={i} className="relative h-full w-full overflow-hidden">
                 <img src={img || FALLBACK} alt="" className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity" onClick={() => { setImgIdx(i + 1); setLightbox(true); }} />
               </div>
            ))}
            {/* If fewer than 5 images */}
            {Array.from({ length: Math.max(0, 4 - (images.length - 1)) }).map((_, i) => (
               <div key={`fallback-${i}`} className="relative h-full w-full overflow-hidden">
                 <img src={FALLBACK} alt="" className="w-full h-full object-cover opacity-80 mix-blend-multiply" />
               </div>
            ))}
          </div>
          {/* View all photos button */}
          <div className="absolute bottom-4 right-4 z-10 hidden md:block">
             <button onClick={() => setLightbox(true)} className="bg-black/60 hover:bg-black/80 backdrop-blur-md text-white px-4 py-2.5 rounded-lg text-[13px] font-bold flex items-center gap-2 transition-colors">
                <Camera className="w-4 h-4" /> View all photos
             </button>
          </div>
        </div>

        {/* Lightbox */}
        {lightbox && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center transition-opacity" onClick={() => setLightbox(false)}>
            <button className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
            <img src={images[imgIdx]} alt="" className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl" />
          </div>
        )}

        {/* Overview (Description) */}
        <section id="overview" className="mb-14 scroll-mt-40">
          <p className="text-[14px] leading-relaxed text-[#4A4A4A] max-w-4xl">
            The guest will enjoy easy access to everything from this centrally located place. This place is well connected with public transport like metro, bus, cab etc.<br/><br/>
            This place is centrally located in the heart of city. All important places like ISBT, Railway Station, airport, govt offices, embassies, shopping malls, hospitals, metro stations, coaching institutions, Good restaurants etc are nearby & with in few miles only. The place has amazing ambience & surroundings. This has ample parking space.
          </p>
        </section>

        {/* Facilities */}
        <section id="facilities" className="mb-14 scroll-mt-40">
          <h2 className="text-[20px] font-bold text-[#1A1A1A] mb-6">Facilities</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4 max-w-4xl">
            {property.amenities.map((am, i) => {
              const meta = AMENITY_MAP[am] || { icon: <CheckCircle className="w-4.5 h-4.5" />, label: am };
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="text-gray-700">{meta.icon}</div>
                  <span className="text-[13px] font-medium text-[#4A4A4A]">{meta.label}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Availability */}
        <section id="availability" className="mb-14 scroll-mt-40 border-t border-b border-gray-200 py-10 flex flex-col md:flex-row items-center gap-14 max-w-5xl">
          {/* Booking Form Side */}
          <div className="w-full md:w-[380px]">
            <h2 className="text-[20px] font-bold text-[#1A1A1A] mb-6">Availability</h2>
            <div className="flex gap-3 mb-3">
              <div className="flex-1 border border-gray-300 hover:border-black rounded-lg p-3 transition-colors cursor-pointer relative">
                <p className="text-[10px] font-bold text-[#4A4A4A] mb-1">Check-in</p>
                <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} className="w-full text-[13px] font-medium text-[#1A1A1A] outline-none bg-transparent cursor-pointer relative z-10" />
              </div>
              <div className="flex-1 border border-gray-300 hover:border-black rounded-lg p-3 transition-colors cursor-pointer relative">
                <p className="text-[10px] font-bold text-[#4A4A4A] mb-1">Check-out</p>
                <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} className="w-full text-[13px] font-medium text-[#1A1A1A] outline-none bg-transparent cursor-pointer relative z-10" />
              </div>
            </div>
            <div className="border border-gray-300 hover:border-black rounded-lg p-4 mb-4 transition-colors cursor-pointer flex items-center justify-between">
               <span className="text-[14px] font-medium text-[#1A1A1A]">{guests} Adult{guests !== 1 ? 's' : ''} • 1 Room</span>
               <ChevronDown className="w-4 h-4 text-[#1A1A1A]" />
            </div>
            <button className="w-full bg-primary-gradient border-2 border-white/20 text-white py-3.5 rounded-full font-bold text-[14px] transition-all shadow-md active:scale-95 mb-2">
              Reserve
            </button>
            <p className="text-center text-[12px] text-gray-400 font-medium">You wouldn't be charged yet</p>
          </div>
          
          {/* Price Side */}
          <div className="w-full md:w-auto md:border-l border-gray-200 md:pl-14 flex flex-col justify-center mt-6 md:mt-12">
             <div className="flex items-baseline gap-2 mb-1">
               {property.originalPrice && (
                 <span className="text-[15px] font-bold text-gray-400 line-through">₹{property.originalPrice.toLocaleString('en-IN')}</span>
               )}
               <span className="text-[26px] font-extrabold text-[#1A1A1A]">₹{property.price.toLocaleString('en-IN')}</span>
             </div>
             <p className="text-[13px] text-[#4A4A4A] font-medium mb-3">for {nights} night{nights !== 1 ? 's' : ''}</p>
             {property.freeCancellation && (
               <div className="inline-flex items-center gap-1.5 bg-[#4B83A6] text-white px-3.5 py-1.5 rounded-lg text-[11px] font-bold tracking-wide">
                 <Info className="w-3.5 h-3.5" /> Free cancellation before 15th March
               </div>
             )}
          </div>
        </section>

        {/* Location */}
        <section id="location" className="mb-14 scroll-mt-40">
          <h2 className="text-[20px] font-bold text-[#1A1A1A] mb-4">Location</h2>
          <p className="text-[14px] text-[#4A4A4A] mb-5">Near Old Manali Road, Hadimba Temple Area, Manali, Himachal Pradesh - 175131</p>
          <div className="mb-6">
            <h3 className="text-[14px] font-bold text-[#1A1A1A] mb-3">Nearby Locations -</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-[13.5px] text-[#4A4A4A]">
                 <MapPin className="w-4 h-4 text-[#4A4A4A]" /> Hadimba devi temple, 1.2Km
              </li>
              <li className="flex items-center gap-2 text-[13.5px] text-[#4A4A4A]">
                 <MapPin className="w-4 h-4 text-[#4A4A4A]" /> Manali volvo bus stand, 4 Km
              </li>
              <li className="flex items-center gap-2 text-[13.5px] text-[#4A4A4A]">
                 <MapPin className="w-4 h-4 text-[#4A4A4A]" /> Mall road, 1.3 Km
              </li>
            </ul>
          </div>
          <div className="w-full h-[400px] sm:h-[480px]">
             <PropertyMap property={property} className="w-full h-full rounded-[24px]" />
          </div>
        </section>

        {/* Ratings & reviews */}
        <section id="ratings-&-reviews" className="mb-14 scroll-mt-40 pt-4">
          <h2 className="text-[24px] font-bold text-[#1A1A1A] mb-12">Ratings & reviews</h2>
          
          <div className="flex flex-col items-center justify-center mb-12">
             <div className="text-center mb-2 flex items-baseline justify-center">
               <span className="text-[56px] font-extrabold text-[#1A1A1A] tracking-tight leading-none">{property.rating.toFixed(1)}</span>
               <span className="text-[15px] font-bold text-gray-500 ml-1">({property.reviewCount})</span>
             </div>
             <div className="flex mb-6 gap-0.5">
                 {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-[#4A4A4A] fill-[#4A4A4A]" />
                 ))}
             </div>
             {/* Progress bars */}
             <div className="w-full max-w-[280px] flex flex-col gap-2">
                {[
                  { stars: "5", pct: 85 },
                  { stars: "4", pct: 60 },
                  { stars: "3", pct: 25 },
                  { stars: "2", pct: 10 },
                  { stars: "1", pct: 5 }
                ].map((row, i) => (
                  <div key={i} className="flex items-center gap-3">
                     <span className="text-[12px] font-medium text-gray-500 w-2.5 text-right flex-shrink-0">{row.stars}</span>
                     <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                       <div className="h-full bg-[#0071C2] rounded-full" style={{ width: `${row.pct}%` }}></div>
                     </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="relative flex items-center mb-6">
             {/* Horizontal scrolling cards container */}
             <div className="flex items-start gap-4 overflow-x-auto no-scrollbar pb-6 snap-x w-full">
                {MOCK_REVIEWS.map((r, i) => (
                   <div key={i} className="min-w-[320px] sm:min-w-[360px] border border-gray-200 rounded-[20px] p-6 snap-start bg-white shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                      <div className="flex justify-between items-start mb-4">
                         <div className="flex items-center gap-3">
                            <img src={`https://ui-avatars.com/api/?name=${r.name}&background=random&color=fff&size=80`} alt={r.name} className="w-12 h-12 rounded-full object-cover" />
                            <div>
                               <p className="text-[14px] font-bold text-[#1A1A1A] leading-snug mb-0.5">{r.name}</p>
                               <div className="flex">
                                 {[...Array(r.rating)].map((_, idx) => <Star key={idx} className="w-3 h-3 text-[#4A4A4A] fill-[#4A4A4A]" />)}
                               </div>
                            </div>
                         </div>
                         <span className="text-[12px] font-medium text-gray-400">3 weeks ago</span>
                      </div>
                      <p className="text-[13.5px] text-[#4A4A4A] leading-relaxed line-clamp-4 mb-3">
                         "We had a wonderful stay at this homestay. The room was clean, spacious, and exactly as shown in the photos. The host was very..."
                      </p>
                      <button className="text-[12px] font-bold text-[#0071C2] hover:underline">Read more</button>
                   </div>
                ))}
             </div>
             
             {/* Arrow mask overlay */}
             <div className="absolute right-0 top-0 bottom-6 w-24 bg-gradient-to-l from-white to-transparent pointer-events-none flex items-center justify-end pr-1">
                <button className="w-11 h-11 rounded-full bg-white shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-gray-100 flex items-center justify-center text-[#1A1A1A] hover:bg-gray-50 transition-colors pointer-events-auto">
                   <ChevronRight className="w-5 h-5 ml-0.5 text-gray-600" />
                </button>
             </div>
          </div>
          
          <button className="px-6 py-2.5 border border-[#0071C2] text-[#0071C2] text-[13px] font-bold rounded-lg hover:bg-[#0071C2]/5 transition-colors tracking-wide">
             View all reviews
          </button>
        </section>

      </div>
    </div>
  );
}
