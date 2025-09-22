export const normalizeProduct = (p) => {
    if (!p) return null;

    const price = p.base_price ?? 0;
    const priceFormatted =
        typeof price === "number" ? `$${Number(price).toFixed(2)}` : String(price);

    const variants = Array.isArray(p.variants)
        ? p.variants.map((v) => ({
            id: v.id,
            color_name: v.color_name,
            hex_code: v.hex_code,
            price: v.price_override ?? price,
            sizes: (v.sizes || []).map((s) => ({
                id: s.id,
                label: s.size_label,   
                stock: s.stock,
            })),
            images: (v.images || []).map((im, idx) => ({
                url: im.image_url || im.image || im.url,
                alt: `${p.title || "Product"} - ${v.color_name} - ${idx + 1}`,
            })),
        }))
        : [];

    const normalized = {
        id: p.id || "",
        title: p.title || "",
        slug: p.slug || "",
        description: p.description || "",
        tagline: p.tagline || "Lightweight, bouncy, and wildly comfortable.",
        badge: p.badge || null,
        price,
        priceFormatted,
        category: p.category
            ? { id: p.category.id, name: p.category.name, slug: p.category.slug }
            : null,
        variants,
        colors: variants.map((v) => ({
            hex: v.hex_code,
            label: v.color_name,
        })),
        images: Array.isArray(p.images) ? p.images : [],
        mediaSections: (p.media_sections || []).map((sec) => ({
            type: sec.section_type,
            items: (sec.items || []).map((item) => ({
                type: item.item_type,
                url: item.image || item.video_url || null,
                text: item.text || "",
            })),
        })),
    };

    // Debug logging
    console.log('NormalizeProduct Debug:', {
        productTitle: p.title,
        variantsCount: variants.length,
        firstVariantImages: variants[0]?.images?.length,
        firstImageUrl: variants[0]?.images?.[0]?.url,
        normalizedVariants: normalized.variants.length,
        normalizedFirstVariantImages: normalized.variants[0]?.images?.length
    });

    return normalized;
};