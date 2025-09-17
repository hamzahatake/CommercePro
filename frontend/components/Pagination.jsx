"use client";

import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages === 0) return null;

    // Determine page numbers to show (simple: show all pages for now)
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }

    return (
        <div className="flex justify-center items-center gap-4 my-6 text-neutral-200">
            {/* Prev */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
                className={`px-2 py-1 rounded transition-colors ${currentPage === 1 ? "opacity-40 cursor-not-allowed" : "hover:text-white"}`}
            >
                ‹
            </button>

            {/* Pages */}
            <div className="flex items-center gap-6">
                {pages.map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        aria-current={page === currentPage ? "page" : undefined}
                        className={`${page === currentPage
                                ? "px-2.5 py-1.5 rounded-md bg-neutral-800 text-white shadow-[0_0_0_1px_#ffffff12_inset]"
                                : "hover:text-white"
                            }`}
                    >
                        {page}
                    </button>
                ))}
            </div>

            {/* Next */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
                className={`px-2 py-1 rounded transition-colors ${currentPage === totalPages ? "opacity-40 cursor-not-allowed" : "hover:text-white"}`}
            >
                ›
            </button>
        </div>
    );
};

export default Pagination;
