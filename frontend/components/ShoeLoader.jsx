"use client";

import { motion as Motion } from "framer-motion";

export default function ShoeLoader() {
    return (
        <div className="flex items-center justify-center h-screen w-full bg-white">
            {/* Shoe Wrapper (animated) */}
            <Motion.div
                className="relative w-32 h-16"
                animate={{ y: [0, -6, 0] }}
                transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}>
                {/* Sole */}
                <div className="absolute bottom-0 left-0 w-full h-3 bg-gray-800 rounded-full" />

                {/* Shoe Upper (abstract arc) */}
                <div className="absolute bottom-2 left-2 w-[85%] h-10 border-4 border-gray-800 rounded-tl-3xl rounded-tr-2xl rounded-bl-xl" />

                {/* Lace holes (minimal dots) */}
                <div className="absolute top-3 left-6 flex space-x-2">
                    <div className="w-1.5 h-1.5 bg-gray-800 rounded-full" />
                    <div className="w-1.5 h-1.5 bg-gray-800 rounded-full" />
                    <div className="w-1.5 h-1.5 bg-gray-800 rounded-full" />
                </div>
            </Motion.div>
        </div>
    );
}
