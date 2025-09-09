import React from "react";
import CatalogCard from "../components/CatalogCard";
import ProductCard from "../components/ProductCard";

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

export function Home() {
    return (
        <div className="w-full px-4">
            {/* Desktop: 4-grid */}
            <div className="hidden md:grid grid-cols-4 gap-3">
                {catalogs.map((item, i) => (
                    <CatalogCard key={i} image={item.image} alt={item.alt} />
                ))}
            </div>

            {/* Mobile: horizontal scroll */}
            <div className="flex md:hidden gap-3 overflow-x-auto no-scrollbar">
                {catalogs.map((item, i) => (
                    <CatalogCard key={i} image={item.image} alt={item.alt} />
                ))}
            </div>

            {/* Example ProductCard section */}
            <div className="mt-8">
                <ProductCard />
            </div>
        </div>
    );
}
