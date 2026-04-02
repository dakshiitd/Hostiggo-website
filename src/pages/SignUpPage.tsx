import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import heroBg from "@/assets/hero-bg.jpg";

export default function SignUpPage() {
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // Insert profile as fallback (trigger may also do this)
    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        full_name: fullName,
        email: email,
      });

      // Refresh profile in auth context so navbar picks it up immediately
      await refreshProfile();
    }

    // Successful signup — redirect to home
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#FFFEF9] flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-10 lg:py-14">
        <div className="container-main">
          <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-2 sm:p-3 lg:p-4 max-w-4xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-0 items-stretch overflow-hidden rounded-[2rem]">

              {/* Left: visual panel */}
              <div
                className="relative w-full lg:w-[420px] flex-shrink-0 overflow-hidden select-none hidden md:block"
                style={{ minHeight: 560 }}
              >
                <img src={heroBg} alt="Beautiful homestay" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
                <div className="relative z-10 p-9 flex flex-col h-full" style={{ minHeight: 560 }}>
                  <p className="text-white/90 text-sm font-medium tracking-wide mb-1">Start your journey with</p>
                  <h2 className="text-white font-extrabold leading-[1.1] mb-auto" style={{ fontSize: "clamp(2.2rem, 4vw, 3rem)" }}>
                    Your perfect stay
                  </h2>

                  <div className="mt-auto pt-6">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-lg">
                      <h3 className="text-center text-white/90 font-medium tracking-[0.15em] uppercase text-xs mb-4">
                        Why Hostiggo?
                      </h3>
                      <div className="flex flex-wrap justify-center gap-2.5">
                        {["Lowest prices", "Free cancellation", "24/7 support", "Verified hosts"].map((tag) => (
                          <span key={tag} className="bg-white hover:bg-white/90 text-gray-700 text-xs font-semibold px-3 py-2 rounded-lg shadow-sm transition-colors">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Sign-up form */}
              <div className="flex-1 flex flex-col justify-center py-8 lg:py-0 px-6 sm:px-10 lg:px-12 w-full">
                {/* Logo on mobile only */}
                <div className="flex items-center justify-center gap-2.5 mb-6 lg:hidden">
                  <div className="w-9 h-9 bg-[#004772] rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white font-bold text-[18px] leading-none">H</span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="font-black text-[#374151] text-[17px] tracking-wider uppercase">Hosti</span>
                    <span className="font-black text-[#0086D8] text-[17px] tracking-wider uppercase">ggo</span>
                  </div>
                </div>

                <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Create account</h1>
                <p className="text-gray-500 text-sm mb-6">Join Hostiggo and find your perfect stay.</p>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-2.5 mb-4">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="signup-name" className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        id="signup-name"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/60 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="signup-email" className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        id="signup-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/60 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="signup-password" className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min. 6 characters"
                        className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-gray-200 bg-gray-50/60 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="signup-confirm" className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        id="signup-confirm"
                        type={showConfirm ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-gray-200 bg-gray-50/60 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                      />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#005a9c] hover:bg-[#004a80] active:bg-[#003a66] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                    {loading ? "Creating account..." : "Sign Up"}
                  </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400 font-medium">or</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Sign in link */}
                <p className="text-center text-sm text-gray-500">
                  Already have an account?{" "}
                  <Link to="/signin" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
