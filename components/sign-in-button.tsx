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
  return (
    <Link href={session?.session ? "/" : "/sign-in"}>
      <button className="cursor-pointer">
        {session?.session ? "Home" : "Sign In"}
      </button>
    </Link>
  );
}

export async function SignInFallback() {
  const guessIsSignIn = checkOptimisticSession(await headers());
  return (
    <Link href={guessIsSignIn ? "/" : "/sign-in"}>
      <button className="cursor-pointer">
        {guessIsSignIn ? "Home" : "Sign In"}
      </button>
    </Link>
  );
}
