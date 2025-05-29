import { create } from 'zustand';
import { database } from './firebaseConfig';
import { ref, set as databaseSet, push } from 'firebase/database';

const useGameStore = create((set) => ({
    playerName: '',
    displayNumber: null,
    previousNumber: null,
    score: 0,
    round: 1,
    isGameOver: false,

  setDisplayNumber: (number) => set({ displayNumber: number }),
  setPlayerName: (name) => set({ playerName: name }),
  setPreviousNumber: (number) => set({ previousNumber: number }),
  setScore: (newScore) => set({ score: newScore }),
  incrementScore: () => set((state) => ({ score: state.score + 1 })),
  nextRound: () => set((state) => ({ round: state.round + 1 })),
  endGame: () => set({ isGameOver: true }),
  resetScore: () => set({ score: 0 }),

  addToScoreBoard: (playerName, score) => {
    const scoreRef = ref(database, `scores/${playerName}`);
    const newScoreRef = push(scoreRef);
    databaseSet(newScoreRef, {
      player: playerName,
      score: score,
      timestamp: Date.now(),
    });
  },
}));

export default useGameStore;
