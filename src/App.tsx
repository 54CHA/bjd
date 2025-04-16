import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Menu } from "./components/Menu";
import { NicknameInput } from "./components/NicknameInput";
import { Game } from "./components/Game";
import { GameOver } from "./components/GameOver";
import { Leaderboard } from "./components/Leaderboard";
import { AuthProvider } from "./store/AuthContext";
import { PrivateRoute } from "./components/PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
          <Routes>
            <Route path="/" element={<Menu />} />
            <Route path="/nickname" element={<NicknameInput />} />
            <Route
              path="/game"
              element={
                <PrivateRoute>
                  <Game />
                </PrivateRoute>
              }
            />
            <Route
              path="/game-over"
              element={
                <PrivateRoute>
                  <GameOver />
                </PrivateRoute>
              }
            />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
