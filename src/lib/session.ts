// src/lib/session.ts
import { Redis } from '@upstash/redis';
// Use 'import type' for interfaces only used as types within this file
// Keep normal import for SessionState as it's used directly as a type annotation
import { SessionState } from './types';

// --- Redis Client Initialization ---
// Retrieve configuration from environment variables
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

// Validate that environment variables are set
if (!redisUrl) {
    throw new Error('Session Service Error: UPSTASH_REDIS_REST_URL environment variable is not configured!');
}
if (!redisToken) {
    throw new Error('Session Service Error: UPSTASH_REDIS_REST_TOKEN environment variable is not configured!');
}

// Initialize the Upstash Redis client
// Note: Consider initializing this as a singleton if used frequently across many requests,
// but for Next.js serverless functions, creating it per request is often acceptable.
const redis = new Redis({
    url: redisUrl,
    token: redisToken,
});
console.log('Session Service: Upstash Redis client configured.');

// Define session Time-To-Live (TTL) in seconds (matches Spec FR5.3)
const SESSION_TTL_SECONDS = 60 * 60; // 60 minutes

// --- Exported Session Functions ---

/**
 * Creates a new user session with initial state in Redis.
 * Generates a UUID for the session ID.
 * Sets the session TTL upon creation.
 *
 * @returns A Promise resolving to an object containing the new sessionId and the initialState.
 * @throws Error if session creation fails in Redis.
 */
export async function createSession(): Promise<{ sessionId: string; initialState: SessionState }> {
    const sessionId = crypto.randomUUID(); // Use built-in crypto for UUID generation
    const initialTimestamp = Date.now();
    const initialState: SessionState = {
        questionIndex: 0, // Start at the first question
        accumulatedData: { sessionId: sessionId }, // Initialize with the session ID itself
        lastInteractionTimestamp: initialTimestamp,
        repromptedIndex: null, // Initialize reprompt tracker
    };

    const redisKey = `session:${sessionId}`; // Use a prefix for session keys

    try {
        // Set the session data in Redis with expiration
        const result = await redis.set(redisKey, JSON.stringify(initialState), {
            ex: SESSION_TTL_SECONDS, // Set TTL in seconds
        });

        // Check if the Redis command was successful
        if (result !== 'OK') {
            throw new Error(`Redis SET command failed for new session. Result: ${result}`);
        }

        console.log(`[Session: ${sessionId}] Session created successfully with TTL ${SESSION_TTL_SECONDS}s`);
        return { sessionId, initialState }; // Return the new ID and the initial state object

    } catch (error) {
        console.error(`[Session: ${sessionId}] Redis error during session creation:`, error);
        // Re-throw a more specific error for the caller (e.g., the API route) to handle
        throw new Error(`Failed to create session in Redis: ${error instanceof Error ? error.message : String(error)}`);
    }
}

/**
 * Retrieves the state for a given session ID from Redis.
 * Returns null if the session key does not exist (meaning not found or expired due to TTL).
 *
 * @param sessionId The ID of the session to retrieve.
 * @returns A Promise resolving to the SessionState object, or null if not found/expired.
 */
export async function getSession(sessionId: string): Promise<SessionState | null> {
    if (!sessionId) {
        console.warn('getSession called with null or empty sessionId.');
        return null;
    }
    const redisKey = `session:${sessionId}`;

    try {
        // Attempt to get the session data from Redis
        const data = await redis.get<SessionState>(redisKey); // Type assertion helps if client returns string | object

        if (data) {
            console.log(`[Session: ${sessionId}] Session data retrieved successfully.`);
            // Optional: Add manual timestamp check if paranoia about TTL is high, but generally unnecessary
            // const now = Date.now();
            // if (now - data.lastInteractionTimestamp > SESSION_TTL_SECONDS * 1000) {
            //     console.warn(`[Session: ${sessionId}] Session found but expired based on timestamp. Deleting.`);
            //     await deleteSession(sessionId); // Clean up stale data if found
            //     return null;
            // }
            // Note: Parsing is implicitly handled by <SessionState> type argument in .get if using @upstash/redis v1+
            // If it returns a string, manual JSON.parse would be needed.
            return data;
        } else {
            console.log(`[Session: ${sessionId}] Session data not found (likely expired or invalid ID).`);
            return null;
        }
    } catch (error) {
        console.error(`[Session: ${sessionId}] Redis error during getSession:`, error);
        // Treat Redis errors during retrieval as session not found for simplicity
        return null;
    }
}

/**
 * Updates the state for a given session ID in Redis.
 * Automatically updates the lastInteractionTimestamp and resets the session TTL.
 *
 * @param sessionId The ID of the session to update.
 * @param newState The complete new state object to store for the session.
 * @throws Error if the update operation fails in Redis.
 */
export async function updateSession(sessionId: string, newState: SessionState): Promise<void> {
    if (!sessionId) {
        throw new Error('updateSession called with null or empty sessionId.');
    }
    const redisKey = `session:${sessionId}`;

    try {
        // Ensure the timestamp reflects this interaction
        newState.lastInteractionTimestamp = Date.now();
        // Update the session data in Redis, resetting the TTL
        const result = await redis.set(redisKey, JSON.stringify(newState), {
            ex: SESSION_TTL_SECONDS, // Reset TTL on every update
        });

        // Check if the Redis command was successful
        if (result !== 'OK') {
            throw new Error(`Redis SET command failed during session update. Result: ${result}`);
        }
        console.log(`[Session: ${sessionId}] Session updated successfully, TTL reset.`);

    } catch (error) {
        console.error(`[Session: ${sessionId}] Redis error during updateSession:`, error);
        throw new Error(`Failed to update session in Redis: ${error instanceof Error ? error.message : String(error)}`);
    }
}

/**
 * Deletes a session from Redis. Logs success or if the key was not found.
 * Does not throw an error if the key doesn't exist or on deletion error, only logs.
 *
 * @param sessionId The ID of the session to delete.
 */
export async function deleteSession(sessionId: string): Promise<void> {
    if (!sessionId) {
        console.warn('deleteSession called with null or empty sessionId.');
        return;
    }
    const redisKey = `session:${sessionId}`;

    try {
        // Attempt to delete the session key
        const deletedCount = await redis.del(redisKey);

        if (deletedCount > 0) {
            console.log(`[Session: ${sessionId}] Session deleted successfully from Redis.`);
        } else {
            // This is not necessarily an error, the key might have already expired or been deleted
            console.log(`[Session: ${sessionId}] Session delete command executed, but key was not found (already expired/deleted?).`);
        }
    } catch (error) {
        // Log Redis errors during deletion but don't interrupt application flow
        console.error(`[Session: ${sessionId}] Redis error during deleteSession:`, error);
    }
}