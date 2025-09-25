"use client";

import { createContext, useContext, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CartAnimationContext = createContext();

export const useCartAnimation = () => {
    const context = useContext(CartAnimationContext);
    if (!context) {
        throw new Error('useCartAnimation must be used within a CartAnimationProvider');
    }
    return context;
};

export const CartAnimationProvider = ({ children }) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [animationData, setAnimationData] = useState(null);
    const cartIconRef = useRef(null);

    const triggerCartAnimation = (productImage, productTitle, sourceElement = null) => {
        if (!cartIconRef.current) return;

        // Get source position (if element is provided)
        let sourcePosition = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        if (sourceElement) {
            const rect = sourceElement.getBoundingClientRect();
            sourcePosition = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            };
        }

        // Get target position (cart icon)
        const cartRect = cartIconRef.current.getBoundingClientRect();
        const targetPosition = {
            x: cartRect.left + cartRect.width / 2,
            y: cartRect.top + cartRect.height / 2
        };

        setAnimationData({
            image: productImage,
            title: productTitle,
            id: Date.now(),
            sourcePosition,
            targetPosition
        });
        setIsAnimating(true);

        // Reset animation state after animation completes
        setTimeout(() => {
            setIsAnimating(false);
            setAnimationData(null);
        }, 1200);
    };

    const value = {
        triggerCartAnimation,
        cartIconRef,
        isAnimating,
        animationData
    };

    return (
        <CartAnimationContext.Provider value={value}>
            {children}
            <CartAnimationOverlay />
        </CartAnimationContext.Provider>
    );
};

const CartAnimationOverlay = () => {
    const { isAnimating, animationData } = useCartAnimation();

    return (
        <AnimatePresence>
            {isAnimating && animationData && (
                <motion.div
                    key={animationData.id}
                    className="fixed inset-0 pointer-events-none z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="absolute"
                        initial={{
                            x: animationData.sourcePosition.x - 40,
                            y: animationData.sourcePosition.y - 40,
                            scale: 0.8,
                            rotate: -10,
                        }}
                        animate={{
                            x: animationData.targetPosition.x - 40,
                            y: animationData.targetPosition.y - 40,
                            scale: [0.8, 1.3, 0.6],
                            rotate: [-10, 5, 0],
                        }}
                        transition={{
                            duration: 1.0,
                            ease: [0.25, 0.46, 0.45, 0.94],
                            times: [0, 0.6, 1]
                        }}
                    >
                        <div className="w-20 h-20 rounded-xl overflow-hidden shadow-2xl border-2 border-white bg-white">
                            <img
                                src={animationData.image}
                                alt={animationData.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                        </div>
                        
                        {/* Glow effect */}
                        <motion.div
                            className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 to-purple-400 opacity-20"
                            initial={{ scale: 1 }}
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{
                                duration: 1.0,
                                times: [0, 0.5, 1]
                            }}
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
