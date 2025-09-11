import React, { useMemo, useState } from "react";

export default function InfoColumn({ product, variants = [], selectedVariantIdx = 0, onVariantChange }) {
  const [selectedSizeIdx, setSelectedSizeIdx] = useState(-1);
  const [quantity, setQuantity] = useState(1);
  const addDisabled = selectedSizeIdx < 0;

  const onAddToCart = () => {
    if (addDisabled) return;
    // Simple success toast
    // eslint-disable-next-line no-alert
    alert("Added to cart");
  };

  const currentVariant = variants[selectedVariantIdx] || variants[0] || null;
  const sizes = currentVariant?.sizes?.map((s) => ({ label: s.size_label, available: (s.stock ?? 0) > 0 })) || product.sizes || [];

  return (
    <div className="pt-2 flex flex-col gap-4">
      {/* Price + rating */}
      <div className="flex items-center gap-3">
        <div className="text-2xl font-semibold text-gray-900">{product.priceFormatted}</div>
        <div className="text-sm text-gray-600" aria-label={`Rating ${product.rating} out of 5`}>
          ⭐ {product.rating} • {product.reviewsCount} Reviews
        </div>
      </div>

      {/* Badges */}
      <div className="flex gap-2">
        {product.isBestseller && (
          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">BESTSELLER</span>
        )}
        {product.isLimited && (
          <span className="bg-[#f3efe9] text-gray-800 text-xs px-2 py-1 rounded-full">LIMITED</span>
        )}
      </div>

      {/* Color swatches from variants */}
      {Array.isArray(variants) && variants.length > 0 && (
        <div>
          <div className="flex gap-2 items-center" role="listbox" aria-label="Color options">
            {variants.map((v, idx) => (
              <button
                key={v.id}
                type="button"
                aria-label={`Color ${v.color_name}`}
                className={`w-6 h-6 rounded-full border ${idx === selectedVariantIdx ? "ring-2 ring-black" : "border-gray-300"}`}
                style={{ backgroundColor: v.hex_code }}
                onClick={() => onVariantChange?.(idx)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight") onVariantChange?.(Math.min(variants.length - 1, selectedVariantIdx + 1));
                  if (e.key === "ArrowLeft") onVariantChange?.(Math.max(0, selectedVariantIdx - 1));
                  if (e.key === "Enter" || e.key === " ") onVariantChange?.(idx);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Sizes */}
      {Array.isArray(sizes) && sizes.length > 0 && (
        <div className="text-sm">
          <div className="flex flex-wrap gap-2" role="listbox" aria-label="Size options">
            {sizes.map((s, idx) => {
              const disabled = s.available === false;
              const selected = idx === selectedSizeIdx;
              return (
                <button
                  key={idx}
                  type="button"
                  disabled={disabled}
                  aria-label={`Size ${s.label}${disabled ? " unavailable" : ""}`}
                  aria-pressed={selected}
                  className={`px-3 py-2 border rounded-md ${disabled ? "opacity-40 cursor-not-allowed" : ""} ${selected ? "border-black" : "border-gray-300"}`}
                  onClick={() => setSelectedSizeIdx(idx)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowRight" || e.key === "ArrowDown") setSelectedSizeIdx((i) => Math.min(sizes.length - 1, Math.max(0, i) + 1));
                    if (e.key === "ArrowLeft" || e.key === "ArrowUp") setSelectedSizeIdx((i) => Math.max(0, (i < 0 ? 0 : i) - 1));
                  }}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity + CTA + Wishlist */}
      <div className="flex items-center gap-3">
        <div className="w-24 flex items-center justify-between border rounded-md" aria-label="Quantity selector">
          <button type="button" aria-label="Decrease quantity" className="px-2 py-2" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
          <span className="px-2 select-none">{quantity}</span>
          <button type="button" aria-label="Increase quantity" className="px-2 py-2" onClick={() => setQuantity((q) => q + 1)}>+</button>
        </div>
        <button
          type="button"
          aria-label="Add to cart"
          disabled={addDisabled}
          onClick={onAddToCart}
          className={`flex-1 py-3 rounded-full font-medium text-sm ${addDisabled ? "bg-gray-300 text-gray-600" : "bg-black text-white"}`}
        >
          Add to cart
        </button>
        <button type="button" aria-label="Add to wishlist" className="px-3 py-3 border rounded-md">♡</button>
      </div>

      {/* Shipping & Returns */}
      <div className="text-sm text-gray-600">
        <p>Free Shipping On Orders Over $75. Easy Returns</p>
        <div className="flex gap-3 mt-1">
          <a href="#" className="underline" aria-label="Live Chat">Live Chat</a>
          <a href="mailto:help@allbirds.com" className="underline" aria-label="Help email">help@allbirds.com</a>
        </div>
      </div>
    </div>
  );
}


