"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, ChevronDown, LogOut } from "lucide-react";
import { signOut } from "@/component/lib/auth-client";
import { useProfileStore } from "@/lib/stores/useProfileStore";
import ProfileDrawer from "./ProfileDrawer";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { name, email, image } = useProfileStore();

  // Close dropdown on outside click, but not while the profile drawer is open
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Never close the dropdown while the profile dialog is mounted/open
      if (isProfileOpen) return;

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileOpen]);

  function openProfile() {
    setIsOpen(false);      // close the dropdown panel
    setIsProfileOpen(true); // open the dialog (always mounted below)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* ── Trigger Button ─────────────────────────────────────────────────── */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center space-x-2 px-2 py-1.5 rounded-xl hover:bg-slate-800 transition-colors duration-200"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {image ?
          <img
            src={image}
            alt={name || email || ""}
            className="w-8 h-8 rounded-full border border-slate-600 object-cover"
          />
        : <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
            <User className="w-4 h-4" />
          </div>
        }
        <span className="hidden sm:block text-sm font-medium text-slate-200 max-w-[120px] truncate">
          {name || email}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* ── Dropdown Panel ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-slate-700 shadow-2xl shadow-black/40 overflow-hidden z-50"
            role="menu"
          >
            {/* User Info Header */}
            <div className="px-4 py-3 border-b border-slate-700/60">
              <div className="flex items-center space-x-3">
                {image ?
                  <img
                    src={image}
                    alt={name || email || ""}
                    className="w-10 h-10 rounded-full border border-slate-600 object-cover"
                  />
                : <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                    <User className="w-5 h-5" />
                  </div>
                }
                <div className="flex-1 min-w-0">
                  {name && (
                    <p className="text-sm font-semibold text-slate-100 truncate">
                      {name}
                    </p>
                  )}
                  <p className="text-xs text-slate-400 truncate">
                    {email}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-1.5" role="none">
              {/* Profile — opens the drawer; closes the dropdown */}
              <button
                onClick={openProfile}
                role="menuitem"
                className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-slate-300 hover:text-blue-400 hover:bg-slate-800/70 transition-colors duration-150"
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </button>

              <button
                onClick={() => {
                  signOut();
                  setIsOpen(false);
                }}
                role="menuitem"
                className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-slate-300 hover:text-red-400 hover:bg-slate-800/70 transition-colors duration-150"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Profile Drawer ─────────────────────────────────────────────────── */}
      {/* Rendered OUTSIDE AnimatePresence so it is never unmounted when the   */}
      {/* dropdown panel closes. The Dialog portal lives in document.body.     */}
      <ProfileDrawer isOpen={isProfileOpen} onOpenChange={setIsProfileOpen} />
    </div>
  );
}
