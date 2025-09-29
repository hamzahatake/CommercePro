'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
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
  const originalProducts = allProducts.slice(0, 20); // Limit to 20 cards

  // Create infinite loop by duplicating products
  const products = [
    ...originalProducts.slice(-3), // Last 3 products at the beginning
    ...originalProducts,
    ...originalProducts.slice(0, 3) // First 3 products at the end
  ];

  const [currentIndex, setCurrentIndex] = useState(3); // Start at the first real product
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [activeCategory, setActiveCategory] = useState('men'); // Track active category
  const containerRef = useRef(null);

  const cardsPerView = 4;
  const cardWidth = 450;
  const gap = 16;
  const cardTotalWidth = cardWidth + gap;

  // Motion values for smooth dragging
  const x = useMotionValue(0);
  const xSpring = useSpring(x, { stiffness: 300, damping: 30 });

  // Calculate the current position
  const currentX = -(currentIndex * cardTotalWidth);

  // Update motion value when currentIndex changes
  useEffect(() => {
    if (!isDragging) {
      x.set(currentX);
    }
  }, [currentIndex, currentX, isDragging, x]);

  // Handle infinite loop transitions smoothly - only jump when absolutely necessary
  useEffect(() => {
    if (!isDragging) {
      const timer = setTimeout(() => {
        // Only jump if we're way beyond the duplicated cards
        if (currentIndex >= originalProducts.length + 3) {
          // We're at the duplicated cards at the end, jump to real first cards
          setCurrentIndex(3);
        } else if (currentIndex < 0) {
          // We're at the duplicated cards at the beginning, jump to real last cards
          setCurrentIndex(originalProducts.length + 2);
        }
      }, 150); // Longer delay to ensure smooth transition

      return () => clearTimeout(timer);
    }
  }, [currentIndex, isDragging, originalProducts.length]);

  const nextSlide = () => {
    setCurrentIndex(prev => {
      const newIndex = prev + 1;
      // Allow going beyond the real products to show duplicated cards
      return newIndex;
    });
  };

  const prevSlide = () => {
    setCurrentIndex(prev => {
      const newIndex = prev - 1;
      // Allow going before the real products to show duplicated cards
      return newIndex;
    });
  };

  // Touch and mouse drag handlers
  const handleDragStart = (clientX) => {
    setIsDragging(true);
    setDragStart(clientX);
  };

  const handleDragMove = (clientX) => {
    if (!isDragging) return;
    const deltaX = clientX - dragStart;
    x.set(currentX + deltaX);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 30;
    const deltaX = x.get() - currentX;

    if (deltaX > threshold) {
      prevSlide();
    } else if (deltaX < -threshold) {
      nextSlide();
    } else {
      // Snap back to current position
      x.set(currentX);
    }
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
    <div className="w-full py-8">
      <div className="flex justify-between items-center mb-6">

        {/* Left side - Text buttons */}
        <div className="flex pl-4 gap-4">
          <button
            onClick={() => setActiveCategory('men')}
            className={`relative text-[16px] transition-colors duration-300 font-medium group pb-2 focus:outline-none focus:text-gray-700 ${activeCategory === 'men'
                ? 'text-gray-700'
                : 'text-[#000000] hover:text-gray-700'
              }`}
          >
            Shop Men
            <span className={`absolute bottom-0 left-0 h-0.5 bg-gray-700 transition-all duration-300 ease-in-out ${activeCategory === 'men'
                ? 'w-full'
                : 'w-0 group-hover:w-full'
              }`}></span>
          </button>
          <button
            onClick={() => setActiveCategory('women')}
            className={`relative text-[16px] transition-colors duration-300 font-medium group pb-2 focus:outline-none focus:text-gray-700 ${activeCategory === 'women'
                ? 'text-gray-700'
                : 'text-[#000000] hover:text-gray-700'
              }`}
          >
            Shop Women
            <span className={`absolute bottom-0 left-0 h-0.5 bg-gray-700 transition-all duration-300 ease-in-out ${activeCategory === 'women'
                ? 'w-full'
                : 'w-0 group-hover:w-full'
              }`}></span>
          </button>
        </div>

        {/* Right side - Arrow buttons */}
        <div className="flex pr-4 gap-2">
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
          style={{
            x: xSpring,
            width: `${products.length * cardTotalWidth}px`,
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


