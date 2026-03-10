import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { SearchProvider } from "@/context/SearchContext";
import HomePage from "@/pages/HomePage";
import SearchResultsPage from "@/pages/SearchResultsPage";
import PropertyDetailsPage from "@/pages/PropertyDetailsPage";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <SearchProvider>
        <Toaster position="top-center" richColors closeButton />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/property/:id" element={<PropertyDetailsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </SearchProvider>
    </BrowserRouter>
  );
}
