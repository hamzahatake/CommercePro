import React, { useState } from "react";

export default function GalleryColumn({ images = [], title = "" }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const safeIndex = Math.min(activeIndex, Math.max(0, images.length - 1));

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
      {/* Inline slider with arrows */}
      <ImageCarousel images={images} title={title} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />

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

      {/* Lightbox removed for inline carousel per design */}
    </div>
  );
}


