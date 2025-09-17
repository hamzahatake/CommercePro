import { useState } from "react";
import { useCartHandlers } from "../../features/cart/cart";

export default function InfoColumn({ product, variants = [], variantIndex = 0, onVariantChange, }) {
  const [sizeIndex, setSizeIndex] = useState(-1);
  const [quantity, setQuantity] = useState(0);
  const { handleAddToCart, handleUpdateCart } = useCartHandlers();

  const currentVariant = variants[variantIndex] || variants[0] || null;

  const sizes = currentVariant?.sizes?.map((s) => ({
    label: s.label,
    id: s.id,
    available: Boolean(s.stock > 0),
  })) || [];

  return (
    <div className="pt-2 flex flex-col gap-4">

      {/* Price + rating */}
      <div className="flex items-center gap-3">
        <div className="text-2xl font-semibold text-gray-900">${currentVariant?.price || 0}</div>
        <div className="text-sm text-gray-600" aria-label={`Rating ${product.rating} out of 5`}>
          ⭐ {product.rating} • {product.reviewsCount} Reviews
        </div>
      </div>

      {/* Badges */}
      <div className="flex gap-2">
        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
          {product.badge}
        </span>
      </div>

      {/* Color swatches */}
      {Array.isArray(variants) && variants.length > 0 && (
        <div>
          <div className="flex gap-2 items-center" role="listbox" aria-label="Color options">
            {variants.map((v, idx) => (
              <button
                key={v.id} type="button" aria-label={`Color ${v.color_name}`}
                className={`w-6 h-6 rounded-full border ${idx === variantIndex
                  ? "ring-2 ring-neutral-300 border-neutral-100" : "border-gray-300"}`}
                style={{ backgroundColor: v.hex_code }} onClick={() => onVariantChange?.(idx)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight")
                    onVariantChange?.(Math.min(variants.length - 1, variantIndex + 1));
                  if (e.key === "ArrowLeft")
                    onVariantChange?.(Math.max(0, variantIndex - 1));
                  if (e.key === "Enter" || e.key === " ")
                    onVariantChange?.(idx);
                }} />
            ))}
          </div>
        </div>
      )}

      {/* Sizes */}
      {sizes.length > 0 && (
        <div className="text-sm">
          <div
            className="flex flex-wrap gap-2" role="listbox" aria-label="Size options" >
            {sizes.map((size, index) => {
              const disabled = !size.available;
              const selected = index === sizeIndex;

              return (
                <button
                  key={size.label}
                  type="button"
                  disabled={disabled}
                  aria-label={`Size ${size.label}${disabled ? " unavailable" : ""}`}
                  aria-pressed={selected}
                  className={`px-3 py-2 border rounded-md ${disabled ? "opacity-40 cursor-not-allowed" : ""
                    } ${selected ? "border-black" : "border-gray-300 cursor-pointer"}`}
                  onClick={() => setSizeIndex(index)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                      setSizeIndex((i) =>
                        Math.min(sizes.length - 1, i + 1)
                      );
                    }
                    if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                      setSizeIndex((i) => Math.max(0, i - 1));
                    }
                  }}
                >
                  {size.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity + CTA + Wishlist */}
      <div className="flex items-center gap-3">
        <div
          className="w-24 flex items-center justify-between border rounded-md "
          aria-label="Quantity selector"
        >
          <button
            type="button"
            aria-label="Decrease quantity"
            className="px-2 py-2 cursor-pointer"
            disabled={quantity === 0}
            onClick={() => {
              const newQty = quantity - 1;
              setQuantity(newQty);
              handleUpdateCart(product, newQty);
            }}
          >
            -
          </button>
          <span className="px-2 select-none">{quantity}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            className="px-2 py-2 cursor-pointer"
            onClick={() => {
              const newQty = quantity + 1;
              setQuantity(newQty);
              handleUpdateCart(product, newQty);
            }}
          >
            +
          </button>
        </div>
        <button type="button" aria-label="Add to cart" disabled={quantity === 0} onClick={() => handleAddToCart(product, quantity)}
          className={`flex-1 py-3 rounded-full font-medium text-sm ${quantity === 0
            ? "bg-gray-300 text-gray-600 disabled:cursor-not-allowed" : "bg-black text-white cursor-pointer"
            }`}>
          Add to cart
        </button>
        <button
          type="button"
          aria-label="Add to wishlist"
          className="px-3 py-3 border rounded-md"
        >
          ♡
        </button>
      </div>

      {/* Shipping & Returns */}
      <div className="text-sm text-gray-600">
        <p>Free Shipping On Orders Over $75. Easy Returns</p>
        <div className="flex gap-3 mt-1">
          <a href="#" className="underline" aria-label="Live Chat">
            Live Chat
          </a>
          <a
            href="mailto:help@allbirds.com"
            className="underline"
            aria-label="Help email"
          >
            help@allbirds.com
          </a>
        </div>
      </div>
    </div>
  );
}
