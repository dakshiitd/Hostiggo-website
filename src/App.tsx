import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { SearchProvider } from "@/context/SearchContext";
import HomePage from "@/pages/HomePage";
import SearchResultsPage from "@/pages/SearchResultsPage";
import PropertyDetailsPage from "@/pages/PropertyDetailsPage";
import SignInPage from "@/pages/SignInPage";
import OTPPage from "@/pages/OTPPage";
import WishlistPage from "@/pages/WishlistPage";
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
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/otp" element={<OTPPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </SearchProvider>
    </BrowserRouter>
  );
}
