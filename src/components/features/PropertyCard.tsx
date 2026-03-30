import { useState } from "react";
import { Heart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Property } from "@/types";
import { cn } from "@/lib/utils";

interface PropertyCardProps {
  property: Property;
}

const FALLBACK = "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop&q=80";

export default function PropertyCard({ property }: PropertyCardProps) {
  const [liked, setLiked] = useState(property.isFavorite ?? false);
  const [imgErr, setImgErr] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className="card-base cursor-pointer group"
      onClick={() => navigate(`/property/${property.id}`)}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={imgErr ? FALLBACK : (property.images[0] || FALLBACK)}
          alt={property.propertyName}
          onError={() => setImgErr(true)}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Heart button - Top Right as per final image */}
        <button
          onClick={(e) => { e.stopPropagation(); setLiked(v => !v); }}
          aria-label={liked ? "Remove from favourites" : "Add to favourites"}
          className={cn(
            "absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm z-10",
            liked ? "bg-white text-rose-500" : "bg-white/90 text-gray-400 hover:text-rose-400"
          )}
        >
          <Heart className={cn("w-4 h-4", liked && "fill-rose-500")} />
        </button>
        {property.isNew && (
          <span className="absolute top-3 left-3 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide shadow z-10">NEW</span>
        )}
        <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Details */}
      <div className="p-4 pt-5 pb-6">
        <h3 className="text-[18px] font-bold text-gray-900 leading-tight line-clamp-1 mb-1 lowercase">{property.propertyName}</h3>
        <p className="text-[14px] text-gray-500 font-medium mb-4 line-clamp-1 lowercase">{property.city}, {property.state}</p>
        
        <div className="flex items-center gap-1.5 mb-6 text-gray-500">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400 flex-shrink-0" />
          <span className="text-[15px] font-bold text-gray-800">{property.rating.toFixed(1)}</span>
          <span className="text-gray-300 mx-0.5">•</span>
          <span className="text-[15px] font-medium text-gray-700">{property.reviewCount} reviews</span>
        </div>

        {/* Pricing Box - Edge-to-edge (Left-aligned) D-shape enclosure */}
        <div className="flex items-center">
          <div className="inline-flex items-center px-4 py-2 ml-[-16px] rounded-r-[14px] border-y border-r border-[#004772] bg-white whitespace-nowrap">
            <span className="text-[17px] font-bold text-gray-900 leading-none">₹ {property.price.toLocaleString("en-IN")}</span>
            <span className="text-[13.5px] text-gray-800 font-medium ml-1.5 flex-shrink-0">/ {(property as any).stayDuration || "2"} Nights</span>
          </div>
        </div>
      </div>
    </div>
  );
}
