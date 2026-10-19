"use client";

import axiosInstance from "@/component/lib/axiosInstance";
import { useEffect, useState } from "react";
import AllPostsCard, { PostData } from "../components/AllPostsCard";
import { useProfileStore } from "@/lib/stores/useProfileStore";
import CreatePostDrawer from "../components/CreatePostDrawer";

type PostsResponse = PostData[] | {
  posts: PostData[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export default function Post() {
  const [data, setData] = useState<PostsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { role } = useProfileStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Admin sees all posts, Editor sees only own posts
        const endpoint = role === "ADMIN"
          ? "/api/dashboard/post/getAllPosts"
          : "/api/dashboard/post/own-posts";

        console.log("Fetching posts from:", endpoint, "with role:", role);
        const response = await axiosInstance.get(endpoint);
        console.log("Posts API Response:", response.data);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [role]);

  const postsArray = Array.isArray(data) ? data : data?.posts || [];
  const { id: currentUserId } = useProfileStore();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Posts</h1>
        <button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          onClick={() => setIsDrawerOpen(true)}
        >
          Create Post
        </button>
      </div>

      {loading ? (
        <p className="text-slate-400">Loading posts...</p>
      ) : postsArray.length > 0 ? (
        <AllPostsCard
          posts={postsArray}
          postsLength={Array.isArray(data) ? data.length : (data?.meta?.total || data?.posts?.length || 0)}
          currentUserId={currentUserId}
          userRole={role}
        />
      ) : (
        <p className="text-slate-400">No posts found or error loading data</p>
      )}

      <CreatePostDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}