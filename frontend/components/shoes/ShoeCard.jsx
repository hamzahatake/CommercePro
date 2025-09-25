'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setSelectedShoe } from '@/store/shoeSlice';

const ShoeCard = ({ product, onClick }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const firstVariant = product?.variants?.[0];
  const firstImage = firstVariant?.images?.[0];
  const firstColor = firstVariant?.hex_code || '#f0f0f0';
  const colorName = firstVariant?.color_name || 'Default';
  const displayPrice = firstVariant?.price || product?.price || 0;

  const handleClick = () => {
    // Update Redux state with normalized product data
    dispatch(setSelectedShoe({
      id: product.id,
      title: product.title,
      slug: product.slug,
      price: displayPrice,
      color: firstColor,
      colorName: colorName,
      image: firstImage?.url,
      variant: firstVariant
    }));

    // Navigate to product detail page
    router.push(`/products/${product.slug || product.id}`);
  };

  return (
    <div 
      className="flex-shrink-0 w-[450px] rounded-2xl cursor-pointer"
      style={{ backgroundColor: firstColor }}
      onClick={handleClick}
    >
      <div className="relative w-full spect-[4/3] flex flex-col items-center justify-center p-4">
        {/* Shoe Image */}
        <div className="relative w-[450px] h-full flex items-center justify-center">
          {firstImage?.url ? (
            <Image
              src={firstImage.url}
              alt={firstImage.alt || product.title }
              width={200}
              height={200}
              className="object-contain w-full"
              sizes="(max-width: 768px) 200px, 250px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>
        
        {/* Color Name */}
        <div className="absolute bottom-4 left-4">
          <p className="text-sm font-semibold text-[#FFFFFF] opacity-80">
            {colorName}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShoeCard;


