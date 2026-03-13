import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, X, Wifi, Car, Coffee, CheckCircle, Zap } from "lucide-react";
import type { Property } from "@/types";

interface InteractiveMapProps {
  properties: Property[];
  activeId?: string | null;
  onMarkerClick?: (id: string) => void;
  className?: string;
}

// City center coordinates fallback
const CITY_CENTERS: Record<string, [number, number]> = {
  "New Delhi": [28.6139, 77.2090],
  "Manali": [32.2396, 77.1887],
  "Shimla": [31.1048, 77.1734],
  "Jaipur": [26.9124, 75.7873],
  "Bangalore": [12.9716, 77.5946],
  "Rishikesh": [30.0869, 78.2676],
  "Goa": [15.2993, 74.1240],
  "Dharamshala": [32.2190, 76.3234],
  "Kasol": [32.0109, 77.3130],
  "Kolkata": [22.5726, 88.3639],
};

export default function InteractiveMap({ properties, activeId, onMarkerClick, className = "" }: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const navigate = useNavigate();

  // Determine center from properties
  const getCenter = (): [number, number] => {
    const withCoords = properties.filter(p => p.coordinates);
    if (withCoords.length === 0) return [22.5937, 78.9629]; // India center
    const lat = withCoords.reduce((sum, p) => sum + p.coordinates!.lat, 0) / withCoords.length;
    const lng = withCoords.reduce((sum, p) => sum + p.coordinates!.lng, 0) / withCoords.length;
    return [lat, lng];
  };

  const getZoom = (): number => {
    const cities = new Set(properties.map(p => p.city));
    if (cities.size === 1) return 13;
    if (cities.size <= 3) return 10;
    return 5;
  };

  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    // Dynamically load Leaflet CSS
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    // Dynamically load Leaflet JS
    const loadLeaflet = async () => {
      if ((window as any).L) {
        initMap((window as any).L);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = () => {
        initMap((window as any).L);
      };
      document.head.appendChild(script);
    };

    loadLeaflet();

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  const initMap = (L: any) => {
    if (!mapRef.current || leafletMapRef.current) return;

    const center = getCenter();
    const map = L.map(mapRef.current, {
      center,
      zoom: getZoom(),
      zoomControl: false,
      attributionControl: false,
    });

    // Add tile layer (OpenStreetMap - free, no API key)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    // Add zoom control in bottom-right
    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Add attribution in bottom-left
    L.control.attribution({ position: "bottomleft", prefix: "© OpenStreetMap" }).addTo(map);

    leafletMapRef.current = map;
    setMapLoaded(true);

    // Add markers after map is ready
    addMarkers(L, map, properties);
  };

  const createPriceIcon = (L: any, property: Property, isActive: boolean) => {
    const price = `₹${Math.round(property.price / 1000)}k`;
    return L.divIcon({
      className: "",
      html: `
        <div style="
          background: ${isActive ? "#1d4ed8" : "#2563eb"};
          color: white;
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
          box-shadow: ${isActive ? "0 4px 16px rgba(29,78,216,0.5)" : "0 2px 8px rgba(37,99,235,0.35)"};
          transform: ${isActive ? "scale(1.15)" : "scale(1)"};
          transition: all 0.2s ease;
          border: ${isActive ? "2.5px solid white" : "2px solid rgba(255,255,255,0.6)"};
          cursor: pointer;
          position: relative;
          font-family: 'Inter', sans-serif;
        ">
          ${price}
          <div style="
            position: absolute;
            bottom: -6px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-top: 6px solid ${isActive ? "#1d4ed8" : "#2563eb"};
          "></div>
        </div>
      `,
      iconSize: [null as any, null as any],
      iconAnchor: [30, 30],
    });
  };

  const addMarkers = (L: any, map: any, props: Property[]) => {
    // Remove existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current.clear();

    props.forEach(property => {
      if (!property.coordinates) return;

      const { lat, lng } = property.coordinates;
      const marker = L.marker([lat, lng], {
        icon: createPriceIcon(L, property, false),
      }).addTo(map);

      marker.on("click", () => {
        setSelectedProperty(property);
        if (onMarkerClick) onMarkerClick(property.id);
        // Update all marker icons
        markersRef.current.forEach((m, id) => {
          m.setIcon(createPriceIcon(L, props.find(p => p.id === id)!, id === property.id));
        });
      });

      markersRef.current.set(property.id, marker);
    });
  };

  // Re-add markers when properties change
  useEffect(() => {
    if (!leafletMapRef.current || !mapLoaded) return;
    const L = (window as any).L;
    if (!L) return;

    addMarkers(L, leafletMapRef.current, properties);

    // Refit bounds
    if (properties.length > 0) {
      const withCoords = properties.filter(p => p.coordinates);
      if (withCoords.length > 1) {
        const bounds = L.latLngBounds(withCoords.map(p => [p.coordinates!.lat, p.coordinates!.lng]));
        leafletMapRef.current.fitBounds(bounds, { padding: [40, 40] });
      } else if (withCoords.length === 1) {
        leafletMapRef.current.setView(
          [withCoords[0].coordinates!.lat, withCoords[0].coordinates!.lng],
          13
        );
      }
    }
  }, [properties, mapLoaded]);

  // Highlight active marker from list hover
  useEffect(() => {
    if (!mapLoaded) return;
    const L = (window as any).L;
    if (!L) return;
    markersRef.current.forEach((marker, id) => {
      const prop = properties.find(p => p.id === id);
      if (prop) marker.setIcon(createPriceIcon(L, prop, id === activeId));
    });
  }, [activeId, mapLoaded, properties]);

  return (
    <div className={`relative ${className}`}>
      {/* Map container */}
      <div ref={mapRef} className="w-full h-full rounded-2xl overflow-hidden" style={{ minHeight: 400 }} />

      {/* Loading overlay */}
      {!mapLoaded && (
        <div className="absolute inset-0 bg-blue-50 rounded-2xl flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" style={{ borderWidth: 3 }} />
            <p className="text-sm font-semibold text-blue-600">Loading map…</p>
          </div>
        </div>
      )}

      {/* Property popup card */}
      {selectedProperty && (
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] w-[300px] bg-white rounded-2xl overflow-hidden"
          style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.18)" }}
        >
          {/* Image */}
          <div className="relative h-36">
            <img
              src={selectedProperty.images[0]}
              alt={selectedProperty.propertyName}
              className="w-full h-full object-cover"
            />
            <button
              onClick={(e) => { e.stopPropagation(); setSelectedProperty(null); }}
              className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
            >
              <X className="w-3.5 h-3.5 text-gray-600" />
            </button>
            {selectedProperty.originalPrice && (
              <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                -{Math.round(((selectedProperty.originalPrice - selectedProperty.price) / selectedProperty.originalPrice) * 100)}% OFF
              </div>
            )}
          </div>
          {/* Info */}
          <div className="p-3">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full">{selectedProperty.propertyType}</span>
                <h4 className="text-[13px] font-bold text-gray-800 leading-snug mt-0.5 line-clamp-1">{selectedProperty.propertyName}</h4>
                <p className="text-[11px] text-gray-400">{selectedProperty.city}, {selectedProperty.state}</p>
              </div>
              <div className="text-right flex-shrink-0">
                {selectedProperty.originalPrice && (
                  <p className="text-[10px] text-gray-400 line-through">₹{selectedProperty.originalPrice.toLocaleString("en-IN")}</p>
                )}
                <p className="text-[16px] font-extrabold text-blue-700 leading-none">₹{selectedProperty.price.toLocaleString("en-IN")}</p>
                <p className="text-[9px] text-gray-400 font-medium">per night</p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-2.5">
              <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 rounded-lg px-1.5 py-0.5">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span className="text-[11px] font-bold text-amber-700">{selectedProperty.rating.toFixed(1)}</span>
              </div>
              <span className="text-[11px] text-gray-400">{selectedProperty.reviewCount} reviews</span>
              {selectedProperty.freeCancellation && (
                <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5">
                  <CheckCircle className="w-2.5 h-2.5" /> Free cancel
                </span>
              )}
            </div>

            {/* Amenities */}
            <div className="flex gap-1.5 flex-wrap mb-3">
              {selectedProperty.amenities.slice(0, 3).map(am => (
                <span key={am} className="text-[10px] text-gray-500 bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded-full">{am}</span>
              ))}
            </div>

            <button
              onClick={() => navigate(`/property/${selectedProperty.id}`)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-[12px] font-semibold transition-colors"
            >
              View Details
            </button>
          </div>
        </div>
      )}

      {/* Property count badge */}
      {mapLoaded && (
        <div className="absolute top-3 left-3 z-[999] bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 text-[12px] font-semibold text-gray-700" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
          {properties.filter(p => p.coordinates).length} properties on map
        </div>
      )}
    </div>
  );
}
