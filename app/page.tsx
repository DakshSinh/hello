import { SignInButton, SignInFallback } from "@/components/sign-in-button";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense fallback={<SignInFallback />}>
      <SignInButton />
    </Suspense>
  );
}
