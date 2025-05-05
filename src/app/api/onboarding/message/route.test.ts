// src/app/api/onboarding/message/route.test.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { POST, GET } from "./route"; // Import POST and GET handlers
import { SessionState, OnboardingData } from "@/lib/types"; // Import types

// --- Mock Dependencies ---
// Mock the session module
jest.mock("@/lib/session", () => ({
  createSession: jest.fn(),
  getSession: jest.fn(),
  updateSession: jest.fn(),
  deleteSession: jest.fn(),
}));

// Mock the questionnaire module
jest.mock("@/lib/questionnaire", () => ({
  getQuestionDetails: jest.fn(),
  TOTAL_QUESTIONS: 0, // Will be overridden in tests
  isFinalQuestion: jest.fn(),
  // Assuming QuestionDetail type might be needed, but Jest handles types implicitly
}));

// Mock the parsing module
jest.mock("@/lib/parsing", () => ({
  validateInput: jest.fn(),
  // Mock individual parsers just as empty functions for simplicity in happy path
  parseLanguages: jest.fn(),
  parseBlockchain: jest.fn(),
  parseAI: jest.fn(),
}));

// Mock the path determination module
jest.mock("@/lib/pathDetermination", () => ({
  determinePath: jest.fn(),
}));

// Mock the supabase module
jest.mock("@/lib/supabase", () => ({
  saveOnboardingResponse: jest.fn(),
}));

// Import the mocked functions AFTER jest.mock calls
import {
  createSession,
  getSession,
  updateSession,
  deleteSession,
} from "@/lib/session";
import {
  getQuestionDetails,
  isFinalQuestion,
  TOTAL_QUESTIONS as MOCKED_TOTAL_QUESTIONS, // Alias to avoid conflict if needed
} from "@/lib/questionnaire";
import { validateInput } from "@/lib/parsing";
import { determinePath } from "@/lib/pathDetermination";
import { saveOnboardingResponse } from "@/lib/supabase";

