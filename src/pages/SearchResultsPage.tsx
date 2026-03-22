import { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FiltersSidebar from "@/components/features/FiltersSidebar";
import SortDropdown from "@/components/features/SortDropdown";
import ActiveFilterTags from "@/components/features/ActiveFilterTags";
import PropertyCardList from "@/components/features/PropertyCardList";
import InteractiveMap from "@/components/features/InteractiveMap";
import { CompactSearchBar } from "@/components/features/SearchForm";
import { useSearchContext } from "@/context/SearchContext";
import { ALL_PROPERTIES } from "@/constants/data";
import type { Property, SearchFilters, SortOption } from "@/types";
import { Menu, X, SlidersHorizontal, Map, List } from "lucide-react";

const PAGE_SIZE = 10;

type ViewMode = "list" | "map" | "split";

function applyFilters(properties: Property[], destination: string, filters: SearchFilters): Property[] {
  const dest = destination.toLowerCase().trim();
  return properties.filter(p => {
    if (dest) {
      const match =
        p.city.toLowerCase().includes(dest) ||
        p.state.toLowerCase().includes(dest) ||
        p.propertyName.toLowerCase().includes(dest);
      if (!match) return false;
    }
    if (p.price < filters.priceMin || p.price > filters.priceMax) return false;
    if (filters.guestRating && p.rating < filters.guestRating) return false;
    if (filters.propertyTypes.length > 0 && !filters.propertyTypes.includes(p.propertyType)) return false;
    if (filters.amenities.length > 0) {
      const hasAll = filters.amenities.every(am => p.amenities.some(a => a.toLowerCase().includes(am.toLowerCase())));
      if (!hasAll) return false;
    }
    if (filters.bedTypes.length > 0 && p.bedType && !filters.bedTypes.includes(p.bedType)) return false;
    if (filters.freeCancellation && !p.freeCancellation) return false;
    if (filters.breakfast && !p.breakfast) return false;
    if (filters.parking && !p.parking) return false;
    if (filters.wifi && !p.wifi) return false;
    if (filters.ac && !p.ac) return false;
    return true;
  });
}

function applySort(properties: Property[], sort: SortOption): Property[] {
  const arr = [...properties];
  switch (sort) {
    case "price_asc": return arr.sort((a, b) => a.price - b.price);
    case "price_desc": return arr.sort((a, b) => b.price - a.price);
    case "top_rated": return arr.sort((a, b) => b.rating - a.rating);
    case "most_popular": return arr.sort((a, b) => b.reviewCount - a.reviewCount);
    default: return arr;
  }
}

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const { search, updateSearch, filters, updateFilter, resetFilters, sort, setSort } = useSearchContext();
  const [page, setPage] = useState(1);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeMapId, setActiveMapId] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Sync destination from URL
  useEffect(() => {
    const dest = searchParams.get("destination");
    if (dest && dest !== search.destination) updateSearch({ destination: dest });
  }, [searchParams]);

  // Reset pagination on filter/search/sort change
  useEffect(() => { setPage(1); }, [search.destination, filters, sort]);

  const filtered = useMemo(() =>
    applyFilters(ALL_PROPERTIES, search.destination, filters),
    [search.destination, filters]
  );

  const sorted = useMemo(() => applySort(filtered, sort), [filtered, sort]);
  const paginated = sorted.slice(0, page * PAGE_SIZE);
  const hasMore = paginated.length < sorted.length;

  const handleRemoveFilter = (key: keyof SearchFilters, value?: string) => {
    if (key === "propertyTypes" && value) updateFilter("propertyTypes", filters.propertyTypes.filter(v => v !== value));
    else if (key === "amenities" && value) updateFilter("amenities", filters.amenities.filter(v => v !== value));
    else if (key === "bedTypes" && value) updateFilter("bedTypes", filters.bedTypes.filter(v => v !== value));
    else if (key === "priceMin") { updateFilter("priceMin", 0); updateFilter("priceMax", 15000); }
    else if (key === "guestRating") updateFilter("guestRating", null);
    else updateFilter(key, false as never);
  };

  const displayDest = search.destination || searchParams.get("destination") || "All destinations";

  // isSplitOrMap
  const showMap = viewMode === "map" || viewMode === "split";
  const showList = viewMode === "list" || viewMode === "split";

  return (
    <div className="min-h-screen bg-[#FFFEF9]">
      <Navbar />

      {/* Search bar strip */}
      <div className="bg-[#005a9c] sticky top-16 z-40 py-3.5 px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          <div className="flex-1">
            <CompactSearchBar />
          </div>

          {/* View toggle moved to better align with the new design if necessary, but keeping it for now */}
        </div>
      </div>

      {/* Full-height map-only mode */}
      {viewMode === "map" && (
        <div className="flex" style={{ height: "calc(100vh - 112px)" }}>
          {/* Sidebar */}
          <div className="hidden lg:block w-[320px] flex-shrink-0 overflow-y-auto bg-[#FFFEF9] p-4">
            <FiltersSidebar
              filters={filters}
              onChange={updateFilter}
              onReset={resetFilters}
              city={displayDest}
              count={sorted.length}
            />
          </div>
          {/* Full map */}
          <div className="flex-1 relative p-3">
            <InteractiveMap
              properties={sorted}
              activeId={activeMapId}
              onMarkerClick={setActiveMapId}
              className="w-full h-full"
            />
          </div>
        </div>
      )}

      {/* List-only mode */}
      {viewMode === "list" && (
        <div className="container-main py-6">
          <div className="flex gap-6 items-start">
            {/* Sidebar desktop */}
            <div className="hidden lg:block">
              <FiltersSidebar
                filters={filters}
                onChange={updateFilter}
                onReset={resetFilters}
                city={displayDest}
                count={sorted.length}
              />
            </div>

            {/* Mobile sidebar overlay */}
            {mobileSidebar && (
              <div className="fixed inset-0 z-50 lg:hidden">
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileSidebar(false)} />
                <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-white overflow-y-auto p-4 shadow-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-gray-800 text-sm">Filters</h2>
                    <button onClick={() => setMobileSidebar(false)} className="p-1.5 rounded-lg hover:bg-gray-100">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <FiltersSidebar
                    filters={filters}
                    onChange={updateFilter}
                    onReset={() => { resetFilters(); setMobileSidebar(false); }}
                    city={displayDest}
                    count={sorted.length}
                  />
                </div>
              </div>
            )}

            {/* Main content */}
            <div className="flex-1 min-w-0">
              <ResultsHeader
                dest={displayDest}
                count={sorted.length}
                sort={sort}
                setSort={setSort}
                onMobileFilter={() => setMobileSidebar(true)}
                filters={filters}
                onRemoveFilter={handleRemoveFilter}
                onClearAll={resetFilters}
              />
              <ListResults
                paginated={paginated}
                sorted={sorted}
                hasMore={hasMore}
                onLoadMore={() => setPage(pg => pg + 1)}
                onHover={setHoveredId}
                resetFilters={resetFilters}
              />
            </div>
          </div>
        </div>
      )}

      {/* Removed Split view */}

      {viewMode !== "map" && <Footer />}
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────

