// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";
// Import both interfaces from the types file
import { OnboardingData, OnboardingResponseForDB } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate environment variables at initialization
if (!supabaseUrl) {
  throw new Error(
    "Supabase environment variable NEXT_PUBLIC_SUPABASE_URL is not configured!",
  );
}
if (!supabaseServiceRoleKey) {
  throw new Error(
    "Supabase environment variable SUPABASE_SERVICE_ROLE_KEY is not configured!",
  );
}

// Create a single supabase admin client for server-side operations
// Use the Service Role Key ONLY in server-side code (API routes, Server Actions)
// NEVER expose the Service Role Key to the browser.
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    // Required for service_role key usage
    autoRefreshToken: false,
    persistSession: false,
  },
  // Optional: Add global fetch options if needed
  // global: {
  //   fetch: (...args) => fetch(...args),
  // },
});
console.log("Supabase Admin client initialized."); // Log initialization

const TABLE_NAME = "onboarding_responses";

/**
 * Saves the completed onboarding data to the Supabase table.
 * Handles retries internally for transient errors.
 * @param data The completed OnboardingData object (must contain a validated email).
 * @returns Object indicating success or failure with error details.
 */
export async function saveOnboardingResponse(
  data: OnboardingData,
): Promise<{ success: boolean; error?: string }> {
  // --- Pre-check: Ensure email is present ---
  // This should be guaranteed by the API route logic halting on failure, but double-check.
  if (
    !data.email ||
    typeof data.email !== "string" ||
    !data.email.includes("@")
  ) {
    const errorMsg =
      "Critical: Attempted to save onboarding response without a valid email.";
    console.error(errorMsg, { emailProvided: data.email });
    return {
      success: false,
      error: "Email is required and must be valid to save the response.",
    };
  }

  // --- Prepare Payload for DB Insertion ---
  // Map data from the OnboardingData interface to the OnboardingResponseForDB structure
  // This ensures we only try to insert columns that exist in the DB table.
  const dbPayload: OnboardingResponseForDB = {
    name: data.name ?? null,
    email: data.email, // Validated non-null by check above
    telegram: data.telegram ?? null,
    github: data.github ?? null,
    x_handle: data.x ?? null, // Map 'x' from OnboardingData to 'x_handle' in DB type
    languages: data.languages ?? null,
    other_languages: data.other_languages ?? null,
    blockchain_experience: data.blockchain_experience ?? null,
    blockchain_platforms: data.blockchain_platforms ?? null,
    ai_experience: data.ai_experience ?? null,
    ai_ml_areas: data.ai_ml_areas ?? null,
    tools_familiarity: data.tools_familiarity ?? null,
    experience_level: data.experience_level ?? null,
    hackathon: Array.isArray(data.hackathon)
      ? data.hackathon
      : data.hackathon
        ? [data.hackathon]
        : null,
    goal: data.goal ?? null,
    portfolio: data.portfolio ?? null,
    additional_skills: data.additional_skills ?? null,
    recommended_path: data.recommendedPath ?? null,
    recommended_path_url: data.recommendedPathUrl ?? null,
    // Let the DB handle the 'created_at' default timestamp
    // created_at: (data.createdAt ?? new Date()).toISOString(), // Only set manually if DB default isn't used
  };

  console.log("Payload sent to Supabase:", JSON.stringify(dbPayload, null, 2));

  // --- Perform Insertion with Retry Logic ---
  let attempts = 0;
  const maxAttempts = 3; // Total attempts = 1 initial + 2 retries
  const baseDelay = 250; // Initial delay in ms

  while (attempts < maxAttempts) {
    attempts++;
    const { error } = await supabaseAdmin.from(TABLE_NAME).insert([dbPayload]); // Insert the correctly typed payload as an array

    // --- Handle Success ---
    if (!error) {
      console.log(
        `Successfully saved onboarding response for email: ${dbPayload.email} on attempt ${attempts}`,
      );
      return { success: true };
    }

    // --- Handle Errors ---
    console.warn(
      `Supabase save attempt ${attempts} failed:`,
      error.message,
      `Code: ${error.code}`,
      `Hint: ${error.hint}`,
    );

    // Specific Error Handling: Unique Constraint (Email already exists)
    if (error.code === "23505") {
      // Standard PostgreSQL unique violation code
      console.error(
        `DB Unique constraint violation (email likely already exists): ${dbPayload.email}`,
      );
      // Return success=false but with a specific error message
      return {
        success: false,
        error: `Email already exists: ${dbPayload.email}. ${error.hint}`,
      };
    }

    // Specific Error Handling: Table doesn't exist (common setup issue)
    if (error.code === "42P01") {
      // Standard PostgreSQL undefined table code
      console.error(
        `DB Error: Table '${TABLE_NAME}' does not exist. Check Supabase schema setup.`,
      );
      return {
        success: false,
        error: `Database table not found: ${error.message}`,
      };
    }

    // --- Handle Retry ---
    if (attempts >= maxAttempts) {
      console.error(
        `Supabase save failed after ${maxAttempts} attempts for email ${dbPayload.email}:`,
        error,
      );
      return {
        success: false,
        error: `DB save failed after multiple attempts: ${error.message}`,
      };
    }

    // Calculate delay with exponential backoff and jitter
    const delay =
      baseDelay * Math.pow(2, attempts - 1) * (1 + Math.random() * 0.2 - 0.1);
    console.log(`Retrying Supabase save in ${Math.round(delay)}ms...`);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  // Fallback error (should only be reached if maxAttempts is 0, which it isn't)
  const finalErrorMsg =
    "Unknown error occurred during the database save process after retries.";
  console.error(finalErrorMsg, { email: dbPayload.email });
  return { success: false, error: finalErrorMsg };
}

// Add other DB functions here if needed in the future (e.g., getResponseByEmail)
// export async function getResponseByEmail(email: string): Promise<OnboardingResponseForDB | null> {
//    // Implementation...
// }
