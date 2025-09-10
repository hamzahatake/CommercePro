import { motion as Motion } from "framer-motion";

export default function ProductImage({product, variant = "desktop" }) {
    const baseClasses = "object-contain w-48 h-40";

    if (variant === "desktop") {
        return (
            <Motion.img
                src={product?.main_image}
                alt={product?.title}
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
