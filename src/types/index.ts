export interface Property {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  pricePerNight: number;
  imageUrl: string;
  isFavorite?: boolean;
  isNew?: boolean;
  amenities?: string[];
}

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

export interface SearchParams {
  destination: string;
  checkIn: Date | null;
  checkOut: Date | null;
  guests: GuestCount;
}
