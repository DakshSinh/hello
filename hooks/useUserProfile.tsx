// hooks/useUserProfile.tsx
"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/auth/auth-client";

// Type for user profile data
type UserProfile = {
  id: string;
  name: string;
  email: string;
  image?: string;
  lastFetched: number;
};

const CACHE_KEY = "app:user-profile";
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        // Try to get from localStorage first
        const cached = getCachedProfile();

        // If we have a valid cached profile, use it immediately
        if (cached) {
          setProfile(cached);
          setLoading(false);

          // If cache is stale, refresh in background
          if (Date.now() - cached.lastFetched > CACHE_TTL) {
            fetchFreshProfile();
          }
        } else {
          // No cache, fetch from server
          await fetchFreshProfile();
        }
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to load profile")
        );
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function fetchFreshProfile() {
    try {
      // Get session from authClient
      const session = await authClient.getSession();

      if (!session?.data?.user) {
        setProfile(null);
        setLoading(false);
        return;
      }
      // Create profile with timestamp and ensure image is either a string or undefined
      const freshProfile: UserProfile = {
        ...session.data.user,
        lastFetched: Date.now(),
        image: session.data.user.image ?? undefined,
      };

      // Update state
      setProfile(freshProfile);
      setLoading(false);

      // Save to localStorage
      localStorage.setItem(CACHE_KEY, JSON.stringify(freshProfile));
    } catch (err) {
      // Only set error if we don't already have cached data
      if (!profile) {
        setError(
          err instanceof Error ? err : new Error("Failed to load profile")
        );
        setLoading(false);
      }
    }
  }

  function getCachedProfile(): UserProfile | null {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const profile = JSON.parse(cached) as UserProfile;

      // Validate cache freshness
      if (Date.now() - profile.lastFetched > CACHE_TTL * 2) {
        // Cache is too old, clear it
        localStorage.removeItem(CACHE_KEY);
        return null;
      }

      return profile;
    } catch {
      // If any error occurs (parsing, etc.), clear cache and return null
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
  }

  function clearCache() {
    localStorage.removeItem(CACHE_KEY);
  }

  return {
    profile,
    loading,
    error,
    refreshProfile: fetchFreshProfile,
    clearCache,
  };
}
