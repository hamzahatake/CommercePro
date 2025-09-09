import { useState, useMemo } from "react";
import { debounce } from "../utils/debounce";
import { Menu, X, Search, User, ShoppingCart } from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = useMemo(
    () =>
      debounce((value) => {
        console.log("Searching:", value);
        setSearchQuery(value);
      }, 500),
    []
  );

  return (
    <nav className="w-[90%] mx-auto bg-white rounded-xl shadow-sm flex items-center justify-between py-3 px-6 font-inter relative">

      {/* LOGO */}
      <div className="text-xl font-semibold tracking-tight">Bro</div>

      {/* CENTER MENU */}
      <ul className="hidden md:flex gap-10 text-base font-medium">
        <li className="cursor-pointer hover:text-gray-600 transition-colors">Men</li>
        <li className="cursor-pointer hover:text-gray-600 transition-colors">Women</li>
        <li className="cursor-pointer hover:text-gray-600 transition-colors">New Arrivals</li>
      </ul>

      {/* ICONS */}
      <div className="flex items-center gap-6">
        <Motion.div className="relative flex items-center">
          <Motion.input
            type="text"
            placeholder="Search..."
            animate={searchOpen ? "open" : "closed"}
            variants={{
              closed: { width: 0, opacity: 0, paddingLeft: 0, paddingRight: 0 },
              open: {
                width: window.innerWidth < 640 ? 120 : 160,
                opacity: 1,
                paddingLeft: 12,
                paddingRight: 12,
              },
            }}
            transition={{ duration: 0.3 }}
            className="absolute right-8 py-1 text-sm border rounded-lg outline-none"
            onChange={(e) => handleSearchChange(e.target.value)}
          />

          <Search
            className="w-6 h-6 cursor-pointer hover:text-gray-600 transition-colors"
            onClick={() => setSearchOpen((prev) => !prev)}
          />
        </Motion.div>

        <User className="w-6 h-6 cursor-pointer hover:text-gray-600 transition-colors" />
        <ShoppingCart className="w-6 h-6 cursor-pointer hover:text-gray-600 transition-colors" />

        {/* HAMBURGER */}
        <div className="md:hidden">
          {mobileOpen ? (
            <X className="w-6 h-6 cursor-pointer" onClick={() => setMobileOpen(false)} />
          ) : (
            <Menu className="w-6 h-6 cursor-pointer" onClick={() => setMobileOpen(true)} />
          )}
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      <AnimatePresence>
        {mobileOpen && (
          <Motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-16 left-0 w-full bg-white shadow-md rounded-b-xl md:hidden flex flex-col items-center gap-6 py-6"
          >
            <a href="#" className="hover:text-gray-600 transition-colors">Men</a>
            <a href="#" className="hover:text-gray-600 transition-colors">Women</a>
            <a href="#" className="hover:text-gray-600 transition-colors">New Arrivals</a>
          </Motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
