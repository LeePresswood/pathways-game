
export enum SquareState {
  Empty,
  Visited,
  Wall,
}

export type Grid = SquareState[][];

export const createGrid = (rows: number, cols: number): Grid => {
  return Array.from({ length: rows }, () => Array(cols).fill(SquareState.Empty));
};
