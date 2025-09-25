"use client";

import { useState, useEffect } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Filter, X, SlidersHorizontal } from "lucide-react";
import { useQueryParams } from "@/utils/useQueryParams";

export default function FilterPanel({ productCount = 0 }) {
  const [query, setQuery] = useQueryParams();
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeSort, setActiveSort] = useState("Featured");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);

  const sortOptions = [
    { value: "", label: "Featured" },
    { value: "price", label: "Price: Low → High" },
    { value: "-price", label: "Price: High → Low" },
    { value: "-created_at", label: "New Arrivals" },
    { value: "-rating", label: "Best Rated" },
    { value: "title", label: "Name: A → Z" },
    { value: "-title", label: "Name: Z → A" },
  ];

  const categories = [
    "Sneakers", "Running", "Casual", "Formal", "Sports", "Lifestyle"
  ];

  const colors = [
    "Black", "White", "Gray", "Blue", "Red", "Green", "Brown", "Beige"
  ];

  const sizes = [
    "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"
  ];

  // Initialize state from URL params
  useEffect(() => {
    if (query.ordering) {
      const sortOption = sortOptions.find(opt => opt.value === query.ordering);
      if (sortOption) {
        setActiveSort(sortOption.label);
      }
    }
    if (query.price_min) setPriceRange(prev => ({ ...prev, min: query.price_min }));
    if (query.price_max) setPriceRange(prev => ({ ...prev, max: query.price_max }));
    if (query.category) setSelectedCategories([query.category]);
  }, [query]);

  const handleSortChange = (option) => {
    setActiveSort(option.label);
    setSortOpen(false);
    setQuery({ ordering: option.value, page: 1 });
  };

  const handlePriceFilter = () => {
    // Since backend doesn't support price filtering, we'll filter on frontend
    // For now, just trigger a re-render by updating a dummy parameter
    setQuery({ page: 1, price_filter: `${priceRange.min || 0}-${priceRange.max || 999999}` });
  };

  const handleCategoryFilter = (category) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    
    setSelectedCategories(newCategories);
    // Convert category name to slug format (lowercase, replace spaces with hyphens)
    const categorySlug = newCategories.length > 0 ? newCategories[0].toLowerCase().replace(/\s+/g, '-') : null;
    setQuery({ 
      category: categorySlug, 
      page: 1 
    });
  };

  const clearFilters = () => {
    setPriceRange({ min: "", max: "" });
    setSelectedCategories([]);
    setSelectedColors([]);
    setSelectedSizes([]);
    setActiveSort("Featured");
    setQuery({ 
      ordering: null, 
      category: null, 
      price_filter: null,
      color: null,
      size: null,
      page: 1 
    });
  };

  const hasActiveFilters = priceRange.min || priceRange.max || selectedCategories.length > 0 || selectedColors.length > 0 || selectedSizes.length > 0;

  return (
    <div className="w-full mx-auto space-y-4">
      {/* Main Filter Bar */}
      <div className="flex justify-between items-center rounded-full bg-white text-neutral-900 border border-neutral-200 shadow-[0_1px_2px_#0000000a,0_2px_8px_-2px_#00000014] px-4 md:px-6 py-2 md:py-3">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          <SlidersHorizontal className="w-5 h-5 text-neutral-600" />
          <p className="text-xs md:text-sm leading-none">
            <span className="font-semibold">Filters</span>
            <span className="text-neutral-500 ml-1">({productCount} products)</span>
            {hasActiveFilters && (
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                {[priceRange.min && 'Price', selectedCategories.length > 0 && 'Category', selectedColors.length > 0 && 'Color', selectedSizes.length > 0 && 'Size'].filter(Boolean).length} active
              </span>
            )}
          </p>
        </div>

        {/* Right Section: Controls */}
        <div className="flex items-center gap-2">
          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-full transition"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}

          {/* Filter Toggle */}
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-3 md:px-4 py-1.5 text-xs md:text-sm font-medium hover:bg-neutral-50 transition"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center justify-between gap-2 rounded-full border border-neutral-300 bg-white px-3 md:px-4 py-1.5 text-xs md:text-sm font-medium hover:bg-neutral-50 transition"
            >
              <span>{activeSort}</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            <AnimatePresence>
              {sortOpen && (
                <Motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="absolute right-0 mt-2 w-48 rounded-lg bg-white text-neutral-900 border border-neutral-200 shadow-xl overflow-hidden z-20"
                >
                  {sortOptions.map((option) => (
                    <li
                      key={option.value}
                      onClick={() => handleSortChange(option)}
                      className="px-4 py-2 text-sm hover:bg-neutral-50 cursor-pointer"
                    >
                      {option.label}
                    </li>
                  ))}
                </Motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Expanded Filter Panel */}
      <AnimatePresence>
        {filterOpen && (
          <Motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-white rounded-2xl border border-neutral-200 shadow-lg p-6 space-y-6"
          >
            {/* Price Range */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-3">Price Range</h3>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  className="w-24 px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="text-neutral-500">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  className="w-24 px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handlePriceFilter}
                  className="px-4 py-2 bg-[#ECE9E2] text-[#000000] text-sm rounded-lg hover:bg-[#d9d5ca] transition"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-3">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryFilter(category)}
                    className={`px-3 py-1.5 text-xs rounded-full border transition ${
                      selectedCategories.includes(category)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-neutral-700 border-neutral-300 hover:border-blue-300'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-3">Colors</h3>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      const newColors = selectedColors.includes(color)
                        ? selectedColors.filter(c => c !== color)
                        : [...selectedColors, color];
                      setSelectedColors(newColors);
                      setQuery({ 
                        color: newColors.length > 0 ? newColors : null, 
                        page: 1 
                      });
                    }}
                    className={`px-3 py-1.5 text-xs rounded-full border transition ${
                      selectedColors.includes(color)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-neutral-700 border-neutral-300 hover:border-blue-300'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-3">Sizes</h3>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      const newSizes = selectedSizes.includes(size)
                        ? selectedSizes.filter(s => s !== size)
                        : [...selectedSizes, size];
                      setSelectedSizes(newSizes);
                      setQuery({ 
                        size: newSizes.length > 0 ? newSizes : null, 
                        page: 1 
                      });
                    }}
                    className={`w-10 h-10 text-xs rounded-lg border transition flex items-center justify-center ${
                      selectedSizes.includes(size)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-neutral-700 border-neutral-300 hover:border-blue-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
