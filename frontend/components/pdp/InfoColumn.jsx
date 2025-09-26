import { useState } from "react";
import { useCartHandlers } from "../../features/cart/cart";
import { useRouter } from "next/navigation";
import { useAuth } from "../auth/AuthProvider";
import { useCartAnimation } from "@/contexts/CartAnimationContext";
import { useUserProfileQuery } from "@/features/api/apiSlice";

export default function InfoColumn({ product, variants = [], variantIndex = 0, onVariantChange, }) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [sizeIndex, setSizeIndex] = useState(-1);
  const [quantity, setQuantity] = useState(1);
  const { handleAddToCart, handleUpdateCart } = useCartHandlers();
  const { triggerCartAnimation } = useCartAnimation();
  
  // Get user data to check role
  const { data: user } = useUserProfileQuery(undefined, {
    skip: !isAuthenticated
  });

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
            disabled={quantity <= 1}
            onClick={() => {
              const newQty = Math.max(1, quantity - 1);
              setQuantity(newQty);
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
            }}
          >
            +
          </button>
        </div>
        {/* Add to cart button - Only show for customers and non-authenticated users */}
        {(!isAuthenticated || (isAuthenticated && user?.role === 'customer')) && (
          <button 
            ref={(el) => { window.addToCartButton = el; }}
            type="button" 
            aria-label="Add to cart" 
            disabled={sizes.length > 0 && sizeIndex === -1}
            onClick={async (e) => {
              if (!isAuthenticated) {
                router.push('/login/customer');
                return;
              }
              
              if (sizes.length > 0 && sizeIndex === -1) {
                alert('Please select a size before adding to cart');
                return;
              }
              
              try {
                const result = await handleAddToCart(product, quantity);
                
                // Trigger cart animation with source element
                const productImage = product.main_image || product.image || product.images?.[0];
                if (productImage) {
                  triggerCartAnimation(productImage, product.title, e.currentTarget);
                }
                
                // No popup - just visual feedback via animation
              } catch (error) {
                console.error('Failed to add to cart:', error);
                // No popup on error either - let the animation handle feedback
              }
            }}
            className={`flex-1 py-3 rounded-full font-medium text-sm cursor-pointer transition-colors ${
              sizes.length > 0 && sizeIndex === -1 
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {!isAuthenticated 
              ? 'Login to Add to Cart' 
              : sizes.length > 0 && sizeIndex === -1 
                ? 'Select Size First' 
                : 'Add to cart'
            }
          </button>
        )}
        <button
          type="button"
          aria-label="Add to wishlist"
          className="px-3 py-3 border rounded-md hover:bg-gray-50 transition-colors"
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
