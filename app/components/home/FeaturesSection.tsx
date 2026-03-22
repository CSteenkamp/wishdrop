export default function FeaturesSection() {
  return (
    <section className="py-20 bg-white" aria-labelledby="features-heading">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 id="features-heading" className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 font-display tracking-wide text-wd-heading">
            Why Choose <span className="text-wd-gold">WishDrop</span>?
          </h2>
          <p className="text-xl text-wd-charcoal/60 max-w-3xl mx-auto">
            The easiest way to create a gift registry for any occasion
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="p-6 bg-white rounded-2xl border border-wd-border card-glow">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-lg font-bold text-wd-heading mb-2 font-display">Item Claiming</h3>
            <p className="text-wd-charcoal/60 text-sm">
              Friends claim items they want to buy. Once claimed, everyone knows &mdash; no more duplicate gifts or awkward returns. Unclaim anytime if plans change.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-wd-border card-glow">
            <div className="text-4xl mb-4">🤫</div>
            <h3 className="text-lg font-bold text-wd-heading mb-2 font-display">Surprise-Safe</h3>
            <p className="text-wd-charcoal/60 text-sm">
              The registry owner can&apos;t see who claimed what &mdash; only whether items are claimed or available. The surprise stays intact while duplicates are prevented.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-wd-border card-glow">
            <div className="text-4xl mb-4">🎉</div>
            <h3 className="text-lg font-bold text-wd-heading mb-2 font-display">Multiple Occasions</h3>
            <p className="text-wd-charcoal/60 text-sm">
              Birthday, wedding, baby shower, Christmas, housewarming, graduation &mdash; WishDrop works for any celebration or gift-giving occasion.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-wd-border card-glow">
            <div className="text-4xl mb-4">🔐</div>
            <h3 className="text-lg font-bold text-wd-heading mb-2 font-display">No Registration</h3>
            <p className="text-wd-charcoal/60 text-sm">
              No sign-ups, no accounts. Simple code-based login keeps things easy. Optionally use email magic links for an even smoother experience.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-wd-border card-glow">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-lg font-bold text-wd-heading mb-2 font-display">Price Tracking</h3>
            <p className="text-wd-charcoal/60 text-sm">
              Add prices to items in any currency &mdash; USD, EUR, GBP, ZAR, and more. Set priority levels so friends know what matters most to you.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-wd-border card-glow">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-lg font-bold text-wd-heading mb-2 font-display">Mobile Friendly</h3>
            <p className="text-wd-charcoal/60 text-sm">
              Designed mobile-first with large touch targets and responsive layouts. Create registries, browse wishlists, and claim gifts from any device.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
