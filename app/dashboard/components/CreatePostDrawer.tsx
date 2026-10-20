"use client";

import { useState } from "react";
import { X, Upload } from "lucide-react";

interface CreatePostDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreatePostDrawer({ isOpen, onClose }: CreatePostDrawerProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [featuredImageUrl, setFeaturedImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState("");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setFormError("");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok || typeof data.url !== "string" || !data.url) {
        throw new Error(data.error || "Image upload failed. Please try again.");
      }

      setFeaturedImageUrl(data.url);
    } catch (error) {
      console.error("Error uploading image:", error);
      setFormError(error instanceof Error ? error.message : "Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploading || creating) return;

    setCreating(true);
    setFormError("");
    try {
      const response = await fetch("/api/dashboard/post/create-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          featuredImageUrl,
          status: "DRAFT",
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Failed to create post. Please try again.");
      }

      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error creating post:", error);
      setFormError(error instanceof Error ? error.message : "Failed to create post. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50">
      <div className="w-full max-w-md h-full bg-slate-900 border-l border-slate-800 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-100">Create Post</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Featured Image
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 cursor-pointer hover:bg-slate-700">
                <Upload className="w-4 h-4" />
                <span>{uploading ? "Uploading..." : "Upload"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              {featuredImageUrl && (
                <img
                  src={featuredImageUrl}
                  alt="Preview"
                  className="w-16 h-16 object-cover rounded-lg"
                />
              )}
            </div>
            {formError && (
              <p role="alert" className="mt-2 text-sm text-red-400">
                {formError}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={uploading || creating}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {creating ? "Creating..." : uploading ? "Wait for image upload..." : "Create Post"}
          </button>  
        </form>
      </div>
    </div>
  );
}
