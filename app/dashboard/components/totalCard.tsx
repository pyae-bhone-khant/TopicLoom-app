import Image from "next/image";

interface TotalCardProps {
  editorlength: number;
  userlength: number;
  postlength: number;
}

export default function TotalCard({ editorlength, userlength, postlength }: TotalCardProps) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-slate-400 text-sm mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-slate-100">{userlength}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-slate-400 text-sm mb-2">Total Posts</h3>
          <p className="text-3xl font-bold text-slate-100">{postlength}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-slate-400 text-sm mb-2">Editors</h3>
          <p className="text-3xl font-bold text-slate-100">{editorlength}</p>
        </div>
      </div>
    )
}