import React, { createContext, useContext, useState, useCallback } from "react";
import type { SearchFilters, SearchState, SortOption, GuestCount } from "@/types";

const DEFAULT_FILTERS: SearchFilters = {
  priceMin: 0,
  priceMax: 100000,
  guestRating: null,
  propertyTypes: [],
  amenities: [],
  bedTypes: [],
  freeCancellation: false,
  breakfast: false,
  parking: false,
  wifi: false,
  ac: false,
};

interface SearchContextType {
  search: SearchState;
  setSearch: (s: SearchState) => void;
  updateSearch: (partial: Partial<SearchState>) => void;
  filters: SearchFilters;
  setFilters: (f: SearchFilters) => void;
  updateFilter: <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => void;
  resetFilters: () => void;
  sort: SortOption;
  setSort: (s: SortOption) => void;
}

const SearchContext = createContext<SearchContextType | null>(null);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [search, setSearch] = useState<SearchState>({
    destination: "",
    checkIn: null,
    checkOut: null,
    guests: { adults: 2, children: 0, rooms: 1, pets: false },
  });
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortOption>("recommended");

  const updateSearch = useCallback((partial: Partial<SearchState>) => {
    setSearch(prev => ({ ...prev, ...partial }));
  }, []);

  const updateFilter = useCallback(<K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  const updateGuests = useCallback((guests: GuestCount) => {
    setSearch(prev => ({ ...prev, guests }));
  }, []);

  return (
    <SearchContext.Provider value={{
      search, setSearch, updateSearch,
      filters, setFilters, updateFilter, resetFilters,
      sort, setSort,
    }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearchContext() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearchContext must be used within SearchProvider");
  return ctx;
}

export default SearchContext;