interface ResultsHeaderProps {
  dest: string;
  count: number;
  sort: SortOption;
  setSort: (s: SortOption) => void;
  onMobileFilter: () => void;
  filters: SearchFilters;
  onRemoveFilter: (key: keyof SearchFilters, value?: string) => void;
  onClearAll: () => void;
}

function ResultsHeader({ dest, count, sort, setSort, onMobileFilter, filters, onRemoveFilter, onClearAll }: ResultsHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-extrabold text-gray-900 capitalize mb-1.5">{dest}</h1>
      <p className="text-[22px] text-gray-800 leading-snug mb-5">
        {count.toLocaleString("en-IN")} homestays found
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <SortDropdown value={sort} onChange={setSort} />
        <ActiveFilterTags filters={filters} onRemove={onRemoveFilter} onClearAll={onClearAll} />

        <button
          onClick={onMobileFilter}
          className="lg:hidden flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-gray-200 bg-white text-[13px] font-semibold text-gray-700 hover:border-gray-300 transition-all ml-auto"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          More Filters
        </button>
      </div>
    </div>
  );
}

interface ListResultsProps {
  paginated: Property[];
  sorted: Property[];
  hasMore: boolean;
  onLoadMore: () => void;
  onHover: (id: string | null) => void;
  resetFilters: () => void;
}

function ListResults({ paginated, sorted, hasMore, onLoadMore, onHover, resetFilters }: ListResultsProps) {
  if (sorted.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.07)" }}>
        <div className="text-5xl mb-4">🏨</div>
        <h3 className="text-lg font-bold text-gray-700 mb-2">No properties found</h3>
        <p className="text-gray-400 text-sm mb-4">Try adjusting your filters or search for a different destination.</p>
        <button onClick={resetFilters} className="bg-primary-gradient text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-95">
          Clear all filters
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {paginated.map(p => (
          <div
            key={p.id}
            onMouseEnter={() => onHover(p.id)}
            onMouseLeave={() => onHover(null)}
          >
            <PropertyCardList property={p} />
          </div>
        ))}
      </div>
      {hasMore && (
        <div className="mt-6 text-center">
          <button
            onClick={onLoadMore}
            className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            Load more ({sorted.length - paginated.length} remaining)
          </button>
        </div>
      )}
    </>
  );
}
