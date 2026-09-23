"use client";



import { useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

import { Search, Menu, X, MessageSquare, LogOut, User } from "lucide-react";

import Link from "next/link";

import AuthDrawer from "./AuthDrawer";

import { useSession, signOut } from "@/component/lib/auth-client";



export default function Navbar() {

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data: session, isPending } = useSession();

  // Use session.user directly — better-auth provides name, email, image via cookies.
  // No extra API call needed for the navbar.
  const user = session?.user;



  const navItems = [

    { name: "Home", href: "/" },

    { name: "About", href: "/about" },

    { name: "Contact", href: "/contact" },

  ];



  return (

    <motion.nav

      initial={{ y: -100 }}

      animate={{ y: 0 }}

      transition={{ duration: 0.5, ease: "easeOut" }}

      className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700 shadow-sm"

    >

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between h-16">

          {/* Logo */}

          <motion.div

            initial={{ opacity: 0, x: -20 }}

            animate={{ opacity: 1, x: 0 }}

            transition={{ delay: 0.2, duration: 0.5 }}

            className="shrink-0"

          >

            <Link href="/" className="flex items-center space-x-2 shrink-0">

              <MessageSquare className="w-8 h-8 text-blue-400" />

              <span className="text-2xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">

                TopicLoom

              </span>

            </Link>

          </motion.div>



          {/* Desktop Navigation */}

          <div className="hidden md:flex items-center space-x-8">

            {navItems.map((item, index) => (

              <motion.div

                key={item.name}

                initial={{ opacity: 0, y: -20 }}

                animate={{ opacity: 1, y: 0 }}

                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}

              >

                <Link

                  href={item.href}

                  className="relative text-slate-300 hover:text-blue-400 font-medium transition-colors duration-300 group"

                >

                  {item.name}

                  <motion.span

                    className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"

                    initial={{ width: 0 }}

                    whileHover={{ width: "100%" }}

                  />

                </Link>

              </motion.div>

            ))}

          </div>



          {/* Search Bar & Auth Control */}

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

                    className="w-full px-4 py-2 rounded-full border border-slate-600 bg-slate-800 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"

                  />

                </motion.div>

              )}

            </AnimatePresence>



            <motion.button

              initial={{ opacity: 0, scale: 0.8 }}

              animate={{ opacity: 1, scale: 1 }}

              transition={{ delay: 0.6, duration: 0.5 }}

              onClick={() => setIsSearchOpen(!isSearchOpen)}

              className="p-2 rounded-full hover:bg-slate-800 transition-colors duration-300"

            >

              <Search className="w-5 h-5 text-slate-300" />

            </motion.button>



            {/* Auth Section */}

            <motion.div

              initial={{ opacity: 0, scale: 0.8 }}

              animate={{ opacity: 1, scale: 1 }}

              transition={{ delay: 0.6, duration: 0.5 }}

            >

              {!isPending && (

                <>

                  {session ? (

                    <div className="flex items-center space-x-3">

                      {user?.image ? (

                        <img

                          src={user.image}

                          alt={user?.name || user?.email || ""}

                          className="w-8 h-8 rounded-full border border-slate-600 object-cover"

                        />

                      ) : (

                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300">

                          <User className="w-4 h-4" />

                        </div>

                      )}

                      <div className="hidden sm:block">

                        <p className="text-sm font-medium text-slate-200">

                          {user?.name || user?.email}

                        </p>

                      </div>

                      <button

                        onClick={() => signOut()}

                        className="p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-red-400 transition-colors duration-300"

                        title="Sign Out"

                      >

                        <LogOut className="w-5 h-5" />

                      </button>

                    </div>

                  ) : (

                    <AuthDrawer />

                  )}

                </>

              )}

            </motion.div>

          </div>



          {/* Mobile Menu Button */}

          <motion.button

            initial={{ opacity: 0 }}

            animate={{ opacity: 1 }}

            transition={{ delay: 0.7 }}

            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}

            className="md:hidden p-2 rounded-lg hover:bg-slate-800 transition-colors duration-300"

          >

            {isMobileMenuOpen ? (

              <X className="w-6 h-6 text-slate-300" />

            ) : (

              <Menu className="w-6 h-6 text-slate-300" />

            )}

          </motion.button>

        </div>



        {/* Mobile Menu */}

        <AnimatePresence>

          {isMobileMenuOpen && (

            <motion.div

              initial={{ height: 0, opacity: 0 }}

              animate={{ height: "auto", opacity: 1 }}

              exit={{ height: 0, opacity: 0 }}

              transition={{ duration: 0.3 }}

              className="md:hidden overflow-hidden border-t border-slate-700"

            >

              <div className="py-4 space-y-4">

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

                  {!isPending && (

                    <>

                      {session ? (

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

                    </>

                  )}

                </div>

              </div>

            </motion.div>

          )}

        </AnimatePresence>

      </div>

    </motion.nav>

  );

}