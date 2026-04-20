import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, MapPin, Calendar, Clock, CheckCircle, XCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import memoriesIllustration from "@/assets/memories-illustration.png";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

type TabKey = "upcoming" | "completed" | "cancelled";

interface Trip {
  id: string;
  propertyName: string;
  location: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  price: number;
  rating?: number;
  image: string;
  status: TabKey;
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

const TRIPS: Record<TabKey, Trip[]> = {
  upcoming: [],
  completed: [],
  cancelled: [],
};

// ── Empty State Config ────────────────────────────────────────────────────────

const EMPTY_CONFIG: Record<TabKey, { heading: string; sub: string }> = {
  upcoming: {
    heading: "No upcoming trips yet,",
    sub: "Start planning your next stay or services.",
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

// ── Tab definition ────────────────────────────────────────────────────────────

const TABS: { key: TabKey; label: string }[] = [
  { key: "upcoming", label: "Upcoming" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

// ── Status Badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: TabKey }) {
  if (status === "upcoming")
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">
        <Clock className="w-3 h-3" />
        Upcoming
      </span>
    );
  if (status === "completed")
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
        <CheckCircle className="w-3 h-3" />
        Completed
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-500 bg-red-50 border border-red-100 px-2.5 py-1 rounded-full">
      <XCircle className="w-3 h-3" />
      Cancelled
    </span>
  );
}

// ── Trip Card ─────────────────────────────────────────────────────────────────

function TripCard({ trip }: { trip: Trip }) {
  const navigate = useNavigate();
  const FALLBACK = "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=450&fit=crop&q=80";
  const [imgErr, setImgErr] = useState(false);

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex gap-4 p-4 cursor-pointer group hover:shadow-md transition-all duration-200"
      style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}
      onClick={() => navigate(`/property/${trip.id}`)}
    >
      {/* Image */}
      <div className="w-[120px] h-[100px] flex-shrink-0 rounded-xl overflow-hidden">
        <img
          src={imgErr ? FALLBACK : trip.image}
          alt={trip.propertyName}
          onError={() => setImgErr(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-1.5">
          <h3 className="text-[15px] font-bold text-gray-900 leading-snug line-clamp-1">{trip.propertyName}</h3>
          <StatusBadge status={trip.status} />
        </div>

        <div className="flex items-center gap-1 text-[12px] text-gray-500 mb-2">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span>{trip.location}</span>
        </div>

        <div className="flex items-center gap-1 text-[12px] text-gray-500 mb-3">
          <Calendar className="w-3 h-3 flex-shrink-0" />
          <span>{trip.checkIn} → {trip.checkOut} · {trip.nights} nights</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[15px] font-extrabold text-[#1B3FA0]">₹ {trip.price.toLocaleString("en-IN")}</span>
          {trip.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-[12px] font-bold text-gray-700">{trip.rating}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────

function EmptyState({ tab }: { tab: TabKey }) {
  const navigate = useNavigate();
  const { heading, sub } = EMPTY_CONFIG[tab];

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 py-16 animate-fade-in">
      <img
        src={memoriesIllustration}
        alt="No trips illustration"
        className="w-[180px] sm:w-[220px] object-contain flex-shrink-0 drop-shadow-sm"
      />
      <div className="text-center sm:text-left max-w-xs">
        <h3 className="text-[22px] sm:text-[26px] font-extrabold italic text-gray-900 leading-tight mb-2">
          {heading}
        </h3>
        <p className="text-[14px] text-gray-500 leading-relaxed mb-6">{sub}</p>
        {tab === "upcoming" && (
          <button
            onClick={() => navigate("/")}
            className="bg-[#1B3FA0] text-white px-6 py-2.5 rounded-xl text-[14px] font-semibold hover:bg-[#162e82] transition-colors shadow-sm"
          >
            Explore stays
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function MyMemoriesPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("completed");
  const currentData = TRIPS[activeTab];

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-10">
          <h1 className="text-[30px] sm:text-[34px] font-extrabold text-gray-900 tracking-tight">
            My Memories
          </h1>

          {/* Segmented Tab Control */}
          <div className="flex items-center bg-gray-100 rounded-full p-1 gap-0 self-start sm:self-auto">
            {TABS.map((tab, i) => (
              <div key={tab.key} className="flex items-center">
                {/* Divider between inactive tabs */}
                {i > 0 && activeTab !== tab.key && activeTab !== TABS[i - 1].key && (
                  <div className="w-px h-4 bg-gray-300 flex-shrink-0" />
                )}

                <button
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "px-5 py-2 rounded-full text-[13px] font-semibold transition-all duration-200 select-none whitespace-nowrap",
                    activeTab === tab.key
                      ? "bg-[#1B3FA0] text-white shadow-md"
                      : "text-gray-700 hover:text-gray-900"
                  )}
                >
                  {tab.label}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div key={activeTab} className="animate-fade-in">
          {currentData.length === 0 ? (
            <EmptyState tab={activeTab} />
          ) : (
            <div className="flex flex-col gap-4">
              {currentData.map(trip => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
