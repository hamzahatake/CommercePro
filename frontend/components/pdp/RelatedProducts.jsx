import React from "react";
import ProductCard from "../../components/ProductCard";

export default function RelatedProducts({ relatedProducts = [] }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">You may also like</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
        {relatedProducts.slice(0, 10).map((p, idx) => (
          <div key={(p?.id || idx) + "-rel"}>
            {p && <ProductCard product={p} />}
          </div>
        ))}
      </div>
    </section>
  );
}


