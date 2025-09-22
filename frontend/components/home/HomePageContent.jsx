import VideoHero from "@/components/VideoHero";
import CatalogGrid from "@/components/catalog/CatalogGrid";

export default function HomePageContent() {
    return (
        <div className="w-full">
            <VideoHero className="top-0"/>
            <CatalogGrid />
        </div>
    );
}
