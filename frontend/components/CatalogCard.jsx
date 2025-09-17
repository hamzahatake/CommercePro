"use client";

import { motion as Motion } from "framer-motion";
import { useState } from "react";
import CatalogImage from "./CatalogImage";

export default function CatalogCard({ image, alt }) {
    const [hoveredDesktop, setHoveredDesktop] = useState(false);
    const [hoveredMobile, setHoveredMobile] = useState(false);
    return (
        <>
            {/* Desktop */}
            <Motion.div
                className="relative w-full shadow-md items-center justify-center overflow-hidden md:block hidden"
                initial={{ borderRadius: 24, scale: 1 }}
                animate={{
                    borderRadius: hoveredDesktop ? 999 : 24,
                    scale: hoveredDesktop ? 1.02 : 1,
                }}
                transition={{ type: "tween", ease: "easeInOut", duration: 0.35 }}
                onHoverStart={() => setHoveredDesktop(true)}
                onHoverEnd={() => setHoveredDesktop(false)}
                style={{ willChange: "border-radius, transform", backfaceVisibility: "hidden", transformPerspective: 1000 }}
            >
                <CatalogImage src={image} alt={alt} variant="desktop" />
                <button className="absolute inset-0 flex items-center justify-center">
                    <span className="px-6 py-2 border border-white text-white rounded-full bg-transparent hover:bg-white hover:text-black transition">
                        Shop Now
                    </span>
                </button>
            </Motion.div>

            {/* Mobile */}
            <Motion.div
                className="relative flex-shrink-0 w-[80%] bg-white shadow-md flex items-center justify-center overflow-hidden md:hidden"
                initial={{ borderRadius: 24, scale: 1 }}
                animate={{
                    borderRadius: hoveredMobile ? 999 : 24,
                    scale: hoveredMobile ? 1.02 : 1,
                }}
                transition={{ type: "tween", ease: "easeInOut", duration: 0.35 }}
                onHoverStart={() => setHoveredMobile(true)}
                onHoverEnd={() => setHoveredMobile(false)}
                style={{ willChange: "border-radius, transform", backfaceVisibility: "hidden", transformPerspective: 1000 }}
            >
                <CatalogImage src={image} alt={alt} variant="mobile" />
                <button className="absolute inset-0 flex items-center justify-center">
                    <span className="px-6 py-2 border border-white text-white rounded-full bg-transparent hover:bg-white hover:text-black transition">
                        Shop Now
                    </span>
                </button>
            </Motion.div>
        </>
    );
}