// --- Test Suite ---
// Describe block groups related tests for the API route
describe("/api/onboarding/message API Route", () => {
  // --- Mocks Setup (Before Each Test) ---
  // Cast mocks to Jest Mock types for type safety
  const mockCreateSession = createSession as jest.Mock;
  const mockGetSession = getSession as jest.Mock;
  const mockUpdateSession = updateSession as jest.Mock;
  const mockDeleteSession = deleteSession as jest.Mock;
  const mockGetQuestionDetails = getQuestionDetails as jest.Mock;
  const mockIsFinalQuestion = isFinalQuestion as jest.Mock;
  const mockValidateInput = validateInput as jest.Mock;
  const mockDeterminePath = determinePath as jest.Mock;
  const mockSaveOnboardingResponse = saveOnboardingResponse as jest.Mock;

  // Helper to create a mock NextRequest
  const createMockRequest = (body: any): NextRequest => {
    return {
      json: jest.fn().mockResolvedValue(body),
      // Add other NextRequest properties if needed by the handler
    } as unknown as NextRequest;
  };

  // Reset mocks before each test to ensure isolation
  beforeEach(() => {
    jest.clearAllMocks(); // Clears mock usage data (calls, instances)
    // NOTE: We will set specific return values *within* each test case
    //       because the return values depend on the state of the conversation.

    // Default validation for happy path: always valid
    mockValidateInput.mockReturnValue(true);
    // Default save response: success
    mockSaveOnboardingResponse.mockResolvedValue({
      success: true,
      error: null,
    });
    // Default path determination
    mockDeterminePath.mockReturnValue({
      recommendedPath: "Explorer Path",
      recommendedPathUrl: "http://explorer.path",
    });
    // Default isFinalQuestion (can be overridden)
    mockIsFinalQuestion.mockImplementation(
      (index: number) => index >= (MOCKED_TOTAL_QUESTIONS as number),
    ); // Use the potentially overridden total
    // Default TOTAL_QUESTIONS to avoid test failures if not overridden
    Object.defineProperty(require("@/lib/questionnaire"), "TOTAL_QUESTIONS", {
      value: 14, // Default to match the new total questions
      writable: true,
    });
  });

  // --- Test Cases ---

  test("should successfully complete the onboarding flow (Happy Path - Explorer Path)", async () => {
    // --- Test Configuration ---
    const MOCK_SESSION_ID = "happy-path-session-123";
    const TOTAL_QUESTIONS_FOR_TEST = 5;
    // Override the mocked TOTAL_QUESTIONS for this test suite
    Object.defineProperty(require("@/lib/questionnaire"), "TOTAL_QUESTIONS", {
      value: TOTAL_QUESTIONS_FOR_TEST,
      writable: true, // Allow overriding
    });

    const MOCK_QUESTIONS = [
      {
        index: 0,
        text: "Q0: Name?",
        inputMode: "text",
        validationHint: "text",
        options: [],
        conditionalTextInputLabel: null,
        conditionalTriggerValue: null,
      },
      {
        index: 1,
        text: "Q1: Languages?",
        inputMode: "buttons",
        validationHint: "languages",
        options: [],
        conditionalTextInputLabel: null,
        conditionalTriggerValue: null,
      },
      {
        index: 2,
        text: "Q2: Blockchain?",
        inputMode: "buttons",
        validationHint: "blockchain_platforms",
        options: [],
        conditionalTextInputLabel: null,
        conditionalTriggerValue: null,
      },
      {
        index: 3,
        text: "Q3: AI/ML?",
        inputMode: "buttons",
        validationHint: undefined,
        options: [],
        conditionalTextInputLabel: null,
        conditionalTriggerValue: null,
      },
      {
        index: 4,
        text: "Q4: Tools?",
        inputMode: "buttons",
        validationHint: undefined,
        options: [],
        conditionalTextInputLabel: null,
        conditionalTriggerValue: null,
      },
      {
        index: 5,
        text: "Q5: Technical expertise?",
        inputMode: "buttons",
        validationHint: undefined,
        options: [],
        conditionalTextInputLabel: null,
        conditionalTriggerValue: null,
      },
      {
        index: 6,
        text: "Q6: Hackathon?",
        inputMode: "buttons",
        validationHint: undefined,
        options: [],
        conditionalTextInputLabel: null,
        conditionalTriggerValue: null,
      },
      {
        index: 7,
        text: "Q7: Main goal?",
        inputMode: "buttons",
        validationHint: undefined,
        options: [],
        conditionalTextInputLabel: null,
        conditionalTriggerValue: null,
      },
      {
        index: 8,
        text: "Q8: Portfolio?",
        inputMode: "text",
        validationHint: undefined,
        options: [],
        conditionalTextInputLabel: null,
        conditionalTriggerValue: null,
      },
      {
        index: 9,
        text: "Q9: Additional skills?",
        inputMode: "text",
        validationHint: undefined,
        options: [],
        conditionalTextInputLabel: null,
        conditionalTriggerValue: null,
      },
      {
        index: 10,
        text: "Q10: Email?",
        inputMode: "text",
        validationHint: "email",
        options: [],
        conditionalTextInputLabel: null,
        conditionalTriggerValue: null,
      },
      {
        index: 11,
        text: "Q11: GitHub?",
        inputMode: "text",
        validationHint: "github_username",
        options: [],
        conditionalTextInputLabel: null,
        conditionalTriggerValue: null,
      },
      {
        index: 12,
        text: "Q12: Telegram?",
        inputMode: "text",
        validationHint: "telegram_handle",
        options: [],
        conditionalTextInputLabel: null,
        conditionalTriggerValue: null,
      },
      {
        index: 13,
        text: "Q13: X/Twitter?",
        inputMode: "text",
        validationHint: "x_handle",
        options: [],
        conditionalTextInputLabel: null,
        conditionalTriggerValue: null,
      },
    ];
    const MOCK_FINAL_PATH = {
      recommendedPath: "Explorer Path",
      recommendedPathUrl: "http://explorer.path",
    };

    let currentSessionState: SessionState = {
      questionIndex: 0,
      accumulatedData: {},
      repromptedIndex: null,
      lastInteractionTimestamp: Date.now(),
    };

    // Mock implementations specific to this test flow
    mockCreateSession.mockResolvedValue({
      sessionId: MOCK_SESSION_ID,
      initialState: { ...currentSessionState },
    }); // Initial state for new session
    mockGetSession.mockImplementation(async (sessionId: string) => {
      if (sessionId === MOCK_SESSION_ID) {
        // Return a copy to avoid mutation issues between steps
        return JSON.parse(JSON.stringify(currentSessionState));
      }
      return null;
    });
    mockUpdateSession.mockImplementation(
      async (sessionId: string, newState: SessionState) => {
        if (sessionId === MOCK_SESSION_ID) {
          currentSessionState = JSON.parse(JSON.stringify(newState)); // Update the state for the next getSession call
        }
      },
    );
    mockGetQuestionDetails.mockImplementation((index: number) => {
      return MOCK_QUESTIONS.find((q) => q.index === index) || null;
    });
    mockDeterminePath.mockReturnValue(MOCK_FINAL_PATH);
    mockDeleteSession.mockResolvedValue(undefined); // Successful deletion

    // --- Simulation Step 1: Start Conversation ---
    console.log("[Test Step 1] Starting conversation...");
    let request = createMockRequest({ sessionId: null }); // Start new session
    let response = await POST(request);
    let body = await response.json();

    expect(response.status).toBe(200);
    expect(mockCreateSession).toHaveBeenCalledTimes(1);
    expect(body.sessionId).toBe(MOCK_SESSION_ID);
    expect(body.newSessionId).toBe(MOCK_SESSION_ID); // Should be present on first call
    expect(body.currentQuestionIndex).toBe(0);
    expect(body.nextQuestion).toBe(MOCK_QUESTIONS[0].text);
    expect(body.error).toBeNull();
    expect(body.isFinalQuestion).toBe(false);
    expect(currentSessionState.questionIndex).toBe(0); // State updated by createSession return

    // --- Simulation Step 2: Answer Q0 (Name) ---
    console.log("[Test Step 2] Answering Q0...");
    request = createMockRequest({
      sessionId: MOCK_SESSION_ID,
      response: "Test User",
    });
    response = await POST(request);
    body = await response.json();

    expect(response.status).toBe(200);
    expect(mockUpdateSession).toHaveBeenCalledTimes(1); // First update
    expect(mockGetSession).toHaveBeenCalledTimes(1); // First get
    expect(body.sessionId).toBe(MOCK_SESSION_ID);
    expect(body.newSessionId).toBeUndefined(); // Should NOT be present after first call
    expect(body.currentQuestionIndex).toBe(1);
    expect(body.nextQuestion).toBe(MOCK_QUESTIONS[1].text);
    expect(body.error).toBeNull();
    expect(body.isFinalQuestion).toBe(false);
    expect(currentSessionState.questionIndex).toBe(1); // State advanced
    expect(currentSessionState.accumulatedData.name).toBe("Test User"); // Check data stored

    // --- Simulation Step 3: Answer Q1 (Languages) ---
    console.log("[Test Step 3] Answering Q1...");
    request = createMockRequest({
      sessionId: MOCK_SESSION_ID,
      response: ["JavaScript", "Python"],
    });
    response = await POST(request);
    body = await response.json();

    expect(response.status).toBe(200);
    expect(mockUpdateSession).toHaveBeenCalledTimes(2);
    expect(mockGetSession).toHaveBeenCalledTimes(2);
    expect(body.sessionId).toBe(MOCK_SESSION_ID);
    expect(body.currentQuestionIndex).toBe(2);
    expect(body.nextQuestion).toBe(MOCK_QUESTIONS[2].text);
    expect(body.inputMode).toBe("buttons");
    expect(body.error).toBeNull();
    expect(body.isFinalQuestion).toBe(false); // isFinalQuestion checks the *next* step
    expect(currentSessionState.questionIndex).toBe(2); // State advanced

    // --- Simulation Step 4: Answer Q2 (Blockchain) ---
    console.log("[Test Step 4] Answering Q2 (Blockchain)...");
    request = createMockRequest({
      sessionId: MOCK_SESSION_ID,
      response: "Ethereum",
    });
    response = await POST(request);
    body = await response.json();

    expect(response.status).toBe(200);
    expect(mockUpdateSession).toHaveBeenCalledTimes(3);
    expect(mockGetSession).toHaveBeenCalledTimes(3);
    expect(body.sessionId).toBe(MOCK_SESSION_ID);
    expect(body.currentQuestionIndex).toBe(3);
    expect(body.nextQuestion).toBe(MOCK_QUESTIONS[3].text);
    expect(body.inputMode).toBe("buttons");
    expect(body.error).toBeNull();
    expect(body.isFinalQuestion).toBe(false);
    expect(currentSessionState.questionIndex).toBe(3); // State advanced

    // --- Simulation Step 5: Answer Q3 (AI/ML) ---
    console.log("[Test Step 5] Answering Q3 (AI/ML)...");
    request = createMockRequest({
      sessionId: MOCK_SESSION_ID,
      response: "Machine Learning",
    });
    response = await POST(request);
    body = await response.json();

    expect(response.status).toBe(200);
    expect(mockUpdateSession).toHaveBeenCalledTimes(4);
    expect(mockGetSession).toHaveBeenCalledTimes(4);
    expect(body.sessionId).toBe(MOCK_SESSION_ID);
    expect(body.currentQuestionIndex).toBe(4);
    expect(body.nextQuestion).toBe(MOCK_QUESTIONS[4].text);
    expect(body.inputMode).toBe("buttons");
    expect(body.error).toBeNull();
    expect(body.isFinalQuestion).toBe(false);
    expect(currentSessionState.questionIndex).toBe(4); // State advanced

    // --- Simulation Step 6: Answer Q4 (Tools) ---
    console.log("[Test Step 6] Answering Q4 (Tools)...");
    request = createMockRequest({
      sessionId: MOCK_SESSION_ID,
      response: "GitHub",
    });
    response = await POST(request);
    body = await response.json();

    expect(response.status).toBe(200);
    expect(mockUpdateSession).toHaveBeenCalledTimes(5);
    expect(mockGetSession).toHaveBeenCalledTimes(5);
    expect(body.sessionId).toBe(MOCK_SESSION_ID);
    expect(body.currentQuestionIndex).toBe(5);
    expect(body.nextQuestion).toBe(MOCK_QUESTIONS[5].text);
    expect(body.inputMode).toBe("buttons");
    expect(body.error).toBeNull();
    expect(body.isFinalQuestion).toBe(false);
    expect(currentSessionState.questionIndex).toBe(5); // State advanced

    // --- Simulation Step 7: Answer Q5 (Technical expertise) ---
    console.log("[Test Step 7] Answering Q5 (Technical expertise)...");
    request = createMockRequest({
      sessionId: MOCK_SESSION_ID,
      response: "Intermediate",
    });
    response = await POST(request);
    body = await response.json();

    expect(response.status).toBe(200);
    expect(mockUpdateSession).toHaveBeenCalledTimes(6);
    expect(mockGetSession).toHaveBeenCalledTimes(6);
    expect(body.sessionId).toBe(MOCK_SESSION_ID);
    expect(body.currentQuestionIndex).toBe(6);
    expect(body.nextQuestion).toBe(MOCK_QUESTIONS[6].text);
    expect(body.inputMode).toBe("buttons");
    expect(body.error).toBeNull();
    expect(body.isFinalQuestion).toBe(false);
    expect(currentSessionState.questionIndex).toBe(6); // State advanced
    expect(currentSessionState.accumulatedData.experience_level).toBe(
      "Intermediate",
    );

    // --- Simulation Step 8: Answer Q6 (Hackathon) ---
    console.log("[Test Step 8] Answering Q6 (Hackathon)...");
    request = createMockRequest({
      sessionId: MOCK_SESSION_ID,
      response: "Yes",
    });
    response = await POST(request);
    body = await response.json();

    expect(response.status).toBe(200);
    expect(mockUpdateSession).toHaveBeenCalledTimes(7);
    expect(mockGetSession).toHaveBeenCalledTimes(7);
    expect(body.sessionId).toBe(MOCK_SESSION_ID);
    expect(body.currentQuestionIndex).toBe(7);
    expect(body.nextQuestion).toBe(MOCK_QUESTIONS[7].text);
    expect(body.inputMode).toBe("buttons");
    expect(body.error).toBeNull();
    expect(body.isFinalQuestion).toBe(false);
    expect(currentSessionState.questionIndex).toBe(7); // State advanced
    expect(currentSessionState.accumulatedData.hackathon).toBe("Yes");

    // --- Simulation Step 9: Answer Q7 (Main goal) ---
    console.log("[Test Step 9] Answering Q7 (Main goal)...");
    request = createMockRequest({
      sessionId: MOCK_SESSION_ID,
      response: "Share ideas for new features",
    });
    response = await POST(request);
    body = await response.json();

    expect(response.status).toBe(200);
    expect(mockUpdateSession).toHaveBeenCalledTimes(8);
    expect(mockGetSession).toHaveBeenCalledTimes(8);
    expect(body.sessionId).toBe(MOCK_SESSION_ID);
    expect(body.currentQuestionIndex).toBe(8);
    expect(body.nextQuestion).toBe(MOCK_QUESTIONS[8].text);
    expect(body.inputMode).toBe("buttons");
    expect(body.error).toBeNull();
    expect(body.isFinalQuestion).toBe(false);
    expect(currentSessionState.questionIndex).toBe(8); // State advanced
    expect(currentSessionState.accumulatedData.goal).toBe(
      "Share ideas for new features",
    );

    // --- Simulation Step 10: Answer Q8 (Portfolio) ---
    console.log("[Test Step 10] Answering Q8 (Portfolio)...");
    request = createMockRequest({
      sessionId: MOCK_SESSION_ID,
      response: "https://github.com/testuser/portfolio",
    });
    response = await POST(request);
    body = await response.json();

    expect(response.status).toBe(200);
    expect(mockUpdateSession).toHaveBeenCalledTimes(9);
    expect(mockGetSession).toHaveBeenCalledTimes(9);
    expect(body.sessionId).toBe(MOCK_SESSION_ID);
    expect(body.currentQuestionIndex).toBe(9);
    expect(body.nextQuestion).toBe(MOCK_QUESTIONS[9].text);
    expect(body.inputMode).toBe("text");
    expect(body.error).toBeNull();
    expect(body.isFinalQuestion).toBe(false);
    expect(currentSessionState.questionIndex).toBe(9); // State advanced
    expect(currentSessionState.accumulatedData.portfolio).toBe(
      "https://github.com/testuser/portfolio",
    );

    // --- Simulation Step 11: Answer Q9 (Additional skills) ---
    console.log("[Test Step 11] Answering Q9 (Additional skills)...");
    request = createMockRequest({
      sessionId: MOCK_SESSION_ID,
      response: "Problem Solving",
    });
    response = await POST(request);
    body = await response.json();

    expect(response.status).toBe(200);
    expect(mockUpdateSession).toHaveBeenCalledTimes(10);
    expect(mockGetSession).toHaveBeenCalledTimes(10);
    expect(body.sessionId).toBe(MOCK_SESSION_ID);
    expect(body.currentQuestionIndex).toBe(10);
    expect(body.nextQuestion).toBe(MOCK_QUESTIONS[10].text);
    expect(body.inputMode).toBe("text");
    expect(body.error).toBeNull();
    expect(body.isFinalQuestion).toBe(false);
    expect(currentSessionState.questionIndex).toBe(10); // State advanced
    expect(currentSessionState.accumulatedData.additional_skills).toBe(
      "Problem Solving",
    );

    // --- Simulation Step 12: Answer Q10 (Email) ---
    console.log("[Test Step 12] Answering Q10 (Email)...");
    request = createMockRequest({
      sessionId: MOCK_SESSION_ID,
      response: "test@example.com",
    });
    response = await POST(request);
    body = await response.json();

    expect(response.status).toBe(200);
    expect(mockUpdateSession).toHaveBeenCalledTimes(11);
    expect(mockGetSession).toHaveBeenCalledTimes(11);
    expect(body.sessionId).toBe(MOCK_SESSION_ID);
    expect(body.currentQuestionIndex).toBe(11);
    expect(body.nextQuestion).toBe(MOCK_QUESTIONS[11].text);
    expect(body.inputMode).toBe("text");
    expect(body.error).toBeNull();
    expect(body.isFinalQuestion).toBe(false);
    expect(currentSessionState.questionIndex).toBe(11); // State advanced
    expect(currentSessionState.accumulatedData.email).toBe("test@example.com");

    // --- Simulation Step 13: Answer Q11 (GitHub) ---
    console.log("[Test Step 13] Answering Q11 (GitHub)...");
    request = createMockRequest({
      sessionId: MOCK_SESSION_ID,
      response: "testuser123",
    });
    response = await POST(request);
    body = await response.json();

    expect(response.status).toBe(200);
    expect(mockUpdateSession).toHaveBeenCalledTimes(12);
    expect(mockGetSession).toHaveBeenCalledTimes(12);
    expect(body.sessionId).toBe(MOCK_SESSION_ID);
    expect(body.currentQuestionIndex).toBe(12);
    expect(body.nextQuestion).toBe(MOCK_QUESTIONS[12].text);
    expect(body.inputMode).toBe("text");
    expect(body.error).toBeNull();
    expect(body.isFinalQuestion).toBe(false);
    expect(currentSessionState.questionIndex).toBe(12); // State advanced
    expect(currentSessionState.accumulatedData.github).toBe("testuser123");

    // --- Simulation Step 14: Answer Q12 (Telegram) ---
    console.log("[Test Step 14] Answering Q12 (Telegram)...");
    request = createMockRequest({
      sessionId: MOCK_SESSION_ID,
      response: "@telegramuser",
    });
    response = await POST(request);
    body = await response.json();

    expect(response.status).toBe(200);
    expect(mockUpdateSession).toHaveBeenCalledTimes(13);
    expect(mockGetSession).toHaveBeenCalledTimes(13);
    expect(body.sessionId).toBe(MOCK_SESSION_ID);
    expect(body.currentQuestionIndex).toBe(13);
    expect(body.nextQuestion).toBe(MOCK_QUESTIONS[13].text);
    expect(body.inputMode).toBe("text");
    expect(body.error).toBeNull();
    expect(body.isFinalQuestion).toBe(false);
    expect(currentSessionState.questionIndex).toBe(13); // State advanced
    expect(currentSessionState.accumulatedData.telegram).toBe("@telegramuser");

    // --- Simulation Step 15: Answer Q13 (X/Twitter) ---
    console.log("[Test Step 15] Answering Q13 (X/Twitter)...");
    request = createMockRequest({
      sessionId: MOCK_SESSION_ID,
      response: "@twitteruser",
    });
    response = await POST(request);
    body = await response.json();

    expect(response.status).toBe(200);
    expect(mockUpdateSession).toHaveBeenCalledTimes(14);
    expect(mockGetSession).toHaveBeenCalledTimes(14);
    expect(body.sessionId).toBe(MOCK_SESSION_ID);
    expect(body.currentQuestionIndex).toBe(TOTAL_QUESTIONS_FOR_TEST); // Index is now >= total
    expect(body.nextQuestion).toBeUndefined(); // No next question
    expect(body.isFinalQuestion).toBe(true); // Flow is complete
    expect(body.finalResult).toBeDefined();
    expect(body.finalResult?.recommendedPath).toBe(
      MOCK_FINAL_PATH.recommendedPath,
    );
    expect(body.finalResult?.recommendedPathUrl).toBe(
      MOCK_FINAL_PATH.recommendedPathUrl,
    );
    expect(body.error).toBeNull();

    // Check that final steps were taken
    expect(mockDeterminePath).toHaveBeenCalledTimes(1);
    // Check if the data passed to determinePath looks reasonable (has name, email, handles)
    expect(mockDeterminePath).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Test User",
        email: "test@example.com",
        github: "testuser123",
        telegram: "@telegramuser",
        x: "@twitteruser",
        // ... other fields would be checked based on actual parsing logic if mocked less simply
      }),
    );
    expect(mockSaveOnboardingResponse).toHaveBeenCalledTimes(1);
    // Check if data passed to save includes the determined path
    expect(mockSaveOnboardingResponse).toHaveBeenCalledWith(
      expect.objectContaining({
        recommendedPath: MOCK_FINAL_PATH.recommendedPath,
        recommendedPathUrl: MOCK_FINAL_PATH.recommendedPathUrl,
        email: "test@example.com", // Ensure critical email is there
      }),
    );
    expect(mockDeleteSession).toHaveBeenCalledTimes(1);
    expect(mockDeleteSession).toHaveBeenCalledWith(MOCK_SESSION_ID);
  });

  // New test case for Visionary Path
  test("should recommend Visionary Path based on appropriate inputs", async () => {
    // --- Test Configuration ---
    const MOCK_SESSION_ID = "visionary-path-session-456";
    const TOTAL_QUESTIONS_FOR_TEST = 12; // Enough to reach the goal question

    Object.defineProperty(require("@/lib/questionnaire"), "TOTAL_QUESTIONS", {
      value: TOTAL_QUESTIONS_FOR_TEST,
      writable: true,
    });

    // Setup appropriate accumulated data to trigger Visionary Path
    const finalState: SessionState = {
      questionIndex: TOTAL_QUESTIONS_FOR_TEST, // At the end of the questions
      accumulatedData: {
        name: "Visionary User",
        email: "visionary@example.com",
        experience_level: "Intermediate", // One of the criteria for Visionary Path
        goal: "Share ideas for new features", // Main criteria for Visionary Path
      },
      repromptedIndex: null,
      lastInteractionTimestamp: Date.now(),
    };

    const VISIONARY_PATH = {
      recommendedPath: "Visionary Path",
      recommendedPathUrl: "http://visionary.path",
    };

    // Mock session retrieval to return our prepared state
    mockGetSession.mockResolvedValue({ ...finalState });
    // Set up determinePath to return Visionary Path
    mockDeterminePath.mockReturnValue(VISIONARY_PATH);
    // Mock isFinalQuestion to return true for this index
    mockIsFinalQuestion.mockReturnValue(true);

    // Simulate the final question submission that would trigger path determination
    const request = createMockRequest({
      sessionId: MOCK_SESSION_ID,
      response: "Some final response",
    });

    const response = await POST(request);
    const body = await response.json();

    // Check that the correct path was determined and returned
    expect(response.status).toBe(200);
    expect(mockDeterminePath).toHaveBeenCalledTimes(1);
    expect(mockDeterminePath).toHaveBeenCalledWith(
      expect.objectContaining({
        experience_level: "Intermediate",
        goal: "Share ideas for new features",
      }),
    );
    expect(body.finalResult?.recommendedPath).toBe("Visionary Path");
    expect(body.finalResult?.recommendedPathUrl).toBe("http://visionary.path");
    expect(mockSaveOnboardingResponse).toHaveBeenCalledWith(
      expect.objectContaining({
        recommendedPath: "Visionary Path",
        recommendedPathUrl: "http://visionary.path",
      }),
    );
  });

  // --- NEW TEST: Session Expiry ---
  test("should handle session expiry by forcing a restart", async () => {
    const EXPIRED_SESSION_ID = "expired-session-456";
    const NEW_SESSION_ID = "new-session-789";
    const FIRST_QUESTION = {
      index: 0,
      text: "Q0: Restart Name?",
      inputMode: "text",
    };

    // Mock getSession to return null for the expired ID
    mockGetSession.mockResolvedValue(null);
    // Mock createSession to be called when restarting
    mockCreateSession.mockResolvedValue({
      sessionId: NEW_SESSION_ID,
      initialState: {
        questionIndex: 0,
        accumulatedData: {},
        repromptedIndex: null,
        lastInteractionTimestamp: Date.now(),
      },
    });
    // Mock getQuestionDetails for the first question
    mockGetQuestionDetails.mockImplementation((index: number) =>
      index === 0 ? FIRST_QUESTION : null,
    );
    // Mock isFinalQuestion for index 0
    mockIsFinalQuestion.mockReturnValue(false);

    const request = createMockRequest({
      sessionId: EXPIRED_SESSION_ID,
      response: "anything",
    });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockGetSession).toHaveBeenCalledWith(EXPIRED_SESSION_ID);
    expect(mockCreateSession).toHaveBeenCalledTimes(1); // New session created
    expect(body.sessionId).toBe(NEW_SESSION_ID);
    expect(body.newSessionId).toBe(NEW_SESSION_ID); // Indicates restart with new ID
    expect(body.currentQuestionIndex).toBe(0);
    expect(body.nextQuestion).toBe(FIRST_QUESTION.text);
    expect(body.error).toBe("Your session expired. Please start again.");
    expect(body.haltFlow).toBe(false);
  });

  // --- NEW TEST: Input Validation Re-prompt ---
  test("should re-prompt on first validation failure if message exists", async () => {
    const SESSION_ID = "reprompt-session-123";
    const QUESTION_INDEX = 0;
    const QUESTION_DETAIL = {
      index: QUESTION_INDEX,
      text: "Q0: Name?",
      inputMode: "text",
      validationHint: "text",
      rePromptMessage: "Please enter a valid name.",
    };
    const initialState: SessionState = {
      questionIndex: QUESTION_INDEX,
      accumulatedData: {},
      repromptedIndex: null,
      lastInteractionTimestamp: Date.now(),
    };

    // Mock getSession to return the initial state
    mockGetSession.mockResolvedValue({ ...initialState });
    // Mock getQuestionDetails to return the question with a re-prompt message
    mockGetQuestionDetails.mockReturnValue(QUESTION_DETAIL);
    // Mock validateInput to return false
    mockValidateInput.mockReturnValue(false);
    // Mock isFinalQuestion
    mockIsFinalQuestion.mockReturnValue(false);

    const request = createMockRequest({ sessionId: SESSION_ID, response: "" }); // Invalid empty response
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockValidateInput).toHaveBeenCalledTimes(1);
    expect(mockGetSession).toHaveBeenCalledWith(SESSION_ID);
    // Expect updateSession to be called to save the repromptedIndex
    expect(mockUpdateSession).toHaveBeenCalledTimes(1);
    expect(mockUpdateSession).toHaveBeenCalledWith(
      SESSION_ID,
      expect.objectContaining({ repromptedIndex: QUESTION_INDEX }),
    );
    // Check response body
    expect(body.sessionId).toBe(SESSION_ID);
    expect(body.currentQuestionIndex).toBe(QUESTION_INDEX); // Still on the same question
    expect(body.nextQuestion).toBe(QUESTION_DETAIL.text);
    expect(body.error).toBe(QUESTION_DETAIL.rePromptMessage); // The re-prompt message
    expect(body.haltFlow).toBe(false);
  });

  // --- NEW TEST: Input Validation Halt (Email) ---
  test("should halt flow on second email validation failure", async () => {
    const SESSION_ID = "halt-session-456";
    const QUESTION_INDEX = 10; // Email question now at index 10
    const QUESTION_DETAIL = {
      index: QUESTION_INDEX,
      text: "Q10: Email?",
      inputMode: "text",
      validationHint: "email",
      rePromptMessage: "Invalid email format.",
    };
    // Simulate state *after* first failure (repromptedIndex is set)
    const initialState: SessionState = {
      questionIndex: QUESTION_INDEX,
      accumulatedData: { name: "Test" },
      repromptedIndex: QUESTION_INDEX,
      lastInteractionTimestamp: Date.now(),
    };

    // Mock getSession to return the state indicating second attempt
    mockGetSession.mockResolvedValue({ ...initialState });
    // Mock getQuestionDetails for email question
    mockGetQuestionDetails.mockReturnValue(QUESTION_DETAIL);
    // Mock validateInput to return false again
    mockValidateInput.mockReturnValue(false);

    const request = createMockRequest({
      sessionId: SESSION_ID,
      response: "not-an-email",
    });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockValidateInput).toHaveBeenCalledTimes(1);
    expect(mockGetSession).toHaveBeenCalledWith(SESSION_ID);
    // Ensure session is NOT updated or deleted when halting this way
    expect(mockUpdateSession).not.toHaveBeenCalled();
    expect(mockDeleteSession).not.toHaveBeenCalled();
    // Check response body for halt signal
    expect(body.sessionId).toBe(SESSION_ID);
    expect(body.currentQuestionIndex).toBe(QUESTION_INDEX);
    expect(body.error).toBe(
      "A valid email address is required. Please refresh to start over.",
    );
    expect(body.haltFlow).toBe(true); // Critical check
    expect(body.nextQuestion).toBeUndefined();
  });

  // --- NEW TEST: GET Handler ---
  describe("GET Handler", () => {
    test("should return OK status when services connect", async () => {
      const MOCK_SESSION_ID = "get-test-session-ok";
      // Mock session functions for successful test
      mockCreateSession.mockResolvedValue({
        sessionId: MOCK_SESSION_ID,
        initialState: {},
      });
      mockGetSession.mockResolvedValue({
        questionIndex: 0 /* minimal state */,
      });
      mockDeleteSession.mockResolvedValue(undefined);

      const response = await GET();
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(mockCreateSession).toHaveBeenCalledTimes(1);
      expect(mockGetSession).toHaveBeenCalledWith(MOCK_SESSION_ID);
      expect(mockDeleteSession).toHaveBeenCalledWith(MOCK_SESSION_ID);
      expect(body.status).toBe("OK");
      expect(body.message).toContain("Session Service connected");
    });

    test("should return ERROR status if getSession fails post-create", async () => {
      const MOCK_SESSION_ID = "get-test-session-fail";
      // Mock createSession ok, but getSession fails
      mockCreateSession.mockResolvedValue({
        sessionId: MOCK_SESSION_ID,
        initialState: {},
      });
      mockGetSession.mockResolvedValue(null); // Simulate failure
      mockDeleteSession.mockResolvedValue(undefined);

      const response = await GET();
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(mockCreateSession).toHaveBeenCalledTimes(1);
      expect(mockGetSession).toHaveBeenCalledWith(MOCK_SESSION_ID);
      // deleteSession might still be called depending on flow, which is okay
      expect(body.status).toBe("ERROR");
      expect(body.message).toContain(
        "Session Service failed post-create check",
      );
    });

    test("should return ERROR status if createSession throws error", async () => {
      // Mock createSession to throw an error
      const error = new Error("Redis connection failed");
      mockCreateSession.mockRejectedValue(error);

      const response = await GET();
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(mockCreateSession).toHaveBeenCalledTimes(1);
      expect(mockGetSession).not.toHaveBeenCalled();
      expect(mockDeleteSession).not.toHaveBeenCalled();
      expect(body.status).toBe("ERROR");
      expect(body.message).toContain("Error testing service connections");
      expect(body.error).toBe("Redis connection failed");
    });
  });
});
