// Server Component — no "use client" directive
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import NavbarClient from "./NavbarClient";

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo — static, renders on server */}
          <Link href="/" className="flex items-center space-x-2 shrink-0">
            <MessageSquare className="w-8 h-8 text-blue-400" />
            <span className="text-2xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              TopicLoom
            </span>
          </Link>

          {/* Desktop nav links — static, renders on server */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative text-slate-300 hover:text-blue-400 font-medium transition-colors duration-300"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* All interactive parts live in the client boundary */}
          <NavbarClient navItems={navItems} />
        </div>
      </div>
    </nav>
  );
}
