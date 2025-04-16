import { LeaderboardEntry } from "../types"; // Assuming LeaderboardEntry type is defined here

// Define the base URL for the backend API
// In development, this is typically localhost. In production, it would be the deployed backend URL.
// Use environment variables for flexibility.
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

/**
 * Fetches the top 10 leaderboard scores from the backend.
 * @returns {Promise<LeaderboardEntry[]>} A promise that resolves to an array of leaderboard entries.
 * @throws Will throw an error if the fetch request fails or the response is not ok.
 */
export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  const response = await fetch(`${API_BASE_URL}/api/scores`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({})); // Try to parse error details
    console.error("Failed to fetch leaderboard:", response.status, errorData);
    throw new Error(
      `Failed to fetch leaderboard: ${response.statusText} (${response.status})`
    );
  }

  const data: LeaderboardEntry[] = await response.json();
  // The backend might return a slightly different structure (e.g., _id instead of id)
  // We might need to map the data here if the types don't align perfectly.
  // For now, assume direct compatibility or adjust LeaderboardEntry type.
  return data;
};

/**
 * Submits a player's score to the backend.
 * @param {string} nickname - The player's nickname.
 * @param {number} score - The player's score.
 * @returns {Promise<LeaderboardEntry>} A promise that resolves to the saved score entry.
 * @throws Will throw an error if the fetch request fails or the response is not ok (e.g., 400 Bad Request).
 */
export const submitScore = async (
  nickname: string,
  score: number
): Promise<LeaderboardEntry> => {
  const response = await fetch(`${API_BASE_URL}/api/scores`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nickname, score }),
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Unknown error" }));
    console.error("Failed to submit score:", response.status, errorData);
    throw new Error(
      `Failed to submit score: ${errorData.message || response.statusText} (${
        response.status
      })`
    );
  }

  const savedScore: LeaderboardEntry = await response.json();
  // Again, potential mapping needed depending on backend response structure vs. frontend type.
  return savedScore;
};

/**
 * Attempts to start a game session by validating nickname/PIN or creating a new user.
 * @param {string} nickname - The player's nickname.
 * @param {string} pin - The 4-digit PIN.
 * @returns {Promise<{message: string, user: {id: number, nickname: string, score: number, created_at: string}}>}
 *          A promise resolving to the success message and user data (excluding PIN).
 * @throws Will throw an error if the fetch request fails or the response indicates an error (e.g., 400, 401, 500).
 */
export const startSession = async (
  nickname: string,
  pin: string
): Promise<{ message: string; user: LeaderboardEntry }> => {
  const response = await fetch(`${API_BASE_URL}/api/start_session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nickname, pin }),
  });

  const responseData = await response.json(); // Always parse JSON response

  if (!response.ok) {
    // Use message from backend response if available, otherwise fallback
    const errorMessage =
      responseData?.message ||
      `Session start failed: ${response.statusText} (${response.status})`;
    console.error("Failed to start session:", response.status, responseData);
    throw new Error(errorMessage);
  }

  // Assuming successful response includes { message: string, user: LeaderboardEntry }
  if (!responseData.user || !responseData.message) {
    console.error(
      "Invalid success response format from /api/start_session",
      responseData
    );
    throw new Error(
      "Received an invalid response from the server after session start."
    );
  }

  return responseData as { message: string; user: LeaderboardEntry };
};

/**
 * Gets a user's position in the leaderboard
 * @param {string} nickname - The player's nickname
 * @returns {Promise<number>} A promise that resolves to the user's position (1-based index)
 * @throws Will throw an error if the fetch request fails or the response is not ok
 */
export const getUserPosition = async (nickname: string): Promise<number> => {
  const response = await fetch(
    `${API_BASE_URL}/api/scores/position/${nickname}`
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Failed to fetch user position:", response.status, errorData);
    throw new Error(
      `Failed to fetch user position: ${response.statusText} (${response.status})`
    );
  }

  const data = await response.json();
  return data.position;
};

/**
 * Gets a user's rating position from the backend
 * @param {string} nickname - The player's nickname
 * @returns {Promise<{ position: number, total: number }>} A promise that resolves to the user's position and total players
 * @throws Will throw an error if the fetch request fails
 */
export const getUserRating = async (
  nickname: string
): Promise<{ position: number; total: number }> => {
  const response = await fetch(
    `${API_BASE_URL}/api/users/${encodeURIComponent(nickname)}/rating`
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Failed to fetch user rating:", response.status, errorData);
    throw new Error(
      `Failed to fetch user rating: ${response.statusText} (${response.status})`
    );
  }

  return await response.json();
};
