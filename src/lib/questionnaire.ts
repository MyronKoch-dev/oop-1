// src/lib/questionnaire.ts

export type InputMode = 'text' | 'buttons' | 'conditionalText';

export interface ButtonOption {
    label: string; // Text on button
    value: string; // Value stored when clicked
}

export interface QuestionDetail {
    index: number;
    text: string;
    inputMode: InputMode;
    options?: ButtonOption[];
    conditionalTextInputLabel?: string; // Label for text input shown if specific button is clicked
    conditionalTriggerValue?: string; // Which button 'value' triggers the conditional input
    isOptional?: boolean; // Mainly for Q11, Q12
    validationHint?: string; // e.g., 'email', 'handles' - used by API to apply specific validation
    rePromptMessage?: string; // Specific message on validation failure
}

// Define all questions based on Spec FR1.4
const questions: QuestionDetail[] = [
    // Index 0
    {
        index: 0,
        text: "What's your full name?",
        inputMode: 'text',
        isOptional: false, // Assuming name is desired
    },
    // Index 1
    {
        index: 1,
        text: "What email should we use to stay in touch?",
        inputMode: 'text',
        isOptional: false,
        validationHint: 'email', // Signal for email validation
        rePromptMessage: "Please provide a valid email address.",
    },
    // Index 2
    {
        index: 2,
        text: "Please provide your handles (optional). Use the format `Platform: handle`, separated by commas if multiple. Example: `Telegram: @myhandle, GitHub: MyGitHubUser, X: @MyTwitter`",
        inputMode: 'text',
        isOptional: true, // Handles are optional
        validationHint: 'handles', // Signal for handle parsing
        rePromptMessage: "Please use the format 'Platform: [handle]', e.g., 'Telegram: @myhandle'.",
    },
    // Index 3 (Q4)
    {
        index: 3,
        text: "Which programming languages are you most comfortable with?",
        inputMode: 'buttons', // Primarily buttons
        options: [
            { label: "1. Rust", value: "Rust" },
            { label: "2. JavaScript", value: "JavaScript" },
            { label: "3. Python", value: "Python" },
            { label: "4. Go", value: "Go" },
            { label: "5. Solidity", value: "Solidity" },
            // Button/mechanism for 'Other' needs thought - maybe just text input OR a 6th button triggering text?
            // Let's assume a text input is *always* available alongside buttons for simplicity for now.
        ],
        // Or treat as conditionalText triggered by an 'Other' button:
        // inputMode: 'conditionalText',
        // conditionalTriggerValue: 'Other', // Need an 'Other' button in options
        // conditionalTextInputLabel: "Specify other languages:",
        isOptional: false, // Need some input
        validationHint: 'languages', // Signal for language parsing
    },
    // Index 4 (Q5)
    {
        index: 4,
        text: "Have you worked with blockchain platforms?",
        inputMode: 'conditionalText', // Buttons, with text if 'Yes'
        options: [
            { label: "1. Yes", value: "Yes" },
            { label: "2. No, but I'm curious!", value: "No - curious" },
            { label: "3. No experience", value: "No experience" },
        ],
        conditionalTriggerValue: "Yes",
        conditionalTextInputLabel: "Specify platforms (e.g., Cosmos, Ethereum):",
        isOptional: false,
    },
    // Index 5 (Q6)
    {
        index: 5,
        text: "Do you have experience with AI/ML beyond ChatGPT?",
        inputMode: 'conditionalText', // Buttons, with text if 'Yes'
        options: [
            { label: "1. Yes", value: "Yes" },
            { label: "2. No", value: "No" },
        ],
        conditionalTriggerValue: "Yes",
        conditionalTextInputLabel: "Specify areas/projects (e.g., NLP, CV Ops):",
        isOptional: false,
    },
    // Index 6 (Q7)
    {
        index: 6,
        text: "How familiar are you with Andromeda's tools?",
        inputMode: 'buttons',
        options: [
            { label: "1. Very familiar", value: "Very familiar" },
            { label: "2. Some experience", value: "Some experience" },
            { label: "3. Beginner", value: "Beginner" },
            { label: "4. No idea", value: "No idea" },
        ],
        isOptional: false,
    },
    // Index 7 (Q8)
    {
        index: 7,
        text: "How would you rate your technical expertise?",
        inputMode: 'buttons',
        options: [
            { label: "1. Beginner", value: "Beginner" },
            { label: "2. Intermediate", value: "Intermediate" },
            { label: "3. Advanced", value: "Advanced" },
        ],
        isOptional: false,
    },
    // Index 8 (Q9)
    {
        index: 8,
        text: "Have you ever participated in a hackathon?",
        inputMode: 'buttons',
        options: [
            { label: "1. Yes—and I've won! 🏆", value: "Winner" },
            { label: "2. Yes—as a participant", value: "Participant" },
            { label: "3. Not yet", value: "Not yet" }, // Changed value slightly for clarity
        ],
        isOptional: false,
    },
    // Index 9 (Q10)
    {
        index: 9,
        text: "What's your main goal here?",
        inputMode: 'buttons',
        options: [
            { label: "1. Build apps/dApps", value: "Build apps/dApps" },
            { label: "2. Earn bounties", value: "Earn bounties" },
            { label: "3. Share ideas for new features", value: "Share ideas for new features" },
            { label: "4. Work on AI projects", value: "Work on AI projects" },
            { label: "5. Promote blockchain/Andromeda", value: "Promote blockchain/Andromeda" },
            { label: "6. Learn Web3 basics", value: "Learn Web3 basics" },
        ],
        isOptional: false,
    },
    // Index 10 (Q11)
    {
        index: 10,
        text: "Got a portfolio or project links to showcase? (Optional, but helpful!)",
        inputMode: 'text',
        isOptional: true,
    },
    // Index 11 (Q12)
    {
        index: 11,
        text: "Anything else we should know about your skills or interests? (Optional)",
        inputMode: 'text',
        isOptional: true,
    },
];

export const TOTAL_QUESTIONS = questions.length;

/**
 * Gets the details for a specific question by its 0-based index.
 * Returns null if the index is out of bounds.
 */
export function getQuestionDetails(index: number): QuestionDetail | null {
    if (index >= 0 && index < TOTAL_QUESTIONS) {
        return questions[index];
    }
    return null;
}

/**
 * Checks if a given index corresponds to the final question.
 */
export function isFinalQuestion(index: number): boolean {
    return index === TOTAL_QUESTIONS - 1;
}