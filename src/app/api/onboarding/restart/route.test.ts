import { POST } from "./route";
import { createSession } from "@/lib/session";
import { getQuestionDetails } from "@/lib/questionnaire";

// Mock dependencies
jest.mock("@/lib/session", () => ({
  createSession: jest.fn(),
}));

jest.mock("@/lib/questionnaire", () => ({
  getQuestionDetails: jest.fn(),
}));

jest.mock("@/lib/logger", () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock NextResponse
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data, options) => {
      return {
        json: () => Promise.resolve(data),
        status: options?.status || 200,
      };
    }),
  },
}));

describe("Restart API Route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new session and return first question details", async () => {
    // Mock implementation
    const mockSessionId = "test-session-123";
    (createSession as jest.Mock).mockResolvedValue({
      sessionId: mockSessionId,
    });

    const mockFirstQuestion = {
      text: "Test question?",
      inputMode: "text",
      options: ["Option 1", "Option 2"],
      conditionalTextInputLabel: "Specify other:",
      conditionalTriggerValue: "Other",
    };
    (getQuestionDetails as jest.Mock).mockReturnValue(mockFirstQuestion);

    // Execute
    const response = await POST();
    const data = await response.json();

    // Assert
    expect(createSession).toHaveBeenCalled();
    expect(getQuestionDetails).toHaveBeenCalledWith(0);
    expect(data).toEqual({
      success: true,
      sessionId: mockSessionId,
      currentQuestionIndex: 0,
      nextQuestion: mockFirstQuestion.text,
      inputMode: mockFirstQuestion.inputMode,
      options: mockFirstQuestion.options,
      conditionalTextInputLabel: mockFirstQuestion.conditionalTextInputLabel,
      conditionalTriggerValue: mockFirstQuestion.conditionalTriggerValue,
    });
  });

  it("should handle error when first question cannot be initialized", async () => {
    // Mock implementation with error scenario
    (createSession as jest.Mock).mockResolvedValue({
      sessionId: "test-session-123",
    });
    (getQuestionDetails as jest.Mock).mockReturnValue(null);

    // Execute
    const response = await POST();

    // Assert
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toEqual({ error: "Could not initialize the first question." });
  });

  it("should handle error during session creation", async () => {
    // Mock implementation with error scenario
    const mockError = new Error("Session creation failed");
    (createSession as jest.Mock).mockRejectedValue(mockError);

    // Execute
    const response = await POST();

    // Assert
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toEqual({
      error: "Failed to restart the conversation. Please try again.",
    });
  });
});
