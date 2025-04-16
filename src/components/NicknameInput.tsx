import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound } from "lucide-react";
import { useGame } from "../store/GameContext";
import { useAuth } from "../store/AuthContext";
import { startSession } from "../lib/api";

export const NicknameInput = () => {
  const [localNickname, setLocalNickname] = useState("");
  const [pin, setPin] = useState("");
  const { setNickname, setGameStatus, setScore } = useGame();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 4) {
      setPin(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedNickname = localNickname.trim();
    if (trimmedNickname && pin.length === 4) {
      setIsLoading(true);
      setError(null);
      try {
        const { message, user } = await startSession(trimmedNickname, pin);
        console.log(message, user);
        setNickname(user.nickname);
        setScore(user.score);
        setGameStatus("playing");
        login(user.nickname, user.score);
        navigate("/");
      } catch (err) {
        console.error("Session start failed:", err);
        setError(
          err instanceof Error ? err.message : "Failed to start session."
        );
        setIsLoading(false);
      }
    }
  };

  const isButtonDisabled =
    !localNickname.trim() || pin.length !== 4 || isLoading;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-image">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Придумайте имя и PIN
      </h1>

      <div className="flex flex-col gap-y-4 w-64">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            id="nickname"
            type="text"
            value={localNickname}
            onChange={(e) => setLocalNickname(e.target.value)}
            placeholder="Ваш никнейм"
            required
            maxLength={20}
            className="w-full px-4 py-3 text-lg bg-gray-700 text-white placeholder-gray-400 border-2 border-gray-700 focus:outline-none focus:border-yellow-500"
          />

          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="pin"
              type="password"
              inputMode="numeric"
              pattern="\d{4}"
              value={pin}
              onChange={handlePinChange}
              placeholder="4-значный PIN"
              required
              maxLength={4}
              className="w-full pl-10 pr-4 py-3 text-lg bg-gray-700 text-white placeholder-gray-400 border-2 border-gray-700 focus:outline-none focus:border-yellow-500 text-center tracking-widest"
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            disabled={isButtonDisabled}
            className="w-full px-6 py-3 text-lg font-semibold bg-yellow-500 hover:bg-yellow-600 text-black transition-colors border-2 border-yellow-500 hover:bg-transparent hover:text-yellow-500 hover:border-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent mx-auto"></div>
            ) : (
              "Начать Игру"
            )}
          </button>
        </form>

        <button
          onClick={() => navigate("/")}
          className="w-full px-6 py-3 text-lg font-semibold bg-gray-700 hover:bg-gray-600 text-white transition-colors border-2 border-gray-700 hover:bg-transparent hover:text-white hover:border-gray-700"
        >
          Назад
        </button>
      </div>
    </div>
  );
};
