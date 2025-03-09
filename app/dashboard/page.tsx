import { requireAuth } from "@/auth/utils";
import SignOutButton from "./sign-out-button";

export default async function Dashboard() {
  const session = await requireAuth();

  return (
    <div className="w-full max-w-md mx-auto p-4 flex flex-col items-center">
      {session?.user?.image && (
        <img
          src={session.user.image}
          alt={session.user.name || "User"}
          className="w-16 h-16 rounded-full mb-2"
        />
      )}
      <h1 className="text-xl font-semibold mb-1">
        {session?.user?.name || "Guest"}
      </h1>
      <p className="text-sm mb-4">
        {session?.user?.email || "Not Available"}
      </p>
      <SignOutButton />
    </div>
  );
}
