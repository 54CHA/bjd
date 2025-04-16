import { Pool } from "pg";
import type { LeaderboardEntry } from "../types";

const pool = new Pool({
  connectionString: import.meta.env.VITE_DB_URL,
});

export async function saveScore(nickname: string, score: number) {
  const client = await pool.connect();
  try {
    await client.query(
      "INSERT INTO leaderboard (nickname, score) VALUES ($1, $2)",
      [nickname, score]
    );
  } finally {
    client.release();
  }
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const client = await pool.connect();
  try {
    const result = await client.query<LeaderboardEntry>(
      "SELECT id, nickname, score, created_at FROM leaderboard ORDER BY score DESC LIMIT 10"
    );
    return result.rows;
  } finally {
    client.release();
  }
}
