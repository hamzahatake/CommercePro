import Image from 'next/image';

const GridLayout = () => {
  return (
    <div className="w-full p-4">
      <div className="grid grid-cols-2 row-col-5 md:grid-cols-4 grid-rows-5 md:grid-rows-3 gap-2 md:h-[1250px] lg:h-[1500px] xl:h-[1750px] 2xl:h-[2000px]">

        <div className="col-span-2 row-span-1 md:col-span-2 md:row-span-2">
          <div className="relative w-full h-full rounded-lg overflow-hidden">
            <Image
              src="/Grids/Collection 1/1.webp"
              alt="Collection 1"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />

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
            <Image
              src="/Grids/Collection 1/3.webp"
              alt="Collection 3"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />

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
            <Image
              src="/Grids/Collection 1/4.webp"
              alt="Collection 4"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 25vw, 16vw"
            />
          </div>
        </div>

        <div className="col-span-1 row-span-1 md:col-span-1 md:row-span-1">
          <div className="relative w-full h-full rounded-lg overflow-hidden">
            <Image
              src="/Grids/Collection 1/5.webp"
              alt="Collection 5"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 25vw, 16vw"
            />
          </div>
        </div>

        <div className="col-span-2 row-span-1 md:col-span-2 md:row-span-1">
          <div className="relative w-full h-full rounded-lg overflow-hidden">
            <Image
              src="/Grids/Collection 1/2.jpg"
              alt="Collection 2"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </div>

        <div className="col-span-1 row-span-1 md:col-span-1 md:row-span-1">
          <div className="relative w-full h-full rounded-lg overflow-hidden">
            <Image
              src="/Grids/Collection 1/6.jpg"
              alt="Collection 6"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 25vw, 16vw"
            />
          </div>
        </div>
      </div>
    </div >
  );
};

export default GridLayout;
