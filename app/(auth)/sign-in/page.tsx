"use client";

import SignInButton from "./sign-in-button";
import { useEffect, useState, Suspense } from "react";
import { authClient } from "@/auth/auth-client";
import { useRouter, useSearchParams } from "next/navigation";

function SearchParamsWrapper() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  return callbackUrl;
}

export default function SignInPage() {
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);
  const [callbackUrl] = useState("/dashboard");

  useEffect(() => {
    async function checkSession() {
      try {
        const session = await authClient.getSession();
        if (session?.data) {
          router.push(callbackUrl);
        }
      } catch (error) {
        console.error("Failed to check session:", error);
      } finally {
        setCheckingSession(false);
      }
    }

    checkSession();
  }, [callbackUrl, router]);

  if (checkingSession) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-2xl">Checking session...</p>
      </div>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchParamsWrapper />
      <SignInButton />
    </Suspense>
  );
}
