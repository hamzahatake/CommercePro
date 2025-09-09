import { motion as Motion } from "framer-motion";

export default function CatalogCard({ image, alt }) {
    return (
        <>
            {/* Desktop / larger screens */}
            <Motion.div
                className="relative w-full bg-white shadow-md items-center justify-center overflow-hidden md:block hidden"
                initial={{ borderRadius: "1.5rem", scale: 1 }}
                animate={{ borderRadius: "1.5rem", scale: 1 }} // baseline state
                whileHover={{
                    borderRadius: "40%",
                    scale: 1.02,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                <img src={image} alt={alt} className="w-full object-cover" />
                {/* Overlay Button */}
                <button className="absolute inset-0 flex items-center justify-center">
                    <span className="px-6 py-2 border border-white text-white rounded-full bg-transparent hover:bg-white hover:text-black transition">
                        Shop Now
                    </span>
                </button>
            </Motion.div>

            {/* Mobile: horizontal scroll */}
            <div className="flex md:hidden gap-3 overflow-x-auto no-scrollbar">
                <Motion.div
                    className="relative flex-shrink-0 w-[80%] bg-white shadow-md flex items-center justify-center overflow-hidden"
                    initial={{ borderRadius: "1.5rem", scale: 1 }}
                    animate={{ borderRadius: "1.5rem", scale: 1 }} // baseline state
                    whileHover={{
                        borderRadius: "40%",
                        scale: 1.02,
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    <img src={image} alt={alt} className="w-full object-cover" />
                    {/* Overlay Button */}
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
