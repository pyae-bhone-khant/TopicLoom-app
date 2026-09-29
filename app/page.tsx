import PostCard from "@/component/PostCard";
import { samplePosts } from "@/app/data/post";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-5xl mx-auto px-4 space-y-6">
        {samplePosts.map((post) => (
          <PostCard key={post.id} {...post} />
        ))}
      </div>
    </div>
  );
}
