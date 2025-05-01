# How to Add a New Button-Based Question to Onboarding

This guide explains how to add a new question to the onboarding flow that uses button options, including multi-select and an optional "Other" text box.

---

## 1. Define the Question

- **File:** `src/lib/questionnaire.ts`
- **Action:** Add a new entry to the `questions` array.

### Button Question Example

```ts
{
  index: 14, // Use the next available index
  text: "Which tools do you use?",
  inputMode: 'buttons',
  options: [
    { label: "1. VS Code", value: "VS Code" },
    { label: "2. Vim", value: "Vim" },
    { label: "3. Other", value: "Other" }
  ],
  isMultiSelect: true, // Allow multiple selections
  conditionalTriggerValue: "Other", // Show text box if 'Other' is selected
  conditionalTextInputLabel: "Please specify your tool:",
  isOptional: false,
}
```

- **For single-select:** Omit `isMultiSelect` or set to `false`.
- **For 'Other' text box:** Add `conditionalTriggerValue` and `conditionalTextInputLabel`.

---

## 2. Update the Parsing Logic

- **File:** `src/lib/parsing.ts`
- **Action:** Add or update a function to handle the new question's data.
- **Tip:** Use the AI/ML question as a reference for handling arrays and optional text.

---

## 3. Register the Question in the API

- **File:** `src/app/api/onboarding/message/route.ts`
- **Action:** In the main handler, add a case for your new question's index.
- **Call your parsing function** and save the result to the database.

---

## 4. (Optional) Weigh the Answers for Path Suggestion

- **File:** `src/lib/pathDetermination.ts` (or similar)
- **Action:** Update the logic to include your new field in the weighting/scoring system if it should influence the path suggestion.

---

## 5. Test the Question

- Run the app and go through onboarding.
- Verify:
  - Buttons render correctly.
  - Multi-select works (if enabled).
  - "Other" triggers a text box (if set).
  - Data is saved and used in path suggestion.

---

## 6. Example: "Other" with Text Box

See the AI/ML question in `questionnaire.ts` for a working example.

---

## 7. Tips

- Use clear, unique `value` fields for each option.
- Keep labels user-friendly.
- Document any new fields in the database schema if needed.

---

## 8. Relevant Files

- `src/lib/questionnaire.ts` — Define questions and options
- `src/components/chat/chat-container.tsx` — Handles question logic and state
- `src/lib/parsing.ts` — Parses and validates answers
- `src/app/api/onboarding/message/route.ts` — API handler for onboarding answers
- `src/lib/pathDetermination.ts` — (If used) Path suggestion logic

---

**For more details, see inline comments in the relevant files.**
