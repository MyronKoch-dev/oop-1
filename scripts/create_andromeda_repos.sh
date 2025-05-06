#!/bin/bash

# Define the GitHub username or organization
GITHUB_OWNER="MyronKoch-dev"

# --- Script Start ---
echo "Attempting to create Andromeda repositories under owner: ${GITHUB_OWNER}"
echo "Using GitHub CLI (gh). Make sure you are authenticated with 'repo' scope."
echo "-----------------------------------------------------"

# Repository 1: Contract Bids
# Issues enabled by default
echo "Creating ${GITHUB_OWNER}/andromeda-contract-bids..."
gh repo create ${GITHUB_OWNER}/andromeda-contract-bids \
    --public \
    --description "Repository for Andromeda contract proposals and bidding."
if [ $? -eq 0 ]; then echo " -> Success."; else echo " -> FAILED."; fi

# Repository 2: Bounties
# Issues enabled by default
echo "Creating ${GITHUB_OWNER}/andromeda-bounties..."
gh repo create ${GITHUB_OWNER}/andromeda-bounties \
    --public \
    --description "Andromeda bounty board and submission tracking."
if [ $? -eq 0 ]; then echo " -> Success."; else echo " -> FAILED."; fi

# Repository 3: App Ideas
# Create repo first, enable discussions manually later
echo "Creating ${GITHUB_OWNER}/andromeda-app-ideas..."
gh repo create ${GITHUB_OWNER}/andromeda-app-ideas \
    --public \
    --description "Community suggestions for Andromeda dApps and ADOs."
if [ $? -eq 0 ]; then echo " -> Success. (Enable Discussions manually in GitHub settings)"; else echo " -> FAILED."; fi

# Repository 4: AI Navigator
# Issues enabled by default
echo "Creating ${GITHUB_OWNER}/andromeda-ai-initiatives..."
gh repo create ${GITHUB_OWNER}/andromeda-ai-initiatives \
    --public \
    --description "AI/ML bounties, integrations, and ideas for the Andromeda ecosystem."
if [ $? -eq 0 ]; then echo " -> Success."; else echo " -> FAILED."; fi

echo "-----------------------------------------------------"
echo "Repository creation process finished."
echo "Reminder: Manually enable Discussions for 'andromeda-app-ideas' via GitHub repository settings if needed."
echo "Please check your GitHub account (${GITHUB_OWNER}) to verify."