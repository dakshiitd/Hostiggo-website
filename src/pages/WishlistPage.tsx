import { useState, useRef, useEffect } from "react";
import { Heart, Star, ChevronDown, ArrowRight, Plus, Edit2, Check, List, Home, Wrench, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import vacationIllustration from "@/assets/vacation-illustration.png";
import { cn } from "@/lib/utils";

interface WishlistProperty {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  price: number;
  nights: number;
  image: string;
  liked: boolean;
}

const INITIAL_WISHLISTS: WishlistProperty[] = [
  {
    id: "w1",
    name: "ree ezz residency",
    location: "Noida, delhi",
    rating: 3.5,
    reviews: 512,
    price: 4500,
    nights: 2,
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=450&fit=crop&q=80",
    liked: true,
  },
  {
    id: "w2",
    name: "gulu mulu homestay",
    location: "Noida, delhi",
    rating: 4.3,
    reviews: 178,
    price: 7999,
    nights: 2,
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&h=450&fit=crop&q=80",
    liked: true,
  },
  {
    id: "w3",
    name: "ree ezz residency",
    location: "Noida, delhi",
    rating: 3.5,
    reviews: 512,
    price: 4500,
    nights: 2,
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&h=450&fit=crop&q=80",
    liked: true,
  },
  {
    id: "w4",
    name: "gulu mulu homestay",
    location: "Noida, delhi",
    rating: 4.3,
    reviews: 178,
    price: 7999,
    nights: 2,
    image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&h=450&fit=crop&q=80",
    liked: true,
  },
  {
    id: "w5",
    name: "the cozy loft stay",
    location: "Gurugram, delhi",
    rating: 4.1,
    reviews: 234,
    price: 5800,
    nights: 2,
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=450&fit=crop&q=80",
    liked: true,
  },
];

type FilterOption = {
  value: string;
  label: string;
  icon: React.ReactNode;
};

const FILTER_OPTIONS: FilterOption[] = [
  { value: "recently_viewed", label: "Recently viewed", icon: <Clock className="w-3.5 h-3.5" /> },
  { value: "all", label: "All", icon: <List className="w-3.5 h-3.5" /> },
  { value: "homestays", label: "Homestays", icon: <Home className="w-3.5 h-3.5" /> },
  { value: "services", label: "Services", icon: <Wrench className="w-3.5 h-3.5" /> },
];

function FilterDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = FILTER_OPTIONS.find(o => o.value === value) ?? FILTER_OPTIONS[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className={cn(
          "flex items-center gap-2 border rounded-full px-4 py-2 text-[13px] font-semibold bg-white transition-all duration-200 select-none",
          open
            ? "border-gray-800 text-gray-900 shadow-md"
            : "border-gray-300 text-gray-700 hover:border-gray-400 hover:shadow-sm"
        )}
      >
        <span className="w-4 h-4 text-gray-400 flex-shrink-0">{current.icon}</span>
        {current.label}
        <ChevronDown
          className={cn(
            "w-4 h-4 text-gray-500 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+6px)] w-[190px] bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-fade-in-down overflow-hidden">
          {FILTER_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={cn(
                "w-full flex items-center justify-between gap-3 px-4 py-2.5 text-[13px] transition-colors duration-150 group",
                opt.value === value
                  ? "text-gray-900 font-semibold bg-gray-50"
                  : "text-gray-600 font-medium hover:bg-gray-50 hover:text-gray-800"
              )}
            >
              <span className="flex items-center gap-2.5">
                <span className={cn("transition-colors", opt.value === value ? "text-blue-600" : "text-gray-400 group-hover:text-gray-500")}>
                  {opt.icon}
                </span>
                {opt.label}
              </span>
              {opt.value === value && (
                <Check className="w-4 h-4 text-blue-600 flex-shrink-0" strokeWidth={2.5} />
              )}
            </button>
          ))}

          {/* Divider */}
          <div className="h-px bg-gray-100 my-1.5 mx-3" />

          {/* Manage Lists */}
          <button
            onClick={() => { setOpen(false); }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors duration-150"
          >
            <List className="w-3.5 h-3.5 text-gray-400" />
            Manage Lists
          </button>
        </div>
      )}
    </div>
  );
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistProperty[]>(INITIAL_WISHLISTS);
  const [filter, setFilter] = useState("recently_viewed");
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const toggleHeart = (id: string) => {
    setItems(prev => prev.map(p => p.id === id ? { ...p, liked: !p.liked } : p));
  };

  const likedItems = items.filter(p => p.liked);

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 260, behavior: "smooth" });
    }
  };

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      checkScroll();
      return () => el.removeEventListener("scroll", checkScroll);
    }
  }, [likedItems]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <h1 className="text-[30px] sm:text-[34px] font-extrabold text-gray-900 mb-6 tracking-tight">
          My wishlists
        </h1>

        {/* Controls row */}
        <div className="flex items-center gap-3 mb-8">
          {/* List filter icon */}
          <button className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm">
            <List className="w-4 h-4" />
          </button>

          {/* Dropdown */}
          <FilterDropdown value={filter} onChange={setFilter} />

          {/* Add new list */}
          <button className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm">
            <Plus className="w-4 h-4" />
          </button>

          {/* Edit button — right side */}
          <div className="ml-auto flex items-center gap-1.5 text-[13px] font-semibold text-gray-600 cursor-pointer hover:text-gray-900 transition-colors">
            <span>Edit</span>
            <Edit2 className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Cards — horizontal scroll row */}
        {likedItems.length > 0 ? (
          <div className="relative mb-14">
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory"
              style={{ scrollPaddingLeft: "0px" }}
            >
              {likedItems.map(prop => (
                <div key={prop.id} className="flex-shrink-0 snap-start" style={{ width: "220px" }}>
                  <WishlistCard
                    property={prop}
                    onToggleHeart={() => toggleHeart(prop.id)}
                    onClick={() => navigate(`/property/${prop.id}`)}
                  />
                </div>
              ))}

              {/* Spacer to allow last card to fully scroll into view */}
              <div className="flex-shrink-0 w-2" />
            </div>

            {/* Right scroll arrow */}
            {canScrollRight && (
              <button
                onClick={scrollRight}
                className="absolute right-0 top-[90px] -translate-y-1/2 w-9 h-9 rounded-full border border-gray-200 bg-white shadow-md flex items-center justify-center hover:shadow-lg hover:scale-105 transition-all duration-200 z-10"
              >
                <ArrowRight className="w-4 h-4 text-gray-600" />
              </button>
            )}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">❤️</div>
            <p className="text-gray-400 text-lg font-medium mb-1">Your wishlist is empty</p>
            <p className="text-gray-400 text-sm mb-6">Start exploring and save your favourite stays.</p>
            <button
              onClick={() => navigate("/")}
              className="bg-[#1B3FA0] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#162e82] transition-colors shadow-sm"
            >
              Explore stays
            </button>
          </div>
        )}

        {/* End of list section */}
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-12 pt-4 pb-6">
          <img
            src={vacationIllustration}
            alt="Vacation illustration"
            className="w-[140px] sm:w-[175px] object-contain flex-shrink-0 drop-shadow-sm"
          />
          <div className="text-center sm:text-left">
            <h3 className="text-[24px] sm:text-[28px] font-bold text-gray-900 mb-2 leading-tight">
              End of list
            </h3>
            <p className="text-[15px] text-gray-500 leading-relaxed max-w-[280px]">
              Stay where comfort becomes an experience.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

