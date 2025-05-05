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
  // Index 0 (Name)
  {
    index: 0,
    text: "Hey there! What should I call you?",
    inputMode: "text",
    isOptional: false,
  },
  // Index 1 (Technical expertise, moved up)
  {
    index: 1,
    text: "Nice to meet you, {name}! If you had to rate your technical expertise, where would you put yourself?",
    inputMode: "buttons",
    options: [
      { label: "1. Beginner", value: "Beginner" },
      { label: "2. Intermediate", value: "Intermediate" },
      { label: "3. Advanced", value: "Advanced" },
    ],
    isOptional: false,
  },
  // Index 2 (Programming Languages)
  {
    index: 2,
    text: "If you are a programmer, which programming languages do you feel most at home with? (Pick as many as you like, or select 'I'm not a programmer.' if that's you.)",
    inputMode: "buttons",
    options: [
      { label: "1. Rust", value: "Rust" },
      { label: "2. JavaScript", value: "JavaScript" },
      { label: "3. Python", value: "Python" },
      { label: "4. Go", value: "Go" },
      { label: "5. Solidity", value: "Solidity" },
      { label: "6. TypeScript", value: "TypeScript" },
      { label: "7. Java", value: "Java" },
      { label: "8. Others not listed", value: "Others not listed" },
      { label: "9. I'm not a programmer.", value: "Not a programmer" },
    ],
    isOptional: false,
    validationHint: "languages",
    isMultiSelect: true,
  },
  // Index 3
  {
    index: 3,
    text: "How about blockchains? Have you tinkered with any of these platforms before? (Select all that apply, or 'None')",
    inputMode: "buttons",
    options: [
      { label: "1. Bitcoin", value: "Bitcoin" },
      { label: "2. Ethereum/EVMs", value: "Ethereum/EVMs" },
      { label: "3. Solana", value: "Solana" },
      { label: "4. SEI", value: "SEI" },
      { label: "5. Cosmos SDK chains", value: "Cosmos SDK chains" },
      { label: "6. XRP", value: "XRP" },
      { label: "7. BNB", value: "BNB" },
      { label: "8. Others not listed", value: "Others not listed" },
      { label: "9. None of these / No experience yet", value: "None" },
    ],
    isOptional: false,
    validationHint: "blockchain_platforms",
    isMultiSelect: true,
  },
  // Index 4
  {
    index: 4,
    text: "And what about AI or machine learning? Any hands-on experience beyond just chatting with ChatGPT? (Select all that fit, or 'Other' to specify)",
    inputMode: "buttons",
    options: [
      { label: "1. Natural Language Processing (NLP)", value: "NLP" },
      { label: "2. Computer Vision", value: "Computer Vision" },
      { label: "3. Smart Contract AI/Automation", value: "Smart Contract AI" },
      {
        label: "4. Blockchain Data Science / Analytics",
        value: "Blockchain Analytics",
      },
      { label: "5. Generative AI (NFTs, Art, Music)", value: "Generative AI" },
      {
        label: "6. Decentralized AI / Federated Learning",
        value: "Decentralized AI",
      },
      {
        label: "7. MLOps / Model Deployment (on-chain/off-chain)",
        value: "MLOps",
      },
      {
        label: "8. Crypto Trading Bots / DeFi Automation",
        value: "DeFi Automation",
      },
      { label: "9. Other", value: "Other" },
    ],
    conditionalTriggerValue: "Other",
    conditionalTextInputLabel:
      "Cool! Tell me a bit about your AI/ML experience:",
    isOptional: false,
    isMultiSelect: true,
  },
  // Index 5
  {
    index: 5,
    text: "Switching gears a bit—how familiar are you with Andromeda's tools so far?",
    inputMode: "buttons",
    options: [
      { label: "1. Very familiar", value: "Very familiar" },
      { label: "2. Some experience", value: "Some experience" },
      { label: "3. Beginner", value: "Beginner" },
      { label: "4. No idea", value: "No idea" },
    ],
    isOptional: false,
  },
  // Index 6
  {
    index: 6,
    text: "Ever tried your hand at a hackathon? (You can pick more than one if they apply!)",
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
  // Index 7
  {
    index: 7,
    text: "Based on what you've shared so far, {name}, here are some paths where people like you often find success. Which of these would you like to focus on, or are you most curious about? (Pick what feels right—you can always explore more later!)",
    inputMode: "buttons",
    options: [
      { label: "🚀 Building apps/dApps", value: "Build apps/dApps" },
      { label: "💰 Earning bounties", value: "Earn bounties" },
      {
        label: "💡 Sharing ideas for new features",
        value: "Share ideas for new features",
      },
      { label: "🤖 Working on AI projects", value: "Work on AI projects" },
      {
        label: "📢 Promoting blockchain/Andromeda",
        value: "Promote blockchain/Andromeda",
      },
      {
        label: "📚 Learning about Andromeda",
        value: "Learn about Andromeda",
      },
      // { label: "🤔 Not sure yet—help me decide!", value: "Not sure" },
    ],
    isOptional: false,
    isMultiSelect: true,
  },
  // Index 8
  {
    index: 8,
    text: "Do you have a portfolio or any project links you'd like to share? (Totally optional, but I'd love to see your work!)",
    inputMode: "text",
    isOptional: true,
  },
  // Index 9
  {
    index: 9,
    text: "Is there anything else you'd like us to know about your skills or interests? (Optional, but I'm all ears!)",
    inputMode: "text",
    isOptional: true,
  },
  // Index 10
  {
    index: 10,
    text: "What's the best email to reach you at, {name}?",
    inputMode: "text",
    isOptional: false,
    validationHint: "email",
    rePromptMessage:
      "Hmm, that doesn't look like a valid email. Could you double-check it for me?",
  },
  // Index 11
  {
    index: 11,
    text: "If you're on GitHub, what's your username? (Optional)",
    inputMode: "text",
    isOptional: true,
    validationHint: "github_username",
  },
  // Index 12
  {
    index: 12,
    text: "How about Telegram? If you'd like, drop your handle here. (Optional)",
    inputMode: "text",
    isOptional: true,
    validationHint: "telegram_handle",
    placeholder: "@yourhandle",
  },
  // Index 13
  {
    index: 13,
    text: "And last one—what's your X/Twitter handle? (Optional)",
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

// Lightweight reaction messages to show between questions for a more conversational flow
export const reactionMessages: string[] = [
  "👋 Let's get started!",
  "🙌 Awesome, thanks!",
  "🚀 Great choices!",
  "🤖 AI is fascinating, right?",
  "🔄 Switching gears...",
  "💡 Good to know!",
  "🏆 Hackathons are fun!",
  "🎯 Got it!",
  "🌐 Always cool to see projects!",
  "📝 Noted!",
  "📧 Thanks, we'll keep in touch!",
  "🐙 Love seeing GitHub users!",
  "✈️ Telegram, got it!",
  "🐦 X/Twitter, awesome!",
];
