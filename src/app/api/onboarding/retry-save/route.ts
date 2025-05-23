import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getSession, deleteSession } from "@/lib/session";
import { saveOnboardingResponse } from "@/lib/supabase";
import { OnboardingData } from "@/lib/types";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    // Get sessionId from request
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "Session ID is required" },
        { status: 400 },
      );
    }

    // Retrieve session data
    const sessionState = await getSession(sessionId);

    if (!sessionState) {
      return NextResponse.json(
        { success: false, error: "Session not found or expired" },
        { status: 404 },
      );
    }

    // Extract the accumulated data
    const finalData = sessionState.accumulatedData as OnboardingData;

    // Verify the email exists
    if (!finalData.email) {
      logger.error("Critical error: Missing email for session", { sessionId });
      return NextResponse.json(
        { success: false, error: "Missing required email data" },
        { status: 400 },
      );
    }

    // Try saving again
    const { success, error: saveError } =
      await saveOnboardingResponse(finalData);

    if (!success) {
      logger.error("Save failed again for session", {
        sessionId,
        error: saveError,
      });
      return NextResponse.json({
        success: false,
        error: `Save operation failed: ${saveError}`,
        message:
          "Unable to save your data. Please try again or contact support.",
      });
    }

    // Success! Delete the session
    await deleteSession(sessionId);
    logger.info("Session successfully saved and deleted", { sessionId });

    return NextResponse.json({
      success: true,
      message: "Your information has been successfully saved!",
    });
  } catch (error) {
    logger.error("Error in retry-save endpoint", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { success: false, error: `Server error: ${errorMessage}` },
      { status: 500 },
    );
  }
}
