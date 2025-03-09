import { auth } from "@/auth";
import { headers } from "next/headers";
import { cache } from "react";
import SignOutButton from "./sign-out-button";

const getSessionData = cache(async (headerData: Headers) => {
  return auth.api.getSession({ headers: headerData });
});

export default async function Dashboard() {
  const headerData = await headers();
  const session = await getSessionData(headerData);

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
