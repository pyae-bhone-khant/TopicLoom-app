"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { ThumbsUp, MessageCircle, Send, Smile, Camera, Sticker, Gift, Loader2 } from "lucide-react"

// --- 1. Types ---
export interface CommentUser {
  id: string
  name: string
  image: string
}

export interface Comment {
  id: string
  postId: number
  parentId?: string | null
  content: string
  createdAt: string
  user: CommentUser
  likeCount: number
  isLikedByMe?: boolean // Added for real-world toggle state
  children?: Comment[]
}

// --- Mock Current Logged-In User (Usually comes from NextAuth / Context) ---
const CURRENT_USER: CommentUser = {
  id: "me-123",
  name: "Current User",
  image: "https://i.pravatar.cc/150?img=33",
}

// --- 2. Recursive Component for individual comments and replies ---
function CommentThread({
  comment,
  isReply = false,
  onAddReply,
  onToggleLike,
}: {
  comment: Comment
  isReply?: boolean
  onAddReply: (parentId: string, content: string) => Promise<void>
  onToggleLike: (commentId: string) => Promise<void>
}) {
  const [isReplying, setIsReplying] = useState(false)
  const [replyContent, setReplyContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) return
    setIsSubmitting(true)
    try {
      await onAddReply(comment.id, replyContent)
      setReplyContent("")
      setIsReplying(false) // Close reply box on success
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={`flex gap-2 ${isReply ? "mt-3" : "mt-4"}`}>
      <img
        src={comment.user.image}
        alt={comment.user.name}
        className="w-8 h-8 rounded-full object-cover shrink-0 mt-1"
      />
      <div className="flex-1 min-w-0">
        {/* Comment Bubble */}
        <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl px-3 py-2 inline-block max-w-full">
          <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">
            {comment.user.name}
          </div>
          <div className="text-sm text-slate-800 dark:text-slate-200 break-words whitespace-pre-wrap">
            {comment.content}
          </div>
        </div>

        {/* Action Row */}
        <div className="flex items-center gap-4 mt-1 ml-2 text-xs font-semibold text-slate-500">
          <span>{comment.createdAt}</span>
          
          <button 
            onClick={() => onToggleLike(comment.id)}
            className={`hover:underline ${comment.isLikedByMe ? 'text-blue-600' : ''}`}
          >
            Like
          </button>
          
          <button
            onClick={() => {
              setIsReplying(!isReplying)
              setTimeout(() => inputRef.current?.focus(), 50)
            }}
            className="hover:underline"
          >
            Reply
          </button>
          
          {comment.likeCount > 0 && (
            <div className="flex items-center gap-1 ml-auto mr-4 text-slate-500">
              <div className="bg-blue-500 rounded-full p-0.5">
                <ThumbsUp className="w-3 h-3 text-white fill-white" />
              </div>
              <span>{comment.likeCount}</span>
            </div>
          )}
        </div>

        {/* Inline Reply Input (Only shows when user clicks 'Reply') */}
        {isReplying && (
          <div className="flex items-center gap-2 mt-3 mb-2 animate-in fade-in slide-in-from-top-2">
            <img src={CURRENT_USER.image} alt="Me" className="w-6 h-6 rounded-full" />
            <div className="flex-1 flex items-center bg-slate-100 dark:bg-slate-800 rounded-full px-3 py-1.5">
              <input
                ref={inputRef}
                type="text"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleReplySubmit()}
                placeholder={`Reply to ${comment.user.name}...`}
                className="bg-transparent border-none focus:outline-none text-sm w-full"
                disabled={isSubmitting}
              />
              <button 
                onClick={handleReplySubmit}
                disabled={!replyContent.trim() || isSubmitting}
                className="text-blue-500 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed ml-2"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

        {/* Render Nested Children */}
        {comment.children && comment.children.length > 0 && (
          <div className="pl-4 border-l-2 border-slate-100 dark:border-slate-800 mt-2">
            {comment.children.map((child) => (
              <CommentThread 
                key={child.id} 
                comment={child} 
                isReply={true} 
                onAddReply={onAddReply}
                onToggleLike={onToggleLike}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// --- 3. Main Dialog Component ---
export function CommentDialog({ postId = 1 }: { postId?: number }) {
  const [isOpen, setIsOpen] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [mainInput, setMainInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 1. Fetch Comments on Mount / Open
  useEffect(() => {
    if (!isOpen) return

    const fetchComments = async () => {
      setIsLoading(true)
      try {
        // MOCK API CALL: Replace with fetch(`/api/posts/${postId}/comments`)
        await new Promise((res) => setTimeout(res, 800))
        
        // Mock data injection
        setComments([
          {
            id: "c1", postId, content: "This is a real-world fetched comment!", createdAt: "Just now", likeCount: 5, user: { id: "u1", name: "Htun Aung Lwin", image: "https://i.pravatar.cc/150?img=11" }, children: []
          }
        ])
      } catch (error) {
        console.error("Failed to load comments", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchComments()
  }, [isOpen, postId])

  // 2. Handle Submitting a New Top-Level Comment or Reply
  const handleAddComment = async (parentId?: string, content?: string) => {
    const textToSubmit = content || mainInput
    if (!textToSubmit.trim()) return

    if (!parentId) setIsSubmitting(true) // Only show main loader for top-level

    try {
      // MOCK API POST REQUEST: Replace with axios.post or fetch
      await new Promise((res) => setTimeout(res, 600))
      
      const newComment: Comment = {
        id: Math.random().toString(36).substring(7),
        postId,
        parentId: parentId || null,
        content: textToSubmit,
        createdAt: "Just now",
        likeCount: 0,
        user: CURRENT_USER,
        children: []
      }

      // Update State: Recursive function to insert nested replies
      if (parentId) {
        setComments(prev => {
          const addReplyToTree = (list: Comment[]): Comment[] => list.map(c => {
            if (c.id === parentId) return { ...c, children: [...(c.children || []), newComment] }
            if (c.children) return { ...c, children: addReplyToTree(c.children) }
            return c
          })
          return addReplyToTree(prev)
        })
      } else {
        // Top-level comment
        setComments(prev => [...prev, newComment])
        setMainInput("") // Clear main input
      }

    } catch (error) {
      console.error("Failed to submit comment", error)
    } finally {
      if (!parentId) setIsSubmitting(false)
    }
  }

  // 3. Handle Liking a Comment (Optimistic UI Update)
  const handleToggleLike = async (commentId: string) => {
    // Optimistic Update: Update UI immediately before API call finishes
    const toggleLikeInTree = (list: Comment[]): Comment[] => list.map(c => {
      if (c.id === commentId) {
        const isCurrentlyLiked = c.isLikedByMe ?? false
        return { 
          ...c, 
          isLikedByMe: !isCurrentlyLiked, 
          likeCount: c.likeCount + (isCurrentlyLiked ? -1 : 1) 
        }
      }
      if (c.children) return { ...c, children: toggleLikeInTree(c.children) }
      return c
    })
    
    setComments(prev => toggleLikeInTree(prev))

    try {
      // MOCK API PUT REQUEST
      await new Promise(res => setTimeout(res, 300))
    } catch (error) {
      // If API fails, revert the state (omitted for brevity, but you'd reverse the toggle logic here)
      console.error("Failed to like comment")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger >
        <Button className="gap-2" variant="outline">
          <MessageCircle className="w-4 h-4" />
          Comment
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl h-[85vh] flex flex-col p-0 gap-0 overflow-hidden bg-white dark:bg-slate-950">
        <DialogHeader className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center relative">
          <DialogTitle className="text-center font-bold text-lg">
            Alice&apos;s Post
          </DialogTitle>
          <DialogDescription className="sr-only">
            View and reply to comments on this post.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Comments Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {isLoading ? (
            <div className="h-full flex items-center justify-center text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : comments.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-500 flex-col gap-2">
              <MessageCircle className="w-12 h-12 opacity-20" />
              <p>No comments yet. Be the first!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <CommentThread 
                key={comment.id} 
                comment={comment} 
                onAddReply={(parentId, text) => handleAddComment(parentId, text)}
                onToggleLike={handleToggleLike}
              />
            ))
          )}
        </div>

        {/* Fixed Bottom Input Area */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex gap-2 items-start">
          <img
            src={CURRENT_USER.image}
            alt="Current User"
            className="w-9 h-9 rounded-full object-cover"
          />
          <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-2xl p-2 flex flex-col gap-2">
            <input
              type="text"
              value={mainInput}
              onChange={(e) => setMainInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
              placeholder="Write a comment..."
              disabled={isSubmitting}
              className="bg-transparent border-none focus:outline-none w-full px-2 text-sm disabled:opacity-50"
            />
            <div className="flex justify-between items-center px-2">
              <div className="flex items-center gap-3 text-slate-500">
                <Smile className="w-5 h-5 cursor-pointer hover:text-slate-700" />
                <Camera className="w-5 h-5 cursor-pointer hover:text-slate-700" />
                <Gift className="w-5 h-5 cursor-pointer hover:text-slate-700" />
                <Sticker className="w-5 h-5 cursor-pointer hover:text-slate-700" />
              </div>
              <button 
                onClick={() => handleAddComment()}
                disabled={!mainInput.trim() || isSubmitting}
                className="text-blue-500 hover:text-blue-600 cursor-pointer disabled:opacity-50 flex items-center justify-center w-6 h-6"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 



