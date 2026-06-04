const API_URL = "http://localhost:8000";

export async function getContests() {
  const res = await fetch(`${API_URL}/contests`);

  if (!res.ok) {
    throw new Error("Failed to fetch contests");
  }

  return res.json();
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
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contest_id: contestId,
        user_id: userId,
      }),
    }
  );

  return res.json();
}