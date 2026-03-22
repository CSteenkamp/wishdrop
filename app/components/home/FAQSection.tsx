const faqs = [
  {
    q: "What is WishDrop?",
    a: "WishDrop is a free online gift registry that works for any occasion — birthdays, weddings, baby showers, housewarmings, graduations, and more. Create a wishlist, share it with friends and family, and they can claim items to prevent duplicate gifts. No accounts or registration needed."
  },
  {
    q: "How does gift claiming work?",
    a: "When someone views your registry, they can click 'Claim This Gift' on any item. Once claimed, it's marked so others know not to buy it. The best part: you (the registry owner) can't see WHO claimed each item — so the surprise is always preserved! Other participants can see who claimed what to help coordinate."
  },
  {
    q: "Is WishDrop really free?",
    a: "Yes! The free plan gives you 1 registry with up to 10 items — perfect for most occasions. Need more? Unlock unlimited registries and items with a one-time $10 payment. No subscriptions, no recurring fees, no hidden costs."
  },
  {
    q: "Do I need to create an account or register?",
    a: "No registration is required! Registry creators set an admin password during creation. Participants receive unique login codes from the admin. You can also optionally use email magic links for passwordless login."
  },
  {
    q: "What occasions can I create a registry for?",
    a: "WishDrop supports birthdays, weddings, baby showers, Christmas, housewarmings, graduations, and a general category for any other occasion. Whether it's a retirement party, anniversary, or just because — WishDrop has you covered."
  },
  {
    q: "Can the registry owner see who claimed which items?",
    a: "No — and that's by design! The registry owner can see which items are claimed vs. available, but NOT who claimed them. This preserves the surprise element. Other participants can see who claimed what, which helps prevent duplicate purchases."
  },
  {
    q: "Can I unclaim an item if I change my mind?",
    a: "Absolutely! If you've claimed an item and change your mind, just click 'Unclaim' and the item becomes available for others again. Only the person who claimed an item can unclaim it."
  },
  {
    q: "Can I add prices and links to my wish items?",
    a: "Yes! Each item can include a title, product link, price, currency, and priority level (low, medium, high). Add as much or as little detail as you want to help your gift-givers find the perfect present."
  },
  {
    q: "Does WishDrop support different currencies?",
    a: "Yes! You can add prices in multiple currencies including USD, EUR, GBP, ZAR, CAD, AUD, JPY, and many more. You can also set a gift budget for the entire registry in any supported currency."
  },
  {
    q: "Is WishDrop mobile-friendly?",
    a: "WishDrop is designed mobile-first with touch-friendly claim buttons and responsive layouts that work beautifully on phones, tablets, and desktops. Create registries, browse items, and claim gifts from any device."
  },
  {
    q: "How do I share my registry with friends?",
    a: "When you create a registry, you get a unique 6-character invite code. Share this code with friends and family via text, email, or social media. They enter the code on the Join page to access your registry and start claiming items."
  },
  {
    q: "Is my data secure and private?",
    a: "Each registry is completely isolated with unique invite codes. Passwords are securely hashed using bcrypt. Magic link tokens expire after 15 minutes and can only be used once. All sessions use HTTP-only cookies for protection against XSS attacks."
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
