import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetProductDetailQuery } from "../features/products/productApi";
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
  // Hooks must be called unconditionally on every render
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const normalized = normalizeProduct(product || {});
  const activeVariant = normalized.variants[selectedVariantIdx] || normalized.variants[0] || { images: [] };
  const variantImages = useMemo(() => (activeVariant.images || []), [activeVariant]);

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
              selectedVariantIdx={selectedVariantIdx}
              onVariantChange={setSelectedVariantIdx}
            />
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

function normalizeProduct(p) {
  const price = p.price ?? p.base_price ?? 0;
  const priceFormatted = p.priceFormatted ?? (typeof price === "number" ? `$${Number(price).toFixed(0)}` : String(price));
  const images = Array.isArray(p.images)
    ? p.images
    : [];
  const variants = Array.isArray(p.variants)
    ? p.variants.map((v) => ({
        id: v.id,
        color_name: v.color_name,
        hex_code: v.hex_code,
        sizes: v.sizes || [],
        images: (v.images || []).map((im, idx) => ({ url: im.image_url || im.url, alt: `${p.title || "Product"} - ${v.color_name} - ${idx + 1}` })),
      }))
    : [];
  return {
    id: p.id || p.slug || "",
    title: p.title || "",
    tagline: p.tagline || "Lightweight, bouncy, and wildly comfortable.",
    price,
    priceFormatted,
    salePrice: p.salePrice ?? null,
    rating: p.rating ?? 4.3,
    reviewsCount: p.reviewsCount ?? p.reviews_count ?? 0,
    images,
    colors: (p.variants || []).map((v) => ({ hex: v.hex_code, label: v.color_name })),
    sizes: [],
    variants,
    descriptionParagraphs: p.descriptionParagraphs || (p.description ? [p.description] : []),
    materials: p.materials || "",
    ratingDistribution: p.ratingDistribution || {},
    reviews: p.reviews || [],
    isBestseller: !!p.isBestseller,
    isLimited: !!p.isLimited,
    relatedProducts: p.related_products || [],
  };
}
