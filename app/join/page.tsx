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
    <div className="min-h-screen flex items-center justify-center bg-wd-dark p-4">
      <div className="bg-wd-dark-card p-8 rounded-2xl border border-white/10 card-glow w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🎁</div>
          <h1 className="text-3xl font-bold wd-gradient-text mb-2 font-display">
            Join a Registry
          </h1>
          <p className="text-gray-400 text-sm">
            Enter the invite code you received
          </p>
        </div>

        {!registryInfo ? (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <label htmlFor="inviteCode" className="block text-sm font-medium text-gray-300 mb-2">
                Invite Code
              </label>
              <input
                type="text"
                id="inviteCode"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 bg-wd-dark border border-white/10 rounded-lg focus:ring-2 focus:ring-wd-purple focus:border-transparent text-center font-mono text-2xl tracking-wider text-wd-snow"
                placeholder="XXXXXX"
                maxLength={6}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                6-character code provided by the registry owner
              </p>
            </div>

            {error && (
              <div className="bg-wd-coral/10 border border-wd-coral/30 text-wd-coral px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || inviteCode.length !== 6}
              className="w-full bg-gradient-to-r from-wd-coral to-wd-purple text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transform"
            >
              {loading ? "Verifying..." : "Continue"}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="bg-wd-purple/10 border border-wd-purple/30 p-4 rounded-lg">
              <h2 className="font-semibold text-wd-purple mb-1">
                {occasionEmoji[registryInfo.occasion] || "🎁"} Registry Found!
              </h2>
              <p className="text-wd-snow">{registryInfo.name}</p>
              <p className="text-sm text-gray-400 capitalize">{registryInfo.occasion.replace('_', ' ')}</p>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-gray-300 text-center font-medium">
                How would you like to continue?
              </p>

              <button
                onClick={() => handleProceed("participant")}
                className="w-full bg-gradient-to-r from-wd-coral to-wd-purple text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all duration-300 hover:scale-105 transform"
              >
                Participant Login
              </button>

              <button
                onClick={() => handleProceed("admin")}
                className="w-full bg-white/10 text-wd-snow py-3 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 border border-white/10"
              >
                Admin Portal
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-400 hover:text-wd-gold transition-colors">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
