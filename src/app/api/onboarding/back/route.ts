import { NextRequest, NextResponse } from "next/server";
import { getSession, updateSession } from "@/lib/session";

interface BackRequestPayload {
  sessionId: string;
  targetQuestionIndex: number;
}

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json();
    const { sessionId, targetQuestionIndex } =
      requestData as BackRequestPayload;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 },
      );
    }

    if (typeof targetQuestionIndex !== "number" || targetQuestionIndex < 0) {
      return NextResponse.json(
        { error: "Invalid target question index" },
        { status: 400 },
      );
    }

    // Retrieve the current session
    const session = await getSession(sessionId);
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Update the current question index in the session
    session.questionIndex = targetQuestionIndex;

    // Clear any reprompt flags
    session.repromptedIndex = null;

    // Update the session
    await updateSession(sessionId, session);

    // Return success
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error handling back navigation:", error);
    return NextResponse.json(
      { error: "Failed to process back navigation" },
      { status: 500 },
    );
  }
}
