"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const collections = {
  collection1: {
    name: "Collection 1",
    images: {
      1: "/Grids/Collection 1/1.webp",
      2: "/Grids/Collection 1/2.jpg", 
      3: "/Grids/Collection 1/3.webp",
      4: "/Grids/Collection 1/4.webp",
      5: "/Grids/Collection 1/5.webp",
      6: "/Grids/Collection 1/6.jpg"
    }
  },
  collection2: {
    name: "Collection 2", 
    images: {
      1: "/Grids/Collection 2/1.webp",
      2: "/Grids/Collection 2/2.webp",
      3: "/Grids/Collection 2/3.webp", 
      4: "/Grids/Collection 2/4.webp",
      5: "/Grids/Collection 2/5.webp",
      6: "/Grids/Collection 2/6.webp"
    }
  },
  collection3: {
    name: "Collection 3", 
    images: {
      1: "/Grids/Collection 3/1.webp",
      2: "/Grids/Collection 3/2.webp",
      3: "/Grids/Collection 3/3.webp", 
      4: "/Grids/Collection 3/4.webp",
      5: "/Grids/Collection 3/5.webp",
      6: "/Grids/Collection 3/6.webp"
    }
  },
  collection4: {
    name: "Collection 4", 
    images: {
      1: "/Grids/Collection 4/1.webp",
      2: "/Grids/Collection 4/2.webp",
      3: "/Grids/Collection 4/3.webp", 
      4: "/Grids/Collection 4/4.webp",
      5: "/Grids/Collection 4/5.webp",
      6: "/Grids/Collection 4/6.webp"
    }
  }
};

const GridLayout = () => {
  const [currentCollection, setCurrentCollection] = useState('collection1');
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const collectionKeys = ['collection1', 'collection2', 'collection3', 'collection4'];
    
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentCollection(prev => {
          const currentIndex = collectionKeys.indexOf(prev);
          const nextIndex = (currentIndex + 1) % collectionKeys.length;
          return collectionKeys[nextIndex];
        });
        setIsTransitioning(false);
      }, 50);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentImages = collections[currentCollection].images;

  const handleCollectionToggle = () => {
    const collectionKeys = ['collection1', 'collection2', 'collection3', 'collection4'];
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentCollection(prev => {
        const currentIndex = collectionKeys.indexOf(prev);
        const nextIndex = (currentIndex + 1) % collectionKeys.length;
        return collectionKeys[nextIndex];
      });
      setIsTransitioning(false);
    }, 50);
  };

  return (
    <div className="w-full p-4">
      <div className="grid grid-cols-2 row-col-5 md:grid-cols-4 grid-rows-5 md:grid-rows-3 gap-2 md:h-[1250px] lg:h-[1500px] xl:h-[1750px] 2xl:h-[2000px]">

        <div className="col-span-2 row-span-1 md:col-span-2 md:row-span-2">
          <div className="relative w-full h-full rounded-lg overflow-hidden">
            <motion.div
              key={`${currentCollection}-1`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={currentImages[1]}
                alt={`${collections[currentCollection].name} - Image 1`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
            </motion.div>

            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4">
              <p className="text-white text-center font-light leading-relaxed mb-2"
                style={{ fontSize: 'clamp(14px, 2vw, 18px)', fontFamily: 'Inter, sans-serif' }}>
                The New Wool Cruiser Collection
              </p>
              <p className="text-white text-center font-bold leading-tight mb-6"
                style={{ fontSize: 'clamp(24px, 4vw, 48px)', fontFamily: 'Inter, sans-serif' }}>
                Colors Of Expressions
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <button
                  className="text-[#212121] bg-[#FFFFFF] rounded-full hover:bg-[#212121] hover:text-[#FFFFFF] transition-colors duration-500 ease-in-out"
                  style={{ fontSize: 'clamp(11px, 1.5vw, 14px)', padding: 'clamp(6px, 1vw, 10px) clamp(12px, 2vw, 20px)' }}>
                  Shop Men
                </button>

                <button
                  className="text-[#212121] bg-[#FFFFFF] rounded-full hover:bg-[#212121] hover:text-[#FFFFFF] transition-colors duration-500 ease-in-out"
                  style={{ fontSize: 'clamp(11px, 1.5vw, 14px)', padding: 'clamp(6px, 1vw, 10px) clamp(12px, 2vw, 20px)' }}>
                  Shop Women
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-2 row-span-1 md:col-span-2 md:row-span-1">
          <div className="relative w-full h-full rounded-lg overflow-hidden">
            <motion.div
              key={`${currentCollection}-3`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={currentImages[3]}
                alt={`${collections[currentCollection].name} - Image 3`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
            </motion.div>

            <div className="absolute inset-0 flex items-center justify-center z-10 px-4">
              <p className="text-white text-center font-medium leading-relaxed"
                style={{ fontSize: 'clamp(12px, 1.8vw, 16px)', fontFamily: 'Inter, sans-serif' }}>
                Allbirds partnered with Pantone to curate an exclusive palette of five colors that celebrate self-expression.
              </p>
            </div>
          </div>
        </div>

        <div className="col-span-1 row-span-2 md:col-span-1 md:row-span-2">
          <div className="relative w-full h-full rounded-lg overflow-hidden">
            <motion.div
              key={`${currentCollection}-4`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={currentImages[4]}
                alt={`${collections[currentCollection].name} - Image 4`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 25vw, 16vw"
              />
            </motion.div>
          </div>
        </div>

        <div className="col-span-1 row-span-1 md:col-span-1 md:row-span-1">
          <div className="relative w-full h-full rounded-lg overflow-hidden">
            <motion.div
              key={`${currentCollection}-5`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={currentImages[5]}
                alt={`${collections[currentCollection].name} - Image 5`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 25vw, 16vw"
              />
            </motion.div>
          </div>
        </div>

        <div className="col-span-2 row-span-1 md:col-span-2 md:row-span-1">
          <div className="relative w-full h-full rounded-lg overflow-hidden">
            <motion.div
              key={`${currentCollection}-2`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={currentImages[2]}
                alt={`${collections[currentCollection].name} - Image 2`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </motion.div>
          </div>
        </div>

        <div className="col-span-1 row-span-1 md:col-span-1 md:row-span-1">
          <div className="relative w-full h-full rounded-lg overflow-hidden">
            <motion.div
              key={`${currentCollection}-6`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={currentImages[6]}
                alt={`${collections[currentCollection].name} - Image 6`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 25vw, 16vw"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default GridLayout;
