/**
 * API Service Layer for Backend Endpoints
 * Centralized API calls to FastAPI backend
 * All requests go to http://localhost:8000
 */

const API_BASE_URL = "http://localhost:8000";

// ============================================
// SUBMISSION & GAMIFICATION
// ============================================

export interface SubmissionResponse {
  success: boolean;
  xpEarned: number;
  bonusXP: number;
  totalXP: number;
  rank: string;
  currentStreak: number;
  maxStreak: number;
  badgesUnlocked: string[];
}

/**
 * Submit a problem solution
 * Awards XP, updates streaks, unlocks badges
 */
export async function submitProblem(
  userId: string,
  problemId: string
): Promise<SubmissionResponse> {
  const response = await fetch(
    `${API_BASE_URL}/submit`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        problem_id: problemId,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Submission failed: ${response.statusText}`
    );
  }

  return response.json();
}

// ============================================
// USER PROFILE
// ============================================

export interface UserProfile {
  id: string;
  full_name: string;
  username: string;
  xp: number;
  rank: string;
  current_streak: number;
  max_streak: number;
  last_activity_date: string;
  role: string;
  avatar_url?: string;
  bio?: string;
}

/**
 * Get user's full profile including stats
 */
export async function getUserProfile(
  userId: string
): Promise<UserProfile> {
  const response = await fetch(
    `${API_BASE_URL}/profile/${userId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch profile: ${response.statusText}`
    );
  }

  return response.json();
}

// ============================================
// RANK & LEADERBOARD
// ============================================

export interface UserRank {
  position: number;
  xp: number;
  rank: string;
  user_id: string;
  username?: string;
  full_name?: string;
}

/**
 * Get user's current rank and position
 */
export async function getUserRank(
  userId: string
): Promise<UserRank> {
  const response = await fetch(
    `${API_BASE_URL}/rank/${userId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch rank: ${response.statusText}`
    );
  }

  return response.json();
}

export interface LeaderboardEntry {
  id: string;
  full_name: string;
  username: string;
  xp: number;
  rank: string;
}

/**
 * Get global leaderboard (top 100 users)
 */
export async function getLeaderboard(): Promise<
  LeaderboardEntry[]
> {
  const response = await fetch(
    `${API_BASE_URL}/leaderboard`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch leaderboard: ${response.statusText}`
    );
  }

  return response.json();
}

// ============================================
// BADGES
// ============================================

export interface Badge {
  id: string;
  name: string;
  description?: string;
  icon_url?: string;
  threshold?: number;
}

/**
 * Get user's unlocked badges
 */
export async function getUserBadges(
  userId: string
): Promise<Badge[]> {
  const response = await fetch(
    `${API_BASE_URL}/badges/${userId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch badges: ${response.statusText}`
    );
  }

  return response.json();
}

// ============================================
// DAILY CHALLENGE
// ============================================

export interface DailyChallenge {
  id: string;
  problem_id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  topic: string;
  description?: string;
}

/**
 * Get today's featured daily challenge
 */
export async function getDailyChallenge(): Promise<
  DailyChallenge
> {
  const response = await fetch(
    `${API_BASE_URL}/daily-challenge`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch daily challenge: ${response.statusText}`
    );
  }

  return response.json();
}

// ============================================
// CONTESTS
// ============================================

export interface Contest {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  created_at: string;
}

/**
 * Get all contests
 */
export async function getContests(): Promise<
  Contest[]
> {
  const response = await fetch(
    `${API_BASE_URL}/contests`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch contests: ${response.statusText}`
    );
  }

  return response.json();
}

/**
 * Get specific contest details
 */
export async function getContest(
  contestId: string
): Promise<Contest> {
  const response = await fetch(
    `${API_BASE_URL}/contests/${contestId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch contest: ${response.statusText}`
    );
  }

  return response.json();
}

export interface ContestRegistrationPayload {
  contest_id: string;
  user_id: string;
}

/**
 * Register user for a contest
 */
export async function registerForContest(
  contestId: string,
  userId: string
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(
    `${API_BASE_URL}/contests/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contest_id: contestId,
        user_id: userId,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to register for contest: ${response.statusText}`
    );
  }

  return response.json();
}

// ============================================
// ASSESSMENTS
// ============================================

export interface Assessment {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

/**
 * Get all available assessments
 */
export async function getAssessments(): Promise<
  Assessment[]
> {
  const response = await fetch(
    `${API_BASE_URL}/assessments`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch assessments: ${response.statusText}`
    );
  }

  return response.json();
}

export interface AssessmentStartPayload {
  assessment_id: string;
  user_id: string;
}

export interface AssessmentStartResponse {
  attempt_id: string;
  assessment_id: string;
  user_id: string;
  started_at: string;
}

/**
 * Start an assessment attempt
 */
export async function startAssessment(
  assessmentId: string,
  userId: string
): Promise<AssessmentStartResponse> {
  const response = await fetch(
    `${API_BASE_URL}/assessments/start`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        assessment_id: assessmentId,
        user_id: userId,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to start assessment: ${response.statusText}`
    );
  }

  return response.json();
}

export interface AssessmentSubmitPayload {
  assessment_id: string;
  user_id: string;
  score: number;
}

export interface AssessmentSubmitResponse {
  success: boolean;
  score: number;
  feedback?: string;
}

/**
 * Submit completed assessment
 */
export async function submitAssessment(
  assessmentId: string,
  userId: string,
  score: number
): Promise<AssessmentSubmitResponse> {
  const response = await fetch(
    `${API_BASE_URL}/assessments/submit`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        assessment_id: assessmentId,
        user_id: userId,
        score,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to submit assessment: ${response.statusText}`
    );
  }

  return response.json();
}

export interface AssessmentLeaderboardEntry {
  user_id: string;
  full_name: string;
  username: string;
  score: number;
  completed_at: string;
}

/**
 * Get assessment leaderboard
 */
export async function getAssessmentLeaderboard(
  assessmentId: string
): Promise<AssessmentLeaderboardEntry[]> {
  const response = await fetch(
    `${API_BASE_URL}/assessments/${assessmentId}/leaderboard`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch assessment leaderboard: ${response.statusText}`
    );
  }

  return response.json();
}

// ============================================
// ERROR HANDLING & UTILITIES
// ============================================

export interface ApiError {
  status: number;
  message: string;
  code?: string;
}

/**
 * Generic error handler for API calls
 */
export async function handleApiError(
  response: Response
): Promise<ApiError> {
  const data = await response.json().catch(
    () => ({})
  );
  return {
    status: response.status,
    message:
      data.detail ||
      data.message ||
      response.statusText,
    code: data.code,
  };
}
