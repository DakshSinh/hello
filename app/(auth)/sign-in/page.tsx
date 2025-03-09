"use client";

import SignInButton from "./sign-in-button";
import { useEffect, useState } from "react";
import { authClient } from "@/auth/auth-client";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [checkingSession, setCheckingSession] = useState(true);

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
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <SignInButton />;
}
