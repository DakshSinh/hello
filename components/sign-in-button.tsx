import { auth } from "@/auth";
import { headers } from "next/headers";
import Link from "next/link";

function checkOptimisticSession(headers: Headers) {
  const guessIsSignIn =
    headers.get("cookie")?.includes("better-auth.session") ||
    headers.get("cookie")?.includes("__Secure-better-auth.session-token");
  return !!guessIsSignIn;
}

export async function SignInButton() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.session) {
    // If user is already signed in, show a dashboard link instead
    return (
      <Link href="/dashboard">
        <button className="cursor-pointer">Dashboard</button>
      </Link>
    );
  }

  // Extract callback URL from the current URL if it exists
  const url = new URL((await headers()).get("x-url") || "http://localhost");
  const callbackUrl = url.searchParams.get("callbackUrl") || "/dashboard";

  return (
    <Link href="/sign-in">
      <button className="cursor-pointer">Sign In</button>
    </Link>
  );
}

export async function SignInFallback() {
  const guessIsSignIn = checkOptimisticSession(await headers());
  return (
    <Link href={guessIsSignIn ? "/dashboard" : "/sign-in"}>
      <button className="cursor-pointer">
        {guessIsSignIn ? "Dashboard" : "Sign In"}
      </button>
    </Link>
  );
}
