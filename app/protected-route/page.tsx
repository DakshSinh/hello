import { requireAuth } from "@/auth/utils";

export default async function ProtectedPage() {
  await requireAuth();

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Protected Page</h1>
      <p className="text-gray-700 dark:text-gray-300">
        This is a protected page. You can only see this if you're logged in.
      </p>
    </div>
  );
}
