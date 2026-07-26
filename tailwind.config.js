/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./public/**/*.html", "./public/**/*.js"],
  theme: {
    extend: {
      colors: {
        // ── Near-black canvas (Linear/Vercel inspired) ──────────────────────
        "bg": "#08090A",            // page background (near-black)
        "bg-soft": "#0E0F11",       // alternating sections
        "surface": "#131417",       // cards
        "surface-2": "#1A1B1F",     // raised/hover
        "surface-3": "#222327",     // inputs, strong hover

        // Hairline borders
        "line": "#1F2024",          // default card border
        "line-soft": "#17181B",     // section dividers
        "line-strong": "#2A2B30",   // hover/emphasis

        // Text — HIGH contrast for readability (WCAG AA on near-black)
        "ink": "#FAFAFA",           // primary text (~17:1 on bg)
        "ink-soft": "#A1A1AA",      // secondary (~7:1)
        "ink-mute": "#71717A",      // tertiary/labels (~4.5:1)

        // Single accent — emerald (restrained)
        "accent": "#10B981",        // primary action
        "accent-hover": "#059669",
        "accent-soft": "#0E3B2E",   // tinted bg
        "accent-ink": "#04130D",    // text on accent
        "accent-faint": "rgba(16,185,129,0.12)",
      },
      spacing: {
        "px-x": "24px",            // horizontal page padding mobile
        "px-x-lg": "64px",         // horizontal page padding desktop
        "container": "1120px",     // max width (tighter than 1200 for focus)
        "gutter": "24px",
      },
      maxWidth: {
        "container": "1120px",
      },
      fontFamily: {
        "sans": ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      // Strong, tight type scale — the hierarchy must read at a glance
      fontSize: {
        "display": ["clamp(2.25rem, 5vw, 3.5rem)", { "lineHeight": "1.05", "letterSpacing": "-0.03em", "fontWeight": "600" }],
        "h1": ["clamp(1.875rem, 3.5vw, 2.5rem)", { "lineHeight": "1.1", "letterSpacing": "-0.025em", "fontWeight": "600" }],
        "h2": ["clamp(1.5rem, 2.8vw, 2rem)", { "lineHeight": "1.15", "letterSpacing": "-0.02em", "fontWeight": "600" }],
        "h3": ["1.25rem", { "lineHeight": "1.3", "letterSpacing": "-0.015em", "fontWeight": "600" }],
        "h4": ["1.0625rem", { "lineHeight": "1.4", "fontWeight": "600" }],

        "lead": ["1.125rem", { "lineHeight": "1.7", "fontWeight": "400" }],
        "body": ["0.9375rem", { "lineHeight": "1.65", "fontWeight": "400" }],
        "sm": ["0.8125rem", { "lineHeight": "1.55", "fontWeight": "400" }],
        "xs": ["0.75rem", { "lineHeight": "1.4", "fontWeight": "500" }],
      },
      boxShadow: {
        "card": "0 1px 0 0 rgba(255,255,255,0.02) inset, 0 1px 2px rgba(0,0,0,0.4)",
        "raise": "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 8px 24px rgba(0,0,0,0.5)",
        "pop": "0 1px 0 0 rgba(255,255,255,0.05) inset, 0 20px 50px rgba(0,0,0,0.55)",
      },
      borderRadius: {
        "lg2": "0.625rem",
        "xl2": "0.875rem",
        "2xl2": "1rem",
      },
      transitionTimingFunction: {
        "soft": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/container-queries"),
  ],
};
