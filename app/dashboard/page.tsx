export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-100 mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-slate-400 text-sm mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-slate-100">1,234</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-slate-400 text-sm mb-2">Total Posts</h3>
          <p className="text-3xl font-bold text-slate-100">567</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-slate-400 text-sm mb-2">Active Sessions</h3>
          <p className="text-3xl font-bold text-slate-100">89</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-xl font-bold text-slate-100 mb-4">Recent Activity</h2>
        <p className="text-slate-400">No recent activity to display.</p>
      </div>
    </div>
  )
}
