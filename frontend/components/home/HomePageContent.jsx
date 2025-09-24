import VideoHero from "@/components/VideoHero";
import CatalogGrid from "@/components/catalog/CatalogGrid";
import HeroCarousel from "../HeroCarousel";
import GridLayout from "../GridLayout";
import ShoeCarousel from "../shoes/ShoeCarousel";

export default function HomePageContent() {
    return (
        <div className="w-full">
            <VideoHero className="top-0" />
            <CatalogGrid />
            <HeroCarousel />
            <GridLayout />
            <ShoeCarousel />
        </div>
    );
}
