"use client";

import { useState, useMemo } from "react";
import Image from "next/image";

export interface userdata {
  id: string;
  name: string;
  email: string;
  role: string;
  image: string | null;
  bio: string | null;
}

interface AllUserCardProps {
  u: userdata[];
  uLength: number;
}

export default function AllUserCard({ u, uLength }: AllUserCardProps) {
  const [users, setUsers] = useState<userdata[]>(u);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(""); // Search အတွက် State

  const defaultAvatar =
    "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=";

  // Search ရိုက်ထည့်တာနဲ့ Name သို့မဟုတ် Email ထဲမှာ ပါ/မပါ စစ်ထုတ်ပေးမယ့် logic
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, users]);

  // Role ပြောင်းပေးမည့် Function
  const handleRoleChange = async (userId: string, newRole: string) => {
    setLoadingId(userId);

    // ၁။ UI မှာ ချက်ချင်း Role ပြောင်းသွားအောင် State အရင်ပြင်ပါမယ်
    const previousRole = users.find((user) => user.id === userId)?.role;
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );

    // ၂။ Backend Database ဆီ API လှမ်းခေါ်ပါမယ်
    try {
      const response = await fetch(`/api/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to update role on server:", errorData);
        // Revert UI change if server fails
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, role: previousRole || "AUTHOR" } : user
          )
        );
      }
    } catch (error) {
      console.error("Error updating role:", error);
      // Revert UI change on error
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: previousRole || "AUTHOR" } : user
        )
      );
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
      {/* Card Header Section with Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-100">All Users</h2>
          <p className="text-slate-400 text-sm mt-0.5">
            Manage user accounts and roles
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500"
          />
          <span className="whitespace-nowrap bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold px-3 py-2 rounded-lg">
            Total: {uLength}
          </span>
        </div>
      </div>

      {/* Table Section with Scrollbar */}
      {/* max-h-[500px] နဲ့ overflow-y-auto က အထက်အောက် Scroll ပေါ်စေပါတယ် */}
      <div className="overflow-x-auto overflow-y-auto max-h-[500px] rounded-lg border border-slate-800 relative custom-scrollbar">
        <table className="w-full text-left text-slate-300 text-sm">
          {/* Table Header (sticky top-0 သုံးထားလို့ Scroll ဆွဲလည်း ခေါင်းစဉ်ကပ်နေပါမယ်) */}
          <thead className="sticky top-0 z-10 bg-slate-800 text-slate-400 uppercase text-xs tracking-wider border-b border-slate-700 shadow-sm">
            <tr>
              <th className="py-3.5 px-4">User</th>
              <th className="py-3.5 px-4">Email</th>
              <th className="py-3.5 px-4">Current Role</th>
              <th className="py-3.5 px-4 text-right">Change Role</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-800/60 bg-slate-900/50">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-slate-800/40 transition-colors"
                >
                  {/* User Profile & Bio */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src={user.image || defaultAvatar}
                        alt={user.name}
                        width={40}
                        height={40}
                        className="rounded-full border border-slate-700 object-cover w-10 h-10 min-w-[40px]"
                      />
                      <div>
                        <p className="text-slate-100 font-medium">{user.name}</p>
                        {user.bio && (
                          <p className="text-slate-400 text-xs truncate max-w-[180px]">
                            {user.bio}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="py-3.5 px-4 text-slate-300">{user.email}</td>

                  {/* Role Badge */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        user.role === "ADMIN"
                          ? "bg-purple-950/50 text-purple-300 border-purple-800"
                          : user.role === "EDITOR"
                          ? "bg-blue-950/50 text-blue-300 border-blue-800"
                          : "bg-emerald-950/50 text-emerald-300 border-emerald-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  {/* Change Role Dropdown */}
                  <td className="py-3.5 px-4 text-right">
                    <select
                      value={user.role}
                      disabled={loadingId === user.id}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:opacity-50"
                    >
                      <option value="AUTHOR">AUTHOR</option>
                      <option value="EDITOR">EDITOR</option>
                      {user.role === "ADMIN" && (
                        <option value="ADMIN">ADMIN</option>
                      )}
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              /* Search ရှာလို့ မတွေ့ရင် ပြမယ့် UI */
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-500">
                  No users found matching "{searchQuery}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}