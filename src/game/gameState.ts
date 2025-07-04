
import { createGrid, SquareState, type Grid } from './grid';

export interface GameState {
  grid: Grid;
  rows: number;
  cols: number;
  path: { row: number; col: number }[];
  isGameActive: boolean; // True when drawing a path
  isGameOver: boolean;
  isGameWon: boolean;
  startRow: number;
  startCol: number;
}

const ROWS = 10;
const COLS = 10;

export const createInitialState = (): GameState => {
  const grid = createGrid(ROWS, COLS);
  const startRow = 0;
  const startCol = 0;

  // Mark the starting square as visited initially
  grid[startRow][startCol] = SquareState.Visited;

  // Place a 3x3 square of walls in the center
  for (let r = 3; r <= 5; r++) {
    for (let c = 3; c <= 5; c++) {
      grid[r][c] = SquareState.Wall;
    }
  }

  

  return {
    grid,
    rows: ROWS,
    cols: COLS,
    path: [{ row: startRow, col: startCol }],
    isGameActive: false,
    isGameOver: false,
    isGameWon: false,
    startRow,
    startCol,
  };
};

export const startGame = (prevState: GameState): GameState => {
  // Reset the board to its initial state, but keep the starting square visited
  const initialState = createInitialState();
  return {
    ...initialState,
    isGameActive: true,
  };
};

export const moveTo = (prevState: GameState, row: number, col: number): GameState => {
  if (!prevState.isGameActive || prevState.isGameOver) {
    return prevState;
  }

  const lastPos = prevState.path[prevState.path.length - 1];
  const isAdjacent = Math.abs(lastPos.row - row) + Math.abs(lastPos.col - col) === 1;

  if (!isAdjacent) {
    return prevState;
  }

  if (prevState.grid[row][col] === SquareState.Visited) {
    return { ...prevState, isGameOver: true, isGameActive: false };
  }

  if (prevState.grid[row][col] === SquareState.Wall) {
    return prevState;
  }

  const newGrid = prevState.grid.map(r => [...r]);
  newGrid[row][col] = SquareState.Visited;
  const newPath = [...prevState.path, { row, col }];

  // Check for win condition
  const totalSquares = prevState.rows * prevState.cols;
  const wallCount = prevState.grid.flat().filter(s => s === SquareState.Wall).length;
  const isGameWon = newPath.length === totalSquares - wallCount;

  return {
    ...prevState,
    grid: newGrid,
    path: newPath,
    isGameWon,
    isGameActive: !isGameWon,
  };
};



export const resetGame = (): GameState => {
  return createInitialState();
};
