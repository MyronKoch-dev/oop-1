# Andromeda Chat Response Mapping

This document outlines the question flow, answer options, and scoring system for the Andromeda onboarding chat.
https://oop-1-omega.vercel.app/
## Questions and Answer Options

### Question 0: Name
- Text input
- Required field
- Not used for scoring

### Question 1: Technical Expertise
- Input mode: buttons
- Options:
  - "1. Beginner"
  - "2. Intermediate" 
  - "3. Advanced"
- Used in scoring for paths: Contractor, Visionary, Explorer

### Question 2: Programming Languages
- Input mode: buttons (multi-select)
- Options:
  - "1. Rust"
  - "2. JavaScript"
  - "3. Python"
  - "4. Go"
  - "5. Solidity"
  - "6. TypeScript"
  - "7. Java"
  - "8. Others not listed"
  - "9. I'm not a programmer."
- Used in scoring for paths: Contractor, Hacker

### Question 3: Blockchain Experience
- Input mode: buttons (multi-select)
- Options:
  - "1. Bitcoin"
  - "2. Ethereum/EVMs"
  - "3. Solana"
  - "4. SEI"
  - "5. Cosmos SDK chains"
  - "6. XRP"
  - "7. BNB"
  - "8. Others not listed"
  - "9. None of these / No experience yet"
- Used in scoring for paths: Ambassador
- Note: Selecting any blockchain platforms except "None" sets blockchain_experience to "Yes" which scores points for Ambassador path
- Also used in Contractor path requirements: must include "Cosmos SDK chains" for eligibility

### Question 4: AI/ML Experience
- Input mode: buttons (multi-select)
- Options:
  - "1. Natural Language Processing (NLP)"
  - "2. Computer Vision"
  - "3. Smart Contract AI/Automation"
  - "4. Blockchain Data Science / Analytics"
  - "5. Generative AI (NFTs, Art, Music)"
  - "6. Decentralized AI / Federated Learning"
  - "7. Crypto Trading Bots / DeFi Automation"
  - "8. Other" (triggers conditional text input)
  - "9. No AI/ML experience yet"
- Used in scoring for paths: AI Navigator
- Note: Selecting any AI/ML areas except "No AI/ML experience yet" sets ai_experience to "Yes" which scores points for AI Navigator path

### Question 5: Andromeda Tools Familiarity
- Input mode: buttons
- Options:
  - "1. Very familiar"
  - "2. Some experience"
  - "3. Beginner"
  - "4. No idea"
- Used in scoring for paths: Contractor, Hacker

### Question 6: Hackathon Experience
- Input mode: buttons (multi-select)
- Options:
  - "1. Yes, a web 2 one"
  - "2. Yes, a web3 one"
  - "3. I won!"
  - "4. No, I haven't"
- Used in scoring for paths: Hacker, Contractor

### Question 7: Interests/Goals
- Input mode: buttons (multi-select)
- Options:
  - "1. 🚀 Building apps/dApps"
  - "2. 💰 Earning bounties"
  - "3. 💡 Sharing ideas for new features"
  - "4. 🤖 Working on AI projects"
  - "5. 📢 Promoting blockchain/Andromeda"
  - "6. 📚 Learning about Andromeda"
  - "7. 🤔 I'm still not sure/I don't see it here"
- Used in scoring for paths: All paths

### Question 8: Portfolio Links
- Input mode: text
- Optional field
- Not used for scoring

### Question 9: Additional Skills/Interests
- Input mode: text
- Optional field
- Not used for scoring

### Question 10: Email
- Input mode: text
- Required field
- Not used for scoring
- Validation: email format

### Question 11: GitHub Username
- Input mode: text
- Optional field
- Not used for scoring
- Validation: github username format

### Question 12: Telegram Handle
- Input mode: text
- Optional field
- Not used for scoring
- Validation: telegram handle format

### Question 13: X/Twitter Handle
- Input mode: text
- Optional field
- Not used for scoring
- Validation: x handle format

## Path Scoring System

The onboarding system uses a weighted scoring system to determine the most appropriate path recommendation for users.

### Scoring Weights by Path

#### Contractor Path
- Languages:
  - Rust: +2 points
  - Go: +1 point
  - TypeScript: +2 points
- Tools familiarity:
  - "Very familiar": +2 points
  - "Some experience": +1 point
- Experience level:
  - Advanced: +2 points
- Goal: 
  - "Build apps/dApps": +2 points
- Hackathon:
  - Winner: +2 points
- Hard requirements:
  - Must have both Rust and TypeScript selected in languages
  - Must have experience with "Cosmos SDK chains" blockchain platform

#### Hacker Path
- Languages:
  - TypeScript: +2 points
- Tools familiarity:
  - "Very familiar": +1 point
  - "Some experience": +1 point
- Hackathon experience:
  - Winner: +2 points
  - Web2: +1 point
  - Web3: +1 point
- Goal:
  - "Earn bounties": +2 points

#### Visionary Path
- Goal:
  - "Share ideas for new features": +2 points
- Experience level:
  - Beginner: +1 point
  - Intermediate: +1 point

#### AI Navigator Path
- AI experience: 
  - Yes: +2 points
- Goal:
  - "Work on AI projects": +2 points

#### Ambassador Path
- Blockchain experience:
  - Yes: +2 points
- Goal:
  - "Promote blockchain/Andromeda": +2 points

#### Explorer Path
- Goal:
  - "Learn Web3 basics": +2 points
  - "Learn about Andromeda": +2 points
  - "Not sure yet": +3 points
- Experience level:
  - Beginner: +2 points

## Path Determination Algorithm

1. Calculate scores for all possible paths based on user responses
2. For the Contractor path, apply a hard requirement check (must have both Rust and TypeScript languages and Cosmos SDK chains experience)
3. Sort paths by descending score
4. Return the highest scoring path as the primary recommendation
5. Return the second-highest scoring path as the secondary recommendation

## Available Paths with Descriptions

### Explorer
"This path is for curious minds eager to dive deep into Andromeda's features, experiment with its capabilities, and uncover new possibilities. Chart your own course and discover what you can build!"

### Visionary
"If you are a big thinker with groundbreaking ideas, the Visionary Path is for you. Learn how to leverage Andromeda to bring your innovative concepts to life and help shape the future of the platform."

### AI Navigator
"Passionate about Artificial Intelligence? The AI Navigator path guides you in understanding, utilizing, and even steering AI-driven features and development within the Andromeda ecosystem."

### Ambassador
"Become an Andromeda Ambassador! This path is for those who love to connect, share knowledge, and build communities. Help others discover Andromeda and grow our collective success."

### Contractor
"The Contractor Path is designed for builders who need to deliver. Learn to efficiently use Andromeda's capabilities to complete projects, create powerful solutions, and achieve your development goals."

### Hacker
"Unleash your ingenuity with the Hacker Path. This journey is for those who love to explore, experiment, and find innovative solutions by creatively using and extending Andromeda's capabilities. Push the boundaries and see what is possible!" 