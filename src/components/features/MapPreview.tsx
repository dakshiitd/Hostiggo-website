import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";

interface MapPreviewProps {
  city?: string;
  count?: number;
  coordinates?: { lat: number; lng: number };
}

export default function MapPreview({ city = "New Delhi", count = 0, coordinates }: MapPreviewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // City center fallback
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

  const getCenter = (): [number, number] => {
    if (coordinates) return [coordinates.lat, coordinates.lng];
    for (const [name, coords] of Object.entries(CITY_CENTERS)) {
      if (city.toLowerCase().includes(name.toLowerCase())) return coords;
    }
    return [22.5937, 78.9629]; // India center
  };

  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    // Load Leaflet CSS
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    const loadLeaflet = () => {
      if ((window as any).L) {
        initMap((window as any).L);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = () => initMap((window as any).L);
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
      zoom: 11,
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    // Center marker
    const icon = L.divIcon({
      className: "",
      html: `<div style="background:#2563eb;width:12px;height:12px;border-radius:50%;border:2.5px solid white;box-shadow:0 2px 6px rgba(37,99,235,0.5)"></div>`,
      iconSize: [12, 12],
      iconAnchor: [6, 6],
    });
    L.marker(center, { icon }).addTo(map);

    leafletMapRef.current = map;
    setMapLoaded(true);
  };

  // Update map center when city changes
  useEffect(() => {
    if (!leafletMapRef.current || !mapLoaded) return;
    const center = getCenter();
    leafletMapRef.current.setView(center, 11);
  }, [city, coordinates, mapLoaded]);

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-100 relative" style={{ height: 160 }}>
      <div ref={mapRef} className="w-full h-full" />

      {!mapLoaded && (
        <div className="absolute inset-0 bg-blue-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-1.5" />
            <p className="text-[11px] text-blue-500 font-medium">Loading…</p>
          </div>
        </div>
      )}

      {/* Overlay label */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-white/90 to-transparent py-2 px-3 pointer-events-none">
        <p className="text-[11px] font-semibold text-gray-600 flex items-center gap-1">
          <MapPin className="w-3 h-3 text-blue-500" />
          {city} · {count} properties
        </p>
      </div>
    </div>
  );
}
