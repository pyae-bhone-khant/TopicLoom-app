"use client";

import { useState, useMemo } from "react";
import { Search, Edit } from "lucide-react";
import EditPostDrawer from "./EditPostDrawer";

export enum PostStatus {
  DRAFT = 'DRAFT',
  PENDING_REVIEW = 'PENDING_REVIEW',
  SCHEDULED = 'SCHEDULED',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
  DELETED = 'DELETED',
}

export interface PostData {
  id: number;
  title: string;
  content: string;
  featuredImageUrl: string | null;
  author: {
    id: string;
    name: string;
    email: string;
    image: string;
    role: string;
  };
  likes?: Array<{
    user: {
      id: string;
      name: string;
      email: string;
      image: string;
      role: string;
    };
  }>;
  createdAt: string;
  updatedAt: string;
  likeCount?: number;
  isLiked?: boolean;
  postLength?: number;
  status?: PostStatus;
  slug?: string;
  summary?: string;
}

interface AllPostsCardProps {
  posts: PostData[];
  postsLength: number;
  currentUserId?: string;
  userRole?: string;
}

export default function AllPostsCard({ posts, postsLength, currentUserId, userRole }: AllPostsCardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [localPosts, setLocalPosts] = useState<PostData[]>(posts);
  const [editingPost, setEditingPost] = useState<PostData | null>(null);

  const canEditPost = (post: PostData) => {
    // Admin can edit all posts, Editor can only edit own posts
    return userRole === 'ADMIN' || post.author.id === currentUserId;
  };

  const filteredPosts = useMemo(() => {
    if (!searchQuery) return localPosts;
    return localPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, localPosts]);

  const handleStatusChange = async (postId: number, newStatus: PostStatus) => {
    setLoadingId(postId);

    const previousStatus = localPosts.find((post) => post.id === postId)?.status;
    setLocalPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, status: newStatus } : post
      )
    );

    try {
      const response = await fetch(`/api/dashboard/post/update-post/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to update status on server:", errorData);
        setLocalPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId ? { ...post, status: previousStatus || PostStatus.DRAFT } : post
          )
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setLocalPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, status: previousStatus || PostStatus.DRAFT } : post
        )
      );
    } finally {
      setLoadingId(null);
    }
  };

  const getStatusColor = (status?: PostStatus) => {
    switch (status) {
      case PostStatus.PUBLISHED:
        return "bg-emerald-950/50 text-emerald-300 border-emerald-800";
      case PostStatus.DRAFT:
        return "bg-slate-950/50 text-slate-300 border-slate-700";
      case PostStatus.PENDING_REVIEW:
        return "bg-yellow-950/50 text-yellow-300 border-yellow-800";
      case PostStatus.SCHEDULED:
        return "bg-blue-950/50 text-blue-300 border-blue-800";
      case PostStatus.ARCHIVED:
        return "bg-gray-950/50 text-gray-300 border-gray-700";
      case PostStatus.DELETED:
        return "bg-red-950/50 text-red-300 border-red-800";
      default:
        return "bg-slate-950/50 text-slate-300 border-slate-700";
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
      {/* Card Header Section with Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-100">All Posts</h2>
          <p className="text-slate-400 text-sm mt-0.5">
            Manage posts and their status
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            placeholder="Search by title or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500"
          />
          <span className="whitespace-nowrap bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold px-3 py-2 rounded-lg">
            Total: {postsLength}
          </span>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="w-full text-left text-slate-300 text-sm">
          <thead className="bg-slate-800 text-slate-400 uppercase text-xs tracking-wider border-b border-slate-700">
            <tr>
              <th className="py-3.5 px-4">Title</th>
              <th className="py-3.5 px-4">Author</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Created</th>
              <th className="py-3.5 px-4 text-right">Change Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/60 bg-slate-900/50">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <tr
                  key={post.id}
                  className="hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div>
                      <p className="text-slate-100 font-medium">{post.title}</p>
                      {post.summary && (
                        <p className="text-slate-400 text-xs truncate max-w-[200px]">
                          {post.summary}
                        </p>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-300">
                    {post.author?.name || 'Unknown'}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(post.status)}`}
                    >
                      {post.status || PostStatus.DRAFT}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-400 text-xs">
                    {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'N/A'}
                  </td>

                  {userRole === 'ADMIN' && (
                    <td className="py-3.5 px-4 text-right">
                      <select
                        value={post.status || PostStatus.DRAFT}
                        disabled={loadingId === post.id}
                        onChange={(e) => handleStatusChange(post.id, e.target.value as PostStatus)}
                        className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:opacity-50"
                      >
                        <option value={PostStatus.DRAFT}>DRAFT</option>
                        <option value={PostStatus.PENDING_REVIEW}>PENDING_REVIEW</option>
                        <option value={PostStatus.SCHEDULED}>SCHEDULED</option>
                        <option value={PostStatus.PUBLISHED}>PUBLISHED</option>
                        <option value={PostStatus.ARCHIVED}>ARCHIVED</option>
                        <option value={PostStatus.DELETED}>DELETED</option>
                      </select>
                    </td>
                  )}
                  <td className="py-3.5 px-4 text-right">
                    {canEditPost(post) && (
                      <button
                        onClick={() => setEditingPost(post)}
                        className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors"
                        title="Edit post"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500">
                  No posts found matching "{searchQuery}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <EditPostDrawer
        isOpen={!!editingPost}
        onClose={() => setEditingPost(null)}
        post={editingPost}
      />
    </div>
  );
}
