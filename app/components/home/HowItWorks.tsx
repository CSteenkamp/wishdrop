export default function HowItWorks() {
  return (
    <section className="py-20 bg-wd-cream" aria-labelledby="how-it-works-heading">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 id="how-it-works-heading" className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 font-display tracking-wide text-wd-heading">
            How It Works &mdash; <span className="text-wd-gold">Simple as 1, 2, 3</span>
          </h2>
          <p className="text-xl text-wd-charcoal/60 max-w-3xl mx-auto">
            Create your free gift registry in minutes. No accounts needed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="text-center p-8 bg-white rounded-2xl border border-wd-border card-glow">
            <div className="w-16 h-16 bg-wd-gold/10 rounded-full flex items-center justify-center text-2xl font-bold text-wd-gold mx-auto mb-5 border-2 border-wd-gold/30">1</div>
            <h3 className="text-xl font-bold text-wd-heading mb-3 font-display">Create Your Registry</h3>
            <p className="text-wd-charcoal/60">
              Pick an occasion, name your registry, and start adding wish items with links, prices, and priority levels. Set an admin password to manage everything.
            </p>
          </div>

          <div className="text-center p-8 bg-white rounded-2xl border border-wd-border card-glow">
            <div className="w-16 h-16 bg-wd-gold/10 rounded-full flex items-center justify-center text-2xl font-bold text-wd-gold mx-auto mb-5 border-2 border-wd-gold/30">2</div>
            <h3 className="text-xl font-bold text-wd-heading mb-3 font-display">Share the Link</h3>
            <p className="text-wd-charcoal/60">
              Share the invite code with friends and family. They join with the code &mdash; no sign-ups or accounts required. Everyone gets a simple login code.
            </p>
          </div>

          <div className="text-center p-8 bg-white rounded-2xl border border-wd-border card-glow">
            <div className="w-16 h-16 bg-wd-gold/10 rounded-full flex items-center justify-center text-2xl font-bold text-wd-gold mx-auto mb-5 border-2 border-wd-gold/30">3</div>
            <h3 className="text-xl font-bold text-wd-heading mb-3 font-display">Items Get Claimed</h3>
            <p className="text-wd-charcoal/60">
              Friends browse and claim items they want to buy. No duplicates, and the surprise is preserved &mdash; you can&apos;t see who claimed what!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
