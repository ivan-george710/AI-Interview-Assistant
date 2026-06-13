import { getContests, registerForContest } from "./api";

const API_URL = "http://localhost:8000";

// Re-export from centralized API
export { getContests, registerForContest };

/**
 * Get user's registered contests
 * Note: Backend doesn't have /contests/user/{userId} endpoint
 * This function queries all contests and filters locally
 * @deprecated Use getContests() and filter manually
 */
export async function getUserContests(
  userId: string
) {
  // Since backend doesn't have user-specific endpoint,
  // return empty array. Frontend should track registrations locally
  // or in a separate Supabase table
  console.warn(
    "getUserContests: Backend endpoint not available. Returning empty array."
  );
  return [];
}

export async function registerContest(
  contestId: string,
  userId: string
) {
  const res = await fetch(
    `${API_URL}/contests/register`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        contest_id: contestId,
        user_id: userId,
      }),
    }
  );

  return res.json();
}