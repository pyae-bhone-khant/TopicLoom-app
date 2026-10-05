import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Share2, Link2, MessageCircle } from "lucide-react"

interface ShareDrawerProps {
  title?: string
  content?: string
  url?: string
  id?: number
}

export function ShareDrawer({ title, content, url, id }: ShareDrawerProps) {
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
  const shareTitle = title || 'Check out this post'
  const shareText = content?.substring(0, 100) || ''

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')
  }

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`, '_blank')
  }

  const shareToLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank')
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      alert('Link copied to clipboard!')
    } catch (error) {
      console.error('Error copying to clipboard:', error)
    }
  }

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button className="gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        }
      />
      
      <DialogContent className="w-[90vw] sm:max-w-md bg-slate-950/95 border-slate-200/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Share this post</DialogTitle>
          <DialogDescription className="text-slate-400">
            Choose where to share this post
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <Button
            onClick={shareToFacebook}
            className="gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Share2 className="w-5 h-5" />
            Facebook
          </Button>
          <Button
            onClick={shareToTwitter}
            className="gap-2 bg-sky-500 hover:bg-sky-600"
          >
            <MessageCircle className="w-5 h-5" />
            Twitter
          </Button>
          <Button
            onClick={shareToLinkedIn}
            className="gap-2 bg-blue-700 hover:bg-blue-800"
          >
            <Share2 className="w-5 h-5" />
            LinkedIn
          </Button>
          <Button
            onClick={copyLink}
            variant="outline"
            className="gap-2 border-slate-600 text-white hover:bg-slate-800"
          >
            <Link2 className="w-5 h-5" />
            Copy Link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
