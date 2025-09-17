"use client";

import { useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function FilterPanel() {
  const [open, setOpen] = useState(false);
  const [activeSort, setActiveSort] = useState("Featured");

  const options = [
    "Featured",
    "Best Selling",
    "Price: High → Low",
    "Price: Low → High",
    "New Arrivals",
  ];

  return (
    <div className="w-full mx-auto">
      <div className="flex justify-between items-center rounded-full bg-white text-neutral-900 border border-neutral-200 shadow-[0_1px_2px_#0000000a,0_2px_8px_-2px_#00000014] px-4 md:px-6 py-2 md:py-3">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 bg-neutral-900 rounded-full"></span>
          <p className="text-xs md:text-sm leading-none">
            <span className="font-semibold">Filter</span>{" "}
            <span className="text-neutral-500">(40 products)</span>
          </p>
        </div>

        {/* Right Section: Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center justify-between gap-2 rounded-full border border-neutral-300 bg-white px-3 md:px-4 py-1.5 text-xs md:text-sm font-medium hover:bg-neutral-50 transition"
          >
            <span>{activeSort}</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          <AnimatePresence>
            {open && (
              <Motion.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="absolute right-0 mt-2 w-48 rounded-lg bg-white text-neutral-900 border border-neutral-200 shadow-xl overflow-hidden z-10"
              >
                {options.map((option) => (
                  <li
                    key={option}
                    onClick={() => {
                      setActiveSort(option);
                      setOpen(false);
                    }}
                    className="px-4 py-2 text-sm hover:bg-neutral-50 cursor-pointer"
                  >
                    {option}
                  </li>
                ))}
              </Motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
