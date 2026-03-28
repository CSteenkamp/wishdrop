export default function FeaturesSection() {
  const features = [
    { icon: "🎯", title: "Item Claiming", desc: "Friends claim items they want to buy. Once claimed, everyone knows — no more duplicate gifts. Unclaim anytime if plans change." },
    { icon: "🤫", title: "Surprise-Safe", desc: "The registry owner can't see who claimed what — only whether items are claimed or available. Enable reveal mode after the event for thank-you notes." },
    { icon: "🔗", title: "Shareable Registry Page", desc: "Every registry gets a beautiful public page with a custom URL. Share it via text, email, social media, or embed it on your wedding website." },
    { icon: "💵", title: "Cash & Honeymoon Funds", desc: "Create contribution funds for honeymoons, house deposits, or anything else. Guests pledge amounts with personal messages." },
    { icon: "📂", title: "Gift Categories", desc: "Organize items into categories like Kitchen, Bedroom, or Experiences. Guests can filter by category to find the perfect gift." },
    { icon: "💌", title: "Personal Notes", desc: "Guests can leave personal messages when claiming gifts. See heartfelt notes from loved ones when you enable reveal mode." },
    { icon: "🔐", title: "No Registration", desc: "No sign-ups, no accounts. Simple code-based login keeps things easy. Optionally use email magic links for a smoother experience." },
    { icon: "💰", title: "Multi-Currency Pricing", desc: "Add prices in any currency — USD, EUR, GBP, ZAR, and 14 more. Set priority levels so friends know what matters most." },
    { icon: "📱", title: "Mobile Friendly", desc: "Designed mobile-first with large touch targets and responsive layouts. Create registries, browse wishlists, and claim gifts from any device." },
  ];

  return (
    <section className="py-20 bg-white" aria-labelledby="features-heading">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 id="features-heading" className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 font-display tracking-wide text-wd-heading">
            Why Choose <span className="text-wd-gold">WishDrop</span>?
          </h2>
          <p className="text-xl text-wd-charcoal/60 max-w-3xl mx-auto">
            Everything you need for the perfect gift registry
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((f) => (
            <div key={f.title} className="p-6 bg-white rounded-2xl border border-wd-border card-glow">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-bold text-wd-heading mb-2 font-display">{f.title}</h3>
              <p className="text-wd-charcoal/60 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
