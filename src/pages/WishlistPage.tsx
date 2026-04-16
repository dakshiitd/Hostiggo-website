import { useState } from "react";
import { Heart, Star, ChevronDown, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import vacationIllustration from "@/assets/vacation-illustration.png";
import { cn } from "@/lib/utils";

interface WishlistProperty {
  id: string;
  name: string;
  location: string;
  city: string;
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
    city: "Noida",
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
    city: "Noida",
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
    city: "Noida",
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
    city: "Noida",
    rating: 4.3,
    reviews: 178,
    price: 7999,
    nights: 2,
    image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&h=450&fit=crop&q=80",
    liked: true,
  },
];

type FilterOption = "Recently viewed" | "Price: Low to high" | "Price: High to low" | "Top rated";
const FILTER_OPTIONS: FilterOption[] = ["Recently viewed", "Price: Low to high", "Price: High to low", "Top rated"];

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistProperty[]>(INITIAL_WISHLISTS);
  const [filter, setFilter] = useState<FilterOption>("Recently viewed");
  const [filterOpen, setFilterOpen] = useState(false);
  const navigate = useNavigate();

  const toggleHeart = (id: string) => {
    setItems(prev => prev.map(p => p.id === id ? { ...p, liked: !p.liked } : p));
  };

  const likedItems = items.filter(p => p.liked);

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto max-w-6xl px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <h1 className="text-[28px] sm:text-[32px] font-extrabold text-gray-900">My wishlists</h1>

          {/* Filter dropdown */}
          <div className="relative">
            <button
              onClick={() => setFilterOpen(v => !v)}
              className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 text-[13px] font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
            >
              {filter}
              <ChevronDown className={cn("w-4 h-4 text-gray-500 transition-transform", filterOpen && "rotate-180")} />
            </button>
            {filterOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-1 z-40 animate-fade-in-down">
                {FILTER_OPTIONS.map(opt => (
                  <button
                    key={opt}
                    onClick={() => { setFilter(opt); setFilterOpen(false); }}
                    className={cn(
                      "w-full text-left px-4 py-2.5 text-[13px] transition-colors",
                      opt === filter
                        ? "text-blue-600 font-semibold bg-blue-50/60"
                        : "text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Cards grid */}
        {likedItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-16">
            {likedItems.map((prop) => (
              <WishlistCard
                key={prop.id}
                property={prop}
                onToggleHeart={() => toggleHeart(prop.id)}
                onClick={() => navigate(`/property/${prop.id}`)}
              />
            ))}

            {/* Arrow nav button on last card */}
            <div className="hidden xl:flex items-center justify-center">
              <button className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 shadow-sm transition-colors">
                <ArrowRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">Your wishlist is empty.</p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Explore stays
            </button>
          </div>
        )}

        {/* End of list section */}
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 mt-4">
          <img
            src={vacationIllustration}
            alt="Vacation illustration"
            className="w-[160px] sm:w-[200px] object-contain"
          />
          <div>
            <h3 className="text-[22px] sm:text-[26px] font-bold text-gray-900 mb-1.5">End of list</h3>
            <p className="text-[15px] text-gray-500 leading-relaxed max-w-xs">
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
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative h-[200px] overflow-hidden">
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
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center hover:scale-110 transition-transform"
        >
          <Heart className={cn("w-4 h-4 transition-colors", property.liked ? "fill-rose-500 text-rose-500" : "text-gray-400")} />
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-[15px] font-bold text-gray-900 mb-0.5 line-clamp-1">{property.name}</h3>
        <p className="text-[12px] text-gray-500 mb-3">{property.location}</p>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="text-[13px] font-bold text-gray-700">{property.rating}</span>
          <span className="text-[12px] text-gray-400">· {property.reviews} reviews</span>
        </div>

        {/* Price badge */}
        <div className="inline-flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
          <span className="text-[13px] font-bold text-gray-900">₹ {property.price.toLocaleString("en-IN")}</span>
          <span className="text-[12px] text-gray-400">/ {property.nights} Nights</span>
        </div>
      </div>
    </div>
  );
}
