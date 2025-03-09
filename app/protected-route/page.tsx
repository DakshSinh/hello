import { requireAuth } from "@/auth/utils";

export default async function ProtectedPage() {
  await requireAuth();

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Protected Page</h1>
    </div>
  );
}
