"use client"
import { Button } from "@/components/ui/button"
import {  Share,  Heart, Plus, Minus } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"

import { useState } from "react"
import { LikeDrawer } from "./LikeDrawer";
import { ShareDrawer } from "./ShareDrawer";
import axiosInstance from "@/component/lib/axiosInstance";

interface PostCardProps {
  id?: number
  title?: string
  slug?: string
  summary?: string
  content?: string
  featuredImageUrl?: string
  author?: {
    name: string
    image?: string
    role: string
  }
  likes?: Array<{
    user: {
      id: string
      name: string
      email: string
      image?: string | null
    }
  }>
  likeCount?: number
  createdAt?: string
  isLiked?: boolean
}

export default function PostCard({ id, title, slug, summary, content, featuredImageUrl, author, likes = [], likeCount , createdAt, isLiked: initialIsLiked = false }: PostCardProps) {
  const [fontSize, setFontSize] = useState(14)
  const [isLiked, setIsLiked] = useState(initialIsLiked)

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 2, 24))
  }

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 2, 10))
  }

  const getFontSizeClass = () => {
    if (fontSize <= 12) return 'text-xs'
    if (fontSize <= 14) return 'text-sm'
    if (fontSize <= 16) return 'text-base'
    if (fontSize <= 18) return 'text-lg'
    return 'text-xl'
  }

  const handleLike = async () => {
    if (!id) return

    try {
      await axiosInstance.post('/api/post/like', { postId: id })
      setIsLiked(prev => !prev)
    } catch (error: any) {
      console.error('Failed to like post:', error)
      if (error.response?.status === 401) {
        alert('Please log in to like posts')
      } else {
        alert('Failed to like post. Please try again.')
      }
    }
  }

  const formatRelativeTime = (dateString?: string) => {
    if (!dateString) return '2 hours ago'
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    return date.toLocaleDateString()
  }

    return (
         <Card className="mx-auto mt-10 w-full max-w-5xl text-white bg-slate-950/80 border shadow-lg shadow-slate-950/20 border-slate-200/20">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            <img src={author?.image} alt="Profile" width={50} height={50} className="rounded-full" />
            <div className="flex flex-col">
                <div className="flex gap-3">
               <h1 className="text-lg font-semibold">{author?.name || "Shin Ye-eun"}</h1>
               <span className="text-sm bg-slate-800 px-2 py-1 rounded-full  text-slate-400">{author?.role }</span>
                </div>
                <p className="text-sm text-slate-400">{formatRelativeTime(createdAt)}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={decreaseFontSize} className="h-8 w-8 p-0">
              <Minus className="w-4 h-4" />
            </Button>
            <span className="text-sm text-slate-400 flex items-center">{fontSize}px</span>
            <Button variant="ghost" size="sm" onClick={increaseFontSize} className="h-8 w-8 p-0">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
        {title && <h2 className="text-xl font-bold mt-4">{title}</h2>}
        {summary && <p className="text-sm text-slate-400 mt-2">{summary}</p>}
      </CardHeader>
      <CardContent className="-mb-(--card-spacing)">
        <div className="-mx-(--card-spacing) max-h-48 space-y-4 overflow-y-scroll border-t border-slate-950/20 px-(--card-spacing) py-4 leading-relaxed" style={{ fontSize: `${fontSize}px` }}>
          {content ? (
            <p>{content}</p>
          ) : (
            <>
              <p>
                These terms govern your use of the workspace, including access to
                shared documents, project files, and collaboration tools.
              </p>
              <p>
                You are responsible for the content you upload and for ensuring that
                your team has the appropriate permissions to view or edit it.
              </p>
              <p>
                We may update features or limits as the service evolves. When those
                changes materially affect your workflow, we will notify your
                workspace administrators.
              </p>
              <p>
                By continuing, you agree to keep your account credentials secure and
                to follow your organization&apos;s acceptable use policies.
              </p>
            </>
          )}
        </div>
      </CardContent>
      {featuredImageUrl && (
        <div className="relative h-80 w-full -mx-6 mb-4">
          <img src={featuredImageUrl} alt={title} className="w-full h-full object-cover" />
        </div>
      )}
     <CardFooter className="justify-between items-center bg-slate-950/10 gap-2 p-4">
     <div className="flex items-center gap-2">
      <Button
        className="gap-2"
        variant="ghost"
        onClick={handleLike}
      >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
           {isLiked ? 'Liked' : 'Like'}
        </Button>
        {likeCount && likeCount > 0 && (
          <span className="text-sm text-slate-400">{likeCount}</span>
        )}
      <LikeDrawer likes={likes} />
      </div>
      <ShareDrawer title={title} content={content} id={id} />
</CardFooter>
    </Card>
    )
}
