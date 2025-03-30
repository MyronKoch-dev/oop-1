"use client"

import { useState, useRef, useEffect } from "react"
import { ChatHeader } from "./chat-header"
import { ChatMessages, type ChatMessage } from "./chat-messages"
import { ChatInput, type InputMode } from "./chat-input"

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
const TOTAL_STEPS = 12;

export function ChatContainer({
    initialMessage = "Hi there! I'm here to help you get started. Let's begin with a few questions to personalize your experience.",
    title = "Onboarding Assistant",
    subtitle = "Answer a few questions to get started",
    className = "",
}: ChatContainerProps) {
    // This component will be stateful in the actual implementation
    // Here we're just defining the structure and props

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

    // Helper function to generate unique IDs for messages
    const generateMessageId = (role: string) => `${role}-${Date.now()}-${Math.floor(Math.random() * 1000)}`

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

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
                        content: `Based on your responses, I recommend the "${data.finalResult?.recommendedPath}" path for you.`,
                    },
                    {
                        id: generateMessageId("assistant"),
                        role: "assistant",
                        content: `You can get started here: ${data.finalResult?.recommendedPathUrl}`,
                    },
                    {
                        id: generateMessageId("assistant"),
                        role: "assistant",
                        content: "Thank you for completing the onboarding process!",
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

    const handleButtonSelect = async (value: string) => {
        if (isProcessing || !sessionId) return

        setSelectedButtonValue(value)

        // Only show conditional text input and return early when BOTH conditions are true:
        // 1. We're specifically in conditionalText mode
        // 2. The clicked value matches the conditionalTriggerValue
        // For ALL other cases (including 'buttons' mode), proceed with the API call
        if (inputMode === "conditionalText" && conditionalTriggerValue && value === conditionalTriggerValue) {
            setConditionalTextVisible(true)
            setShowConditionalInput(true)
            return // Don't submit yet, wait for conditional text
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
                        content: `Based on your responses, I recommend the "${data.finalResult?.recommendedPath}" path for you.`,
                    },
                    {
                        id: generateMessageId("assistant"),
                        role: "assistant",
                        content: `You can get started here: ${data.finalResult?.recommendedPathUrl}`,
                    },
                    {
                        id: generateMessageId("assistant"),
                        role: "assistant",
                        content: "Thank you for completing the onboarding process!",
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
    }

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
                            content: `Based on your responses, I recommend the "${data.finalResult?.recommendedPath}" path for you.`,
                        },
                        {
                            id: generateMessageId("assistant"),
                            role: "assistant",
                            content: `You can get started here: ${data.finalResult?.recommendedPathUrl}`,
                        },
                        {
                            id: generateMessageId("assistant"),
                            role: "assistant",
                            content: "Thank you for completing the onboarding process!",
                        },
                    ]);
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
                    ]);

                    setCurrentQuestionIndex(data.currentQuestionIndex);
                    setInputMode(data.inputMode || "text");

                    // Reset conditional text state
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

    return (
        <div
            className={`flex flex-col h-[600px] bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 ${className}`}
        >
            <ChatHeader title={title} subtitle={subtitle} currentStep={currentQuestionIndex || 0} totalSteps={TOTAL_STEPS} />

            <div className={`flex-1 overflow-hidden relative ${showConditionalInput ? "pb-4" : ""}`}>
                <ChatMessages
                    messages={messages}
                    onButtonClick={handleButtonSelect}
                    selectedButtonValue={selectedButtonValue}
                    messagesEndRef={messagesEndRef}
                    className={showConditionalInput ? "pb-20" : ""}
                />
            </div>

            <div
                className={`relative transition-all duration-200 ${showConditionalInput ? "flex-shrink-0 max-h-[250px] overflow-visible" : ""}`}
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
                        conditionalTextVisible={conditionalTextVisible}
                        setConditionalText={setConditionalText}
                        onConditionalTextSubmit={handleConditionalTextSubmit}
                        currentQuestionIndex={currentQuestionIndex}
                        conditionalTextInputLabel={conditionalTextInputLabel}
                        className={conditionalTextVisible ? "max-h-[200px] overflow-y-auto" : ""}
                    />
                )}
            </div>
        </div>
    )
}

