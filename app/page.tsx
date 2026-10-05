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
  createdAt: string
  updatedAt: string
}

const samplePosts: Post[] = [
  {
    id: 1,
    title: '၂၀၂၆ ခုနှစ်အတွက် ဝက်ဘ်ဖွံ့ဖြိုးတိုးတက်မှု အလားအလာများ',
    content: 'ယနေ့ခေတ်တွင် ဝက်ဘ်နည်းပညာများသည် အလွန်လျင်မြန်စွာ တိုးတက်လျက်ရှိပါသည်။ React, Vue စသည့် Framework များအပြင် Server-side rendering နည်းပညာများသည်လည်း ပိုမိုတွင်ကျယ်လာပါသည်။...',
    author: {
      id: 'cmuf82acx000164ursuqhgjvd',
      name: 'မြမြ',
      email: 'author@example.com',
      image: null,
      role: 'EDITOR'
    },
    likes: [
      {
        user: {
          id: 'cmuf82bi8000264urp0osycz7',
          name: 'အောင်အောင်',
          email: 'reader@example.com',
          image: null,
          role: 'EDITOR'
        }
      }
    ],
    createdAt: '2026-10-05T03:01:00.000Z',
    updatedAt: '2026-10-05T03:01:00.000Z'
  },
  {
    id: 2,
    title: 'နေ့စဉ်ဘဝတွင် ဉာဏ်ရည်တု (AI) ၏ အခန်းကဏ္ဍ',
    content: 'AI သည် ယခုအခါ စီးပွားရေးလုပ်ငန်းများသာမက သာမန်လူတို့၏ နေ့စဉ်ဘဝတွင်ပါ မရှိမဖြစ် ပါဝင်လာပြီ ဖြစ်ပါသည်။...',
    author: {
      id: 'cmuf8297m000064ur83ce13gd',
      name: 'ကျော်စွာ',
      email: 'admin@example.com',
      image: null,
      role: 'EDITOR'
    },
    likes: [
      {
        user: {
          id: 'cmuf82bi8000264urp0osycz7',
          name: 'အောင်အောင်',
          email: 'reader@example.com',
          image: null,
          role: 'EDITOR'
        }
      }
    ],
    createdAt: '2026-10-05T01:00:00.000Z',
    updatedAt: '2026-10-05T01:00:00.000Z'
  }
]

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
          setPosts(samplePosts)
          setLoading(false)
          return
        }

        const data = await response.json()
        setPosts(data)
      } catch (error) {
        console.error("Failed to fetch posts:", error)
        setPosts(samplePosts)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
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
            createdAt={post.createdAt}
          />
        ))}
      </div>
    </div>
  );
}
