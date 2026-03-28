"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Participant {
  id: string;
  name: string;
  email?: string;
  loginCode: string;
  _count: { wishlistItems: number };
  wishlistItems: Array<{
    id: string;
    title: string;
    claimedById?: string | null;
    claimedByName?: string | null;
    claimNote?: string | null;
  }>;
}

interface Category {
  id: string;
  name: string;
  order: number;
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

interface RegistryInfo {
  id: string;
  name: string;
  inviteCode: string;
  slug?: string;
  coupleName1?: string;
  coupleName2?: string;
  personalMessage?: string;
  description?: string;
  coverImage?: string;
  revealEnabled?: boolean;
  budgetAmount?: number;
  budgetCurrency?: string;
}

export default function AdminDashboard() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cashFunds, setCashFunds] = useState<CashFund[]>([]);
  const [newPersonName, setNewPersonName] = useState("");
  const [newPersonEmail, setNewPersonEmail] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newFundTitle, setNewFundTitle] = useState("");
  const [newFundTarget, setNewFundTarget] = useState("");
  const [newFundDescription, setNewFundDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [registryInfo, setRegistryInfo] = useState<RegistryInfo>({ id: "", name: "", inviteCode: "" });
  const [budgetAmount, setBudgetAmount] = useState("");
  const [budgetCurrency, setBudgetCurrency] = useState("USD");
  const [coupleName1, setCoupleName1] = useState("");
  const [coupleName2, setCoupleName2] = useState("");
  const [personalMessage, setPersonalMessage] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [revealEnabled, setRevealEnabled] = useState(false);
  const [activeSection, setActiveSection] = useState<"overview" | "customize" | "categories" | "funds">("overview");
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const adminAuth = sessionStorage.getItem("adminAuth");
    const groupId = sessionStorage.getItem("groupId");
    const groupName = sessionStorage.getItem("groupName");
    const inviteCode = sessionStorage.getItem("inviteCode");

    if (!adminAuth || !groupId) {
      router.push("/admin");
      return;
    }

    setRegistryInfo({ id: groupId, name: groupName || "", inviteCode: inviteCode || "" });
    loadData(groupId);
  }, [router]);

  const loadData = async (registryId: string) => {
    try {
      const [peopleRes, groupRes] = await Promise.all([
        fetch(`/api/people?groupId=${registryId}`),
        fetch(`/api/groups/${registryId}`),
      ]);

      const peopleData = await peopleRes.json();
      const groupData = await groupRes.json();

      setParticipants(peopleData.people || []);

      if (groupData.group) {
        const g = groupData.group;
        setRegistryInfo({
          id: registryId,
          name: g.name,
          inviteCode: g.inviteCode,
          slug: g.slug,
          coupleName1: g.coupleName1,
          coupleName2: g.coupleName2,
          personalMessage: g.personalMessage,
          description: g.description,
          coverImage: g.coverImage,
          revealEnabled: g.revealEnabled,
          budgetAmount: g.budgetAmount,
          budgetCurrency: g.budgetCurrency,
        });
        setBudgetAmount(g.budgetAmount?.toString() || "");
        setBudgetCurrency(g.budgetCurrency || "USD");
        setCoupleName1(g.coupleName1 || "");
        setCoupleName2(g.coupleName2 || "");
        setPersonalMessage(g.personalMessage || "");
        setCoverImage(g.coverImage || "");
        setRevealEnabled(g.revealEnabled || false);
        setCategories(g.categories || []);
        setCashFunds(g.cashFunds || []);
      }

      setLoading(false);
    } catch (err) {
      setError("Failed to load data");
      setLoading(false);
    }
  };

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleAddPerson = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!newPersonName.trim()) { setError("Name is required"); return; }

    try {
      const res = await fetch("/api/people", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newPersonName, email: newPersonEmail.trim() || undefined, groupId: registryInfo.id }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to add participant"); return; }

      const emailMsg = data.person.email ? ` and email: ${data.person.email}` : "";
      showSuccess(`Added ${data.person.name} with code: ${data.person.loginCode}${emailMsg}`);
      setNewPersonName("");
      setNewPersonEmail("");
      loadData(registryInfo.id);
    } catch (err) { setError("An error occurred"); }
  };

  const handleDeletePerson = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name}?`)) return;
    setError("");
    try {
      const res = await fetch(`/api/people/${id}`, { method: "DELETE" });
      if (!res.ok) { setError("Failed to remove participant"); return; }
      showSuccess(`Removed ${name}`);
      loadData(registryInfo.id);
    } catch (err) { setError("An error occurred"); }
  };

  const handleUpdateBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const amount = budgetAmount.trim() ? parseFloat(budgetAmount) : undefined;
    if (budgetAmount.trim() && (isNaN(amount!) || amount! <= 0)) { setError("Please enter a valid budget amount"); return; }

    try {
      const res = await fetch(`/api/groups/${registryInfo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ budgetAmount: amount, budgetCurrency }),
      });
      if (!res.ok) { const data = await res.json(); setError(data.error || "Failed to update budget"); return; }
      showSuccess("Budget updated!");
    } catch (err) { setError("An error occurred"); }
  };

  const handleSaveCustomization = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`/api/groups/${registryInfo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coupleName1, coupleName2, personalMessage, coverImage, revealEnabled }),
      });
      if (!res.ok) { const data = await res.json(); setError(data.error || "Failed to update"); return; }
      showSuccess("Registry customization saved!");
      loadData(registryInfo.id);
    } catch (err) { setError("An error occurred"); }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!newCategoryName.trim()) return;
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registryId: registryInfo.id, name: newCategoryName }),
      });
      if (!res.ok) { const data = await res.json(); setError(data.error || "Failed to add category"); return; }
      setNewCategoryName("");
      showSuccess("Category added!");
      loadData(registryInfo.id);
    } catch (err) { setError("An error occurred"); }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await fetch("/api/categories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      loadData(registryInfo.id);
    } catch (err) { setError("An error occurred"); }
  };

  const handleAddFund = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!newFundTitle.trim()) return;
    try {
      const res = await fetch("/api/cashfund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registryId: registryInfo.id,
          title: newFundTitle,
          description: newFundDescription || undefined,
          targetAmount: newFundTarget ? parseFloat(newFundTarget) : undefined,
          currency: budgetCurrency,
        }),
      });
      if (!res.ok) { const data = await res.json(); setError(data.error || "Failed to create fund"); return; }
      setNewFundTitle("");
      setNewFundTarget("");
      setNewFundDescription("");
      showSuccess("Cash fund created!");
      loadData(registryInfo.id);
    } catch (err) { setError("An error occurred"); }
  };

  const handleDeleteFund = async (id: string) => {
    if (!confirm("Delete this cash fund?")) return;
    try {
      await fetch("/api/cashfund", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      loadData(registryInfo.id);
    } catch (err) { setError("An error occurred"); }
  };

  const handleCopyLink = () => {
    const url = registryInfo.slug
      ? `${window.location.origin}/r/${registryInfo.slug}`
      : `${window.location.origin}/r/${registryInfo.inviteCode}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    sessionStorage.clear();
    router.push("/");
  };

  const totalItems = participants.reduce((sum, p) => sum + (p.wishlistItems?.length || 0), 0);
  const claimedItems = participants.reduce((sum, p) =>
    sum + (p.wishlistItems?.filter(i => i.claimedById)?.length || 0), 0
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-xl text-wd-gold">Loading...</div>
      </div>
    );
  }

  const currencies = [
    "USD", "EUR", "GBP", "CAD", "AUD", "ZAR", "JPY", "CHF",
    "SEK", "NOK", "DKK", "NZD", "MXN", "BRL", "INR", "CNY", "KRW", "SGD",
  ];

  return (
    <div className="min-h-screen bg-wd-cream p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-4xl font-bold text-wd-heading font-display tracking-wide">Admin Dashboard</h1>
            <p className="text-wd-charcoal/60 mt-1 text-sm sm:text-base truncate">{registryInfo.name}</p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <code className="bg-white border border-wd-border px-2 py-1 rounded font-mono text-wd-gold text-xs sm:text-sm">{registryInfo.inviteCode}</code>
              <button
                onClick={handleCopyLink}
                className="text-xs bg-wd-gold/10 text-wd-gold px-3 py-1.5 rounded-lg border border-wd-gold/30 hover:bg-wd-gold/20 transition"
              >
                {copied ? "Copied!" : "Copy Share Link"}
              </button>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="self-start sm:self-auto bg-white text-wd-charcoal px-4 py-2 rounded-lg hover:bg-wd-cream transition border border-wd-border min-h-[44px]"
          >
            Logout
          </button>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">{error}</div>}
        {successMessage && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg mb-4">{successMessage}</div>}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl border border-wd-border text-center card-glow">
            <div className="text-2xl font-bold text-wd-gold">{participants.length}</div>
            <div className="text-xs text-wd-charcoal/50">Participants</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-wd-border text-center card-glow">
            <div className="text-2xl font-bold text-wd-gold">{totalItems}</div>
            <div className="text-xs text-wd-charcoal/50">Wish Items</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-wd-border text-center card-glow">
            <div className="text-2xl font-bold text-emerald-600">{claimedItems}</div>
            <div className="text-xs text-wd-charcoal/50">Claimed</div>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex mb-6 bg-white rounded-lg p-1 border border-wd-border overflow-x-auto">
          {([
            { key: "overview", label: "Overview" },
            { key: "customize", label: "Customize" },
            { key: "categories", label: "Categories" },
            { key: "funds", label: "Cash Funds" },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveSection(tab.key)}
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition whitespace-nowrap min-h-[44px] ${
                activeSection === tab.key
                  ? "bg-wd-gold text-white shadow-sm"
                  : "text-wd-charcoal/50 hover:text-wd-heading"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Section */}
        {activeSection === "overview" && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Add Participant */}
              <div className="bg-white p-6 rounded-2xl border border-wd-border card-glow">
                <h2 className="text-2xl font-bold text-wd-heading mb-4 font-display">Add Participant</h2>
                <form onSubmit={handleAddPerson} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-wd-charcoal mb-2">Name <span className="text-red-500">*</span></label>
                    <input type="text" id="name" value={newPersonName} onChange={(e) => setNewPersonName(e.target.value)}
                      className="w-full px-4 py-2 bg-white border border-wd-border rounded-lg focus:ring-2 focus:ring-wd-gold/40 focus:border-wd-gold text-wd-heading placeholder-wd-charcoal/30"
                      placeholder="Enter participant's name" required />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-wd-charcoal mb-2">Email <span className="text-wd-charcoal/40">(optional)</span></label>
                    <input type="email" id="email" value={newPersonEmail} onChange={(e) => setNewPersonEmail(e.target.value)}
                      className="w-full px-4 py-2 bg-white border border-wd-border rounded-lg focus:ring-2 focus:ring-wd-gold/40 focus:border-wd-gold text-wd-heading placeholder-wd-charcoal/30"
                      placeholder="person@example.com" />
                    <p className="text-xs text-wd-charcoal/40 mt-1">If provided, they can log in via email magic link</p>
                  </div>
                  <button type="submit" className="w-full bg-wd-gold text-white py-2 rounded-xl font-semibold hover:bg-wd-gold-dark transition-all duration-300 hover:scale-105 transform">Add Participant</button>
                </form>
              </div>

              {/* Budget */}
              <div className="bg-white p-6 rounded-2xl border border-wd-border card-glow">
                <h2 className="text-2xl font-bold text-wd-heading mb-4 font-display">Gift Budget</h2>
                <form onSubmit={handleUpdateBudget} className="space-y-4">
                  <div>
                    <label htmlFor="budgetAmount" className="block text-sm font-medium text-wd-charcoal mb-2">Budget Amount</label>
                    <input type="number" id="budgetAmount" value={budgetAmount} onChange={(e) => setBudgetAmount(e.target.value)}
                      className="w-full px-4 py-2 bg-white border border-wd-border rounded-lg focus:ring-2 focus:ring-wd-gold/40 focus:border-wd-gold text-wd-heading placeholder-wd-charcoal/30"
                      placeholder="50.00" step="0.01" min="0" />
                  </div>
                  <div>
                    <label htmlFor="budgetCurrency" className="block text-sm font-medium text-wd-charcoal mb-2">Currency</label>
                    <select id="budgetCurrency" value={budgetCurrency} onChange={(e) => setBudgetCurrency(e.target.value)}
                      className="w-full px-4 py-2 bg-white border border-wd-border rounded-lg focus:ring-2 focus:ring-wd-gold/40 focus:border-wd-gold text-wd-heading">
                      {currencies.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <button type="submit" className="w-full bg-wd-gold text-white py-2 rounded-xl font-semibold hover:bg-wd-gold-dark transition-all duration-300 hover:scale-105 transform">Update Budget</button>
                </form>
              </div>
            </div>

            {/* Participants List */}
            <div className="mt-8 bg-white p-6 rounded-2xl border border-wd-border card-glow">
              <h2 className="text-2xl font-bold text-wd-heading mb-4 font-display">Participants ({participants.length})</h2>
              {participants.length === 0 ? (
                <p className="text-wd-charcoal/50">No participants yet. Add your first participant above!</p>
              ) : (
                <>
                  {/* Mobile */}
                  <div className="space-y-3 md:hidden">
                    {participants.map((person) => {
                      const claimed = person.wishlistItems?.filter(i => i.claimedById)?.length || 0;
                      const total = person.wishlistItems?.length || 0;
                      return (
                        <div key={person.id} className="bg-wd-cream/50 border border-wd-border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-semibold text-wd-heading">{person.name}</span>
                            <button onClick={() => handleDeletePerson(person.id, person.name)}
                              className="text-red-500 hover:text-red-600 font-semibold text-sm min-h-[44px] min-w-[44px] flex items-center justify-center">Remove</button>
                          </div>
                          {person.email && <p className="text-wd-charcoal/50 text-sm truncate mb-1">{person.email}</p>}
                          <div className="flex flex-wrap items-center gap-2 text-sm">
                            <code className="bg-white border border-wd-border px-2 py-1 rounded font-mono text-wd-gold text-xs">{person.loginCode}</code>
                            <span className="text-wd-charcoal/50">{total} items</span>
                            {claimed > 0 && <span className="bg-emerald-50 text-emerald-600 text-xs px-2 py-0.5 rounded-full font-semibold border border-emerald-200">{claimed} claimed</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {/* Desktop */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-wd-border">
                          <th className="text-left py-3 px-4 text-wd-gold text-sm font-semibold">Name</th>
                          <th className="text-left py-3 px-4 text-wd-gold text-sm font-semibold">Email</th>
                          <th className="text-left py-3 px-4 text-wd-gold text-sm font-semibold">Login Code</th>
                          <th className="text-left py-3 px-4 text-wd-gold text-sm font-semibold">Items</th>
                          <th className="text-left py-3 px-4 text-wd-gold text-sm font-semibold">Claimed</th>
                          <th className="text-left py-3 px-4 text-wd-gold text-sm font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {participants.map((person) => {
                          const claimed = person.wishlistItems?.filter(i => i.claimedById)?.length || 0;
                          const total = person.wishlistItems?.length || 0;
                          return (
                            <tr key={person.id} className="border-b border-wd-border/50 hover:bg-wd-cream/50">
                              <td className="py-3 px-4 text-wd-heading">{person.name}</td>
                              <td className="py-3 px-4">{person.email ? <span className="text-wd-charcoal/60 text-sm">{person.email}</span> : <span className="text-wd-charcoal/30 text-sm italic">No email</span>}</td>
                              <td className="py-3 px-4"><code className="bg-wd-cream border border-wd-border px-2 py-1 rounded font-mono text-wd-gold text-sm">{person.loginCode}</code></td>
                              <td className="py-3 px-4 text-wd-heading">{total}</td>
                              <td className="py-3 px-4">{claimed > 0 ? <span className="text-emerald-600">{claimed}/{total}</span> : <span className="text-wd-charcoal/30">0/{total}</span>}</td>
                              <td className="py-3 px-4"><button onClick={() => handleDeletePerson(person.id, person.name)} className="text-red-500 hover:text-red-600 font-semibold text-sm">Remove</button></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>

            {/* Item Status with reveal toggle */}
            {participants.some(p => p.wishlistItems?.length > 0) && (
              <div className="mt-8 bg-white p-6 rounded-2xl border border-wd-border card-glow">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-wd-heading font-display">Item Status</h2>
                  {revealEnabled && (
                    <span className="text-xs bg-wd-gold/10 text-wd-gold px-3 py-1 rounded-full border border-wd-gold/30">Reveal Mode ON</span>
                  )}
                </div>
                <p className="text-sm text-wd-charcoal/50 mb-4">
                  {revealEnabled
                    ? "Reveal mode is on — you can see who claimed each item (for thank-you notes)."
                    : "You can see which items are claimed but not who claimed them."}
                </p>
                <div className="space-y-2">
                  {participants.map((person) =>
                    person.wishlistItems?.map((item) => (
                      <div key={item.id} className="flex items-center justify-between bg-wd-cream/50 border border-wd-border/50 rounded-lg p-3">
                        <div className="min-w-0 flex-1">
                          <span className="text-sm text-wd-gold">{person.name}</span>
                          <span className="text-wd-charcoal/30 mx-2">&bull;</span>
                          <span className="text-wd-heading text-sm">{item.title}</span>
                          {revealEnabled && item.claimedByName && (
                            <span className="text-xs text-wd-charcoal/50 ml-2">
                              — claimed by <strong>{item.claimedByName}</strong>
                              {item.claimNote && <span className="italic"> &ldquo;{item.claimNote}&rdquo;</span>}
                            </span>
                          )}
                        </div>
                        {item.claimedById ? (
                          <span className="bg-wd-gold/10 text-wd-gold text-xs px-3 py-1 rounded-full border border-wd-gold/20 flex-shrink-0 ml-2">Claimed</span>
                        ) : (
                          <span className="bg-gray-100 text-wd-charcoal/40 text-xs px-3 py-1 rounded-full border border-gray-200 flex-shrink-0 ml-2">Available</span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* Customize Section */}
        {activeSection === "customize" && (
          <div className="bg-white p-6 rounded-2xl border border-wd-border card-glow">
            <h2 className="text-2xl font-bold text-wd-heading mb-4 font-display">Customize Your Registry</h2>
            <p className="text-sm text-wd-charcoal/50 mb-6">These details appear on your public registry page.</p>

            {registryInfo.slug && (
              <div className="mb-6 bg-wd-cream border border-wd-border rounded-lg p-4">
                <p className="text-sm text-wd-charcoal/60 mb-1">Your shareable registry link:</p>
                <div className="flex items-center gap-2">
                  <code className="text-wd-gold font-mono text-sm flex-1 truncate">{typeof window !== 'undefined' ? window.location.origin : ''}/r/{registryInfo.slug}</code>
                  <button onClick={handleCopyLink} className="text-xs bg-wd-gold text-white px-3 py-1.5 rounded-lg hover:bg-wd-gold-dark transition">
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSaveCustomization} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-wd-charcoal mb-2">Partner 1 Name</label>
                  <input type="text" value={coupleName1} onChange={(e) => setCoupleName1(e.target.value)}
                    className="w-full px-4 py-2 bg-white border border-wd-border rounded-lg focus:ring-2 focus:ring-wd-gold/40 text-wd-heading placeholder-wd-charcoal/30"
                    placeholder="Sarah" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-wd-charcoal mb-2">Partner 2 Name</label>
                  <input type="text" value={coupleName2} onChange={(e) => setCoupleName2(e.target.value)}
                    className="w-full px-4 py-2 bg-white border border-wd-border rounded-lg focus:ring-2 focus:ring-wd-gold/40 text-wd-heading placeholder-wd-charcoal/30"
                    placeholder="James" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-wd-charcoal mb-2">Personal Message</label>
                <textarea value={personalMessage} onChange={(e) => setPersonalMessage(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-wd-border rounded-lg focus:ring-2 focus:ring-wd-gold/40 text-wd-heading placeholder-wd-charcoal/30 h-24 resize-none"
                  placeholder="We're so excited to celebrate with you! Thank you for being part of our special day." />
              </div>
              <div>
                <label className="block text-sm font-medium text-wd-charcoal mb-2">Cover Image URL</label>
                <input type="url" value={coverImage} onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-wd-border rounded-lg focus:ring-2 focus:ring-wd-gold/40 text-wd-heading placeholder-wd-charcoal/30"
                  placeholder="https://example.com/our-photo.jpg" />
              </div>

              {/* Reveal Toggle */}
              <div className="border-t border-wd-border pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-wd-heading">Thank-You Reveal Mode</p>
                    <p className="text-sm text-wd-charcoal/50">When enabled, you can see who claimed each item (for writing thank-you notes after the event).</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRevealEnabled(!revealEnabled)}
                    className={`relative w-12 h-6 rounded-full transition ${revealEnabled ? "bg-wd-gold" : "bg-gray-300"}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${revealEnabled ? "translate-x-6" : ""}`} />
                  </button>
                </div>
              </div>

              <button type="submit" className="w-full bg-wd-gold text-white py-3 rounded-xl font-semibold hover:bg-wd-gold-dark transition-all duration-300 hover:scale-105 transform">
                Save Customization
              </button>
            </form>
          </div>
        )}

        {/* Categories Section */}
        {activeSection === "categories" && (
          <div className="bg-white p-6 rounded-2xl border border-wd-border card-glow">
            <h2 className="text-2xl font-bold text-wd-heading mb-4 font-display">Gift Categories</h2>
            <p className="text-sm text-wd-charcoal/50 mb-6">Organize wishlist items into categories (e.g., Kitchen, Bedroom, Honeymoon).</p>

            <form onSubmit={handleAddCategory} className="flex gap-2 mb-6">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="flex-1 px-4 py-2 bg-white border border-wd-border rounded-lg focus:ring-2 focus:ring-wd-gold/40 text-wd-heading placeholder-wd-charcoal/30"
                placeholder="Category name (e.g., Kitchen)"
              />
              <button type="submit" className="bg-wd-gold text-white px-6 py-2 rounded-lg font-semibold hover:bg-wd-gold-dark transition min-h-[44px]">Add</button>
            </form>

            {categories.length === 0 ? (
              <p className="text-wd-charcoal/50 text-center py-4">No categories yet. Add one above!</p>
            ) : (
              <div className="space-y-2">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between bg-wd-cream/50 border border-wd-border/50 rounded-lg p-3">
                    <span className="text-wd-heading font-medium">{cat.name}</span>
                    <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-500 hover:text-red-600 text-sm font-semibold min-h-[44px] min-w-[44px] flex items-center justify-center">Delete</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Cash Funds Section */}
        {activeSection === "funds" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-wd-border card-glow">
              <h2 className="text-2xl font-bold text-wd-heading mb-4 font-display">Cash / Contribution Funds</h2>
              <p className="text-sm text-wd-charcoal/50 mb-6">Create funds for honeymoon, house deposit, or any cash contributions guests can contribute to.</p>

              <form onSubmit={handleAddFund} className="space-y-3">
                <input type="text" value={newFundTitle} onChange={(e) => setNewFundTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-wd-border rounded-lg focus:ring-2 focus:ring-wd-gold/40 text-wd-heading placeholder-wd-charcoal/30"
                  placeholder="Fund title (e.g., Honeymoon Fund)" />
                <input type="text" value={newFundDescription} onChange={(e) => setNewFundDescription(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-wd-border rounded-lg focus:ring-2 focus:ring-wd-gold/40 text-wd-heading placeholder-wd-charcoal/30"
                  placeholder="Description (optional)" />
                <input type="number" value={newFundTarget} onChange={(e) => setNewFundTarget(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-wd-border rounded-lg focus:ring-2 focus:ring-wd-gold/40 text-wd-heading placeholder-wd-charcoal/30"
                  placeholder="Target amount (optional)" step="0.01" min="0" />
                <button type="submit" className="w-full bg-wd-gold text-white py-2 rounded-xl font-semibold hover:bg-wd-gold-dark transition">Create Fund</button>
              </form>
            </div>

            {cashFunds.map((fund) => {
              const progress = fund.targetAmount ? Math.min((fund.totalRaised / fund.targetAmount) * 100, 100) : null;
              return (
                <div key={fund.id} className="bg-white p-6 rounded-2xl border border-wd-border card-glow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-wd-heading">{fund.title}</h3>
                    <button onClick={() => handleDeleteFund(fund.id)} className="text-red-500 hover:text-red-600 text-sm font-semibold">Delete</button>
                  </div>
                  {fund.description && <p className="text-sm text-wd-charcoal/60 mb-3">{fund.description}</p>}
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-2xl font-bold text-wd-gold">{fund.currency} {fund.totalRaised.toFixed(0)}</span>
                    {fund.targetAmount && <span className="text-sm text-wd-charcoal/50">of {fund.currency} {fund.targetAmount}</span>}
                  </div>
                  {progress !== null && (
                    <div className="w-full bg-wd-cream rounded-full h-3 mb-2">
                      <div className="bg-wd-gold h-3 rounded-full transition-all" style={{ width: `${progress}%` }} />
                    </div>
                  )}
                  <p className="text-xs text-wd-charcoal/50">{fund.contributorCount} contributor{fund.contributorCount !== 1 ? "s" : ""}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
