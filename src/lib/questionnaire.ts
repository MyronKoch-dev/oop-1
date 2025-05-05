// src/lib/questionnaire.ts

export type InputMode = "text" | "buttons" | "conditionalText";

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
  isMultiSelect?: boolean;
}

// Define all questions based on Spec FR1.4
const questions: QuestionDetail[] = [
  // Index 0
  {
    index: 0,
    text: "What shall I call you?",
    inputMode: "text",
    isOptional: false, // Assuming name is desired
  },
  // Index 1 (Programming Languages)
  {
    index: 1,
    text: "Which programming languages are you most comfortable with, {name}? (Select all that apply, or 'None')",
    inputMode: "buttons",
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
    validationHint: "languages",
    isMultiSelect: true,
  },
  // Index 2 (Blockchain)
  {
    index: 2,
    text: "Which blockchain platforms have you worked with? (Select all that apply, or 'None')",
    inputMode: "buttons",
    options: [
      { label: "1. Bitcoin", value: "Bitcoin" },
      { label: "2. Ethereum", value: "Ethereum" },
      { label: "3. Solana", value: "Solana" },
      { label: "4. SEI", value: "SEI" },
      { label: "5. Cosmos SDK chains", value: "Cosmos SDK chains" },
      { label: "6. XRP", value: "XRP" },
      { label: "7. BNB", value: "BNB" },
      { label: "8. Polygon", value: "Polygon" },
      { label: "9. None of these / No experience yet", value: "None" },
    ],
    isOptional: false,
    validationHint: "blockchain_platforms",
    isMultiSelect: true,
  },
  // Index 3 (AI/ML)
  {
    index: 3,
    text: "Do you have experience with AI/ML beyond ChatGPT? (Select all that apply)",
    inputMode: "buttons",
    options: [
      { label: "1. Natural Language Processing (NLP)", value: "NLP" },
      { label: "2. Computer Vision", value: "Computer Vision" },
      { label: "3. Machine Learning (General)", value: "Machine Learning" },
      { label: "4. Deep Learning", value: "Deep Learning" },
      { label: "5. Reinforcement Learning", value: "Reinforcement Learning" },
      { label: "6. Data Science / Analytics", value: "Data Science" },
      { label: "7. MLOps / Model Deployment", value: "MLOps" },
      { label: "8. Generative AI", value: "Generative AI" },
      { label: "9. Other", value: "Other" },
    ],
    conditionalTriggerValue: "Other",
    conditionalTextInputLabel: "Please specify your AI/ML experience:",
    isOptional: false,
    isMultiSelect: true,
  },
  // Index 4 (Andromeda tools)
  {
    index: 4,
    text: "Okay, great. So, how familiar are you with Andromeda's tools?",
    inputMode: "buttons",
    options: [
      { label: "1. Very familiar", value: "Very familiar" },
      { label: "2. Some experience", value: "Some experience" },
      { label: "3. Beginner", value: "Beginner" },
      { label: "4. No idea", value: "No idea" },
    ],
    isOptional: false,
  },
  // Index 5 (Technical expertise)
  {
    index: 5,
    text: "How would you rate your technical expertise?",
    inputMode: "buttons",
    options: [
      { label: "1. Beginner", value: "Beginner" },
      { label: "2. Intermediate", value: "Intermediate" },
      { label: "3. Advanced", value: "Advanced" },
    ],
    isOptional: false,
  },
  // Index 6 (Hackathon)
  {
    index: 6,
    text: "Have you ever participated in a hackathon?",
    inputMode: "buttons",
    options: [
      { label: "Yes, a web 2 one", value: "Web2" },
      { label: "Yes, a web3 one", value: "Web3" },
      { label: "I won!", value: "Winner" },
      { label: "No, I haven't", value: "No" },
    ],
    isOptional: false,
    isMultiSelect: true,
  },
  // Index 7 (Main goal)
  {
    index: 7,
    text: "Out of these broad choices, What are your goals here, {name}?",
    inputMode: "buttons",
    options: [
      { label: "1. Build apps/dApps", value: "Build apps/dApps" },
      { label: "2. Earn bounties", value: "Earn bounties" },
      {
        label: "3. Share ideas for new features",
        value: "Share ideas for new features",
      },
      { label: "4. Work on AI projects", value: "Work on AI projects" },
      {
        label: "5. Promote blockchain/Andromeda",
        value: "Promote blockchain/Andromeda",
      },
      { label: "6. Learn about Andromeda", value: "Learn about Andromeda" },
    ],
    isOptional: false,
  },
  // Index 8 (Portfolio)
  {
    index: 8,
    text: "Got a portfolio or project links to showcase? (Optional, but helpful!)",
    inputMode: "text",
    isOptional: true,
  },
  // Index 9 (Additional skills)
  {
    index: 9,
    text: "Anything else we should know about your skills or interests? (Optional)",
    inputMode: "text",
    isOptional: true,
  },
  // Index 10 (Email)
  {
    index: 10,
    text: "What email should we use to stay in touch, {name}?",
    inputMode: "text",
    isOptional: false,
    validationHint: "email",
    rePromptMessage: "Please provide a valid email address.",
  },
  // Index 11 (GitHub)
  {
    index: 11,
    text: "What is your GitHub username? (Optional)",
    inputMode: "text",
    isOptional: true,
    validationHint: "github_username",
  },
  // Index 12 (Telegram)
  {
    index: 12,
    text: "What is your Telegram handle? (Optional)",
    inputMode: "text",
    isOptional: true,
    validationHint: "telegram_handle",
    placeholder: "@yourhandle",
  },
  // Index 13 (X/Twitter)
  {
    index: 13,
    text: "What is your X/Twitter handle? (Optional)",
    inputMode: "text",
    isOptional: true,
    validationHint: "x_handle",
    placeholder: "@yourhandle",
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
