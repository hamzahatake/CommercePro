import { motion as Motion } from "framer-motion";
import CatalogImage from "./CatalogImage";

export default function CatalogCard({ image, alt }) {
    return (
        <>
            {/* Desktop */}
            <Motion.div
                className="relative w-ful shadow-md items-center justify-center overflow-hidden md:block hidden"
                initial={{ borderRadius: "1.5rem", scale: 1 }}
                animate={{ borderRadius: "1.5rem", scale: 1 }}
                whileHover={{
                    borderRadius: "40%",
                    scale: 1.02,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                <CatalogImage src={image} alt={alt} variant="desktop" />

                <button className="absolute inset-0 flex items-center justify-center">
                    <span className="px-6 py-2 border border-white text-white rounded-full bg-transparent hover:bg-white hover:text-black transition">
                        Shop Now
                    </span>
                </button>
            </Motion.div>

            {/* Mobile */}
            <div className="flex md:hidden gap-3 overflow-x-auto no-scrollbar">
                <Motion.div
                    className="relative flex-shrink-0 w-[80%] bg-white shadow-md flex items-center justify-center overflow-hidden"
                    initial={{ borderRadius: "1.5rem", scale: 1 }}
                    animate={{ borderRadius: "1.5rem", scale: 1 }}
                    whileHover={{
                        borderRadius: "40%",
                        scale: 1.02,
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    <CatalogImage src={image} alt={alt} variants="mobile" />

                    <button className="absolute inset-0 flex items-center justify-center">
                        <span className="px-6 py-2 border border-white text-white rounded-full bg-transparent hover:bg-white hover:text-black transition">
                            Shop Now
                        </span>
                    </button>
                </Motion.div>
            </div>
        </>
    );
}
