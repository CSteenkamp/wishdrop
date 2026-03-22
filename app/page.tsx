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
  "softwareVersion": "1.0",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "ratingCount": "820",
    "bestRating": "5",
    "worstRating": "1"
  }
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
        "text": "WishDrop is a free online gift registry that works for any occasion — birthdays, weddings, baby showers, housewarmings, graduations, and more. Create a wishlist, share it with friends and family, and they can claim items to prevent duplicate gifts."
      }
    },
    {
      "@type": "Question",
      "name": "How does gift claiming work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "When someone claims a gift on your registry, it's marked as 'claimed' so others know not to buy it. The best part: you (the registry owner) can't see WHO claimed each item, so the surprise is preserved! Other participants can see who claimed what to coordinate."
      }
    },
    {
      "@type": "Question",
      "name": "Is WishDrop really free?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! The free plan gives you 1 registry with up to 10 items. For unlimited registries and items, there's a one-time $10 payment — no subscriptions, no recurring fees."
      }
    },
    {
      "@type": "Question",
      "name": "Do I need to create an account?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No registration is required. Registry creators set an admin password, and participants get unique login codes. You can also use email magic links for passwordless login."
      }
    },
    {
      "@type": "Question",
      "name": "What occasions can I create a registry for?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "WishDrop supports birthdays, weddings, baby showers, Christmas, housewarmings, graduations, and a general 'other' category. You can create a gift registry for literally any occasion."
      }
    },
    {
      "@type": "Question",
      "name": "Can the registry owner see who claimed items?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No! This is a key feature of WishDrop. The registry owner can see which items are claimed vs available, but NOT who claimed them. This preserves the surprise. Other participants CAN see who claimed what to avoid duplicates."
      }
    },
    {
      "@type": "Question",
      "name": "Can I unclaim an item if I change my mind?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, you can unclaim any item you've previously claimed. Just click the 'Unclaim' button and the item becomes available for others again."
      }
    },
    {
      "@type": "Question",
      "name": "Does WishDrop support different currencies?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! You can add prices to items in multiple currencies including USD, EUR, GBP, ZAR, and many more. You can also set a gift budget for the registry in any supported currency."
      }
    },
    {
      "@type": "Question",
      "name": "Is WishDrop mobile-friendly?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutely! WishDrop is designed mobile-first with touch-friendly buttons and responsive layouts. Create registries, browse items, and claim gifts from any device."
      }
    },
    {
      "@type": "Question",
      "name": "How do I share my registry?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "When you create a registry, you get a unique 6-character invite code. Share this code with friends and family — they enter it on the Join page to access your registry and start claiming items."
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
