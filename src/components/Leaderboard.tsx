import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, Home, AlertTriangle } from "lucide-react";
import { getLeaderboard } from "../lib/api";
import type { LeaderboardEntry } from "../types";

export function Leaderboard() {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getLeaderboard();
        setLeaderboard(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load leaderboard"
        );
        console.error("Error fetching leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-image">
      <AlertTriangle className="w-20 h-20 text-yellow-500 mb-2" />
      <h1 className="text-4xl font-bold mb-8 text-center">Таблица Лидеров</h1>

      <div className="w-full max-w-2xl bg-black/30 backdrop-blur-sm border border-white/10 p-6 mb-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-white/20 border-t-white/90"></div>
            <p className="mt-4 text-gray-400">Загрузка рейтинга...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-48 text-center text-red-400">
            <AlertTriangle className="w-12 h-12 mb-2" />
            <p className="font-semibold">Ошибка загрузки рейтинга</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48">
            <Trophy className="w-12 h-12 text-yellow-500 mb-2" />
            <p className="text-center text-gray-400">
              Пока никто не играл. Станьте первым!
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            {leaderboard.map((entry, index) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-4 bg-gray-700 hover:bg-gray-600 border-2 border-gray-700 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`text-2xl font-bold ${
                      index === 0
                        ? "text-yellow-500"
                        : index === 1
                        ? "text-gray-400"
                        : index === 2
                        ? "text-yellow-700"
                        : "text-gray-500"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className="text-lg font-semibold text-white">
                    {entry.nickname}
                  </span>
                </div>
                <span className="text-xl font-bold text-yellow-500">
                  {entry.score}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-y-4 w-64">
        <button
          onClick={() => navigate("/")}
          className="w-full px-6 py-3 text-lg font-semibold bg-gray-700 hover:bg-gray-600 text-white transition-colors border-2 border-gray-700 hover:bg-transparent hover:text-white hover:border-gray-700"
        >
          <div className="flex items-center justify-center gap-2">
            <Home className="w-5 h-5" />
            <span>Вернуться в Меню</span>
          </div>
        </button>
      </div>
    </div>
  );
}
