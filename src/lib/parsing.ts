// src/lib/parsing.ts

// Import only the necessary type(s) used in this file
import { OnboardingData } from "./types";

/**
 * Parses the response for Q5 (languages).
 * Handles button values (potentially as an array).
 * @param rawResponse Response from main input (e.g., button values). Can be string[], { buttonValue: string }, string (less likely), null.
 * @param currentData The current accumulated data object (to be mutated).
 */
export function parseLanguages(
  rawResponse: string | string[] | { buttonValue: string } | undefined | null,
  currentData: Partial<OnboardingData>,
): void {
  // Reset fields
  currentData.languages = [];

  let selectedLanguages: string[] = [];
  // Only accept valid language values from the questionnaire
  const validLanguages = [
    "Rust",
    "JavaScript",
    "Python",
    "Go",
    "Solidity",
    "TypeScript",
    "Java",
    "Others not listed",
    "Not a programmer",
  ];
  if (Array.isArray(rawResponse)) {
    selectedLanguages = rawResponse;
  } else if (typeof rawResponse === "object" && rawResponse?.buttonValue) {
    selectedLanguages.push(rawResponse.buttonValue);
  } else if (typeof rawResponse === "string") {
    selectedLanguages.push(rawResponse);
  }
  // Filter to only valid values
  const filtered = selectedLanguages.filter((lang) =>
    validLanguages.includes(lang),
  );
  if (filtered.length !== selectedLanguages.length) {
    console.warn(
      "[parseLanguages] Ignored unexpected values:",
      selectedLanguages.filter((lang) => !validLanguages.includes(lang)),
    );
  }
  currentData.languages = filtered;
  // Always store as array (empty if none selected)
  if (!currentData.languages) currentData.languages = [];
  // Debug log
  console.log("[parseLanguages] Storing languages:", currentData.languages);
}

/**
 * Parses the response for Q6 (Blockchain Exp). Handles button value + conditional text.
 * @param rawResponse Button value object ({ buttonValue: string }) or null if invalid/missing.
 * @param conditionalText Text input value if 'Yes' was selected.
 * @param currentData The current accumulated data object (to be mutated).
 */
export function parseBlockchain(
  rawResponse:
    | { buttonValue: string; selectedValues?: string[] }
    | undefined
    | null,
  conditionalText: string | undefined | null,
  currentData: Partial<OnboardingData>,
): void {
  // Reset fields
  currentData.blockchain_experience = null;
  currentData.blockchain_platforms = [];

  if (rawResponse?.buttonValue) {
    currentData.blockchain_experience = rawResponse.buttonValue;
    if (Array.isArray(rawResponse.selectedValues)) {
      currentData.blockchain_platforms = rawResponse.selectedValues;
    } else if (typeof rawResponse.buttonValue === "string") {
      // If only one selected, store as array
      currentData.blockchain_platforms = [rawResponse.buttonValue];
    }
  } else if (Array.isArray(rawResponse)) {
    currentData.blockchain_platforms = rawResponse;
  } else {
    currentData.blockchain_platforms = [];
  }
  // Debug log
  console.log(
    "[parseBlockchain] Storing blockchain_experience:",
    currentData.blockchain_experience,
  );
  console.log(
    "[parseBlockchain] Storing blockchain_platforms:",
    currentData.blockchain_platforms,
  );
}

/**
 * Parses the response for Q7 (AI Exp). Handles button value + conditional text.
 * @param rawResponse Button value object ({ buttonValue: string }) or null if invalid/missing.
 * @param conditionalText Text input value if 'Yes' was selected.
 * @param currentData The current accumulated data object (to be mutated).
 */
export function parseAI(
  rawResponse: { buttonValue: string } | string[] | undefined | null,
  _conditionalText: string | undefined | null,
  currentData: Partial<OnboardingData>,
): void {
  currentData.ai_experience = null;
  currentData.ai_ml_areas = null;

  if (Array.isArray(rawResponse)) {
    if (rawResponse.length > 0) {
      currentData.ai_experience = "Yes";
      currentData.ai_ml_areas = rawResponse.join(", ");
    } else {
      currentData.ai_experience = "No";
    }
  } else if (rawResponse?.buttonValue) {
    currentData.ai_experience = rawResponse.buttonValue;
  } else {
    console.log("Parsing AI: No valid button value or array received.");
  }
  console.log("Parsed AI Result:", {
    exp: currentData.ai_experience,
    areas: currentData.ai_ml_areas,
  });
}

// --- Validation Function ---
/**
 * Performs basic validation based on the question's validationHint.
 * Note: More complex validation (like ensuring only valid button values)
 * should ideally happen closer to the input source (frontend/API route).
 * @param response User's raw response (type unknown as it varies)
 * @param validationHint Hint from QuestionDetail ('email', 'handles', etc.)
 * @returns True if valid based on basic checks, false otherwise.
 */
export function validateInput(
  response: unknown,
  validationHint: string | undefined,
): boolean {
  if (!validationHint) {
    return true; // No specific validation rule for this question
  }

  // console.log(`Validating for hint: ${validationHint}`, response);
  switch (validationHint) {
    case "email":
      // Check if it's a non-empty string and matches basic email pattern
      if (typeof response !== "string" || response.trim() === "") return false;
      // Basic regex - can be made stricter if needed
      return /.+@.+\..+/.test(response);
    case "github_username":
      // GitHub usernames can contain alphanumeric characters and hyphens
      // They cannot start with a hyphen and can be up to 39 characters long
      // Since it's optional, allow empty string, null, or undefined
      if (
        response === null ||
        response === undefined ||
        (typeof response === "string" && response.trim() === "")
      )
        return true;
      if (typeof response !== "string") return false;
      // Simple validation - alphanumeric and hyphens, no starting with hyphen
      return /^[a-zA-Z0-9][a-zA-Z0-9-]*$/.test(response.trim());
    case "telegram_handle":
      // Telegram handles start with @ and can contain alphanumeric characters and underscores
      // Since it's optional, allow empty string, null, or undefined
      if (
        response === null ||
        response === undefined ||
        (typeof response === "string" && response.trim() === "")
      )
        return true;
      if (typeof response !== "string") return false;
      // Accept with or without @ prefix, we'll add it later if needed
      return /^(@?)[a-zA-Z0-9_]{5,32}$/.test(response.trim());
    case "x_handle":
      // X/Twitter handles start with @ and can contain alphanumeric characters and underscores
      // Since it's optional, allow empty string, null, or undefined
      if (
        response === null ||
        response === undefined ||
        (typeof response === "string" && response.trim() === "")
      )
        return true;
      if (typeof response !== "string") return false;
      // Accept with or without @ prefix, we'll add it later if needed
      return /^(@?)[a-zA-Z0-9_]{1,15}$/.test(response.trim());
    // Validation for button-based inputs usually just means *something* was selected,
    // which is implicitly handled by receiving the { buttonValue: ... } object.
    // Explicit value validation could be added here if needed.
    default:
      // Assume valid if no specific rule applies or fails
      return true;
  }
}
