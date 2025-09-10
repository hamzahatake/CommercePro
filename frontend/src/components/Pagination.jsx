import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages === 0) return null;

    // Determine page numbers to show (simple: show all pages for now)
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }

    return (
        <div className="flex justify-center items-center space-x-2 my-4">
            {/* Prev Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded border ${currentPage === 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
            >
                Prev
            </button>

            {/* Page Number Buttons */}
            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-3 py-1 rounded border ${page === currentPage
                            ? "bg-blue-500 text-white border-blue-500"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                >
                    {page}
                </button>
            ))}

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded border ${currentPage === totalPages
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
