// src/lib/parsing.ts

// Import only the necessary type(s) used in this file
import { OnboardingData } from "./types";

/**
 * Parses the raw response for Q3 (handles) and updates the data object.
 * Uses case-insensitive regex and trims results.
 * @param rawResponse The user's text response. Can be null/undefined if invalid on second attempt or empty.
 * @param currentData The current accumulated data object (to be mutated).
 */
export function parseHandles(rawResponse: string | undefined | null, currentData: Partial<OnboardingData>): void {
    // Reset fields before parsing
    currentData.telegram = null;
    currentData.github = null;
    currentData.x = null;

    if (!rawResponse) {
        console.log('Parsing Handles: No raw response provided, setting all to null.');
        return; // Optional field, empty/null input is valid, results in null fields
    }

    // Define simpler patterns: Look for Platform Name + Separator + Handle OR @Handle + Separator + Platform Name
    // Capture Group 1: Handle | Capture Group 2: Handle
    const telegramRegex = /(?:Telegram(?:[\s:]+))([@\w.-]+)|([@\w.-]+)(?:\s+(?:on|for)\s+Telegram)/i;
    const githubRegex = /(?:GitHub|Github)(?:[\s:]+)([\w.-]+)|([\w.-]+)(?:\s+(?:on|for)\s+(?:GitHub|Github))/i; // GitHub doesn't usually have @
    const xTwitterRegex = /(?:X|Twitter)(?:[\s:]+)([@\w.-]+)|([@\w.-]+)(?:\s+(?:on|for)\s+(?:X|Twitter))/i;

    const telegramMatch = rawResponse.match(telegramRegex);
    const githubMatch = rawResponse.match(githubRegex);
    const xMatch = rawResponse.match(xTwitterRegex);

    // Use the captured group (either group 1 or 2 depending on which part matched)
    const rawTele = telegramMatch ? (telegramMatch[1] || telegramMatch[2]) : null;
    const rawGit = githubMatch ? (githubMatch[1] || githubMatch[2]) : null;
    const rawX = xMatch ? (xMatch[1] || xMatch[2]) : null;

    // Clean and assign
    if (rawTele) {
        currentData.telegram = rawTele.trim().replace(/[.,;]$/, '');
        if (!currentData.telegram.startsWith('@')) currentData.telegram = '@' + currentData.telegram;
    }
    if (rawGit) {
        currentData.github = rawGit.trim().replace(/[.,;]$/, '').replace(/^@/, ''); // Remove leading @
    }
    if (rawX) {
        currentData.x = rawX.trim().replace(/[.,;]$/, '');
        if (!currentData.x.startsWith('@')) currentData.x = '@' + currentData.x;
    }

    console.log('Parsed Handles (Simplified):', { t: currentData.telegram, g: currentData.github, x: currentData.x });
}

/**
 * Parses the response for Q4 (languages).
 * Handles button values (potentially as an array) and separate 'Other' text input.
 * @param rawResponse Response from main input (e.g., button values). Can be string[], { buttonValue: string }, string (less likely), null.
 * @param otherTextResponse Text specifically from the 'Other' input field.
 * @param currentData The current accumulated data object (to be mutated).
 */
