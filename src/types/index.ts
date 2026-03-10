export interface Destination {
  id: string;
  name: string;
  state: string;
  stayCount: number;
  imageUrl: string;
}

export interface GuestCount {
  adults: number;
  children: number;
  rooms: number;
  pets: boolean;
}

export interface Property {
  id: string;
  propertyName: string;
  city: string;
  state: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  amenities: string[];
  propertyType: string;
  images: string[];
  maxGuests: number;
  isFavorite?: boolean;
  isNew?: boolean;
  isInstantBook?: boolean;
  freeCancellation?: boolean;
  breakfast?: boolean;
  parking?: boolean;
  wifi?: boolean;
  ac?: boolean;
  pool?: boolean;
  kitchen?: boolean;
  balcony?: boolean;
  mountainView?: boolean;
  bedType?: string;
  description?: string;
  coordinates?: { lat: number; lng: number };
}

export interface SearchFilters {
  priceMin: number;
  priceMax: number;
  guestRating: number | null;
  propertyTypes: string[];
  amenities: string[];
  bedTypes: string[];
  freeCancellation: boolean;
  breakfast: boolean;
  parking: boolean;
  wifi: boolean;
  ac: boolean;
}

export type SortOption =
  | "recommended"
  | "price_asc"
  | "price_desc"
  | "top_rated"
  | "most_popular";

export interface SearchState {
  destination: string;
  checkIn: Date | null;
  checkOut: Date | null;
  guests: GuestCount;
}
