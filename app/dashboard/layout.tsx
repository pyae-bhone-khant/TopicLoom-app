export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-900 border-r border-slate-800 min-h-screen p-6">
          <h2 className="text-xl font-bold text-slate-100 mb-8">Dashboard</h2>
          <nav className="space-y-2">
            <a href="/dashboard" className="block px-4 py-2 rounded-lg bg-slate-800 text-slate-100">
              Overview
            </a>
            <a href="/dashboard/users" className="block px-4 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors">
              Users
            </a>
            <a href="/dashboard/posts" className="block px-4 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors">
              Posts
            </a>
            <a href="/dashboard/settings" className="block px-4 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors">
              Settings
            </a>
          </nav>
        </aside>

        
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
