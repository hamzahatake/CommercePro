import { ProductsList } from "./ProductsListPage";
import VideoHero from "../components/VideoHero";
import CatalogGrid from "../components/CatalogGrid";

export function Home() {
    return (
        <div className="w-full">
            <VideoHero />
            <CatalogGrid />
        </div>
    );
}
