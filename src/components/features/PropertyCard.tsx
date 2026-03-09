import { useState } from "react";
import { Heart, Star } from "lucide-react";
import type { Property } from "@/types";
import { cn } from "@/lib/utils";

interface PropertyCardProps {
  property: Property;
}

const FALLBACK = "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop&q=80";

export default function PropertyCard({ property }: PropertyCardProps) {
  const [liked, setLiked] = useState(property.isFavorite ?? false);
  const [imgErr, setImgErr] = useState(false);

  return (
    <div className="card-base cursor-pointer group">
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: 170 }}>
        <img
          src={imgErr ? FALLBACK : property.imageUrl}
          alt={property.name}
          onError={() => setImgErr(true)}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Heart */}
        <button
          onClick={(e) => { e.stopPropagation(); setLiked((v) => !v); }}
          aria-label={liked ? "Remove from favourites" : "Add to favourites"}
          className={cn(
            "absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-md",
            liked ? "bg-rose-500 text-white" : "bg-white/90 text-gray-500 hover:text-rose-400"
          )}
        >
          <Heart className={cn("w-3.5 h-3.5", liked && "fill-white")} />
        </button>

        {/* NEW badge */}
        {property.isNew && (
          <span className="absolute top-2.5 left-2.5 bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wide shadow">
            NEW
          </span>
        )}

        {/* Gradient on image bottom */}
        <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Details */}
      <div className="p-3">
        <h3 className="text-[13px] font-semibold text-gray-800 leading-snug line-clamp-1 mb-0.5">
          {property.name}
        </h3>
        <p className="text-[11px] text-gray-400 mb-2 line-clamp-1">{property.location}</p>

        {/* Rating row */}
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400 flex-shrink-0" />
          <span className="text-[11px] font-bold text-gray-700">{property.rating.toFixed(2)}</span>
          <span className="text-[11px] text-gray-400">· {property.reviewCount} reviews</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1">
          <span className="text-[15px] font-extrabold text-gray-900">
            ₹{property.pricePerNight.toLocaleString("en-IN")}
          </span>
          <span className="text-[11px] text-gray-400 font-medium">/night</span>
        </div>
      </div>
    </div>
  );
}
