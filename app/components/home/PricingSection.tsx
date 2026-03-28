import Link from "next/link";

export default function PricingSection() {
  const freeFeatures = [
    "1 registry",
    "Up to 10 items",
    "Item claiming & notes",
    "Surprise-safe design",
    "Shareable registry page",
    "Gift categories",
    "Cash / honeymoon funds",
    "Email magic link login",
    "Multi-currency support",
  ];

  const unlimitedFeatures = [
    "Everything in Free",
    "Unlimited registries",
    "Unlimited items & participants",
    "Thank-you reveal mode",
    "Email notifications",
    "Pay once, use forever",
  ];

  return (
    <section className="py-20 bg-wd-cream" aria-labelledby="pricing-heading">
      <div className="container mx-auto px-4 text-center">
        <h2 id="pricing-heading" className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 font-display tracking-wide text-wd-heading">
          <span className="text-wd-gold">Simple</span> Pricing
        </h2>
        <p className="text-xl text-wd-charcoal/60 mb-10 max-w-2xl mx-auto">
          Free for most people. One simple upgrade for power users.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Free */}
          <div className="bg-white rounded-2xl border-2 border-wd-border p-8 card-glow">
            <div className="text-4xl mb-3">🎁</div>
            <div className="text-wd-gold text-sm font-semibold uppercase tracking-wider mb-2">Free</div>
            <div className="text-5xl font-bold text-wd-heading mb-2 font-display">$0</div>
            <p className="text-wd-charcoal/50 mb-6">No credit card needed</p>
            <ul className="text-left space-y-3 mb-8">
              {freeFeatures.map((f) => (
                <li key={f} className="flex items-start text-wd-charcoal">
                  <span className="text-wd-gold mr-3 mt-0.5 flex-shrink-0">&#10003;</span> <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link href="/create" className="block w-full bg-white text-wd-gold py-3 rounded-xl font-bold text-lg border-2 border-wd-gold hover:bg-wd-cream transition-colors text-center">
              Get Started &rarr;
            </Link>
          </div>

          {/* Unlimited */}
          <div className="bg-white rounded-2xl border-2 border-wd-gold/40 p-8 card-glow relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-wd-gold text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Best Value</div>
            <div className="text-4xl mb-3">🏆</div>
            <div className="text-wd-gold text-sm font-semibold uppercase tracking-wider mb-2">Unlimited</div>
            <div className="text-5xl font-bold text-wd-heading mb-2 font-display">$10</div>
            <p className="text-wd-charcoal/50 mb-6">One-time payment</p>
            <ul className="text-left space-y-3 mb-8">
              {unlimitedFeatures.map((f) => (
                <li key={f} className="flex items-start text-wd-charcoal">
                  <span className="text-wd-gold mr-3 mt-0.5 flex-shrink-0">&#10003;</span> <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link href="/create" className="block w-full bg-wd-gold text-white py-3 rounded-xl font-bold text-lg hover:bg-wd-gold-dark transition-colors text-center">
              Get Started &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
