export const designTokens = {
  colors: {
    backgroundPage: "#EDEAE4",
    backgroundSurface: "#FFFFFF",
    textPrimary: "#1A1A1A",
    textSecondary: "#555555",
    accent: "#000000",
    muted: "#888888",
    link: "#000000",
    linkHover: "#1A1A1A",
    border: "#D6D6D6"
  },
  typography: {
    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
    weights: { regular: 400, medium: 500, semibold: 600, bold: 700 },
    sizesPx: { xs: 12, sm: 14, md: 16, lg: 20, xl: 28, xxl: 36 }
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radii: { sm: 6, md: 12, pill: 9999 },
  elevation: {
    none: "none",
    sm: "0 1px 3px rgba(0,0,0,0.1)",
    md: "0 4px 12px rgba(0,0,0,0.15)"
  }
};

export const referenceData = {
  genderTabs: { items: ["MENS", "WOMENS"], active: "MENS" },
  title: "Men's Wool Cruiser",
  price: "$100",
  description: "Lightweight comfort and classic style crafted with recycled Italian felt wool.",
  filterTabs: { items: ["ALL", "LIMITED", "CLASSIC"], active: "ALL" },
  colorSwatches: [
    { id: "burgundy", color: "#6C1C1C", selected: true },
    { id: "red", color: "#B23B3B" },
    { id: "peach", color: "#E8B9A8" },
    { id: "gold", color: "#D8A546" },
    { id: "olive", color: "#8A8B5C" },
    { id: "forest", color: "#556B40" },
    { id: "navy", color: "#3D506F" },
    { id: "charcoal", color: "#444444" }
  ],
  selectedColorLabel: "Burgundy (Natural White Sole)",
  size: "Size (10.5)",
  supportLinks: ["Free Shipping On Orders Over $75.", "Easy Returns"]
};



