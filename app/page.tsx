"use client"

import PostCard from "@/component/PostCard";
import { useEffect, useState } from "react";

interface Post {
  id: number
  title: string
  content: string
  featuredImageUrl?: string | null
  author: {
    id: string
    name: string
    email: string
    image?: string | null
    role?: string
  }
  likes?: Array<{
    user: {
      id: string
      name: string
      email: string
      image?: string | null
      role?: string
    }
  }> 
  likeCount: number
  isLiked: boolean
  createdAt: string
  updatedAt: string
}

function getPosts(data: unknown): Post[] {
  if (Array.isArray(data)) {
    return data as Post[]
  }

  if (
    data &&
    typeof data === "object" &&
    "posts" in data &&
    Array.isArray(data.posts)
  ) {
    return data.posts as Post[]
  }

  throw new Error("Posts API returned an unexpected response format")
}


export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let isMounted = true

    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/post', {
          method: 'POST'
        })

        if (response.status === 401) {
          if (isMounted) {
            setPosts([])
            setError("")
          }
          return
        }

        const data = await response.json()
        if (!response.ok) {
          if (isMounted) {
            setError(data.message || data.error || "Failed to fetch posts")
          }
          return
        }

        if (isMounted) {
          setPosts(getPosts(data))
          setError("")
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error)
        if (isMounted) {
          setError("Could not load posts. Check your connection and try again.")
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchPosts() 
    
    const interval = setInterval(() => {
      fetchPosts()
    }, 30000)
    
    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [refreshKey])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 py-12 flex items-center justify-center">
        <p className="text-slate-400">Loading posts...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-5xl mx-auto px-4 space-y-6">
        {error && (
          <div role="alert" className="text-center text-red-400">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => setRefreshKey((key) => key + 1)}
              className="mt-2 text-sm underline hover:text-red-300"
            >
              Try again
            </button>
          </div>
        )}
        {posts.map((post) => (
          <PostCard
            key={post.id}
            id={post.id}
            title={post.title}
            content={post.content}
            featuredImageUrl={post.featuredImageUrl || undefined}
            author={{
              name: post.author.name,
              role: post.author.role || "Author",
              image: post.author.image || undefined
            }}
            likes={post.likes}
            likeCount={post.likeCount}
            createdAt={post.createdAt}
            isLiked={post.isLiked}
          />
        ))}
      </div>
    </div>
  );
}