export function parseLanguages(
    rawResponse: string | string[] | { buttonValue: string } | undefined | null,
    otherTextResponse: string | undefined | null,
    currentData: Partial<OnboardingData>
): void {
    // Reset fields
    currentData.languages = [];
    currentData.other_languages = null;

    let selectedLanguages: string[] = [];
    const validLanguages = ["Rust", "JavaScript", "Python", "Go", "Solidity"]; // Expected button values

    if (Array.isArray(rawResponse)) {
        // If multiple buttons selected (frontend sends array of values)
        selectedLanguages = rawResponse;
    } else if (typeof rawResponse === 'object' && rawResponse?.buttonValue) {
        // If single button selected
        selectedLanguages.push(rawResponse.buttonValue);
    } else if (rawResponse === null || rawResponse === undefined) {
        // No primary selection made
        console.log("Parsing Languages: No primary language selection received.");
    } else {
        // Unexpected rawResponse type (e.g., string) - log warning
        console.warn("Parsing Languages: Received unexpected rawResponse type:", rawResponse);
        // Optionally try to handle string if it matches a valid language?
        // Or assume it was meant for 'Other' if otherTextResponse is absent?
        // Safest: Ignore unexpected type for primary selection for now.
    }

    // Filter selected languages against the valid list from buttons
    currentData.languages = selectedLanguages.filter(lang => validLanguages.includes(lang));

    // Handle the separate 'Other' text input
    const trimmedOtherText = otherTextResponse?.trim();
    if (trimmedOtherText) {
        currentData.other_languages = trimmedOtherText;
        // Decision: Do NOT add 'Other' to the main languages array.
        // Keep selected languages and other text separate.
    }

    // Ensure languages array is null if empty, for consistency? Or empty array?
    // Let's stick with empty array [] if nothing selected, null if parsing failed entirely (unlikely here).
    if (currentData.languages.length === 0) {
        console.log("Parsing Languages: No standard languages selected.");
        // currentData.languages = null; // Optional: Set to null instead of [] if preferred
    }


    console.log('Parsed Languages Result:', { l: currentData.languages, o: currentData.other_languages });
}


/**
 * Parses the response for Q5 (Blockchain Exp). Handles button value + conditional text.
 * @param rawResponse Button value object ({ buttonValue: string }) or null if invalid/missing.
 * @param conditionalText Text input value if 'Yes' was selected.
 * @param currentData The current accumulated data object (to be mutated).
 */
export function parseBlockchain(
    rawResponse: { buttonValue: string } | undefined | null,
    conditionalText: string | undefined | null,
    currentData: Partial<OnboardingData>
): void {
    // Reset fields
    currentData.blockchain_experience = null;
    currentData.blockchain_platforms = null;

    if (rawResponse?.buttonValue) {
        // Store the selection ('Yes', 'No - curious', 'No experience')
        currentData.blockchain_experience = rawResponse.buttonValue;
        // If 'Yes' was selected, store the conditional text (if provided)
        if (rawResponse.buttonValue === 'Yes') {
            const trimmedConditional = conditionalText?.trim();
            if (trimmedConditional) {
                currentData.blockchain_platforms = trimmedConditional;
            }
        }
    } else {
        console.log("Parsing Blockchain: No valid button value received.");
    }
    console.log('Parsed Blockchain Result:', { exp: currentData.blockchain_experience, plats: currentData.blockchain_platforms });
}


/**
 * Parses the response for Q6 (AI Exp). Handles button value + conditional text.
 * @param rawResponse Button value object ({ buttonValue: string }) or null if invalid/missing.
 * @param conditionalText Text input value if 'Yes' was selected.
 * @param currentData The current accumulated data object (to be mutated).
 */
export function parseAI(
    rawResponse: { buttonValue: string } | undefined | null,
    conditionalText: string | undefined | null,
    currentData: Partial<OnboardingData>
): void {
    // Reset fields
    currentData.ai_experience = null;
    currentData.ai_ml_areas = null;

    if (rawResponse?.buttonValue) {
        // Store the selection ('Yes', 'No')
        currentData.ai_experience = rawResponse.buttonValue;
        // If 'Yes' was selected, store the conditional text (if provided)
        if (rawResponse.buttonValue === 'Yes') {
            const trimmedConditional = conditionalText?.trim();
            if (trimmedConditional) {
                currentData.ai_ml_areas = trimmedConditional;
            }
        }
    } else {
        console.log("Parsing AI: No valid button value received.");
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
        case 'handles':
            // For handles (Q3), it's optional. Allow empty string, null, or undefined.
            // Actual parsing success determines if data is extracted.
            return true; // Basic validation passes if it's string/null/undefined
        // Validation for button-based inputs usually just means *something* was selected,
        // which is implicitly handled by receiving the { buttonValue: ... } object.
        // Explicit value validation could be added here if needed.
        default:
            // Assume valid if no specific rule applies or fails
            return true;
    }
}