import { motion as Motion } from "framer-motion";

export default function CatalogImage({ src, alt, variant = "desktop" }) {
    const baseClasses = "w-full object-cover";

    if (variant === "desktop") {
        return (
            <Motion.img
                src={src}
                alt={alt}
                loading="lazy"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={baseClasses}
            />
        );
    }

    if (variant === "mobile") {
        return (
            <img
                src={src}
                alt={alt}
                loading="lazy"
                className={baseClasses}
            />
        );
    }

    return null;
}
