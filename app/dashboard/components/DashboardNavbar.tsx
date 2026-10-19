"use client";

import { usePathname } from "next/navigation";
import { useProfileStore } from "@/lib/stores/useProfileStore";

export default function DashboardNavbar() {
  const pathname = usePathname();
  const { role } = useProfileStore();

  const navItems = [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/users", label: "Users", requiredRole: "ADMIN" as const },
    { href: "/dashboard/posts", label: "Posts" },
    { href: "/dashboard/settings", label: "Settings" },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 min-h-screen p-6">
      <h2 className="text-xl font-bold text-slate-100 mb-8">Dashboard</h2>
      <nav className="space-y-2">
        {navItems
          .filter((item) => !item.requiredRole || role === item.requiredRole)
          .map((item) => {
            const isActive = pathname === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`block px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-slate-800 text-slate-100"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                }`}
              >
                {item.label}
              </a>
            );
          })}
      </nav>
    </aside>
  );
}
