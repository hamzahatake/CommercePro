import { useEffect, useMemo, useState } from "react";
import { debounce } from "../utils/debounce";
import { Menu, X, Search, User, ShoppingCart } from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [bgOpacity, setBgOpacity] = useState(0);

  const handleSearchChange = useMemo(
    () =>
      debounce((value) => {
        console.log("Searching:", value);
        setSearchQuery(value);
      }, 500),
    []
  );

  useEffect(() => {
    const onScroll = () => {
      const threshold = 200; // px to fade in fully
      const y = window.scrollY || 0;
      const alpha = Math.max(0, Math.min(1, y / threshold));
      setBgOpacity(alpha);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full text-neutral-900 border-b border-neutral-200 shadow-[0_1px_0_#0000000a]"
      style={{ backgroundColor: `rgba(255,255,255,${0.95 * bgOpacity})`, backdropFilter: bgOpacity > 0.05 ? "saturate(180%) blur(10px)" : undefined }}>
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
        <div className="h-16 flex items-center justify-between gap-4">
          {/* LOGO */}
          <Link to="/" className="text-[20px] font-semibold tracking-tight hover:opacity-80 transition-colors">Allbirds</Link>

          {/* CENTER MENU */}
          <ul className="hidden md:flex items-center gap-8 text-[14px] font-medium">
            <Link to="/products" className="px-1 py-1 hover:opacity-80 transition-colors">Men</Link>
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

            <button className="p-2 rounded-full hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 transition-colors" aria-label="Account">
              <User className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 transition-colors" aria-label="Cart">
              <ShoppingCart className="w-5 h-5" />
            </button>

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
            <Link to="/products" className="px-4 py-3 text-[14px] hover:bg-neutral-50">Men</Link>
            <a className="px-4 py-3 text-[14px] hover:bg-neutral-50">Women</a>
            <a className="px-4 py-3 text-[14px] hover:bg-neutral-50">New Arrivals</a>
          </Motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
