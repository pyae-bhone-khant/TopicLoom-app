"use client";

import { useEffect } from "react";
import { useSession } from "@/component/lib/auth-client";
import { useProfileStore } from "@/lib/stores/useProfileStore";
import axiosInstance from "@/component/lib/axiosInstance";


export default function ProfileHydrator() {
  const { data: session } = useSession();
  const { setProfile, clearProfile } = useProfileStore();

  // Force hydration immediately on mount
  useEffect(() => {
    clearProfile();
  }, [clearProfile]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (session?.user) {
        try {
          const res = await axiosInstance.get('/api/profile/get-profile');
          setProfile(res.data);
        } catch (error) {
          console.error("Failed to fetch profile:", error);
          setProfile(session.user as Parameters<typeof setProfile>[0]);
        }
      } else if (session === null) {
        clearProfile();
      }
    };

    fetchProfile();
  }, [session, setProfile, clearProfile]);

  return null;
}
