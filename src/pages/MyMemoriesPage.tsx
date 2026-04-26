import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin, Calendar, ChevronRight, X, Clock,
  CheckCircle, XCircle, Navigation, ArrowRight
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import memoriesIllustration from "@/assets/memories-illustration.png";
import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────────

type TabKey = "upcoming" | "completed" | "cancelled";

interface Booking {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  location: string;
  distanceText: string;
  checkIn: string;    // "Aug 29, Wed"
  checkOut: string;   // "Fri, 27 Nov"
  checkInRaw: Date;
  checkOutRaw: Date;
  status: TabKey;
  coordinates: { lat: number; lng: number };
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

const today = new Date();
const daysFromNow = (d: number) => {
  const dt = new Date(today);
  dt.setDate(dt.getDate() + d);
  return dt;
};
const fmt = (d: Date) =>
  d.toLocaleDateString("en-IN", { month: "short", day: "numeric", weekday: "short" });

const MOCK_BOOKINGS: Booking[] = [
  {
    id: "b1",
    title: "The Great Rooms Of Triply Home Services",
    subtitle: "Premium homestay with lake view",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop&q=80",
    location: "Noida, Delhi",
    distanceText: "0.5 km from Vayu Mahal",
    checkIn: fmt(daysFromNow(2)),
    checkOut: fmt(daysFromNow(5)),
    checkInRaw: daysFromNow(2),
    checkOutRaw: daysFromNow(5),
    status: "upcoming",
    coordinates: { lat: 28.5355, lng: 77.3910 },
  },
  {
    id: "b2",
    title: "Gulu Mulu Heritage Homestay",
    subtitle: "Cozy stay in the heart of the city",
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600&fit=crop&q=80",
    location: "Manali, Himachal Pradesh",
    distanceText: "1.2 km from Mall Road",
    checkIn: fmt(daysFromNow(10)),
    checkOut: fmt(daysFromNow(14)),
    checkInRaw: daysFromNow(10),
    checkOutRaw: daysFromNow(14),
    status: "upcoming",
    coordinates: { lat: 32.2396, lng: 77.1887 },
  },
  {
    id: "b3",
    title: "Ree Ezz Residency Deluxe",
    subtitle: "Modern apartment with city skyline",
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600&fit=crop&q=80",
    location: "Gurugram, Haryana",
    distanceText: "0.8 km from Cyber Hub",
    checkIn: fmt(daysFromNow(-15)),
    checkOut: fmt(daysFromNow(-12)),
    checkInRaw: daysFromNow(-15),
    checkOutRaw: daysFromNow(-12),
    status: "completed",
    coordinates: { lat: 28.4595, lng: 77.0266 },
  },
  {
    id: "b4",
    title: "Mountain View Cottage Retreat",
    subtitle: "Peaceful mountain getaway",
    image: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800&h=600&fit=crop&q=80",
    location: "Shimla, Himachal Pradesh",
    distanceText: "3 km from Ridge Road",
    checkIn: fmt(daysFromNow(-30)),
    checkOut: fmt(daysFromNow(-27)),
    checkInRaw: daysFromNow(-30),
    checkOutRaw: daysFromNow(-27),
    status: "completed",
    coordinates: { lat: 31.1048, lng: 77.1734 },
  },
  {
    id: "b5",
    title: "Urban Nest Premium Suite",
    subtitle: "Chic urban loft with designer interiors",
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=600&fit=crop&q=80",
    location: "Bangalore, Karnataka",
    distanceText: "0.3 km from MG Road",
    checkIn: fmt(daysFromNow(-5)),
    checkOut: fmt(daysFromNow(-3)),
    checkInRaw: daysFromNow(-5),
    checkOutRaw: daysFromNow(-3),
    status: "cancelled",
    coordinates: { lat: 12.9716, lng: 77.5946 },
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function getDaysLeft(checkInRaw: Date): number {
  const diff = Math.ceil((checkInRaw.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

function getDaysStayed(checkInRaw: Date, checkOutRaw: Date): number {
  return Math.ceil((checkOutRaw.getTime() - checkInRaw.getTime()) / (1000 * 60 * 60 * 24));
}

// ── Empty State Config ────────────────────────────────────────────────────────

const EMPTY_CONFIG: Record<TabKey, { heading: string; sub: string; cta?: string }> = {
  upcoming: {
    heading: "No upcoming trips yet,",
    sub: "Start planning your next stay or services.",
    cta: "Explore stays",
  },
  completed: {
    heading: "No completed trips yet,",
    sub: "Your past stays will appear here.",
  },
  cancelled: {
    heading: "No cancelled bookings,",
    sub: "Cancelled trips will be shown here.",
  },
};

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "upcoming", label: "Upcoming", icon: <Clock className="w-3.5 h-3.5" /> },
  { key: "completed", label: "Completed", icon: <CheckCircle className="w-3.5 h-3.5" /> },
  { key: "cancelled", label: "Cancelled", icon: <XCircle className="w-3.5 h-3.5" /> },
];

// ── Skeleton Card ─────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse"
      style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
      <div className="flex flex-col sm:flex-row">
        <div className="w-full sm:w-[200px] h-[160px] sm:h-auto bg-gray-200 flex-shrink-0" />
        <div className="flex-1 p-5 flex flex-col gap-3">
          <div className="h-5 bg-gray-200 rounded-lg w-3/4" />
          <div className="h-3.5 bg-gray-100 rounded-lg w-1/2" />
          <div className="h-8 bg-gray-100 rounded-lg w-1/3 mt-2" />
          <div className="h-9 bg-gray-100 rounded-xl w-36 mt-auto" />
        </div>
        <div className="hidden sm:flex flex-col items-center justify-center gap-4 px-8 border-l border-dashed border-gray-200 min-w-[160px]">
          <div className="h-12 w-20 bg-gray-100 rounded-lg" />
          <div className="h-12 w-20 bg-gray-100 rounded-lg" />
          <div className="h-6 w-24 bg-gray-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// ── Manage Booking Modal ──────────────────────────────────────────────────────

function ManageBookingModal({ booking, onClose }: { booking: Booking; onClose: () => void }) {
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const actions = booking.status === "upcoming"
    ? [
        { label: "View Property", icon: <ArrowRight className="w-4 h-4" />, color: "blue", onClick: () => { onClose(); navigate(`/property/${booking.id}`); } },
        { label: "Modify Dates", icon: <Calendar className="w-4 h-4" />, color: "gray", onClick: () => {} },
        { label: "Cancel Booking", icon: <XCircle className="w-4 h-4" />, color: "red", onClick: () => {} },
      ]
    : booking.status === "completed"
    ? [
        { label: "View Property", icon: <ArrowRight className="w-4 h-4" />, color: "blue", onClick: () => { onClose(); navigate(`/property/${booking.id}`); } },
        { label: "Book Again", icon: <CheckCircle className="w-4 h-4" />, color: "green", onClick: () => {} },
        { label: "Write a Review", icon: <ChevronRight className="w-4 h-4" />, color: "gray", onClick: () => {} },
      ]
    : [
        { label: "View Property", icon: <ArrowRight className="w-4 h-4" />, color: "blue", onClick: () => { onClose(); navigate(`/property/${booking.id}`); } },
        { label: "Book Again", icon: <CheckCircle className="w-4 h-4" />, color: "green", onClick: () => {} },
      ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-[420px] overflow-hidden"
        style={{ animation: "slideUp 0.22s ease both" }}
      >
        {/* Image header */}
        <div className="relative h-[160px] overflow-hidden">
          <img src={booking.image} alt={booking.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm"
          >
            <X className="w-4 h-4 text-gray-700" strokeWidth={2.5} />
          </button>
          <div className="absolute bottom-3 left-4">
            <span className={cn(
              "inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full",
              booking.status === "upcoming" ? "bg-blue-500 text-white" :
              booking.status === "completed" ? "bg-emerald-500 text-white" :
              "bg-red-500 text-white"
            )}>
              {booking.status === "upcoming" && <Clock className="w-3 h-3" />}
              {booking.status === "completed" && <CheckCircle className="w-3 h-3" />}
              {booking.status === "cancelled" && <XCircle className="w-3 h-3" />}
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </div>
        </div>

        <div className="p-5">
          <h3 className="text-[15px] font-bold text-gray-900 leading-snug mb-1">{booking.title}</h3>
          <div className="flex items-center gap-1.5 text-[12px] text-gray-500 mb-4">
            <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
            {booking.location}
          </div>

          {/* Dates */}
          <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4 mb-5">
            <div className="flex-1 text-center">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Check-In</p>
              <p className="text-[13px] font-bold text-gray-800">{booking.checkIn}</p>
            </div>
            <div className="flex-shrink-0 text-gray-300">→</div>
            <div className="flex-1 text-center">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Check-Out</p>
              <p className="text-[13px] font-bold text-gray-800">{booking.checkOut}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2.5">
            {actions.map((action) => (
              <button
                key={action.label}
                onClick={action.onClick}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 rounded-xl text-[13px] font-semibold transition-all duration-150 active:scale-[0.98]",
                  action.color === "blue" ? "bg-[#1B3FA0] text-white hover:bg-[#162e82]" :
                  action.color === "green" ? "bg-emerald-600 text-white hover:bg-emerald-700" :
                  action.color === "red" ? "bg-red-50 text-red-500 border border-red-200 hover:bg-red-100" :
                  "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                )}
              >
                <span>{action.label}</span>
                {action.icon}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Booking Card ──────────────────────────────────────────────────────────────

function BookingCard({ booking, onManage }: { booking: Booking; onManage: (b: Booking) => void }) {
  const [imgErr, setImgErr] = useState(false);
  const FALLBACK = "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop&q=80";

  const daysLeft = getDaysLeft(booking.checkInRaw);
  const nights = getDaysStayed(booking.checkInRaw, booking.checkOutRaw);

  const statusLabel =
    booking.status === "upcoming"
      ? daysLeft === 0 ? "Today!" : daysLeft === 1 ? "Tomorrow!" : `${daysLeft} days left`
      : booking.status === "completed"
      ? `${nights} night stay`
      : "Booking cancelled";

  const handleLocation = () => {
    const url = `https://www.google.com/maps?q=${booking.coordinates.lat},${booking.coordinates.lng}`;
    window.open(url, "_blank");
  };

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
      style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="relative w-full sm:w-[200px] h-[180px] sm:h-auto flex-shrink-0 overflow-hidden rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none">
          <img
            src={imgErr ? FALLBACK : booking.image}
            alt={booking.title}
            onError={() => setImgErr(true)}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Status ribbon */}
          <div className={cn(
            "absolute top-3 left-3 flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm",
            booking.status === "upcoming" ? "bg-white text-blue-600 border border-blue-100" :
            booking.status === "completed" ? "bg-white text-emerald-600 border border-emerald-100" :
            "bg-white text-red-500 border border-red-100"
          )}>
            {booking.status === "upcoming" && <Clock className="w-3 h-3" />}
            {booking.status === "completed" && <CheckCircle className="w-3 h-3" />}
            {booking.status === "cancelled" && <XCircle className="w-3 h-3" />}
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 flex flex-col min-w-0">
          <h3 className="text-[15px] sm:text-[16px] font-bold text-gray-900 leading-snug mb-1.5 line-clamp-2 pr-2">
            {booking.title}
          </h3>
          <p className="text-[12px] text-gray-400 mb-3 flex items-center gap-1">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            {booking.distanceText}
          </p>

          {/* Location button */}
          <button
            onClick={handleLocation}
            className="self-start flex items-center gap-2 border border-gray-200 text-gray-600 text-[12px] font-semibold px-3 py-1.5 rounded-lg hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-150 mb-4 group/loc"
          >
            <Navigation className="w-3.5 h-3.5 group-hover/loc:text-blue-500 transition-colors" />
            Location
          </button>

          {/* Manage Booking */}
          <button
            onClick={() => onManage(booking)}
            className="self-start sm:mt-auto flex items-center gap-2 bg-[#1B3FA0] text-white text-[13px] font-bold px-4 py-2.5 rounded-xl hover:bg-[#162e82] active:scale-[0.98] transition-all duration-150 shadow-sm"
          >
            Manage Booking
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Dates panel */}
        <div className="flex sm:flex-col items-center justify-between sm:justify-center gap-3 sm:gap-5 px-5 py-4 sm:px-8 border-t sm:border-t-0 sm:border-l border-dashed border-gray-200 sm:min-w-[170px]">
          {/* Check-In */}
          <div className="text-center flex-1 sm:flex-none">
            <p className="text-[9.5px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Check-In</p>
            <p className="text-[12px] sm:text-[13px] font-bold text-gray-800 whitespace-nowrap">{booking.checkIn}</p>
          </div>

          <div className="text-gray-300 text-lg sm:hidden">·</div>

          {/* Check-Out */}
          <div className="text-center flex-1 sm:flex-none">
            <p className="text-[9.5px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Check-Out</p>
            <p className="text-[12px] sm:text-[13px] font-bold text-gray-800 whitespace-nowrap">{booking.checkOut}</p>
          </div>

          {/* Status badge */}
          <div className={cn(
            "text-[12px] sm:text-[13px] font-extrabold whitespace-nowrap flex-shrink-0",
            booking.status === "upcoming" ? "text-[#1B3FA0]" :
            booking.status === "completed" ? "text-emerald-600" :
            "text-red-500"
          )}>
            {statusLabel}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────

function EmptyState({ tab }: { tab: TabKey }) {
  const navigate = useNavigate();
  const { heading, sub, cta } = EMPTY_CONFIG[tab];

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-14 py-16 animate-fade-in">
      <img
        src={memoriesIllustration}
        alt="No trips"
        className="w-[160px] sm:w-[200px] object-contain flex-shrink-0 drop-shadow-sm"
      />
      <div className="text-center sm:text-left max-w-xs">
        <h3 className="text-[22px] sm:text-[26px] font-extrabold italic text-gray-900 leading-tight mb-2">
          {heading}
        </h3>
        <p className="text-[14px] text-gray-500 leading-relaxed mb-6">{sub}</p>
        {cta && (
          <button
            onClick={() => navigate("/")}
            className="bg-[#1B3FA0] text-white px-6 py-2.5 rounded-xl text-[14px] font-semibold hover:bg-[#162e82] active:scale-[0.98] transition-all shadow-sm"
          >
            {cta}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Tab Switcher ──────────────────────────────────────────────────────────────

function TabSwitcher({ active, onChange, counts }: {
  active: TabKey;
  onChange: (t: TabKey) => void;
  counts: Record<TabKey, number>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const activeBtn = container.querySelector(`[data-tab="${active}"]`) as HTMLElement;
    if (activeBtn) {
      setIndicatorStyle({
        left: activeBtn.offsetLeft,
        width: activeBtn.offsetWidth,
      });
    }
  }, [active]);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center bg-gray-100 rounded-full p-1 self-start"
    >
      {/* Animated pill indicator */}
      <div
        className="absolute top-1 bottom-1 bg-[#1B3FA0] rounded-full shadow-md transition-all duration-250 ease-in-out pointer-events-none"
        style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
      />

      {TABS.map((tab) => (
        <button
          key={tab.key}
          data-tab={tab.key}
          onClick={() => onChange(tab.key)}
          className={cn(
            "relative z-10 flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full text-[12.5px] sm:text-[13px] font-semibold transition-colors duration-200 select-none whitespace-nowrap",
            active === tab.key ? "text-white" : "text-gray-600 hover:text-gray-800"
          )}
        >
          {tab.icon}
          {tab.label}
          {counts[tab.key] > 0 && (
            <span className={cn(
              "text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none",
              active === tab.key ? "bg-white/25 text-white" : "bg-gray-200 text-gray-600"
            )}>
              {counts[tab.key]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function MyMemoriesPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("upcoming");
  const [loading, setLoading] = useState(true);
  const [managingBooking, setManagingBooking] = useState<Booking | null>(null);

  // Simulate loading
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  const counts: Record<TabKey, number> = {
    upcoming: MOCK_BOOKINGS.filter(b => b.status === "upcoming").length,
    completed: MOCK_BOOKINGS.filter(b => b.status === "completed").length,
    cancelled: MOCK_BOOKINGS.filter(b => b.status === "cancelled").length,
  };

  const filtered = MOCK_BOOKINGS.filter(b => b.status === activeTab);

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 mb-8 sm:mb-10">
          <h1 className="text-[28px] sm:text-[34px] font-extrabold text-gray-900 tracking-tight flex-shrink-0">
            My Memories
          </h1>
          <TabSwitcher active={activeTab} onChange={setActiveTab} counts={counts} />
        </div>

        {/* Content */}
        <div key={activeTab} className="animate-fade-in">
          {loading ? (
            <div className="flex flex-col gap-4">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState tab={activeTab} />
          ) : (
            <div className="flex flex-col gap-4">
              {filtered.map(booking => (
                <BookingCard key={booking.id} booking={booking} onManage={setManagingBooking} />
              ))}
            </div>
          )}
        </div>

        {/* Footer note */}
        {!loading && filtered.length > 0 && (
          <p className="text-center text-[12px] text-gray-400 mt-10">
            Showing {filtered.length} {activeTab} booking{filtered.length !== 1 ? "s" : ""}
          </p>
        )}
      </main>

      <Footer />

      {/* Manage Booking Modal */}
      {managingBooking && (
        <ManageBookingModal booking={managingBooking} onClose={() => setManagingBooking(null)} />
      )}

      {/* Keyframes */}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
        .animate-fade-in { animation: fadeIn 0.25s ease both; }
      `}</style>
    </div>
  );
}
