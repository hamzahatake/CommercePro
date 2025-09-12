import { ProductsList } from "./ProductsListPage";
import VideoHero from "../components/VideoHero";
import CatalogGrid from "../components/CatalogGrid";

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
