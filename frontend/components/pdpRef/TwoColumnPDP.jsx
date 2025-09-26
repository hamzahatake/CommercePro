"use client";

import React, { useState } from "react";
import { designTokens, referenceData } from "./Tokens";

function TabGroup({ items, active, onChange, underline = true, smallCaps = true }) {
  return (
    <div className="flex gap-6 border-b border-transparent">
      {items.map((label) => {
        const isActive = label === active;
        return (
          <button
            key={label}
            type="button"
            onClick={() => onChange(label)}
            className={`pb-1 ${smallCaps ? "uppercase tracking-wider" : ""} text-[14px] font-medium`}
            style={{
              borderBottom: underline && isActive ? `2px solid ${designTokens.colors.accent}` : "2px solid transparent",
              color: designTokens.colors.textPrimary
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

function Swatch({ color, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-8 h-8 rounded-full border border-black transition-colors"
      style={{
        backgroundColor: color,
        outline: selected ? `2px solid ${designTokens.colors.accent}` : "none",
        outlineOffset: 2
      }}
      onMouseEnter={() => {}}
    />
  );
}

function SizeDropdown({ value, onFocus, onBlur }) {
  return (
    <button
      type="button"
      className="px-4 py-2 rounded-full text-sm"
      style={{
        border: `1px solid ${designTokens.colors.accent}`,
        color: designTokens.colors.textPrimary
      }}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {value}
    </button>
  );
}

function AddToCartButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-6 py-2 rounded-full font-bold text-white transition-opacity"
      style={{ backgroundColor: designTokens.colors.accent }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = 0.9)}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = 1)}
    >
      ADD TO CART
    </button>
  );
}

export default function TwoColumnPDP() {
  const [gender, setGender] = useState(referenceData.genderTabs.active);
  const [activeFilter, setActiveFilter] = useState(referenceData.filterTabs.active);
  const [swatches, setSwatches] = useState(referenceData.colorSwatches);
  const [sizeFocused, setSizeFocused] = useState(false);

  const selectedColor = swatches.find((s) => s.selected) || swatches[0];

  return (
    <div
      className="w-full"
      style={{
        fontFamily: designTokens.typography.fontFamily,
        backgroundColor: designTokens.colors.backgroundPage
      }}
    >
      <div className="max-w-[1850px] mx-auto px-10 py-6 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left: product info */}
        <div>
          <TabGroup items={referenceData.genderTabs.items} active={gender} onChange={setGender} />

          <div className="mt-4 flex items-baseline gap-3">
            <h1 className="text-[36px] font-normal" style={{ color: designTokens.colors.textPrimary }}>{referenceData.title}</h1>
            <span className="text-[28px] font-medium" style={{ color: designTokens.colors.textPrimary }}>{referenceData.price}</span>
          </div>

          <p className="mt-4 text-[16px]" style={{ color: designTokens.colors.textSecondary }}>
            {referenceData.description}
          </p>
        </div>

        {/* Right: options */}
        <div>
          <TabGroup items={referenceData.filterTabs.items} active={activeFilter} onChange={setActiveFilter} />

          <div className="mt-6 flex flex-wrap gap-3 items-center">
            {swatches.map((s) => (
              <Swatch
                key={s.id}
                color={s.color}
                selected={!!s.selected}
                onClick={() =>
                  setSwatches((prev) => prev.map((p) => ({ ...p, selected: p.id === s.id })))}
              />
            ))}
          </div>

          <div className="mt-2 text-sm" style={{ color: designTokens.colors.textPrimary }}>
            {referenceData.selectedColorLabel}
          </div>

          <div className="mt-6 flex items-center gap-4">
            <div style={{ outline: sizeFocused ? `2px solid ${designTokens.colors.accent}` : "none", borderRadius: 9999 }}>
              <SizeDropdown
                value={referenceData.size}
                onFocus={() => setSizeFocused(true)}
                onBlur={() => setSizeFocused(false)}
              />
            </div>
            <AddToCartButton onClick={() => {}} />
          </div>

          <div className="mt-4 text-[12px] flex items-center gap-2" style={{ color: designTokens.colors.textSecondary }}>
            <span>{referenceData.supportLinks[0]}</span>
            <span>•</span>
            <span>{referenceData.supportLinks[1]}</span>
          </div>
        </div>
      </div>
    </div>
  );
}



