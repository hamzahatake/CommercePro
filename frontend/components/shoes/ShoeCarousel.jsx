'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useGetProductsQuery } from '@/features/api/apiSlice';
import ShoeCard from './ShoeCard';
import ShoeLoader from '@/components/ShoeLoader';

const ShoeCarousel = () => {
  // Fetch products using RTK Query
  const { data: productsData, isLoading, error } = useGetProductsQuery({ 
    page: 1, 
    page_size: 20 
  });
  
  const allProducts = productsData?.results || [];
  const products = allProducts.slice(0, 20); // Limit to 20 cards
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef(null);

  const cardsPerView = 4;
  const maxIndex = products.length - cardsPerView;

  const nextSlide = () => {
    setCurrentIndex(prev => {
      if (prev >= maxIndex) {
        return 0; // Loop back to start
      }
      return prev + 1;
    });
  };

  const prevSlide = () => {
    setCurrentIndex(prev => {
      if (prev <= 0) {
        return maxIndex; // Loop to end
      }
      return prev - 1;
    });
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

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full px-4 py-8">
        <div className="flex justify-center items-center h-80">
          <ShoeLoader />
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full px-4 py-8">
        <div className="flex justify-center items-center h-80">
          <p className="text-gray-500">Failed to load products</p>
        </div>
      </div>
    );
  }

  // Show empty state
  if (!products.length) {
    return (
      <div className="w-full px-4 py-8">
        <div className="flex justify-center items-center h-80">
          <p className="text-gray-500">No products available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-8">
      <div className="flex justify-between items-center mb-6">

        {/* Left side - Text buttons */}
        <div className="flex gap-4">
          <button className="relative text-[16px] text-[#000000] hover:text-gray-700 transition-colors duration-300 font-medium group">
            Shop Men
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-700 transition-all duration-300 ease-in-out group-hover:w-full"></span>
          </button>
          <button className="relative text-[16px] text-[#000000] hover:text-gray-700 transition-colors duration-300 font-medium group">
            Shop Women
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-700 transition-all duration-300 ease-in-out group-hover:w-full"></span>
          </button>
        </div>

        {/* Right side - Arrow buttons */}
        <div className="flex gap-2">
          <button
            onClick={prevSlide}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-300 flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={nextSlide}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-300 flex items-center justify-center"
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
            width: `${products.length * (256 + 16)}px`, // Total width for all cards
          }}
        >
          {products.map((product, index) => (
            <ShoeCard key={`${product.id}-${index}`} product={product} />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ShoeCarousel;


