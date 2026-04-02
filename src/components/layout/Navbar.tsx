import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Globe, ChevronDown, IndianRupee, Menu, X, Home, User, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const { user, session, profile, signOut } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setProfileOpen(false);
    setMobileOpen(false);
    await signOut();
    navigate("/signin");
  };

  // Get display name: profile table → user_metadata → email prefix
  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const displayEmail = profile?.email || user?.email || "";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-gray-50 shadow-[0_8px_30px_rgba(59,130,246,0.12)]">
      <div className="container-main">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-9 h-9 bg-[#004772] rounded-full flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
              <span className="text-white font-bold text-[18px] leading-none">H</span>
            </div>
            <div className="flex items-baseline">
              <span className="font-black text-[#374151] text-[17px] tracking-wider uppercase">
                Hosti
              </span>
              <span className="font-black text-[#0086D8] text-[17px] tracking-wider uppercase">
                ggo
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-0.5">
            <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors text-[13px] font-medium">
              <IndianRupee className="w-3.5 h-3.5" strokeWidth={2} />
              <span>INR.</span>
            </button>
            <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors text-[13px] font-medium">
              <Globe className="w-3.5 h-3.5" strokeWidth={1.8} />
              <span>English</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {/* Conditional: Sign In vs Profile */}
            {session ? (
              <div className="relative ml-1" ref={dropdownRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors text-[13px] font-medium text-gray-700"
                >
                  <div className="w-7 h-7 bg-[#004772] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-[11px] leading-none">{initials}</span>
                  </div>
                  <span className="max-w-[100px] truncate">{displayName}</span>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.08)] z-50 animate-fade-in-down overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800 truncate">{displayName}</p>
                      <p className="text-xs text-gray-500 truncate">{displayEmail}</p>
                    </div>
                    <div className="p-1.5">
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate("/signin")}
                className="text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors text-[13px] font-medium ml-1"
              >
                Sign in
              </button>
            )}

            <button className="bg-[#005a9c] hover:bg-[#004a80] active:bg-[#003a66] text-white px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-colors ml-1 shadow-sm">
              Host your home
            </button>
            <button
              onClick={() => navigate("/list-property")}
              className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-colors ml-1"
            >
              List your property
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 space-y-1 animate-fade-in pb-4">
            <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl flex items-center gap-2.5 font-medium">
              <IndianRupee className="w-4 h-4 text-gray-500" /> INR
            </button>
            <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl flex items-center gap-2.5 font-medium">
              <Globe className="w-4 h-4 text-gray-500" /> English
            </button>

            {/* Conditional: Sign In vs Profile (mobile) */}
            {session ? (
              <>
                <div className="px-4 py-2.5 flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-[#004772] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-[12px] leading-none">{initials}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{displayName}</p>
                    <p className="text-xs text-gray-500 truncate">{displayEmail}</p>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-2.5 font-medium"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => { setMobileOpen(false); navigate("/signin"); }}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl font-medium"
              >
                Sign in
              </button>
            )}

            <div className="px-4 pt-2 flex gap-2">
              <button className="flex-1 bg-blue-600 text-white py-2 rounded-xl text-sm font-semibold">New user</button>
              <button className="flex-1 border border-blue-600 text-blue-600 py-2 rounded-xl text-sm font-semibold">List property</button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
