import type { Destination, Property } from "@/types";

export const SUGGESTED_DESTINATIONS: Destination[] = [
  { id: "1", name: "New Delhi", state: "Delhi", stayCount: 12060, imageUrl: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=96&h=96&fit=crop&q=80" },
  { id: "2", name: "Manali", state: "Himachal Pradesh", stayCount: 4320, imageUrl: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=96&h=96&fit=crop&q=80" },
  { id: "3", name: "Jaipur", state: "Rajasthan", stayCount: 8900, imageUrl: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=96&h=96&fit=crop&q=80" },
  { id: "4", name: "Kolkata", state: "West Bengal", stayCount: 6200, imageUrl: "https://images.unsplash.com/photo-1558431382-27e303142255?w=96&h=96&fit=crop&q=80" },
  { id: "5", name: "Uttarakhand", state: "Uttarakhand", stayCount: 7410, imageUrl: "https://images.unsplash.com/photo-1609766857843-3b3673b36a8e?w=96&h=96&fit=crop&q=80" },
  { id: "6", name: "Bangalore", state: "Karnataka", stayCount: 10800, imageUrl: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=96&h=96&fit=crop&q=80" },
  { id: "7", name: "Guwahati", state: "Assam", stayCount: 2870, imageUrl: "https://images.unsplash.com/photo-1548013146-72479768bada?w=96&h=96&fit=crop&q=80" },
  { id: "8", name: "Shimla", state: "Himachal Pradesh", stayCount: 5530, imageUrl: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=96&h=96&fit=crop&q=80" },
];

export const POPULAR_FILTERS = [
  { id: "1000-2000", label: "₹1000 - 2000" },
  { id: "free-breakfast", label: "Free breakfast" },
  { id: "couple-friendly", label: "Couple friendly" },
  { id: "pet-friendly", label: "Pet friendly" },
  { id: "family-friendly", label: "Family friendly" },
];

export const PROPERTY_IMAGES = {
  room1: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop&q=80",
  room2: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&h=400&fit=crop&q=80",
  room3: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&h=400&fit=crop&q=80",
  room4: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop&q=80",
  room5: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=400&fit=crop&q=80",
  room6: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&h=400&fit=crop&q=80",
  room7: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600&h=400&fit=crop&q=80",
  room8: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&h=400&fit=crop&q=80",
  room9: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=400&fit=crop&q=80",
  room10: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&h=400&fit=crop&q=80",
};

const img = (key: keyof typeof PROPERTY_IMAGES) => PROPERTY_IMAGES[key];

export const ALL_PROPERTIES: Property[] = [
  // ── New Delhi ──
  {
    id: "p1", propertyName: "Triply Stone House Cottages Homestay", city: "New Delhi", state: "Delhi",
    price: 26700, originalPrice: 32000, rating: 4.7, reviewCount: 112,
    amenities: ["WiFi", "Parking", "Kitchen", "AC"], propertyType: "Homestay",
    images: [img("room1"), img("room2"), img("room3")], maxGuests: 4,
    isInstantBook: true, freeCancellation: true, breakfast: true, wifi: true, ac: true, parking: true,
    bedType: "King bed", isFavorite: true,
    description: "A beautifully designed homestay in the heart of New Delhi, offering premium amenities and a warm, homely atmosphere.",
  },
  {
    id: "p2", propertyName: "Triply Stone House Cottages Homestay", city: "New Delhi", state: "Delhi",
    price: 26700, rating: 4.3, reviewCount: 98,
    amenities: ["WiFi", "Kitchen", "Balcony"], propertyType: "Apartment",
    images: [img("room2"), img("room3"), img("room1")], maxGuests: 3,
    isInstantBook: false, freeCancellation: true, wifi: true, breakfast: false,
    bedType: "Double bed",
    description: "Modern apartment with all amenities in South Delhi.",
  },
  {
    id: "p3", propertyName: "Triply Stone House Cottages Homestay", city: "New Delhi", state: "Delhi",
    price: 26700, originalPrice: 30000, rating: 4.5, reviewCount: 76,
    amenities: ["WiFi", "AC", "Parking", "Pool"], propertyType: "Villa",
    images: [img("room3"), img("room1"), img("room2")], maxGuests: 6,
    isInstantBook: true, freeCancellation: false, breakfast: true, wifi: true, ac: true, pool: true,
    bedType: "Queen bed",
    description: "Luxurious villa with private pool in Greater Kailash.",
  },
  {
    id: "p4", propertyName: "Triply Stone House Cottages Homestay", city: "New Delhi", state: "Delhi",
    price: 26700, rating: 4.1, reviewCount: 54,
    amenities: ["WiFi", "Kitchen"], propertyType: "Homestay",
    images: [img("room4"), img("room5"), img("room6")], maxGuests: 2,
    isInstantBook: false, freeCancellation: true, wifi: true,
    bedType: "Single bed",
  },
  {
    id: "p5", propertyName: "Triply Stone House Cottages Homestay", city: "New Delhi", state: "Delhi",
    price: 26700, originalPrice: 28000, rating: 4.6, reviewCount: 143,
    amenities: ["WiFi", "AC", "Kitchen", "Balcony"], propertyType: "Apartment",
    images: [img("room5"), img("room6"), img("room7")], maxGuests: 4,
    isInstantBook: true, freeCancellation: true, breakfast: true, wifi: true, ac: true,
    bedType: "King bed",
  },
  {
    id: "p6", propertyName: "Triply Stone House Cottages Homestay", city: "New Delhi", state: "Delhi",
    price: 26700, rating: 4.4, reviewCount: 87,
    amenities: ["WiFi", "Parking", "AC"], propertyType: "Homestay",
    images: [img("room6"), img("room7"), img("room8")], maxGuests: 3,
    isInstantBook: false, freeCancellation: false, wifi: true, ac: true, parking: true,
    bedType: "Double bed",
  },
  {
    id: "p7", propertyName: "Triply Stone House Cottages Homestay", city: "New Delhi", state: "Delhi",
    price: 26700, originalPrice: 31000, rating: 4.8, reviewCount: 201,
    amenities: ["WiFi", "Pool", "Kitchen", "AC", "Parking"], propertyType: "Villa",
    images: [img("room7"), img("room8"), img("room9")], maxGuests: 8,
    isInstantBook: true, freeCancellation: true, breakfast: true, wifi: true, ac: true, pool: true, parking: true,
    bedType: "King bed",
  },
  {
    id: "p8", propertyName: "Triply Stone House Cottages Homestay", city: "New Delhi", state: "Delhi",
    price: 26700, rating: 4.2, reviewCount: 61,
    amenities: ["WiFi", "Kitchen"], propertyType: "Cottage",
    images: [img("room8"), img("room9"), img("room10")], maxGuests: 2,
    isInstantBook: false, freeCancellation: true, wifi: true,
    bedType: "Queen bed",
  },
  // ── Manali ──
  {
    id: "m1", propertyName: "Triply Stone House Cottages Homestay", city: "Manali", state: "Himachal Pradesh",
    price: 26700, originalPrice: 35000, rating: 4.7, reviewCount: 156,
    amenities: ["WiFi", "Mountain View", "Balcony", "Kitchen"], propertyType: "Cottage",
    images: [img("room1"), img("room5"), img("room9")], maxGuests: 4,
    isInstantBook: true, freeCancellation: true, breakfast: true, wifi: true, mountainView: true, balcony: true, kitchen: true,
    bedType: "Double bed",
    description: "Beautiful mountain cottage with stunning Himalayan views.",
  },
  {
    id: "m2", propertyName: "Triply Stone House Cottages Homestay", city: "Manali", state: "Himachal Pradesh",
    price: 26700, rating: 4.5, reviewCount: 89,
    amenities: ["WiFi", "Kitchen", "Mountain View"], propertyType: "Homestay",
    images: [img("room2"), img("room6"), img("room10")], maxGuests: 3,
    isInstantBook: false, freeCancellation: true, wifi: true, mountainView: true,
    bedType: "King bed",
  },
  {
    id: "m3", propertyName: "Triply Stone House Cottages Homestay", city: "Manali", state: "Himachal Pradesh",
    price: 26700, originalPrice: 40000, rating: 4.9, reviewCount: 234,
    amenities: ["WiFi", "Mountain View", "Pool", "Balcony", "Kitchen"], propertyType: "Villa",
    images: [img("room3"), img("room7"), img("room1")], maxGuests: 8,
    isInstantBook: true, freeCancellation: true, breakfast: true, wifi: true, pool: true, mountainView: true, balcony: true,
    bedType: "Queen bed",
  },
  // ── Shimla ──
  {
    id: "s1", propertyName: "Triply Stone House Cottages Homestay", city: "Shimla", state: "Himachal Pradesh",
    price: 26700, originalPrice: 29000, rating: 4.6, reviewCount: 102,
    amenities: ["WiFi", "Balcony", "Mountain View"], propertyType: "Homestay",
    images: [img("room4"), img("room8"), img("room2")], maxGuests: 4,
    isInstantBook: true, freeCancellation: true, wifi: true, mountainView: true, balcony: true,
    bedType: "Double bed",
  },
  {
    id: "s2", propertyName: "Triply Stone House Cottages Homestay", city: "Shimla", state: "Himachal Pradesh",
    price: 26700, rating: 4.4, reviewCount: 78,
    amenities: ["WiFi", "Kitchen", "Parking"], propertyType: "Cottage",
    images: [img("room5"), img("room9"), img("room3")], maxGuests: 3,
    isInstantBook: false, freeCancellation: true, wifi: true, parking: true,
    bedType: "King bed",
  },
  // ── Jaipur ──
  {
    id: "j1", propertyName: "Triply Stone House Cottages Homestay", city: "Jaipur", state: "Rajasthan",
    price: 26700, originalPrice: 34000, rating: 4.8, reviewCount: 178,
    amenities: ["WiFi", "Pool", "AC", "Kitchen", "Parking"], propertyType: "Resort",
    images: [img("room6"), img("room10"), img("room4")], maxGuests: 6,
    isInstantBook: true, freeCancellation: true, breakfast: true, wifi: true, ac: true, pool: true, parking: true,
    bedType: "King bed",
  },
  {
    id: "j2", propertyName: "Triply Stone House Cottages Homestay", city: "Jaipur", state: "Rajasthan",
    price: 26700, rating: 4.3, reviewCount: 65,
    amenities: ["WiFi", "AC", "Balcony"], propertyType: "Homestay",
    images: [img("room7"), img("room1"), img("room5")], maxGuests: 3,
    isInstantBook: false, freeCancellation: true, wifi: true, ac: true, balcony: true,
    bedType: "Double bed",
  },
  // ── Bangalore ──
  {
    id: "b1", propertyName: "Triply Stone House Cottages Homestay", city: "Bangalore", state: "Karnataka",
    price: 26700, originalPrice: 28000, rating: 4.5, reviewCount: 134,
    amenities: ["WiFi", "AC", "Parking", "Kitchen"], propertyType: "Apartment",
    images: [img("room8"), img("room2"), img("room6")], maxGuests: 4,
    isInstantBook: true, freeCancellation: false, wifi: true, ac: true, parking: true, kitchen: true,
    bedType: "Queen bed",
  },
  {
    id: "b2", propertyName: "Triply Stone House Cottages Homestay", city: "Bangalore", state: "Karnataka",
    price: 26700, rating: 4.6, reviewCount: 99,
    amenities: ["WiFi", "AC", "Pool", "Balcony"], propertyType: "Villa",
    images: [img("room9"), img("room3"), img("room7")], maxGuests: 5,
    isInstantBook: true, freeCancellation: true, breakfast: true, wifi: true, ac: true, pool: true, balcony: true,
    bedType: "King bed",
  },
  // ── Rishikesh ──
  {
    id: "r1", propertyName: "Triply Stone House Cottages Homestay", city: "Rishikesh", state: "Uttarakhand",
    price: 26700, originalPrice: 22000, rating: 4.4, reviewCount: 88,
    amenities: ["WiFi", "Mountain View", "Balcony"], propertyType: "Cottage",
    images: [img("room10"), img("room4"), img("room8")], maxGuests: 2,
    isInstantBook: false, freeCancellation: true, wifi: true, mountainView: true, balcony: true,
    bedType: "Double bed",
  },
  // ── Goa ──
  {
    id: "g1", propertyName: "Triply Stone House Cottages Homestay", city: "Goa", state: "Goa",
    price: 26700, originalPrice: 45000, rating: 4.9, reviewCount: 312,
    amenities: ["WiFi", "Pool", "AC", "Balcony", "Parking"], propertyType: "Villa",
    images: [img("room1"), img("room6"), img("room10")], maxGuests: 8,
    isInstantBook: true, freeCancellation: true, breakfast: true, wifi: true, ac: true, pool: true, parking: true, balcony: true,
    bedType: "King bed",
  },
  {
    id: "g2", propertyName: "Triply Stone House Cottages Homestay", city: "Goa", state: "Goa",
    price: 26700, rating: 4.5, reviewCount: 154,
    amenities: ["WiFi", "Pool", "AC", "Kitchen"], propertyType: "Homestay",
    images: [img("room2"), img("room7"), img("room1")], maxGuests: 4,
    isInstantBook: false, freeCancellation: true, wifi: true, ac: true, pool: true, kitchen: true,
    bedType: "Queen bed",
  },
  // ── Dharamshala ──
  {
    id: "dh1", propertyName: "Triply Stone House Cottages Homestay", city: "Dharamshala", state: "Himachal Pradesh",
    price: 26700, originalPrice: 27000, rating: 4.6, reviewCount: 91,
    amenities: ["WiFi", "Mountain View", "Kitchen", "Balcony"], propertyType: "Homestay",
    images: [img("room3"), img("room8"), img("room2")], maxGuests: 3,
    isInstantBook: true, freeCancellation: true, breakfast: true, wifi: true, mountainView: true, balcony: true, kitchen: true,
    bedType: "Double bed",
  },
  // ── Kasol ──
  {
    id: "k1", propertyName: "Triply Stone House Cottages Homestay", city: "Kasol", state: "Himachal Pradesh",
    price: 26700, rating: 4.3, reviewCount: 67,
    amenities: ["WiFi", "Mountain View", "Balcony"], propertyType: "Cottage",
    images: [img("room4"), img("room9"), img("room3")], maxGuests: 2,
    isInstantBook: false, freeCancellation: true, wifi: true, mountainView: true, balcony: true,
    bedType: "Single bed",
  },
  // ── Kolkata ──
  {
    id: "kl1", propertyName: "Triply Stone House Cottages Homestay", city: "Kolkata", state: "West Bengal",
    price: 26700, originalPrice: 20000, rating: 4.2, reviewCount: 73,
    amenities: ["WiFi", "AC", "Kitchen"], propertyType: "Apartment",
    images: [img("room5"), img("room10"), img("room4")], maxGuests: 3,
    isInstantBook: true, freeCancellation: false, wifi: true, ac: true, kitchen: true,
    bedType: "Double bed",
  },
];

// Helper: get unique cities and states
export const ALL_CITIES = [...new Set(ALL_PROPERTIES.map(p => p.city))].sort();
export const ALL_STATES = [...new Set(ALL_PROPERTIES.map(p => p.state))].sort();

// Group properties for home page
export const DELHI_PROPERTIES = ALL_PROPERTIES.filter(p => p.city === "New Delhi").slice(0, 4);
export const DEHRADUN_PROPERTIES = ALL_PROPERTIES.filter(p => p.state === "Himachal Pradesh").slice(0, 4);
export const DELHI_PROPERTIES_2 = ALL_PROPERTIES.filter(p => p.city === "Jaipur" || p.city === "Goa").slice(0, 4);
export const DELHI_PROPERTIES_3 = ALL_PROPERTIES.filter(p => p.city === "Bangalore" || p.city === "Rishikesh").slice(0, 4);
