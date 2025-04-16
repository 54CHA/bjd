import { useNavigate } from "react-router-dom";
import { LogOut, Trophy, Gamepad2 } from "lucide-react";
import { useAuth } from "../store/AuthContext";
import { useEffect, useState } from "react";
import { getLeaderboard } from "../lib/api";

export const LoggedInMenu = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [rating, setRating] = useState<{
    position: number;
    total: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calculateRating = async () => {
      if (user?.nickname) {
        console.log("Fetching leaderboard for rating calculation");
        setLoading(true);
        try {
          const leaderboard = await getLeaderboard();
          // Sort leaderboard by score in descending order
          const sortedLeaderboard = [...leaderboard].sort(
            (a, b) => b.score - a.score
          );
          const position =
            sortedLeaderboard.findIndex(
              (entry) => entry.nickname === user.nickname
            ) + 1;

          if (position > 0) {
            setRating({
              position,
              total: sortedLeaderboard.length,
            });
          } else {
            setRating(null);
          }
        } catch (error) {
          console.error("Failed to fetch leaderboard:", error);
          setRating(null);
        } finally {
          setLoading(false);
        }
      }
    };

    calculateRating();
  }, [user?.nickname]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-image">
      <h1 className="text-4xl font-bold mb-2 text-center">
        Удачи выжить, {user?.nickname}!
      </h1>
      <div className="flex flex-col items-center gap-2 mt-4 mb-8">
        {loading ? (
          <div className="text-lg text-gray-400">Загрузка рейтинга...</div>
        ) : rating ? (
          <div className="flex items-center gap-2 text-xl">
            <span className="bg-orange-100 text-black px-4 py-4 font-bold">
              Поздравляю! ты{" "}
              <span className="text-yellow-500">{rating.position}й</span> в
              рейтинге
            </span>
          </div>
        ) : (
          <div className="text-lg text-gray-400">Пока нет места в рейтинге</div>
        )}
      </div>

      <div className="flex flex-col gap-y-4 w-64">
        <button
          onClick={() => navigate("/game")}
          className="w-full px-6 py-3 text-lg font-semibold bg-yellow-500 hover:bg-transparent hover:backdrop-blur-sm text-black hover:text-white transition-colors border-2 border-yellow-500 hover:bg-transparent hover:text-yellow-500 hover:border-yellow-500"
        >
          <div className="flex items-center justify-center gap-2">
            <Gamepad2 className="w-5 h-5" />
            <span>Начать Игру</span>
          </div>
        </button>

        <button
          onClick={() => navigate("/leaderboard")}
          className="w-full px-6 py-3 text-lg font-semibold bg-gray-700 hover:bg-gray-600 text-white hover:backdrop-blur-sm transition-colors border-2 border-gray-700 hover:bg-transparent hover:text-white hover:border-gray-700"
        >
          <div className="flex items-center justify-center gap-2">
            <Trophy className="w-5 h-5" />
            <span>Лидерборд</span>
          </div>
        </button>

        <button
          onClick={handleLogout}
          className="w-full px-6 py-3 text-lg font-semibold bg-red-500 hover:bg-transparent hover:backdrop-blur-sm text-white transition-colors border-2 border-red-500 hover:bg-transparent hover:text-red-500 hover:border-red-500"
        >
          <div className="flex items-center justify-center gap-2">
            <LogOut className="w-5 h-5" />
            <span>Выйти</span>
          </div>
        </button>
      </div>
    </div>
  );
};
