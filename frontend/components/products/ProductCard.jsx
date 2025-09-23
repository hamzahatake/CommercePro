"use client";

import { motion as Motion } from "framer-motion";
import ProductImage from "@/components/products/ProductImage";
import { useState } from "react";
import Link from "next/link";

export default function ProductCard({ product }) {
    const [selectedColor, setSelectedColor] = useState(product?.variants?.[0]?.color_name || "");
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [showAllColors, setShowAllColors] = useState(false);
    const slug = product?.slug || product?.id;
    const to = `/products/${slug}`;
    const displayPrice = selectedVariant?.price ?? product.price;
    
    const colorsToShow = showAllColors ? product.variants : product.variants.slice(0, 4);
    const hasMoreColors = product.variants.length > 4;

    return (
        <Motion.div
            className="w-full h-full"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.15 }} >

            <div className="relative w-full max-w-[300px] md:max-w-[320px] xl:max-w-[340px] rounded-2xl overflow-hidden bg-neutral-50 text-neutral-900 border border-neutral-200 shadow-[0_1px_2px_#0000000a,0_10px_24px_-14px_#00000024] flex flex-col">
                {/* Badge */}
                <div className="absolute top-3 left-3 bg-black/80 text-white font-semibold text-[10px] tracking-wide px-2.5 py-1 rounded">
                    {product.badge}
                </div>

                {/* Image */}
                <Link href={to} aria-label={`View details for ${product.title}`} className="flex justify-center items-center aspect-[4/3] bg-neutral-50 w-full">
                    <ProductImage product={product} variant="desktop" color={selectedColor} />
                </Link>

                {/* Bottom Section */}
                <div className="p-4 pt-3 flex-1 flex flex-col">
                    <h3 className="font-semibold text-[15px] leading-tight">
                        <Link href={to} className="hover:underline">{product.title}</Link>
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">{selectedColor || "Select a color"}</p>

                    {/* Color Swatches */}
                    <div className="mt-2 flex gap-1.5 flex-wrap">
                        {colorsToShow.map((color) => (
                            <button
                                key={color.id}
                                style={{ backgroundColor: color.hex_code }}
                                className={`w-6 h-6 rounded-full border ${selectedColor === color.color_name ? "ring-2 ring-neutral-300 border-neutral-100" : "border-neutral-300"}`}
                                onClick={(e) => { e.stopPropagation(); setSelectedColor(color.color_name); setSelectedVariant(color) }}
                            />
                        ))}
                        
                        {/* + button if there are more colors */}
                        {hasMoreColors && !showAllColors && (
                            <button
                                className="w-6 h-6 rounded-full border border-neutral-300 bg-neutral-100 flex items-center justify-center text-xs font-medium text-neutral-600 hover:bg-neutral-200 transition-colors duration-200"
                                onClick={(e) => { e.stopPropagation(); setShowAllColors(true) }}
                                title={`Show ${product.variants.length - 4} more colors`}
                            >
                                +
                            </button>
                        )}
                        
                        {/* - button when expanded */}
                        {hasMoreColors && showAllColors && (
                            <button
                                className="w-6 h-6 rounded-full border border-neutral-300 bg-neutral-100 flex items-center justify-center text-xs font-medium text-neutral-600 hover:bg-neutral-200 transition-colors duration-200"
                                onClick={(e) => { e.stopPropagation(); setShowAllColors(false) }}
                                title="Show fewer colors"
                            >
                                −
                            </button>
                        )}
                    </div>

                    {/* Pricing */}
                    <div className="mt-auto flex justify-end">
                        <Link href={to} className="font-semibold text-[15px] hover:underline">${displayPrice}</Link>
                    </div>
                </div>
            </div>
        </Motion.div >
    );
}