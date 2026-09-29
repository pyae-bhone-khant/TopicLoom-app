"use client";

import { useEffect } from "react";
import { useSession } from "@/component/lib/auth-client";
import { useProfileStore } from "@/lib/stores/useProfileStore";
import axiosInstance from "@/component/lib/axiosInstance";

/**
 * Mount this once near the root (e.g. inside your layout's client wrapper).
 * It watches the better-auth session and keeps the Zustand profile store in sync.
 * Also fetches profile data from API to get role information.
 * No UI is rendered — it is a pure sync side-effect.
 */
export default function ProfileHydrator() {
  const { data: session } = useSession();
  const { setProfile, clearProfile } = useProfileStore();

  useEffect(() => {
    const fetchProfile = async () => {
      if (session?.user) {
        try {
          const res = await axiosInstance.get('/api/profile/get-profile');
          setProfile(res.data);
        } catch (error) {
          console.error("Failed to fetch profile:", error);
          // Fallback to session data if API fails
          setProfile(session.user as Parameters<typeof setProfile>[0]);
        }
      } else if (session === null) {
        // session is explicitly null (loaded, no user) → signed out
        clearProfile();
      }
    };

    fetchProfile();
  }, [session, setProfile, clearProfile]);

  return null;
}
