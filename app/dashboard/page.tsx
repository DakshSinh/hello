import { auth } from "@/auth";
import { headers } from "next/headers";
import SignOutButton from "./sign-out-button";

export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return <div>Please sign in to access your dashboard.</div>;
  }

  return (
    <div>
      <h1>Welcome, {session.user.name}!</h1>
      <p>Your email: {session.user.email}</p>
      <SignOutButton />
    </div>
  );
}