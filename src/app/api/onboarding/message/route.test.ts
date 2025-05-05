// src/app/api/onboarding/message/route.test.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { POST, GET } from "./route"; // Import POST and GET handlers
import { SessionState, OnboardingData } from "@/lib/types"; // Import types
import {
  createSession,
  getSession,
  updateSession,
  deleteSession,
} from "@/lib/session";

// --- Mock Dependencies ---
// Mock the questionnaire module
jest.mock("@/lib/questionnaire", () => ({
  getQuestionDetails: jest.fn(),
  TOTAL_QUESTIONS: 0, // Will be overridden in tests
  isFinalQuestion: jest.fn(),
  // Assuming QuestionDetail type might be needed, but Jest handles types implicitly
}));

// Mock the supabase module
jest.mock("@/lib/supabase", () => ({
  saveOnboardingResponse: jest.fn(),
}));

// Mock the session module
jest.mock("@/lib/session", () => ({
  createSession: jest.fn(),
  getSession: jest.fn(),
  updateSession: jest.fn(),
  deleteSession: jest.fn(),
}));

// Import the mocked functions AFTER jest.mock calls
import {
  getQuestionDetails,
  isFinalQuestion,
  TOTAL_QUESTIONS as MOCKED_TOTAL_QUESTIONS, // Alias to avoid conflict if needed
} from "@/lib/questionnaire";
import { saveOnboardingResponse } from "@/lib/supabase";

