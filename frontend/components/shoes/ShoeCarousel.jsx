'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ShoeCard from './ShoeCard';

// Sample shoe data - replace with actual data from your API
const sampleShoes = [
  {
    id: 1,
    name: "Tree Dasher 2",
    color: "#8B4513",
    colorName: "Brown",
    image: "/products/mens-tree-dasher-2/brown.webp",
    price: 98
  },
  {
    id: 2,
    name: "Tree Runner NZ",
    color: "#000000",
    colorName: "Black",
    image: "/products/mens-tree-runner-nz/black.webp",
    price: 98
  },
  {
    id: 3,
    name: "Wool Cruiser",
    color: "#4169E1",
    colorName: "Blue",
    image: "/products/mens-wool-cruiser/blue.webp",
    price: 98
  },
  {
    id: 4,
    name: "Wool Cruiser Slip-On",
    color: "#228B22",
    colorName: "Green",
    image: "/products/mens-wool-cruiser-slip-on/green.webp",
    price: 98
  },
  {
    id: 5,
    name: "Tree Dasher 2",
    color: "#FF6347",
    colorName: "Red",
    image: "/products/mens-tree-dasher-2/red.webp",
    price: 98
  },
  {
    id: 6,
    name: "Tree Runner NZ",
    color: "#9370DB",
    colorName: "Purple",
    image: "/products/mens-tree-runner-nz/purple.webp",
    price: 98
  }
];

const ShoeCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef(null);

  const cardsPerView = 4; // Number of cards visible at once
  const maxIndex = Math.max(0, sampleShoes.length - cardsPerView);

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  // Touch and mouse drag handlers
  const handleDragStart = (clientX) => {
    setIsDragging(true);
    setDragStart(clientX);
    setDragOffset(0);
  };

  const handleDragMove = (clientX) => {
    if (!isDragging) return;
    const deltaX = clientX - dragStart;
    setDragOffset(deltaX);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const threshold = 50;
    if (dragOffset > threshold) {
      prevSlide();
    } else if (dragOffset < -threshold) {
      nextSlide();
    }
    
    setDragOffset(0);
  };

  // Touch events
  const handleTouchStart = (e) => {
    handleDragStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    handleDragMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  // Mouse events
  const handleMouseDown = (e) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  };

  const handleMouseMove = (e) => {
    handleDragMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleDragEnd();
    }
  };

  // Add global mouse event listeners when dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  return (
    <div className="w-full px-4 py-8">
      {/* Top Row */}
      <div className="flex justify-between items-center mb-6">
        {/* Left side - Text buttons */}
        <div className="flex gap-4">
          <button className="text-gray-700 hover:text-gray-900 transition-colors duration-300 font-medium">
            Shop Men
          </button>
          <button className="text-gray-700 hover:text-gray-900 transition-colors duration-300 font-medium">
            Shop Women
          </button>
        </div>

        {/* Right side - Arrow buttons */}
        <div className="flex gap-2">
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={nextSlide}
            disabled={currentIndex === maxIndex}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Carousel Container */}
      <div 
        ref={containerRef}
        className="relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          className="flex gap-4"
          animate={{
            x: -(currentIndex * (256 + 16)) + dragOffset, // 256px card width + 16px gap
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
          style={{
            width: `${sampleShoes.length * (256 + 16)}px`, // Total width for all cards
          }}
        >
          {sampleShoes.map((shoe) => (
            <ShoeCard key={shoe.id} shoe={shoe} />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ShoeCarousel;

