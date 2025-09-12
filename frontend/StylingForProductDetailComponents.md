JSON:

{
  "meta": {
    "source_image": "Screenshot 2025-09-12 195950.png",
    "viewport": { "width": 1899, "height": 283 },
    "density": 1
  },

  "tokens": {
    "colors": {
      "backgroundPage": "#EDEAE4",
      "backgroundSurface": "#FFFFFF",
      "textPrimary": "#1A1A1A",
      "textSecondary": "#555555",
      "accent": "#000000",
      "muted": "#888888",
      "link": "#000000",
      "linkHover": "#1A1A1A",
      "border": "#D6D6D6"
    },
    "typography": {
      "fontFamily": "'Inter', 'Helvetica Neue', Arial, sans-serif",
      "weights": { "regular": 400, "medium": 500, "semibold": 600, "bold": 700 },
      "sizesPx": { "xs": 12, "sm": 14, "md": 16, "lg": 20, "xl": 28, "xxl": 36 }
    },
    "spacing": { "xs": 4, "sm": 8, "md": 16, "lg": 24, "xl": 32 },
    "radii": { "sm": 6, "md": 12, "pill": 9999 },
    "elevation": {
      "none": "none",
      "sm": "0 1px 3px rgba(0,0,0,0.1)",
      "md": "0 4px 12px rgba(0,0,0,0.15)"
    }
  },

  "layout": {
    "page": {
      "type": "two-column",
      "columns": [0.5, 0.5],
      "gutter": 40,
      "padding": { "top": 24, "right": 40, "bottom": 24, "left": 40 }
    }
  },

  "sections": [
    {
      "id": "product-info",
      "type": "left-column",
      "bounds": { "x": 40, "y": 24, "w": 800, "h": 200 },
      "children": ["gender-tabs", "title", "price", "description"]
    },
    {
      "id": "product-options",
      "type": "right-column",
      "bounds": { "x": 940, "y": 24, "w": 900, "h": 200 },
      "children": ["filter-tabs", "color-swatches", "selected-color-label", "size-dropdown", "cta-add-to-cart", "support-links"]
    }
  ],

  "components": [
    {
      "id": "gender-tabs",
      "type": "tab-group",
      "items": ["MENS", "WOMENS"],
      "active": "MENS",
      "style": { "fontSize": "sm", "letterSpacing": "0.05em", "borderBottom": "2px solid #000" }
    },
    {
      "id": "title",
      "type": "heading",
      "content": "Men's Wool Cruiser",
      "style": { "fontSize": "xxl", "fontWeight": "regular", "color": "textPrimary" }
    },
    {
      "id": "price",
      "type": "text",
      "content": "$100",
      "style": { "fontSize": "xl", "fontWeight": "medium", "marginLeft": "sm" }
    },
    {
      "id": "description",
      "type": "text",
      "content": "Lightweight comfort and classic style crafted with recycled Italian felt wool.",
      "style": { "fontSize": "md", "color": "textSecondary", "marginTop": "sm" }
    },
    {
      "id": "filter-tabs",
      "type": "tab-group",
      "items": ["ALL", "LIMITED", "CLASSIC"],
      "active": "ALL",
      "style": { "fontSize": "sm", "fontWeight": "medium", "gap": "md" }
    },
    {
      "id": "color-swatches",
      "type": "swatch-selector",
      "items": [
        { "id": "burgundy", "color": "#6C1C1C", "selected": true },
        { "id": "red", "color": "#B23B3B" },
        { "id": "peach", "color": "#E8B9A8" },
        { "id": "gold", "color": "#D8A546" },
        { "id": "olive", "color": "#8A8B5C" },
        { "id": "forest", "color": "#556B40" },
        { "id": "navy", "color": "#3D506F" },
        { "id": "charcoal", "color": "#444444" }
      ],
      "style": { "shape": "circle", "border": "1px solid #000", "size": 32 }
    },
    {
      "id": "selected-color-label",
      "type": "text",
      "content": "Burgundy (Natural White Sole)",
      "style": { "fontSize": "sm", "marginTop": "sm" }
    },
    {
      "id": "size-dropdown",
      "type": "dropdown",
      "content": "Size (10.5)",
      "style": { "padding": "sm md", "border": "1px solid #000", "borderRadius": "pill" }
    },
    {
      "id": "cta-add-to-cart",
      "type": "button",
      "content": "ADD TO CART",
      "style": {
        "background": "accent",
        "textColor": "#FFF",
        "borderRadius": "pill",
        "fontWeight": "bold",
        "padding": "sm lg"
      }
    },
    {
      "id": "support-links",
      "type": "text-inline",
      "content": ["Free Shipping On Orders Over $75.", "Easy Returns"],
      "separator": "•",
      "style": { "fontSize": "xs", "color": "textSecondary", "marginTop": "sm" }
    }
  ],

  "interactions": {
    "hover": [
      { "target": "color-swatches", "changes": { "outline": "2px solid #000" } },
      { "target": "cta-add-to-cart", "changes": { "opacity": 0.9 } }
    ],
    "active": [
      { "target": "tab-group", "changes": { "borderBottom": "2px solid #000" } }
    ],
    "focus": [
      { "target": "size-dropdown", "changes": { "outline": "2px solid #000" } }
    ]
  }
}





Description:

Background & Layout
Content is split into two horizontal sections:

Left: product information (category tabs, product name, price, description).

Right: customization options (filters, swatches, sizes, add-to-cart).

Top Navigation (Gender Tabs)
“MENS” and “WOMENS” act as toggle tabs. The active tab (“MENS”) is underlined with a black line. Small, uppercase, and slightly spaced-out typography.

Product Title & Price
Title “Men’s Wool Cruiser” is large serif/sans font, normal weight. The price $100 sits inline, slightly smaller, medium weight. They form one cohesive line.

Description
Below the title/price, smaller gray text describes the product. It has generous spacing and low emphasis.

Filter Tabs (All, Limited, Classic)
Right side has category filters styled like tabs. “ALL” is active with underline. Typography is small caps/medium weight.

Color Swatches
A horizontal row of circular swatches (about 32px). Active swatch has a black ring around it. Beneath, the selected color label shows the name (“Burgundy (Natural White Sole)”).

Size & Add-to-Cart Section
Below, a wide horizontal bar contains two elements:

A pill-shaped dropdown with black border for selecting size.

A bold black “ADD TO CART” button, pill-shaped, white text, high contrast.

Support Links
Underneath, small muted text: “Free Shipping On Orders Over $75.” and “Easy Returns” separated by a dot.

Interactions

Hover over swatches → outline darkens.

Hover over “Add to Cart” → slight opacity change.

Tabs underline on active.

Size dropdown highlights on focus.

Overall, the design is minimal, structured, with strong emphasis on product details and conversion (Add to Cart).