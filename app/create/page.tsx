"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateRegistry() {
  const [registryName, setRegistryName] = useState("");
  const [occasion, setOccasion] = useState("other");
  const [eventDate, setEventDate] = useState("");
  const [description, setDescription] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const occasions = [
    { value: "birthday", label: "Birthday 🎂" },
    { value: "wedding", label: "Wedding 💍" },
    { value: "baby_shower", label: "Baby Shower 🍼" },
    { value: "christmas", label: "Christmas 🎄" },
    { value: "housewarming", label: "Housewarming 🏡" },
    { value: "graduation", label: "Graduation 🎓" },
    { value: "other", label: "Other 🎁" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!registryName.trim()) {
      setError("Registry name is required");
      setLoading(false);
      return;
    }

    if (adminPassword.length < 6) {
      setError("Admin password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (adminPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/groups/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupName: registryName,
          adminPassword,
          occasion,
          eventDate: eventDate || undefined,
          description: description || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create registry");
        setLoading(false);
        return;
      }

      sessionStorage.setItem("groupId", data.group.id);
      sessionStorage.setItem("groupName", data.group.name);
      sessionStorage.setItem("inviteCode", data.group.inviteCode);
      sessionStorage.setItem("adminAuth", "pending");

      router.push("/admin");
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-wd-cream p-4">
      <div className="bg-white p-8 rounded-2xl border border-wd-border card-glow w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">✨</div>
          <h1 className="text-3xl font-bold text-wd-heading mb-2 font-display tracking-wide">
            Create Your Registry
          </h1>
          <p className="text-wd-charcoal/50 text-sm">
            Set up a gift registry for any occasion
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="registryName" className="block text-sm font-medium text-wd-charcoal mb-2">
              Registry Name
            </label>
            <input
              type="text"
              id="registryName"
              value={registryName}
              onChange={(e) => setRegistryName(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-wd-border rounded-lg focus:ring-2 focus:ring-wd-gold/40 focus:border-wd-gold text-wd-heading placeholder-wd-charcoal/30"
              placeholder="Sarah's Birthday Wishlist"
              required
            />
          </div>

          <div>
            <label htmlFor="occasion" className="block text-sm font-medium text-wd-charcoal mb-2">
              Occasion
            </label>
            <select
              id="occasion"
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-wd-border rounded-lg focus:ring-2 focus:ring-wd-gold/40 focus:border-wd-gold text-wd-heading"
            >
              {occasions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="eventDate" className="block text-sm font-medium text-wd-charcoal mb-2">
              Event Date <span className="text-wd-charcoal/40">(optional)</span>
            </label>
            <input
              type="date"
              id="eventDate"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-wd-border rounded-lg focus:ring-2 focus:ring-wd-gold/40 focus:border-wd-gold text-wd-heading"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-wd-charcoal mb-2">
              Description <span className="text-wd-charcoal/40">(optional)</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-wd-border rounded-lg focus:ring-2 focus:ring-wd-gold/40 focus:border-wd-gold text-wd-heading placeholder-wd-charcoal/30 h-20 resize-none"
              placeholder="Add a note for your guests..."
            />
          </div>

          <div>
            <label htmlFor="adminPassword" className="block text-sm font-medium text-wd-charcoal mb-2">
              Admin Password
            </label>
            <input
              type="password"
              id="adminPassword"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-wd-border rounded-lg focus:ring-2 focus:ring-wd-gold/40 focus:border-wd-gold text-wd-heading placeholder-wd-charcoal/30"
              placeholder="Minimum 6 characters"
              required
              minLength={6}
            />
            <p className="text-xs text-wd-charcoal/40 mt-1">
              You&apos;ll use this to manage your registry
            </p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-wd-charcoal mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-wd-border rounded-lg focus:ring-2 focus:ring-wd-gold/40 focus:border-wd-gold text-wd-heading placeholder-wd-charcoal/30"
              placeholder="Re-enter your password"
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
            {loading ? "Creating Registry..." : "Create Registry"}
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
