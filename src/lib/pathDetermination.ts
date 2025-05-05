// src/lib/pathDetermination.ts
import { OnboardingData } from "./types";

interface PathResult {
  recommendedPath: string;
  recommendedPathUrl: string;
}

// Helper function to safely check if an array includes any of the target values
function arrayIncludesAny(
  arr: string[] | null | undefined,
  targets: string[],
): boolean {
  if (!arr) return false;
  return targets.some((target) => arr.includes(target));
}

// Helper function to get URL from environment variables
function getPathUrl(pathKey: string): string {
  const envVarName = `PATH_URL_${pathKey.toUpperCase().replace(/ /g, "_")}`;
  const url = process.env[envVarName];
  if (!url) {
    console.warn(
      `Environment variable ${envVarName} for path URL not set! Using placeholder.`,
    );
    return `https://example.com/placeholder/${pathKey.toLowerCase().replace(/ /g, "-")}`;
  }
  return url;
}

// ---
// HOW TO EDIT OR EXPAND PATH RECOMMENDATION RULES
// - To tweak a rule, edit the relevant isXxxCandidate variable below.
// - To add a new path, add a new rule block above the fallback.
// - To make rules more granular, add more specific conditions or implement a scoring system.
// - See PATH_RULES_GUIDE.md in the root for a step-by-step guide and examples.
// ---

/**
 * Determines the recommended onboarding path based on user data.
 * Follows the strict rules defined in the Specification Sheet FR3.3.
 * Handles null/undefined values gracefully (condition evaluates to false).
 * @param data The completed OnboardingData object.
 * @returns An object containing the recommendedPath name and its URL.
 */
// ---
// MAIN RULE LOGIC: Edit or add rules below to change path recommendations.
// ---
export function determinePath(data: OnboardingData): PathResult {
  console.log("Determining path for data:", data);

  // --- Rule Evaluation ---
  // Order matters slightly, as the first match often takes precedence in simple logic,
  // although here we evaluate all conditions. We need a priority/fallback.

  // Contractor Rule Check
  const isContractorCandidate =
    arrayIncludesAny(data.languages, ["Rust", "Solidity", "Python"]) &&
    (data.tools_familiarity === "Very familiar" ||
      data.tools_familiarity === "Some experience") &&
    data.experience_level === "Advanced" &&
    data.goal === "Build apps/dApps";

  if (isContractorCandidate) {
    console.log("Path determined: Contractor");
    return {
      recommendedPath: "Contractor",
      recommendedPathUrl: getPathUrl("CONTRACTOR"),
    };
  }

  // Hacker Rule Check
  const isHackerCandidate =
    (data.tools_familiarity === "Some experience" ||
      data.tools_familiarity === "Very familiar") && // Corrected typo from "Very Familiar" to "Very familiar"
    arrayIncludesAny(data.hackathon, ["Winner", "Web2", "Web3"]) &&
    data.goal === "Earn bounties";

  if (isHackerCandidate) {
    console.log("Path determined: Hacker");
    return {
      recommendedPath: "Hacker",
      recommendedPathUrl: getPathUrl("HACKER"),
    };
  }

  // App Suggester Rule Check (now Visionary)
  const isVisionaryPathCandidate =
    data.goal === "Share ideas for new features" &&
    (data.experience_level === "Beginner" ||
      data.experience_level === "Intermediate");

  if (isVisionaryPathCandidate) {
    console.log("Path determined: Visionary");
    return {
      recommendedPath: "Visionary",
      recommendedPathUrl: getPathUrl("VISIONARY_PATH"),
    };
  }

  // AI Experienced Rule Check
  const isAIExperiencedCandidate =
    data.ai_experience === "Yes" && data.goal === "Work on AI projects";

  if (isAIExperiencedCandidate) {
    console.log("Path determined: AI Initiatives");
    return {
      recommendedPath: "AI Initiatives",
      recommendedPathUrl: getPathUrl("AI_INITIATIVES"),
    };
  }

  // Ambassador Rule Check
  const isAmbassadorCandidate =
    data.blockchain_experience === "Yes" && // Check the button value
    data.goal === "Promote blockchain/Andromeda";

  if (isAmbassadorCandidate) {
    console.log("Path determined: Ambassador");
    return {
      recommendedPath: "Ambassador",
      recommendedPathUrl: getPathUrl("AMBASSADOR"),
    };
  }

  // Beginner Rule Check (now Explorer) (Acts as a prioritized fallback)
  const isExplorerPathCandidate =
    data.goal === "Learn Web3 basics" || data.experience_level === "Beginner";

  if (isExplorerPathCandidate) {
    console.log("Path determined: Explorer");
    return {
      recommendedPath: "Explorer",
      recommendedPathUrl: getPathUrl("EXPLORER_PATH"),
    };
  }

  // --- Default Fallback ---
  // If none of the specific rules match (including Explorer), default to Explorer.
  // This ensures every user gets *some* path.
  console.log(
    "Path determined: Defaulting to Explorer (no specific rules matched)",
  );
  return {
    recommendedPath: "Explorer",
    recommendedPathUrl: getPathUrl("EXPLORER_PATH"),
  };
}
// ---
// For more details, see PATH_RULES_GUIDE.md in the root.
// ---
