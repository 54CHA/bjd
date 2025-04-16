export interface GameState {
  nickname: string;
  score: number;
  currentScenario: number;
  isGameOver: boolean;
}

export interface Scenario {
  id: number;
  location: string;
  magnitude: number;
  description: string;
  options: string[];
  correctOption: number;
  explanations: {
    correct: string;
    incorrect: string[];
  };
}

export interface LeaderboardEntry {
  id: number;
  nickname: string;
  score: number;
  created_at: string;
}
