import Image from "next/image";

// API က ပြန်လာတဲ့ ပုံစံအတိုင်း Interface တွေကို ပြင်ဆင်ပါမယ်
interface User {
  id: string;
  name: string;
  image: string | null;
  createdAt: string;
  role: string;
}

interface Post {
  title: string;
  createdAt: string;
  author: {
    name: string;
    image: string | null;
  };
}

interface TotalUserAndPostProps {
  users: User[];
  posts: Post[];
}

export default function TotalUserAndPost({ users, posts }: TotalUserAndPostProps) {
  
  const defaultAvatar = "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=";

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h2 className="text-xl font-bold text-slate-100 mb-6">Recent Activity</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="space-y-4">
          <h3 className="text-slate-300 text-xs font-semibold uppercase tracking-wider border-b border-slate-800 pb-2">
            New Users Registered
          </h3>
          {users.map((user) => (
            <div key={user.id} className="flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-lg p-3 transition-colors hover:bg-slate-700/50">
              <Image
                src={user.image || defaultAvatar}
                alt={user.name}
                width={40}
                height={40}
                className="rounded-full border border-slate-600 object-cover w-10 h-10"
              />
              <div>
                <p className="text-slate-100 font-medium leading-tight">{user.name}</p>
                <p className="text-slate-400 text-xs mt-1">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* === Recent Posts List === */}
        <div className="space-y-4">
          <h3 className="text-slate-300 text-xs font-semibold uppercase tracking-wider border-b border-slate-800 pb-2">
            Recent Posts Created
          </h3>
          {posts.map((post, index) => (
            <div key={index} className="flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-lg p-3 transition-colors hover:bg-slate-700/50">
              <Image
                src={post.author.image || defaultAvatar}
                alt={post.author.name}
                width={40}
                height={40}
                className="rounded-full border border-slate-600 object-cover w-10 h-10 min-w-[40px]"
              />
              <div className="overflow-hidden">
                <p className="text-slate-100 font-medium leading-tight">{post.author.name}</p>
                <p className="text-slate-400 text-xs mt-1 truncate">
                  {post.title}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}