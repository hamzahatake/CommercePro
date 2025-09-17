"use client";

import { useMemo, useState } from "react";
import { useGetProductDetailQuery } from "@/features/api/apiSlice";
import Breadcrumbs from "@/components/pdp/Breadcrumbs";
import TopHeading from "@/components/pdp/TopHeading";
import InfoColumn from "@/components/pdp/InfoColumn";
import DetailsTabs from "@/components/pdp/DetailsTabs";
import RelatedProducts from "@/components/pdp/RelatedProducts";
import FooterCTAs from "@/components/pdp/FooterCTAs";
import ImageCarousel from "@/components/pdp/ImageCarousel";

export default function ProductDetailPage({ params }) {
    const { id } = params;
    const { data: product, isLoading, error } = useGetProductDetailQuery({ slug: id });
    const [variantIndex, setVariantIndex] = useState(0);
    const [imageIndex, setImageIndex] = useState(0);
    const normalized = product || { variants: [] };
    const currentVariant = normalized.variants[variantIndex] || normalized.variants[0] || { images: [] }; // Finds the current index of variant || Selects first Index || Shows an Image
    const variantImages = useMemo(() => (
        currentVariant.images || []), [currentVariant]); // We can also render it directly using activeVariant.Image but Image component re-renders often, useMemo avoids recalculating the images array reference

    return (
        <div className="max-w-full">
            {isLoading && (
                <div className="text-gray-500">Loading…</div>
            )}
            {!isLoading && (error || !product) && (
                <div className="text-red-500">Product not found.</div>
            )}
            {!isLoading && !error && product && (
                <>
                    {/* Full-width carousel at the top */}
                    <div className="w-full">
                        <ImageCarousel
                            images={variantImages}
                            title={normalized.title}
                            activeIndex={imageIndex}
                            setActiveIndex={setImageIndex}
                        />
                    </div>

                    <div className="px-6 md:px-6 lg:px-6 xl:px-6 2xl:px-6 max-w-[1850px] mx-auto">
                        <Breadcrumbs breadcrumbs={["Home", "Men", normalized.title]} />

                        <TopHeading title={normalized.title} blurb={normalized.tagline} />

                        {/* Details below */}
                        <div className="grid gap-[32px]">
                            <InfoColumn
                                product={normalized}
                                variants={normalized.variants}
                                variantIndex={variantIndex}
                                onVariantChange={(idx) => {
                                    setVariantIndex(idx);
                                    setImageIndex(0);
                                }} />
                        </div>

                        <div className="mt-8">
                            <DetailsTabs product={normalized} />
                        </div>

                        <div className="mt-8">
                            <RelatedProducts relatedProducts={normalized.relatedProducts || []} />
                        </div>

                        <div className="mt-8">
                            <FooterCTAs />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}