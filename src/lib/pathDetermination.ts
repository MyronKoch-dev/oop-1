// src/lib/pathDetermination.ts
import { OnboardingData } from "./types";

interface PathResult {
    recommendedPath: string;
    recommendedPathUrl: string;
    secondRecommendedPath?: string;
    secondRecommendedPathUrl?: string;
}

// Helper function to get URL from environment variables or use application routes
function getPathUrl(pathKey: string): string {
    // Format path key for environment variable lookup
    const formattedKey = pathKey.toUpperCase().replace(/ /g, "_");
    const envVarName = `PATH_URL_${formattedKey}`;
    const url = process.env[envVarName];

    // Log which environment variable we're trying to access
    console.log(`Looking for environment variable: ${envVarName}`);

    // If environment variable exists, use it
    if (url) {
        console.log(`Found URL from environment: ${url}`);
        return url;
    }

    // Otherwise, map path names to application routes
    console.warn(`Environment variable ${envVarName} not set. Using application routes.`);

    // Map each path to its corresponding application route
    const pathRoutes: Record<string, string> = {
        "Hacker": "/hackers",
        "Contractor": "/contractors",
        "Visionary": "/visionaries",
        "AI Navigator": "/ai-navigators",
        "Ambassador": "/ambassadors",
        "Explorer": "/explorers"
    };

    // Use the mapped route if available, otherwise fall back to a slugified version
    const route = pathRoutes[pathKey] || `/${pathKey.toLowerCase().replace(/ /g, "-")}`;
    console.log(`Using application route: ${route}`);
    return route;
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
    "AI Navigator": {
        ai_experience: { Yes: 2 },
        goal: { "Work on AI projects": 2 },
    },
    Ambassador: {
        blockchain_experience: { Yes: 2 },
        goal: { "Promote blockchain/Andromeda": 2 },
    },
    Explorer: {
        goal: { "Learn Web3 basics": 2, "Learn about Andromeda": 2, "Not sure yet": 3 },
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

    // Get URLs for both paths
    const primaryUrl = getPathUrl(best.path); // Pass the exact path name
    const secondaryUrl = secondBest?.path ? getPathUrl(secondBest.path) : undefined;

    console.log(`Primary path: ${best.path}, URL: ${primaryUrl}`);
    if (secondBest?.path) {
        console.log(`Secondary path: ${secondBest.path}, URL: ${secondaryUrl}`);
    }

    return {
        recommendedPath: best.path,
        recommendedPathUrl: primaryUrl,
        secondRecommendedPath: secondBest?.path,
        secondRecommendedPathUrl: secondaryUrl,
    };
}
// ---
// For more details, see PATH_RULES_GUIDE.md in the root.
// ---
