import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, Home, Gamepad2, AlertTriangle } from "lucide-react";
import { useGame } from "../store/GameContext";
import { submitScore } from "../lib/api";
import { useAuth } from "../store/AuthContext";

export const GameOver = () => {
  const navigate = useNavigate();
  const { score, gameStatus, resetGame } = useGame();
  const { user } = useAuth();
  const nickname = user?.nickname;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (gameStatus !== "gameover") {
      console.warn(
        "Accessed GameOver screen without game being over. Redirecting."
      );
      navigate("/");
      return;
    }

    if (nickname && !submitted && !isSubmitting) {
      setIsSubmitting(true);
      setSubmitError(null);
      submitScore(nickname, score)
        .then(() => {
          setSubmitted(true);
        })
        .catch((error) => {
          console.error("Failed to submit score:", error);
          setSubmitError(
            error instanceof Error ? error.message : "Could not submit score."
          );
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  }, [score, nickname, gameStatus, navigate, submitted, isSubmitting]);

  const handlePlayAgain = () => {
    resetGame();
    navigate("/game");
  };

  const handleGoHome = () => {
    resetGame();
    navigate("/");
  };

  const handleViewLeaderboard = () => {
    navigate("/leaderboard");
  };

  const handleRetrySubmit = () => {
    if (nickname && !isSubmitting && !submitted) {
      setIsSubmitting(true);
      setSubmitError(null);
      submitScore(nickname, score)
        .then(() => {
          console.log(
            `Score submitted successfully via retry for ${nickname}: ${score}`
          );
          setSubmitted(true);
        })
        .catch((error) => {
          console.error("Failed to submit score:", error);
          setSubmitError(
            error instanceof Error ? error.message : "Could not submit score."
          );
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  };

  if (gameStatus !== "gameover") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-white/20 border-t-white/90"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-image">
      <AlertTriangle className="w-20 h-20 text-yellow-500 mb-2" />
      <h1 className="text-4xl font-bold mb-2 text-center">Игра Окончена!</h1>

      <div className="w-full max-w-2xl bg-black/30 backdrop-blur-sm border border-white/10 p-6 mb-8">
        <div className="flex flex-col items-center gap-4">
          {nickname && (
            <p className="text-xl text-gray-300">Отличная игра, {nickname}!</p>
          )}

          <div className="flex flex-col items-center">
            <p className="text-lg text-gray-400 mb-4">Твой Счёт</p>
            <p className="text-6xl font-bold text-yellow-500">{score}</p>
          </div>

          <div className="h-10 flex items-center justify-center">
            {isSubmitting && (
              <div className="flex items-center gap-2 text-gray-400">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white/90"></div>
                <span>Сохранение результата...</span>
              </div>
            )}
            {submitted && !isSubmitting && (
              <div className="flex items-center gap-2 text-green-500"></div>
            )}
            {submitError && !isSubmitting && (
              <div className="flex flex-col items-center text-red-400">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span>{submitError}</span>
                </div>
                <button
                  onClick={handleRetrySubmit}
                  className="text-sm text-yellow-500 hover:text-yellow-400 hover:underline mt-1 transition-colors"
                >
                  Попробовать снова?
                </button>
              </div>
            )}
            {!isSubmitting && !submitted && !submitError && !nickname && (
              <p className="text-sm text-red-400">
                Невозможно сохранить результат (нет никнейма).
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-y-4 w-64">
        <button
          onClick={handlePlayAgain}
          className="w-full px-6 py-3 text-lg font-semibold bg-yellow-500 hover:bg-transparent text-black hover:text-yellow-500 transition-colors border-2 border-yellow-500"
        >
          <div className="flex items-center justify-center gap-2">
            <Gamepad2 className="w-5 h-5" />
            <span>Играть Снова</span>
          </div>
        </button>

        <button
          onClick={handleViewLeaderboard}
          className="w-full px-6 py-3 text-lg font-semibold bg-gray-700 hover:bg-gray-600 text-white transition-colors border-2 border-gray-700 hover:bg-transparent hover:text-white hover:border-gray-700"
        >
          <div className="flex items-center justify-center gap-2">
            <Trophy className="w-5 h-5" />
            <span>Таблица Лидеров</span>
          </div>
        </button>

        <button
          onClick={handleGoHome}
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
};
