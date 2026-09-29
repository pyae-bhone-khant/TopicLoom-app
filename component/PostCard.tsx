"use client"
import { Button } from "@/components/ui/button"
import { Command, Share, Bookmark, Heart, Plus, Minus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from "next/image"
import { useState } from "react"
import { LikeDrawer } from "./LikeDrawer";
import { CommentDialog } from "./commandDrawer";

interface PostCardProps {
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
}

export default function PostCard({ title, slug, summary, content, featuredImageUrl, author }: PostCardProps) {
  const [fontSize, setFontSize] = useState(14)

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

    return (
         <Card className="mx-auto mt-10 w-full max-w-5xl text-white bg-slate-950/80 border shadow-lg shadow-slate-950/20 border-slate-200/20">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            <img src={author?.image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQJvILEyVElWtXq9byw3QWD4b_AoXodTdQW_sThDjHs9OckMykPGPB30parJDG_Q81nQxj5vUUuGCulY-di4JPRwRSWFByvVLehcQm3HBt&s=10"} alt="Profile" width={50} height={50} className="rounded-full" />
            <div className="flex flex-col">
                <div className="flex gap-3">
               <h1 className="text-lg font-semibold">{author?.name || "Shin Ye-eun"}</h1>
               <span className="text-sm bg-slate-800 px-2 py-1 rounded-full  text-slate-400">{author?.role || "Editor"}</span>
                </div>
                <p className="text-sm text-slate-400">2 hours ago</p>
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
      <LikeDrawer />
      <CommentDialog />
  <Button className="gap-2">
    <Share className="w-4 h-4" />
    Share
  </Button>
</CardFooter>
    </Card>
    )
}
