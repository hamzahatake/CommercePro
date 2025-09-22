"use client";

import CatalogCard from "@/components/catalog/CatalogCard";

const catalogs = [
  { image: "/Catalog/BestSellers.webp", alt: "Best Sellers Collection" },
  { image: "/Catalog/Mens.webp", alt: "Men’s Collection" },
  { image: "/Catalog/Women.webp", alt: "Women’s Collection" },
  { image: "/Catalog/Cruiser.webp", alt: "Cruiser Collection" },
];

export default function CatalogGrid() {
  return (
    <section className="w-full mt-4">
      {/* Desktop */}
      <div className="hidden md:grid grid-cols-4 gap-3 mx-2">
        {catalogs.map(item => (
          <CatalogCard key={item.alt} image={item.image} alt={item.alt} />
        ))}
      </div>

      {/* Mobile */}
      <div className="flex md:hidden overflow-x-auto no-scrollbar px-4 gap-3">
        {catalogs.map(item => (
          <CatalogCard key={item.alt} image={item.image} alt={item.alt} />
        ))}
      </div>
    </section>
  );
}
