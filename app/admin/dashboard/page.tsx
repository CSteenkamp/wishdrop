"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
  }>;
}

interface RegistryBudget {
  budgetAmount?: number;
  budgetCurrency?: string;
}

export default function AdminDashboard() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [newPersonName, setNewPersonName] = useState("");
  const [newPersonEmail, setNewPersonEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [registryInfo, setRegistryInfo] = useState({ id: "", name: "", inviteCode: "" });
  const [budget, setBudget] = useState<RegistryBudget>({ budgetAmount: undefined, budgetCurrency: "USD" });
  const [budgetAmount, setBudgetAmount] = useState("");
  const [budgetCurrency, setBudgetCurrency] = useState("USD");
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
        setBudget({
          budgetAmount: groupData.group.budgetAmount,
          budgetCurrency: groupData.group.budgetCurrency || "USD"
        });
        setBudgetAmount(groupData.group.budgetAmount?.toString() || "");
        setBudgetCurrency(groupData.group.budgetCurrency || "USD");
      }

      setLoading(false);
    } catch (err) {
      setError("Failed to load data");
      setLoading(false);
    }
  };

  const handleAddPerson = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!newPersonName.trim()) {
      setError("Name is required");
      return;
    }

    try {
      const res = await fetch("/api/people", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newPersonName,
          email: newPersonEmail.trim() || undefined,
          groupId: registryInfo.id
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to add participant");
        return;
      }

      const emailMsg = data.person.email ? ` and email: ${data.person.email}` : "";
      setSuccessMessage(`Added ${data.person.name} with code: ${data.person.loginCode}${emailMsg}`);
      setNewPersonName("");
      setNewPersonEmail("");
      loadData(registryInfo.id);
    } catch (err) {
      setError("An error occurred");
    }
  };

  const handleDeletePerson = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name}?`)) return;

    setError("");
    setSuccessMessage("");

    try {
      const res = await fetch(`/api/people/${id}`, { method: "DELETE" });

      if (!res.ok) {
        setError("Failed to remove participant");
        return;
      }

      setSuccessMessage(`Removed ${name}`);
      loadData(registryInfo.id);
    } catch (err) {
      setError("An error occurred");
    }
  };

  const handleUpdateBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    const amount = budgetAmount.trim() ? parseFloat(budgetAmount) : undefined;

    if (budgetAmount.trim() && (isNaN(amount!) || amount! <= 0)) {
      setError("Please enter a valid budget amount");
      return;
    }

    try {
      const res = await fetch(`/api/groups/${registryInfo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ budgetAmount: amount, budgetCurrency }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to update budget");
        return;
      }

      setSuccessMessage("Budget updated!");
      setBudget({ budgetAmount: amount, budgetCurrency });
    } catch (err) {
      setError("An error occurred");
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    router.push("/");
  };

  // Count claimed items across all participants
  const totalItems = participants.reduce((sum, p) => sum + (p.wishlistItems?.length || 0), 0);
  const claimedItems = participants.reduce((sum, p) =>
    sum + (p.wishlistItems?.filter(i => i.claimedById)?.length || 0), 0
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-wd-dark">
        <div className="text-xl text-wd-gold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-wd-dark p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-4xl font-bold wd-gradient-text font-display">Admin Dashboard</h1>
            <p className="text-gray-300 mt-1 text-sm sm:text-base truncate">{registryInfo.name}</p>
            <p className="text-sm text-gray-400">
              Invite Code: <code className="bg-wd-dark border border-white/10 px-2 py-1 rounded font-mono text-wd-gold text-xs sm:text-sm">{registryInfo.inviteCode}</code>
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="self-start sm:self-auto bg-white/10 text-wd-snow px-4 py-2 rounded-lg hover:bg-white/20 transition border border-white/10 min-h-[44px]"
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="bg-wd-coral/10 border border-wd-coral/30 text-wd-coral px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-lg mb-4">
            {successMessage}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-wd-dark-card p-4 rounded-xl border border-white/10 text-center">
            <div className="text-2xl font-bold text-wd-coral">{participants.length}</div>
            <div className="text-xs text-gray-400">Participants</div>
          </div>
          <div className="bg-wd-dark-card p-4 rounded-xl border border-white/10 text-center">
            <div className="text-2xl font-bold text-wd-purple">{totalItems}</div>
            <div className="text-xs text-gray-400">Wish Items</div>
          </div>
          <div className="bg-wd-dark-card p-4 rounded-xl border border-white/10 text-center">
            <div className="text-2xl font-bold text-emerald-400">{claimedItems}</div>
            <div className="text-xs text-gray-400">Claimed</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Participant */}
          <div className="bg-wd-dark-card p-6 rounded-2xl border border-white/10 card-glow">
            <h2 className="text-2xl font-bold text-wd-snow mb-4">Add Participant</h2>
            <form onSubmit={handleAddPerson} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Name <span className="text-wd-coral">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={newPersonName}
                  onChange={(e) => setNewPersonName(e.target.value)}
                  className="w-full px-4 py-2 bg-wd-dark border border-white/10 rounded-lg focus:ring-2 focus:ring-wd-purple focus:border-transparent text-wd-snow placeholder-gray-500"
                  placeholder="Enter participant's name"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email <span className="text-gray-500">(optional)</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={newPersonEmail}
                  onChange={(e) => setNewPersonEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-wd-dark border border-white/10 rounded-lg focus:ring-2 focus:ring-wd-purple focus:border-transparent text-wd-snow placeholder-gray-500"
                  placeholder="person@example.com"
                />
                <p className="text-xs text-gray-500 mt-1">
                  If provided, they can log in via email magic link
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-wd-coral to-wd-purple text-white py-2 rounded-xl font-semibold hover:opacity-90 transition-all duration-300 hover:scale-105 transform"
              >
                Add Participant
              </button>
            </form>
          </div>

          {/* Budget Management */}
          <div className="bg-wd-dark-card p-6 rounded-2xl border border-white/10 card-glow">
            <h2 className="text-2xl font-bold text-wd-snow mb-4">Gift Budget</h2>
            <form onSubmit={handleUpdateBudget} className="space-y-4">
              <div>
                <label htmlFor="budgetAmount" className="block text-sm font-medium text-gray-300 mb-2">
                  Budget Amount <span className="text-gray-500">(optional)</span>
                </label>
                <input
                  type="number"
                  id="budgetAmount"
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(e.target.value)}
                  className="w-full px-4 py-2 bg-wd-dark border border-white/10 rounded-lg focus:ring-2 focus:ring-wd-purple focus:border-transparent text-wd-snow placeholder-gray-500"
                  placeholder="50.00"
                  step="0.01"
                  min="0"
                />
              </div>

              <div>
                <label htmlFor="budgetCurrency" className="block text-sm font-medium text-gray-300 mb-2">
                  Currency
                </label>
                <select
                  id="budgetCurrency"
                  value={budgetCurrency}
                  onChange={(e) => setBudgetCurrency(e.target.value)}
                  className="w-full px-4 py-2 bg-wd-dark border border-white/10 rounded-lg focus:ring-2 focus:ring-wd-purple focus:border-transparent text-wd-snow"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                  <option value="ZAR">ZAR - South African Rand</option>
                  <option value="JPY">JPY - Japanese Yen</option>
                  <option value="CHF">CHF - Swiss Franc</option>
                  <option value="SEK">SEK - Swedish Krona</option>
                  <option value="NOK">NOK - Norwegian Krone</option>
                  <option value="DKK">DKK - Danish Krone</option>
                  <option value="NZD">NZD - New Zealand Dollar</option>
                  <option value="MXN">MXN - Mexican Peso</option>
                  <option value="BRL">BRL - Brazilian Real</option>
                  <option value="INR">INR - Indian Rupee</option>
                  <option value="CNY">CNY - Chinese Yuan</option>
                  <option value="KRW">KRW - South Korean Won</option>
                  <option value="SGD">SGD - Singapore Dollar</option>
                </select>
              </div>

              <div className="text-sm text-gray-400">
                {budget.budgetAmount ? (
                  <p>Current budget: <span className="font-semibold text-wd-gold">{budget.budgetCurrency} {budget.budgetAmount}</span></p>
                ) : (
                  <p className="italic">No budget set</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-wd-gold text-wd-dark py-2 rounded-xl font-semibold hover:bg-wd-gold-dark transition-all duration-300 hover:scale-105 transform"
              >
                Update Budget
              </button>
            </form>
          </div>
        </div>

        {/* Participants List */}
        <div className="mt-8 bg-wd-dark-card p-6 rounded-2xl border border-white/10 card-glow">
          <h2 className="text-2xl font-bold text-wd-snow mb-4">Participants ({participants.length})</h2>
          {participants.length === 0 ? (
            <p className="text-gray-400">No participants yet. Add your first participant above!</p>
          ) : (
            <>
            {/* Mobile card layout */}
            <div className="space-y-3 md:hidden">
              {participants.map((person) => {
                const claimed = person.wishlistItems?.filter(i => i.claimedById)?.length || 0;
                const total = person.wishlistItems?.length || 0;
                return (
                  <div key={person.id} className="bg-wd-dark/50 border border-white/5 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-wd-snow">{person.name}</span>
                      <button
                        onClick={() => handleDeletePerson(person.id, person.name)}
                        className="text-wd-coral hover:text-wd-coral-dark font-semibold text-sm min-h-[44px] min-w-[44px] flex items-center justify-center"
                      >
                        Remove
                      </button>
                    </div>
                    {person.email && (
                      <p className="text-gray-400 text-sm truncate mb-1">{person.email}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <code className="bg-wd-dark border border-white/10 px-2 py-1 rounded font-mono text-wd-gold text-xs">
                        {person.loginCode}
                      </code>
                      <span className="text-gray-400">{total} items</span>
                      {claimed > 0 && (
                        <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2 py-0.5 rounded-full font-semibold border border-emerald-500/20">
                          {claimed} claimed
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop table layout */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-wd-gold text-sm">Name</th>
                    <th className="text-left py-3 px-4 text-wd-gold text-sm">Email</th>
                    <th className="text-left py-3 px-4 text-wd-gold text-sm">Login Code</th>
                    <th className="text-left py-3 px-4 text-wd-gold text-sm">Items</th>
                    <th className="text-left py-3 px-4 text-wd-gold text-sm">Claimed</th>
                    <th className="text-left py-3 px-4 text-wd-gold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((person) => {
                    const claimed = person.wishlistItems?.filter(i => i.claimedById)?.length || 0;
                    const total = person.wishlistItems?.length || 0;
                    return (
                      <tr key={person.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-3 px-4 text-wd-snow">{person.name}</td>
                        <td className="py-3 px-4">
                          {person.email ? (
                            <span className="text-gray-300 text-sm">{person.email}</span>
                          ) : (
                            <span className="text-gray-500 text-sm italic">No email</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <code className="bg-wd-dark border border-white/10 px-2 py-1 rounded font-mono text-wd-gold text-sm">
                            {person.loginCode}
                          </code>
                        </td>
                        <td className="py-3 px-4 text-wd-snow">{total}</td>
                        <td className="py-3 px-4">
                          {claimed > 0 ? (
                            <span className="text-emerald-400">{claimed}/{total}</span>
                          ) : (
                            <span className="text-gray-500">0/{total}</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleDeletePerson(person.id, person.name)}
                            className="text-wd-coral hover:text-wd-coral-dark font-semibold text-sm"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            </>
          )}
        </div>

        {/* Claim Status - admin sees "Claimed" but NOT who claimed */}
        {participants.some(p => p.wishlistItems?.length > 0) && (
          <div className="mt-8 bg-wd-dark-card p-6 rounded-2xl border border-white/10 card-glow">
            <h2 className="text-2xl font-bold text-wd-snow mb-4">Item Status</h2>
            <p className="text-sm text-gray-400 mb-4">As the registry owner, you can see which items are claimed but not who claimed them.</p>
            <div className="space-y-2">
              {participants.map((person) =>
                person.wishlistItems?.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-wd-dark/50 border border-white/5 rounded-lg p-3">
                    <div className="min-w-0 flex-1">
                      <span className="text-sm text-wd-purple">{person.name}</span>
                      <span className="text-gray-500 mx-2">&bull;</span>
                      <span className="text-wd-snow text-sm">{item.title}</span>
                    </div>
                    {item.claimedById ? (
                      <span className="bg-emerald-500/10 text-emerald-400 text-xs px-3 py-1 rounded-full border border-emerald-500/20 flex-shrink-0 ml-2">
                        Claimed
                      </span>
                    ) : (
                      <span className="bg-white/5 text-gray-500 text-xs px-3 py-1 rounded-full border border-white/10 flex-shrink-0 ml-2">
                        Available
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
