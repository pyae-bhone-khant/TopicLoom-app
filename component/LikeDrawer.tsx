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
  name: string
  image?: string
}

const likes: Like[] = [
  { name: "John Doe", image: "https://i.pravatar.cc/150?img=1" },
  { name: "Jane Smith", image: "https://i.pravatar.cc/150?img=2" },
  { name: "Bob Wilson", image: "https://i.pravatar.cc/150?img=3" },
  { name: "Alice Brown", image: "https://i.pravatar.cc/150?img=4" },
  { name: "John Doe", image: "https://i.pravatar.cc/150?img=1" },
  { name: "Jane Smith", image: "https://i.pravatar.cc/150?img=2" },
  { name: "Bob Wilson", image: "https://i.pravatar.cc/150?img=3" },
  { name: "Alice Brown", image: "https://i.pravatar.cc/150?img=4" },
  { name: "John Doe", image: "https://i.pravatar.cc/150?img=1" },
  { name: "Jane Smith", image: "https://i.pravatar.cc/150?img=2" },
  { name: "Bob Wilson", image: "https://i.pravatar.cc/150?img=3" },
  { name: "Alice Brown", image: "https://i.pravatar.cc/150?img=4" },{ name: "John Doe", image: "https://i.pravatar.cc/150?img=1" },
  { name: "Jane Smith", image: "https://i.pravatar.cc/150?img=2" },
  { name: "Bob Wilson", image: "https://i.pravatar.cc/150?img=3" },
  { name: "Alice Brown", image: "https://i.pravatar.cc/150?img=4" },
]

export function LikeDrawer() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button className="gap-2" variant="ghost">
          <Heart className="w-4 h-4" />
          Like
        </Button>
      </DialogTrigger>
      
      {/* 
        UPDATED: 
        1. sm:max-w-2xl makes it properly wider on desktop
        2. max-h-[85vh] prevents the huge empty space, but still allows scrolling if needed
      */}
      <DialogContent className="w-[90vw] sm:max-w-2xl max-h-[85vh] flex flex-col bg-slate-950/95 border-slate-200/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Likes</DialogTitle>
          <DialogDescription className="text-slate-400">
            People who liked this post
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-y-auto pr-2">
          {likes.map((like, index) => (
            <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-slate-900/50 border border-slate-200/10 hover:bg-slate-800/50 transition-colors">
              <img 
                src={like.image} 
                alt={like.name} 
                className="w-14 h-14 rounded-full border-2 border-slate-200/20"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-white">{like.name}</span>
                <span className="text-sm text-slate-400">Liked this post</span>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}