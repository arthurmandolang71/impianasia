/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./public/**/*.html", "./public/**/*.js"],
  theme: {
    extend: {
      colors: {
        // ── Refined dark palette ────────────────────────────────────────────
        // Neutral navy backgrounds (deeper, less saturated than before)
        "surface": "#0A1422",            // page background
        "surface-dim": "#070F1A",        // deepest (footer, contrast bands)
        "surface-card": "#0F1B2D",       // solid card surface
        "surface-raised": "#142336",     // raised card on hover
        "surface-bright": "#1B2D44",     // inputs, hover states

        // Text
        "on-surface": "#E8EDF5",         // primary text
        "on-surface-variant": "#94A3B8", // secondary/muted text
        "on-surface-muted": "#64748B",   // tertiary/labels

        // Borders & outlines (subtle)
        "outline": "#475569",
        "outline-variant": "#1E2D42",    // card border

        // Accents — restrained & mature
        "secondary": "#34D399",          // emerald (primary accent)
        "secondary-container": "#0F3D2E",
        "on-secondary": "#04221A",
        "tertiary": "#C9A961",           // refined gold (was #ffb95f)
        "tertiary-container": "#3A2F14",
        "on-tertiary": "#1F1808",

        // Functional
        "error": "#F87171",
        "on-error": "#450A0A",
      },
      spacing: {
        "margin-mobile": "20px",
        "margin-desktop": "64px",
        "container-max": "1200px",
        "gutter": "24px",
      },
      maxWidth: {
        "container-max": "1200px",
      },
      fontFamily: {
        "sans": ["Inter", "system-ui", "-apple-system", "sans-serif"],
        "headline": ["Inter", "system-ui", "sans-serif"],
        "label": ["Inter", "sans-serif"],
        "body": ["Inter", "sans-serif"],
      },
      fontSize: {
        // Display scale — refined tracking & line-height for elegance
        "display": ["clamp(2.5rem, 5vw, 3.75rem)", { "lineHeight": "1.08", "letterSpacing": "-0.025em", "fontWeight": "600" }],
        "headline-xl": ["clamp(2rem, 4vw, 2.75rem)", { "lineHeight": "1.12", "letterSpacing": "-0.02em", "fontWeight": "600" }],
        "headline-lg": ["clamp(1.75rem, 3vw, 2.125rem)", { "lineHeight": "1.2", "letterSpacing": "-0.015em", "fontWeight": "600" }],
        "headline-md": ["1.375rem", { "lineHeight": "1.35", "letterSpacing": "-0.01em", "fontWeight": "600" }],
        "headline-sm": ["1.125rem", { "lineHeight": "1.4", "fontWeight": "600" }],

        // Body
        "body-lg": ["1.125rem", { "lineHeight": "1.7", "fontWeight": "400" }],
        "body-md": ["1rem", { "lineHeight": "1.65", "fontWeight": "400" }],
        "body-sm": ["0.875rem", { "lineHeight": "1.55", "fontWeight": "400" }],

        // Label / eyebrow
        "label-md": ["0.8125rem", { "lineHeight": "1.2", "letterSpacing": "0.06em", "fontWeight": "500" }],
        "eyebrow": ["0.75rem", { "lineHeight": "1", "letterSpacing": "0.14em", "fontWeight": "600" }],
      },
      boxShadow: {
        // Soft depth (replaces neon glow)
        "soft": "0 1px 2px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.2)",
        "card": "0 1px 3px rgba(0,0,0,0.3), 0 8px 24px rgba(0,0,0,0.18)",
        "card-hover": "0 2px 6px rgba(0,0,0,0.35), 0 16px 40px rgba(0,0,0,0.25)",
        "glow": "0 0 0 1px rgba(52,211,153,0.15), 0 8px 32px rgba(52,211,153,0.12)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      transitionTimingFunction: {
        "out-soft": "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/container-queries"),
  ],
};
