import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PropertyCard from "@/components/features/PropertyCard";
import type { Property } from "@/types";

interface PopularStaysProps {
  title: string;
  properties: Property[];
}

export default function PopularStays({ title, properties }: PopularStaysProps) {
  const navigate = useNavigate();
  const city = properties[0]?.city ?? "";

  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-[22px] font-bold text-gray-900 lowercase">{title}</h2>
        <button
          onClick={() => navigate(`/search?destination=${encodeURIComponent(city)}`)}
          className="text-[14px] text-gray-500 hover:text-gray-700 bg-gray-100/80 hover:bg-gray-200 px-4 py-1.5 rounded-full transition-colors font-medium border border-gray-200"
        >
          View all
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {properties.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>
    </section>
  );
}
