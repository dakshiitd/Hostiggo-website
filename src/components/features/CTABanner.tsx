import { toast } from "sonner";
import { Rocket } from "lucide-react";

export default function CTABanner() {
  return (
    <section className="bg-[#FFFEF9] rounded-[24px] border-2 border-gray-200 py-10 px-6 md:px-12 shadow-[0_2px_16px_rgba(0,0,0,0.03)] my-10">
      <h2 className="text-center text-xl md:text-[22px] font-extrabold text-gray-900 mb-10">
        Want to earn effortlessly?
      </h2>

      <div className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-6 max-w-4xl mx-auto">
        {/* Left Side: Copy */}
        <div className="flex-1 max-w-[280px] text-center md:text-left order-2 md:order-1">
          <p className="text-gray-700 text-[14px] leading-relaxed mb-4">
            List your Homestay on Hostiggo and start receiving bookings from travellers.
          </p>
          <p className="text-gray-900 font-extrabold text-[14px] mb-6">
            Earn extra income NOW!!
          </p>
          <button
            onClick={() => toast.success("Redirecting to host registration…")}
            className="inline-flex items-center justify-center bg-primary-gradient text-white px-7 py-2.5 rounded-xl font-bold text-[13px] transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            Get started
          </button>
        </div>

        {/* Center: Character Image */}
        <div className="flex-shrink-0 flex items-center justify-center w-[160px] md:w-[220px] order-1 md:order-2">
          <img 
            src="/host-celebration.png" 
            alt="Celebrating Host" 
            className="w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(59,130,246,0.4)] hover:-translate-y-2 transition-transform duration-500" 
          />
        </div>

        {/* Right Side: Dark Card */}
        <div className="flex-shrink-0 w-full md:w-[476px] md:h-[275px] order-3">
          <div className="relative rounded-3xl p-8 shadow-3d hover:shadow-3d-hover hover:-translate-y-1.5 transition-all duration-300 overflow-hidden border border-slate-700 w-full h-full flex flex-col justify-between">
            {/* Base Dark Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1c2c3e] via-[#101b2a] to-[#0a111a]" />
            {/* Background Texture (SVG Noise) */}
            <div 
              className="absolute inset-0 opacity-60 mix-blend-screen pointer-events-none" 
              style={{ 
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CcomponentTransfer%3E%3CfeFuncR type='linear' slope='1.5'/%3E%3CfeFuncG type='linear' slope='1.5'/%3E%3CfeFuncB type='linear' slope='1.5'/%3E%3C/componentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' fill='%23111827'/%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'repeat'
              }} 
            />
            {/* Lighting glow */}
            <div className="absolute -top-16 -right-16 w-56 h-56 bg-blue-500 opacity-20 blur-[50px] rounded-full pointer-events-none" />
            
            <div className="relative z-10 flex flex-col h-full">
              {/* Logo / Avatar bubble */}
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-900 font-bold text-[18px] mb-5 shadow-sm">
                H
              </div>

              <div className="flex-1">
                {/* Text 1 */}
                <h3 className="text-white text-[16px] md:text-[18px] font-medium leading-tight mb-4 tracking-wide">
                  First 10 bookings are 0% commission for all new hosts
                </h3>
                {/* Text 2 */}
                <p className="text-white text-[15px] md:text-[16px] font-medium leading-snug tracking-wide mb-6">
                  After that, only 2% platform commission applies (lowest to all other platforms)
                </p>
              </div>

              {/* Badge */}
              <div className="mt-auto">
                <span className="text-[#FCE267] drop-shadow-md text-[20px] md:text-[24px] font-extrabold tracking-wide">
                  Royal Deal
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
