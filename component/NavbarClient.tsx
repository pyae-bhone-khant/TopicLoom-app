"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Menu, X, LogOut } from "lucide-react";
import Link from "next/link";
import AuthDrawer from "@/component/AuthDrawer";
import { useSession, signOut } from "@/component/lib/auth-client";
import UserDropdown from "@/component/UserDropdown";

interface NavItem {
  name: string;
  href: string;
}

interface NavbarClientProps {
  navItems: NavItem[];
}

export default function NavbarClient({ navItems }: NavbarClientProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data: session, isPending } = useSession();

  return (
    <>
      {/* Desktop: Search + Auth */}
      <div className="hidden md:flex items-center space-x-4">
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 200, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <input
                type="text"
                placeholder="Search..."
                autoFocus
                className="w-full px-4 py-2 rounded-full border border-slate-600 bg-slate-800 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          onClick={() => setIsSearchOpen((prev) => !prev)}
          className="p-2 rounded-full hover:bg-slate-800 transition-colors duration-300"
          aria-label="Toggle search"
        >
          <Search className="w-5 h-5 text-slate-300" />
        </motion.button>

        {/* Auth Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          {isPending ? (
            // Skeleton placeholder — prevents login button from flashing while session loads
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-slate-700 animate-pulse" />
              <div className="hidden sm:block w-20 h-4 rounded bg-slate-700 animate-pulse" />
            </div>
          ) : session ? (
            <UserDropdown />
          ) : (
            <AuthDrawer />
          )}
        </motion.div>
      </div>

      {/* Mobile: Hamburger Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        className="md:hidden p-2 rounded-lg hover:bg-slate-800 transition-colors duration-300"
        aria-label="Toggle mobile menu"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-slate-300" />
        ) : (
          <Menu className="w-6 h-6 text-slate-300" />
        )}
      </motion.button>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-16 left-0 right-0 md:hidden overflow-hidden border-t border-slate-700 bg-slate-900/95 backdrop-blur-md"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-slate-300 hover:text-blue-400 font-medium transition-colors duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              <div className="flex items-center space-x-4 pt-4 border-t border-slate-700">
                <input
                  type="text"
                  placeholder="Search..."
                  className="flex-1 px-4 py-2 rounded-full border border-slate-600 bg-slate-800 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {isPending ? (
                  <div className="w-8 h-8 rounded-full bg-slate-700 animate-pulse" />
                ) : session ? (
                  <button
                    onClick={() => signOut()}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-red-400 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Sign Out</span>
                  </button>
                ) : (
                  <AuthDrawer />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
