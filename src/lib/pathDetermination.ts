// src/lib/pathDetermination.ts
import { OnboardingData } from "./types";

interface PathResult {
    recommendedPath: string;
    recommendedPathUrl: string;
}

// Helper function to safely check if an array includes any of the target values
function arrayIncludesAny(arr: string[] | null | undefined, targets: string[]): boolean {
    if (!arr) return false;
    return targets.some(target => arr.includes(target));
}

// Helper function to get URL from environment variables
function getPathUrl(pathKey: string): string {
    const envVarName = `PATH_URL_${pathKey.toUpperCase().replace(/ /g, '_')}`;
    const url = process.env[envVarName];
    if (!url) {
        console.warn(`Environment variable ${envVarName} for path URL not set! Using placeholder.`);
        return `https://example.com/placeholder/${pathKey.toLowerCase().replace(/ /g, '-')}`;
    }
    return url;
}

/**
 * Determines the recommended onboarding path based on user data.
 * Follows the strict rules defined in the Specification Sheet FR3.3.
 * Handles null/undefined values gracefully (condition evaluates to false).
 * @param data The completed OnboardingData object.
 * @returns An object containing the recommendedPath name and its URL.
 */
export function determinePath(data: OnboardingData): PathResult {
    console.log("Determining path for data:", data);

    // --- Rule Evaluation ---
    // Order matters slightly, as the first match often takes precedence in simple logic,
    // although here we evaluate all conditions. We need a priority/fallback.

    // Contractor Rule Check
    const isContractorCandidate =
        arrayIncludesAny(data.languages, ['Rust', 'Solidity', 'Python']) &&
        (data.tools_familiarity === 'Very familiar' || data.tools_familiarity === 'Some experience') &&
        data.experience_level === 'Advanced' &&
        data.goal === 'Build apps/dApps';

    if (isContractorCandidate) {
        console.log("Path determined: Contractor");
        return {
            recommendedPath: "Contractor",
            recommendedPathUrl: getPathUrl("CONTRACTOR")
        };
    }

    // Hacker Rule Check
    const isHackerCandidate =
        (data.tools_familiarity === 'Some experience' || data.tools_familiarity === 'Very familiar') && // Corrected typo from "Very Familiar" to "Very familiar"
        (data.hackathon === 'Winner' || data.hackathon === 'Participant') &&
        data.goal === 'Earn bounties';

    if (isHackerCandidate) {
        console.log("Path determined: Hacker");
        return {
            recommendedPath: "Hacker",
            recommendedPathUrl: getPathUrl("HACKER")
        };
    }

    // App Suggester Rule Check
    const isAppSuggesterCandidate =
        data.goal === 'Share ideas for new features' &&
        (data.experience_level === 'Beginner' || data.experience_level === 'Intermediate');

    if (isAppSuggesterCandidate) {
        console.log("Path determined: App Suggester");
        return {
            recommendedPath: "App Suggester",
            recommendedPathUrl: getPathUrl("APP_SUGGESTER")
        };
    }

    // AI Experienced Rule Check
    const isAIExperiencedCandidate =
        data.ai_experience === 'Yes' &&
        data.goal === 'Work on AI projects';

    if (isAIExperiencedCandidate) {
        console.log("Path determined: AI Experienced");
        return {
            recommendedPath: "AI Experienced",
            recommendedPathUrl: getPathUrl("AI_EXPERIENCED")
        };
    }

    // Ambassador Rule Check
    const isAmbassadorCandidate =
        data.blockchain_experience === 'Yes' && // Check the button value
        data.goal === 'Promote blockchain/Andromeda';

    if (isAmbassadorCandidate) {
        console.log("Path determined: Ambassador");
        return {
            recommendedPath: "Ambassador",
            recommendedPathUrl: getPathUrl("AMBASSADOR")
        };
    }

    // Beginner Rule Check (Acts as a prioritized fallback)
    const isBeginnerCandidate =
        data.goal === 'Learn Web3 basics' ||
        data.experience_level === 'Beginner';

    if (isBeginnerCandidate) {
        console.log("Path determined: Beginner");
        return {
            recommendedPath: "Beginner",
            recommendedPathUrl: getPathUrl("BEGINNER")
        };
    }

    // --- Default Fallback ---
    // If none of the specific rules match (including Beginner), default to Beginner.
    // This ensures every user gets *some* path.
    console.log("Path determined: Defaulting to Beginner (no specific rules matched)");
    return {
        recommendedPath: "Beginner",
        recommendedPathUrl: getPathUrl("BEGINNER")
    };
}