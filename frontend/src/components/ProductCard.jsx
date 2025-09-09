import { motion as Motion} from "framer-motion";
import Shoe from "../../public/items/Shoe1.webp";

export default function ProductCard() {
    return (
        <Motion.div
            className="max-w-sm w-full"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
        >
            <div className="relative rounded-2xl shadow-lg overflow-hidden bg-white">
                {/* BestSeller Badge */}
                <div className="absolute top-3 right-3 bg-amber-800 text-white font-bold text-xs px-3 py-1 rounded-lg">
                    BestSeller
                </div>

                {/* Shoe Image */}
                <div className="flex justify-center items-center p-6">
                    <img
                        src={Shoe}
                        alt="Shoe"
                        className="object-contain w-48 h-40"
                    />
                </div>

                {/* Bottom Section */}
                <div className="flex justify-between items-start p-4">
                    {/* Left Side */}
                    <div>
                        <h3 className="font-bold text-lg">AirFlex Runner</h3>
                        <p className="text-sm text-gray-600">Available in Red, Blue, Black</p>

                        {/* Color Swatches */}
                        <div className="flex gap-2 mt-2">
                            <span className="w-5 h-5 rounded-full bg-red-500 border border-gray-300"></span>
                            <span className="w-5 h-5 rounded-full bg-blue-500 border border-gray-300"></span>
                            <span className="w-5 h-5 rounded-full bg-black border border-gray-300"></span>
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="text-right">
                        <p className="font-semibold text-lg">$120</p>
                    </div>
                </div>
            </div>
        </Motion.div>
    );
}