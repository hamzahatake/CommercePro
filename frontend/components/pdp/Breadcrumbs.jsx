import React from "react";

export default function Breadcrumbs({ breadcrumbs = [] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-gray-600 mb-4">
      <ol className="flex gap-2">
        {breadcrumbs.map((item, idx) => (
          <li key={idx} className="flex items-center">
            <span>{item}</span>
            {idx < breadcrumbs.length - 1 && <span className="mx-2" aria-hidden>›</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}


