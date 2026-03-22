import Link from "next/link";

const occasions = [
  { emoji: "🎂", name: "Birthday" },
  { emoji: "💍", name: "Wedding" },
  { emoji: "🍼", name: "Baby Shower" },
  { emoji: "🎄", name: "Christmas" },
  { emoji: "🏡", name: "Housewarming" },
  { emoji: "🎓", name: "Graduation" },
];

export default function HeroSection() {
  return (
    <header className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-[10%] w-2 h-2 bg-wd-gold rounded-full animate-twinkle"></div>
        <div className="absolute top-20 left-[30%] w-1.5 h-1.5 bg-wd-rose-gold rounded-full animate-twinkle" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-8 left-[50%] w-2 h-2 bg-wd-gold rounded-full animate-twinkle" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-16 left-[70%] w-1.5 h-1.5 bg-wd-rose-gold rounded-full animate-twinkle" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-12 left-[90%] w-2 h-2 bg-wd-gold rounded-full animate-twinkle" style={{ animationDelay: '0.3s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="text-7xl mb-6">🎁</div>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-6 font-display tracking-wide">
            <span className="text-wd-heading">Create Your Perfect</span>
            <br />
            <span className="text-wd-heading">Gift Registry</span>
            <span className="text-wd-gold"> — Free</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-wd-gold mb-4 font-semibold tracking-wide">
            The free gift registry for every occasion
          </p>
          <p className="text-lg md:text-xl text-wd-charcoal/70 mb-10 max-w-3xl mx-auto leading-relaxed">
            For birthdays, weddings, baby showers, and every occasion. Share your
            wishlist, friends claim items &mdash; no duplicate gifts, ever.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-16">
            <Link
              href="/create"
              className="group bg-wd-gold p-8 rounded-2xl card-glow transition-all duration-300 hover:scale-105 hover:bg-wd-gold-dark"
            >
              <div className="text-5xl mb-4">✨</div>
              <h2 className="text-2xl font-bold text-white mb-2 font-display">Create Registry</h2>
              <p className="text-white/80 mb-3 text-sm">
                Start a gift registry for any occasion in under a minute
              </p>
              <span className="text-white font-semibold group-hover:underline">
                Get Started &rarr;
              </span>
            </Link>

            <Link
              href="/join"
              className="group bg-white p-8 rounded-2xl border-2 border-wd-gold/30 card-glow transition-all duration-300 hover:scale-105 hover:border-wd-gold"
            >
              <div className="text-5xl mb-4">🎁</div>
              <h2 className="text-2xl font-bold text-wd-heading mb-2 font-display">Join Registry</h2>
              <p className="text-wd-charcoal/60 mb-3 text-sm">
                Have an invite code? Join and start claiming gifts
              </p>
              <span className="text-wd-gold font-semibold group-hover:underline">
                Join Now &rarr;
              </span>
            </Link>
          </div>

          {/* Occasion Cards */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 max-w-3xl mx-auto">
            {occasions.map((occasion) => (
              <div
                key={occasion.name}
                className="bg-white border border-wd-border rounded-xl p-3 text-center card-glow hover:border-wd-gold/40 transition-colors"
              >
                <div className="text-3xl mb-1">{occasion.emoji}</div>
                <div className="text-xs text-wd-charcoal/60 font-medium">{occasion.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-wd-gold/20 to-transparent"></div>
    </header>
  );
}
