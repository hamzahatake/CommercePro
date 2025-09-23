"use client"

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const promoData = [
    {
        id: 1,
        statement: "BOLD BY NATURE.",
        shoeImage: "/Hero Carousal/2.webp",
        modelImage: "/Hero Carousal/1.webp",
        title: "New Wool Cruiser Collection",
        description: "19 bold colors in super soft recycled Italian felt wool.",
        menLink: "/products",
        womenLink: "/products?category=women"
    },
    {
        id: 2,
        statement: "BOLD BY NATURE.",
        shoeImage: "/Hero Carousal/4.webp",
        modelImage: "/Hero Carousal/3.webp",
        title: "New Wool Cruiser Collection",
        description: "19 bold colors in super soft recycled Italian felt wool.",
        menLink: "/products",
        womenLink: "/products?category=women"
    },
    {
        id: 3,
        statement: "COMFORT BY NATURE.",
        shoeImage: "/Hero Carousal/6.webp",
        modelImage: "/Hero Carousal/5.webp",
        title: "Tree Runner NZ",
        description: "Minimal, modern, and miraculously comfortable.",
        menLink: "/products",
        womenLink: "/products?category=women"
    },
    {
        id: 4,
        statement: "COMFORT BY NATURE.",
        shoeImage: "/Hero Carousal/8.webp",
        modelImage: "/Hero Carousal/7.webp",
        title: "Tree Dasher 2",
        description: "Breathable comfort for everyday performance.",
        menLink: "/products",
        womenLink: "/products?category=women"
    }
];

export default function HeroCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setProgress(prev => {
                const newProgress = prev + (100 / 120);
                if (newProgress >= 100) {
                    setCurrentIndex(prevIndex => {
                        if (promoData.length === 0) return 0;
                        const nextIndex = (prevIndex + 1) % promoData.length;
                        console.log('Transitioning from', prevIndex, 'to', nextIndex, 'Total items:', promoData.length);
                        return nextIndex;
                    });
                    return 0;
                }
                return newProgress;
            });
        }, 30);

        return () => clearInterval(interval);
    }, [isPaused]);

    useEffect(() => {
        if (currentIndex >= promoData.length && promoData.length > 0) {
            setCurrentIndex(0);
        }
    }, [promoData.length, currentIndex]);

    const togglePause = () => {
        setIsPaused(!isPaused);
    };

    console.log('Current index:', currentIndex, 'Total items:', promoData.length);

    if (promoData.length === 0) {
        return null;
    }

    return (
        <motion.div
            className="w-full px-4 bg-white mt-4 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}>

            <motion.div
                className="flex flex-col lg:flex-row min-h-[500px] lg:min-h-[600px] gap-8 lg:gap-12 rounded-2xl shadow-lg max-w-full"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}>

                <AnimatePresence mode="wait">
                    {promoData.map((promo, index) => (
                        index === currentIndex && (
                            <motion.div
                                key={`carousel-${promo.id}-${index}`}
                                className="flex flex-col lg:flex-row w-full gap-8 lg:gap-12"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}>

                                {/* Left Column - Shoe Section */}
                                <motion.div
                                    className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-between min-h-[500px] lg:min-h-[600px]"
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.1 }}>

                                    {/* Statement */}
                                    <motion.div
                                        className="mb-8 flex items-center justify-center h-8"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: 0.3 }}>

                                        <p className="text-xs text-black leading-relaxed font-normal text-center" style={{ fontSize: '12px' }}>
                                            {promo.statement}
                                        </p>
                                    </motion.div>

                                    {/* Shoe Image */}
                                    <motion.div
                                        className="flex-1 flex items-center justify-center mb-8 min-h-[300px] lg:min-h-[350px]"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.6, delay: 0.4 }}
                                    >
                                        <div className="relative w-full max-w-md lg:max-w-lg h-full flex items-center justify-center">
                                            <motion.div
                                                className="relative w-full h-full flex items-center justify-center"
                                                whileHover={{ scale: 1.05 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <Image
                                                    key={`shoe-${index}`}
                                                    src={promo.shoeImage}
                                                    alt={promo.title}
                                                    width={500}
                                                    height={500}
                                                    className="w-full h-auto object-contain max-h-full"
                                                    priority
                                                />
                                            </motion.div>
                                        </div>
                                    </motion.div>

                                    {/* Title and Description Block */}
                                    <motion.div
                                        className="mb-8 text-center min-h-[80px] flex flex-col justify-center"
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.5 }}
                                    >
                                        <h2 className="mb-2 font-semibold text-black"
                                            style={{ fontSize: '24px', fontFamily: 'Geograph, sans-serif, system-ui' }}>
                                            {promo.title}
                                        </h2>
                                        <p className="text-black font-light" style={{ fontSize: '14px' }}>
                                            {promo.description}
                                        </p>
                                    </motion.div>

                                    {/* Action Buttons */}
                                    <motion.div
                                        className="flex gap-4 justify-center h-12 items-center"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: 0.6 }}
                                    >
                                        <motion.a
                                            href={promo.menLink}
                                            className="bg-transparent text-black border border-gray-800 rounded-full"
                                            style={{ fontSize: '12px', padding: '8px 16px' }}
                                            whileHover={{
                                                backgroundColor: '#f3f4f6',
                                                scale: 1.05,
                                                transition: { duration: 0.2 }
                                            }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Shop Men
                                        </motion.a>
                                        <motion.a
                                            href={promo.womenLink}
                                            className="bg-transparent text-black border border-gray-800 rounded-full"
                                            style={{ fontSize: '12px', padding: '8px 16px' }}
                                            whileHover={{
                                                backgroundColor: '#f3f4f6',
                                                scale: 1.05,
                                                transition: { duration: 0.2 }
                                            }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Shop Women
                                        </motion.a>
                                    </motion.div>
                                </motion.div>

                                {/* Right Column - Model Section */}
                                <motion.div
                                    className="lg:w-1/2 relative overflow-hidden rounded-2xl min-h-[300px] lg:min-h-[600px]"
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                >
                                    <motion.div
                                        initial={{ scale: 1.1 }}
                                        animate={{ scale: 1 }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        <Image
                                            key={`model-${index}`}
                                            src={promo.modelImage}
                                            alt="Model"
                                            fill
                                            className="object-cover"
                                            priority
                                        />
                                    </motion.div>

                                    {/* Progress Bar Overlay */}
                                    <motion.div
                                        className="absolute bottom-6 left-6 right-6"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: 0.7 }}
                                    >
                                        <div className="flex items-center gap-3">
                                            {/* Smooth Progress Bar */}
                                            <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-full h-1 overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-white rounded-full"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${progress}%` }}
                                                    transition={{ duration: 0.025, ease: "linear" }}
                                                />
                                            </div>

                                            {/* Pause Button */}
                                            <motion.button
                                                onClick={togglePause}
                                                className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30"
                                                whileHover={{
                                                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                                    scale: 1.1
                                                }}
                                                whileTap={{ scale: 0.9 }}
                                                transition={{ duration: 0.2 }}
                                                aria-label={isPaused ? "Resume rotation" : "Pause rotation"}
                                            >
                                                <motion.div
                                                    animate={{ rotate: isPaused ? 0 : 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    {isPaused ? (
                                                        <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M8 5v10l7-5-7-5z" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M5 4h3v12H5V4zm7 0h3v12h-3V4z" />
                                                        </svg>
                                                    )}
                                                </motion.div>
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        )
                    ))}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
}