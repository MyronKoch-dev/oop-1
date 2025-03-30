"use client"

import { useState, useRef, useEffect } from "react"
import { ChatHeader } from "./chat-header"
import { ChatMessages, type ChatMessage } from "./chat-messages"
import { ChatInput, type InputMode } from "./chat-input"

// Define a constant for total questions
const TOTAL_QUESTIONS = 5

// Helper function to generate unique IDs for messages
const generateMessageId = (role: string) => `${role}-${Date.now()}-${Math.floor(Math.random() * 1000)}`

interface ChatContainerProps {
    initialMessage?: string
    title?: string
    subtitle?: string
    className?: string
}

export function ChatContainer({
    initialMessage = "Hi there! I'm here to help you get started. Let's begin with a few questions to personalize your experience.",
    title = "Onboarding Assistant",
    subtitle = "Answer a few questions to get started",
    className = "",
}: ChatContainerProps) {
    // This component will be stateful in the actual implementation
    // Here we're just defining the structure and props

    // Example state variables (to be implemented by you)
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: "initial-message",
            role: "assistant",
            content: initialMessage,
        },
    ])
    const [inputMode, setInputMode] = useState<InputMode>("text")
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isConditionalVisible, setIsConditionalVisible] = useState(false)
    const [conditionalText, setConditionalText] = useState("")
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [conditionalLabel, setConditionalLabel] = useState("")
    const [selectedButtonValue, setSelectedButtonValue] = useState<string | null>(null)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isLoading, setIsLoading] = useState(false)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [currentStep, setCurrentStep] = useState(0)
    const [sessionId, setSessionId] = useState<string | null>(null)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [inputDisabled, setInputDisabled] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number | null>(null)
    const [conditionalTextVisible, setConditionalTextVisible] = useState(false)
    const [conditionalTriggerValue, setConditionalTriggerValue] = useState<string | null>(null)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [error, setError] = useState<string | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

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

                const data = await response.json()
                setSessionId(data.sessionId)
                setCurrentQuestionIndex(data.currentQuestionIndex)

                // Add the first question as a message
                if (data.nextQuestion) {
                    setMessages((prev) => [
                        ...prev,
                        {
                            id: generateMessageId("assistant"),
                            role: "assistant",
                            content: data.nextQuestion,
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
                }
            } catch (error) {
                console.error("Error starting conversation:", error)
                setError("Failed to start the conversation. Please try again.")
            } finally {
                setIsProcessing(false)
            }
        }

        startConversation()
    }, [])

    // Example callback functions (to be implemented by you)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleSendText = (text: string) => {
        // Add user message to chat
        // Call API with text
        // Update state based on API response
        console.log("Sending text:", text)
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleButtonClick = (value: string) => {
        // Set selected button value
        // If conditional input is needed, show it
        // Otherwise, call API with button value
        console.log("Button clicked:", value)
    }

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

            const data = await response.json()

            // Remove the loading message
            setMessages((prev) => prev.slice(0, -1))

            // Handle error if present
            if (data.error) {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: generateMessageId("assistant"),
                        role: "assistant",
                        content: data.error,
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
                        content: `Based on your responses, I recommend the "${data.finalResult.recommendedPath}" path for you.`,
                    },
                    {
                        id: generateMessageId("assistant"),
                        role: "assistant",
                        content: `You can get started here: ${data.finalResult.recommendedPathUrl}`,
                    },
                    {
                        id: generateMessageId("assistant"),
                        role: "assistant",
                        content: "Thank you for completing the onboarding process!",
                    },
                ])
                setInputDisabled(true)
            }
            // Handle next question
            else if (data.nextQuestion) {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: generateMessageId("assistant"),
                        role: "assistant",
                        content: data.nextQuestion,
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
                }
            }

            // If we got a new session ID (session expired), update it
            if (data.newSessionId) {
                setSessionId(data.newSessionId)
            }
        } catch (error) {
            console.error("Error sending message:", error)

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
            setInputDisabled(false)
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleButtonSelect = async (value: string) => {
        if (isProcessing || !sessionId) return

        setSelectedButtonValue(value)

        // Check if we need to show conditional text input
        if (inputMode === "conditionalText" && conditionalTriggerValue && value === conditionalTriggerValue) {
            setConditionalTextVisible(true)
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

            const data = await response.json()

            // Remove the loading message
            setMessages((prev) => prev.slice(0, -1))

            // Handle error if present
            if (data.error) {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: generateMessageId("assistant"),
                        role: "assistant",
                        content: data.error,
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
                        content: `Based on your responses, I recommend the "${data.finalResult.recommendedPath}" path for you.`,
                    },
                    {
                        id: generateMessageId("assistant"),
                        role: "assistant",
                        content: `You can get started here: ${data.finalResult.recommendedPathUrl}`,
                    },
                    {
                        id: generateMessageId("assistant"),
                        role: "assistant",
                        content: "Thank you for completing the onboarding process!",
                    },
                ])
                setInputDisabled(true)
            }
            // Handle next question
            else if (data.nextQuestion) {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: generateMessageId("assistant"),
                        role: "assistant",
                        content: data.nextQuestion,
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
                }
            }

            // If we got a new session ID (session expired), update it
            if (data.newSessionId) {
                setSessionId(data.newSessionId)
            }
        } catch (error) {
            console.error("Error sending button selection:", error)

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
            setInputDisabled(false)
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleConditionalTextSubmit = () => {
        if (selectedButtonValue) {
            handleButtonSelect(selectedButtonValue)
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const getProgress = () => {
        if (currentQuestionIndex === null) return 0
        return Math.min(Math.round((currentQuestionIndex / TOTAL_QUESTIONS) * 100), 100)
    }

    return (
        <div
            className={`flex flex-col h-[600px] bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 ${className}`}
        >
            <ChatHeader title={title} subtitle={subtitle} currentStep={currentStep} totalSteps={12} />

            <ChatMessages
                messages={messages}
                onButtonClick={handleButtonClick}
                selectedButtonValue={selectedButtonValue}
                messagesEndRef={messagesEndRef}
            />

            <ChatInput
                onSendText={handleSendText}
                onConditionalTextChange={handleConditionalTextChange}
                isConditionalVisible={isConditionalVisible}
                conditionalLabel={conditionalLabel}
                conditionalText={conditionalText}
                disabled={isLoading}
                inputMode={inputMode}
                onSendMessage={handleSendMessage}
                conditionalTextVisible={conditionalTextVisible}
                setConditionalText={setConditionalText}
                onConditionalTextSubmit={handleConditionalTextSubmit}
                currentQuestionIndex={currentQuestionIndex}
            />
        </div>
    )
}

