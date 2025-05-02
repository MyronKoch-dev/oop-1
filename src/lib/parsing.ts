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
    currentData: Partial<OnboardingData>
): void {
    // Reset fields
    currentData.languages = [];
    currentData.other_languages = null;

    let selectedLanguages: string[] = [];
    const validLanguages = ["Rust", "JavaScript", "Python", "Go", "Solidity", "TypeScript", "Java", "C#", "None"]; // Expected button values

    if (Array.isArray(rawResponse)) {
        // If multiple buttons selected (frontend sends array of values)
        selectedLanguages = rawResponse;
    } else if (typeof rawResponse === 'object' && rawResponse?.buttonValue) {
        // If single button selected
        selectedLanguages.push(rawResponse.buttonValue);
    } else if (typeof rawResponse === 'string') {
        // If string value (less common)
        selectedLanguages.push(rawResponse);
    } else if (rawResponse === null || rawResponse === undefined) {
        // No primary selection made
        console.log("Parsing Languages: No primary language selection received.");
    } else {
        // Unexpected rawResponse type - log warning
        console.warn("Parsing Languages: Received unexpected rawResponse type:", rawResponse);
    }

    // Filter selected languages against the valid list from buttons
    currentData.languages = selectedLanguages.filter(lang => validLanguages.includes(lang));

    // Ensure languages array is null if empty, for consistency
    if (currentData.languages.length === 0) {
        console.log("Parsing Languages: No standard languages selected.");
        // currentData.languages = null; // Optional: Set to null instead of [] if preferred
    }

    console.log('Parsed Languages Result:', {
        languages: currentData.languages
    });
}


/**
 * Parses the response for Q6 (Blockchain Exp). Handles button value + conditional text.
 * @param rawResponse Button value object ({ buttonValue: string }) or null if invalid/missing.
 * @param conditionalText Text input value if 'Yes' was selected.
 * @param currentData The current accumulated data object (to be mutated).
 */
export function parseBlockchain(
    rawResponse: { buttonValue: string, selectedValues?: string[] } | undefined | null,
    conditionalText: string | undefined | null,
    currentData: Partial<OnboardingData>
): void {
    // Reset fields
    currentData.blockchain_experience = null;
    currentData.blockchain_platforms = null;

    if (rawResponse?.buttonValue) {
        currentData.blockchain_experience = rawResponse.buttonValue;
        if (rawResponse.buttonValue === 'Yes' && Array.isArray(rawResponse.selectedValues)) {
            currentData.blockchain_platforms = rawResponse.selectedValues;
        }
    } else {
        console.log("Parsing Blockchain: No valid button value received.");
    }
    console.log('Parsed Blockchain Result:', { exp: currentData.blockchain_experience, plats: currentData.blockchain_platforms });
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
    currentData: Partial<OnboardingData>
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
    console.log('Parsed AI Result:', { exp: currentData.ai_experience, areas: currentData.ai_ml_areas });
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
export function validateInput(response: unknown, validationHint: string | undefined): boolean {
    if (!validationHint) {
        return true; // No specific validation rule for this question
    }

    // console.log(`Validating for hint: ${validationHint}`, response);
    switch (validationHint) {
        case 'email':
            // Check if it's a non-empty string and matches basic email pattern
            if (typeof response !== 'string' || response.trim() === '') return false;
            // Basic regex - can be made stricter if needed
            return /.+@.+\..+/.test(response);
        case 'github_username':
            // GitHub usernames can contain alphanumeric characters and hyphens
            // They cannot start with a hyphen and can be up to 39 characters long
            // Since it's optional, allow empty string, null, or undefined
            if (response === null || response === undefined || (typeof response === 'string' && response.trim() === '')) return true;
            if (typeof response !== 'string') return false;
            // Simple validation - alphanumeric and hyphens, no starting with hyphen
            return /^[a-zA-Z0-9][a-zA-Z0-9-]*$/.test(response.trim());
        case 'telegram_handle':
            // Telegram handles start with @ and can contain alphanumeric characters and underscores
            // Since it's optional, allow empty string, null, or undefined
            if (response === null || response === undefined || (typeof response === 'string' && response.trim() === '')) return true;
            if (typeof response !== 'string') return false;
            // Accept with or without @ prefix, we'll add it later if needed
            return /^(@?)[a-zA-Z0-9_]{5,32}$/.test(response.trim());
        case 'x_handle':
            // X/Twitter handles start with @ and can contain alphanumeric characters and underscores
            // Since it's optional, allow empty string, null, or undefined
            if (response === null || response === undefined || (typeof response === 'string' && response.trim() === '')) return true;
            if (typeof response !== 'string') return false;
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