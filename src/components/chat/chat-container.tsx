"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { ChatHeader } from "./chat-header"
import { ChatMessages, type ChatMessage } from "./chat-messages"
import { ChatInput, type InputMode } from "./chat-input"
import { getQuestionDetails } from "@/lib/questionnaire"
import { useSidebar } from "@/context/SidebarContext"

// Define API response types
interface OnboardingResponsePayload {
    sessionId: string
    currentQuestionIndex: number
    nextQuestion?: string
    options?: Array<{ label: string; value: string }>
    inputMode?: InputMode
    conditionalTextInputLabel?: string
    conditionalTriggerValue?: string | null
    error?: string
    haltFlow?: boolean
    isFinalQuestion?: boolean
    finalResult?: {
        recommendedPath: string
        recommendedPathUrl: string
    }
    newSessionId?: string
}

interface ChatContainerProps {
    initialMessage?: string
    title?: string
    subtitle?: string
    className?: string
}

// Define a constant for total steps at the top of the component (below the imports)
const TOTAL_STEPS = 14;

export function ChatContainer({
    initialMessage = `🌟 Welcome to Andromeda! 🌟\n\nI'm your Onboarding Assistant, here to help you get started.\n\nI'll ask a few quick questions to learn about your background and interests.\n\nOnce I understand what you're looking for, I'll point you directly to the right spot in our community!\n\nReady to dive in? 🚀`,
    title = "Onboarding Assistant",
    subtitle = "Answer a few questions to get started",
    className = "",
}: ChatContainerProps) {
    // Access the openRightSidebar function from context
    const { openRightSidebar, isRightSidebarOpen } = useSidebar();

    // State for messages and chat flow
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: "initial-message",
            role: "assistant",
            content: initialMessage,
        },
    ])
    const [inputMode, setInputMode] = useState<InputMode>("text")
    const [conditionalText, setConditionalText] = useState("")
    const [selectedButtonValue, setSelectedButtonValue] = useState<string | null>(null)
    const [sessionId, setSessionId] = useState<string | null>(null)
    const [inputDisabled, setInputDisabled] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number | null>(null)
    const [conditionalTextVisible, setConditionalTextVisible] = useState(false)
    const [conditionalTriggerValue, setConditionalTriggerValue] = useState<string | null>(null)
    const [conditionalTextInputLabel, setConditionalTextInputLabel] = useState("Please provide more details:")
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const [showConditionalInput, setShowConditionalInput] = useState(false)
    const conditionalInputRef = useRef<HTMLDivElement>(null)
    const [isComplete, setIsComplete] = useState(false)
    const [multiSelectAnswers, setMultiSelectAnswers] = useState<{ [key: number]: string[] }>({});
    const [userName, setUserName] = useState<string>("");

    // Helper function to generate unique IDs for messages
    const generateMessageId = (role: string) => `${role}-${Date.now()}-${Math.floor(Math.random() * 1000)}`

    // Scroll to bottom when messages change
    useEffect(() => {
        // Let the ChatMessages component handle scrolling
        // This is a backup scroll mechanism in case the ScrollArea doesn't work properly
        const timeoutId = setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 150); // Slightly longer timeout than in ChatMessages

        return () => clearTimeout(timeoutId);
    }, [messages]);

    // Start the conversation by fetching the first question
    useEffect(() => {
        const startConversation = async () => {
            setIsProcessing(true)
            try {
                const response = await fetch("/api/onboarding/message", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ sessionId: null }),
                })

                if (!response.ok) {
                    throw new Error(`Failed to start conversation: ${response.status} ${response.statusText}`)
                }

                const data: OnboardingResponsePayload = await response.json()
                setSessionId(data.sessionId)
                setCurrentQuestionIndex(data.currentQuestionIndex)

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
                    ])
                }

                // Set input mode
                setInputMode(data.inputMode || "text")

                // Set conditional text properties if applicable
                if (data.conditionalTextInputLabel) {
                    setConditionalTextVisible(false)
                    setConditionalTriggerValue(data.conditionalTriggerValue || null)
                    setConditionalTextInputLabel(data.conditionalTextInputLabel)
                }
            } catch (error) {
                const errorMessage = error instanceof Error
                    ? error.message
                    : "Failed to start the conversation. Please try again."
                console.error("Error starting conversation:", errorMessage)
            } finally {
                setIsProcessing(false)
            }
        }

        startConversation()
    }, [])

    const handleConditionalTextChange = (text: string) => {
        // Update conditional text state
        setConditionalText(text)
    }

    const handleSendMessage = async (message: string) => {
        if (isProcessing || !sessionId) return

        // If answering the name question (index 0), store the name
        if (currentQuestionIndex === 0) {
            setUserName(message.trim());
        }

        // Add user message to chat
        setMessages((prev) => [
            ...prev,
            {
                id: generateMessageId("user"),
                role: "user",
                content: message,
            },
        ])

        // Add loading message
        setMessages((prev) => [
            ...prev,
            {
                id: generateMessageId("assistant"),
                role: "assistant",
                content: "Thinking...",
                isLoading: true,
            },
        ])

        setIsProcessing(true)
        setInputDisabled(true)

        try {
            // Prepare the request payload
            const payload: {
                sessionId: string
                response: string | { buttonValue: string }
                conditionalText?: string
            } = {
                sessionId,
                response: message,
            }

            // If we're in conditionalText mode and have conditional text, include it
            if (inputMode === "conditionalText" && conditionalTextVisible && conditionalText) {
                payload.conditionalText = conditionalText
            }

            const response = await fetch("/api/onboarding/message", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                throw new Error(`Failed to send message: ${response.status} ${response.statusText}`)
            }

            const data: OnboardingResponsePayload = await response.json()

            // Remove the loading message
            setMessages((prev) => prev.slice(0, -1))

            // Handle error if present
            if (data.error) {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: generateMessageId("assistant"),
                        role: "assistant",
                        content: data.error || "An error occurred",
                    },
                ])

                // If flow should halt, disable input
                if (data.haltFlow) {
                    setInputDisabled(true)
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
                    },
                ])
                setInputDisabled(true)
                setIsComplete(true)
                setCurrentQuestionIndex(TOTAL_STEPS)
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
                ])

                setCurrentQuestionIndex(data.currentQuestionIndex)
                setInputMode(data.inputMode || "text")

                // Reset conditional text state
                setConditionalText("")
                setConditionalTextVisible(false)
                setSelectedButtonValue(null)

                // Set up conditional text if applicable
                if (data.conditionalTextInputLabel) {
                    setConditionalTextVisible(false)
                    setConditionalTriggerValue(data.conditionalTriggerValue || null)
                    setConditionalTextInputLabel(data.conditionalTextInputLabel)
                }
            }

            // If we got a new session ID (session expired), update it
            if (data.newSessionId) {
                setSessionId(data.newSessionId)
            }
        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : "Error sending message. Please try again."
            console.error("Error sending message:", errorMessage)

            // Remove the loading message
            setMessages((prev) => prev.slice(0, -1))

            setMessages((prev) => [
                ...prev,
                {
                    id: generateMessageId("assistant"),
                    role: "assistant",
                    content: "Sorry, there was an error processing your message. Please try again.",
                },
            ])
        } finally {
            setIsProcessing(false)
            if (!isComplete) {
                setInputDisabled(false)
                // Add short delay before attempting to refocus
                setTimeout(() => {
                    // Trigger a re-render to focus the input
                    setInputMode(prev => prev)
                }, 100)
            }
        }
    }

    const handleButtonSelect = useCallback(async (value: string) => {
        if (isProcessing || !sessionId) return;
        // Use isMultiSelect property from question definition
        const currentQuestion = typeof currentQuestionIndex === 'number' ? getQuestionDetails(currentQuestionIndex) : null;
        if (currentQuestion && currentQuestion.isMultiSelect && typeof currentQuestionIndex === 'number') {
            setMultiSelectAnswers(prev => {
                const prevSelected = prev[currentQuestionIndex] || [];
                if (value === "None") {
                    return { ...prev, [currentQuestionIndex]: ["None"] };
                }
                const clearedPrev = prevSelected.filter((v: string) => v !== "None");
                if (clearedPrev.includes(value)) {
                    return { ...prev, [currentQuestionIndex]: clearedPrev.filter((v: string) => v !== value) };
                } else {
                    return { ...prev, [currentQuestionIndex]: [...clearedPrev, value] };
                }
            });
            return;
        }
        if (inputMode === "conditionalText" && conditionalTriggerValue && value === conditionalTriggerValue) {
            setConditionalTextVisible(true);
            setShowConditionalInput(true);
            setSelectedButtonValue(value);
            return;
        } else if (inputMode === "conditionalText") {
            setConditionalTextVisible(false);
            setShowConditionalInput(false);
            setSelectedButtonValue(value);
        }

        // Add user message to chat
        setMessages((prev) => [
            ...prev,
            {
                id: generateMessageId("user"),
                role: "user",
                content: value,
            },
        ])

        // Add loading message
        setMessages((prev) => [
            ...prev,
            {
                id: generateMessageId("assistant"),
                role: "assistant",
                content: "Thinking...",
                isLoading: true,
            },
        ])

        setIsProcessing(true)
        setInputDisabled(true)

        try {
            const payload = {
                sessionId,
                response: { buttonValue: value },
                conditionalText: conditionalTextVisible ? conditionalText : undefined,
            }

            const response = await fetch("/api/onboarding/message", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                throw new Error(`Failed to send message: ${response.status} ${response.statusText}`)
            }

            const data: OnboardingResponsePayload = await response.json()

            // Remove the loading message
            setMessages((prev) => prev.slice(0, -1))

            // Handle error if present
            if (data.error) {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: generateMessageId("assistant"),
                        role: "assistant",
                        content: data.error || "An error occurred",
                    },
                ])

                // If flow should halt, disable input
                if (data.haltFlow) {
                    setInputDisabled(true)
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
                    },
                ])
                setInputDisabled(true)
                setIsComplete(true)
                setCurrentQuestionIndex(TOTAL_STEPS)
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
                ])

                setCurrentQuestionIndex(data.currentQuestionIndex)
                setInputMode(data.inputMode || "text")

                // Reset conditional text state
                setConditionalText("")
                setConditionalTextVisible(false)
                setShowConditionalInput(false)
                setSelectedButtonValue(null)
                if (typeof currentQuestionIndex === 'number') {
                    setMultiSelectAnswers(prev => ({ ...prev, [currentQuestionIndex]: [] }));
                }

                // Set up conditional text if applicable
                if (data.conditionalTextInputLabel) {
                    setConditionalTextVisible(false)
                    setConditionalTriggerValue(data.conditionalTriggerValue || null)
                    setConditionalTextInputLabel(data.conditionalTextInputLabel)
                }
            }

            // If we got a new session ID (session expired), update it
            if (data.newSessionId) {
                setSessionId(data.newSessionId)
            }
        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : "Error processing button selection. Please try again."
            console.error("Error sending button selection:", errorMessage)

            // Remove the loading message
            setMessages((prev) => prev.slice(0, -1))

            setMessages((prev) => [
                ...prev,
                {
                    id: generateMessageId("assistant"),
                    role: "assistant",
                    content: "Sorry, there was an error processing your selection. Please try again.",
                },
            ])
        } finally {
            setIsProcessing(false)
            if (!isComplete) {
                setInputDisabled(false)
                // Add short delay before attempting to refocus
                setTimeout(() => {
                    // Trigger a re-render to focus the input
                    setInputMode(prev => prev)
                }, 100)
            }
        }
    }, [
        isProcessing, sessionId, currentQuestionIndex, setSelectedButtonValue, inputMode, conditionalTriggerValue, setConditionalTextVisible,
        setShowConditionalInput, setMessages, setIsProcessing, setInputDisabled,
        conditionalTextVisible, conditionalText, setCurrentQuestionIndex, setInputMode,
        setConditionalText, setConditionalTriggerValue, setConditionalTextInputLabel,
        isComplete, setSessionId // Added missing dependencies
    ]);

    const handleConditionalTextSubmit = () => {
        if (!selectedButtonValue || !sessionId || isProcessing) return;

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

        // Now make the API call with both the button value and conditional text
        const submitConditionalResponse = async () => {
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
                    throw new Error(`Failed to send message: ${response.status} ${response.statusText}`);
                }

                const data: OnboardingResponsePayload = await response.json();

                // Remove the loading message
                setMessages((prev) => prev.slice(0, -1));

                // Handle error if present
                if (data.error) {
                    setMessages((prev) => [
                        ...prev,
                        {
                            id: generateMessageId("assistant"),
                            role: "assistant",
                            content: data.error || "An error occurred",
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
                    setShowConditionalInput(false);
                    setSelectedButtonValue(null);
                    if (typeof currentQuestionIndex === 'number') {
                        setMultiSelectAnswers(prev => ({ ...prev, [currentQuestionIndex]: [] }));
                    }

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
                }
            } catch (error) {
                const errorMessage = error instanceof Error
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
                        content: "Sorry, there was an error processing your submission. Please try again.",
                    },
                ]);
            } finally {
                setIsProcessing(false);
                if (!isComplete) {
                    setInputDisabled(false);
                    // Add short delay before attempting to refocus
                    setTimeout(() => {
                        // Trigger a re-render to focus the input
                        setInputMode(prev => prev);
                    }, 100);
                }
            }
        };

        submitConditionalResponse();
    }

    const handleConfirmMultiSelect = async () => {
        if (
            isProcessing ||
            !sessionId ||
            typeof currentQuestionIndex !== 'number' ||
            !multiSelectAnswers[currentQuestionIndex] ||
            multiSelectAnswers[currentQuestionIndex].length === 0
        ) return;

        // Special handling for AI/ML (index 7): merge conditionalText if 'Other' is selected and custom text is provided
        let selections = multiSelectAnswers[currentQuestionIndex];
        if (currentQuestionIndex === 7 && selections.includes('Other') && conditionalText.trim()) {
            selections = selections.filter(v => v !== 'Other');
            selections.push(`Other: ${conditionalText.trim()}`);
        }

        setMessages((prev) => [
            ...prev,
            {
                id: generateMessageId("user"),
                role: "user",
                content: `Selected: ${selections.join(', ')}`,
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
            const payload = {
                sessionId,
                response: selections,
            };
            const response = await fetch("/api/onboarding/message", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                throw new Error(`Failed to send message: ${response.status} ${response.statusText}`);
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
                ])
                setInputDisabled(true)
                setIsComplete(true)
                setCurrentQuestionIndex(TOTAL_STEPS)
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
                if (typeof currentQuestionIndex === 'number') {
                    setMultiSelectAnswers(prev => ({ ...prev, [currentQuestionIndex]: [] }));
                }
                if (data.conditionalTextInputLabel) {
                    setConditionalTextVisible(false);
                    setConditionalTriggerValue(data.conditionalTriggerValue || null);
                    setConditionalTextInputLabel(data.conditionalTextInputLabel);
                }
            }
            if (data.newSessionId) {
                setSessionId(data.newSessionId);
            }
        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : "Error processing your selections. Please try again.";
            console.error("Error submitting selections:", errorMessage);
            setMessages((prev) => prev.slice(0, -1));
            setMessages((prev) => [
                ...prev,
                {
                    id: generateMessageId("assistant"),
                    role: "assistant",
                    content: "Sorry, there was an error processing your selections. Please try again.",
                },
            ]);
        } finally {
            setIsProcessing(false);
            if (!isComplete) {
                setInputDisabled(false);
                setTimeout(() => {
                    setInputMode(prev => prev);
                }, 100);
            }
        }
    };

    useEffect(() => {
        // Update showConditionalInput whenever conditionalTextVisible changes
        setShowConditionalInput(conditionalTextVisible)
    }, [conditionalTextVisible])

    useEffect(() => {
        if (showConditionalInput && conditionalInputRef.current) {
            setTimeout(() => {
                conditionalInputRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100); // Small delay to ensure the DOM has updated
        }
    }, [showConditionalInput])

    // Find the latest message with options to determine which buttons should be active
    const latestInteractiveMsgId = messages
        .filter(msg => msg.role === 'assistant' && msg.options && msg.options.length > 0)
        .pop()?.id || null;

    // State to track which button is being highlighted via keyboard
    const [highlightedButtonIndex, setHighlightedButtonIndex] = useState<number | null>(null);

    // Add keyboard shortcut handling for number keys 1-9
    useEffect(() => {
        // Calculate currentOptions inside the effect
        const currentOptions = messages
            .find(msg => msg.id === latestInteractiveMsgId)?.options || [];

        // Only enable keyboard shortcuts when we have options to select
        // and the input isn't disabled
        if ((inputMode === 'buttons' || inputMode === 'conditionalText') &&
            currentOptions.length > 0 &&
            !inputDisabled &&
            !isProcessing) {

            const handleKeyDown = (event: KeyboardEvent) => {
                // Check if key press is a number between 1-9
                if (/^[1-9]$/.test(event.key)) {
                    // Convert key to zero-based index (1 -> 0, 2 -> 1, etc.)
                    const optionIndex = parseInt(event.key) - 1;

                    // Check if this index exists in our options
                    if (optionIndex >= 0 && optionIndex < currentOptions.length) {
                        // Prevent default behavior (like scrolling)
                        event.preventDefault();

                        // Provide visual feedback by highlighting the button briefly
                        setHighlightedButtonIndex(optionIndex);

                        // Clear the highlight after a short delay
                        setTimeout(() => {
                            setHighlightedButtonIndex(null);
                        }, 200);

                        // Get the selected option and trigger the button selection
                        const selectedOption = currentOptions[optionIndex];
                        handleButtonSelect(selectedOption.value);
                    }
                }
            };

            // Add the event listener
            document.addEventListener('keydown', handleKeyDown);

            // Clean up function - remove event listener when component unmounts
            // or when dependencies change
            return () => {
                document.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [messages, latestInteractiveMsgId, inputMode, inputDisabled, isProcessing, handleButtonSelect]);

    // Add a handler to reset all chat state and start a new session
    const handleRestart = () => {
        setMessages([
            {
                id: "initial-message",
                role: "assistant",
                content: initialMessage,
            },
        ]);
        setInputMode("text");
        setConditionalText("");
        setSelectedButtonValue(null);
        setMultiSelectAnswers({});
        setSessionId(null);
        setInputDisabled(false);
        setIsProcessing(false);
        setCurrentQuestionIndex(null);
        setConditionalTextVisible(false);
        setConditionalTriggerValue(null);
        setConditionalTextInputLabel("Please provide more details:");
        setIsComplete(false);
        // Start a new onboarding session by re-running the effect
        // (simulate by calling the same logic as on mount)
        // You could also refactor the effect into a function and call it here
        window.location.reload(); // Easiest way to fully reset for now
    };

    // Add effect to open the sidebar when completion happens
    useEffect(() => {
        if (isComplete) {
            // Add a slight delay so the congratulations panel appears first
            setTimeout(() => {
                openRightSidebar();
            }, 1000);
        }
    }, [isComplete, openRightSidebar]);

    // Before the return statement, define currentQuestion:
    const currentQuestion = typeof currentQuestionIndex === 'number' ? getQuestionDetails(currentQuestionIndex) : null;

    return (
        <div
            className={`flex flex-col h-full bg-[#1a1a1a] dark:bg-[#1a1a1a] rounded-lg shadow-lg overflow-hidden border border-[#333333] dark:border-[#333333] text-white ${className} ${isRightSidebarOpen ? 'adjust-for-sidebar' : 'centered'}`}
        >
            <ChatHeader title={title} subtitle={subtitle} currentStep={currentQuestionIndex || 0} totalSteps={TOTAL_STEPS} onRestart={handleRestart} />

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
                />
            </div>

            <div
                className={`relative transition-all duration-200 ${showConditionalInput ? "flex-shrink-0 max-h-[250px]" : "flex-shrink-0"}`}
                ref={conditionalInputRef}
            >
                {!isComplete && (
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
                                typeof currentQuestionIndex === 'number' &&
                                Array.isArray(multiSelectAnswers[currentQuestionIndex]) &&
                                multiSelectAnswers[currentQuestionIndex]?.includes(currentQuestion.conditionalTriggerValue)
                            )
                        }
                        setConditionalText={setConditionalText}
                        onConditionalTextSubmit={handleConditionalTextSubmit}
                        currentQuestionIndex={currentQuestionIndex}
                        conditionalTextInputLabel={conditionalTextInputLabel}
                        className={conditionalTextVisible ? "max-h-[200px] overflow-y-auto" : ""}
                        showConfirmButton={
                            currentQuestion?.isMultiSelect &&
                            typeof currentQuestionIndex === 'number' &&
                            Array.isArray(multiSelectAnswers[currentQuestionIndex]) &&
                            multiSelectAnswers[currentQuestionIndex]?.length > 0
                        }
                        onConfirmLanguages={handleConfirmMultiSelect}
                        placeholder={getQuestionDetails(currentQuestionIndex ?? -1)?.placeholder || undefined}
                    />
                )}
            </div>
        </div>
    )
}

