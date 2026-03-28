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
    price?: number | null;
    currency?: string;
    claimedById?: string | null;
    claimedByName?: string | null;
    claimNote?: string | null;
    received?: boolean;
    thankYouSent?: boolean;
  }>;
}

interface Category { id: string; name: string; order: number; }
interface CashFund { id: string; title: string; description?: string | null; targetAmount?: number | null; currency: string; paymentDetails?: string | null; totalRaised: number; contributorCount: number; }
interface CoAdmin { id: string; email: string; name?: string | null; addedAt: string; }
interface Rsvp { id: string; name: string; email?: string | null; status: string; headcount: number; note?: string | null; }
interface GiftItem { id: string; title: string; recipientName: string; claimedByName?: string | null; claimNote?: string | null; claimedAt?: string | null; received: boolean; thankYouSent: boolean; price?: number | null; currency?: string; }
interface AnalyticsSummary { totalViews: number; totalClaims: number; totalGuests: number; totalContributions: number; totalRsvps: number; recentActivity: { event: string; createdAt: string; metadata: string | null }[]; claimTimeline: { date: string; count: number }[]; viewTimeline: { date: string; count: number }[]; }

interface RegistryInfo {
  id: string; name: string; inviteCode: string; slug?: string;
  coupleName1?: string; coupleName2?: string; personalMessage?: string;
  description?: string; coverImage?: string; revealEnabled?: boolean;
  brandingHidden?: boolean; brandingColor?: string;
  budgetAmount?: number; budgetCurrency?: string; plan?: string;
}

type Section = "overview" | "customize" | "categories" | "funds" | "co-admins" | "rsvp" | "gifts" | "analytics";

