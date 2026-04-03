import { create } from 'zustand';

interface GameState {
  score: number;
  incrementScore: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  score: 0,
  incrementScore: () => set((state) => ({ score: state.score + 1 })),
}));
