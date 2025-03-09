import { auth } from "@/auth";
import { headers } from "next/headers";
import { cache } from "react";
import SignOutButton from "./sign-out-button";
import { redirect } from "next/navigation";

const getSessionData = cache(async (headerData: Headers) => {
  return auth.api.getSession({ headers: headerData });
});

export default async function Dashboard() {
  const headerData = headers();
  const session = await getSessionData(await headerData);

  // If no session, redirect to sign-in
  if (!session) {
    redirect("/sign-in?callbackUrl=/dashboard");
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Welcome, {session.user.name}!</h1>
      <div className="mb-6">
        <p className="text-gray-700 dark:text-gray-300 mb-2">
          <strong>Email:</strong> {session.user.email}
        </p>
        {session.user.image && (
          <div className="mt-4">
            <img
              src={session.user.image}
              alt={session.user.name || "User"}
              className="w-16 h-16 rounded-full border-2 border-gray-200"
            />
          </div>
        )}
      </div>
      <SignOutButton />
    </div>
  );
}
