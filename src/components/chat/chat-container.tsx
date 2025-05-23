"use client";

import { useState, useRef, useEffect, useCallback } from "react";

import { ChatMessages, type ChatMessage } from "./chat-messages";
import { ChatInput, type InputMode } from "./chat-input";
import { getQuestionDetails } from "@/lib/questionnaire";
import { useSidebar } from "@/context/SidebarContext";
import { ContactInfoForm } from "./ContactInfoForm";
import { TopProgressPanel } from "@/components/ui/top-progress-panel";

// Define API response types
interface OnboardingResponsePayload {
  sessionId: string;
  currentQuestionIndex: number;
  nextQuestion?: string;
  options?: Array<{ label: string; value: string }>;
  inputMode?: InputMode;
  conditionalTextInputLabel?: string;
  conditionalTriggerValue?: string | null;
  error?: string;
  haltFlow?: boolean;
  isFinalQuestion?: boolean;
  finalResult?: {
    recommendedPath: string;
    recommendedPathUrl: string;
    secondRecommendedPath?: string;
    secondRecommendedPathUrl?: string;
  };
  newSessionId?: string;
  // Flag to identify a save retry scenario
  saveRetryNeeded?: boolean;
}

interface ChatContainerProps {
  initialMessage?: string;
  className?: string;
}

// Define types for question answers
interface ConditionalTextAnswer {
  buttonValue: string;
  conditionalText: string;
}

type QuestionAnswer = string | string[] | ConditionalTextAnswer;

// Define a constant for total steps at the top of the component (below the imports)
const TOTAL_STEPS = 14;

