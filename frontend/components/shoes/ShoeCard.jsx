'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setSelectedShoe } from '@/store/shoeSlice';

const ShoeCard = ({ shoe, onClick }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleClick = () => {
    // Update Redux state
    dispatch(setSelectedShoe({
      image: shoe.image,
      color: shoe.color,
      colorName: shoe.colorName,
      id: shoe.id,
      name: shoe.name,
      price: shoe.price
    }));

    // Navigate to product detail page
    router.push(`/products/${shoe.id}`);
  };

  return (
    <div 
      className="flex-shrink-0 w-64 h-80 rounded-2xl cursor-pointer transition-transform duration-300 hover:scale-105"
      style={{ backgroundColor: shoe.color }}
      onClick={handleClick}
    >
      <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
        {/* Shoe Image */}
        <div className="relative w-full h-3/4 flex items-center justify-center">
          <Image
            src={shoe.image}
            alt={shoe.name}
            width={200}
            height={200}
            className="object-contain"
            sizes="(max-width: 768px) 200px, 250px"
          />
        </div>
        
        {/* Color Name */}
        <div className="absolute bottom-4 left-4">
          <p className="text-sm font-light text-gray-700 opacity-80">
            {shoe.colorName}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShoeCard;

