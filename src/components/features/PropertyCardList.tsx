import { useState } from "react";
import { Heart, Star, Wifi, Car, Coffee, Zap, Droplets, UtensilsCrossed, CheckCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Property } from "@/types";
import { cn } from "@/lib/utils";

interface PropertyCardListProps {
  property: Property;
}

const FALLBACK = "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop&q=80";

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  "WiFi": <Wifi className="w-3 h-3" />,
  "Parking": <Car className="w-3 h-3" />,
  "Breakfast": <Coffee className="w-3 h-3" />,
  "AC": <Zap className="w-3 h-3" />,
  "Pool": <Droplets className="w-3 h-3" />,
  "Kitchen": <UtensilsCrossed className="w-3 h-3" />,
};

export default function PropertyCardList({ property }: PropertyCardListProps) {
  const [liked, setLiked] = useState(property.isFavorite ?? false);
  const [imgErr, setImgErr] = useState(false);
  const navigate = useNavigate();

  const discount = property.originalPrice
    ? Math.round(((property.originalPrice - property.price) / property.originalPrice) * 100)
    : null;

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden flex cursor-pointer group transition-all duration-200 hover:-translate-y-0.5"
      style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.07), 0 0 1px rgba(0,0,0,0.04)" }}
      onClick={() => navigate(`/property/${property.id}`)}
    >
      {/* Image */}
      <div className="relative flex-shrink-0 w-48 sm:w-56" style={{ minHeight: 160 }}>
        <img
          src={imgErr ? FALLBACK : (property.images[0] || FALLBACK)}
          alt={property.propertyName}
          onError={() => setImgErr(true)}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Heart */}
        <button
          onClick={(e) => { e.stopPropagation(); setLiked(v => !v); }}
          className={cn(
            "absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-md",
            liked ? "bg-rose-500 text-white" : "bg-white/90 text-gray-500 hover:text-rose-400"
          )}
        >
          <Heart className={cn("w-3.5 h-3.5", liked && "fill-white")} />
        </button>
        {/* NEW badge */}
        {property.isNew && (
          <span className="absolute top-2.5 left-2.5 bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wide shadow">NEW</span>
        )}
        {/* Discount */}
        {discount && discount > 0 && (
          <div className="absolute bottom-2.5 left-2.5 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
            -{discount}%
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{property.propertyType}</span>
            </div>
            <h3 className="text-[14px] font-bold text-gray-800 leading-snug line-clamp-1">{property.propertyName}</h3>
            <p className="text-[12px] text-gray-400 mt-0.5 line-clamp-1">{property.city}, {property.state}</p>
          </div>

          {/* Price */}
          <div className="flex-shrink-0 text-right">
            {property.originalPrice && (
              <p className="text-[11px] text-gray-400 line-through">₹{property.originalPrice.toLocaleString("en-IN")}</p>
            )}
            <p className="text-[18px] font-extrabold text-blue-700 leading-none">
              ₹{property.price.toLocaleString("en-IN")}
            </p>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">per night</p>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 rounded-lg px-2 py-0.5">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span className="text-[12px] font-bold text-amber-700">{property.rating.toFixed(1)}</span>
          </div>
          <span className="text-[11px] text-gray-500">{property.reviewCount} reviews</span>
          {property.freeCancellation && (
            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle className="w-2.5 h-2.5" />
              Free cancel
            </span>
          )}
          {property.isInstantBook && (
            <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Zap className="w-2.5 h-2.5" />
              Instant
            </span>
          )}
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {property.amenities.slice(0, 4).map(am => (
            <span key={am} className="flex items-center gap-1 text-[11px] text-gray-500 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
              {AMENITY_ICONS[am] ?? null}
              {am}
            </span>
          ))}
          {property.amenities.length > 4 && (
            <span className="text-[11px] text-gray-400 font-medium">+{property.amenities.length - 4} more</span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-auto flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/property/${property.id}`); }}
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 py-2 rounded-xl text-[12px] font-semibold transition-colors shadow-sm"
          >
            View Details
          </button>
          {property.breakfast && (
            <span className="text-[11px] text-gray-500 flex items-center gap-1">
              <Coffee className="w-3 h-3 text-amber-500" /> Breakfast included
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
