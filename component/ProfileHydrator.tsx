"use client";

import { useEffect } from "react";
import { useSession } from "@/component/lib/auth-client";
import { useProfileStore } from "@/lib/stores/useProfileStore";

/**
 * Mount this once near the root (e.g. inside your layout's client wrapper).
 * It watches the better-auth session and keeps the Zustand profile store in sync.
 * No UI is rendered — it is a pure sync side-effect.
 */
export default function ProfileHydrator() {
  const { data: session } = useSession();
  const { setProfile, clearProfile } = useProfileStore();

  useEffect(() => {
    if (session?.user) {
      setProfile(session.user as Parameters<typeof setProfile>[0]);
    } else if (session === null) {
      // session is explicitly null (loaded, no user) → signed out
      clearProfile();
    }
    // session === undefined means still loading — do nothing
  }, [session, setProfile, clearProfile]);

  return null;
}
