import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-wd-light-bg py-12 border-t border-wd-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="text-2xl font-bold mb-3 font-display">
              <span className="text-wd-gold">WishDrop</span>{" "}
              <span>🎁</span>
            </div>
            <p className="text-wd-charcoal/50 text-sm">
              The free gift registry for every occasion. Create wishlists, share with friends, and claim items to avoid duplicate gifts.
            </p>
          </div>

          <div>
            <h3 className="text-wd-heading font-semibold mb-3">Quick Links</h3>
            <nav aria-label="Footer navigation">
              <ul className="space-y-2">
                <li><Link href="/create" className="text-wd-charcoal/50 hover:text-wd-gold transition-colors text-sm">Create Registry</Link></li>
                <li><Link href="/join" className="text-wd-charcoal/50 hover:text-wd-gold transition-colors text-sm">Join Registry</Link></li>
                <li><Link href="/login" className="text-wd-charcoal/50 hover:text-wd-gold transition-colors text-sm">Participant Login</Link></li>
                <li><a href="#pricing-heading" className="text-wd-charcoal/50 hover:text-wd-gold transition-colors text-sm">Pricing</a></li>
              </ul>
            </nav>
          </div>

          <div>
            <h3 className="text-wd-heading font-semibold mb-3">Legal</h3>
            <nav aria-label="Legal links">
              <ul className="space-y-2">
                <li><Link href="/terms" className="text-wd-charcoal/50 hover:text-wd-gold transition-colors text-sm">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-wd-charcoal/50 hover:text-wd-gold transition-colors text-sm">Privacy Policy</Link></li>
                <li>
                  <a href="mailto:2flippingeasy@gmail.com" className="text-wd-charcoal/50 hover:text-wd-gold transition-colors text-sm">
                    Contact Us
                  </a>
                </li>
              </ul>
            </nav>
            <p className="text-wd-charcoal/50 text-sm mt-4">
              Built for every celebration.
            </p>
          </div>
        </div>

        <div className="border-t border-wd-border pt-6 text-center">
          <p className="text-wd-charcoal/40 text-sm">
            &copy; {new Date().getFullYear()} WishDrop &bull; The Free Gift Registry for Every Occasion &bull;{" "}
            <a href="https://wishdrop.wagnerway.co.za" className="text-wd-gold hover:text-wd-gold-dark transition-colors">
              wishdrop.wagnerway.co.za
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
