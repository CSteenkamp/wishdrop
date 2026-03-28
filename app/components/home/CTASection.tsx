import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-20 bg-wd-cream" aria-labelledby="cta-heading">
      <div className="container mx-auto px-4 text-center">
        <h2 id="cta-heading" className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 text-wd-heading font-display tracking-wide">
          Ready to Create Your Gift Registry?
        </h2>
        <p className="text-xl mb-10 text-wd-charcoal/60 max-w-2xl mx-auto">
          WishDrop makes gift-giving simple, fun, and duplicate-free. Get started in under a minute.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/create"
            className="bg-wd-gold text-white px-8 py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-wd-gold-dark transition-colors hover:scale-105 transform duration-300 min-h-[48px]"
          >
            Create Registry &rarr;
          </Link>
          <Link
            href="/join"
            className="bg-white border-2 border-wd-gold text-wd-gold px-8 py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-wd-cream transition-all hover:scale-105 transform duration-300 min-h-[48px]"
          >
            Join Registry &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
