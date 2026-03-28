const faqs = [
  {
    q: "What is WishDrop?",
    a: "WishDrop is a free online gift registry that works for any occasion — birthdays, weddings, baby showers, anniversaries, honeymoons, and more. Create a wishlist, share it with friends and family, and they can claim items to prevent duplicate gifts."
  },
  {
    q: "How does gift claiming work?",
    a: "Guests join your registry with an invite code or shareable link, then log in with a simple login code (no sign-ups needed). Once in, they can click 'Claim This Gift' on any item. By default, you (the registry owner) can't see WHO claimed each item — so the surprise is preserved. Other participants can see who claimed what to help coordinate. After the event, you can optionally turn on Reveal Mode to see who gave what for thank-you notes."
  },
  {
    q: "Is WishDrop really free?",
    a: "Yes! The free plan gives you 1 registry with up to 10 items and 10 participants — perfect for most occasions. Need more? The Unlimited plan ($10 one-time) unlocks unlimited registries, items, and participants, plus premium features like co-admins, RSVP tracking, analytics, and CSV export. No subscriptions, no recurring fees."
  },
  {
    q: "How do participants join and log in?",
    a: "No traditional sign-up is required. The registry admin adds participants and each person gets a unique login code. They enter the invite code to find the registry, then use their login code to log in. Optionally, participants with an email address can use a magic link for passwordless login."
  },
  {
    q: "What occasions can I create a registry for?",
    a: "WishDrop supports birthdays, weddings, baby showers, anniversaries, honeymoons, housewarmings, and a general category for any other occasion. Whether it's a retirement party, holiday, or just because — WishDrop has you covered."
  },
  {
    q: "Can the registry owner see who claimed which items?",
    a: "By default, no — the registry owner can see which items are claimed vs. available, but NOT who claimed them. This preserves the surprise. After the event, you can turn on Reveal Mode in the admin dashboard to see who claimed each item, along with any personal notes they left. This is great for writing thank-you notes."
  },
  {
    q: "Can I unclaim an item if I change my mind?",
    a: "Absolutely! If you've claimed an item and change your mind, just click 'Unclaim' and the item becomes available for others again. Only the person who claimed an item can unclaim it."
  },
  {
    q: "What details can I add to wish items?",
    a: "Each item can include a title, product link, image URL, price, currency, priority level (low, medium, high), and a category. Guests can also leave a personal note when claiming a gift. Add as much or as little detail as you want."
  },
  {
    q: "Does WishDrop support different currencies?",
    a: "Yes! You can add prices in 18 currencies including USD, EUR, GBP, ZAR, CAD, AUD, JPY, and more. You can also set a gift budget for the entire registry in any supported currency."
  },
  {
    q: "Is WishDrop mobile-friendly?",
    a: "WishDrop is designed mobile-first with touch-friendly buttons and responsive layouts that work beautifully on phones, tablets, and desktops. Create registries, browse items, and claim gifts from any device."
  },
  {
    q: "How do I share my registry with friends?",
    a: "Every registry gets a shareable link and a 6-character invite code. Copy the link and send it to friends via text, email, or wherever you like. They can also enter the invite code on the Join page to access your registry and start claiming items."
  },
  {
    q: "Is my data secure and private?",
    a: "Each registry is completely isolated with unique invite codes. Admin passwords are securely hashed using bcrypt. Magic link tokens expire after 15 minutes and can only be used once. All sessions use HTTP-only cookies for protection against XSS attacks."
  }
];

export default function FAQSection() {
  return (
    <section className="py-20 bg-white" aria-labelledby="faq-heading">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 id="faq-heading" className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 font-display tracking-wide text-wd-heading">
            Frequently Asked <span className="text-wd-gold">Questions</span>
          </h2>
          <p className="text-xl text-wd-charcoal/60 max-w-3xl mx-auto">
            Everything you need to know about WishDrop
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group bg-white rounded-xl border border-wd-border overflow-hidden"
            >
              <summary className="cursor-pointer p-6 flex items-center justify-between font-semibold text-wd-heading hover:text-wd-gold transition-colors">
                <span className="pr-4">{faq.q}</span>
                <span className="text-wd-gold flex-shrink-0 text-xl group-open:rotate-45 transition-transform duration-200">+</span>
              </summary>
              <div className="px-6 pb-6 text-wd-charcoal/60 leading-relaxed border-t border-wd-border pt-4">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
