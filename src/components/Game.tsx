import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Timer, AlertTriangle } from "lucide-react";
import { scenarios as allScenarios } from "../data/scenarios"; // Import all scenarios
import { useGame } from "../store/GameContext"; // Use our context
import { useAuth } from "../store/AuthContext";
import { Scenario } from "../types"; // Assuming types.ts defines Scenario
import "./Game.css";

// Helper function to shuffle an array (Fisher-Yates algorithm)
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const GAME_DURATION = 30;
const POINTS_PER_CORRECT_ANSWER = 10;
const MAX_SCENARIOS_PER_GAME = 10; // As per concept.md

export const Game = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { incrementScore, setGameStatus, resetGame } = useGame();
  const [shuffledScenarios, setShuffledScenarios] = useState<Scenario[]>([]);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false); // To disable buttons after answer/timeout
  const timerRef = useRef<NodeJS.Timeout | null>(null); // Ref for the timer interval
  const [showExplanation, setShowExplanation] = useState(false);

  // Initialize game: shuffle scenarios, reset state
  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to nickname input only if not authenticated
      navigate("/nickname");
      return;
    }

    resetGame();
    setGameStatus("playing");
    setShuffledScenarios(
      shuffleArray(allScenarios).slice(0, MAX_SCENARIOS_PER_GAME)
    );
    setCurrentScenarioIndex(0);
    setTimeLeft(GAME_DURATION);
    setSelectedOption(null);
    setIsAnswered(false);
  }, [navigate, isAuthenticated, setGameStatus, resetGame]);

  const scenario = shuffledScenarios[currentScenarioIndex];

  // Function to handle game over
  const handleGameOver = useCallback(
    (reason: string) => {
      console.log(`Game Over: ${reason}`);
      if (timerRef.current) clearInterval(timerRef.current);
      setGameStatus("gameover");
      navigate("/game-over");
    },
    [navigate, setGameStatus]
  );

  // Timer effect
  useEffect(() => {
    if (
      !scenario ||
      isAnswered ||
      currentScenarioIndex >= shuffledScenarios.length
    ) {
      if (timerRef.current) clearInterval(timerRef.current); // Clear timer if game ended or paused
      return;
    }

    // Start a new timer only if the scenario is valid and hasn't been answered
    if (timerRef.current) clearInterval(timerRef.current); // Clear previous timer just in case

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setIsAnswered(true); // Mark as answered due to timeout
          setTimeout(() => handleGameOver("Timeout"), 1000); // Delay slightly before game over
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [
    scenario,
    currentScenarioIndex,
    isAnswered,
    handleGameOver,
    shuffledScenarios.length,
  ]); // Add dependencies

  // Function to move to the next scenario or end the game
  const moveToNextScenario = useCallback(() => {
    if (currentScenarioIndex < shuffledScenarios.length - 1) {
      setShowExplanation(false); // Hide explanation before moving to next scenario
      setCurrentScenarioIndex((prevIndex) => prevIndex + 1);
      setTimeLeft(GAME_DURATION);
      setSelectedOption(null);
      setIsAnswered(false); // Allow answering next question
    } else {
      // Last scenario was answered correctly, game finished successfully
      handleGameOver("Completed All Scenarios");
    }
  }, [currentScenarioIndex, shuffledScenarios.length, handleGameOver]);

  // Handle option selection
  const handleOptionSelect = (optionIndex: number) => {
    if (isAnswered || !scenario) return; // Don't allow selection if already answered/timed out/no scenario

    if (timerRef.current) clearInterval(timerRef.current); // Stop timer on selection
    setSelectedOption(optionIndex);
    setIsAnswered(true);
    setShowExplanation(true); // Show explanation page

    const isCorrect = optionIndex === scenario.correctOption;

    if (isCorrect) {
      incrementScore(POINTS_PER_CORRECT_ANSWER);
    }
  };

  // Get explanation text based on selected option
  const getExplanationText = () => {
    if (!isAnswered || selectedOption === null) return null;

    // Always return the explanation for the correct option
    return scenario.explanations.correct;
  };

  // Calculate shake class based on time left
  const getShakeClass = () => {
    if (timeLeft > 15) return "";
    if (timeLeft > 7) return "shake-mild";
    if (timeLeft > 4) return "shake-medium";
    return "shake-intense";
  };

  // Calculate danger overlay class based on time left
  const getDangerClass = () => {
    if (timeLeft > 11) return "";
    if (timeLeft > 7) return "mild";
    if (timeLeft > 3) return "medium";
    return "intense";
  };

  // Render loading or placeholder if scenarios not ready
  if (!scenario) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Loading game...
      </div>
    );
  }

  return (
    <>
      <div className={`danger-overlay ${getDangerClass()}`} />
      {showExplanation ? (
        // Explanation Page
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="w-full max-w-2xl space-y-8">
            <div
              className={`p-8 border-2 ${
                selectedOption === scenario.correctOption
                  ? "border-green-500 bg-green-500/10"
                  : "border-red-500 bg-red-500/10"
              }`}
            >
              <div className="space-y-4">
                <h2
                  className={`text-2xl font-bold ${
                    selectedOption === scenario.correctOption
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {selectedOption === scenario.correctOption
                    ? "Правильно!"
                    : "Неправильно"}
                </h2>

                {selectedOption !== scenario.correctOption && (
                  <div className="space-y-2">
                    <p className="text-gray-400">Правильный ответ:</p>
                    <p className="text-xl text-white">
                      {scenario.options[scenario.correctOption]}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-gray-400">Объяснение:</p>
                  <p className="text-lg text-white">{getExplanationText()}</p>
                </div>
              </div>
            </div>

            <button
              onClick={
                selectedOption === scenario.correctOption
                  ? moveToNextScenario
                  : () => handleGameOver("Incorrect Answer")
              }
              className={`w-full px-6 py-4 text-lg font-semibold transition-colors border-2 ${
                selectedOption === scenario.correctOption
                  ? "bg-green-500 hover:bg-green-600 border-green-500 hover:border-green-600 text-white"
                  : "bg-red-500 hover:bg-red-600 border-red-500 hover:border-red-600 text-white"
              }`}
            >
              {selectedOption === scenario.correctOption
                ? "Следующий Вопрос"
                : "Завершить Игру"}
            </button>
          </div>
        </div>
      ) : (
        // Game Page
        <div
          className={`flex flex-col items-center justify-center min-h-screen p-4 ${getShakeClass()}`}
        >
          {/* Game Header */}
          <div className="w-full max-w-2xl mb-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-yellow-500" />
                <span className="text-xl font-bold text-yellow-500">
                  СПАСАЙСЯ ОТ <br /> ЗЕМЛЕТРЯСЕНИЕ
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Timer
                  className={`w-6 h-6 ${
                    timeLeft <= 5 ? "text-red-500" : "text-gray-400"
                  }`}
                />
                <span
                  className={`text-xl font-bold ${
                    timeLeft <= 5 ? "text-red-500" : "text-gray-400"
                  }`}
                >
                  {timeLeft}
                </span>
              </div>
            </div>
            <div className="bg-gray-700 w-full h-2 rounded-full">
              <div
                className="bg-yellow-500 h-2 rounded-full transition-all duration-1000"
                style={{
                  width: `${
                    (currentScenarioIndex / shuffledScenarios.length) * 100
                  }%`,
                }}
              />
            </div>
          </div>

          {/* Scenario Content */}
          <div className="w-full max-w-2xl space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-center">
                {scenario.location}
              </h2>
              <p className="text-lg text-center text-gray-300">
                {scenario.description}
              </p>
            </div>

            {/* Options */}
            <div className="flex flex-col gap-4">
              {scenario.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  disabled={isAnswered}
                  className="w-full px-6 py-4 text-lg font-semibold transition-colors border-2 bg-gray-700 hover:bg-gray-600 text-white border-gray-700 hover:border-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {option}
                </button>
              ))}
            </div>

            {/* Progress Text */}
            <p className="text-center text-gray-400">
              Вопрос {currentScenarioIndex + 1} из {shuffledScenarios.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

// Add keyframes for shake animation at the end of the file
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes shake {
    10%, 90% {
      transform: translate3d(calc(var(--shake-intensity) * -1px), 0, 0);
    }
    
    20%, 80% {
      transform: translate3d(calc(var(--shake-intensity) * 1px), 0, 0);
    }

    30%, 50%, 70% {
      transform: translate3d(calc(var(--shake-intensity) * -1px), 0, 0);
    }

    40%, 60% {
      transform: translate3d(calc(var(--shake-intensity) * 1px), 0, 0);
    }
  }
`;
document.head.appendChild(styleSheet);
