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
    placeholder?: string; // Added placeholder
}

// Define all questions based on Spec FR1.4
const questions: QuestionDetail[] = [
    // Index 0
    {
        index: 0,
        text: "What shall I call you?",
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
    // Index 2 (GitHub)
    {
        index: 2,
        text: "What is your GitHub username? (Optional)",
        inputMode: 'text',
        isOptional: true,
        validationHint: 'github_username'
    },
    // Index 3 (Telegram)
    {
        index: 3,
        text: "What is your Telegram handle? (Optional, include @)",
        inputMode: 'text',
        isOptional: true,
        validationHint: 'telegram_handle',
        placeholder: '@yourhandle',
    },
    // Index 4 (X/Twitter)
    {
        index: 4,
        text: "What is your X/Twitter handle? (Optional, include @)",
        inputMode: 'text',
        isOptional: true,
        validationHint: 'x_handle',
        placeholder: '@yourhandle',
    },
    // Index 5 (Previously Q4 - Programming Languages)
    {
        index: 5,
        text: "Which programming languages are you most comfortable with? (Select all that apply, or 'None')",
        inputMode: 'buttons',
        options: [
            { label: "1. Rust", value: "Rust" },
            { label: "2. JavaScript", value: "JavaScript" },
            { label: "3. Python", value: "Python" },
            { label: "4. Go", value: "Go" },
            { label: "5. Solidity", value: "Solidity" },
            { label: "6. TypeScript", value: "TypeScript" },
            { label: "7. Java", value: "Java" },
            { label: "8. C#", value: "C#" },
            { label: "9. None of these / No experience yet", value: "None" },
        ],
        isOptional: false,
        validationHint: 'languages',
    },
    // Index 6 (Previously Q5 - Blockchain)
    {
        index: 6,
        text: "Which blockchain platforms have you worked with? (Select all that apply, or 'None')",
        inputMode: 'buttons',
        options: [
            { label: "1. Bitcoin", value: "Bitcoin" },
            { label: "2. Ethereum", value: "Ethereum" },
            { label: "3. Solana", value: "Solana" },
            { label: "4. SEI", value: "SEI" },
            { label: "5. Cosmos SDK chains", value: "Cosmos SDK chains" },
            { label: "6. XRP", value: "XRP" },
            { label: "7. BNB", value: "BNB" },
            { label: "8. Polygon", value: "Polygon" },
            { label: "9. Avalanche", value: "Avalanche" },
            { label: "10. Polkadot", value: "Polkadot" },
            { label: "11. Other / Not listed", value: "Other" },
            { label: "12. None of these / No experience yet", value: "None" },
        ],
        isOptional: false,
        validationHint: 'blockchain_platforms',
    },
    // Index 7 (Previously Q6 - AI/ML)
    {
        index: 7,
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
    // Index 8 (Previously Q7 - Andromeda tools)
    {
        index: 8,
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
    // Index 9 (Previously Q8 - Technical expertise)
    {
        index: 9,
        text: "How would you rate your technical expertise?",
        inputMode: 'buttons',
        options: [
            { label: "1. Beginner", value: "Beginner" },
            { label: "2. Intermediate", value: "Intermediate" },
            { label: "3. Advanced", value: "Advanced" },
        ],
        isOptional: false,
    },
    // Index 10 (Previously Q9 - Hackathon)
    {
        index: 10,
        text: "Have you ever participated in a hackathon?",
        inputMode: 'buttons',
        options: [
            { label: "1. Yes—and I've won! 🏆", value: "Winner" },
            { label: "2. Yes—as a participant", value: "Participant" },
            { label: "3. Not yet", value: "Not yet" }, // Changed value slightly for clarity
        ],
        isOptional: false,
    },
    // Index 11 (Previously Q10 - Main goal)
    {
        index: 11,
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
    // Index 12 (Previously Q11 - Portfolio)
    {
        index: 12,
        text: "Got a portfolio or project links to showcase? (Optional, but helpful!)",
        inputMode: 'text',
        isOptional: true,
    },
    // Index 13 (Previously Q12 - Additional skills)
    {
        index: 13,
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