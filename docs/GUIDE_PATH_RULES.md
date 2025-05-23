# How to Edit or Expand Path Recommendation Rules

This guide explains how to tweak, expand, or make more granular the logic that determines the user's recommended onboarding path.

---

## 1. Where is the logic?

- **File:** `src/lib/pathDetermination.ts`
- **Function:** `determinePath(data: OnboardingData)`

---

## 2. How do the rules work?

- Each path is determined by a set of if/else checks.
- The first rule that matches is used (order matters).
- See the code for current rules and their order.

---

## 3. How to tweak a rule

- Find the relevant `isXxxCandidate` variable.
- Change the conditions as needed (e.g., add new required answers, change values).

---

## 4. How to add a new path

1. **Add a new rule block** above the fallback in `determinePath`.
2. **Check for the right combination of answers** (use `arrayIncludesAny` for arrays).
3. **Return a new path name and URL.**
4. **Add a new environment variable** for the path URL if needed (e.g., `PATH_URL_DATA_SCIENTIST`).

---

## 5. How to make rules more granular

- Add more specific conditions to your rule checks.
- (Optional) Implement a scoring system: assign points for each answer, then pick the path with the highest score.
- Example scoring logic:

```ts
// Example: Add points for each relevant answer
let contractorScore = 0;
if (arrayIncludesAny(data.languages, ["Rust", "Solidity", "Python"]))
  contractorScore++;
if (data.tools_familiarity === "Very familiar") contractorScore++;
if (data.experience_level === "Advanced") contractorScore++;
// ...
// Then compare scores for all paths and pick the highest
```

---

## 6. Test your changes

- Run the app and try different answer combinations.
- Check the console for which path is chosen (console logs are present in the code).

---

## 7. Example: Adding a "Data Scientist" Path

```ts
const isDataScientistCandidate =
  arrayIncludesAny(data.languages, ["Python"]) &&
  data.goal === "Work on AI projects" &&
  data.ai_experience === "Yes";

if (isDataScientistCandidate) {
  return {
    recommendedPath: "Data Scientist",
    recommendedPathUrl: getPathUrl("DATA_SCIENTIST"),
  };
}
```

---

## 8. Tips

- **Order matters:** Put more specific rules above more general ones.
- Use helper functions like `arrayIncludesAny` for arrays.
- Add new fields to `OnboardingData` if needed for more granular logic.
- Add new environment variables for new path URLs.

---

**For more details, see inline comments in `src/lib/pathDetermination.ts`.**
