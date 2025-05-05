// src/lib/pathDetermination.ts
import { OnboardingData } from "./types";

interface PathResult {
    recommendedPath: string;
    recommendedPathUrl: string;
    secondRecommendedPath?: string;
    secondRecommendedPathUrl?: string;
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

// --- SCORING SYSTEM CONFIGURATION ---
const PATH_SCORING = {
    Contractor: {
        // Only score if both Rust and TypeScript are present (enforced below)
        languages: { Rust: 2, Go: 1, TypeScript: 2 },
        tools_familiarity: { "Very familiar": 2, "Some experience": 1 },
        experience_level: { Advanced: 2 },
        goal: { "Build apps/dApps": 2 },
    },
    Hacker: {
        languages: { TypeScript: 2 },
        tools_familiarity: { "Very familiar": 1, "Some experience": 1 },
        hackathon: { Winner: 2, Web2: 1, Web3: 1 },
        goal: { "Earn bounties": 2 },
    },
    Visionary: {
        goal: { "Share ideas for new features": 2 },
        experience_level: { Beginner: 1, Intermediate: 1 },
    },
    "AI Initiatives": {
        ai_experience: { Yes: 2 },
        goal: { "Work on AI projects": 2 },
    },
    Ambassador: {
        blockchain_experience: { Yes: 2 },
        goal: { "Promote blockchain/Andromeda": 2 },
    },
    Explorer: {
        goal: { "Learn Web3 basics": 2 },
        experience_level: { Beginner: 2 },
    },
};

function scorePath(
    data: OnboardingData,
    path: keyof typeof PATH_SCORING,
): number {
    let score = 0;
    const rules = PATH_SCORING[path];
    for (const [field, values] of Object.entries(rules)) {
        const userValue = (data as unknown as Record<string, unknown>)[field];
        if (Array.isArray(userValue)) {
            for (const v of userValue) {
                if (values[v]) score += values[v];
            }
        } else if (userValue && values[userValue as string]) {
            score += values[userValue as string];
        }
    }
    return score;
}

function hasContractorRequirements(data: OnboardingData): boolean {
    const langs = data.languages;
    const blockchains = data.blockchain_platforms;
    return (
        !!langs && langs.includes("Rust") && langs.includes("TypeScript") &&
        !!blockchains && blockchains.includes("Cosmos SDK Chains")
    );
}

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

    const pathScores = Object.keys(PATH_SCORING).map((path) => {
        // Enforce hard requirement for Contractor
        if (path === "Contractor" && !hasContractorRequirements(data)) {
            return { path, score: -Infinity };
        }
        return {
            path,
            score: scorePath(data, path as keyof typeof PATH_SCORING),
        };
    });
    pathScores.sort((a, b) => b.score - a.score);
    const best = pathScores[0];
    const secondBest = pathScores[1];

    return {
        recommendedPath: best.path,
        recommendedPathUrl: getPathUrl(best.path.toUpperCase().replace(/ /g, "_")),
        secondRecommendedPath: secondBest?.path,
        secondRecommendedPathUrl: secondBest?.path
            ? getPathUrl(secondBest.path.toUpperCase().replace(/ /g, "_"))
            : undefined,
    };
}
// ---
// For more details, see PATH_RULES_GUIDE.md in the root.
// ---
