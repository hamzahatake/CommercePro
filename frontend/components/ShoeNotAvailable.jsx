"use client";

import { motion as Motion } from "framer-motion";

export default function ShoeNotAvailable() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-50">
      {/* Sneaker Illustration */}
      <Motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 300 150"
        className="w-40 h-24 md:w-56 md:h-32 text-red-600"
        fill="white"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 10 }}
      >
        {/* Outer shoe shape */}
        <Motion.path
          d="M20 100 Q40 50, 100 60 L160 65 Q200 65, 240 90 Q260 105, 280 105 L280 120 Q150 140, 20 120 Z"
          animate={{ rotate: [0, -5, 5, -5, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Sole */}
        <path d="M20 120 L280 120" className="stroke-red-500" />
        {/* Lace holes */}
        <circle cx="120" cy="70" r="5" />
        <circle cx="140" cy="70" r="5" />
        <circle cx="160" cy="70" r="5" />
        <circle cx="180" cy="72" r="5" />
      </Motion.svg>

      {/* Error Text */}
      <Motion.h2
        className="mt-6 text-xl md:text-2xl font-semibold text-gray-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        Shoes are <span className="text-red-600">not available</span>
      </Motion.h2>

      {/* Retry Button */}
      <Motion.button
        className="mt-4 px-6 py-2 rounded-xl bg-red-600 text-white font-medium shadow-md hover:bg-red-700 transition"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Try Again
      </Motion.button>
    </div>
  );
}
