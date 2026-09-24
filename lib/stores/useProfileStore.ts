import { create } from "zustand";

export interface ProfileState {
  id: string | null;
  name: string | null;
  email: string | null;
  image: string | null;
  bio: string | null;
  isHydrated: boolean;

  /** Populate the store from the better-auth session user object */
  setProfile: (user: {
    id: string;
    name?: string | null;
    email: string;
    image?: string | null;
    bio?: string | null;
  }) => void;

  /** Optimistically update fields after a successful profile save */
  updateProfile: (patch: {
    name?: string | null;
    image?: string | null;
    bio?: string | null;
  }) => void;

  /** Clear store on sign-out */
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  id: null,
  name: null,
  email: null,
  image: null,
  bio: null,
  isHydrated: false,

  setProfile: (user) =>
    set({
      id: user.id,
      name: user.name ?? null,
      email: user.email,
      image: user.image ?? null,
      bio: user.bio ?? null,
      isHydrated: true,
    }),

  updateProfile: (patch) =>
    set((state) => ({
      name: patch.name !== undefined ? patch.name : state.name,
      image: patch.image !== undefined ? patch.image : state.image,
      bio: patch.bio !== undefined ? patch.bio : state.bio,
    })),

  clearProfile: () =>
    set({
      id: null,
      name: null,
      email: null,
      image: null,
      bio: null,
      isHydrated: false,
    }),
}));
