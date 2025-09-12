import React from "react";
import CatalogCard from "./CatalogCard";
import BestSeller from "../../public/Catalog/BestSellers.webp";
import Mens from "../../public/Catalog/Mens.webp";
import Women from "../../public/Catalog/Women.webp";
import Cruiser from "../../public/Catalog/Cruiser.webp";

const catalogs = [
  { image: BestSeller, alt: "Best Seller" },
  { image: Mens, alt: "Mens" },
  { image: Women, alt: "Women" },
  { image: Cruiser, alt: "Cruiser" },
];

export default function CatalogGrid() {
  return (
    <section className="w-fit mt-4 md:mt-4">
      {/* Desktop */}
      <div className="hidden md:grid grid-cols-4 gap-3 mx-2">
        {catalogs.map((item, i) => (
          <CatalogCard key={i} image={item.image} alt={item.alt} />
        ))}
      </div>

      {/* Mobile */}
      <div className="flex md:hidden overflow-x-auto no-scrollbar px-4">
        {catalogs.map((item, i) => (
          <div key={i} className="flex-shrink-0 w-[80%]">
            <CatalogCard image={item.image} alt={item.alt} />
          </div>
        ))}
      </div>
    </section>
  );
}


