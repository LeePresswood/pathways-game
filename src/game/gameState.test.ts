import { describe, it, expect } from 'vitest';
import { createInitialState, startGame, moveTo, resetGame } from './gameState';
import { SquareState } from './grid';

describe('gameState', () => {
  it('createInitialState should return the correct initial state', () => {
    const initialState = createInitialState();
    expect(initialState.rows).toBe(10);
    expect(initialState.cols).toBe(10);
    expect(initialState.path).toEqual([{ row: 0, col: 0 }]);
    expect(initialState.isGameActive).toBe(false);
    expect(initialState.isGameOver).toBe(false);
    expect(initialState.isGameWon).toBe(false);
    expect(initialState.grid[0][0]).toBe(SquareState.Visited);
    // Check for walls in the center
    expect(initialState.grid[3][3]).toBe(SquareState.Wall);
    expect(initialState.grid[4][4]).toBe(SquareState.Wall);
    expect(initialState.grid[5][5]).toBe(SquareState.Wall);
  });

  it('startGame should set isGameActive to true and reset the grid', () => {
    const initialState = createInitialState();
    const startedState = startGame(initialState);
    expect(startedState.isGameActive).toBe(true);
    expect(startedState.isGameOver).toBe(false);
    expect(startedState.isGameWon).toBe(false);
    expect(startedState.path).toEqual([{ row: 0, col: 0 }]);
    expect(startedState.grid[0][0]).toBe(SquareState.Visited);
  });

  describe('moveTo', () => {
    it('should not move if game is not active', () => {
      const initialState = createInitialState();
      const newState = moveTo(initialState, 0, 1);
      expect(newState).toEqual(initialState);
    });

    it('should move to an adjacent empty square', () => {
      const initialState = startGame(createInitialState());
      const newState = moveTo(initialState, 0, 1);
      expect(newState.path).toEqual([{ row: 0, col: 0 }, { row: 0, col: 1 }]);
      expect(newState.grid[0][1]).toBe(SquareState.Visited);
      expect(newState.isGameActive).toBe(true);
      expect(newState.isGameOver).toBe(false);
      expect(newState.isGameWon).toBe(false);
    });

    it('should result in game over if moving to an already visited square', () => {
      const initialState = startGame(createInitialState());
      const state1 = moveTo(initialState, 0, 1);
      const newState = moveTo(state1, 0, 0); // Move back to start
      expect(newState.isGameOver).toBe(true);
      expect(newState.isGameActive).toBe(false);
    });

    it('should not move if target is a wall', () => {
      const initialState = startGame(createInitialState());
      const newState = moveTo(initialState, 3, 3); // Wall at 3,3
      expect(newState.path).toEqual([{ row: 0, col: 0 }]);
      expect(newState.grid[3][3]).toBe(SquareState.Wall);
      expect(newState.isGameActive).toBe(true);
      expect(newState.isGameOver).toBe(false);
      expect(newState.isGameWon).toBe(false);
    });

    it('should not move if not adjacent', () => {
      const initialState = startGame(createInitialState());
      const newState = moveTo(initialState, 0, 2); // Not adjacent to 0,0
      expect(newState.path).toEqual([{ row: 0, col: 0 }]);
      expect(newState.grid[0][2]).toBe(SquareState.Empty);
      expect(newState.isGameActive).toBe(true);
      expect(newState.isGameOver).toBe(false);
      expect(newState.isGameWon).toBe(false);
    });

    it('should win the game if all non-wall squares are visited', () => {
      // Create a small grid for easier testing of win condition
      const smallGridState = {
        grid: [
          [SquareState.Visited, SquareState.Empty],
          [SquareState.Empty, SquareState.Empty],
        ],
        rows: 2,
        cols: 2,
        path: [{ row: 0, col: 0 }],
        isGameActive: true,
        isGameOver: false,
        isGameWon: false,
        startRow: 0,
        startCol: 0,
      };

      let state = moveTo(smallGridState, 0, 1);
      state = moveTo(state, 1, 1);
      state = moveTo(state, 1, 0);

      expect(state.isGameWon).toBe(true);
      expect(state.isGameActive).toBe(false);
    });
  });

  it('resetGame should return to the initial state', () => {
    const initialState = createInitialState();
    const state1 = startGame(initialState);
    const state2 = moveTo(state1, 0, 1);
    const resetState = resetGame();
    expect(resetState).toEqual(initialState);
  });
});
