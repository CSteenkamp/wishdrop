"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface WishlistItem {
  id?: string;
  title: string;
  link: string;
  price?: number | null;
  currency?: string;
  priority?: string;
  imageUrl?: string | null;
  claimedById?: string | null;
  claimedByName?: string | null;
  participantId?: string;
}

interface ParticipantWithItems {
  id: string;
  name: string;
  wishlistItems: WishlistItem[];
}

export default function Wishlist() {
  const [personId, setPersonId] = useState("");
  const [personName, setPersonName] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupId, setGroupId] = useState("");
  const [myItems, setMyItems] = useState<WishlistItem[]>([{ title: "", link: "" }]);
  const [allParticipants, setAllParticipants] = useState<ParticipantWithItems[]>([]);
  const [budget, setBudget] = useState<{ amount?: number; currency?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [claiming, setClaiming] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"my-items" | "registry">("registry");
  const [filterMode, setFilterMode] = useState<"all" | "available" | "claimed">("all");
  const router = useRouter();

  useEffect(() => {
    const id = sessionStorage.getItem("personId");
    const name = sessionStorage.getItem("personName");
    const group = sessionStorage.getItem("groupName");
    const gId = sessionStorage.getItem("groupId");

    if (!id || !name) {
      router.push("/login");
      return;
    }

    setPersonId(id);
    setPersonName(name);
    setGroupName(group || "");
    setGroupId(gId || "");

    if (gId) {
      loadAllData(id, gId);
    } else {
      setLoading(false);
    }
  }, [router]);

  const loadAllData = async (pid: string, gid: string) => {
    try {
      const loginCode = sessionStorage.getItem("loginCode");

      const promises: Promise<Response>[] = [
        fetch(`/api/wishlist/items?registryId=${gid}`),
        fetch(`/api/groups/${gid}`),
      ];

      if (loginCode) {
        promises.push(
          fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ loginCode, groupId: gid }),
          })
        );
      }

      const responses = await Promise.all(promises);
      const [itemsRes, groupRes] = responses;

      if (itemsRes.ok) {
        const data = await itemsRes.json();
        setAllParticipants(data.participants || []);

        const me = (data.participants || []).find((p: ParticipantWithItems) => p.id === pid);
        if (me && me.wishlistItems.length > 0) {
          setMyItems(me.wishlistItems.map((item: WishlistItem) => ({
            id: item.id,
            title: item.title,
            link: item.link,
            price: item.price,
            currency: item.currency || 'USD',
            priority: item.priority || 'medium',
          })));
        }
      }

      if (groupRes.ok) {
        const groupData = await groupRes.json();
        if (groupData.group?.budgetAmount) {
          setBudget({
            amount: groupData.group.budgetAmount,
            currency: groupData.group.budgetCurrency || "USD"
          });
        }
      }

      setLoading(false);
    } catch (err) {
      setError("Failed to load data");
      setLoading(false);
    }
  };

  const handleItemChange = (index: number, field: keyof WishlistItem, value: string | number) => {
    const newItems = [...myItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setMyItems(newItems);
  };

  const handleAddItem = () => {
    if (myItems.length < 10) {
      setMyItems([...myItems, { title: "", link: "" }]);
    }
  };

  const handleRemoveItem = (index: number) => {
    if (myItems.length > 1) {
      setMyItems(myItems.filter((_, i) => i !== index));
    }
  };

  const handleSaveWishlist = async () => {
    setError("");
    setSuccessMessage("");
    setSaving(true);

    const validItems = myItems.filter((item) => item.title.trim());

    if (validItems.length < 1) {
      setError("Add at least 1 item to your wishlist");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ personId, items: validItems }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to save wishlist");
        setSaving(false);
        return;
      }

      setSuccessMessage("Wishlist saved!");
      setSaving(false);

      if (groupId) loadAllData(personId, groupId);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("An error occurred while saving");
      setSaving(false);
    }
  };

  const handleClaim = async (itemId: string) => {
    setClaiming(itemId);
    setError("");

    try {
      const res = await fetch("/api/wishlist/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, participantId: personId, participantName: personName }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to claim item");
        setClaiming(null);
        return;
      }

      if (groupId) loadAllData(personId, groupId);
      setClaiming(null);
    } catch (err) {
      setError("An error occurred");
      setClaiming(null);
    }
  };

  const handleUnclaim = async (itemId: string) => {
    setClaiming(itemId);
    setError("");

    try {
      const res = await fetch("/api/wishlist/unclaim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, participantId: personId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to unclaim item");
        setClaiming(null);
        return;
      }

      if (groupId) loadAllData(personId, groupId);
      setClaiming(null);
    } catch (err) {
      setError("An error occurred");
      setClaiming(null);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    router.push("/");
  };

  const priorityColors: Record<string, string> = {
    high: "bg-red-50 text-red-600 border-red-200",
    medium: "bg-wd-gold/10 text-wd-gold border-wd-gold/30",
    low: "bg-gray-100 text-gray-500 border-gray-200",
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-xl text-wd-gold">Loading...</div>
      </div>
    );
  }

  const otherParticipants = allParticipants.filter(p => p.id !== personId);

  const allOtherItems = otherParticipants.flatMap(p =>
    p.wishlistItems.map(item => ({ ...item, ownerName: p.name, ownerId: p.id }))
  );

  const filteredItems = allOtherItems.filter(item => {
    if (filterMode === "available") return !item.claimedById;
    if (filterMode === "claimed") return !!item.claimedById;
    return true;
  });

  return (
    <div className="min-h-screen bg-wd-cream p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-4xl font-bold text-wd-heading font-display tracking-wide truncate">Welcome, {personName}!</h1>
            {groupName && <p className="text-wd-charcoal/60 mt-1 text-sm sm:text-base truncate">{groupName}</p>}
            {budget && (
              <div className="mt-2 inline-flex items-center bg-wd-gold/10 border border-wd-gold/30 text-wd-gold px-3 py-1 rounded-lg text-sm font-medium">
                Budget: {budget.currency} {budget.amount}
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="self-start sm:self-auto bg-white text-wd-charcoal px-4 py-2 rounded-lg hover:bg-wd-cream transition border border-wd-border min-h-[44px]"
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg mb-4">
            {successMessage}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex mb-6 bg-white rounded-lg p-1 border border-wd-border">
          <button
            onClick={() => setActiveTab("registry")}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition min-h-[48px] ${
              activeTab === "registry"
                ? "bg-wd-gold text-white shadow-sm"
                : "text-wd-charcoal/50 hover:text-wd-heading"
            }`}
          >
            Registry Items
          </button>
          <button
            onClick={() => setActiveTab("my-items")}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition min-h-[48px] ${
              activeTab === "my-items"
                ? "bg-wd-gold text-white shadow-sm"
                : "text-wd-charcoal/50 hover:text-wd-heading"
            }`}
          >
            My Wishlist
          </button>
        </div>

        {/* Registry Items Tab */}
        {activeTab === "registry" && (
          <div>
            {/* Filter */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {(["all", "available", "claimed"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setFilterMode(mode)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition min-h-[44px] ${
                    filterMode === mode
                      ? "bg-wd-gold text-white"
                      : "bg-white text-wd-charcoal/50 hover:bg-wd-cream border border-wd-border"
                  }`}
                >
                  {mode === "all" ? "All Items" : mode === "available" ? "Available" : "Claimed"}
                </button>
              ))}
            </div>

            {filteredItems.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-wd-border card-glow text-center">
                <div className="text-6xl mb-4">🎁</div>
                <p className="text-wd-heading text-lg">
                  {allOtherItems.length === 0
                    ? "No one has added wish items yet."
                    : "No items match this filter."}
                </p>
                <p className="text-sm text-wd-charcoal/50 mt-2">Check back later or add your own items!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className={`bg-white p-5 rounded-2xl border card-glow ${
                      item.claimedById ? "border-emerald-200" : "border-wd-border"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-wd-gold font-medium mb-1">For {item.ownerName}</p>
                        <h3 className="font-semibold text-wd-heading text-lg truncate">{item.title}</h3>
                      </div>
                      {item.priority && (
                        <span className={`text-xs px-2 py-1 rounded-full border ml-2 flex-shrink-0 ${priorityColors[item.priority] || priorityColors.medium}`}>
                          {item.priority}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      {item.price && (
                        <span className="text-wd-gold font-semibold text-sm">
                          {item.currency || 'USD'} {item.price}
                        </span>
                      )}
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-wd-gold hover:underline truncate"
                        >
                          View Product
                        </a>
                      )}
                    </div>

                    {/* Claim/Unclaim */}
                    {item.claimedById ? (
                      <div>
                        {item.claimedById === personId ? (
                          <div className="flex items-center justify-between">
                            <span className="text-emerald-600 text-sm font-medium">You claimed this</span>
                            <button
                              onClick={() => item.id && handleUnclaim(item.id)}
                              disabled={claiming === item.id}
                              className="bg-white text-wd-charcoal px-4 py-2 rounded-lg text-sm hover:bg-wd-cream transition border border-wd-border min-h-[44px] disabled:opacity-50"
                            >
                              {claiming === item.id ? "..." : "Unclaim"}
                            </button>
                          </div>
                        ) : (
                          <div className="bg-wd-gold/10 border border-wd-gold/20 rounded-lg px-3 py-2">
                            <span className="text-wd-rose-gold text-sm">
                              Claimed by {item.claimedByName}
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => item.id && handleClaim(item.id)}
                        disabled={claiming === item.id}
                        className="w-full bg-wd-gold text-white py-3 rounded-xl font-semibold hover:bg-wd-gold-dark transition-all duration-300 disabled:opacity-50 min-h-[48px]"
                      >
                        {claiming === item.id ? "Claiming..." : "Claim This Gift"}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* My Wishlist Tab */}
        {activeTab === "my-items" && (
          <div className="bg-white p-6 rounded-2xl border border-wd-border card-glow">
            <h2 className="text-2xl font-bold text-wd-heading mb-4 font-display">My Wishlist</h2>
            <p className="text-sm text-wd-charcoal/50 mb-4">Add items you&apos;d like to receive</p>

            <div className="space-y-4">
              {myItems.map((item, index) => (
                <div key={index} className="border border-wd-border p-4 rounded-lg bg-wd-cream/50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-wd-gold">Item {index + 1}</span>
                    {myItems.length > 1 && (
                      <button
                        onClick={() => handleRemoveItem(index)}
                        className="text-red-500 text-sm hover:text-red-600 min-h-[44px] min-w-[44px] flex items-center justify-center"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleItemChange(index, "title", e.target.value)}
                      placeholder="Item name"
                      className="w-full px-3 py-2 bg-white border border-wd-border rounded focus:ring-2 focus:ring-wd-gold/40 focus:border-wd-gold text-wd-heading placeholder-wd-charcoal/30"
                    />
                    <input
                      type="url"
                      value={item.link}
                      onChange={(e) => handleItemChange(index, "link", e.target.value)}
                      placeholder="https://example.com/product (optional)"
                      className="w-full px-3 py-2 bg-white border border-wd-border rounded focus:ring-2 focus:ring-wd-gold/40 focus:border-wd-gold text-wd-heading placeholder-wd-charcoal/30"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        value={item.price || ""}
                        onChange={(e) => handleItemChange(index, "price", parseFloat(e.target.value) || 0)}
                        placeholder="Price (optional)"
                        className="w-full px-3 py-2 bg-white border border-wd-border rounded focus:ring-2 focus:ring-wd-gold/40 focus:border-wd-gold text-wd-heading placeholder-wd-charcoal/30"
                        step="0.01"
                        min="0"
                      />
                      <select
                        value={item.priority || "medium"}
                        onChange={(e) => handleItemChange(index, "priority", e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-wd-border rounded focus:ring-2 focus:ring-wd-gold/40 focus:border-wd-gold text-wd-heading"
                      >
                        <option value="high">High Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="low">Low Priority</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}

              {myItems.length < 10 && (
                <button
                  onClick={handleAddItem}
                  className="w-full py-2 border-2 border-dashed border-wd-border rounded-lg text-wd-charcoal/40 hover:border-wd-gold hover:text-wd-gold transition min-h-[48px]"
                >
                  + Add Item
                </button>
              )}

              <button
                onClick={handleSaveWishlist}
                disabled={saving}
                className="w-full bg-wd-gold text-white py-3 rounded-xl font-semibold hover:bg-wd-gold-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transform min-h-[48px]"
              >
                {saving ? "Saving..." : "Save Wishlist"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
