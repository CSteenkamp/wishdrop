"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [groupName, setGroupName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const name = sessionStorage.getItem("groupName");
    const groupId = sessionStorage.getItem("groupId");

    if (!groupId) {
      router.push("/");
      return;
    }

    setGroupName(name || "Your Registry");
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const groupId = sessionStorage.getItem("groupId");

    if (!groupId) {
      setError("No registry selected. Please start over.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, groupId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Authentication failed");
        setLoading(false);
        return;
      }

      sessionStorage.setItem("adminAuth", "true");
      sessionStorage.setItem("groupId", data.group.id);
      sessionStorage.setItem("groupName", data.group.name);
      sessionStorage.setItem("inviteCode", data.group.inviteCode);
      router.push("/admin/dashboard");
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-wd-cream p-4">
      <div className="bg-white p-8 rounded-2xl border border-wd-border card-glow w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🔐</div>
          <h1 className="text-3xl font-bold text-wd-heading mb-2 font-display tracking-wide">Admin Portal</h1>
          {groupName && (
            <p className="text-wd-charcoal/50">{groupName}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-wd-charcoal mb-2">
              Admin Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-wd-border rounded-lg focus:ring-2 focus:ring-wd-gold/40 focus:border-wd-gold text-wd-heading placeholder-wd-charcoal/30"
              placeholder="Enter admin password"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-wd-gold text-white py-3 rounded-xl font-semibold hover:bg-wd-gold-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transform"
          >
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-wd-charcoal/50 hover:text-wd-gold transition-colors">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
