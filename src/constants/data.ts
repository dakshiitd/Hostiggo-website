import type { Destination, Property } from "@/types";

export const SUGGESTED_DESTINATIONS: Destination[] = [
  {
    id: "1",
    name: "New Delhi",
    state: "Delhi",
    stayCount: 12060,
    imageUrl: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=96&h=96&fit=crop&q=80",
  },
  {
    id: "2",
    name: "Noida",
    state: "Uttar Pradesh",
    stayCount: 3210,
    imageUrl: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=96&h=96&fit=crop&q=80",
  },
  {
    id: "3",
    name: "Shimla",
    state: "Himachal Pradesh",
    stayCount: 5530,
    imageUrl: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=96&h=96&fit=crop&q=80",
  },
  {
    id: "4",
    name: "Jaipur",
    state: "Rajasthan",
    stayCount: 8900,
    imageUrl: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=96&h=96&fit=crop&q=80",
  },
  {
    id: "5",
    name: "Uttarakhand",
    state: "Uttarakhand",
    stayCount: 7410,
    imageUrl: "https://images.unsplash.com/photo-1609766857843-3b3673b36a8e?w=96&h=96&fit=crop&q=80",
  },
  {
    id: "6",
    name: "Kolkata",
    state: "West Bengal",
    stayCount: 6200,
    imageUrl: "https://images.unsplash.com/photo-1558431382-27e303142255?w=96&h=96&fit=crop&q=80",
  },
  {
    id: "7",
    name: "Bangalore",
    state: "Karnataka",
    stayCount: 10800,
    imageUrl: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=96&h=96&fit=crop&q=80",
  },
  {
    id: "8",
    name: "Guwahati",
    state: "Assam",
    stayCount: 2870,
    imageUrl: "https://images.unsplash.com/photo-1548013146-72479768bada?w=96&h=96&fit=crop&q=80",
  },
];

export const POPULAR_FILTERS = [
  { id: "1000-2000", label: "₹1000 - 2000" },
  { id: "free-breakfast", label: "Free breakfast" },
  { id: "couple-friendly", label: "Couple friendly" },
  { id: "pet-friendly", label: "Pet friendly" },
  { id: "family-friendly", label: "Family friendly" },
];

const makeProperty = (
  id: string,
  name: string,
  location: string,
  rating: number,
  reviews: number,
  price: number,
  img: string,
  opts: Partial<Property> = {}
): Property => ({
  id,
  name,
  location,
  rating,
  reviewCount: reviews,
  pricePerNight: price,
  imageUrl: img,
  isFavorite: false,
  ...opts,
});

export const DELHI_PROPERTIES: Property[] = [
  makeProperty("d1","Apartment type hotel room","Rajouri Garden, Delhi",4.47,18,3498,
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop&q=80",{isFavorite:true}),
  makeProperty("d2","Hotel Residency","Connaught Place, Delhi",4.30,24,4800,
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=300&fit=crop&q=80"),
  makeProperty("d3","Golmuri Homestay","Hauz Khas, Delhi",4.50,11,7698,
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=300&fit=crop&q=80"),
  makeProperty("d4","Guesthouse Cottage with pool","Lajpat Nagar, Delhi",4.40,9,1498,
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop&q=80"),
];

export const DEHRADUN_PROPERTIES: Property[] = [
  makeProperty("dd1","Apartment type hotel room","Rajpur Road, Dehradun",4.47,18,3498,
    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop&q=80",{isNew:true}),
  makeProperty("dd2","Hotel Residency","Clock Tower, Dehradun",4.30,24,4500,
    "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&h=300&fit=crop&q=80"),
  makeProperty("dd3","Golmuri Homestay","Mussoorie Road, Dehradun",4.50,11,7698,
    "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=400&h=300&fit=crop&q=80"),
  makeProperty("dd4","Guesthouse Cottage","ISBT, Dehradun",4.40,9,3498,
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400&h=300&fit=crop&q=80"),
];

export const DELHI_PROPERTIES_2: Property[] = [
  makeProperty("d21","Apartment type hotel room","Karol Bagh, Delhi",4.47,18,3498,
    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&h=300&fit=crop&q=80"),
  makeProperty("d22","Hotel Residency","Paharganj, Delhi",4.30,24,4300,
    "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=400&h=300&fit=crop&q=80"),
  makeProperty("d23","Golmuri Homestay","South Extension, Delhi",4.50,11,7698,
    "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=400&h=300&fit=crop&q=80"),
  makeProperty("d24","Guesthouse Cottage","Dwarka, Delhi",4.40,9,1498,
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&q=80"),
];

export const DELHI_PROPERTIES_3: Property[] = [
  makeProperty("d31","Apartment type hotel room","Nehru Place, Delhi",4.47,18,3498,
    "https://images.unsplash.com/photo-1601565415267-724db0e4c1ce?w=400&h=300&fit=crop&q=80"),
  makeProperty("d32","Hotel Residency","Saket, Delhi",4.30,24,4900,
    "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=400&h=300&fit=crop&q=80"),
  makeProperty("d33","Golmuri Homestay","Vasant Kunj, Delhi",4.50,11,7698,
    "https://images.unsplash.com/photo-1549294413-26f195471f1b?w=400&h=300&fit=crop&q=80"),
  makeProperty("d34","Guesthouse Cottage","Malviya Nagar, Delhi",4.40,9,1498,
    "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop&q=80"),
];
