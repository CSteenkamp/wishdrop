"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const occasionEmoji: Record<string, string> = {
  birthday: "🎂",
  wedding: "💍",
  baby_shower: "🍼",
  christmas: "🎄",
  housewarming: "🏡",
  graduation: "🎓",
  other: "🎁",
};

export default function JoinRegistry() {
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registryInfo, setRegistryInfo] = useState<{ id: string; name: string; occasion: string; eventDate?: string } | null>(null);
  const router = useRouter();

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/groups/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteCode: inviteCode.trim().toUpperCase() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid invite code");
        setLoading(false);
        return;
      }

      setRegistryInfo(data.group);
      setLoading(false);
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleProceed = (type: "admin" | "participant") => {
    if (!registryInfo) return;

    sessionStorage.setItem("groupId", registryInfo.id);
    sessionStorage.setItem("groupName", registryInfo.name);
    sessionStorage.setItem("inviteCode", inviteCode.toUpperCase());

    if (type === "admin") {
      router.push("/admin");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-wd-cream p-4">
      <div className="bg-white p-8 rounded-2xl border border-wd-border card-glow w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🎁</div>
          <h1 className="text-3xl font-bold text-wd-heading mb-2 font-display tracking-wide">
            Join a Registry
          </h1>
          <p className="text-wd-charcoal/50 text-sm">
            Enter the invite code you received
          </p>
        </div>

        {!registryInfo ? (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <label htmlFor="inviteCode" className="block text-sm font-medium text-wd-charcoal mb-2">
                Invite Code
              </label>
              <input
                type="text"
                id="inviteCode"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 bg-white border border-wd-border rounded-lg focus:ring-2 focus:ring-wd-gold/40 focus:border-wd-gold text-center font-mono text-2xl tracking-wider text-wd-heading"
                placeholder="XXXXXX"
                maxLength={6}
                required
              />
              <p className="text-xs text-wd-charcoal/40 mt-1">
                6-character code provided by the registry owner
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || inviteCode.length !== 6}
              className="w-full bg-wd-gold text-white py-3 rounded-xl font-semibold hover:bg-wd-gold-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transform"
            >
              {loading ? "Verifying..." : "Continue"}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="bg-wd-gold/10 border border-wd-gold/30 p-4 rounded-lg">
              <h2 className="font-semibold text-wd-gold mb-1">
                {occasionEmoji[registryInfo.occasion] || "🎁"} Registry Found!
              </h2>
              <p className="text-wd-heading">{registryInfo.name}</p>
              <p className="text-sm text-wd-charcoal/50 capitalize">{registryInfo.occasion.replace('_', ' ')}</p>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-wd-charcoal text-center font-medium">
                How would you like to continue?
              </p>

              <button
                onClick={() => handleProceed("participant")}
                className="w-full bg-wd-gold text-white py-3 rounded-xl font-semibold hover:bg-wd-gold-dark transition-all duration-300 hover:scale-105 transform"
              >
                Participant Login
              </button>

              <button
                onClick={() => handleProceed("admin")}
                className="w-full bg-white text-wd-charcoal py-3 rounded-xl font-semibold hover:bg-wd-cream transition-all duration-300 border border-wd-border"
              >
                Admin Portal
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-wd-charcoal/50 hover:text-wd-gold transition-colors">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
