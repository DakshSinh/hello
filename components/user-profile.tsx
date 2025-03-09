// components/user-profile.tsx
"use client";

import { useUserProfile } from "@/hooks/useUserProfile";
import { useEffect, useState } from "react";
import Image from "next/image";

export function UserProfileSection() {
  const { profile, loading, error, refreshProfile } = useUserProfile();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Refresh data when component mounts
  useEffect(() => {
    async function refresh() {
      if (profile) {
        setIsRefreshing(true);
        await refreshProfile();
        setIsRefreshing(false);
      }
    }
    refresh();
  }, []);

  if (loading && !profile) {
    return (
      <div className="animate-pulse">
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-full w-12 mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-4"></div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="text-red-500">
        Failed to load profile. Please try again.
      </div>
    );
  }

  if (!profile) {
    return <div>No profile data available.</div>;
  }

  return (
    <div className="flex items-start space-x-4 relative">
      {isRefreshing && (
        <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-blue-500 animate-ping"></div>
      )}

      <div className="flex-shrink-0">
        {profile.image ? (
          <Image
            src={profile.image}
            alt={profile.name || "User"}
            width={48}
            height={48}
            className="rounded-full"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-gray-600 font-medium text-lg">
              {profile.name?.charAt(0) || profile.email?.charAt(0) || "?"}
            </span>
          </div>
        )}
      </div>

      <div>
        <h3 className="font-medium">{profile.name}</h3>
        <p className="text-sm text-gray-500">{profile.email}</p>
      </div>
    </div>
  );
}
