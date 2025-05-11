// src/app/api/onboarding/message/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Import services and types
import {
  createSession,
  getSession,
  updateSession,
  deleteSession,
} from "@/lib/session";
import {
  getQuestionDetails,
  TOTAL_QUESTIONS,
  isFinalQuestion,
  QuestionDetail,
} from "@/lib/questionnaire"; // Assuming QuestionDetail is exported
import {
  validateInput,
  parseLanguages,
  parseBlockchain,
  parseAI,
  // Import other parsing functions if created
} from "@/lib/parsing";
import { determinePath, getFinalRecommendationIntro } from "@/lib/pathDetermination"; // Added getFinalRecommendationIntro
import { saveOnboardingResponse } from "@/lib/supabase";
import { OnboardingData, SessionState } from "@/lib/types"; // Ensure all needed types are imported

// Define the expected request body structure
interface OnboardingRequestPayload {
  sessionId: string | null;
  response?: string | { buttonValue: string } | string[]; // Primary response value
  conditionalText?: string | null; // Secondary text input (for Q4 Other, Q5 Yes, Q6 Yes)
}

// Define the structure for the successful response body
interface OnboardingResponsePayload {
  sessionId: string;
  newSessionId?: string; // Only present on initial request
  currentQuestionIndex: number;
  nextQuestion?: string | null; // Null if flow is complete or halted
  inputMode?: "text" | "buttons" | "conditionalText"; // Type of input expected next
  options?: { label: string; value: string }[]; // Button options
  conditionalTextInputLabel?: string;
  conditionalTriggerValue?: string;
  isFinalQuestion?: boolean; // True if the *next* step is completion or if flow just ended
  finalResult?: {
    // Present only on successful completion
    recommendedPath: string;
    recommendedPathUrl: string;
    recommendedPathDescription?: string; // Added
    secondRecommendedPath?: string;
    secondRecommendedPathUrl?: string;
    secondRecommendedPathDescription?: string; // Added
  } | null;
  error?: string | null; // User-facing error message (validation failure, session expiry)
  haltFlow?: boolean; // True if the frontend should stop the flow (e.g., fatal email validation)
  fieldErrors?: Record<string, string>;
}

// Type for batch contact info payload
interface BatchContactPayload {
  email: string;
  github?: string;
  telegram?: string;
  x?: string;
  batchContact: true;
}

// Normalize a social handle to always start with '@' if not empty/null
function normalizeHandle(handle: string | null | undefined): string | null {
  if (!handle) return null;
  handle = handle.trim();
  if (!handle) return null;
  if (!handle.startsWith("@")) {
    handle = "@" + handle;
  }
  return handle;
}

// Type guard for BatchContactPayload
function isBatchContactPayload(obj: unknown): obj is BatchContactPayload {
  return (
    typeof obj === "object" &&
    obj !== null &&
    (obj as BatchContactPayload).batchContact === true &&
    typeof (obj as BatchContactPayload).email === "string"
  );
}

/**
 * Helper function to create standardized response payloads
 * Reduces code duplication and ensures consistency in responses
 */
function createResponsePayload(
  params: Partial<OnboardingResponsePayload> & { sessionId: string; currentQuestionIndex: number }
): OnboardingResponsePayload {
  // Create payload with required fields
  const payload: OnboardingResponsePayload = {
    sessionId: params.sessionId,
    currentQuestionIndex: params.currentQuestionIndex,
    // Set defaults for optional fields
    nextQuestion: params.nextQuestion ?? null,
    inputMode: params.inputMode ?? "text",
    options: params.options ?? [],
    isFinalQuestion: params.isFinalQuestion ?? false,
    finalResult: params.finalResult ?? null,
    error: params.error ?? null,
    haltFlow: params.haltFlow ?? false,
  };

  // Add optional fields only if they exist
  if (params.newSessionId) payload.newSessionId = params.newSessionId;
  if (params.conditionalTextInputLabel) payload.conditionalTextInputLabel = params.conditionalTextInputLabel;
  if (params.conditionalTriggerValue) payload.conditionalTriggerValue = params.conditionalTriggerValue;
  if (params.fieldErrors) payload.fieldErrors = params.fieldErrors;

  return payload;
}

