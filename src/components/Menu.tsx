import React from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { useAuth } from "../store/AuthContext";
import { LoggedInMenu } from "./LoggedInMenu";

export function Menu() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <LoggedInMenu />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-image">
      <AlertTriangle className="w-20 h-20 text-yellow-500 mb-2" />
      <h1 className="text-4xl font-bold mb-8 text-center">
        Тест на Выживание при Землетрясении
      </h1>
      <div className="flex flex-col gap-y-4 w-64">
        <button
          onClick={() => navigate("/nickname")}
          className="w-full px-6 py-3 text-lg font-semibold bg-yellow-500 hover:bg-yellow-600 text-black transition-colors border-2 border-yellow-500 hover:bg-transparent hover:text-yellow-500 hover:border-yellow-500"
        >
          Попытать удачу
        </button>
        <button
          onClick={() => navigate("/leaderboard")}
          className="w-full px-6 py-3 text-lg font-semibold bg-gray-700 hover:bg-gray-600 text-white transition-colors border-2 border-gray-700 hover:bg-transparent hover:text-white hover:border-gray-700"
        >
          Таблица Лидеров
        </button>
      </div>
    </div>
  );
}
