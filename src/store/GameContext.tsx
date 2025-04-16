import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
} from "react";

// Define the shape of the context state
interface GameState {
  nickname: string;
  score: number;
  gameStatus: "ready" | "playing" | "gameover";
}

// Define the shape of the context value (state + actions)
interface GameContextProps extends GameState {
  setNickname: (name: string) => void;
  setScore: (score: number) => void;
  incrementScore: (points: number) => void;
  setGameStatus: (status: "ready" | "playing" | "gameover") => void;
  resetGame: () => void;
}

// Create the context with a default value (can be null or a default object)
// Using 'undefined' forces consumers to ensure the provider is used
const GameContext = createContext<GameContextProps | undefined>(undefined);

// Create the provider component
interface GameProviderProps {
  children: ReactNode;
}

const initialGameState: GameState = {
  nickname: "",
  score: 0,
  gameStatus: "ready",
};

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [state, setState] = useState<GameState>(initialGameState);

  // Memoize action functions with useCallback
  const setNickname = useCallback((name: string) => {
    // Basic validation or trimming could happen here
    setState((prevState) => ({ ...prevState, nickname: name }));
  }, []); // Empty dependency array: function doesn't depend on props/state from provider

  const setScore = useCallback((score: number) => {
    setState((prevState) => ({ ...prevState, score }));
  }, []);

  const incrementScore = useCallback((points: number) => {
    setState((prevState) => ({
      ...prevState,
      score: prevState.score + points,
    }));
  }, []); // Depends only on setState, which is stable

  const setGameStatus = useCallback(
    (status: "ready" | "playing" | "gameover") => {
      setState((prevState) => ({ ...prevState, gameStatus: status }));
    },
    []
  );

  const resetGame = useCallback(() => {
    setState((prevState) => ({
      ...prevState, // Keep nickname? Or reset everything? Let's keep nickname for now.
      score: 0,
      gameStatus: "ready",
    }));
  }, []); // Doesn't depend on external values

  // Context value now uses memoized functions
  const contextValue: GameContextProps = {
    ...state,
    setNickname,
    setScore,
    incrementScore,
    setGameStatus,
    resetGame,
  };

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  );
};

// Create a custom hook for easy consumption of the context
export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
