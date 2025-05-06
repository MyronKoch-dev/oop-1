import { NextResponse } from "next/server";
import { createSession } from "@/lib/session";
import { getQuestionDetails } from "@/lib/questionnaire";

export async function POST() {
    console.log("Restart API endpoint called");

    try {
        // Create a new session
        const { sessionId } = await createSession();
        console.log(`Created new session for restart: ${sessionId}`);

        // Get the first question
        const firstQuestion = getQuestionDetails(0);

        if (!firstQuestion) {
            return NextResponse.json(
                { error: "Could not initialize the first question." },
                { status: 500 }
            );
        }

        // Return the session info and first question
        return NextResponse.json({
            success: true,
            sessionId,
            currentQuestionIndex: 0,
            nextQuestion: firstQuestion.text,
            inputMode: firstQuestion.inputMode,
            options: firstQuestion.options || [],
            conditionalTextInputLabel: firstQuestion.conditionalTextInputLabel,
            conditionalTriggerValue: firstQuestion.conditionalTriggerValue,
        });
    } catch (error) {
        console.error("Error creating new session for restart:", error);
        return NextResponse.json(
            { error: "Failed to restart the conversation. Please try again." },
            { status: 500 }
        );
    }
} 