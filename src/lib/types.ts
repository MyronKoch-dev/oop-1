// src/lib/types.ts

// Main data structure used during flow & represents final desired data
// Fields generally map to questions or derived data.
export interface OnboardingData {
  sessionId: string; // Identifier for the active session during the flow
  name: string | null; // Q1 Response
  email: string; // Q2 Response (Validated non-null before completion)
  telegram?: string | null; // Q3 Parsed Handle
  github?: string | null; // Q3 Parsed Handle
  x?: string | null; // Q3 Parsed Handle (Interface uses 'x')
  languages?: string[] | null; // Q4 Parsed Language Names
  other_languages?: string | null; // Q4 Text from 'Other'
  blockchain_experience?: string | null; // Q5 Button Value ('Yes', 'No - curious', 'No experience')
  blockchain_platforms?: string[] | null; // Q5 Conditional Text
  ai_experience?: string | null; // Q6 Button Value ('Yes', 'No')
  ai_ml_areas?: string | null; // Q6 Conditional Text
  tools_familiarity?: string | null; // Q7 Button Value
  experience_level?: string | null; // Q8 Button Value
  hackathon?: string[] | null; // Q9 Button Values (multi-select)
  goal?: string | null; // Q10 Button Value
  portfolio?: string | null; // Q11 Response
  additional_skills?: string | null; // Q12 Response
  recommendedPath?: string; // Determined post-Q12
  recommendedPathUrl?: string; // Determined post-Q12
  createdAt?: Date; // Timestamp added before DB save
}

// Structure stored in Redis (or other session store) for an active session
export interface SessionState {
  questionIndex: number; // 0-based index of the *next* question to ask
  accumulatedData: Partial<OnboardingData>; // Data collected so far, potentially incomplete
  lastInteractionTimestamp: number; // Unix timestamp (milliseconds) for TTL management
  repromptedIndex: number | null; // Index of question user was just re-prompted for, null otherwise
}

// Structure mapping directly to DB columns for insertion into 'onboarding_responses' table
export interface OnboardingResponseForDB {
  name: string | null;
  email: string; // Must be non-null (Primary logical key, UNIQUE in DB)
  telegram?: string | null;
  github?: string | null;
  x_handle?: string | null; // Matches DB column name 'x_handle'
  languages?: string[] | null;
  other_languages?: string | null;
  blockchain_experience?: string | null;
  blockchain_platforms?: string[] | null;
  ai_experience?: string | null;
  ai_ml_areas?: string | null;
  tools_familiarity?: string | null;
  experience_level?: string | null;
  hackathon?: string[] | null;
  goal?: string | null;
  portfolio?: string | null;
  additional_skills?: string | null;
  recommended_path?: string | null;
  recommended_path_url?: string | null;
  created_at?: Date | string; // Optional field here; DB has DEFAULT NOW()
}
