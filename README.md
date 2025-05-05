# Andromeda Onboarding Chatbot

**Last Updated: 2024-06-10**

[![Vercel Deploy Button](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=YOUR_GITHUB_REPO_URL_HERE&env=OPENAI_API_KEY,GROQ_API_KEY,SUPABASE_URL,SUPABASE_ANON_KEY,SUPABASE_SERVICE_ROLE_KEY,KV_URL,KV_REST_API_URL,KV_REST_API_TOKEN,PATH_URL_CONTRACTOR,PATH_URL_HACKER,PATH_URL_VISIONARY_PATH,PATH_URL_AI_NAVIGATOR,PATH_URL_AMBASSADOR,PATH_URL_EXPLORER_PATH)

**A modular, efficient, and user-friendly chatbot designed to onboard new users into the Andromeda ecosystem. It intelligently guides users through a questionnaire, determines the most suitable path using a weighted scoring system and hard requirements, and persists the data.**

This chatbot provides a guided questionnaire experience, leveraging a modern web stack and AI-powered components to:

- **Intelligently gather key information** from new users about their skills, interests, and goals.
- **Deterministically analyze user profiles** using a weighted scoring system and predefined requirements to recommend the most suitable onboarding path.
- **Provide clear, actionable guidance** by directing users to tailored resources and community pathways within Andromeda.
- **Persist structured user data** in a database for future analysis and personalized engagement.

This implementation prioritizes a **structured, questionnaire-based approach** for reliability and efficiency, ensuring a seamless onboarding experience for a diverse range of users, from technical developers to community ambassadors.

## Project Structure (TypeScript/Next.js)

```
project_root/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── onboarding/
│   │   │       └── message/
│   │   │           ├── route.ts         # Main API Route Handler (Next.js App Router)
│   │   │           └── route.test.ts    # Integration Tests for API Route
│   │   ├── layout.tsx                   # Root Layout Component
│   │   ├── page.tsx                     # Home Page (renders ChatContainer)
│   │   └── globals.css                  # Global Styles (Tailwind CSS, Dark Mode Theme)
│   ├── components/
│   │   ├── chat/
│   │   │   ├── chat-container.tsx       # Main Chatbot Container Component
│   │   │   ├── chat-header.tsx          # Chat Header (Title, Progress Bar)
│   │   │   ├── chat-input.tsx           # User Input Component (Text, Buttons, Conditional)
│   │   │   └── chat-messages.tsx        # Message Display Area (User/Bot Messages, Links, Buttons)
│   │   ├── ui/                          # Shadcn/ui Components (Button, Card, etc.)
│   │   └── ErrorBoundary.tsx            # Error Boundary for React
│   ├── lib/
│   │   ├── session.ts                   # Session Management Service (Upstash Redis)
│   │   ├── questionnaire.ts             # Questionnaire Definition (Questions, Options)
│   │   ├── parsing.ts                   # Input Parsing & Validation Logic
│   │   ├── pathDetermination.ts         # Path Determination Rules
│   │   ├── supabase.ts                  # Database Interaction Service (Supabase)
│   │   ├── types.ts                     # TypeScript Interface Definitions
│   │   └── utils.ts                     # Utility Functions
├── README.md                            # THIS FILE - Project Documentation
├── next-env.d.ts                        # Next.js Environment Declarations
├── next.config.js                       # Next.js Configuration File
├── package-lock.json                    # npm Dependency Lock File
├── package.json                         # Project Dependencies and Scripts
├── postcss.config.mjs                   # PostCSS Configuration
└── tsconfig.json                        # TypeScript Configuration
```

**Note:** Python files and references are legacy and not used in the current TypeScript/Next.js implementation. Remove or ignore them for all new development.

## Onboarding Flow Overview

Here's a simplified diagram of the user onboarding flow:

```mermaid
graph TD
    A[User starts chat] --> B{Session Exists?}
    B -- Yes --> C[Retrieve Session]
    B -- No --> D[Create New Session]
    C --> E{Session Valid?}
    D --> E
    E -- Yes --> F[Process User Response]
    E -- No --> G[Restart Flow (Session Expired)]
    G --> D
    F --> H{Input Valid?}
    H -- Yes --> I[Parse & Store Data]
    H -- No --> J{Re-prompt Attempt?}
    J -- Yes --> K[Re-prompt User]
    J -- No --> L[Halt Flow (e.g., Email Error)]
    I --> M{All Questions Answered?}
    K --> F
    M -- Yes --> N[Determine Path (Scoring Logic)]
    M -- No --> O[Get Next Question]
    N --> P[Save Data to DB]
    P --> Q[Delete Session]
    Q --> R[Return Final Recommendation]
    O --> S[Save Session State]
    S --> T[Return Next Question]
    L --> U[Return Halt Message]
```

> **Mermaid Diagram Troubleshooting:**
> - This diagram uses triple backticks with `mermaid` (no indentation).
> - Most modern Markdown previewers (including Cursor, VSCode with Mermaid plugins, and GitHub web) support this syntax.
> - If you do not see a rendered diagram, ensure your preview tool is up to date and supports Mermaid, or try a different Markdown viewer.

## Key Features

- **Guided Onboarding Questionnaire:** Presents a clear, step-by-step questionnaire to new users, ensuring consistent data collection.
- **Deterministic Path Recommendation:** Applies a weighted scoring system and predefined requirements in `src/lib/pathDetermination.ts` to accurately suggest the most relevant Andromeda ecosystem path, including hard requirements for certain paths (e.g., Rust, TypeScript, and Cosmos SDK Chains for Contractors).
- **Multiple Onboarding Paths:** Supports five distinct paths: Contractor, Hacker, Visionary Path, AI Navigator, and Ambassador, plus a general Explorer Path for beginners.
- **Data Persistence:** Stores collected user profile data in a Supabase PostgreSQL database for future analysis and engagement.
- **Modern Web Stack:** Built with Next.js 14+ App Router, React, TypeScript, Tailwind CSS, and Shadcn/ui, ensuring performance, maintainability, and a modern user experience.
- **Keyboard Accessibility:** Supports keyboard number input for quick button selection in multiple-choice questions.
- **Input Validation & Error Handling:** Includes client-side and server-side validation, graceful error handling, and user re-prompting for invalid input.
- **Session Management:** Uses Upstash Redis for robust server-side session management with automatic session expiry.
- **Comprehensive Integration Tests:** Includes a Jest-based integration test suite (`src/app/api/onboarding/message/route.test.ts`) to verify the API route logic and core onboarding flow, including testing the scoring system, hard requirements, session expiry, re-prompting, halting, and service connectivity.
- **Easy Deployment:** Designed for seamless deployment on Vercel, leveraging serverless functions and managed services.

## Setup

1.  **Clone the repository:**

    ```bash
    git clone [repository-url]
    cd oop-1
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Environment Configuration:**

    - **Create a `.env.local` file** in the project root and populate it with the following environment variables. **Replace the placeholder values** with your actual Supabase and Upstash credentials and desired Path URLs.

      ```dotenv
      # .env.local - Local Development Environment Variables

      # Supabase Project Settings (from supabase.com)
      NEXT_PUBLIC_SUPABASE_URL=[Your_Supabase_Project_URL]
      NEXT_PUBLIC_SUPABASE_ANON_KEY=[Your_Supabase_Anon_Public_Key]
      SUPABASE_SERVICE_ROLE_KEY=[Your_Supabase_Service_Role_Secret_Key]

      # Upstash Redis (from Vercel Marketplace Integration)
      UPSTASH_REDIS_REST_URL=[Your_KV_REST_API_URL]
      UPSTASH_REDIS_REST_TOKEN=[Your_KV_REST_API_TOKEN]

      # Onboarding Path URLs - Replace with your desired destination URLs
      PATH_URL_CONTRACTOR="[contractor-path-url]"
      PATH_URL_HACKER="[hacker-path-url]"
      PATH_URL_VISIONARY_PATH="[visionary-path-url]"
      PATH_URL_AI_NAVIGATOR="[ai-experienced-path-url]"
      PATH_URL_AMBASSADOR="[ambassador-path-url]"
      PATH_URL_EXPLORER_PATH="[explorer-path-url]"

      NODE_ENV=development
      ```

      _Remember to create a Supabase project and a Vercel KV (Upstash) database instance and obtain the necessary credentials from their respective dashboards._

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

    Open your browser and access the application at `http://localhost:3000`.

## Usage

The Andromeda Onboarding Bot presents a chat-like interface where users are guided through a series of questions.

1.  **Start the Onboarding:** Upon accessing the application, the chatbot initiates the onboarding process with a welcome message and the first question.
2.  **Answer Questions:** Users respond to each question sequentially, providing information about their skills, experience, and goals.
3.  **Multiple Input Types:** The chatbot supports various input methods:
    - **Text Input:** For open-ended questions like name, email, and handles.
    - **Button Selection:** For multiple-choice questions, allowing users to select from predefined options using clickable buttons or keyboard number shortcuts (1-9).
    - **Conditional Text Input:** For questions requiring additional details based on a button selection (e.g., specifying AI/ML areas after answering "Yes" to AI/ML experience).
4.  **Progress Tracking:** A progress bar in the chat header visually indicates the user's advancement through the questionnaire.
5.  **Path Recommendation:** After answering all questions, the chatbot analyzes the user's responses and presents a recommended onboarding path, along with a direct link to relevant resources.
6.  **Completion:** Upon completion, the chatbot confirms the onboarding process is finished and provides a conclusive message.

## User Paths

Based on user responses, the chatbot recommends one of the following paths:

1.  **Contractor Path:** For technically proficient users with programming skills interested in building applications and contributing to projects.
2.  **Hacker Path:** For technically inclined users interested in hackathons, bounties, and blockchain security.
3.  **Visionary Path:** For users with a product-oriented mindset interested in suggesting new features and use cases for the Andromeda ecosystem.
4.  **AI Experienced Path:** For users with experience in AI/ML who want to explore AI-related projects and integrations within Andromeda.
5.  **Ambassador Path:** For users passionate about community building and promoting Andromeda, even without deep technical expertise.
6.  **Explorer Path:** A general introductory path for users new to Web3 or unsure of their specific goals, providing fundamental learning resources.

## Testing

The project includes a comprehensive integration test suite built with Jest to ensure the backend API (`/api/onboarding/message`) functions correctly, now including tests for the scoring-based path determination and session handling.

**To run the tests:**

1.  Ensure your development server is running (`npm run dev`).
2.  Open a separate terminal in the project root and run:

    ```bash
    npm test
    ```

The comprehensive integration test suite (`src/app/api/onboarding/message/route.test.ts`) ensures the backend API functions correctly. It covers scenarios such as:

- **Happy Path (Explorer, Visionary, Contractor):** Simulates users completing the onboarding flow with valid responses, verifying the final path recommendations based on the new scoring system and hard requirements.
- **Session Start:** Tests the initial API call to start a new session and receive the first question.
- **Session Expiry:** Verifies that expired sessions are correctly detected, forcing a restart and issuing a new session ID.
- **Input Validation:** Tests the re-prompt and halt flow for invalid input, specifically including the email validation halt scenario.
- **GET Handler:** Checks the basic connectivity of the GET endpoint and its service dependencies.

The tests utilize mocking for external services (Upstash, Supabase, questionnaire data) to isolate the core API route logic. Notably, the path determination logic (`determinePath`) is tested using its real implementation with carefully constructed session data, ensuring accurate coverage of the scoring system and hard requirements.

## Customization

The Andromeda Onboarding Bot is designed to be flexible and customizable. Key areas for modification include:

- **Questionnaire Content:** Modify the questions, options, validation hints, and re-prompt messages directly within the `src/lib/questionnaire.ts` file.
- **Path Determination Logic:** Adjust the weights and requirements in the `PATH_SCORING` object and the `hasContractorRequirements` function within `src/lib/pathDetermination.ts` to fine-tune path recommendations based on evolving criteria.
- **Resource Recommendations:** Update the URLs and descriptions for recommended resources by modifying the `getPathUrl` function and environment variables related to path URLs.
- **Extend Language Options:** Add or remove programming languages in Question 4's button options in `src/lib/questionnaire.ts` and update the `validLanguages` array in `src/lib/parsing.ts`.
- **Customize Styling:** Modify the visual appearance by tweaking Tailwind CSS classes throughout the components and customizing the Shadcn/ui theme in `src/app/globals.css` and `tailwind.config.js`.
- **Expand Test Suite:** Add more test cases to `src/app/api/onboarding/message/route.test.ts` to cover additional scenarios, edge cases, or validation rules.
- **Implement Additional Features:** Extend the chatbot with new features or integrations as outlined in the "Future Enhancements" section below.

## Database Integration

The application uses Supabase (PostgreSQL) as its database for persistent storage of user onboarding data.

- **Schema Definition:** The database schema for the `onboarding_responses` table is defined in your Supabase project and should match the fields in `src/lib/types.ts`.
- **Database Interaction:** The `src/lib/supabase.ts` file handles database operations, specifically saving user profiles upon onboarding completion.

## Error Handling

The onboarding system is designed with robust error handling in mind:

- **Comprehensive Logging:** Implements detailed logging using `console.log` and `console.error` throughout the backend and frontend code to track the flow, debug issues, and capture errors.
- **User-Friendly Error Messages:** Returns user-friendly error messages to the frontend UI in case of validation failures, session expiry, or internal server errors, guiding users on how to proceed.
- **Retry Logic:** Includes retry mechanisms for database save operations to handle transient network issues.
- **Halt Flow on Critical Errors:** Implements logic to halt the onboarding flow gracefully if critical validation errors occur (e.g., invalid email after multiple attempts), preventing data inconsistencies.

## Implementation Details

The Andromeda Onboarding Bot is implemented using a modular, component-based architecture in Next.js and TypeScript.

**Key Components:**

- **Frontend (React/Next.js Components):**
  - `chat-container.tsx`: Orchestrates the chat flow, manages state, and handles API interactions.
  - `chat-header.tsx`: Displays the chat title, subtitle, and progress bar.
  - `chat-messages.tsx`: Renders the scrollable list of chat messages, handling different message types and button options.
  - `chat-input.tsx`: Provides the user input area, dynamically switching between text input, button groups, and conditional text inputs based on the current question.
  - `ui/*`: Reusable UI primitives from Shadcn/ui (Button, Card, Input, Textarea, etc.) for consistent styling and accessibility.
- **Backend (Next.js API Route & Services):**
  - `/api/onboarding/message/route.ts`: Main API endpoint handling POST requests, orchestrating the onboarding flow, calling services, and returning responses to the frontend.
  - `src/lib/session.ts`: Manages user sessions using Upstash Redis.
  - `src/lib/questionnaire.ts`: Defines the questionnaire structure and content.
  - `src/lib/parsing.ts`: Handles input parsing and validation logic.
  - `src/lib/pathDetermination.ts`: Implements the rules for determining the recommended onboarding path.
  - `src/lib/supabase.ts`: Manages database interactions using the Supabase client.

## Running the Example

1.  Ensure you have followed the **Setup** instructions to install dependencies and configure environment variables.
2.  Start the development server:

    ```bash
    npm run dev
    ```

3.  Access the application in your browser at `http://localhost:3000`.
4.  Interact with the chatbot, answering the onboarding questions.
5.  Observe the chat flow, progress bar updates, and the final path recommendation.
6.  Check the console output in your terminal and browser DevTools for logs and API requests.

## Customization Options

The Andromeda Onboarding Bot offers numerous customization points:

- **Modify Questionnaire Content:** Easily adapt the questions, options, and instructions by editing the `questions` array in `src/lib/questionnaire.ts`.
- **Adjust Path Determination Rules:** Fine-tune the logic for assigning onboarding paths in `src/lib/pathDetermination.ts` to match evolving ecosystem needs.
- **Update Resource Recommendations:** Customize the URLs and descriptions for recommended resources by modifying the `getPathUrl` function and environment variables related to path URLs.
- **Extend Language Options:** Add or remove programming languages in Question 4's button options in `src/lib/questionnaire.ts` and update the `validLanguages` array in `src/lib/parsing.ts`.
- **Customize Styling:** Modify the visual appearance by tweaking Tailwind CSS classes throughout the components and customizing the Shadcn/ui theme in `src/app/globals.css` and `tailwind.config.js`.
- **Expand Test Suite:** Add more test cases to `src/app/api/onboarding/message/route.test.ts` to cover additional scenarios, edge cases, or validation rules.
- **Implement Additional Features:** Extend the chatbot with new features or integrations as outlined in the "Future Enhancements" section below.

## Future Enhancements

Potential enhancements for future versions include:

1.  **Enhanced Input Parsing with LLMs:** Integrate an LLM (like OpenAI) to enable more flexible natural language understanding for user responses, particularly for open-ended questions or handle extraction.
2.  **More Granular Path Recommendations:** Refine the path determination logic to provide more nuanced path suggestions, potentially recommending multiple paths or ranking them by suitability.
3.  **Personalized Resource Recommendations:** Dynamically tailor resource recommendations based on more detailed analysis of user responses and potentially integrate with a resource database for richer suggestions.
4.  **User Accounts & Profiles:** Implement user authentication and persistent user profiles linked to the onboarding data in the database, allowing users to resume onboarding, track their progress, and access personalized resources.
5.  **Analytics Dashboard:** Develop an admin dashboard to visualize key onboarding metrics, user path distribution, common questions, and completion rates based on the data stored in Supabase.
6.  **Conversational UI Enhancements:** Explore adding more conversational elements to the chatbot, such as clarifying questions, providing examples, or handling tangential user queries (while still maintaining the core questionnaire flow).
7.  **Real Database Integration (Non-Memory):** For production deployments, transition from the in-memory database simulation (used in Python version example) to using the Supabase PostgreSQL database for persistent data storage.
8.  **Enhanced Testing & Monitoring:** Implement more comprehensive unit tests for individual functions and robust error monitoring/logging for production deployments.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

_Feel free to further customize and expand this README.md file to best suit your project and audience._

_Remember to replace placeholders like `[repository-url]`, `[your-openai-api-key]`, `[your-vercel-app-url]`, and the `PATH*URL*_` placeholders with your actual information before publishing.\*

---

# oop-1

> **Note:** This project uses [pnpm](https://pnpm.io/) as its package manager. You must use pnpm for all dependency management and installs.
>
> - The lockfile is `pnpm-lock.yaml`. Do not use `npm install` or commit `package-lock.json`.
> - If you previously used npm, run `pnpm install -g pnpm` and then `pnpm install` in this directory.

## Getting Started

1. **Install pnpm (if not already installed):**
   ```sh
   npm install -g pnpm
   # or with corepack (recommended for Node 16.13+)
   corepack enable && corepack prepare pnpm@latest --activate
   ```
2. **Install dependencies:**
   ```sh
   pnpm install
   ```
3. **Run the dev server:**
   ```sh
   pnpm dev
   ```
