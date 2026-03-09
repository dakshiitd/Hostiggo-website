import heroBg from "@/assets/hero-bg.jpg";
import SearchForm from "@/components/features/SearchForm";

const HERO_TAGS = [
  { label: "₹1000 – 2000" },
  { label: "Free breakfast" },
  { label: "Couple friendly" },
  { label: "Pet friendly" },
  { label: "Family friendly" },
  { label: "City centre" },
];

export default function HeroSection() {
  return (
    <section className="bg-white border-b border-gray-100">
      <div className="container-main py-7 lg:py-10">
        <div className="flex flex-col lg:flex-row gap-7 items-start">

          {/* ── Left: hero image card ── */}
          <div
            className="relative w-full lg:w-[340px] xl:w-[380px] flex-shrink-0 rounded-3xl overflow-hidden select-none"
            style={{ minHeight: 340 }}
          >
            <img
              src={heroBg}
              alt="Lush green forest"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />

            {/* Text content */}
            <div className="relative z-10 p-6 flex flex-col h-full" style={{ minHeight: 340 }}>
              <p className="text-white/75 text-xs font-medium tracking-wide mb-1">Discover your next</p>
              <h1 className="text-white font-black leading-none mb-auto" style={{ fontSize: "clamp(2.4rem,6vw,3.5rem)" }}>
                Perfect<br />stay
              </h1>

              {/* Popular choices */}
              <div className="mt-auto pt-4">
                <div className="mb-2.5">
                  <span className="bg-white/15 backdrop-blur border border-white/25 text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-wide">
                    Popular Choices
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {HERO_TAGS.map(({ label }) => (
                    <button
                      key={label}
                      className="bg-white/15 hover:bg-white/30 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-1 rounded-full border border-white/20 transition-all duration-200 active:scale-95"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: search panel ── */}
          <div className="flex-1 flex flex-col justify-center pt-0 lg:pt-6">
            <div className="mb-6 hidden lg:block">
              <h2 className="text-2xl font-bold text-gray-800 leading-snug">
                Find your home<br />away from home
              </h2>
              <p className="text-gray-500 text-sm mt-1.5">
                Search from thousands of properties across India
              </p>
            </div>
            <SearchForm />
          </div>

        </div>
      </div>
    </section>
  );
}
