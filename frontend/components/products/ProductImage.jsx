"use client";

import { motion as Motion } from "framer-motion";

export default function ProductImage({ product, color, variant = "desktop" }) {
    const baseClasses = "object-contain w-full h-full";

    const variantsArray = Array.isArray(product?.variants) ? product.variants : [];
    const firstVariant = variantsArray[0];
    const selectedVariant = color
        ? (variantsArray.find((v) => v?.color_name === color) || firstVariant)
        : null;

    const imageSrc =
        (Array.isArray(selectedVariant?.images) && selectedVariant.images[0]?.url) || 
        (Array.isArray(firstVariant?.images) && firstVariant.images[0]?.url) || 
        (product?.main_image_url || "");

    const altText = product?.title || "Product image";

    if (!imageSrc) {
        return null;
    }

    if (variant === "desktop") {
        
        return (
            <Motion.img
                src={imageSrc}
                alt={altText}
                loading="lazy"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={baseClasses}
            />
        );
    }

    return null;
}
