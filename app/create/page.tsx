"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateRegistry() {
  const [registryName, setRegistryName] = useState("");
  const [occasion, setOccasion] = useState("other");
  const [eventDate, setEventDate] = useState("");
  const [description, setDescription] = useState("");
  const [coupleName1, setCoupleName1] = useState("");
  const [coupleName2, setCoupleName2] = useState("");
  const [personalMessage, setPersonalMessage] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const router = useRouter();

  const occasions = [
    { value: "birthday", label: "Birthday", emoji: "🎂" },
    { value: "wedding", label: "Wedding", emoji: "💍" },
    { value: "baby_shower", label: "Baby Shower", emoji: "🍼" },
    { value: "anniversary", label: "Anniversary", emoji: "🎉" },
    { value: "honeymoon", label: "Honeymoon", emoji: "🌴" },
    { value: "housewarming", label: "Housewarming", emoji: "🏡" },
    { value: "other", label: "Other", emoji: "🎁" },
  ];

  const isWedding = occasion === "wedding";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!registryName.trim()) {
      setError("Registry name is required");
      setLoading(false);
      return;
    }

    if (adminPassword.length < 8) {
      setError("Admin password must be at least 8 characters");
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
          coupleName1: coupleName1 || undefined,
          coupleName2: coupleName2 || undefined,
          personalMessage: personalMessage || undefined,
          coverImage: coverImage || undefined,
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
      sessionStorage.setItem("registrySlug", data.group.slug || "");
      sessionStorage.setItem("adminAuth", "pending");

      // Store owner participant info so they can also log in as participant
      if (data.ownerParticipant) {
        sessionStorage.setItem("ownerParticipantId", data.ownerParticipant.id);
        sessionStorage.setItem("ownerLoginCode", data.ownerParticipant.loginCode);
      }

      router.push("/admin");
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-wd-cream p-4">
      <div className="bg-white p-8 rounded-2xl border border-wd-border card-glow w-full max-w-lg">
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
              placeholder="Sarah & James's Wedding Registry"
              required
            />
          </div>

          {/* Occasion Picker */}
          <div>
            <label className="block text-sm font-medium text-wd-charcoal mb-2">Occasion</label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {occasions.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => setOccasion(o.value)}
                  className={`flex flex-col items-center p-2 rounded-lg border transition text-center ${
                    occasion === o.value
                      ? "border-wd-gold bg-wd-gold/10 text-wd-gold"
                      : "border-wd-border text-wd-charcoal/50 hover:border-wd-gold/50"
                  }`}
                >
                  <span className="text-xl">{o.emoji}</span>
                  <span className="text-xs mt-1">{o.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Couple Names (show prominently for weddings, but available for all) */}
          {(isWedding || coupleName1 || coupleName2) && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="coupleName1" className="block text-sm font-medium text-wd-charcoal mb-2">
                  {isWedding ? "Partner 1" : "Your Name"} <span className="text-wd-charcoal/40">(optional)</span>
                </label>
                <input
                  type="text"
                  id="coupleName1"
                  value={coupleName1}
                  onChange={(e) => setCoupleName1(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-wd-border rounded-lg focus:ring-2 focus:ring-wd-gold/40 focus:border-wd-gold text-wd-heading placeholder-wd-charcoal/30"
                  placeholder="Sarah"
                />
              </div>
              <div>
                <label htmlFor="coupleName2" className="block text-sm font-medium text-wd-charcoal mb-2">
                  {isWedding ? "Partner 2" : "Partner"} <span className="text-wd-charcoal/40">(optional)</span>
                </label>
                <input
                  type="text"
                  id="coupleName2"
                  value={coupleName2}
                  onChange={(e) => setCoupleName2(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-wd-border rounded-lg focus:ring-2 focus:ring-wd-gold/40 focus:border-wd-gold text-wd-heading placeholder-wd-charcoal/30"
                  placeholder="James"
                />
              </div>
            </div>
          )}

          {!isWedding && !coupleName1 && !coupleName2 && (
            <button
              type="button"
              onClick={() => setCoupleName1(" ")}
              className="text-sm text-wd-gold hover:underline"
            >
              + Add couple/partner names
            </button>
          )}

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

          {/* Advanced Options Toggle */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-wd-gold hover:underline flex items-center gap-1"
          >
            {showAdvanced ? "Hide" : "Show"} advanced options
            <svg className={`w-3 h-3 transition ${showAdvanced ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>

          {showAdvanced && (
            <div className="space-y-4 border-t border-wd-border pt-4">
              <div>
                <label htmlFor="personalMessage" className="block text-sm font-medium text-wd-charcoal mb-2">
                  Personal Message for Guests <span className="text-wd-charcoal/40">(optional)</span>
                </label>
                <textarea
                  id="personalMessage"
                  value={personalMessage}
                  onChange={(e) => setPersonalMessage(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-wd-border rounded-lg focus:ring-2 focus:ring-wd-gold/40 focus:border-wd-gold text-wd-heading placeholder-wd-charcoal/30 h-20 resize-none"
                  placeholder="We're so excited to celebrate with you!"
                />
              </div>
              <div>
                <label htmlFor="coverImage" className="block text-sm font-medium text-wd-charcoal mb-2">
                  Cover Image URL <span className="text-wd-charcoal/40">(optional)</span>
                </label>
                <input
                  type="url"
                  id="coverImage"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-wd-border rounded-lg focus:ring-2 focus:ring-wd-gold/40 focus:border-wd-gold text-wd-heading placeholder-wd-charcoal/30"
                  placeholder="https://example.com/our-photo.jpg"
                />
              </div>
            </div>
          )}

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
              placeholder="Minimum 8 characters"
              required
              minLength={8}
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

          <p className="text-xs text-wd-charcoal/40 text-center">
            By creating a registry, you agree to our{" "}
            <a href="/terms" target="_blank" className="text-wd-gold hover:underline">Terms of Service</a>{" "}and{" "}
            <a href="/privacy" target="_blank" className="text-wd-gold hover:underline">Privacy Policy</a>.
          </p>

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
