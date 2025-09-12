import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetProductDetailQuery } from "../features/products/productApi";
import { normalizeProduct } from "../features/products/productNormalization";
import Breadcrumbs from "../components/pdp/Breadcrumbs";
import TopHeading from "../components/pdp/TopHeading";
import GalleryColumn from "../components/pdp/GalleryColumn";
import InfoColumn from "../components/pdp/InfoColumn";
import DetailsTabs from "../components/pdp/DetailsTabs";
import RelatedProducts from "../components/pdp/RelatedProducts";
import FooterCTAs from "../components/pdp/FooterCTAs";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { data: product, isLoading, error } = useGetProductDetailQuery({ slug });
  const [variantIndex, setVariantIndex] = useState(0);

  const normalized = normalizeProduct(product || {});
  const currentVariant = normalized.variants[variantIndex] || normalized.variants[0] || { images: [] }; // Finds the current index of variant || Selects first Index || Shows an Image
  const variantImages = useMemo(() => (
    currentVariant.images || []), [currentVariant]);

  return (
    <div className="max-w-[1200px] mx-auto px-8 py-8">
      {isLoading && (
        <div className="text-gray-500">Loading…</div>
      )}
      {!isLoading && (error || !product) && (
        <div className="text-red-500">Product not found.</div>
      )}
      {!isLoading && !error && product && (
        <>
          <Breadcrumbs breadcrumbs={["Home", "Men", normalized.title]} />

          <TopHeading title={normalized.title} blurb={normalized.tagline} />

          <div className="grid gap-[32px] lg:grid-cols-[1fr_420px]">
            <GalleryColumn images={variantImages} title={normalized.title} />
            <InfoColumn
              product={normalized}
              variants={normalized.variants}
              variantIndex={variantIndex}
              onVariantChange={setVariantIndex} />
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
        </>
      )}
    </div>
  );
}