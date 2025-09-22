"use client";

import { motion as Motion } from "framer-motion";
import Image from "next/image";

export default function CatalogImage({ src, alt, variant = "desktop" }) {
    const baseClasses = "w-full object-contain";

    if (variant === "desktop") {
        return (
            <Motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative w-full"
            >
                <Image
                    src={src}
                    alt={alt}
                    width={400}
                    height={300}
                    className={baseClasses}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </Motion.div>
        );
    }

    if (variant === "mobile") {
        return (
            <Image
                src={src}
                alt={alt}
                width={400}
                height={300}
                className={baseClasses}
                sizes="(max-width: 768px) 100vw, 50vw"
            />
        );
    }

    return null;
}
