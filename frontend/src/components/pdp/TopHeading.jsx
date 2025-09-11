import React from "react";

export default function TopHeading({ title, blurb }) {
  return (
    <div className="mb-4">
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">{title}</h1>
      {blurb && <p className="text-sm text-gray-600 max-w-2xl">{blurb}</p>}
    </div>
  );
}


