import CatalogCard from "../components/CatalogCard";
import { ProductsList } from "./ProductsListPage";
import VideoHero from "../components/VideoHero";
import CatalogGrid from "../components/CatalogGrid";

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
        <div className="w-full">
            <VideoHero />
            <CatalogGrid />
            <div className="px-4 mt-8 md:mt-10">
            <ProductsList />
            </div>
        </div>
    );
}
