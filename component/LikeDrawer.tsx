import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Heart } from "lucide-react"

interface Like {
  user: {
    id: string
    name: string
    email: string
    image?: string | null
  }
}

interface LikeDrawerProps {
  likes?: Like[]
}

export function LikeDrawer({ likes = [] }: LikeDrawerProps) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button className="gap-2" variant="ghost">
            <Heart className="w-4 h-4" />
            See Likes
          </Button>
        }
      />
      
    
      <DialogContent className="w-[90vw] sm:max-w-2xl max-h-[85vh] flex flex-col bg-slate-950/95 border-slate-200/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Likes</DialogTitle>
          <DialogDescription className="text-slate-400">
            People who liked this post
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-y-auto pr-2">
          {likes.length > 0 ? (
            likes.map((like, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-slate-900/50 border border-slate-200/10 hover:bg-slate-800/50 transition-colors">
                <img
                  src={like.user.image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQJvILEyVElWtXq9byw3QWD4b_AoXodTdQW_sThDjHs9OckMykPGPB30parJDG_Q81nQxj5vUUuGCulY-di4JPRwRSWFByvVLehcQm3HBt&s=10"}
                  alt={like.user.name}
                  className="w-14 h-14 rounded-full border-2 border-slate-200/20"
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-white">{like.user.name}</span>
                  <span className="text-sm text-slate-400">Liked this post</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-400 text-center py-8">No likes yet</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}