import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Globe, ChevronDown, IndianRupee, Menu, X,
  MessageCircle, Heart, Clock, User, Settings,
  Star, HelpCircle, Home, LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock auth state — replace with real context when backend is ready
const IS_SIGNED_IN = true;
const USER = { name: "Bajpai Lehri", avatar: "https://i.pravatar.cc/150?img=11" };

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  to?: string;
  danger?: boolean;
  action?: () => void;
}

const MENU_GROUPS: MenuItem[][] = [
  [
    { icon: <MessageCircle className="w-4 h-4" />, label: "Chats", to: "#" },
    { icon: <Heart className="w-4 h-4" />, label: "Wishlists", to: "/wishlist" },
    { icon: <Clock className="w-4 h-4" />, label: "Memories", to: "#" },
    { icon: <User className="w-4 h-4" />, label: "Profile", to: "#" },
  ],
  [
    { icon: <Settings className="w-4 h-4" />, label: "Account Settings", to: "#" },
    { icon: <Star className="w-4 h-4" />, label: "My reviews", to: "#" },
    { icon: <HelpCircle className="w-4 h-4" />, label: "Customer support", to: "#" },
  ],
  [
    { icon: <Home className="w-4 h-4 text-amber-500" />, label: "Host & Earn", to: "#" },
  ],
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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
              <span className="font-black text-[#374151] text-[17px] tracking-wider uppercase">Hosti</span>
              <span className="font-black text-[#0086D8] text-[17px] tracking-wider uppercase">ggo</span>
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

            {IS_SIGNED_IN ? (
              <>
                <button
                  className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-colors ml-1"
                  onClick={() => navigate("/list-property")}
                >
                  List your property
                </button>

                {/* Avatar + Dropdown */}
                <div ref={profileRef} className="relative ml-2">
                  <button
                    onClick={() => setProfileOpen(v => !v)}
                    className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-offset-1 ring-transparent hover:ring-blue-400 transition-all"
                  >
                    <img src={USER.avatar} alt={USER.name} className="w-full h-full object-cover" />
                  </button>

                  {/* Dropdown */}
                  {profileOpen && (
                    <div
                      className={cn(
                        "absolute right-0 top-[calc(100%+10px)] w-[220px] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden",
                        "animate-fade-in-down origin-top-right"
                      )}
                      style={{ animation: "fadeInDown 0.18s ease both" }}
                    >
                      {MENU_GROUPS.map((group, gi) => (
                        <div key={gi}>
                          {gi > 0 && <div className="h-px bg-gray-100 mx-3" />}
                          <div className="py-1.5">
                            {group.map((item) => (
                              <Link
                                key={item.label}
                                to={item.to ?? "#"}
                                onClick={() => { item.action?.(); setProfileOpen(false); }}
                                className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                              >
                                <span className="text-gray-400">{item.icon}</span>
                                <span>{item.label}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}

                      {/* Sign out */}
                      <div className="h-px bg-gray-100 mx-3" />
                      <div className="p-3">
                        <button
                          onClick={() => { setProfileOpen(false); navigate("/signin"); }}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-[13px] font-semibold text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button
                  className="text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors text-[13px] font-medium ml-1"
                  onClick={() => navigate("/signin")}
                >
                  Sign in
                </button>
                <button
                  className="bg-[#005a9c] hover:bg-[#004a80] active:bg-[#003a66] text-white px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-colors ml-1 shadow-sm"
                  onClick={() => navigate("/signin")}
                >
                  New user
                </button>
                <button
                  onClick={() => navigate("/list-property")}
                  className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-colors ml-1"
                >
                  List your property
                </button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 space-y-1 pb-4">
            <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl flex items-center gap-2.5 font-medium">
              <IndianRupee className="w-4 h-4 text-gray-500" /> INR
            </button>
            <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl flex items-center gap-2.5 font-medium">
              <Globe className="w-4 h-4 text-gray-500" /> English
            </button>
            {IS_SIGNED_IN ? (
              <>
                <Link to="/wishlist" onClick={() => setMobileOpen(false)} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl flex items-center gap-2.5 font-medium">
                  <Heart className="w-4 h-4 text-gray-500" /> Wishlists
                </Link>
                <Link to="#" onClick={() => setMobileOpen(false)} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl flex items-center gap-2.5 font-medium">
                  <User className="w-4 h-4 text-gray-500" /> Profile
                </Link>
                <div className="px-4 pt-2">
                  <button
                    onClick={() => { setMobileOpen(false); navigate("/signin"); }}
                    className="w-full border border-red-200 text-red-500 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" /> Sign out
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => { setMobileOpen(false); navigate("/signin"); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl font-medium"
                >
                  Sign in
                </button>
                <div className="px-4 pt-2 flex gap-2">
                  <button
                    onClick={() => { setMobileOpen(false); navigate("/signin"); }}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-xl text-sm font-semibold"
                  >
                    New user
                  </button>
                  <button className="flex-1 border border-blue-600 text-blue-600 py-2 rounded-xl text-sm font-semibold">
                    List property
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
