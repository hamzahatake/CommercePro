import React, { useRef } from "react";
import { motion as Motion } from "framer-motion";

export default function ImageCarousel({ images = [], title = "", activeIndex = 0, setActiveIndex = () => {} }) {
  const safeIndex = Math.min(activeIndex, Math.max(0, images.length - 1));
  const containerRef = useRef(null);

  return (
    <div
      ref={containerRef}
      className="relative w-full xl:w-[1950px] max-w-full aspect-[6/2] rounded-md overflow-hidden"
      role="region"
      aria-label="Product image carousel"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") setActiveIndex((i) => Math.min(images.length - 1, i + 1));
        if (e.key === "ArrowLeft") setActiveIndex((i) => Math.max(0, i - 1));
      }}
    >
      <Motion.div
        className="absolute inset-0 flex items-center"
        animate={{ x: `-${safeIndex * 100}%` }}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
        style={{ willChange: "transform" }}
      >
        {images.map((img, idx) => (
          <div
            key={idx}
            className={`shrink-0 w-full h-full rounded-md overflow-hidden ${idx === safeIndex ? "ring-2 ring-white/80" : ""}`}
            aria-hidden={idx !== safeIndex}
          >
            <img
              src={img.url}
              alt={img.alt || `${title} image ${idx + 1}`}
              className="w-full h-full object-contain bg-transparent"
              draggable={false}
            />
          </div>
        ))}
      </Motion.div>

      <button
        type="button"
        aria-label="Previous image"
        aria-disabled={safeIndex === 0}
        disabled={safeIndex === 0}
        className={`absolute left-3 top-1/2 -translate-y-1/2 rounded-full shadow-lg backdrop-blur-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${safeIndex === 0 ? "bg-black/20 text-white/40 cursor-not-allowed" : "bg-black/40 hover:bg-black/60 text-white"}`}
        onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
      >
        <span className="sr-only">Previous</span>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="m-2">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <button
        type="button"
        aria-label="Next image"
        aria-disabled={safeIndex === Math.max(0, images.length - 1)}
        disabled={safeIndex === Math.max(0, images.length - 1)}
        className={`absolute right-3 top-1/2 -translate-y-1/2 rounded-full shadow-lg backdrop-blur-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${safeIndex === Math.max(0, images.length - 1) ? "bg-black/20 text-white/40 cursor-not-allowed" : "bg-black/40 hover:bg-black/60 text-white"}`}
        onClick={() => setActiveIndex((i) => Math.min(images.length - 1, i + 1))}
      >
        <span className="sr-only">Next</span>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="m-2">
          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}