export default function AdminDashboard() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cashFunds, setCashFunds] = useState<CashFund[]>([]);
  const [coAdmins, setCoAdmins] = useState<CoAdmin[]>([]);
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [rsvpSummary, setRsvpSummary] = useState({ totalYes: 0, totalMaybe: 0, totalNo: 0, total: 0 });
  const [gifts, setGifts] = useState<GiftItem[]>([]);
  const [giftStats, setGiftStats] = useState({ totalClaimed: 0, totalReceived: 0, thankYouPending: 0 });
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [newPersonName, setNewPersonName] = useState("");
  const [newPersonEmail, setNewPersonEmail] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newFundTitle, setNewFundTitle] = useState("");
  const [newFundTarget, setNewFundTarget] = useState("");
  const [newFundDescription, setNewFundDescription] = useState("");
  const [newFundPayment, setNewFundPayment] = useState("");
  const [editingFundPayment, setEditingFundPayment] = useState<string | null>(null);
  const [editPaymentText, setEditPaymentText] = useState("");
  const [newCoAdminEmail, setNewCoAdminEmail] = useState("");
  const [newCoAdminName, setNewCoAdminName] = useState("");
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
  const [registryName, setRegistryName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [occasion, setOccasion] = useState("");
  const [registryDescription, setRegistryDescription] = useState("");
  const [activeSection, setActiveSection] = useState<Section>("overview");
  const [copied, setCopied] = useState(false);
  const [loginCodes, setLoginCodes] = useState<Record<string, string>>({});
  const [maxItems, setMaxItems] = useState(10);
  const [maxParticipants, setMaxParticipants] = useState(10);
  const router = useRouter();

  const isPaid = registryInfo.plan === "unlimited" || registryInfo.plan === "plus" || registryInfo.plan === "pro";

  useEffect(() => {
    const adminAuth = sessionStorage.getItem("adminAuth");
    const groupId = sessionStorage.getItem("groupId");
    const groupName = sessionStorage.getItem("groupName");
    const inviteCode = sessionStorage.getItem("inviteCode");
    if (!adminAuth || !groupId) { router.push("/admin"); return; }
    setRegistryInfo({ id: groupId, name: groupName || "", inviteCode: inviteCode || "" });
    loadData(groupId);

    // Handle Stripe payment success/cancel
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") === "success") {
      setSuccessMessage("Payment successful! Your registry has been upgraded to Unlimited.");
      window.history.replaceState({}, "", "/admin/dashboard");
    } else if (params.get("payment") === "cancelled") {
      setError("Payment was cancelled.");
      window.history.replaceState({}, "", "/admin/dashboard");
    }
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
          id: registryId, name: g.name, inviteCode: g.inviteCode, slug: g.slug,
          coupleName1: g.coupleName1, coupleName2: g.coupleName2,
          personalMessage: g.personalMessage, description: g.description,
          coverImage: g.coverImage, revealEnabled: g.revealEnabled,
          brandingHidden: g.brandingHidden, brandingColor: g.brandingColor,
          budgetAmount: g.budgetAmount, budgetCurrency: g.budgetCurrency, plan: g.plan,
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
        setRegistryName(g.name || "");
        setEventDate(g.eventDate ? g.eventDate.split("T")[0] : "");
        setOccasion(g.occasion || "other");
        setRegistryDescription(g.description || "");
        // Set plan limits
        const plan = g.plan || "free";
        if (plan === "unlimited" || plan === "plus" || plan === "pro") {
          setMaxItems(Infinity); setMaxParticipants(Infinity);
        } else {
          setMaxItems(10); setMaxParticipants(10);
        }
      }
      setLoading(false);
    } catch { setError("Failed to load data"); setLoading(false); }
  };

  const loadPaidData = async (section: Section) => {
    if (!isPaid) return;
    const registryId = registryInfo.id;
    try {
      if (section === "co-admins") {
        const res = await fetch("/api/co-admins");
        if (res.ok) { const d = await res.json(); setCoAdmins(d.coAdmins || []); }
      } else if (section === "rsvp") {
        const res = await fetch("/api/rsvp");
        if (res.ok) { const d = await res.json(); setRsvps(d.rsvps || []); setRsvpSummary(d.summary); }
      } else if (section === "gifts") {
        const res = await fetch("/api/gifts");
        if (res.ok) { const d = await res.json(); setGifts(d.gifts || []); setGiftStats(d.stats); }
      } else if (section === "analytics") {
        const res = await fetch("/api/analytics");
        if (res.ok) { const d = await res.json(); setAnalytics(d.analytics); }
      }
    } catch { /* silent */ }
  };

  const switchSection = (s: Section) => {
    setActiveSection(s);
    if (["co-admins", "rsvp", "gifts", "analytics"].includes(s)) loadPaidData(s);
  };

  const showSuccess = (msg: string) => { setSuccessMessage(msg); setTimeout(() => setSuccessMessage(""), 3000); };

  const handleAddPerson = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (!newPersonName.trim()) { setError("Name is required"); return; }
    try {
      const res = await fetch("/api/people", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: newPersonName, email: newPersonEmail.trim() || undefined, groupId: registryInfo.id }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to add participant"); return; }
      setLoginCodes(prev => ({ ...prev, [data.person.id]: data.person.loginCode }));
      showSuccess(`Added ${data.person.name} with code: ${data.person.loginCode}`);
      setNewPersonName(""); setNewPersonEmail(""); loadData(registryInfo.id);
    } catch { setError("An error occurred"); }
  };

  const handleDeletePerson = async (id: string, name: string) => {
    if (!confirm(`Remove ${name}?`)) return;
    try { const res = await fetch(`/api/people/${id}`, { method: "DELETE" }); if (res.ok) { showSuccess(`Removed ${name}`); loadData(registryInfo.id); } } catch { setError("An error occurred"); }
  };

  const handleUpdateBudget = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    const amount = budgetAmount.trim() ? parseFloat(budgetAmount) : undefined;
    try {
      const res = await fetch(`/api/groups/${registryInfo.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ budgetAmount: amount, budgetCurrency }) });
      if (res.ok) showSuccess("Budget updated!");
      else { const d = await res.json(); setError(d.error); }
    } catch { setError("An error occurred"); }
  };

  const handleSaveCustomization = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    try {
      const res = await fetch(`/api/groups/${registryInfo.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ coupleName1, coupleName2, personalMessage, coverImage, revealEnabled }) });
      if (res.ok) { showSuccess("Saved!"); loadData(registryInfo.id); }
      else { const d = await res.json(); setError(d.error); }
    } catch { setError("An error occurred"); }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault(); if (!newCategoryName.trim()) return;
    try {
      const res = await fetch("/api/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ registryId: registryInfo.id, name: newCategoryName }) });
      if (res.ok) { setNewCategoryName(""); showSuccess("Category added!"); loadData(registryInfo.id); }
      else { const d = await res.json(); setError(d.error); }
    } catch { setError("An error occurred"); }
  };

  const handleDeleteCategory = async (id: string) => { try { await fetch("/api/categories", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); loadData(registryInfo.id); } catch {} };

  const handleAddFund = async (e: React.FormEvent) => {
    e.preventDefault(); if (!newFundTitle.trim()) return;
    try {
      const res = await fetch("/api/cashfund", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ registryId: registryInfo.id, title: newFundTitle, description: newFundDescription || undefined, targetAmount: newFundTarget ? parseFloat(newFundTarget) : undefined, currency: budgetCurrency, paymentDetails: newFundPayment || undefined }) });
      if (res.ok) { setNewFundTitle(""); setNewFundTarget(""); setNewFundDescription(""); setNewFundPayment(""); showSuccess("Fund created!"); loadData(registryInfo.id); }
    } catch { setError("An error occurred"); }
  };

  const handleDeleteFund = async (id: string) => { if (!confirm("Delete this fund?")) return; try { await fetch("/api/cashfund", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); loadData(registryInfo.id); } catch {} };

  const handleSaveFundPayment = async (id: string) => {
    try {
      const res = await fetch("/api/cashfund", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, paymentDetails: editPaymentText }) });
      if (res.ok) { setEditingFundPayment(null); showSuccess("Payment details saved!"); loadData(registryInfo.id); }
    } catch { setError("Failed to update"); }
  };

  const handleAddCoAdmin = async (e: React.FormEvent) => {
    e.preventDefault(); if (!newCoAdminEmail.trim()) return;
    try {
      const res = await fetch("/api/co-admins", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: newCoAdminEmail, name: newCoAdminName || undefined }) });
      if (res.ok) { setNewCoAdminEmail(""); setNewCoAdminName(""); showSuccess("Co-admin added!"); loadPaidData("co-admins"); }
      else { const d = await res.json(); setError(d.error); }
    } catch { setError("An error occurred"); }
  };

  const handleDeleteCoAdmin = async (id: string) => { try { await fetch("/api/co-admins", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); loadPaidData("co-admins"); } catch {} };

  const handleGiftToggle = async (itemId: string, field: "received" | "thankYouSent", value: boolean) => {
    try {
      await fetch("/api/gifts", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ itemId, [field]: value }) });
      loadPaidData("gifts");
    } catch {}
  };

  const handleExport = () => { window.open("/api/export?format=csv", "_blank"); };

  const handleUpgrade = async () => {
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId: registryInfo.id, plan: "unlimited" }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Failed to start checkout. Please check Stripe configuration.");
      }
    } catch { setError("Failed to start checkout"); }
  };

  const handleRegenerateCode = async (participantId: string) => {
    try {
      const res = await fetch(`/api/people/${participantId}`, { method: "PATCH" });
      const data = await res.json();
      if (res.ok && data.loginCode) {
        setLoginCodes(prev => ({ ...prev, [participantId]: data.loginCode }));
        showSuccess(`New login code: ${data.loginCode}`);
      } else {
        setError(data.error || "Failed to regenerate code");
      }
    } catch { setError("Failed to regenerate code"); }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => showSuccess("Copied to clipboard!"));
  };

  const handleSaveRegistryDetails = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    try {
      const res = await fetch(`/api/groups/${registryInfo.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: registryName, eventDate: eventDate || null, occasion, description: registryDescription }),
      });
      if (res.ok) { showSuccess("Registry details updated!"); loadData(registryInfo.id); }
      else { const d = await res.json(); setError(d.error || "Failed to update"); }
    } catch { setError("An error occurred"); }
  };

  const handleCopyLink = () => {
    const url = registryInfo.slug ? `${window.location.origin}/r/${registryInfo.slug}` : `${window.location.origin}/r/${registryInfo.inviteCode}`;
    navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const handleLogout = async () => { await fetch("/api/auth/logout", { method: "POST" }); sessionStorage.clear(); router.push("/"); };

  const totalItems = participants.reduce((sum, p) => sum + (p.wishlistItems?.length || 0), 0);
  const claimedItems = participants.reduce((sum, p) => sum + (p.wishlistItems?.filter(i => i.claimedById)?.length || 0), 0);

  const currencies = ["USD","EUR","GBP","CAD","AUD","ZAR","JPY","CHF","SEK","NOK","DKK","NZD","MXN","BRL","INR","CNY","KRW","SGD"];

  const PaidBadge = () => <span className="text-xs bg-wd-gold/10 text-wd-gold px-2 py-0.5 rounded-full border border-wd-gold/30 ml-2">PRO</span>;

  const PaidGate = ({ children, feature }: { children: React.ReactNode; feature: string }) => {
    if (isPaid) return <>{children}</>;
    return (
      <div className="bg-white p-8 rounded-2xl border border-wd-border card-glow text-center">
        <div className="text-4xl mb-3">🔒</div>
        <h3 className="text-xl font-bold text-wd-heading mb-2">{feature}</h3>
        <p className="text-wd-charcoal/60 mb-4">This feature is available on the Unlimited plan.</p>
        <button onClick={handleUpgrade} className="bg-wd-gold text-white px-6 py-2 rounded-xl font-semibold hover:bg-wd-gold-dark transition">Upgrade to Unlimited — $10</button>
      </div>
    );
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="text-xl text-wd-gold">Loading...</div></div>;

  const allSections: { key: Section; label: string; paid?: boolean }[] = [
    { key: "overview", label: "Overview" },
    { key: "customize", label: "Customize" },
    { key: "categories", label: "Categories" },
    { key: "funds", label: "Cash Funds" },
    { key: "co-admins", label: "Co-Admins", paid: true },
    { key: "rsvp", label: "RSVPs", paid: true },
    { key: "gifts", label: "Gifts", paid: true },
    { key: "analytics", label: "Analytics", paid: true },
  ];

  const eventLabels: Record<string, string> = {
    page_view: "Page viewed",
    item_claimed: "Item claimed",
    item_unclaimed: "Item unclaimed",
    guest_joined: "Guest joined",
    fund_contributed: "Fund contribution",
    rsvp_submitted: "RSVP submitted",
  };

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
              <button onClick={handleCopyLink} className="text-xs bg-wd-gold/10 text-wd-gold px-3 py-1.5 rounded-lg border border-wd-gold/30 hover:bg-wd-gold/20 transition">{copied ? "Copied!" : "Copy Share Link"}</button>
              <a href={registryInfo.slug ? `/r/${registryInfo.slug}` : `/r/${registryInfo.inviteCode}`} target="_blank" rel="noopener noreferrer" className="text-xs bg-white text-wd-charcoal px-3 py-1.5 rounded-lg border border-wd-border hover:bg-wd-cream transition">View Public Page</a>
              {isPaid && <button onClick={handleExport} className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition">Export CSV</button>}
              {isPaid ? <span className="text-xs bg-wd-gold text-white px-2 py-0.5 rounded-full">Unlimited</span> : <button onClick={handleUpgrade} className="text-xs bg-wd-gold text-white px-3 py-1.5 rounded-lg hover:bg-wd-gold-dark transition">Upgrade — $10</button>}
            </div>
          </div>
          <button onClick={handleLogout} className="self-start sm:self-auto bg-white text-wd-charcoal px-4 py-2 rounded-lg hover:bg-wd-cream transition border border-wd-border min-h-[44px]">Logout</button>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">{error}</div>}
        {successMessage && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg mb-4">{successMessage}</div>}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl border border-wd-border text-center card-glow">
            <div className="text-2xl font-bold text-wd-gold">{participants.length}</div>
            <div className="text-xs text-wd-charcoal/50">Participants</div>
            {!isPaid && <div className="text-xs text-wd-charcoal/40 mt-1">{participants.length}/{maxParticipants}</div>}
          </div>
          <div className="bg-white p-4 rounded-xl border border-wd-border text-center card-glow">
            <div className="text-2xl font-bold text-wd-gold">{totalItems}</div>
            <div className="text-xs text-wd-charcoal/50">Wish Items</div>
            {!isPaid && <div className="text-xs text-wd-charcoal/40 mt-1">max {maxItems}/person</div>}
          </div>
          <div className="bg-white p-4 rounded-xl border border-wd-border text-center card-glow">
            <div className="text-2xl font-bold text-emerald-600">{claimedItems}</div>
            <div className="text-xs text-wd-charcoal/50">Claimed</div>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex mb-6 bg-white rounded-lg p-1 border border-wd-border overflow-x-auto gap-1">
          {allSections.map((tab) => (
            <button key={tab.key} onClick={() => switchSection(tab.key)}
              className={`py-2.5 px-3 rounded-md text-xs sm:text-sm font-medium transition whitespace-nowrap min-h-[40px] ${activeSection === tab.key ? "bg-wd-gold text-white shadow-sm" : "text-wd-charcoal/50 hover:text-wd-heading"}`}>
              {tab.label}{tab.paid && !isPaid && <span className="ml-1 opacity-50">🔒</span>}
            </button>
          ))}
        </div>

        {/* ========== OVERVIEW ========== */}
        {activeSection === "overview" && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-2xl border border-wd-border card-glow">
                <h2 className="text-2xl font-bold text-wd-heading mb-4 font-display">Add Participant</h2>
                <form onSubmit={handleAddPerson} className="space-y-4">
                  <div><label className="block text-sm font-medium text-wd-charcoal mb-2">Name <span className="text-red-500">*</span></label>
                    <input type="text" value={newPersonName} onChange={(e) => setNewPersonName(e.target.value)} className="w-full px-4 py-2 bg-white border border-wd-border rounded-lg focus:ring-2 focus:ring-wd-gold/40 text-wd-heading placeholder-wd-charcoal/30" placeholder="Name" required /></div>
                  <div><label className="block text-sm font-medium text-wd-charcoal mb-2">Email <span className="text-wd-charcoal/40">(optional)</span></label>
                    <input type="email" value={newPersonEmail} onChange={(e) => setNewPersonEmail(e.target.value)} className="w-full px-4 py-2 bg-white border border-wd-border rounded-lg focus:ring-2 focus:ring-wd-gold/40 text-wd-heading placeholder-wd-charcoal/30" placeholder="person@example.com" /></div>
                  <button type="submit" className="w-full bg-wd-gold text-white py-2 rounded-xl font-semibold hover:bg-wd-gold-dark transition">Add Participant</button>
                </form>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-wd-border card-glow">
                <h2 className="text-2xl font-bold text-wd-heading mb-4 font-display">Gift Budget</h2>
                <form onSubmit={handleUpdateBudget} className="space-y-4">
                  <input type="number" value={budgetAmount} onChange={(e) => setBudgetAmount(e.target.value)} className="w-full px-4 py-2 bg-white border border-wd-border rounded-lg focus:ring-2 focus:ring-wd-gold/40 text-wd-heading" placeholder="50.00" step="0.01" min="0" />
                  <select value={budgetCurrency} onChange={(e) => setBudgetCurrency(e.target.value)} className="w-full px-4 py-2 bg-white border border-wd-border rounded-lg text-wd-heading">{currencies.map(c => <option key={c} value={c}>{c}</option>)}</select>
                  <button type="submit" className="w-full bg-wd-gold text-white py-2 rounded-xl font-semibold hover:bg-wd-gold-dark transition">Update Budget</button>
                </form>
              </div>
            </div>
            {/* Participants */}
            <div className="mt-8 bg-white p-6 rounded-2xl border border-wd-border card-glow">
              <h2 className="text-2xl font-bold text-wd-heading mb-4 font-display">Participants ({participants.length})</h2>
              {participants.length === 0 ? <p className="text-wd-charcoal/50">No participants yet.</p> : (
                <div className="space-y-3">
                  {participants.map((p) => {
                    const claimed = p.wishlistItems?.filter(i => i.claimedById)?.length || 0;
                    const total = p.wishlistItems?.length || 0;
                    const displayCode = loginCodes[p.id] || null;
                    return (
                      <div key={p.id} className="bg-wd-cream/50 border border-wd-border rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="min-w-0 flex-1">
                            <span className="font-semibold text-wd-heading">{p.name}</span>
                            {p.email && <span className="text-wd-charcoal/50 text-sm ml-2">{p.email}</span>}
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              {displayCode ? (
                                <span className="inline-flex items-center gap-1">
                                  <code className="bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-mono text-emerald-700 text-xs font-bold">{displayCode}</code>
                                  <button onClick={() => copyToClipboard(displayCode)} className="text-xs text-wd-gold hover:underline">copy</button>
                                </span>
                              ) : (
                                <button onClick={() => handleRegenerateCode(p.id)} className="text-xs bg-white border border-wd-border px-2 py-1 rounded text-wd-gold hover:bg-wd-cream transition">Get Login Code</button>
                              )}
                              <span className="text-xs text-wd-charcoal/50">{total} items</span>
                              {claimed > 0 && <span className="text-xs text-emerald-600">{claimed} claimed</span>}
                            </div>
                          </div>
                          <button onClick={() => handleDeletePerson(p.id, p.name)} className="text-red-500 hover:text-red-600 text-sm font-semibold min-h-[44px] px-3">Remove</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {/* Item Status */}
            {participants.some(p => p.wishlistItems?.length > 0) && (
              <div className="mt-8 bg-white p-6 rounded-2xl border border-wd-border card-glow">
                <h2 className="text-2xl font-bold text-wd-heading mb-4 font-display">Item Status</h2>
                <p className="text-sm text-wd-charcoal/50 mb-4">{revealEnabled ? "Reveal mode ON — you can see who claimed each item." : "You can see which items are claimed but not who."}</p>
                <div className="space-y-2">
                  {participants.map(p => p.wishlistItems?.map(item => (
                    <div key={item.id} className="flex items-center justify-between bg-wd-cream/50 border border-wd-border/50 rounded-lg p-3">
                      <div className="min-w-0 flex-1">
                        <span className="text-sm text-wd-gold">{p.name}</span><span className="text-wd-charcoal/30 mx-2">&bull;</span><span className="text-wd-heading text-sm">{item.title}</span>
                        {revealEnabled && item.claimedByName && <span className="text-xs text-wd-charcoal/50 ml-2">— by <strong>{item.claimedByName}</strong>{item.claimNote && <em> &ldquo;{item.claimNote}&rdquo;</em>}</span>}
                      </div>
                      {item.claimedById ? <span className="bg-wd-gold/10 text-wd-gold text-xs px-3 py-1 rounded-full border border-wd-gold/20">Claimed</span> : <span className="bg-gray-100 text-wd-charcoal/40 text-xs px-3 py-1 rounded-full border border-gray-200">Available</span>}
                    </div>
                  )))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ========== CUSTOMIZE ========== */}
        {activeSection === "customize" && (
          <div className="space-y-6">
          {/* Registry Details */}
          <div className="bg-white p-6 rounded-2xl border border-wd-border card-glow">
            <h2 className="text-2xl font-bold text-wd-heading mb-4 font-display">Registry Details</h2>
            <form onSubmit={handleSaveRegistryDetails} className="space-y-4">
              <div><label className="block text-sm font-medium text-wd-charcoal mb-2">Registry Name</label>
                <input type="text" value={registryName} onChange={(e) => setRegistryName(e.target.value)} className="w-full px-4 py-2 border border-wd-border rounded-lg focus:ring-2 focus:ring-wd-gold/40 text-wd-heading" required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-wd-charcoal mb-2">Occasion</label>
                  <select value={occasion} onChange={(e) => setOccasion(e.target.value)} className="w-full px-4 py-2 border border-wd-border rounded-lg text-wd-heading">
                    <option value="birthday">Birthday</option><option value="wedding">Wedding</option><option value="baby_shower">Baby Shower</option>
                    <option value="anniversary">Anniversary</option><option value="honeymoon">Honeymoon</option><option value="housewarming">Housewarming</option><option value="other">Other</option>
                  </select></div>
                <div><label className="block text-sm font-medium text-wd-charcoal mb-2">Event Date</label>
                  <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="w-full px-4 py-2 border border-wd-border rounded-lg text-wd-heading" /></div>
              </div>
              <div><label className="block text-sm font-medium text-wd-charcoal mb-2">Description</label>
                <textarea value={registryDescription} onChange={(e) => setRegistryDescription(e.target.value)} className="w-full px-4 py-2 border border-wd-border rounded-lg text-wd-heading h-20 resize-none" placeholder="A note about your registry..." /></div>
              <button type="submit" className="w-full bg-wd-gold text-white py-2 rounded-xl font-semibold hover:bg-wd-gold-dark transition">Save Details</button>
            </form>
          </div>

          {/* Personalization */}
          <div className="bg-white p-6 rounded-2xl border border-wd-border card-glow">
            <h2 className="text-2xl font-bold text-wd-heading mb-4 font-display">Personalize</h2>
            {registryInfo.slug && (
              <div className="mb-6 bg-wd-cream border border-wd-border rounded-lg p-4">
                <p className="text-sm text-wd-charcoal/60 mb-1">Shareable link:</p>
                <div className="flex items-center gap-2"><code className="text-wd-gold font-mono text-sm flex-1 truncate">{typeof window !== 'undefined' ? window.location.origin : ''}/r/{registryInfo.slug}</code>
                  <button onClick={handleCopyLink} className="text-xs bg-wd-gold text-white px-3 py-1.5 rounded-lg">{copied ? "Copied!" : "Copy"}</button></div>
              </div>
            )}
            <form onSubmit={handleSaveCustomization} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-wd-charcoal mb-2">Partner 1</label><input type="text" value={coupleName1} onChange={(e) => setCoupleName1(e.target.value)} className="w-full px-4 py-2 border border-wd-border rounded-lg focus:ring-2 focus:ring-wd-gold/40 text-wd-heading" placeholder="Sarah" /></div>
                <div><label className="block text-sm font-medium text-wd-charcoal mb-2">Partner 2</label><input type="text" value={coupleName2} onChange={(e) => setCoupleName2(e.target.value)} className="w-full px-4 py-2 border border-wd-border rounded-lg focus:ring-2 focus:ring-wd-gold/40 text-wd-heading" placeholder="James" /></div>
              </div>
              <div><label className="block text-sm font-medium text-wd-charcoal mb-2">Personal Message</label><textarea value={personalMessage} onChange={(e) => setPersonalMessage(e.target.value)} className="w-full px-4 py-2 border border-wd-border rounded-lg focus:ring-2 focus:ring-wd-gold/40 text-wd-heading h-24 resize-none" placeholder="Message for your guests..." /></div>
              <div><label className="block text-sm font-medium text-wd-charcoal mb-2">Cover Image URL</label><input type="url" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} className="w-full px-4 py-2 border border-wd-border rounded-lg focus:ring-2 focus:ring-wd-gold/40 text-wd-heading" placeholder="https://..." /></div>
              <div className="border-t border-wd-border pt-4 flex items-center justify-between">
                <div><p className="font-medium text-wd-heading">Thank-You Reveal Mode</p><p className="text-sm text-wd-charcoal/50">See who claimed each item for thank-you notes.</p></div>
                <button type="button" onClick={() => setRevealEnabled(!revealEnabled)} className={`relative w-12 h-6 rounded-full transition ${revealEnabled ? "bg-wd-gold" : "bg-gray-300"}`}><span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${revealEnabled ? "translate-x-6" : ""}`} /></button>
              </div>
              <button type="submit" className="w-full bg-wd-gold text-white py-3 rounded-xl font-semibold hover:bg-wd-gold-dark transition">Save Customization</button>
            </form>
          </div>
          </div>
        )}

        {/* ========== CATEGORIES ========== */}
        {activeSection === "categories" && (
          <div className="bg-white p-6 rounded-2xl border border-wd-border card-glow">
            <h2 className="text-2xl font-bold text-wd-heading mb-4 font-display">Gift Categories</h2>
            <form onSubmit={handleAddCategory} className="flex gap-2 mb-6">
              <input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} className="flex-1 px-4 py-2 border border-wd-border rounded-lg focus:ring-2 focus:ring-wd-gold/40 text-wd-heading" placeholder="e.g., Kitchen" />
              <button type="submit" className="bg-wd-gold text-white px-6 py-2 rounded-lg font-semibold hover:bg-wd-gold-dark transition min-h-[44px]">Add</button>
            </form>
            {categories.length === 0 ? <p className="text-wd-charcoal/50 text-center py-4">No categories yet.</p> : (
              <div className="space-y-2">{categories.map(cat => (
                <div key={cat.id} className="flex items-center justify-between bg-wd-cream/50 border border-wd-border/50 rounded-lg p-3">
                  <span className="text-wd-heading font-medium">{cat.name}</span>
                  <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-500 hover:text-red-600 text-sm font-semibold min-h-[44px] px-3">Delete</button>
                </div>
              ))}</div>
            )}
          </div>
        )}

        {/* ========== CASH FUNDS ========== */}
        {activeSection === "funds" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-wd-border card-glow">
              <h2 className="text-2xl font-bold text-wd-heading mb-4 font-display">Cash / Gift Funds</h2>
              <p className="text-sm text-wd-charcoal/50 mb-4">Guests pledge amounts here — no money is processed through WishDrop. You arrange payment directly.</p>
              <form onSubmit={handleAddFund} className="space-y-3">
                <input type="text" value={newFundTitle} onChange={(e) => setNewFundTitle(e.target.value)} className="w-full px-4 py-2 border border-wd-border rounded-lg focus:ring-2 focus:ring-wd-gold/40 text-wd-heading" placeholder="Fund title" />
                <input type="text" value={newFundDescription} onChange={(e) => setNewFundDescription(e.target.value)} className="w-full px-4 py-2 border border-wd-border rounded-lg focus:ring-2 focus:ring-wd-gold/40 text-wd-heading" placeholder="Description (optional)" />
                <input type="number" value={newFundTarget} onChange={(e) => setNewFundTarget(e.target.value)} className="w-full px-4 py-2 border border-wd-border rounded-lg focus:ring-2 focus:ring-wd-gold/40 text-wd-heading" placeholder="Target amount (optional)" step="0.01" min="0" />
                <div>
                  <label className="block text-sm font-medium text-wd-charcoal mb-1">How should guests pay you?</label>
                  <textarea value={newFundPayment} onChange={(e) => setNewFundPayment(e.target.value)}
                    className="w-full px-4 py-2 border border-wd-border rounded-lg focus:ring-2 focus:ring-wd-gold/40 text-wd-heading placeholder-wd-charcoal/30 h-20 resize-none"
                    placeholder={"e.g. Bank: FNB, Acc: 12345678, Branch: 250655\nor PayPal: sarah@example.com\nor Venmo: @sarah-james\nor M-Pesa: +254 712 345 678\nor PIX: sarah@example.com"} />
                  <p className="text-xs text-wd-charcoal/40 mt-1">Guests will see this after pledging. Supports any payment method worldwide.</p>
                </div>
                <button type="submit" className="w-full bg-wd-gold text-white py-2 rounded-xl font-semibold hover:bg-wd-gold-dark transition">Create Fund</button>
              </form>
            </div>
            {cashFunds.map(fund => {
              const progress = fund.targetAmount ? Math.min((fund.totalRaised / fund.targetAmount) * 100, 100) : null;
              return (
                <div key={fund.id} className="bg-white p-6 rounded-2xl border border-wd-border card-glow">
                  <div className="flex justify-between items-start mb-2"><h3 className="text-xl font-semibold text-wd-heading">{fund.title}</h3><button onClick={() => handleDeleteFund(fund.id)} className="text-red-500 text-sm font-semibold">Delete</button></div>
                  {fund.description && <p className="text-sm text-wd-charcoal/60 mb-3">{fund.description}</p>}
                  <div className="flex items-baseline gap-2 mb-2"><span className="text-2xl font-bold text-wd-gold">{fund.currency} {fund.totalRaised.toFixed(0)}</span>{fund.targetAmount && <span className="text-sm text-wd-charcoal/50">of {fund.currency} {fund.targetAmount}</span>}</div>
                  {progress !== null && <div className="w-full bg-wd-cream rounded-full h-3 mb-2"><div className="bg-wd-gold h-3 rounded-full transition-all" style={{ width: `${progress}%` }} /></div>}
                  <p className="text-xs text-wd-charcoal/50 mb-3">{fund.contributorCount} contributor{fund.contributorCount !== 1 ? "s" : ""}</p>
                  {/* Payment details */}
                  {editingFundPayment === fund.id ? (
                    <div className="border-t border-wd-border pt-3 space-y-2">
                      <label className="block text-sm font-medium text-wd-charcoal">Payment Details</label>
                      <textarea value={editPaymentText} onChange={(e) => setEditPaymentText(e.target.value)}
                        className="w-full px-3 py-2 border border-wd-border rounded-lg focus:ring-2 focus:ring-wd-gold/40 text-wd-heading text-sm h-20 resize-none"
                        placeholder="e.g. PayPal: sarah@example.com" />
                      <div className="flex gap-2">
                        <button onClick={() => handleSaveFundPayment(fund.id)} className="bg-wd-gold text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-wd-gold-dark transition">Save</button>
                        <button onClick={() => setEditingFundPayment(null)} className="text-wd-charcoal/50 text-sm hover:text-wd-charcoal">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="border-t border-wd-border pt-3">
                      {fund.paymentDetails ? (
                        <div className="flex items-start justify-between">
                          <div><p className="text-xs text-wd-charcoal/50 mb-0.5">Payment info (shown to guests):</p><p className="text-sm text-wd-heading whitespace-pre-line">{fund.paymentDetails}</p></div>
                          <button onClick={() => { setEditingFundPayment(fund.id); setEditPaymentText(fund.paymentDetails || ""); }} className="text-wd-gold text-xs hover:underline flex-shrink-0 ml-2">Edit</button>
                        </div>
                      ) : (
                        <button onClick={() => { setEditingFundPayment(fund.id); setEditPaymentText(""); }} className="text-sm text-wd-gold hover:underline">+ Add payment details (bank, PayPal, Venmo, etc.)</button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ========== CO-ADMINS (PAID) ========== */}
        {activeSection === "co-admins" && (
          <PaidGate feature="Co-Admins">
            <div className="bg-white p-6 rounded-2xl border border-wd-border card-glow">
              <h2 className="text-2xl font-bold text-wd-heading mb-2 font-display">Co-Admins<PaidBadge /></h2>
              <p className="text-sm text-wd-charcoal/50 mb-6">Invite others to help manage your registry.</p>
              <form onSubmit={handleAddCoAdmin} className="flex flex-col sm:flex-row gap-2 mb-6">
                <input type="email" value={newCoAdminEmail} onChange={(e) => setNewCoAdminEmail(e.target.value)} className="flex-1 px-4 py-2 border border-wd-border rounded-lg focus:ring-2 focus:ring-wd-gold/40 text-wd-heading" placeholder="Email address" required />
                <input type="text" value={newCoAdminName} onChange={(e) => setNewCoAdminName(e.target.value)} className="sm:w-40 px-4 py-2 border border-wd-border rounded-lg focus:ring-2 focus:ring-wd-gold/40 text-wd-heading" placeholder="Name (optional)" />
                <button type="submit" className="bg-wd-gold text-white px-6 py-2 rounded-lg font-semibold hover:bg-wd-gold-dark transition min-h-[44px]">Add</button>
              </form>
              {coAdmins.length === 0 ? <p className="text-wd-charcoal/50 text-center py-4">No co-admins yet.</p> : (
                <div className="space-y-2">{coAdmins.map(ca => (
                  <div key={ca.id} className="flex items-center justify-between bg-wd-cream/50 border border-wd-border/50 rounded-lg p-3">
                    <div><span className="text-wd-heading font-medium">{ca.name || ca.email}</span>{ca.name && <span className="text-wd-charcoal/50 text-sm ml-2">{ca.email}</span>}</div>
                    <button onClick={() => handleDeleteCoAdmin(ca.id)} className="text-red-500 text-sm font-semibold">Remove</button>
                  </div>
                ))}</div>
              )}
            </div>
          </PaidGate>
        )}

        {/* ========== RSVP (PAID) ========== */}
        {activeSection === "rsvp" && (
          <PaidGate feature="RSVP Tracking">
            <div className="bg-white p-6 rounded-2xl border border-wd-border card-glow">
              <h2 className="text-2xl font-bold text-wd-heading mb-2 font-display">RSVP Tracking<PaidBadge /></h2>
              <div className="grid grid-cols-4 gap-3 mb-6">
                <div className="bg-emerald-50 p-3 rounded-xl text-center border border-emerald-200"><div className="text-2xl font-bold text-emerald-600">{rsvpSummary.totalYes}</div><div className="text-xs text-emerald-600">Attending</div></div>
                <div className="bg-yellow-50 p-3 rounded-xl text-center border border-yellow-200"><div className="text-2xl font-bold text-yellow-600">{rsvpSummary.totalMaybe}</div><div className="text-xs text-yellow-600">Maybe</div></div>
                <div className="bg-red-50 p-3 rounded-xl text-center border border-red-200"><div className="text-2xl font-bold text-red-500">{rsvpSummary.totalNo}</div><div className="text-xs text-red-500">Declined</div></div>
                <div className="bg-gray-50 p-3 rounded-xl text-center border border-gray-200"><div className="text-2xl font-bold text-wd-charcoal">{rsvpSummary.total}</div><div className="text-xs text-wd-charcoal/50">Total</div></div>
              </div>
              {rsvps.length === 0 ? <p className="text-wd-charcoal/50 text-center py-4">No RSVPs yet. Guests can RSVP from their wishlist page.</p> : (
                <div className="space-y-2">{rsvps.map(r => (
                  <div key={r.id} className="flex items-center justify-between bg-wd-cream/50 border border-wd-border/50 rounded-lg p-3">
                    <div className="min-w-0 flex-1">
                      <span className="font-medium text-wd-heading">{r.name}</span>
                      {r.headcount > 1 && <span className="text-xs text-wd-charcoal/50 ml-2">+{r.headcount - 1} guest{r.headcount > 2 ? "s" : ""}</span>}
                      {r.note && <p className="text-xs text-wd-charcoal/50 mt-0.5 italic">{r.note}</p>}
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full border font-semibold ${r.status === "yes" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : r.status === "maybe" ? "bg-yellow-50 text-yellow-600 border-yellow-200" : "bg-red-50 text-red-500 border-red-200"}`}>{r.status.toUpperCase()}</span>
                  </div>
                ))}</div>
              )}
            </div>
          </PaidGate>
        )}

        {/* ========== GIFTS RECEIVED (PAID) ========== */}
        {activeSection === "gifts" && (
          <PaidGate feature="Gift Received & Thank-You Tracking">
            <div className="bg-white p-6 rounded-2xl border border-wd-border card-glow">
              <h2 className="text-2xl font-bold text-wd-heading mb-2 font-display">Gift Tracking<PaidBadge /></h2>
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-wd-gold/10 p-3 rounded-xl text-center border border-wd-gold/30"><div className="text-2xl font-bold text-wd-gold">{giftStats.totalClaimed}</div><div className="text-xs text-wd-gold">Claimed</div></div>
                <div className="bg-emerald-50 p-3 rounded-xl text-center border border-emerald-200"><div className="text-2xl font-bold text-emerald-600">{giftStats.totalReceived}</div><div className="text-xs text-emerald-600">Received</div></div>
                <div className="bg-yellow-50 p-3 rounded-xl text-center border border-yellow-200"><div className="text-2xl font-bold text-yellow-600">{giftStats.thankYouPending}</div><div className="text-xs text-yellow-600">Thank-you pending</div></div>
              </div>
              {gifts.length === 0 ? <p className="text-wd-charcoal/50 text-center py-4">No claimed gifts yet.</p> : (
                <div className="space-y-2">{gifts.map(g => (
                  <div key={g.id} className="bg-wd-cream/50 border border-wd-border/50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="min-w-0 flex-1">
                        <span className="font-medium text-wd-heading">{g.title}</span>
                        <span className="text-xs text-wd-charcoal/50 ml-2">for {g.recipientName}</span>
                        {g.claimedByName && <p className="text-xs text-wd-charcoal/50 mt-0.5">From: <strong>{g.claimedByName}</strong>{g.claimNote && <em> — &ldquo;{g.claimNote}&rdquo;</em>}</p>}
                        {g.price && <p className="text-xs text-wd-gold mt-0.5">{g.currency || "USD"} {g.price}</p>}
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input type="checkbox" checked={g.received} onChange={(e) => handleGiftToggle(g.id, "received", e.target.checked)} className="w-4 h-4 rounded border-wd-border text-wd-gold focus:ring-wd-gold" />
                          <span className="text-xs text-wd-charcoal/60">Received</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input type="checkbox" checked={g.thankYouSent} onChange={(e) => handleGiftToggle(g.id, "thankYouSent", e.target.checked)} className="w-4 h-4 rounded border-wd-border text-emerald-600 focus:ring-emerald-500" />
                          <span className="text-xs text-wd-charcoal/60">Thank-you</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}</div>
              )}
            </div>
          </PaidGate>
        )}

        {/* ========== ANALYTICS (PAID) ========== */}
        {activeSection === "analytics" && (
          <PaidGate feature="Registry Analytics">
            {analytics ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="bg-white p-4 rounded-xl border border-wd-border text-center card-glow"><div className="text-2xl font-bold text-wd-gold">{analytics.totalViews}</div><div className="text-xs text-wd-charcoal/50">Page Views</div></div>
                  <div className="bg-white p-4 rounded-xl border border-wd-border text-center card-glow"><div className="text-2xl font-bold text-emerald-600">{analytics.totalClaims}</div><div className="text-xs text-wd-charcoal/50">Items Claimed</div></div>
                  <div className="bg-white p-4 rounded-xl border border-wd-border text-center card-glow"><div className="text-2xl font-bold text-wd-gold">{analytics.totalGuests}</div><div className="text-xs text-wd-charcoal/50">Guests Joined</div></div>
                  <div className="bg-white p-4 rounded-xl border border-wd-border text-center card-glow"><div className="text-2xl font-bold text-wd-gold">{analytics.totalContributions}</div><div className="text-xs text-wd-charcoal/50">Contributions</div></div>
                  <div className="bg-white p-4 rounded-xl border border-wd-border text-center card-glow"><div className="text-2xl font-bold text-wd-gold">{analytics.totalRsvps}</div><div className="text-xs text-wd-charcoal/50">RSVPs</div></div>
                </div>

                {/* Claim timeline */}
                {analytics.claimTimeline.length > 0 && (
                  <div className="bg-white p-6 rounded-2xl border border-wd-border card-glow">
                    <h3 className="text-lg font-bold text-wd-heading mb-4">Claim Activity (Last 30 Days)</h3>
                    <div className="flex items-end gap-1 h-32">
                      {analytics.claimTimeline.map((d, i) => {
                        const max = Math.max(...analytics.claimTimeline.map(x => x.count), 1);
                        const h = (d.count / max) * 100;
                        return <div key={i} className="flex-1 flex flex-col items-center justify-end">
                          <div className="w-full bg-wd-gold rounded-t" style={{ height: `${Math.max(h, 4)}%` }} title={`${d.date}: ${d.count} claims`} />
                        </div>;
                      })}
                    </div>
                  </div>
                )}

                {/* Recent activity */}
                <div className="bg-white p-6 rounded-2xl border border-wd-border card-glow">
                  <h3 className="text-lg font-bold text-wd-heading mb-4">Recent Activity</h3>
                  {analytics.recentActivity.length === 0 ? <p className="text-wd-charcoal/50">No activity yet.</p> : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">{analytics.recentActivity.map((a, i) => (
                      <div key={i} className="flex items-center justify-between text-sm py-2 border-b border-wd-border/30 last:border-0">
                        <span className="text-wd-heading">{eventLabels[a.event] || a.event}</span>
                        <span className="text-wd-charcoal/50 text-xs">{new Date(a.createdAt).toLocaleDateString()}</span>
                      </div>
                    ))}</div>
                  )}
                </div>
              </div>
            ) : <p className="text-center text-wd-charcoal/50 py-8">Loading analytics...</p>}
          </PaidGate>
        )}
      </div>
    </div>
  );
}
