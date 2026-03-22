"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function VerifyContent() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Invalid or missing verification token.");
      return;
    }

    fetch(`/api/auth/verify?token=${encodeURIComponent(token)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Cookie is set automatically by the response
          // Store minimal display data in sessionStorage for UI
          sessionStorage.setItem("personId", data.person.id);
          sessionStorage.setItem("groupId", data.person.groupId);
          sessionStorage.setItem("groupName", data.person.groupName);
          sessionStorage.setItem("personName", data.person.name);
          sessionStorage.setItem("isLoggedIn", "true");

          setStatus("success");
          setMessage(`Welcome back, ${data.person.name}!`);

          setTimeout(() => {
            router.push("/wishlist");
          }, 2000);
        } else {
          setStatus("error");
          setMessage(data.error || "Failed to verify login link.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("An error occurred while verifying your login link.");
      });
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-wd-cream p-4">
      <div className="bg-white p-8 rounded-2xl border border-wd-border card-glow w-full max-w-md text-center">
        {status === "loading" && (
          <>
            <div className="text-6xl mb-4">🎁</div>
            <h1 className="text-2xl font-bold text-wd-heading mb-4 font-display">
              Verifying Your Login
            </h1>
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wd-gold"></div>
            </div>
            <p className="text-wd-charcoal/50">Please wait while we verify your magic link...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-2xl font-bold text-emerald-600 mb-4 font-display">
              Login Successful!
            </h1>
            <p className="text-wd-charcoal mb-4">{message}</p>
            <p className="text-sm text-wd-charcoal/40">
              Redirecting you to the registry...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="text-6xl mb-4">&#10060;</div>
            <h1 className="text-2xl font-bold text-red-600 mb-4 font-display">
              Verification Failed
            </h1>
            <p className="text-wd-charcoal mb-6">{message}</p>

            <div className="space-y-3">
              <button
                onClick={() => router.push("/login")}
                className="w-full bg-wd-gold text-white py-2 px-4 rounded-xl hover:bg-wd-gold-dark transition-all duration-300 hover:scale-105 transform font-semibold"
              >
                Try Login Again
              </button>
              <button
                onClick={() => router.push("/")}
                className="w-full bg-white text-wd-charcoal py-2 px-4 rounded-xl hover:bg-wd-cream transition border border-wd-border"
              >
                Back to Home
              </button>
            </div>

            <div className="mt-6 p-4 bg-wd-gold/10 rounded-lg text-sm text-wd-gold border border-wd-gold/20">
              <p className="font-semibold mb-1">Common issues:</p>
              <ul className="text-left list-disc list-inside space-y-1 text-wd-charcoal/50">
                <li>Link may have expired (15 minutes limit)</li>
                <li>Link can only be used once</li>
                <li>Make sure you clicked the exact link from your email</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyMagicLink() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-wd-cream p-4">
        <div className="bg-white p-8 rounded-2xl border border-wd-border card-glow w-full max-w-md text-center">
          <div className="text-6xl mb-4">🎁</div>
          <h1 className="text-2xl font-bold text-wd-heading mb-4 font-display">Loading...</h1>
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wd-gold"></div>
          </div>
        </div>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