// --- Test Suite ---
// Describe block groups related tests for the API route
describe("/api/onboarding/message API Route", () => {
  // --- Mocks Setup (Before Each Test) ---
  // Cast mocks to Jest Mock types for type safety
  let mockCreateSession: jest.Mock;
  let mockGetSession: jest.Mock;
  let mockUpdateSession: jest.Mock;
  let mockDeleteSession: jest.Mock;
  let mockGetQuestionDetails: jest.Mock;
  let mockIsFinalQuestion: jest.Mock;
  let mockSaveOnboardingResponse: jest.Mock;

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

    // Assign session mocks
    mockCreateSession = createSession as jest.Mock;
    mockGetSession = getSession as jest.Mock;
    mockUpdateSession = updateSession as jest.Mock;
    mockDeleteSession = deleteSession as jest.Mock;
    mockGetQuestionDetails = getQuestionDetails as jest.Mock;
    mockIsFinalQuestion = isFinalQuestion as jest.Mock;
    mockSaveOnboardingResponse = saveOnboardingResponse as jest.Mock;
    mockSaveOnboardingResponse.mockResolvedValue({ success: true });

    // Default validation for happy path: always valid
    mockIsFinalQuestion.mockImplementation(
      (index: number) => index >= (MOCKED_TOTAL_QUESTIONS as number),
    ); // Use the potentially overridden total
    // Default TOTAL_QUESTIONS to avoid test failures if not overridden
    Object.defineProperty(require("@/lib/questionnaire"), "TOTAL_QUESTIONS", {
      value: 14, // Default to match the new total questions
      writable: true,
    });

    // Restore session mock implementations
    let currentSessionState: SessionState = {
      questionIndex: 0,
      accumulatedData: {},
      repromptedIndex: null,
      lastInteractionTimestamp: Date.now(),
    };
    mockCreateSession.mockResolvedValue({
      sessionId: "happy-path-session-123",
      initialState: { ...currentSessionState },
    });
    mockGetSession.mockImplementation(async (sessionId: string) => {
      if (sessionId === "happy-path-session-123") {
        return JSON.parse(JSON.stringify(currentSessionState));
      }
      return null;
    });
    mockUpdateSession.mockImplementation(
      async (sessionId: string, newState: SessionState) => {
        if (sessionId === "happy-path-session-123") {
          currentSessionState = JSON.parse(JSON.stringify(newState));
        }
      },
    );
    mockDeleteSession.mockResolvedValue(undefined);
  });

  // --- Test Cases ---

  test("should successfully complete the onboarding flow (Happy Path - Explorer Path)", async () => {
    const MOCK_SESSION_ID = "happy-path-session-123";
    const TOTAL_QUESTIONS_FOR_TEST = 5;
    Object.defineProperty(require("@/lib/questionnaire"), "TOTAL_QUESTIONS", {
      value: TOTAL_QUESTIONS_FOR_TEST,
      writable: true,
    });
    // Mock getSession to simulate completed onboarding for Explorer
    mockGetSession.mockResolvedValue({
      questionIndex: TOTAL_QUESTIONS_FOR_TEST,
      accumulatedData: {
        name: "Explorer User",
        email: "explorer@example.com",
        experience_level: "Beginner",
        goal: ["Learn Web3 basics"],
      },
      repromptedIndex: null,
      lastInteractionTimestamp: Date.now(),
    });
    mockIsFinalQuestion.mockReturnValue(true);
    const request = createMockRequest({ sessionId: MOCK_SESSION_ID, response: 'final answer' });
    const response = await POST(request);
    const body = await response.json();
    expect(body.finalResult?.recommendedPath).toBe("Explorer");
    expect(body.finalResult?.recommendedPathUrl).toBe("https://example.com/placeholder/explorer");
  });

  test("should recommend Visionary Path based on appropriate inputs", async () => {
    const MOCK_SESSION_ID = "visionary-path-session-456";
    const TOTAL_QUESTIONS_FOR_TEST = 12;
    Object.defineProperty(require("@/lib/questionnaire"), "TOTAL_QUESTIONS", {
      value: TOTAL_QUESTIONS_FOR_TEST,
      writable: true,
    });
    // Mock getSession to simulate completed onboarding for Visionary
    mockGetSession.mockResolvedValue({
      questionIndex: TOTAL_QUESTIONS_FOR_TEST,
      accumulatedData: {
        name: "Visionary User",
        email: "visionary@example.com",
        experience_level: "Intermediate",
        goal: ["Share ideas for new features"],
      },
      repromptedIndex: null,
      lastInteractionTimestamp: Date.now(),
    });
    mockIsFinalQuestion.mockReturnValue(true);
    const request = createMockRequest({
      sessionId: MOCK_SESSION_ID,
      response: "Some final response",
    });
    const response = await POST(request);
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.finalResult?.recommendedPath).toBe("Visionary");
    expect(body.finalResult?.recommendedPathUrl).toBe("https://example.com/placeholder/visionary");
  });

  test("should recommend Contractor Path only if both Rust and TypeScript are present", async () => {
    const MOCK_SESSION_ID = "contractor-path-session-789";
    const TOTAL_QUESTIONS_FOR_TEST = 12;
    Object.defineProperty(require("@/lib/questionnaire"), "TOTAL_QUESTIONS", {
      value: TOTAL_QUESTIONS_FOR_TEST,
      writable: true,
    });
    // Mock getSession to simulate completed onboarding for Contractor
    mockGetSession.mockResolvedValue({
      questionIndex: TOTAL_QUESTIONS_FOR_TEST,
      accumulatedData: {
        name: "Contractor User",
        email: "contractor@example.com",
        languages: ["Rust", "TypeScript", "Go"],
        tools_familiarity: "Very familiar",
        experience_level: "Advanced",
        goal: ["Build apps/dApps"],
        blockchain_platforms: ["Cosmos SDK Chains", "Ethereum/EVMs"],
      },
      repromptedIndex: null,
      lastInteractionTimestamp: Date.now(),
    });
    mockIsFinalQuestion.mockReturnValue(true);
    const request = createMockRequest({
      sessionId: MOCK_SESSION_ID,
      response: "Some final response",
    });
    const response = await POST(request);
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.finalResult?.recommendedPath).toBe("Contractor");
    expect(body.finalResult?.recommendedPathUrl).toBe("https://example.com/placeholder/contractor");
  });

  // --- NEW TEST: Session Expiry ---
  test("should handle session expiry by forcing a restart", async () => {
    const EXPIRED_SESSION_ID = "expired-session-456";
    const NEW_SESSION_ID = "new-session-789";
    const FIRST_QUESTION = {
      index: 0,
      text: "Q0: Restart Name?",
      inputMode: "text",
      options: [],
      conditionalTextInputLabel: null,
      conditionalTriggerValue: null,
    };

    // Simulate session expiry: getSession returns null, createSession returns new session
    mockGetSession.mockResolvedValueOnce(null);
    mockCreateSession.mockResolvedValueOnce({
      sessionId: NEW_SESSION_ID,
      initialState: {
        questionIndex: 0,
        accumulatedData: {},
        repromptedIndex: null,
        lastInteractionTimestamp: Date.now(),
      },
    });
    // Provide first question details for restart
    mockGetQuestionDetails.mockReturnValue(FIRST_QUESTION);

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
    expect(mockCreateSession).toHaveBeenCalledTimes(1);
    expect(mockGetQuestionDetails).toHaveBeenCalledWith(0);

    expect(body.sessionId).toBe(NEW_SESSION_ID);
    expect(body.newSessionId).toBe(NEW_SESSION_ID); // Indicates restart
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
      options: [],
      conditionalTextInputLabel: null,
      conditionalTriggerValue: null,
    };
    const initialState: SessionState = {
      questionIndex: QUESTION_INDEX,
      accumulatedData: {},
      repromptedIndex: null,
      lastInteractionTimestamp: Date.now(),
    };

    // Mock session retrieval and question details
    mockGetSession.mockResolvedValueOnce(initialState);
    mockGetQuestionDetails.mockReturnValue(QUESTION_DETAIL);
    mockIsFinalQuestion.mockReturnValue(false);

    const request = createMockRequest({ sessionId: SESSION_ID, response: "" });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockGetSession).toHaveBeenCalledWith(SESSION_ID);
    expect(mockUpdateSession).toHaveBeenCalledWith(
      SESSION_ID,
      expect.objectContaining({ repromptedIndex: QUESTION_INDEX }),
    );
    // Check response body
    expect(body.sessionId).toBe(SESSION_ID);
    expect(body.currentQuestionIndex).toBe(QUESTION_INDEX);
    expect(body.nextQuestion).toBe(QUESTION_DETAIL.text);
    expect(body.error).toBe(QUESTION_DETAIL.rePromptMessage);
    expect(body.haltFlow).toBe(false);
  });

  // --- NEW TEST: Input Validation Halt (Email) ---
  test("should halt flow on second email validation failure", async () => {
    const SESSION_ID = "halt-session-456";
    const QUESTION_INDEX = 10; // Email index
    const QUESTION_DETAIL = {
      index: QUESTION_INDEX,
      text: "Q10: Email?",
      inputMode: "text",
      validationHint: "email",
      rePromptMessage: "Invalid email format.",
      options: [],
      conditionalTextInputLabel: null,
      conditionalTriggerValue: null,
    };
    // After first failure
    const initialState: SessionState = {
      questionIndex: QUESTION_INDEX,
      accumulatedData: { name: "Test" },
      repromptedIndex: QUESTION_INDEX,
      lastInteractionTimestamp: Date.now(),
    };

    // Mock session and question details for second attempt
    mockGetSession.mockResolvedValueOnce(initialState);
    mockGetQuestionDetails.mockReturnValue(QUESTION_DETAIL);
    mockIsFinalQuestion.mockReturnValue(false);

    const request = createMockRequest({ sessionId: SESSION_ID, response: "not-an-email" });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockGetSession).toHaveBeenCalledWith(SESSION_ID);
    expect(mockUpdateSession).not.toHaveBeenCalled();
    expect(mockDeleteSession).not.toHaveBeenCalled();
    // Check response body
    expect(body.sessionId).toBe(SESSION_ID);
    expect(body.currentQuestionIndex).toBe(QUESTION_INDEX);
    expect(body.error).toBe(
      "A valid email address is required. Please refresh to start over.",
    );
    expect(body.haltFlow).toBe(true);
    expect(body.nextQuestion).toBeUndefined();
  });

  // --- NEW TEST: GET Handler ---
  describe("GET Handler", () => {
    test("should return OK status when services connect", async () => {
      const MOCK_SESSION_ID = "get-test-session-ok";
      // Mock session functions for successful test
      mockGetQuestionDetails.mockResolvedValue({
        questionIndex: 0 /* minimal state */,
      });

      const response = await GET();
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.status).toBe("OK");
      expect(body.message).toContain("Session Service connected");
    });

    test("should return ERROR status if getSession fails post-create", async () => {
      const MOCK_SESSION_ID = "get-test-session-fail";
      // After createSession, getSession returns null
      mockGetSession.mockResolvedValueOnce(null);

      const response = await GET();
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body.status).toBe("ERROR");
      expect(body.message).toContain(
        "Session Service failed post-create check",
      );
    });

    test("should return ERROR status if createSession throws error", async () => {
      // Mock createSession to throw error
      const error = new Error("Redis connection failed");
      mockCreateSession.mockRejectedValueOnce(error);

      const response = await GET();
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body.status).toBe("ERROR");
      expect(body.message).toContain("Error testing service connections");
      expect(body.error).toBe("Redis connection failed");
    });
  });
});