export async function POST(request: NextRequest) {
  const requestTimestamp = Date.now(); // For logging request time
  console.log(
    `API Hit: /api/onboarding/message at ${new Date(requestTimestamp).toISOString()}`,
  );
  let currentSessionIdForLog: string | null = null; // For consistent logging, especially on error

  try {
    // --- 0. Parse Request Body ---
    const body: OnboardingRequestPayload = await request.json();
    const requestedSessionId = body.sessionId;
    const rawResponse = body.response; // Could be string, {buttonValue: string}, string[], null
    const conditionalText = body.conditionalText; // Text from conditional inputs
    currentSessionIdForLog = requestedSessionId;
    console.log("Received request:", {
      requestedSessionId,
      type: typeof rawResponse,
      conditionalText: !!conditionalText,
    });

    // --- 1. Handle Session (Get or Create) ---
    let currentSessionState: SessionState;
    let currentSessionId: string;
    let isNewSession = false;

    if (requestedSessionId === null) {
      // Create new session for first request
      const { sessionId: newId, initialState: newlyCreatedState } =
        await createSession();
      currentSessionId = newId;
      currentSessionState = newlyCreatedState;
      currentSessionIdForLog = currentSessionId;
      isNewSession = true;
      console.log(`[Session: ${currentSessionId}] Created new session.`);
    } else {
      // Retrieve existing session
      currentSessionId = requestedSessionId;
      const retrievedState = await getSession(currentSessionId);
      currentSessionIdForLog = currentSessionId; // Set for logging even if state is null

      if (!retrievedState) {
        // Session expired or invalid - Force restart
        console.warn(
          `[Session: ${currentSessionId}] Session not found or expired. Restarting flow.`,
        );
        const { sessionId: newId, initialState: newlyCreatedState } =
          await createSession(); // Create a new one
        currentSessionState = newlyCreatedState; // Use the new state
        const firstQuestion = getQuestionDetails(0);

        // Return response immediately, indicating restart
        return NextResponse.json(
          createResponsePayload({
            sessionId: newId,
            newSessionId: newId, // Send the *new* ID back
            currentQuestionIndex: 0,
            nextQuestion: firstQuestion?.text ?? "Error: Cannot load first question.",
            inputMode: firstQuestion?.inputMode ?? "text",
            options: firstQuestion?.options ?? [],
            conditionalTextInputLabel: firstQuestion?.conditionalTextInputLabel,
            conditionalTriggerValue: firstQuestion?.conditionalTriggerValue,
            isFinalQuestion: isFinalQuestion(0),
            error: "Your session expired. Please start again.",
            haltFlow: false, // Allow restart
          })
        );
      }
      // Session retrieved successfully
      currentSessionState = retrievedState;
      console.log(
        `[Session: ${currentSessionId}] Retrieved existing session state at index ${currentSessionState.questionIndex}.`,
      );
    }

    const currentQuestionIndex = currentSessionState.questionIndex;
    const questionDetail: QuestionDetail | null =
      getQuestionDetails(currentQuestionIndex);

    // --- 2. Process Response (If not the first interaction of a new session) ---
    if (!isNewSession && questionDetail) {
      console.log(
        `[Session: ${currentSessionId}] Processing response for Q${currentQuestionIndex}`,
      );

      const isSecondAttempt =
        currentSessionState.repromptedIndex === currentQuestionIndex;
      // Clear the reprompt flag before processing this attempt's validation
      let needsReprompt = false; // Flag to determine if we return a re-prompt response

      // Batch contact info form handling
      if (currentQuestionIndex === 10 && isBatchContactPayload(rawResponse)) {
        const batch = rawResponse;
        const contactFields = [
          { key: "email", index: 10, validationHint: "email" },
          { key: "github", index: 11, validationHint: "github_username" },
          { key: "telegram", index: 12, validationHint: "telegram_handle" },
          { key: "x", index: 13, validationHint: "x_handle" },
        ];
        const errors: Record<string, string> = {};
        // Validate all fields
        for (const field of contactFields) {
          const value = batch[field.key as keyof BatchContactPayload];
          if (field.validationHint === "email") {
            if (!validateInput(value, "email")) {
              errors.email = "Please enter a valid email address.";
            }
          } else if (value && typeof value === "string") {
            // Optionally add more validation for handles if needed
            // For now, accept any string for optional handles
          }
        }
        if (Object.keys(errors).length > 0) {
          return NextResponse.json({
            sessionId: currentSessionId,
            currentQuestionIndex: 10,
            error: Object.values(errors).join(" "),
            fieldErrors: errors,
          });
        }
        // Store all fields
        const dataToUpdate = currentSessionState.accumulatedData;
        dataToUpdate.email = batch.email?.trim();
        dataToUpdate.github = batch.github?.trim() || null;
        dataToUpdate.telegram = batch.telegram?.trim() || null;
        dataToUpdate.x = batch.x?.trim() || null;
        currentSessionState.questionIndex += 4;
        await updateSession(currentSessionId, currentSessionState);
        // Continue to completion logic below
      } else {
        // 2a. Validate Input
        const isValid = validateInput(
          rawResponse,
          questionDetail.validationHint,
        );
        console.log(
          `[Session: ${currentSessionId}] Validation result for Q${currentQuestionIndex}: ${isValid}`,
        );

        // 2b. Handle Validation Failure
        if (!isValid) {
          if (!isSecondAttempt && questionDetail.rePromptMessage) {
            // --- First Failure: Set up for Re-prompt ---
            console.warn(
              `[Session: ${currentSessionId}] First validation failure for Q${currentQuestionIndex}. Setting re-prompt.`,
            );
            currentSessionState.repromptedIndex = currentQuestionIndex; // Set the flag
            needsReprompt = true; // Signal to return re-prompt response later
          } else {
            // --- Second Failure (or no re-prompt message) ---
            console.warn(
              `[Session: ${currentSessionId}] Second validation failure (or no re-prompt) for Q${currentQuestionIndex}.`,
            );
            if (
              currentQuestionIndex === 10 &&
              questionDetail.validationHint === "email"
            ) {
              // --- HALT FLOW FOR EMAIL ---
              console.error(
                `[Session: ${currentSessionId}] Halting flow: Second email validation failed.`,
              );
              // Optionally delete session here, or let it expire
              // await deleteSession(currentSessionId);
              return NextResponse.json(
                createResponsePayload({
                  sessionId: currentSessionId,
                  currentQuestionIndex: currentQuestionIndex,
                  error: "A valid email address is required. Please refresh to start over.",
                  haltFlow: true, // Signal frontend to stop
                })
              );
            } else {
              // --- Proceed with NULL/default for other fields ---
              console.log(
                `[Session: ${currentSessionId}] Proceeding with null/default for Q${currentQuestionIndex} after second validation failure.`,
              );
              // Allow flow to continue, parsing logic will handle storing null/default.
              // Ensure reprompt flag is cleared if it was somehow set
              currentSessionState.repromptedIndex = null;
            }
          }
        } else {
          // Validation succeeded, clear any lingering reprompt flag
          currentSessionState.repromptedIndex = null;
        }

        // If we need to re-prompt based on the logic above, do it now *before* parsing/advancing
        if (needsReprompt) {
          await updateSession(currentSessionId, currentSessionState); // Save the reprompt flag state
          return NextResponse.json(
            createResponsePayload({
              sessionId: currentSessionId,
              currentQuestionIndex: currentQuestionIndex, // Stay on same question
              nextQuestion: questionDetail.text,
              inputMode: questionDetail.inputMode,
              options: questionDetail.options ?? [],
              conditionalTextInputLabel: questionDetail.conditionalTextInputLabel,
              conditionalTriggerValue: questionDetail.conditionalTriggerValue,
              isFinalQuestion: isFinalQuestion(currentQuestionIndex),
              error: questionDetail.rePromptMessage, // Send re-prompt message
              haltFlow: false,
            })
          );
        }

        // 2c. Parse and Store Response (Only if validation passed or it's a non-halting second failure)
        console.log(
          `[Session: ${currentSessionId}] Parsing and storing response for Q${currentQuestionIndex}`,
        );
        const dataToUpdate = currentSessionState.accumulatedData;
        const responseToParse = isValid ? rawResponse : null;

        switch (currentQuestionIndex) {
          case 0:
            dataToUpdate.name =
              typeof responseToParse === "string"
                ? responseToParse.trim() || null
                : null;
            break;
          case 1:
            dataToUpdate.experience_level =
              (responseToParse as { buttonValue: string })?.buttonValue ?? null;
            break;
          case 2:
            parseLanguages(responseToParse, dataToUpdate);
            console.log("[PATCH] Stored languages:", dataToUpdate.languages);
            break;
          case 3:
            parseBlockchain(
              {
                buttonValue: (responseToParse as { buttonValue: string })
                  ?.buttonValue,
                selectedValues: (
                  responseToParse as { selectedValues?: string[] }
                )?.selectedValues,
              },
              conditionalText,
              dataToUpdate,
            );
            console.log(
              "[PATCH] Stored blockchain_experience:",
              dataToUpdate.blockchain_experience,
            );
            console.log(
              "[PATCH] Stored blockchain_platforms:",
              dataToUpdate.blockchain_platforms,
            );
            break;
          case 4:
            parseAI(
              responseToParse as { buttonValue: string } | null,
              conditionalText,
              dataToUpdate,
            );
            break;
          case 5:
            dataToUpdate.tools_familiarity =
              (responseToParse as { buttonValue: string })?.buttonValue ?? null;
            break;
          case 6:
            if (
              responseToParse &&
              typeof responseToParse === "object" &&
              "selectedValues" in responseToParse &&
              Array.isArray(responseToParse.selectedValues)
            ) {
              dataToUpdate.hackathon = responseToParse.selectedValues;
            } else if (
              responseToParse &&
              typeof responseToParse === "object" &&
              "buttonValue" in responseToParse &&
              typeof responseToParse.buttonValue === "string"
            ) {
              dataToUpdate.hackathon = [responseToParse.buttonValue];
            } else if (typeof responseToParse === "string") {
              dataToUpdate.hackathon = [responseToParse];
            } else {
              dataToUpdate.hackathon = null;
            }
            break;
          case 7:
            if (Array.isArray(responseToParse)) {
              dataToUpdate.goal = responseToParse;
            } else if (
              responseToParse &&
              typeof responseToParse === "object" &&
              "buttonValue" in responseToParse &&
              typeof responseToParse.buttonValue === "string"
            ) {
              dataToUpdate.goal = [responseToParse.buttonValue];
            } else if (typeof responseToParse === "string") {
              dataToUpdate.goal = [responseToParse];
            } else {
              dataToUpdate.goal = null;
            }
            break;
          case 8:
            if (typeof responseToParse === "string") {
              const portfolio = responseToParse.trim();
              if (
                portfolio &&
                !["none", "no", "n/a"].includes(portfolio.toLowerCase())
              ) {
                dataToUpdate.portfolio = portfolio;
              } else {
                dataToUpdate.portfolio = null;
              }
            } else {
              dataToUpdate.portfolio = null;
            }
            break;
          case 9:
            if (typeof responseToParse === "string") {
              const additionalSkills = responseToParse.trim();
              if (
                additionalSkills &&
                !["none", "no", "n/a"].includes(additionalSkills.toLowerCase())
              ) {
                dataToUpdate.additional_skills = additionalSkills;
              } else {
                dataToUpdate.additional_skills = null;
              }
            } else {
              dataToUpdate.additional_skills = null;
            }
            break;
          case 10: // Email
            if (isValid && typeof responseToParse === "string") {
              dataToUpdate.email = responseToParse.trim();
            } else if (!isValid && isSecondAttempt) {
              console.error(
                "Logic Error: Reached email storage after second validation failure!",
              );
              // Do not assign anything here; flow should have halted.
            }
            // No assignment needed on first failure (reprompt)
            break;
          case 11: // GitHub username
            if (typeof responseToParse === "string") {
              const githubUsername = responseToParse.trim().toLowerCase();
              if (
                githubUsername &&
                !["none", "no", "n/a"].includes(githubUsername)
              ) {
                dataToUpdate.github = githubUsername.replace(/^@/, "");
              } else {
                dataToUpdate.github = null;
              }
            } else {
              dataToUpdate.github = null;
            }
            break;
          case 12: // Telegram handle
            if (typeof responseToParse === "string") {
              const telegramHandle = responseToParse.trim().toLowerCase();
              if (
                telegramHandle &&
                !["none", "no", "n/a"].includes(telegramHandle)
              ) {
                dataToUpdate.telegram = normalizeHandle(telegramHandle);
              } else {
                dataToUpdate.telegram = null;
              }
            } else {
              dataToUpdate.telegram = null;
            }
            break;
          case 13: // X/Twitter handle
            if (typeof responseToParse === "string") {
              const xHandle = responseToParse.trim().toLowerCase();
              if (xHandle && !["none", "no", "n/a"].includes(xHandle)) {
                dataToUpdate.x = normalizeHandle(xHandle);
              } else {
                dataToUpdate.x = null;
              }
            } else {
              dataToUpdate.x = null;
            }
            break;
          default:
            console.warn(
              `[Session: ${currentSessionId}] No parsing/storing logic defined for question index ${currentQuestionIndex}`,
            );
        }

        // 2d. Advance Question Index
        currentSessionState.questionIndex++;
        console.log(
          `[Session: ${currentSessionId}] Advancing to index ${currentSessionState.questionIndex}`,
        );
      }
    } // End of processing block

    // --- 3. Check for Completion ---
    const nextQuestionIndex = currentSessionState.questionIndex;
    if (nextQuestionIndex >= TOTAL_QUESTIONS) {
      console.log(
        `[Session: ${currentSessionId}] Onboarding complete. Processing final data...`,
      );

      const finalData = currentSessionState.accumulatedData as OnboardingData;
      finalData.createdAt = new Date(); // Add completion timestamp

      // Critical check: Ensure email is present after all processing
      if (!finalData.email) {
        console.error(
          `[Session: ${currentSessionId}] Critical error: Reached completion block without a valid email. Halting.`,
        );
        await deleteSession(currentSessionId); // Clean up broken session
        return NextResponse.json(
          { error: "Internal processing error: Missing required email data." },
          { status: 500 },
        );
      }

      // 3a. Determine Path
      const {
        recommendedPath,
        recommendedPathUrl,
        recommendedPathDescription, // Added
        secondRecommendedPath,
        secondRecommendedPathUrl,
        secondRecommendedPathDescription // Added
      } = determinePath(finalData);
      finalData.recommendedPath = recommendedPath;
      finalData.recommendedPathUrl = recommendedPathUrl;
      // Descriptions are not typically stored in finalData for DB, but used in response
      finalData.secondRecommendedPath = secondRecommendedPath;
      finalData.secondRecommendedPathUrl = secondRecommendedPathUrl;

      console.log(
        `[Session: ${currentSessionId}] Determined Path: ${recommendedPath}`,
      );
      if (secondRecommendedPath) {
        console.log(
          `[Session: ${currentSessionId}] Second Recommended Path: ${secondRecommendedPath}`,
        );
      }

      // 3b. Save to Database
      const { success: dbSaveSuccess, error: dbSaveError } =
        await saveOnboardingResponse(finalData);
      if (!dbSaveSuccess) {
        console.error(
          `DB Save failed for session ${currentSessionId}: ${dbSaveError}`,
        );

        // Don't delete the session on save failure to allow for retry
        // Return with error but maintain the session
        return NextResponse.json(
          createResponsePayload({
            sessionId: currentSessionId,
            currentQuestionIndex: nextQuestionIndex,
            isFinalQuestion: true,
            finalResult: {
              recommendedPath,
              recommendedPathUrl,
              recommendedPathDescription, // Added
              secondRecommendedPath,
              secondRecommendedPathUrl,
              secondRecommendedPathDescription // Added
            },
            error: `Completed, but profile saving failed: ${dbSaveError}. Your data has been preserved for retry.`,
            // Add a property to indicate this is a save retry scenario
            haltFlow: false,
          })
        );
      }

      // Only delete the session if DB save was successful
      await deleteSession(currentSessionId);
      console.log(
        `[Session: ${currentSessionId}] Session deleted after successful completion.`,
      );

      // 3d. Return Final Result for successful saves
      const introductoryMessage = getFinalRecommendationIntro(
        finalData.name,
        recommendedPath,
        finalData.goal
      );

      return NextResponse.json(
        createResponsePayload({
          sessionId: currentSessionId,
          currentQuestionIndex: nextQuestionIndex, // Index is now >= TOTAL_QUESTIONS
          nextQuestion: introductoryMessage, // <-- ADDED THIS LINE
          isFinalQuestion: true, // Signifies flow end
          finalResult: {
            recommendedPath,
            recommendedPathUrl,
            recommendedPathDescription, // Added
            secondRecommendedPath,
            secondRecommendedPathUrl,
            secondRecommendedPathDescription // Added
          },
          error: null,
        })
      );
    }

    // --- 4. Prepare Response for Next Question ---
    const nextQuestionDetail = getQuestionDetails(nextQuestionIndex);
    if (!nextQuestionDetail) {
      // This should theoretically not happen if TOTAL_QUESTIONS is correct
      throw new Error(
        `Consistency error: Could not find details for next question index ${nextQuestionIndex}`,
      );
    }

    // --- 5. Save Updated Session State ---
    if (!isNewSession) {
      await updateSession(currentSessionId, currentSessionState);
    }

    // --- 6. Return Next Question Details ---
    return NextResponse.json(
      createResponsePayload({
        sessionId: currentSessionId,
        // Conditionally add newSessionId if it's a new session
        ...(isNewSession && { newSessionId: currentSessionId }),
        currentQuestionIndex: nextQuestionIndex,
        nextQuestion: nextQuestionDetail.text,
        inputMode: nextQuestionDetail.inputMode,
        options: nextQuestionDetail.options ?? [],
        conditionalTextInputLabel: nextQuestionDetail.conditionalTextInputLabel,
        conditionalTriggerValue: nextQuestionDetail.conditionalTriggerValue,
        isFinalQuestion: isFinalQuestion(nextQuestionIndex),
      })
    );
  } catch (error) {
    console.error(
      `API Error (Session: ${currentSessionIdForLog ?? "N/A"}):`,
      error,
    );
    const errorMessage =
      error instanceof Error ? error.message : "Unknown processing error";
    // Log the detailed message server-side
    console.error(`Detailed error message: ${errorMessage}`);
    // Return generic message to client
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 },
    );
  } finally {
    // Optional: Log total request processing time
    const duration = Date.now() - requestTimestamp;
    console.log(
      `Request processed in ${duration}ms (Session: ${currentSessionIdForLog ?? "N/A"})`,
    );
  }
}

// --- GET Handler (for testing connectivity) ---
export async function GET() {
  console.log("GET /api/onboarding/message received");
  try {
    // Test session creation/deletion
    const { sessionId: testSessionId } = await createSession();
    const retrieved = await getSession(testSessionId);
    await deleteSession(testSessionId);

    // Test DB connection indirectly by checking client init (already logged)
    // You could add a simple Supabase query here if needed e.g., .from('onboarding_responses').select('id', { count: 'exact', head: true })

    if (retrieved) {
      console.log("GET check: Session service appears connected.");
      return NextResponse.json({
        status: "OK",
        message: "API running. Session Service connected.",
        services: ["Session (Redis)", "Database (Supabase)"],
      });
    } else {
      console.error("GET check: Session service failed post-create check.");
      return NextResponse.json(
        {
          status: "ERROR",
          message: "API running. Session Service failed post-create check.",
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("GET check: Error during service connection test:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        status: "ERROR",
        message: "API running. Error testing service connections.",
        error: errorMessage,
      },
      { status: 500 },
    );
  }
}
