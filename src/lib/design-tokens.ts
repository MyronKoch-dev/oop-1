/**
 * Design System Tokens
 * Centralized design constants for consistent styling across the application
 */

export const designTokens = {
  colors: {
    // Tile/Card backgrounds
    tileBg: "#2a2a2a",

    // Text colors
    textPrimary: "#ffffff", // White text
    textSecondary: "#99a1af", // Secondary text color

    // Button colors
    buttonPrimary: "#99a1af",
    buttonPrimaryHover: "#8691a1",
    buttonSecondary: "#2a2a2a",
    buttonSecondaryHover: "#353535",

    // Border (generally none unless explicitly needed)
    border: "transparent",
  },

  // CSS class utilities for common patterns
  classes: {
    tile: "bg-[#2a2a2a] rounded-lg",
    tileWithBorder: "bg-[#2a2a2a] rounded-lg border border-gray-700/50",
    button: "bg-[#99a1af] text-white hover:bg-[#8691a1] border-none",
    buttonSecondary: "bg-[#2a2a2a] text-white hover:bg-[#353535] border-none",
    textPrimary: "text-white",
    textSecondary: "text-[#99a1af]",
  },
} as const;

export type DesignTokens = typeof designTokens;
