"use client"

import PostCard from "@/component/PostCard";
import { useEffect, useState } from "react";

interface Post {
  id: number
  title: string
  content: string
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



export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/post', {
          method: 'POST'
        })

        if (response.status === 401) {
          console.log("User not authenticated, using sample data")
          setPosts([])
          setLoading(false)
          return
        }

        const data = await response.json()
        setPosts(data)
      } catch (error) {
        console.error("Failed to fetch posts:", error)
        setPosts([])
      } finally {
        setLoading(false)
      }
    }

    fetchPosts() 
    
    const interval = setInterval(() => {
      fetchPosts()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

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
        {posts.map((post) => (
          <PostCard
            key={post.id}
            id={post.id}
            title={post.title}
            content={post.content}
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
