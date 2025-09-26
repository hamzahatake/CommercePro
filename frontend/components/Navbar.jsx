"use client";

import { useMemo, useState, useEffect } from "react";
import { debounce } from "@/utils/debounce";
import { Menu, X, Search, User, ShoppingCart, Shield, Settings } from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserProfileQuery } from "@/features/api/apiSlice";
import { logout } from "@/features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "./auth/AuthProvider";
import { selectCartItemCount } from "@/store/cartSlice";
import { useCartAnimation } from "@/contexts/CartAnimationContext";
import { motion } from "framer-motion";
import ProfilePic from "@/public/Auth.png"

function Navbar() {
  const { isAuthenticated, user: authUser } = useAuth();
  const router = useRouter();

  // Hydration-safe state
  const [isHydrated, setIsHydrated] = useState(false);

  const { data: user, isLoading, isError } = useUserProfileQuery(undefined, {
    skip: !isAuthenticated
  });

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  // Set hydrated state after component mounts
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const dispatch = useDispatch();
  const cartItemCount = useSelector(selectCartItemCount);
  const { cartIconRef } = useCartAnimation();

  const handleLogout = () => {
    try {
      dispatch(logout());
      router.push('/');
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
                {!isHydrated ? (
                  <User className="w-5 h-5 text-neutral-600" />
                ) : isAuthenticated ? (
                  authUser?.role === 'admin' ? (
                    <div className="w-7 h-7 bg-red-100 rounded-full flex items-center justify-center">
                      <Shield className="w-4 h-4 text-red-600" />
                    </div>
                  ) : authUser?.role === 'manager' ? (
                    <div className="w-7 h-7 bg-purple-100 rounded-full flex items-center justify-center">
                      <Settings className="w-4 h-4 text-purple-600" />
                    </div>
                  ) : authUser?.role === 'vendor' ? (
                    <img
                      src={user?.shop_logo || ProfilePic}
                      alt="Profile"
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : authUser?.role === 'customer' ? (
                    <img
                      src={user?.profile_picture || ProfilePic}
                      alt="Profile"
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-neutral-600" />
                  )
                ) : (
                  <User className="w-5 h-5 text-neutral-600" />
                )}
              </button>

              {/* DROPDOWN */}
              <AnimatePresence>
                {profileOpen && (
                  <Motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50"
                    onMouseEnter={() => setProfileOpen(true)}
                    onMouseLeave={() => setProfileOpen(false)}>
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium" style={{ color: "#1A1A1A" }}>
                            {authUser?.first_name} {authUser?.last_name}
                          </p>
                          <p className="text-xs" style={{ color: "#555555" }}>
                            {authUser?.role === 'vendor' ? 'Vendor' :
                              authUser?.role === 'manager' ? 'Manager' :
                                authUser?.role === 'admin' ? 'Admin' : 'Customer'}
                          </p>
                        </div>
                        <Link
                          href={authUser?.role === 'vendor' ? '/vendor/profile' :
                            authUser?.role === 'manager' ? '/manager/dashboard' :
                              authUser?.role === 'admin' ? '/admin/dashboard' : '/profile'}
                          className="block px-4 py-2 hover:bg-gray-100 text-sm">
                          {authUser?.role === 'manager' || authUser?.role === 'admin' ? 'Dashboard' : 'Profile'}
                        </Link>
                        {authUser?.role === 'vendor' && (
                          <Link
                            href="/vendor/dashboard"
                            className="block px-4 py-2 hover:bg-gray-100 text-sm">
                            Dashboard
                          </Link>
                        )}
                        <Link
                          href={authUser?.role === 'vendor' ? '/vendor/settings' :
                            authUser?.role === 'manager' ? '/manager/settings' :
                              authUser?.role === 'admin' ? '/admin/settings' : '/settings'}
                          className="block px-4 py-2 hover:bg-gray-100 text-sm">
                          Settings
                        </Link>
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                          onClick={handleLogout}>
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          className="block px-4 py-2 hover:bg-gray-100 text-sm">
                          Login
                        </Link>
                        <Link
                          href="/registration"
                          className="block px-4 py-2 hover:bg-gray-100 text-sm">
                          Register
                        </Link>
                      </>
                    )}
                  </Motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CART ICON - Only show for customers and non-authenticated users */}
            {!isHydrated ? (
              <div className="w-9 h-9"></div>
            ) : (isAuthenticated && authUser?.role === 'customer') || !isAuthenticated ? (
              <Link
                href="/cart"
                ref={cartIconRef}
                className="relative p-2 rounded-full hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 transition-colors"
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <motion.span
                    className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 15
                    }}
                    key={cartItemCount}
                  >
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </motion.span>
                )}
              </Link>
            ) : null}

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
