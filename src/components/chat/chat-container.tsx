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
const TOTAL_STEPS = 14;

export function ChatContainer({
    initialMessage = "Hey, welcome to Andromeda! 🪐 I'm here to help you get started. Let me ask you a few questions to figure out what's best for you in our community. 💫 Once I understand what you're looking for, I'll point you directly to the right spot. Hope you're ready to dive in! 🌠",
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
    const [multiSelectedLanguages, setMultiSelectedLanguages] = useState<string[]>([])
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
                        content: "⭐⭐⭐ You can get started here: ⭐⭐⭐",
                        url: data.finalResult?.recommendedPathUrl
                    },
                    {
                        id: generateMessageId("assistant"),
                        role: "assistant",
                        content: "Thank you for completing the onboarding process!\nWELCOME TO ANDROMEDA\n🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉",
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
                setMultiSelectedLanguages([])

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

        // Special handling for Question 5 (Programming Languages) - enables multi-select
        if (currentQuestionIndex === 5) {
            // Handle "None" option as mutually exclusive with other languages
            setMultiSelectedLanguages(prev => {
                if (value === "None") {
                    return ["None"]; // Select only "None", clear any other selections
                } else {
                    // If "None" was previously selected, clear it before adding a real language
                    const clearedPrev = prev.filter(lang => lang !== "None");

                    // Toggle the actual language
                    if (clearedPrev.includes(value)) {
                        return clearedPrev.filter(lang => lang !== value);
                    } else {
                        return [...clearedPrev, value];
                    }
                }
            });

            // Don't proceed with API call yet - wait for confirmation button
            return;
        }

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
                        content: "⭐⭐⭐ You can get started here: ⭐⭐⭐",
                        url: data.finalResult?.recommendedPathUrl
                    },
                    {
                        id: generateMessageId("assistant"),
                        role: "assistant",
                        content: "Thank you for completing the onboarding process!\nWELCOME TO ANDROMEDA\n🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉",
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
                setMultiSelectedLanguages([])

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
                            content: "⭐⭐⭐ You can get started here: ⭐⭐⭐",
                            url: data.finalResult?.recommendedPathUrl
                        },
                        {
                            id: generateMessageId("assistant"),
                            role: "assistant",
                            content: "Thank you for completing the onboarding process!\nWELCOME TO ANDROMEDA\n🎉🎉🎉🎉��🎉🎉🎉🎉🎉🎉🎉🎉",
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
                    setMultiSelectedLanguages([])

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

    // New handler for confirming multiple language selections
    const handleConfirmLanguages = async () => {
        if (isProcessing || !sessionId || multiSelectedLanguages.length === 0) return;

        // Add user message showing selected languages
        setMessages((prev) => [
            ...prev,
            {
                id: generateMessageId("user"),
                role: "user",
                content: `Selected languages: ${multiSelectedLanguages.join(', ')}`,
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
                response: multiSelectedLanguages,
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
                        content: "⭐⭐⭐ You can get started here: ⭐⭐⭐",
                        url: data.finalResult?.recommendedPathUrl
                    },
                    {
                        id: generateMessageId("assistant"),
                        role: "assistant",
                        content: "Thank you for completing the onboarding process!\nWELCOME TO ANDROMEDA\n🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉",
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

                // Reset selection states
                setConditionalText("");
                setConditionalTextVisible(false);
                setShowConditionalInput(false);
                setSelectedButtonValue(null);
                setMultiSelectedLanguages([]); // Reset multi-select state

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
                : "Error processing your selections. Please try again.";
            console.error("Error submitting language selections:", errorMessage);

            // Remove the loading message
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
                // Add short delay before attempting to refocus
                setTimeout(() => {
                    // Trigger a re-render to focus the input
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

    // Get the current options from the latest interactive message
    const currentOptions = messages
        .find(msg => msg.id === latestInteractiveMsgId)?.options || [];

    // State to track which button is being highlighted via keyboard
    const [highlightedButtonIndex, setHighlightedButtonIndex] = useState<number | null>(null);

    // Add keyboard shortcut handling for number keys 1-9
    useEffect(() => {
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
    }, [inputMode, currentOptions, inputDisabled, isProcessing, handleButtonSelect]);

    return (
        <div
            className={`flex flex-col h-full bg-[#1a1a1a] dark:bg-[#1a1a1a] rounded-lg shadow-lg overflow-hidden border border-[#333333] dark:border-[#333333] text-white ${className}`}
        >
            <ChatHeader title={title} subtitle={subtitle} currentStep={currentQuestionIndex || 0} totalSteps={TOTAL_STEPS} />

            <div className={`flex-1 overflow-hidden relative`}>
                <ChatMessages
                    messages={messages}
                    onButtonClick={handleButtonSelect}
                    selectedButtonValue={selectedButtonValue}
                    messagesEndRef={messagesEndRef}
                    className="h-full overflow-auto"
                    latestInteractiveMessageId={latestInteractiveMsgId}
                    highlightedButtonIndex={highlightedButtonIndex}
                    multiSelectedLanguages={multiSelectedLanguages}
                    currentQuestionIndex={currentQuestionIndex}
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
                        conditionalTextVisible={conditionalTextVisible}
                        setConditionalText={setConditionalText}
                        onConditionalTextSubmit={handleConditionalTextSubmit}
                        currentQuestionIndex={currentQuestionIndex}
                        conditionalTextInputLabel={conditionalTextInputLabel}
                        className={conditionalTextVisible ? "max-h-[200px] overflow-y-auto" : ""}
                        showConfirmButton={currentQuestionIndex === 5 && multiSelectedLanguages.length > 0}
                        onConfirmLanguages={handleConfirmLanguages}
                    />
                )}
            </div>
        </div>
    )
}

