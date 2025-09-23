import Image from 'next/image';

const GridLayout = () => {
  return (
    <div className="w-full p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-6 md:grid-rows-3 gap-2 h-auto md:h-[1400px]">

        <div className="col-span-2 row-span-2 md:col-span-2 md:row-span-2">
          <div className="relative w-full h-full rounded-lg overflow-hidden">
            <Image
              src="/Grids/Collection 1/1.webp"
              alt="Collection 1"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </div>

        <div className="col-span-2 row-span-1 md:col-span-2 md:row-span-1">
          <div className="relative w-full h-full rounded-lg overflow-hidden">
            <Image
              src="/Grids/Collection 1/3.webp"
              alt="Collection 3"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
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

        <div className="col-span-2 row-span-2 md:col-span-2 md:row-span-2">
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
    </div>
  );
};

export default GridLayout;
