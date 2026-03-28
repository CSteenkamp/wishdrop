import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service - WishDrop",
  description: "WishDrop Terms of Service — the rules and guidelines for using our gift registry platform.",
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-wd-cream">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link href="/" className="text-sm text-wd-gold hover:underline mb-8 inline-block">&larr; Back to Home</Link>

        <h1 className="text-4xl font-bold text-wd-heading font-display mb-2">Terms of Service</h1>
        <p className="text-sm text-wd-charcoal/50 mb-10">Last updated: March 28, 2026</p>

        <div className="prose-sm space-y-8 text-wd-charcoal/80 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-wd-heading mb-3">1. Agreement to Terms</h2>
            <p>By accessing or using WishDrop (&ldquo;the Service&rdquo;), operated at wishdrop.wagnerway.co.za, you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-wd-heading mb-3">2. Description of Service</h2>
            <p>WishDrop is an online gift registry platform that allows users to create wishlists, share them with others, and coordinate gift-giving through item claiming. The Service includes a free tier and a paid &ldquo;Unlimited&rdquo; tier.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-wd-heading mb-3">3. User Responsibilities</h2>
            <p>You are responsible for:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Keeping your admin password and login codes secure.</li>
              <li>Any activity that occurs under your registry or login credentials.</li>
              <li>Ensuring that information you provide is accurate and not misleading.</li>
              <li>Not using the Service for unlawful purposes.</li>
              <li>Not attempting to gain unauthorized access to other registries.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-wd-heading mb-3">4. Gift Funds & Payments</h2>
            <p><strong>WishDrop does not process, hold, or transfer money between guests and registry owners.</strong> The cash fund feature allows guests to pledge contribution amounts. Actual payment is arranged directly between the guest and the registry owner through their preferred payment method (bank transfer, PayPal, cash, etc.).</p>
            <p className="mt-2">WishDrop bears no responsibility for pledges that are not fulfilled, payments that fail, or disputes between guests and registry owners regarding contributions.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-wd-heading mb-3">5. Paid Plans & Refunds</h2>
            <p>The Unlimited plan is a one-time payment of $10 USD processed through Stripe. This payment is for access to premium features and is <strong>non-refundable</strong> except where required by applicable law.</p>
            <p className="mt-2">WishDrop reserves the right to change pricing for future purchases. Existing purchases are not affected by price changes.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-wd-heading mb-3">6. Intellectual Property</h2>
            <p>The WishDrop name, logo, and platform design are the property of WishDrop. Content you create (registry names, item descriptions, personal messages) remains yours. By using the Service, you grant WishDrop a limited license to display your content as part of the Service&apos;s functionality.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-wd-heading mb-3">7. Prohibited Conduct</h2>
            <p>You may not:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Use the Service to harass, abuse, or harm others.</li>
              <li>Create registries for fraudulent purposes.</li>
              <li>Attempt to reverse-engineer, scrape, or disrupt the Service.</li>
              <li>Upload malicious content or attempt to exploit vulnerabilities.</li>
              <li>Resell or commercially redistribute the Service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-wd-heading mb-3">8. Data & Registry Deletion</h2>
            <p>Registries and associated data may be deleted after 12 months of inactivity. If you wish to delete your registry and all associated data immediately, contact us. We will process deletion requests within 30 days.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-wd-heading mb-3">9. Disclaimer of Warranties</h2>
            <p>The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind, either express or implied. WishDrop does not guarantee that the Service will be uninterrupted, error-free, or secure at all times.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-wd-heading mb-3">10. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, WishDrop shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service, including but not limited to lost gifts, failed pledges, or data loss.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-wd-heading mb-3">11. Third-Party Services</h2>
            <p>WishDrop integrates with third-party services including Stripe (payment processing) and email providers. Your use of these services is subject to their respective terms and privacy policies. WishDrop is not responsible for the actions of third-party services.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-wd-heading mb-3">12. Changes to Terms</h2>
            <p>We may update these Terms from time to time. Continued use of the Service after changes constitutes acceptance of the revised Terms. Material changes will be communicated through the Service.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-wd-heading mb-3">13. Governing Law</h2>
            <p>These Terms are governed by the laws of the Republic of South Africa. Any disputes will be subject to the jurisdiction of the South African courts.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-wd-heading mb-3">14. Contact</h2>
            <p>For questions about these Terms, contact us at the address provided on our website.</p>
          </section>

        </div>

        <div className="mt-12 pt-6 border-t border-wd-border text-center">
          <Link href="/privacy" className="text-sm text-wd-gold hover:underline">Privacy Policy</Link>
          <span className="text-wd-charcoal/30 mx-3">&bull;</span>
          <Link href="/" className="text-sm text-wd-gold hover:underline">Home</Link>
        </div>
      </div>
    </div>
  );
}
