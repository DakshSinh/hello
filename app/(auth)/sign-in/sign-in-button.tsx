"use client";

import { authClient } from "@/auth/auth-client";

export default function SignInButton() {
  return (
    <button
      className="cursor-pointer"
      onClick={async () => {
        await authClient.signIn.social({
          provider: "google",
          callbackURL: "/dashboard",
          newUserCallbackURL: "/onboarding",
        });
      }}
    >
      Google
    </button>
  );
}
