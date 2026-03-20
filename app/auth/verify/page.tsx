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
          sessionStorage.setItem("personId", data.person.id);
          sessionStorage.setItem("groupId", data.person.groupId);
          sessionStorage.setItem("groupName", data.person.groupName);
          sessionStorage.setItem("personName", data.person.name);
          sessionStorage.setItem("isLoggedIn", "true");
          sessionStorage.setItem("loginMethod", "magic-link");

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
    <div className="min-h-screen flex items-center justify-center bg-wd-dark p-4">
      <div className="bg-wd-dark-card p-8 rounded-2xl border border-white/10 card-glow w-full max-w-md text-center">
        {status === "loading" && (
          <>
            <div className="text-6xl mb-4">🎁</div>
            <h1 className="text-2xl font-bold text-wd-snow mb-4 font-display">
              Verifying Your Login
            </h1>
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wd-purple"></div>
            </div>
            <p className="text-gray-400">Please wait while we verify your magic link...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-2xl font-bold text-emerald-400 mb-4 font-display">
              Login Successful!
            </h1>
            <p className="text-gray-300 mb-4">{message}</p>
            <p className="text-sm text-gray-500">
              Redirecting you to the registry...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="text-6xl mb-4">&#10060;</div>
            <h1 className="text-2xl font-bold text-wd-coral mb-4 font-display">
              Verification Failed
            </h1>
            <p className="text-gray-300 mb-6">{message}</p>

            <div className="space-y-3">
              <button
                onClick={() => router.push("/login")}
                className="w-full bg-gradient-to-r from-wd-coral to-wd-purple text-white py-2 px-4 rounded-xl hover:opacity-90 transition-all duration-300 hover:scale-105 transform font-semibold"
              >
                Try Login Again
              </button>
              <button
                onClick={() => router.push("/")}
                className="w-full bg-white/10 text-wd-snow py-2 px-4 rounded-xl hover:bg-white/20 transition border border-white/10"
              >
                Back to Home
              </button>
            </div>

            <div className="mt-6 p-4 bg-wd-gold/10 rounded-lg text-sm text-wd-gold border border-wd-gold/20">
              <p className="font-semibold mb-1">Common issues:</p>
              <ul className="text-left list-disc list-inside space-y-1 text-gray-400">
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
      <div className="min-h-screen flex items-center justify-center bg-wd-dark p-4">
        <div className="bg-wd-dark-card p-8 rounded-2xl border border-white/10 card-glow w-full max-w-md text-center">
          <div className="text-6xl mb-4">🎁</div>
          <h1 className="text-2xl font-bold text-wd-snow mb-4 font-display">Loading...</h1>
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wd-purple"></div>
          </div>
        </div>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
