import { Metadata } from "next";
import HeroSection from "./components/home/HeroSection";
import HowItWorks from "./components/home/HowItWorks";
import FeaturesSection from "./components/home/FeaturesSection";
import PricingSection from "./components/home/PricingSection";
import FAQSection from "./components/home/FAQSection";
import CTASection from "./components/home/CTASection";
import Footer from "./components/home/Footer";

export const metadata: Metadata = {
  title: "WishDrop - The Free Gift Registry for Every Occasion | Online Wishlist Maker",
  description: "Free online gift registry for birthdays, weddings, baby showers, and every occasion. Create wishlists, share with friends, claim items to avoid duplicates. No registration required!",
  keywords: "free gift registry, online wishlist, birthday gift registry, wedding registry free, baby shower registry, gift list maker, wishlist creator, gift claiming, no duplicate gifts, housewarming registry, graduation gifts",
  openGraph: {
    title: "WishDrop - The Free Gift Registry for Every Occasion",
    description: "Create gift registries for any occasion. Share your wishlist, friends claim items — no duplicate gifts, ever!",
    url: "https://wishdrop.wagnerway.co.za",
    siteName: "WishDrop",
    type: "website",
    images: [
      {
        url: "https://wishdrop.wagnerway.co.za/og-image.png",
        width: 1200,
        height: 630,
        alt: "WishDrop - The Free Gift Registry for Every Occasion"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "WishDrop - The Free Gift Registry for Every Occasion",
    description: "Create gift registries for any occasion. Share your wishlist, friends claim items — no duplicate gifts!",
    images: ["https://wishdrop.wagnerway.co.za/og-image.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://wishdrop.wagnerway.co.za"
  }
};

const webAppStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "WishDrop",
  "description": "Free online gift registry for birthdays, weddings, baby showers, and every occasion. Create wishlists, share with friends, and claim items to avoid duplicate gifts.",
  "url": "https://wishdrop.wagnerway.co.za",
  "applicationCategory": "Lifestyle",
  "operatingSystem": "All",
  "offers": [
    {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "description": "Free plan — 1 registry, 10 items"
    },
    {
      "@type": "Offer",
      "price": "10",
      "priceCurrency": "USD",
      "description": "Unlimited plan — unlimited registries and items, one-time payment"
    }
  ],
  "featureList": [
    "Item claiming to prevent duplicate gifts",
    "Surprise-safe: owner can't see who claimed what",
    "Multiple occasion types",
    "No registration required",
    "Price tracking with multi-currency",
    "Priority levels for items",
    "Mobile-friendly responsive design",
    "Email magic link authentication"
  ],
  "provider": {
    "@type": "Organization",
    "name": "WishDrop",
    "url": "https://wishdrop.wagnerway.co.za"
  },
  "screenshot": "https://wishdrop.wagnerway.co.za/og-image.png",
  "softwareVersion": "1.0"
};

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is WishDrop?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "WishDrop is a free online gift registry that works for any occasion — birthdays, weddings, baby showers, anniversaries, honeymoons, and more. Create a wishlist, share it with friends and family, and they can claim items to prevent duplicate gifts."
      }
    },
    {
      "@type": "Question",
      "name": "How does gift claiming work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Guests join your registry with an invite code, then log in with a simple login code. They can click 'Claim This Gift' on any item. By default, you (the registry owner) can't see who claimed each item. After the event, you can turn on Reveal Mode to see who gave what for thank-you notes."
      }
    },
    {
      "@type": "Question",
      "name": "Is WishDrop really free?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! The free plan gives you 1 registry with up to 10 items and 10 participants. The Unlimited plan ($10 one-time) unlocks unlimited registries, items, and participants plus premium features. No subscriptions, no recurring fees."
      }
    },
    {
      "@type": "Question",
      "name": "How do participants join and log in?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No traditional sign-up is required. The registry admin adds participants and each person gets a unique login code. Optionally, participants with an email can use a magic link for passwordless login."
      }
    },
    {
      "@type": "Question",
      "name": "What occasions can I create a registry for?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "WishDrop supports birthdays, weddings, baby showers, anniversaries, honeymoons, housewarmings, and a general category for any other occasion."
      }
    },
    {
      "@type": "Question",
      "name": "Can the registry owner see who claimed items?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "By default, no — the registry owner can see which items are claimed vs available, but NOT who claimed them. After the event, you can turn on Reveal Mode to see who claimed each item for writing thank-you notes."
      }
    },
    {
      "@type": "Question",
      "name": "Can I unclaim an item if I change my mind?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, you can unclaim any item you've previously claimed. Just click the 'Unclaim' button and the item becomes available for others again. Only the person who claimed it can unclaim it."
      }
    },
    {
      "@type": "Question",
      "name": "Does WishDrop support different currencies?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! You can add prices in 18 currencies including USD, EUR, GBP, ZAR, and many more. You can also set a gift budget for the registry in any supported currency."
      }
    },
    {
      "@type": "Question",
      "name": "Is WishDrop mobile-friendly?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "WishDrop is designed mobile-first with touch-friendly buttons and responsive layouts. Create registries, browse items, and claim gifts from any device."
      }
    },
    {
      "@type": "Question",
      "name": "How do I share my registry?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Every registry gets a shareable link and a 6-character invite code. Copy the link and send it to friends via text, email, or wherever you like. They can also enter the invite code on the Join page to access your registry."
      }
    }
  ]
};

const howToStructuredData = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Create a Free Gift Registry with WishDrop",
  "description": "Step-by-step guide to creating and sharing a gift registry for any occasion using WishDrop.",
  "totalTime": "PT3M",
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "USD",
    "value": "0"
  },
  "step": [
    {
      "@type": "HowToStep",
      "name": "Create Your Registry",
      "text": "Visit WishDrop and click 'Create Registry'. Choose your occasion, name your registry, set an admin password, and add your wish items with links and prices.",
      "url": "https://wishdrop.wagnerway.co.za/create",
      "position": 1
    },
    {
      "@type": "HowToStep",
      "name": "Share the Invite Code",
      "text": "Share the unique 6-character invite code with friends and family. They join by entering the code — no accounts needed.",
      "url": "https://wishdrop.wagnerway.co.za/join",
      "position": 2
    },
    {
      "@type": "HowToStep",
      "name": "Friends Claim Items",
      "text": "Friends browse your wishlist and claim items they want to buy. Claims are visible to other friends but hidden from you, preserving the surprise while preventing duplicate gifts.",
      "url": "https://wishdrop.wagnerway.co.za/wishlist",
      "position": 3
    }
  ]
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToStructuredData) }}
      />

      <div className="min-h-screen bg-white text-wd-charcoal overflow-x-hidden">
        <HeroSection />
        <HowItWorks />
        <FeaturesSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
        <Footer />
      </div>
    </>
  );
}
