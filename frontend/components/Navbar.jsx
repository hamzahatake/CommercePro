"use client";

import { useMemo, useState } from "react";
import { debounce } from "@/utils/debounce";
import { Menu, X, Search, User, ShoppingCart } from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useUserProfileQuery } from "@/features/api/apiSlice";
import { logout } from "@/features/auth/authSlice";
import { useDispatch } from "react-redux";
import ProfilePic from "@/public/Auth.png"

function Navbar() {
  const { data: user, isLoading, isError } = useUserProfileQuery();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  const dispatch = useDispatch();

  const handleLogout = () => {
    try {
      dispatch(logout());
      console.log("Succeed");
    } catch (err) {
      console.log("Failed", err);
    }
  };

  const handleSearchChange = useMemo(
    () =>
      debounce((value) => {
        console.log("Searching:", value);
        setSearchQuery(value);
      }, 500),
    []
  );

  return (
    <nav className="fixed top-2 z-50 w-full">

      {isLoading && <p>Loading...</p>}
      {isError && <p>Error... Retry</p>}

      <div className="mx-auto max-w-[1400px] h-[40px] bg-white text-[#212121] rounded-2xl px-4 md:px-6">
        <div className="h-10 flex items-center justify-between gap-4">
          {/* LOGO */}
          <Link href="/" className="text-[18px] font-semibold tracking-tight hover:opacity-80 transition-colors">Allbirds</Link>

          {/* CENTER MENU */}
          <ul className="hidden md:flex items-center gap-8 text-[14px] font-medium">
            <Link href="/products" className="px-1 py-1 hover:opacity-80 transition-colors">Men</Link>
            <li className="px-1 py-1 hover:opacity-80 transition-colors">Women</li>
            <li className="px-1 py-1 hover:opacity-80 transition-colors">New Arrivals</li>
          </ul>

          {/* RIGHT: Search + Icons */}
          <div className="flex items-center gap-3 relative">
            <div className="relative flex items-center">
              <Motion.input
                type="text"
                placeholder="Search products"
                animate={searchOpen ? "open" : "closed"}
                variants={{
                  closed: { width: 0, opacity: 0, paddingLeft: 0, paddingRight: 0 },
                  open: { width: 200, opacity: 1, paddingLeft: 12, paddingRight: 12 },
                }}
                transition={{ duration: 0.25 }}
                className="h-9 text-sm bg-white placeholder:text-neutral-500 border border-neutral-300 rounded-full outline-none focus:ring-2 focus:ring-neutral-200 focus:border-neutral-400"
                onChange={(e) => handleSearchChange(e.target.value)}
              />
              <button
                aria-label="Toggle search"
                onClick={() => setSearchOpen((prev) => !prev)}
                className="ml-2 p-2 rounded-full hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* PROFILE ICON / PICTURE */}
            <div className="relative">
              <button
                className="p-1 rounded-full hover:bg-neutral-100 transition-colors"
                onMouseEnter={() => setProfileOpen(true)}
                onMouseLeave={() => setProfileOpen(false)}
              >
                {user ? (
                  <img src={ProfilePic} alt="Profile" className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-neutral-600" />
                )}
              </button>

              {/* DROPDOWN */}
              <AnimatePresence>
                {user ? (
                  profileOpen &&
                  <Motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50"
                    onMouseEnter={() => setProfileOpen(true)}
                    onMouseLeave={() => setProfileOpen(false)}>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 hover:bg-gray-100 text-sm">
                      Profile
                    </Link>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                      onClick={handleLogout}>
                      Logout
                    </button>
                  </Motion.div>
                ) : (
                  profileOpen && (
                    <Motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50"
                      onMouseEnter={() => setProfileOpen(true)}
                      onMouseLeave={() => setProfileOpen(false)}>
                      <Link
                        href="/login"
                        className="block px-4 py-2 hover:bg-gray-100 text-sm">
                        Login
                      </Link>
                    </Motion.div>
                  )
                )}
              </AnimatePresence>
            </div>

            <Link href="/cart" className="p-2 rounded-full hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 transition-colors" aria-label="Cart">
              <ShoppingCart className="w-5 h-5" />
            </Link>

            {/* HAMBURGER */}
            <div className="md:hidden">
              {mobileOpen ? (
                <X className="w-6 h-6 cursor-pointer" onClick={() => setMobileOpen(false)} />
              ) : (
                <Menu className="w-6 h-6 cursor-pointer" onClick={() => setMobileOpen(true)} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      <AnimatePresence>
        {mobileOpen && (
          <Motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden flex flex-col items-stretch gap-1 py-2 overflow-hidden border-t border-neutral-200 bg-white"
          >
            <Link href="/products" className="px-4 py-3 text-[14px] hover:bg-neutral-50">Men</Link>
            <a className="px-4 py-3 text-[14px] hover:bg-neutral-50">Women</a>
            <a className="px-4 py-3 text-[14px] hover:bg-neutral-50">New Arrivals</a>
          </Motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
