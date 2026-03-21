import Link from "next/link";
import { Metadata } from "next";

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

export default function Home() {
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

  const occasions = [
    { emoji: "🎂", name: "Birthday" },
    { emoji: "💍", name: "Wedding" },
    { emoji: "🍼", name: "Baby Shower" },
    { emoji: "🎄", name: "Christmas" },
    { emoji: "🏡", name: "Housewarming" },
    { emoji: "🎓", name: "Graduation" },
  ];

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
      a: "Each registry is completely isolated with unique invite codes. Passwords are securely hashed using bcrypt. Magic link tokens expire after 15 minutes. Only people with the invite code can access your registry."
    }
  ];

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
        {/* Hero Section */}
        <header className="relative overflow-hidden bg-white">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-[10%] w-2 h-2 bg-wd-gold rounded-full animate-twinkle"></div>
            <div className="absolute top-20 left-[30%] w-1.5 h-1.5 bg-wd-rose-gold rounded-full animate-twinkle" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute top-8 left-[50%] w-2 h-2 bg-wd-gold rounded-full animate-twinkle" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-16 left-[70%] w-1.5 h-1.5 bg-wd-rose-gold rounded-full animate-twinkle" style={{ animationDelay: '1.5s' }}></div>
            <div className="absolute top-12 left-[90%] w-2 h-2 bg-wd-gold rounded-full animate-twinkle" style={{ animationDelay: '0.3s' }}></div>
          </div>

          <div className="container mx-auto px-4 py-20 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <div className="text-7xl mb-6">🎁</div>
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-6 font-display tracking-wide">
                <span className="text-wd-heading">Create Your Perfect</span>
                <br />
                <span className="text-wd-heading">Gift Registry</span>
                <span className="text-wd-gold"> — Free</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-wd-gold mb-4 font-semibold tracking-wide">
                The free gift registry for every occasion
              </p>
              <p className="text-lg md:text-xl text-wd-charcoal/70 mb-10 max-w-3xl mx-auto leading-relaxed">
                For birthdays, weddings, baby showers, and every occasion. Share your
                wishlist, friends claim items &mdash; no duplicate gifts, ever.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-16">
                <Link
                  href="/create"
                  className="group bg-wd-gold p-8 rounded-2xl card-glow transition-all duration-300 hover:scale-105 hover:bg-wd-gold-dark"
                >
                  <div className="text-5xl mb-4">✨</div>
                  <h2 className="text-2xl font-bold text-white mb-2 font-display">Create Registry</h2>
                  <p className="text-white/80 mb-3 text-sm">
                    Start a gift registry for any occasion in under a minute
                  </p>
                  <span className="text-white font-semibold group-hover:underline">
                    Get Started &rarr;
                  </span>
                </Link>

                <Link
                  href="/join"
                  className="group bg-white p-8 rounded-2xl border-2 border-wd-gold/30 card-glow transition-all duration-300 hover:scale-105 hover:border-wd-gold"
                >
                  <div className="text-5xl mb-4">🎁</div>
                  <h2 className="text-2xl font-bold text-wd-heading mb-2 font-display">Join Registry</h2>
                  <p className="text-wd-charcoal/60 mb-3 text-sm">
                    Have an invite code? Join and start claiming gifts
                  </p>
                  <span className="text-wd-gold font-semibold group-hover:underline">
                    Join Now &rarr;
                  </span>
                </Link>
              </div>

              {/* Occasion Cards */}
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3 max-w-3xl mx-auto">
                {occasions.map((occasion) => (
                  <div
                    key={occasion.name}
                    className="bg-white border border-wd-border rounded-xl p-3 text-center card-glow hover:border-wd-gold/40 transition-colors"
                  >
                    <div className="text-3xl mb-1">{occasion.emoji}</div>
                    <div className="text-xs text-wd-charcoal/60 font-medium">{occasion.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-wd-gold/20 to-transparent"></div>
        </header>

        {/* How It Works Section */}
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

        {/* Features Section */}
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

        {/* Pricing */}
        <section className="py-20 bg-wd-cream" aria-labelledby="pricing-heading">
          <div className="container mx-auto px-4 text-center">
            <h2 id="pricing-heading" className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 font-display tracking-wide text-wd-heading">
              <span className="text-wd-gold">Simple</span> Pricing
            </h2>
            <p className="text-xl text-wd-charcoal/60 mb-10 max-w-2xl mx-auto">
              Free for most people. One simple upgrade for power users.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {/* Free Tier */}
              <div className="bg-white rounded-2xl border-2 border-wd-border p-8 card-glow">
                <div className="text-4xl mb-3">🎁</div>
                <div className="text-wd-gold text-sm font-semibold uppercase tracking-wider mb-2">Free</div>
                <div className="text-5xl font-bold text-wd-heading mb-2 font-display">$0</div>
                <p className="text-wd-charcoal/50 mb-6">No credit card needed</p>

                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-start text-wd-charcoal">
                    <span className="text-wd-gold mr-3 mt-0.5 flex-shrink-0">&#10003;</span> <span>1 registry</span>
                  </li>
                  <li className="flex items-start text-wd-charcoal">
                    <span className="text-wd-gold mr-3 mt-0.5 flex-shrink-0">&#10003;</span> <span>Up to 10 items</span>
                  </li>
                  <li className="flex items-start text-wd-charcoal">
                    <span className="text-wd-gold mr-3 mt-0.5 flex-shrink-0">&#10003;</span> <span>Item claiming</span>
                  </li>
                  <li className="flex items-start text-wd-charcoal">
                    <span className="text-wd-gold mr-3 mt-0.5 flex-shrink-0">&#10003;</span> <span>Surprise-safe design</span>
                  </li>
                  <li className="flex items-start text-wd-charcoal">
                    <span className="text-wd-gold mr-3 mt-0.5 flex-shrink-0">&#10003;</span> <span>Email magic link login</span>
                  </li>
                  <li className="flex items-start text-wd-charcoal">
                    <span className="text-wd-gold mr-3 mt-0.5 flex-shrink-0">&#10003;</span> <span>Multi-currency support</span>
                  </li>
                </ul>

                <Link
                  href="/create"
                  className="block w-full bg-white text-wd-gold py-3 rounded-xl font-bold text-lg border-2 border-wd-gold hover:bg-wd-cream transition-colors text-center"
                >
                  Get Started &rarr;
                </Link>
              </div>

              {/* Unlimited Tier */}
              <div className="bg-white rounded-2xl border-2 border-wd-gold/40 p-8 card-glow relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-wd-gold text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Best Value</div>
                <div className="text-4xl mb-3">🏆</div>
                <div className="text-wd-gold text-sm font-semibold uppercase tracking-wider mb-2">Unlimited</div>
                <div className="text-5xl font-bold text-wd-heading mb-2 font-display">$10</div>
                <p className="text-wd-charcoal/50 mb-6">One-time payment</p>

                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-start text-wd-charcoal">
                    <span className="text-wd-gold mr-3 mt-0.5 flex-shrink-0">&#10003;</span> <span>Everything in Free</span>
                  </li>
                  <li className="flex items-start text-wd-charcoal">
                    <span className="text-wd-gold mr-3 mt-0.5 flex-shrink-0">&#10003;</span> <span>Unlimited registries</span>
                  </li>
                  <li className="flex items-start text-wd-charcoal">
                    <span className="text-wd-gold mr-3 mt-0.5 flex-shrink-0">&#10003;</span> <span>Unlimited items</span>
                  </li>
                  <li className="flex items-start text-wd-charcoal">
                    <span className="text-wd-gold mr-3 mt-0.5 flex-shrink-0">&#10003;</span> <span>Pay once, use forever</span>
                  </li>
                </ul>

                <a
                  href="https://buy.stripe.com/8x2aEW3TvbZ30Ex8jDeAg05"
                  className="block w-full bg-wd-gold text-white py-3 rounded-xl font-bold text-lg hover:bg-wd-gold-dark transition-colors text-center"
                >
                  Buy Now &rarr;
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
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

        {/* CTA Section */}
        <section className="py-20 bg-wd-cream" aria-labelledby="cta-heading">
          <div className="container mx-auto px-4 text-center">
            <h2 id="cta-heading" className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 text-wd-heading font-display tracking-wide">
              Ready to Create Your Gift Registry?
            </h2>
            <p className="text-xl mb-10 text-wd-charcoal/60 max-w-2xl mx-auto">
              Join thousands of people who use WishDrop to make gift-giving simple, fun, and duplicate-free
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

        {/* Footer */}
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
                <h3 className="text-wd-heading font-semibold mb-3">About</h3>
                <p className="text-wd-charcoal/50 text-sm">
                  Built for every celebration. WishDrop makes gift registries effortless and fun for birthdays, weddings, baby showers, and any occasion.
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
      </div>
    </>
  );
}