export function ChatContainer({
  initialMessage = `Welcome to Andromeda! I'm Pulsar, your onboarding assistant!`,
  className = "",
}: ChatContainerProps) {
  // Access the openRightSidebar function from context
  const { openRightSidebar } = useSidebar();

  // State for messages and chat flow
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMode, setInputMode] = useState<InputMode>("text");
  const [conditionalText, setConditionalText] = useState("");
  const [selectedButtonValue, setSelectedButtonValue] = useState<string | null>(
    null,
  );
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<
    number | null
  >(null);
  const [conditionalTextVisible, setConditionalTextVisible] = useState(false);
  const [conditionalTriggerValue, setConditionalTriggerValue] = useState<
    string | null
  >(null);
  const [conditionalTextInputLabel, setConditionalTextInputLabel] = useState(
    "Please provide more details:",
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showConditionalInput, setShowConditionalInput] = useState(false);
  const conditionalInputRef = useRef<HTMLDivElement>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [multiSelectAnswers, setMultiSelectAnswers] = useState<{
    [key: number]: string[];
  }>({});
  const [userName, setUserName] = useState<string>("");
  // Add state for DB save retry
  const [isSaveRetrying, setIsSaveRetrying] = useState(false);
  // State to track if the sidebar has been opened after completion
  const [hasOpenedSidebarAfterCompletion, setHasOpenedSidebarAfterCompletion] =
    useState(false);

  // Ref to track if the initial conversation setup has successfully completed
  const hasSuccessfullyStartedConversation = useRef(false);

  // Add a key state to force remount of the ChatInput component
  const [chatInputKey, setChatInputKey] = useState<string>(
    `input-${Date.now()}`,
  );

  // Add history state to track previous answers
  const [questionHistory, setQuestionHistory] = useState<{
    messages: ChatMessage[][];
    answers: { [index: number]: QuestionAnswer };
  }>({
    messages: [],
    answers: {},
  });

  // Helper function to generate unique IDs for messages
  const generateMessageId = (role: string) =>
    `${role}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // Scroll to bottom when messages change
  useEffect(() => {
    // Let the ChatMessages component handle scrolling
    // This is a backup scroll mechanism in case the ScrollArea doesn't work properly
    const timeoutId = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 150); // Slightly longer timeout than in ChatMessages

    return () => clearTimeout(timeoutId);
  }, [messages]);

  // Load messages from localStorage on mount if conversation is complete
  useEffect(() => {
    const savedMessages = localStorage.getItem(
      "andromeda-onboarding-conversation",
    );
    const savedComplete = localStorage.getItem("andromeda-onboarding-complete");
    const savedHasOpenedSidebar = localStorage.getItem(
      "andromeda-onboarding-sidebar-opened",
    );

    const mounted = { current: true };

    if (savedHasOpenedSidebar === "true") {
      setHasOpenedSidebarAfterCompletion(true);
    }

    // Add this condition to prevent re-initialization when we already have messages
    if (messages.length > 0) {
      console.log(
        "Messages already exist, skipping initialization from localStorage",
      );
      return;
    }

    if (savedMessages && savedComplete === "true") {
      try {
        const parsedMessages = JSON.parse(savedMessages);

        if (mounted.current) {
          setMessages(parsedMessages);
          setIsComplete(true);
          setInputDisabled(true);
          setCurrentQuestionIndex(TOTAL_STEPS);

          // Find the message containing the userName
          const userNameMessage = parsedMessages.find(
            (msg: ChatMessage) =>
              msg.role === "user" &&
              parsedMessages[
                parsedMessages.indexOf(msg) - 1
              ]?.content?.includes("What should I call you"),
          );

          if (userNameMessage) {
            setUserName(userNameMessage.content);
          }
          hasSuccessfullyStartedConversation.current = true; // Mark as started if loaded complete
          console.log(
            "Loaded completed conversation from localStorage, hasSuccessfullyStartedConversation set to true.",
          );
        }
      } catch (e) {
        console.error("Error parsing saved messages:", e);
        // If parsing fails, treat as a fresh start
        hasSuccessfullyStartedConversation.current = false;
        if (mounted.current) {
          initializeChat();
        }
      }
    } else {
      // Not complete or not saved, so initialize if not already started.
      if (!hasSuccessfullyStartedConversation.current) {
        console.log("No saved complete conversation, calling initializeChat.");
        if (mounted.current) {
          initializeChat();
        }
      } else {
        console.log(
          "No saved complete conversation, but hasSuccessfullyStartedConversation is true, skipping initializeChat.",
        );
      }
    }

    return () => {
      mounted.current = false;
    };
  }, []); // Empty dependency array to ensure this only runs once on mount

  // Effect to save conversation when complete
  useEffect(() => {
    if (isComplete && messages.length > 0) {
      localStorage.setItem(
        "andromeda-onboarding-conversation",
        JSON.stringify(messages),
      );
      localStorage.setItem("andromeda-onboarding-complete", "true");
    }
  }, [isComplete, messages]);

  // Effect to save sidebar opened state
  useEffect(() => {
    localStorage.setItem(
      "andromeda-onboarding-sidebar-opened",
      String(hasOpenedSidebarAfterCompletion),
    );
  }, [hasOpenedSidebarAfterCompletion]);

  // Start the conversation by fetching the first question
  const startConversation = async () => {
    console.log("startConversation called", {
      currentFlagState: hasSuccessfullyStartedConversation.current,
    });
    if (hasSuccessfullyStartedConversation.current) {
      console.log(
        "Skipping startConversation as it has already successfully started.",
      );
      return;
    }

    // Original guard, can be kept as a secondary check or removed if the ref is trusted
    if (messages.length > 1) {
      console.log(
        "Skipping startConversation - messages already exist (length check)",
      );
      return;
    }

    const mounted = { current: true };
    setIsProcessing(true);
    setInputDisabled(true); // Ensure input is disabled during API call

    try {
      console.log("Fetching first question from API");
      const response = await fetch("/api/onboarding/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId: null }),
      });

      if (!mounted.current) {
        console.log("Component unmounted during API call, aborting");
        return;
      }

      if (!response.ok) {
        throw new Error(
          `Failed to start conversation: ${response.status} ${response.statusText}`,
        );
      }

      const data: OnboardingResponsePayload = await response.json();

      if (!mounted.current) {
        console.log(
          "Component unmounted during API response parsing, aborting",
        );
        return;
      }

      console.log("Received API response:", {
        sessionId: data.sessionId,
        nextQuestion: !!data.nextQuestion,
        inputMode: data.inputMode,
      });

      setSessionId(data.sessionId);
      // Save sessionId to localStorage
      if (data.sessionId) {
        localStorage.setItem("onboarding-session-id", data.sessionId);
      }
      setCurrentQuestionIndex(data.currentQuestionIndex);

      // Add the first question as a message
      if (data.nextQuestion) {
        setMessages((prev) => [
          ...prev,
          {
            id: generateMessageId("assistant"),
            role: "assistant",
            content: data.nextQuestion || "Let's get started!",
            options: data.options,
          },
        ]);
        hasSuccessfullyStartedConversation.current = true; // Mark as successfully started
        console.log(
          "startConversation: First question added, hasSuccessfullyStartedConversation set to true.",
        );
      } else {
        // If no next question, it didn't "successfully start" in terms of getting Q1.
        // Consider if hasSuccessfullyStartedConversation should remain false or if this is an error state.
        console.log("startConversation: No nextQuestion in API response.");
      }

      // Set input mode
      const mode = data.inputMode || "text";
      console.log("Setting input mode to:", mode);
      setInputMode(mode);

      // Set conditional text properties if applicable
      if (data.conditionalTextInputLabel) {
        setConditionalTextVisible(false);
        setConditionalTriggerValue(data.conditionalTriggerValue || null);
        setConditionalTextInputLabel(data.conditionalTextInputLabel);
      }
    } catch (error) {
      if (!mounted.current) {
        console.log("Component unmounted during error handling, aborting");
        return;
      }

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to start the conversation. Please try again.";
      console.error("Error starting conversation:", errorMessage);
    } finally {
      if (mounted.current) {
        console.log("startConversation complete, clearing isProcessing flag");
        setIsProcessing(false);

        // Ensure input is enabled after a short delay
        setTimeout(() => {
          if (mounted.current) {
            console.log("Re-enabling input after API call");
            setInputDisabled(false);
          }
        }, 300);
      }
    }

    return () => {
      mounted.current = false;
    };
  };

  // Initialize chat with the initial message
  const initializeChat = () => {
    console.log("initializeChat called");

    // Check if we have an unmounted component flag
    if (hasSuccessfullyStartedConversation.current) {
      console.log("Conversation already started, skipping initialization");
      return;
    }

    // Check if there's an existing sessionId in localStorage
    const existingSessionId = localStorage.getItem("onboarding-session-id");
    if (existingSessionId) {
      console.log(
        "Found existing sessionId in localStorage:",
        existingSessionId,
      );
      setSessionId(existingSessionId);
    } else {
      console.log("No existing sessionId found in localStorage");
    }

    // Add the initial welcome messages only if messages are currently empty
    // This helps prevent duplicating the welcome message if initializeChat is called multiple times
    // by StrictMode before startConversation populates further.
    setMessages((prevMessages) => {
      if (prevMessages.length === 0) {
        console.log("initializeChat: Setting initial welcome messages.");
        return [
          {
            id: generateMessageId("assistant"),
            role: "assistant",
            content: initialMessage,
          },
          {
            id: generateMessageId("assistant"),
            role: "assistant",
            content:
              "I'll ask a few quick questions to learn about you. Once I know what you're looking for, I'll guide you to the right place in our community.\n\nReady to get started? 🚀",
          },
        ];
      }
      console.log(
        "initializeChat: Welcome messages already present or messages not empty; not re-adding welcome.",
      );
      return prevMessages;
    });

    // Start the conversation (first question)
    // startConversation itself will check hasSuccessfullyStartedConversation
    console.log("initializeChat: Calling startConversation.");
    startConversation();
  };

  const handleConditionalTextChange = (text: string) => {
    // Update conditional text state
    setConditionalText(text);
  };

  // Function to retry saving to database
  const retryDatabaseSave = async () => {
    if (!sessionId || isSaveRetrying) return;

    setIsSaveRetrying(true);

    try {
      // Replace last message with a loading message
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          id: generateMessageId("assistant"),
          role: "assistant",
          content: "Retrying to save your data...",
          isLoading: true,
        },
      ]);

      const response = await fetch("/api/onboarding/retry-save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId }),
      });

      const data = await response.json();

      // Remove loading message
      setMessages((prev) => prev.slice(0, -1));

      if (data.success) {
        // Show success message and keep completion state
        setMessages((prev) => [
          ...prev,
          {
            id: generateMessageId("assistant"),
            role: "assistant",
            content: "Your profile data has been successfully saved! 🎉",
          },
        ]);
        // No need for retry button anymore
        const lastMessageIndex = messages.length - 1;
        if (lastMessageIndex >= 0 && messages[lastMessageIndex].finalResult) {
          const updatedMessages = [...messages];
          updatedMessages[lastMessageIndex] = {
            ...updatedMessages[lastMessageIndex],
            saveRetryNeeded: false,
          };
          setMessages(updatedMessages);
        }
      } else {
        // Show error message with retry button
        setMessages((prev) => [
          ...prev,
          {
            id: generateMessageId("assistant"),
            role: "assistant",
            content: `${data.message || "Failed to save your data."} ${data.error ? `(${data.error})` : ""}`,
          },
        ]);
      }
    } catch (error) {
      console.error("Error retrying save:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: generateMessageId("assistant"),
          role: "assistant",
          content:
            "Something went wrong. Please try again later or contact support.",
        },
      ]);
    } finally {
      setIsSaveRetrying(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    console.log("handleSendMessage called", {
      isProcessing,
      sessionId,
      message,
    });
    if (isProcessing || !sessionId) {
      console.log("Not processing message due to:", {
        isProcessing,
        noSessionId: !sessionId,
      });
      return;
    }

    // If answering the name question (index 0), store the name
    if (currentQuestionIndex === 0) {
      setUserName(message.trim());
    }

    // Save current state before proceeding to next question
    if (currentQuestionIndex !== null) {
      // Save the current messages for this question
      const currentMessagesForQuestion = [...messages];

      // Update question history
      setQuestionHistory((prev) => {
        const updatedHistory = { ...prev };

        // Save messages up to this point
        updatedHistory.messages[currentQuestionIndex] =
          currentMessagesForQuestion;

        // Save the answer for this question
        updatedHistory.answers[currentQuestionIndex] = message;

        return updatedHistory;
      });
    }

    // Add user message to chat
    setMessages((prev) => [
      ...prev,
      {
        id: generateMessageId("user"),
        role: "user",
        content: message,
      },
    ]);

    // Add loading message
    setMessages((prev) => [
      ...prev,
      {
        id: generateMessageId("assistant"),
        role: "assistant",
        content: "Thinking...",
        isLoading: true,
      },
    ]);

    setIsProcessing(true);
    setInputDisabled(true);

    try {
      // Prepare the request payload
      const payload: {
        sessionId: string;
        response: string | { buttonValue: string };
        conditionalText?: string;
      } = {
        sessionId,
        response: message,
      };

      // If we're in conditionalText mode and have conditional text, include it
      if (
        inputMode === "conditionalText" &&
        conditionalTextVisible &&
        conditionalText
      ) {
        payload.conditionalText = conditionalText;
      }

      const response = await fetch("/api/onboarding/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to send message: ${response.status} ${response.statusText}`,
        );
      }

      const data: OnboardingResponsePayload = await response.json();

      // Remove the loading message
      setMessages((prev) => prev.slice(0, -1));

      // Handle error if present
      if (data.error) {
        const errorMessage = data.error;
        const isSaveError = errorMessage.includes("profile saving failed");

        setMessages((prev) => [
          ...prev,
          {
            id: generateMessageId("assistant"),
            role: "assistant",
            content: errorMessage,
            // If this is a save error and we still have a valid session, show retry option
            saveRetryNeeded: isSaveError && !data.haltFlow,
          },
        ]);

        // If flow should halt, disable input
        if (data.haltFlow) {
          setInputDisabled(true);
        }
      }
      // Handle final result
      else if (data.isFinalQuestion && data.finalResult) {
        setMessages((prev) => [
          ...prev,
          {
            id: generateMessageId("assistant"),
            role: "assistant",
            content: `__FINAL_RECOMMENDATION__`,
            finalResult: data.finalResult,
            // If saveRetryNeeded is set by the backend
            saveRetryNeeded: data.saveRetryNeeded,
          },
        ]);
        setInputDisabled(true);
        setIsComplete(true);
        setCurrentQuestionIndex(TOTAL_STEPS);
      }
      // Handle next question
      else if (data.nextQuestion) {
        setMessages((prev) => [
          ...prev,
          {
            id: generateMessageId("assistant"),
            role: "assistant",
            content: data.nextQuestion || "Let's continue",
            options: data.options,
          },
        ]);

        setCurrentQuestionIndex(data.currentQuestionIndex);
        setInputMode(data.inputMode || "text");

        // Reset conditional text state
        setConditionalText("");
        setConditionalTextVisible(false);
        setSelectedButtonValue(null);

        // Set up conditional text if applicable
        if (data.conditionalTextInputLabel) {
          setConditionalTextVisible(false);
          setConditionalTriggerValue(data.conditionalTriggerValue || null);
          setConditionalTextInputLabel(data.conditionalTextInputLabel);
        }
      }

      // If we got a new session ID (session expired), update it
      if (data.newSessionId) {
        setSessionId(data.newSessionId);
        // Save new sessionId to localStorage
        localStorage.setItem("onboarding-session-id", data.newSessionId);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error sending message. Please try again.";
      console.error("Error sending message:", errorMessage);

      // Remove the loading message
      setMessages((prev) => prev.slice(0, -1));

      setMessages((prev) => [
        ...prev,
        {
          id: generateMessageId("assistant"),
          role: "assistant",
          content:
            "Sorry, there was an error processing your message. Please try again.",
        },
      ]);
    } finally {
      setIsProcessing(false);
      if (!isComplete) {
        setInputDisabled(false);
        // Add short delay before attempting to refocus
        setTimeout(() => {
          // Trigger a re-render to focus the input
          setInputMode((prev) => prev);
        }, 100);
      }
    }
  };

  // Get interactive message ID for keyboard shortcuts
  const latestInteractiveMsgId = (() => {
    // Find the last assistant message with options
    const interactiveMessages = messages.filter(
      (msg) =>
        msg.role === "assistant" && msg.options && msg.options.length > 0,
    );
    return interactiveMessages.length > 0
      ? interactiveMessages[interactiveMessages.length - 1].id
      : null;
  })();

  // State for keyboard navigation of buttons
  const [highlightedButtonIndex, setHighlightedButtonIndex] = useState<
    number | null
  >(null);

  const handleButtonSelect = useCallback(
    async (value: string) => {
      if (isProcessing || !sessionId) return;
      // Use isMultiSelect property from question definition
      const currentQuestion =
        typeof currentQuestionIndex === "number"
          ? getQuestionDetails(currentQuestionIndex)
          : null;
      if (
        currentQuestion &&
        currentQuestion.isMultiSelect &&
        typeof currentQuestionIndex === "number"
      ) {
        setMultiSelectAnswers((prev) => {
          const prevSelected = prev[currentQuestionIndex] || [];
          // Special logic for hackathon question (index 6)
          if (currentQuestionIndex === 6 && value === "No") {
            // If 'No, I haven't' is selected, clear all others and only select 'No'
            setTimeout(() => {
              handleConfirmMultiSelect();
            }, 0);
            return { ...prev, [currentQuestionIndex]: ["No"] };
          }
          if (currentQuestionIndex === 6 && prevSelected.includes("No")) {
            // If 'No, I haven't' is already selected, deselect it if another is chosen
            return {
              ...prev,
              [currentQuestionIndex]: [value],
            };
          }
          // Default multi-select logic
          if (value === "None") {
            return { ...prev, [currentQuestionIndex]: ["None"] };
          }
          const clearedPrev = prevSelected.filter((v: string) => v !== "None");
          if (clearedPrev.includes(value)) {
            return {
              ...prev,
              [currentQuestionIndex]: clearedPrev.filter(
                (v: string) => v !== value,
              ),
            };
          } else {
            return { ...prev, [currentQuestionIndex]: [...clearedPrev, value] };
          }
        });
        return;
      }
      if (
        inputMode === "conditionalText" &&
        conditionalTriggerValue &&
        value === conditionalTriggerValue
      ) {
        setConditionalTextVisible(true);
        setShowConditionalInput(true);
        setSelectedButtonValue(value);
        return;
      } else if (inputMode === "conditionalText") {
        setConditionalTextVisible(false);
        setShowConditionalInput(false);
        setSelectedButtonValue(value);
      }

      // Save current state before proceeding to next question
      if (currentQuestionIndex !== null) {
        // Save the current messages for this question
        const currentMessagesForQuestion = [...messages];

        // Update question history
        setQuestionHistory((prev) => {
          const updatedHistory = { ...prev };

          // Save messages up to this point
          updatedHistory.messages[currentQuestionIndex] =
            currentMessagesForQuestion;

          // Save the answer for this question
          updatedHistory.answers[currentQuestionIndex] = value;

          return updatedHistory;
        });
      }

      // Add user message to chat
      setMessages((prev) => [
        ...prev,
        {
          id: generateMessageId("user"),
          role: "user",
          content: value,
        },
      ]);

      // Add loading message
      setMessages((prev) => [
        ...prev,
        {
          id: generateMessageId("assistant"),
          role: "assistant",
          content: "Thinking...",
          isLoading: true,
        },
      ]);

      setIsProcessing(true);
      setInputDisabled(true);

      try {
        const payload = {
          sessionId,
          response: { buttonValue: value },
          conditionalText: conditionalTextVisible ? conditionalText : undefined,
        };

        const response = await fetch("/api/onboarding/message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(
            `Failed to send message: ${response.status} ${response.statusText}`,
          );
        }

        const data: OnboardingResponsePayload = await response.json();

        // Remove the loading message
        setMessages((prev) => prev.slice(0, -1));

        // Handle error if present
        if (data.error) {
          const errorMessage = data.error;
          const isSaveError = errorMessage.includes("profile saving failed");

          setMessages((prev) => [
            ...prev,
            {
              id: generateMessageId("assistant"),
              role: "assistant",
              content: errorMessage,
              // If this is a save error and we still have a valid session, show retry option
              saveRetryNeeded: isSaveError && !data.haltFlow,
            },
          ]);

          // If flow should halt, disable input
          if (data.haltFlow) {
            setInputDisabled(true);
          }
        }
        // Handle final result
        else if (data.isFinalQuestion && data.finalResult) {
          setMessages((prev) => [
            ...prev,
            {
              id: generateMessageId("assistant"),
              role: "assistant",
              content: `__FINAL_RECOMMENDATION__`,
              finalResult: data.finalResult,
              // If saveRetryNeeded is set by the backend
              saveRetryNeeded: data.saveRetryNeeded,
            },
          ]);
          setInputDisabled(true);
          setIsComplete(true);
          setCurrentQuestionIndex(TOTAL_STEPS);
        }
        // Handle next question
        else if (data.nextQuestion) {
          setMessages((prev) => [
            ...prev,
            {
              id: generateMessageId("assistant"),
              role: "assistant",
              content: data.nextQuestion || "Let's continue",
              options: data.options,
            },
          ]);

          setCurrentQuestionIndex(data.currentQuestionIndex);
          setInputMode(data.inputMode || "text");

          // Reset conditional text state
          setConditionalText("");
          setConditionalTextVisible(false);
          setSelectedButtonValue(null);

          // Set up conditional text if applicable
          if (data.conditionalTextInputLabel) {
            setConditionalTextVisible(false);
            setConditionalTriggerValue(data.conditionalTriggerValue || null);
            setConditionalTextInputLabel(data.conditionalTextInputLabel);
          }
        }

        // If we got a new session ID (session expired), update it
        if (data.newSessionId) {
          setSessionId(data.newSessionId);
          // Save new sessionId to localStorage
          localStorage.setItem("onboarding-session-id", data.newSessionId);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Error sending message. Please try again.";
        console.error("Error sending message:", errorMessage);

        // Remove the loading message
        setMessages((prev) => prev.slice(0, -1));

        // Add error message
        setMessages((prev) => [
          ...prev,
          {
            id: generateMessageId("assistant"),
            role: "assistant",
            content:
              "Sorry, there was an error processing your message. Please try again.",
          },
        ]);
      } finally {
        setIsProcessing(false);
        setInputDisabled(false);
      }
    },
    [
      isProcessing,
      sessionId,
      currentQuestionIndex,
      inputMode,
      conditionalTriggerValue,
      conditionalTextVisible,
      conditionalText,
      messages,
    ],
  );

  const handleConditionalTextSubmit = () => {
    // Logic for conditional text submission

    // If we're in the other/AI flow where there's both a button and text
    if (selectedButtonValue && conditionalText) {
      submitConditionalResponse();
    } else if (conditionalTextVisible) {
      // If we're only showing a text area for some other reason
      handleSendMessage(conditionalText || "none");
    }
  };

  const submitConditionalResponse = async () => {
    if (isProcessing || !sessionId || !selectedButtonValue) return;

    // Save current state before proceeding to next question
    if (currentQuestionIndex !== null) {
      // Save the current messages for this question
      const currentMessagesForQuestion = [...messages];

      // Update question history
      setQuestionHistory((prev) => {
        const updatedHistory = { ...prev };

        // Save messages up to this point
        updatedHistory.messages[currentQuestionIndex] =
          currentMessagesForQuestion;

        // Save the conditional answer with both button and text
        updatedHistory.answers[currentQuestionIndex] = {
          buttonValue: selectedButtonValue,
          conditionalText: conditionalText,
        };

        return updatedHistory;
      });
    }

    // Add user message to chat showing both the button selection and the conditional text
    setMessages((prev) => [
      ...prev,
      {
        id: generateMessageId("user"),
        role: "user",
        content: `${selectedButtonValue} - ${conditionalText}`,
      },
    ]);

    // Add loading message
    setMessages((prev) => [
      ...prev,
      {
        id: generateMessageId("assistant"),
        role: "assistant",
        content: "Thinking...",
        isLoading: true,
      },
    ]);

    setIsProcessing(true);
    setInputDisabled(true);

    try {
      const payload = {
        sessionId,
        response: { buttonValue: selectedButtonValue },
        conditionalText: conditionalText,
      };

      const response = await fetch("/api/onboarding/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to send message: ${response.status} ${response.statusText}`,
        );
      }

      const data: OnboardingResponsePayload = await response.json();

      // Remove the loading message
      setMessages((prev) => prev.slice(0, -1));

      // Handle API response according to data
      if (data.error) {
        setMessages((prev) => [
          ...prev,
          {
            id: generateMessageId("assistant"),
            role: "assistant",
            content: data.error || "An error occurred",
          },
        ]);

        if (data.haltFlow) {
          setInputDisabled(true);
        }
      } else if (data.isFinalQuestion && data.finalResult) {
        setMessages((prev) => [
          ...prev,
          {
            id: generateMessageId("assistant"),
            role: "assistant",
            content: `__FINAL_RECOMMENDATION__`,
            finalResult: data.finalResult,
          },
        ]);
        setInputDisabled(true);
        setIsComplete(true);
        setCurrentQuestionIndex(TOTAL_STEPS);
      } else if (data.nextQuestion) {
        setMessages((prev) => [
          ...prev,
          {
            id: generateMessageId("assistant"),
            role: "assistant",
            content: data.nextQuestion || "Let's continue",
            options: data.options,
          },
        ]);

        setCurrentQuestionIndex(data.currentQuestionIndex);
        setInputMode(data.inputMode || "text");

        // Reset states
        setConditionalText("");
        setConditionalTextVisible(false);
        setShowConditionalInput(false);
        setSelectedButtonValue(null);

        // Set up conditional text if applicable
        if (data.conditionalTextInputLabel) {
          setConditionalTextVisible(false);
          setConditionalTriggerValue(data.conditionalTriggerValue || null);
          setConditionalTextInputLabel(data.conditionalTextInputLabel);
        }
      }

      // Update session ID if needed
      if (data.newSessionId) {
        setSessionId(data.newSessionId);
        // Save new sessionId to localStorage
        localStorage.setItem("onboarding-session-id", data.newSessionId);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error processing your submission. Please try again.";
      console.error("Error submitting conditional text:", errorMessage);

      // Remove the loading message
      setMessages((prev) => prev.slice(0, -1));

      setMessages((prev) => [
        ...prev,
        {
          id: generateMessageId("assistant"),
          role: "assistant",
          content:
            "Sorry, there was an error processing your submission. Please try again.",
        },
      ]);
    } finally {
      setIsProcessing(false);
      setInputDisabled(false);
    }
  };

  const handleConfirmMultiSelect = async () => {
    if (
      isProcessing ||
      !sessionId ||
      typeof currentQuestionIndex !== "number" ||
      !multiSelectAnswers[currentQuestionIndex] ||
      !multiSelectAnswers[currentQuestionIndex].length
    )
      return;

    // Save current state before proceeding to next question
    const currentMessagesForQuestion = [...messages];

    // Update question history
    setQuestionHistory((prev) => {
      const updatedHistory = { ...prev };

      // Save messages up to this point
      updatedHistory.messages[currentQuestionIndex] =
        currentMessagesForQuestion;

      // Save the multiselect answer
      updatedHistory.answers[currentQuestionIndex] =
        multiSelectAnswers[currentQuestionIndex];

      return updatedHistory;
    });

    let selections = multiSelectAnswers[currentQuestionIndex];
    if (
      currentQuestionIndex === 7 &&
      selections.includes("Other") &&
      conditionalText.trim()
    ) {
      selections = selections.filter((v) => v !== "Other");
      selections.push(`Other: ${conditionalText.trim()}`);
    }

    setMessages((prev) => [
      ...prev,
      {
        id: generateMessageId("user"),
        role: "user",
        content: `Selected: ${selections.join(", ")}`,
      },
    ]);
    setMessages((prev) => [
      ...prev,
      {
        id: generateMessageId("assistant"),
        role: "assistant",
        content: "Thinking...",
        isLoading: true,
      },
    ]);
    setIsProcessing(true);
    setInputDisabled(true);
    try {
      let payload;
      if (currentQuestionIndex === 2) {
        // Languages: send as array
        payload = { sessionId, response: selections };
      } else if (currentQuestionIndex === 3) {
        // Blockchain platforms: send as { selectedValues, buttonValue }
        payload = {
          sessionId,
          response: { selectedValues: selections, buttonValue: "Yes" },
        };
      } else if (currentQuestionIndex === 6) {
        // Hackathon: send as { selectedValues }
        payload = { sessionId, response: { selectedValues: selections } };
      } else {
        // Default: send as array
        payload = { sessionId, response: selections };
      }
      const response = await fetch("/api/onboarding/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(
          `Failed to send message: ${response.status} ${response.statusText}`,
        );
      }
      const data: OnboardingResponsePayload = await response.json();
      setMessages((prev) => prev.slice(0, -1));
      if (data.error) {
        setMessages((prev) => [
          ...prev,
          {
            id: generateMessageId("assistant"),
            role: "assistant",
            content: data.error || "An error occurred",
          },
        ]);
        if (data.haltFlow) {
          setInputDisabled(true);
        }
      } else if (data.isFinalQuestion && data.finalResult) {
        setMessages((prev) => [
          ...prev,
          {
            id: generateMessageId("assistant"),
            role: "assistant",
            content: `__FINAL_RECOMMENDATION__`,
            finalResult: data.finalResult,
          },
        ]);
        setInputDisabled(true);
        setIsComplete(true);
        setCurrentQuestionIndex(TOTAL_STEPS);
      } else if (data.nextQuestion) {
        setMessages((prev) => [
          ...prev,
          {
            id: generateMessageId("assistant"),
            role: "assistant",
            content: data.nextQuestion || "Let's continue",
            options: data.options,
          },
        ]);
        setCurrentQuestionIndex(data.currentQuestionIndex);
        setInputMode(data.inputMode || "text");
        setConditionalText("");
        setConditionalTextVisible(false);
        setShowConditionalInput(false);
        setSelectedButtonValue(null);
        if (data.conditionalTextInputLabel) {
          setConditionalTextVisible(false);
          setConditionalTriggerValue(data.conditionalTriggerValue || null);
          setConditionalTextInputLabel(data.conditionalTextInputLabel);
        }
      }
      if (data.newSessionId) {
        setSessionId(data.newSessionId);
        // Save new sessionId to localStorage
        localStorage.setItem("onboarding-session-id", data.newSessionId);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error processing your selections. Please try again.";
      console.error("Error submitting selections:", errorMessage);
      setMessages((prev) => prev.slice(0, -1));
      setMessages((prev) => [
        ...prev,
        {
          id: generateMessageId("assistant"),
          role: "assistant",
          content:
            "Sorry, there was an error processing your selections. Please try again.",
        },
      ]);
    } finally {
      setIsProcessing(false);
      setInputDisabled(false);
    }
  };

  // Add effect for keyboard shortcuts (1-9 keys to select options)
  useEffect(() => {
    // Only apply keyboard shortcuts when:
    // - Not processing a request
    // - Input is not disabled
    // - Latest message has interactive options
    // - We're in button mode
    if (
      !isProcessing &&
      !inputDisabled &&
      latestInteractiveMsgId &&
      inputMode === "buttons" &&
      !showConditionalInput
    ) {
      const currentOptions =
        messages.find((msg) => msg.id === latestInteractiveMsgId)?.options ||
        [];

      const handleKeyDown = (event: KeyboardEvent) => {
        // Map keys 1-9 to options 0-8 (array indices)
        const optionIndex = parseInt(event.key) - 1;
        if (
          !isNaN(optionIndex) &&
          optionIndex >= 0 &&
          optionIndex < currentOptions.length
        ) {
          // Highlight the button visually first (for feedback)
          setHighlightedButtonIndex(optionIndex);

          // Remove the highlight after a short delay
          setTimeout(() => {
            setHighlightedButtonIndex(null);
            // Make sure conditional input is not open before handling button selection
            if (!showConditionalInput && !isProcessing && !inputDisabled) {
              // Get the selected option and trigger the button selection
              const selectedOption = currentOptions[optionIndex];
              handleButtonSelect(selectedOption.value);
            }
          }, 200);
        }
      };

      // Add the event listener
      document.addEventListener("keydown", handleKeyDown);

      // Clean up function - remove event listener when component unmounts
      // or when dependencies change
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [
    messages,
    latestInteractiveMsgId,
    inputMode,
    inputDisabled,
    isProcessing,
    handleButtonSelect,
    showConditionalInput, // Add this dependency
  ]);

  // Handle going back to the previous question
  const handleBack = useCallback(() => {
    if (
      currentQuestionIndex === null ||
      currentQuestionIndex <= 0 ||
      isProcessing
    ) {
      return; // Can't go back from first question or when processing
    }

    // Calculate the previous question index
    const prevIndex = currentQuestionIndex - 1;

    // Retrieve the previous messages for this question
    const prevMessages = questionHistory.messages[prevIndex] || [];

    // Set current question index to previous question
    setCurrentQuestionIndex(prevIndex);

    // Restore the UI state
    const questionDetail = getQuestionDetails(prevIndex);
    if (questionDetail) {
      setInputMode(questionDetail.inputMode);

      // Reset conditional text state
      setConditionalText("");
      setConditionalTextVisible(false);
      setShowConditionalInput(false); // Make sure to reset this too
      setSelectedButtonValue(null);

      // If there were conditional text settings, restore them
      if (questionDetail.conditionalTextInputLabel) {
        setConditionalTriggerValue(
          questionDetail.conditionalTriggerValue || null,
        );
        setConditionalTextInputLabel(questionDetail.conditionalTextInputLabel);
      }

      // If this was a multi-select question, make sure we keep the previous selections
      if (questionDetail.isMultiSelect && typeof prevIndex === "number") {
        // multiSelectAnswers state should already have the right values since we're not clearing it
      }
    }

    // Update messages to show only up to the previous question's messages
    if (prevMessages.length > 0) {
      setMessages(prevMessages);
    } else {
      // If we don't have saved messages (unusual), at least go back to the question prompt
      // Find the last assistant message before the current set of exchanges
      const assistantMessages = messages.filter((m) => m.role === "assistant");
      if (assistantMessages.length >= 2) {
        const lastIndex = messages.findIndex(
          (m) => m.id === assistantMessages[assistantMessages.length - 2].id,
        );
        if (lastIndex >= 0) {
          setMessages(messages.slice(0, lastIndex + 1));
        }
      }
    }

    // Make sure input is enabled
    setInputDisabled(false);
    setIsProcessing(false);
    setHighlightedButtonIndex(null); // Reset keyboard navigation

    // Notify the server about the navigation back to synchronize state
    if (sessionId) {
      fetch("/api/onboarding/back", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          targetQuestionIndex: prevIndex,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            console.error(
              "Failed to synchronize back navigation with server:",
              response.statusText,
            );
          }
        })
        .catch((error) => {
          console.error("Error synchronizing back navigation:", error);
        });
    }
  }, [
    currentQuestionIndex,
    isProcessing,
    messages,
    questionHistory.messages,
    sessionId,
  ]);

  // Add a handler to reset all chat state and start a new session
  const handleRestart = async () => {
    console.log("Restarting chat...");
    hasSuccessfullyStartedConversation.current = false; // Reset the flag
    // Clear saved conversation
    localStorage.removeItem("andromeda-onboarding-conversation");
    localStorage.removeItem("andromeda-onboarding-complete");
    localStorage.removeItem("onboarding-session-id");
    localStorage.removeItem("andromeda-onboarding-sidebar-opened"); // Clear sidebar state on restart

    // Reset all state with a timeout to ensure proper cleanup
    setMessages([]);
    setSessionId(null);
    setInputDisabled(true); // Keep disabled until we get a response
    setCurrentQuestionIndex(null);
    setMultiSelectAnswers({});
    setConditionalText("");
    setConditionalTextVisible(false);
    setSelectedButtonValue(null);
    setUserName("");
    setIsComplete(false);
    setHasOpenedSidebarAfterCompletion(false); // Reset sidebar state

    // Generate a new unique key to force ChatInput remount
    setChatInputKey(`input-${Date.now()}`);

    // Clear history state for back button
    setQuestionHistory({
      messages: [],
      answers: {},
    });

    try {
      // Call the dedicated restart API endpoint
      console.log("Calling restart API...");
      const response = await fetch("/api/onboarding/restart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to restart: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();
      console.log("Restart API response:", data);

      // Set the new session
      setSessionId(data.sessionId);
      localStorage.setItem("onboarding-session-id", data.sessionId);
      setCurrentQuestionIndex(data.currentQuestionIndex);

      // Add welcome messages
      setMessages([
        {
          id: generateMessageId("assistant"),
          role: "assistant",
          content: initialMessage,
        },
        {
          id: generateMessageId("assistant"),
          role: "assistant",
          content:
            "I'll ask a few quick questions to learn about you. Once I know what you're looking for, I'll guide you to the right place in our community.\n\nReady to get started? 🚀",
        },
        {
          id: generateMessageId("assistant"),
          role: "assistant",
          content: data.nextQuestion || "Let's get started!",
          options: data.options,
        },
      ]);

      if (data.nextQuestion) {
        hasSuccessfullyStartedConversation.current = true; // Mark as started after restart
        console.log(
          "handleRestart: Restart successful, hasSuccessfullyStartedConversation set to true.",
        );
      }

      // Set input mode
      setInputMode(data.inputMode || "text");

      // Set conditional text properties if applicable
      if (data.conditionalTextInputLabel) {
        setConditionalTextVisible(false);
        setConditionalTriggerValue(data.conditionalTriggerValue || null);
        setConditionalTextInputLabel(data.conditionalTextInputLabel);
      }
    } catch (error) {
      console.error("Error restarting chat:", error);

      // Add error message
      setMessages([
        {
          id: generateMessageId("assistant"),
          role: "assistant",
          content:
            "Sorry, there was an error restarting the chat. Please refresh the page and try again.",
        },
      ]);
    } finally {
      // Enable input after a delay to ensure UI has updated
      setTimeout(() => {
        setInputDisabled(false);
      }, 300);
    }
  };

  // Add effect to open the sidebar when completion happens
  useEffect(() => {
    if (isComplete && !hasOpenedSidebarAfterCompletion && messages.length > 5) {
      // Wait a second before opening the sidebar to ensure a smooth experience
      const timer = setTimeout(() => {
        openRightSidebar(); // This is now a no-op function
        setHasOpenedSidebarAfterCompletion(true);
        localStorage.setItem("andromeda-onboarding-sidebar-opened", "true");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isComplete, openRightSidebar, hasOpenedSidebarAfterCompletion]); // Add dependency

  // Before the return statement, define currentQuestion:
  const currentQuestion =
    typeof currentQuestionIndex === "number"
      ? getQuestionDetails(currentQuestionIndex)
      : null;

  // Add a cleanup effect when the component unmounts
  useEffect(() => {
    return () => {
      // This cleanup function runs when the component unmounts
      console.log("ChatContainer unmounting - performing cleanup");

      // Reset the conversation started flag to ensure proper initialization if remounted
      hasSuccessfullyStartedConversation.current = false;

      // Update the chatInputKey to ensure a fresh instance if remounted
      setChatInputKey(`input-${Date.now()}`);
    };
  }, []);

  return (
    <>
      {/* Top Progress Panel */}
      <TopProgressPanel
        currentStep={currentQuestionIndex || 0}
        totalSteps={TOTAL_STEPS}
        onRestart={handleRestart}
        onBack={handleBack}
        isComplete={isComplete}
      />

      <div
        className={`flex flex-col h-full w-full bg-[#1a1a1a] dark:bg-[#1a1a1a] rounded-lg overflow-hidden text-white ${className}`}
        style={{ width: "100%", height: "100%" }}
      >
        <div className={`flex-1 overflow-hidden relative`}>
          <ChatMessages
            messages={messages}
            onButtonClick={handleButtonSelect}
            selectedButtonValue={selectedButtonValue}
            messagesEndRef={messagesEndRef}
            className="h-full overflow-auto"
            latestInteractiveMessageId={latestInteractiveMsgId}
            highlightedButtonIndex={highlightedButtonIndex}
            multiSelectAnswers={multiSelectAnswers}
            currentQuestionIndex={currentQuestionIndex}
            userName={userName}
            conditionalInputOpen={showConditionalInput}
            onRetrySave={retryDatabaseSave}
          />
        </div>

        <div
          className={`relative transition-all duration-200 ${showConditionalInput ? "flex-shrink-0 max-h-[250px]" : "flex-shrink-0"}`}
          ref={conditionalInputRef}
        >
          {!isComplete &&
            (currentQuestionIndex === 10 ? (
              <ContactInfoForm
                onSubmit={async (values) => {
                  setInputDisabled(true);
                  setIsProcessing(true);
                  // Add a message to the chat for the form submission
                  setMessages((prev) => [
                    ...prev,
                    {
                      id: generateMessageId("user"),
                      role: "user",
                      content: `Contact Info Submitted`,
                    },
                    {
                      id: generateMessageId("assistant"),
                      role: "assistant",
                      content: "Processing your contact info...",
                      isLoading: true,
                    },
                  ]);
                  // Send all four answers in a single API call
                  try {
                    const response = await fetch("/api/onboarding/message", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        sessionId,
                        response: {
                          email: values.email,
                          github: values.github,
                          telegram: values.telegram,
                          x: values.x,
                          batchContact: true,
                        },
                      }),
                    });
                    const data: OnboardingResponsePayload =
                      await response.json();
                    setMessages((prev) => prev.slice(0, -1)); // Remove loading
                    if (data.error) {
                      setMessages((prev) => [
                        ...prev,
                        {
                          id: generateMessageId("assistant"),
                          role: "assistant",
                          content: data.error || "An error occurred",
                        },
                      ]);
                      setInputDisabled(false);
                    } else if (data.isFinalQuestion && data.finalResult) {
                      setMessages((prev) => [
                        ...prev,
                        {
                          id: generateMessageId("assistant"),
                          role: "assistant",
                          content: `__FINAL_RECOMMENDATION__`,
                          finalResult: data.finalResult,
                        },
                      ]);
                      setInputDisabled(true);
                      setIsComplete(true);
                      setCurrentQuestionIndex(TOTAL_STEPS);
                    } else if (data.nextQuestion) {
                      setMessages((prev) => [
                        ...prev,
                        {
                          id: generateMessageId("assistant"),
                          role: "assistant",
                          content: data.nextQuestion || "Let's continue",
                          options: data.options,
                        },
                      ]);
                      setCurrentQuestionIndex(data.currentQuestionIndex);
                      setInputMode(data.inputMode || "text");
                    }
                    if (data.newSessionId) {
                      setSessionId(data.newSessionId);
                      // Save new sessionId to localStorage
                      localStorage.setItem(
                        "onboarding-session-id",
                        data.newSessionId,
                      );
                    }
                  } catch {
                    setMessages((prev) => prev.slice(0, -1));
                    setMessages((prev) => [
                      ...prev,
                      {
                        id: generateMessageId("assistant"),
                        role: "assistant",
                        content:
                          "Sorry, there was an error submitting your contact info. Please try again.",
                      },
                    ]);
                    setInputDisabled(false);
                  } finally {
                    setIsProcessing(false);
                  }
                }}
                isSubmitting={isProcessing}
              />
            ) : (
              <ChatInput
                onSendText={handleSendMessage}
                onConditionalTextChange={handleConditionalTextChange}
                conditionalText={conditionalText}
                disabled={inputDisabled}
                inputMode={inputMode}
                onSendMessage={handleSendMessage}
                conditionalTextVisible={
                  !!(
                    currentQuestion?.conditionalTriggerValue &&
                    typeof currentQuestionIndex === "number" &&
                    Array.isArray(multiSelectAnswers[currentQuestionIndex]) &&
                    multiSelectAnswers[currentQuestionIndex]?.includes(
                      currentQuestion.conditionalTriggerValue,
                    )
                  )
                }
                setConditionalText={setConditionalText}
                onConditionalTextSubmit={handleConditionalTextSubmit}
                currentQuestionIndex={currentQuestionIndex}
                conditionalTextInputLabel={conditionalTextInputLabel}
                className={
                  conditionalTextVisible ? "max-h-[200px] overflow-y-auto" : ""
                }
                showConfirmButton={
                  currentQuestion?.isMultiSelect &&
                  typeof currentQuestionIndex === "number" &&
                  Array.isArray(multiSelectAnswers[currentQuestionIndex]) &&
                  multiSelectAnswers[currentQuestionIndex]?.length > 0
                }
                onConfirmLanguages={handleConfirmMultiSelect}
                placeholder={
                  getQuestionDetails(currentQuestionIndex ?? -1)?.placeholder ||
                  undefined
                }
                key={chatInputKey}
              />
            ))}
        </div>
      </div>
    </>
  );
}
