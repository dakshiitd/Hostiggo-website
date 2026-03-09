import { useState } from "react";
import { Link } from "react-router-dom";
import { Globe, ChevronDown, IndianRupee, Menu, X, Home } from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      className="bg-white sticky top-0 z-50 border-b border-gray-100"
      style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.07)" }}
    >
      <div className="container-main">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5 flex-shrink-0">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
              <Home className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-extrabold text-gray-900 text-[15px] tracking-tight">
              HOSTI<span className="text-blue-600">GO</span>
            </span>
          </Link>

          {/* Desktop nav items */}
          <div className="hidden md:flex items-center gap-0.5">
            {/* INR */}
            <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors text-[13px] font-medium">
              <IndianRupee className="w-3.5 h-3.5" strokeWidth={2} />
              <span>INR</span>
            </button>

            {/* Language */}
            <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors text-[13px] font-medium">
              <Globe className="w-3.5 h-3.5" strokeWidth={1.8} />
              <span>English</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {/* Sign In */}
            <button className="text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors text-[13px] font-medium ml-1">
              Sign in
            </button>

            {/* New User */}
            <button className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-colors ml-1 shadow-sm">
              New user
            </button>

            {/* List property */}
            <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-colors ml-1">
              List your property
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 space-y-1 animate-fade-in pb-4">
            <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl flex items-center gap-2.5 font-medium">
              <IndianRupee className="w-4 h-4 text-gray-500" /> INR
            </button>
            <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl flex items-center gap-2.5 font-medium">
              <Globe className="w-4 h-4 text-gray-500" /> English
            </button>
            <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl font-medium">
              Sign in
            </button>
            <div className="px-4 pt-2 flex gap-2">
              <button className="flex-1 bg-blue-600 text-white py-2 rounded-xl text-sm font-semibold">
                New user
              </button>
              <button className="flex-1 border border-blue-600 text-blue-600 py-2 rounded-xl text-sm font-semibold">
                List property
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
