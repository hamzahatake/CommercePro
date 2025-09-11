import React, { useEffect, useMemo, useState } from "react";

const tabsDef = [
  { key: "details", label: "The details" },
  { key: "materials", label: "Materials" },
  { key: "reviews", label: "Reviews" },
];

export default function DetailsTabs({ product }) {
  const initialKey = useMemo(() => (typeof window !== "undefined" && window.location.hash?.replace("#", "")) || "details", []);
  const [active, setActive] = useState(initialKey);

  useEffect(() => {
    function onHashChange() {
      const k = window.location.hash?.replace("#", "") || "details";
      setActive(k);
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const onTabClick = (key) => {
    setActive(key);
    if (typeof window !== "undefined") window.location.hash = key;
  };

  return (
    <div>
      <div role="tablist" aria-label="Product details" className="border-b flex gap-4">
        {tabsDef.map((t) => {
          const selected = active === t.key;
          return (
            <button
              key={t.key}
              role="tab"
              aria-selected={selected}
              aria-controls={`panel-${t.key}`}
              className={`px-3 py-2 text-sm ${selected ? "border-b-2 border-black" : "text-gray-600"}`}
              onClick={() => onTabClick(t.key)}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div id="panel-details" role="tabpanel" hidden={active !== "details"} className="pt-4">
        {(product.descriptionParagraphs || []).map((p, i) => (
          <p key={i} className="text-sm text-gray-700 leading-relaxed mb-3">{p}</p>
        ))}
        <h4 className="mt-4 font-semibold">Wash & Care</h4>
        <p className="text-sm text-gray-700">{product.washCare || "Machine-washable. Remove insoles & laces."}</p>
      </div>

      <div id="panel-materials" role="tabpanel" hidden={active !== "materials"} className="pt-4">
        <p className="text-sm text-gray-700">{product.materials || "TENCEL™ Lyocell upper, sugarcane SweetFoam™ midsole."}</p>
        <ul className="list-disc pl-5 mt-3 text-sm text-gray-600">
          <li>Low-impact materials</li>
          <li>Responsible sourcing</li>
        </ul>
      </div>

      <div id="panel-reviews" role="tabpanel" hidden={active !== "reviews"} className="pt-4">
        <div className="flex items-center gap-4">
          <div className="text-3xl font-bold">{product.rating}</div>
          <div className="text-sm">{product.reviewsCount} Reviews</div>
        </div>
        <div className="mt-3 flex gap-3 text-sm">
          <button className="px-3 py-1 border rounded-md" aria-label="Filter reviews with media">With media</button>
          <button className="px-3 py-1 border rounded-md" aria-label="Filter reviews verified buyers">Verified buyer</button>
        </div>
        <div className="mt-4 space-y-4">
          {(product.reviews || []).slice(0, 6).map((r, i) => (
            <div key={i} className="border rounded-md p-3">
              <div className="text-sm font-medium">{r.author} • {r.date}</div>
              <div className="text-sm">Rating: {r.rating}</div>
              <p className="text-sm text-gray-700 mt-1">{r.body}</p>
            </div>
          ))}
        </div>
        {product.reviews && product.reviews.length > 6 && (
          <button className="mt-4 px-4 py-2 border rounded-md">Load more reviews</button>
        )}
      </div>
    </div>
  );
}


