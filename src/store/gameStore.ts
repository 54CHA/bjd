import { create } from 'zustand';
import { GameState } from '../types';

interface GameStore extends GameState {
  setNickname: (nickname: string) => void;
  incrementScore: () => void;
  nextScenario: () => void;
  resetGame: () => void;
  endGame: () => void;
}

const initialState: GameState = {
  nickname: '',
  score: 0,
  currentScenario: 0,
  isGameOver: false,
};

export const useGameStore = create<GameStore>((set) => ({
  ...initialState,
  setNickname: (nickname) => set({ nickname }),
  incrementScore: () => set((state) => ({ score: state.score + 10 })),
  nextScenario: () => set((state) => ({ currentScenario: state.currentScenario + 1 })),
  resetGame: () => set(initialState),
  endGame: () => set({ isGameOver: true }),
}));