interface WishlistCardProps {
  property: WishlistProperty;
  onToggleHeart: () => void;
  onClick: () => void;
}

function WishlistCard({ property, onToggleHeart, onClick }: WishlistCardProps) {
  const [imgErr, setImgErr] = useState(false);
  const FALLBACK = "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=450&fit=crop&q=80";

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 cursor-pointer group transition-all duration-250 hover:shadow-lg hover:-translate-y-0.5"
      style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.07)" }}
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: "160px" }}>
        <img
          src={imgErr ? FALLBACK : property.image}
          alt={property.name}
          onError={() => setImgErr(true)}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Heart */}
        <button
          onClick={e => { e.stopPropagation(); onToggleHeart(); }}
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-150"
        >
          <Heart
            className={cn(
              "w-3.5 h-3.5 transition-colors duration-200",
              property.liked ? "fill-rose-500 text-rose-500" : "text-gray-400 fill-transparent"
            )}
          />
        </button>
      </div>

      {/* Info */}
      <div className="p-3.5">
        <h3 className="text-[13px] font-bold text-gray-900 mb-0.5 leading-snug line-clamp-1">
          {property.name}
        </h3>
        <p className="text-[11.5px] text-gray-400 mb-2.5 leading-none">{property.location}</p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400 flex-shrink-0" />
          <span className="text-[12px] font-bold text-gray-700">{property.rating}</span>
          <span className="text-[11px] text-gray-400">· {property.reviews} reviews</span>
        </div>

        {/* Price */}
        <div className="inline-flex items-center gap-1 bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1">
          <span className="text-[12px] font-extrabold text-gray-900">
            ₹ {property.price.toLocaleString("en-IN")}
          </span>
          <span className="text-[11px] text-gray-400">/ {property.nights} Nights</span>
        </div>
      </div>
    </div>
  );
}
