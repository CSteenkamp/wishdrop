"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface WishlistItem {
  id: string;
  title: string;
  link: string;
  imageUrl?: string | null;
  price?: number | null;
  currency?: string;
  priority?: string;
  categoryId?: string | null;
  claimedById?: string | null;
}

interface CashFund {
  id: string;
  title: string;
  description?: string | null;
  targetAmount?: number | null;
  currency: string;
  totalRaised: number;
  contributorCount: number;
}

interface Category {
  id: string;
  name: string;
}

interface RegistryData {
  id: string;
  name: string;
  slug?: string;
  inviteCode: string;
  occasion: string;
  eventDate?: string;
  coverImage?: string | null;
  description?: string | null;
  coupleName1?: string | null;
  coupleName2?: string | null;
  personalMessage?: string | null;
  categories: Category[];
  participants: { id: string; name: string; wishlistItems: WishlistItem[] }[];
  cashFunds: CashFund[];
  stats: { totalItems: number; claimedItems: number; participantCount: number };
}

const occasionEmojis: Record<string, string> = {
  birthday: "🎂",
  wedding: "💍",
  baby_shower: "🍼",
  christmas: "🎄",
  housewarming: "🏡",
  graduation: "🎓",
  other: "🎁",
};

export default function PublicRegistryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [registry, setRegistry] = useState<RegistryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/registry/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Registry not found");
        return res.json();
      })
      .then((data) => {
        setRegistry(data.registry);
        setLoading(false);
      })
      .catch(() => {
        setError("Registry not found");
        setLoading(false);
      });
  }, [slug]);

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: registry?.name || "Gift Registry",
        text: registry?.personalMessage || `Check out ${registry?.name}!`,
        url: window.location.href,
      });
    } else {
      handleCopyLink();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-wd-cream">
        <div className="text-xl text-wd-gold">Loading registry...</div>
      </div>
    );
  }

  if (error || !registry) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-wd-cream">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-wd-heading mb-2">Registry Not Found</h1>
          <p className="text-wd-charcoal/60 mb-6">This registry doesn&apos;t exist or may have been removed.</p>
          <Link href="/" className="bg-wd-gold text-white px-6 py-3 rounded-xl font-semibold hover:bg-wd-gold-dark transition">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const allItems = registry.participants.flatMap((p) =>
    p.wishlistItems.map((item) => ({ ...item, ownerName: p.name }))
  );

  const filteredItems = activeCategory
    ? allItems.filter((item) => item.categoryId === activeCategory)
    : allItems;

  const availableItems = filteredItems.filter((i) => !i.claimedById);
  const eventDate = registry.eventDate ? new Date(registry.eventDate) : null;
  const daysUntil = eventDate
    ? Math.ceil((eventDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const coupleDisplay = registry.coupleName1 && registry.coupleName2
    ? `${registry.coupleName1} & ${registry.coupleName2}`
    : null;

  return (
    <div className="min-h-screen bg-wd-cream">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-wd-gold/20 via-wd-cream to-wd-rose-gold/20 py-12 px-4">
        {registry.coverImage && (
          <div className="absolute inset-0 opacity-20">
            <img src={registry.coverImage} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="text-5xl mb-3">{occasionEmojis[registry.occasion] || "🎁"}</div>
          {coupleDisplay && (
            <p className="text-wd-gold font-display text-lg mb-1">{coupleDisplay}</p>
          )}
          <h1 className="text-3xl sm:text-5xl font-bold text-wd-heading font-display tracking-wide mb-3">
            {registry.name}
          </h1>
          {registry.description && (
            <p className="text-wd-charcoal/70 max-w-lg mx-auto mb-3">{registry.description}</p>
          )}
          {registry.personalMessage && (
            <p className="text-wd-charcoal/60 italic max-w-lg mx-auto mb-4">&ldquo;{registry.personalMessage}&rdquo;</p>
          )}

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            {eventDate && (
              <span className="bg-white/80 border border-wd-border px-3 py-1.5 rounded-full">
                {eventDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                {daysUntil !== null && daysUntil > 0 && (
                  <span className="text-wd-gold ml-1">({daysUntil} days away)</span>
                )}
              </span>
            )}
            <span className="bg-white/80 border border-wd-border px-3 py-1.5 rounded-full">
              {registry.stats.totalItems} items &bull; {registry.stats.claimedItems} claimed
            </span>
            <span className="bg-white/80 border border-wd-border px-3 py-1.5 rounded-full">
              {registry.stats.participantCount} participants
            </span>
          </div>

          {/* Share buttons */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={handleShare}
              className="bg-wd-gold text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-wd-gold-dark transition inline-flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
              Share
            </button>
            <button
              onClick={handleCopyLink}
              className="bg-white text-wd-charcoal px-5 py-2.5 rounded-xl font-semibold hover:bg-wd-cream transition border border-wd-border inline-flex items-center gap-2"
            >
              {copied ? "Copied!" : "Copy Link"}
            </button>
            <Link
              href={`/join`}
              className="bg-white text-wd-gold px-5 py-2.5 rounded-xl font-semibold hover:bg-wd-cream transition border border-wd-gold/30 inline-flex items-center gap-2"
            >
              Join Registry
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Cash Funds */}
        {registry.cashFunds.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-wd-heading font-display mb-4">Contribution Funds</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {registry.cashFunds.map((fund) => {
                const progress = fund.targetAmount ? Math.min((fund.totalRaised / fund.targetAmount) * 100, 100) : null;
                return (
                  <div key={fund.id} className="bg-white p-5 rounded-2xl border border-wd-border card-glow">
                    <h3 className="font-semibold text-wd-heading text-lg mb-1">{fund.title}</h3>
                    {fund.description && <p className="text-sm text-wd-charcoal/60 mb-3">{fund.description}</p>}
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-2xl font-bold text-wd-gold">{fund.currency} {fund.totalRaised.toFixed(0)}</span>
                      {fund.targetAmount && (
                        <span className="text-sm text-wd-charcoal/50">of {fund.currency} {fund.targetAmount} goal</span>
                      )}
                    </div>
                    {progress !== null && (
                      <div className="w-full bg-wd-cream rounded-full h-2.5 mb-2">
                        <div className="bg-wd-gold h-2.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
                      </div>
                    )}
                    <p className="text-xs text-wd-charcoal/50">{fund.contributorCount} contributor{fund.contributorCount !== 1 ? "s" : ""}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Category Filters */}
        {registry.categories.length > 0 && (
          <div className="flex gap-2 mb-6 flex-wrap">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                !activeCategory ? "bg-wd-gold text-white" : "bg-white text-wd-charcoal/50 hover:bg-wd-cream border border-wd-border"
              }`}
            >
              All Items
            </button>
            {registry.categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  activeCategory === cat.id ? "bg-wd-gold text-white" : "bg-white text-wd-charcoal/50 hover:bg-wd-cream border border-wd-border"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Wishlist Items */}
        <h2 className="text-2xl font-bold text-wd-heading font-display mb-4">
          Wishlist ({availableItems.length} available of {filteredItems.length})
        </h2>

        {filteredItems.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-wd-border card-glow text-center">
            <div className="text-6xl mb-4">🎁</div>
            <p className="text-wd-heading text-lg">No items yet.</p>
            <p className="text-sm text-wd-charcoal/50 mt-2">Join the registry to add your own wishlist!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`bg-white p-4 rounded-2xl border card-glow ${
                  item.claimedById ? "border-emerald-200 opacity-75" : "border-wd-border"
                }`}
              >
                {item.imageUrl && (
                  <div className="w-full h-40 rounded-lg overflow-hidden mb-3 bg-wd-cream">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <p className="text-xs text-wd-gold font-medium mb-1">For {item.ownerName}</p>
                <h3 className="font-semibold text-wd-heading truncate">{item.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  {item.price && (
                    <span className="text-wd-gold font-semibold text-sm">{item.currency || "USD"} {item.price}</span>
                  )}
                  {item.link && (
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-sm text-wd-gold hover:underline">
                      View
                    </a>
                  )}
                </div>
                {item.claimedById && (
                  <div className="mt-2 bg-emerald-50 text-emerald-600 text-xs px-2 py-1 rounded-full inline-block border border-emerald-200">
                    Claimed
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Join CTA */}
        <div className="mt-12 text-center bg-white p-8 rounded-2xl border border-wd-border card-glow">
          <h2 className="text-2xl font-bold text-wd-heading font-display mb-2">Want to claim a gift?</h2>
          <p className="text-wd-charcoal/60 mb-4">Join the registry with the invite code to claim items and add your own wishlist.</p>
          <div className="inline-flex items-center gap-2 bg-wd-cream border border-wd-border px-4 py-2 rounded-lg mb-4">
            <span className="text-sm text-wd-charcoal/60">Invite Code:</span>
            <code className="font-mono text-wd-gold font-bold text-lg">{registry.inviteCode}</code>
          </div>
          <div>
            <Link
              href="/join"
              className="inline-block bg-wd-gold text-white px-8 py-3 rounded-xl font-semibold hover:bg-wd-gold-dark transition"
            >
              Join This Registry
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-6 text-sm text-wd-charcoal/40">
        Powered by <Link href="/" className="text-wd-gold hover:underline">WishDrop</Link>
      </div>
    </div>
  );
}
