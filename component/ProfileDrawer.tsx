"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  User,
  Camera,
  Pencil,
  CheckCircle,
  XCircle,
  Loader2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useSession, authClient } from "@/component/lib/auth-client";

// ─── Schema ────────────────────────────────────────────────────────────────────
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().max(160, "Bio must be 160 characters or less").optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

// ─── Props ─────────────────────────────────────────────────────────────────────
// Controlled: parent manages open state. No DialogTrigger inside.
interface ProfileDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

// ─── Component ─────────────────────────────────────────────────────────────────
export default function ProfileDrawer({ isOpen, onOpenChange }: ProfileDrawerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  // avatarFile will be sent to the API on submit
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: session } = useSession();
  const user = session?.user;

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? "",
      bio: "",
    },
  });

  // ── Avatar handling ──────────────────────────────────────────────────────────
  function applyAvatarFile(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file", { description: "Please upload an image file." });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large", { description: "Maximum size is 5 MB." });
      return;
    }
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setAvatarPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) applyAvatarFile(file);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) applyAvatarFile(file);
  }

  function removeAvatar() {
    setAvatarPreview(null);
    setAvatarFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // ── Submit ───────────────────────────────────────────────────────────────────
  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      if (data.bio) formData.append("bio", data.bio);
      if (avatarFile) formData.append("avatar", avatarFile);

      const res = await fetch("/api/profile/update-profile", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error ?? "Server error");
      }

      // Force-refresh the session so the navbar avatar updates immediately
      await authClient.getSession({ fetchOptions: { cache: "no-store" } });

      // Reset form with saved values so the drawer shows fresh data on next open
      form.reset({ name: data.name, bio: data.bio ?? "" });

      // Clear local avatar preview — the refreshed session image is now the source of truth
      setAvatarPreview(null);
      setAvatarFile(null);

      toast.success("Profile updated!", {
        description: "Your changes have been saved.",
        icon: <CheckCircle className="text-green-500" />,
      });
      onOpenChange(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      toast.error("Update failed", {
        description: message,
        icon: <XCircle className="text-red-500" />,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentAvatar = avatarPreview ?? user?.image ?? null;
  const bioValue = form.watch("bio") ?? "";

  return (
    // disablePointerDismissal={true} prevents Base UI from closing the dialog when
    // the user clicks outside or when the native file-picker steals focus.
    <Dialog open={isOpen} onOpenChange={onOpenChange} disablePointerDismissal={true}>
      <DialogContent
        className="w-full sm:max-w-md bg-slate-900 border-slate-700 p-0 overflow-hidden"
        showCloseButton={false}
      >
        {/* Gradient header strip */}
        <div className="h-24 bg-gradient-to-r from-blue-600/40 to-purple-600/40 relative" />

        {/* Avatar — overlaps the header strip */}
        <div className="px-6 pb-0 -mt-12">
          <div className="relative inline-block">
            {/* Avatar circle */}
            <div
              className={`w-24 h-24 rounded-full border-4 border-slate-900 overflow-hidden cursor-pointer group
                ${isDragging ? "ring-2 ring-blue-400" : ""}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              {currentAvatar ? (
                <img
                  src={currentAvatar}
                  alt="Avatar preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                  <User className="w-10 h-10" />
                </div>
              )}
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Remove avatar button */}
            <AnimatePresence>
              {avatarPreview && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  onClick={removeAvatar}
                  className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg transition-colors"
                  aria-label="Remove avatar"
                >
                  <X className="w-3 h-3" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Camera badge */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-7 h-7 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center cursor-pointer shadow-md transition-colors"
            >
              <Camera className="w-3.5 h-3.5 text-white" />
            </div>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Drag hint */}
          <p className="mt-2 text-xs text-slate-500">
            Click or drag & drop · max 5 MB
          </p>
        </div>

        {/* Form */}
        <div className="px-6 pb-6 pt-4">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
              <Pencil className="w-4 h-4 text-blue-400" />
              Edit Profile
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="profile-name" className="text-slate-300">
                Display Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="profile-name"
                  type="text"
                  placeholder="Your name"
                  className="pl-10 bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
                  {...form.register("name")}
                />
              </div>
              {form.formState.errors.name && (
                <p className="text-xs text-red-400">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            {/* Bio */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="profile-bio" className="text-slate-300">
                  Bio
                </Label>
                <span
                  className={`text-xs tabular-nums ${
                    bioValue.length > 140 ? "text-red-400" : "text-slate-500"
                  }`}
                >
                  {bioValue.length}/160
                </span>
              </div>
              <Textarea
                id="profile-bio"
                placeholder="Tell people a little about yourself…"
                rows={3}
                className="bg-slate-800 border-slate-600 text-white placeholder-slate-400 resize-none focus:border-blue-500"
                {...form.register("bio")}
              />
              {form.formState.errors.bio && (
                <p className="text-xs text-red-400">
                  {form.formState.errors.bio.message}
                </p>
              )}
            </div>

            {/* Email (read-only) */}
            <div className="space-y-1.5">
              <Label className="text-slate-300">Email</Label>
              <Input
                type="email"
                value={user?.email ?? ""}
                readOnly
                className="bg-slate-800/50 border-slate-700 text-slate-400 cursor-not-allowed"
              />
              <p className="text-xs text-slate-600">Email cannot be changed.</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
