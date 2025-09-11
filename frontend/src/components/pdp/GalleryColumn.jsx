import React, { useEffect, useRef, useState } from "react";

export default function GalleryColumn({ images = [], title = "" }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setLightboxOpen] = useState(false);
  const lightboxRef = useRef(null);
  const lastFocusedRef = useRef(null);

  const hasImages = images && images.length > 0;
  const safeIndex = Math.min(activeIndex, Math.max(0, images.length - 1));
  const active = hasImages ? images[safeIndex] : null;

  useEffect(() => {
    function onKey(e) {
      if (!isLightboxOpen) return;
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") setActiveIndex((i) => Math.min(images.length - 1, i + 1));
      if (e.key === "ArrowLeft") setActiveIndex((i) => Math.max(0, i - 1));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isLightboxOpen, images.length]);

  useEffect(() => {
    if (isLightboxOpen) {
      lastFocusedRef.current = document.activeElement;
      setTimeout(() => lightboxRef.current?.focus(), 0);
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previousOverflow;
        if (lastFocusedRef.current && lastFocusedRef.current.focus) lastFocusedRef.current.focus();
      };
    }
  }, [isLightboxOpen]);

  const thumbKeyDown = (e, idx) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActiveIndex(idx);
    }
    if (e.key === "ArrowRight") setActiveIndex((i) => Math.min(images.length - 1, i + 1));
    if (e.key === "ArrowLeft") setActiveIndex((i) => Math.max(0, i - 1));
  };

  return (
    <div className="pt-2">
      {/* Main image */}
      <button
        type="button"
        className="w-full aspect-[4/3] rounded-md overflow-hidden"
        onClick={() => setLightboxOpen(true)}
        aria-label="Open image lightbox"
      >
        {active && (
          <img
            src={active.url}
            alt={active.alt || `${title} image ${safeIndex + 1}`}
            className="w-full h-full object-cover"
          />
        )}
      </button>

      {/* Thumbnails */}
      <div className="mt-3 flex gap-2 overflow-x-auto" role="listbox" aria-label="Product thumbnails">
        {images.map((img, idx) => (
          <div key={idx} className="shrink-0">
            <button
              type="button"
              className={`w-20 h-20 rounded-md object-cover ring-2 ${idx === safeIndex ? "ring-gray-900" : "ring-transparent"}`}
              onClick={() => setActiveIndex(idx)}
              onKeyDown={(e) => thumbKeyDown(e, idx)}
              aria-label={`Thumbnail ${idx + 1}`}
              aria-selected={idx === safeIndex}
            >
              <img src={img.url} alt={img.alt || `${title} thumbnail ${idx + 1}`} className="w-20 h-20 object-cover rounded-md" />
            </button>
          </div>
        ))}
      </div>

      {/* Trust badges */}
      <div className="mt-4 flex gap-3 text-sm text-gray-600">
        <span>Free Shipping on orders over $75</span>
        <span>•</span>
        <span>Easy Returns</span>
      </div>

      {/* Lightbox modal */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Product images"
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative max-w-5xl w-full outline-none"
            tabIndex={-1}
            ref={lightboxRef}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full aspect-[4/3]">
              {active && (
                <img src={active.url} alt={active.alt || `${title} enlarged ${safeIndex + 1}`} className="w-full h-full object-contain" />
              )}
              <button
                type="button"
                aria-label="Previous image"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full px-3 py-2"
                onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="Next image"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full px-3 py-2"
                onClick={() => setActiveIndex((i) => Math.min(images.length - 1, i + 1))}
              >
                ›
              </button>
              <button
                type="button"
                aria-label="Close lightbox"
                className="absolute top-2 right-2 bg-white/90 rounded-full px-3 py-2"
                onClick={() => setLightboxOpen(false)}
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


