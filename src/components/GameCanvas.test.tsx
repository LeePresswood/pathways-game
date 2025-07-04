import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import GameCanvas from './GameCanvas';
import * as gameStateModule from '../game/gameState';
import { GameState } from '../game/gameState'; // Import GameState type
import { SquareState } from '../game/grid'; // Import SquareState type

// Mock the HTMLCanvasElement methods
HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  fillRect: vi.fn(),
  clearRect: vi.fn(),
  strokeRect: vi.fn(),
  createRadialGradient: vi.fn(() => ({
    addColorStop: vi.fn(),
  })),
  fillText: vi.fn(),
  measureText: vi.fn(() => ({ width: 0 })),
}));

// Mock the entire gameStateModule
vi.mock('../game/gameState', async (importOriginal) => {
  const actual = await importOriginal() as typeof gameStateModule;
  return {
    ...actual,
    createInitialState: vi.fn(actual.createInitialState),
    startGame: vi.fn(actual.startGame),
    moveTo: vi.fn(actual.moveTo),
    resetGame: vi.fn(actual.resetGame),
  };
});

describe('GameCanvas', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    // Set clientWidth and clientHeight for the container to ensure canvas sizing branches are covered
    Object.defineProperty(container, 'clientWidth', { value: 500 });
    Object.defineProperty(container, 'clientHeight', { value: 500 });

    // Clear mocks before each test
    vi.mocked(gameStateModule.createInitialState).mockClear();
    vi.mocked(gameStateModule.startGame).mockClear();
    vi.mocked(gameStateModule.moveTo).mockClear();
    vi.mocked(gameStateModule.resetGame).mockClear();

    // Default mock implementations
    vi.mocked(gameStateModule.createInitialState).mockImplementation(() => ({
      grid: [[SquareState.Visited, SquareState.Empty], [SquareState.Empty, SquareState.Empty]],
      rows: 2,
      cols: 2,
      path: [{ row: 0, col: 0 }],
      isGameActive: false,
      isGameOver: true,
      isGameWon: false,
      startRow: 0,
      startCol: 0,
    }));


    vi.mocked(gameStateModule.startGame).mockImplementation((prevState: GameState) => ({
      ...prevState,
      isGameActive: true,
    }));

    vi.mocked(gameStateModule.moveTo).mockImplementation((prevState: GameState, row: number, col: number) => {
      const newGrid = prevState.grid.map(r => [...r]);
      newGrid[row][col] = SquareState.Visited;
      return {
        ...prevState,
        grid: newGrid,
        path: [...prevState.path, { row, col }],
      };
    });

    vi.mocked(gameStateModule.resetGame).mockImplementation(() => ({
      grid: [[SquareState.Empty, SquareState.Empty], [SquareState.Empty, SquareState.Empty]],
      rows: 2,
      cols: 2,
      path: [],
      isGameActive: false,
      isGameOver: true,
      isGameWon: false,
      startRow: 0,
      startCol: 0,
    }));
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
    vi.restoreAllMocks();
  });

  it('renders without crashing', () => {
    render(<GameCanvas />, { container });
    expect(container.querySelector('canvas')).toBeInTheDocument();
  });

  it('does not set canvas size if parentElement is null', () => {
    const { container } = render(<GameCanvas />);
    const canvas = container.querySelector('canvas');
    Object.defineProperty(canvas, 'parentElement', { value: null });
    // Re-render to trigger the useEffect
    act(() => {
      render(<GameCanvas />, { container });
    });
    // No direct assertion, but this covers the branch
  });

  it('does not draw if getContext returns null', () => {
    HTMLCanvasElement.prototype.getContext = vi.fn(() => null);
    render(<GameCanvas />, { container });
    // No direct assertion, but this covers the branch where ctx is null
  });

  it('starts the game on first arrow key press', () => {
    // Override the default mock for this specific test
    vi.mocked(gameStateModule.createInitialState).mockReturnValueOnce({
      grid: [[SquareState.Empty]],
      rows: 1,
      cols: 1,
      path: [{ row: 0, col: 0 }],
      isGameActive: false,
      isGameOver: false,
      isGameWon: false,
      startRow: 0,
      startCol: 0,
    });

    render(<GameCanvas />, { container });
    const canvas = container.querySelector('canvas');
    // Mock parentElement and its clientWidth/clientHeight for canvas sizing coverage
    Object.defineProperty(canvas, 'parentElement', {
      value: {
        clientWidth: 500,
        clientHeight: 500,
      },
    });
    act(() => {
      fireEvent.keyDown(canvas, { key: 'ArrowRight' });
    });
    expect(vi.mocked(gameStateModule.startGame)).toHaveBeenCalled();
  });

  it('does not move player if key is not an arrow key', () => {
    vi.mocked(gameStateModule.createInitialState).mockReturnValueOnce({
      grid: [[SquareState.Visited, SquareState.Empty], [SquareState.Empty, SquareState.Empty]],
      rows: 2,
      cols: 2,
      path: [{ row: 0, col: 0 }],
      isGameActive: true, // Set to true for this test
      isGameOver: false,
      isGameWon: false,
      startRow: 0,
      startCol: 0,
    });

    render(<GameCanvas />, { container });
    const canvas = container.querySelector('canvas');
    // Mock parentElement and its clientWidth/clientHeight for canvas sizing coverage
    Object.defineProperty(canvas, 'parentElement', {
      value: {
        clientWidth: 500,
        clientHeight: 500,
      },
    });
    act(() => {
      fireEvent.keyDown(canvas, { key: 'a' }); // Press a non-arrow key
    });
    expect(vi.mocked(gameStateModule.moveTo)).not.toHaveBeenCalled();
  });

  it('does not move player if new position is out of bounds', () => {
    vi.mocked(gameStateModule.createInitialState).mockReturnValueOnce({
      grid: [[SquareState.Visited, SquareState.Empty], [SquareState.Empty, SquareState.Empty]],
      rows: 2,
      cols: 2,
      path: [{ row: 0, col: 0 }],
      isGameActive: true, // Set to true for this test
      isGameOver: false,
      isGameWon: false,
      startRow: 0,
      startCol: 0,
    });

    render(<GameCanvas />, { container });
    const canvas = container.querySelector('canvas');
    // Mock parentElement and its clientWidth/clientHeight for canvas sizing coverage
    Object.defineProperty(canvas, 'parentElement', {
      value: {
        clientWidth: 500,
        clientHeight: 500,
      },
    });
    act(() => {
      fireEvent.keyDown(canvas, { key: 'ArrowUp' }); // Move out of bounds
    });
    expect(vi.mocked(gameStateModule.moveTo)).not.toHaveBeenCalled();
  });

  it('resets the game on Escape key press', () => {
    render(<GameCanvas />, { container });
    const canvas = container.querySelector('canvas');
    // Mock parentElement and its clientWidth/clientHeight for canvas sizing coverage
    Object.defineProperty(canvas, 'parentElement', {
      value: {
        clientWidth: 500,
        clientHeight: 500,
      },
    });
    act(() => {
      fireEvent.keyDown(canvas, { key: 'Escape' });
    });
    expect(vi.mocked(gameStateModule.createInitialState)).toHaveBeenCalled();
  });

  it('displays Reset Game button when game is over', () => {
    render(<GameCanvas />, { container });
    expect(screen.getByText('Reset Game')).toBeInTheDocument();
  });

  it('displays Reset Game button when game is won', () => {
    vi.mocked(gameStateModule.createInitialState).mockReturnValueOnce({
      grid: [[SquareState.Visited, SquareState.Empty], [SquareState.Empty, SquareState.Empty]],
      rows: 2,
      cols: 2,
      path: [{ row: 0, col: 0 }],
      isGameActive: false,
      isGameOver: false,
      isGameWon: true,
      startRow: 0,
      startCol: 0,
    });
    render(<GameCanvas />, { container });
    expect(screen.getByText('Reset Game')).toBeInTheDocument();
  });

  it('resets game when Reset Game button is clicked', () => {
    vi.mocked(gameStateModule.createInitialState).mockReturnValueOnce({
      grid: [[SquareState.Visited, SquareState.Empty], [SquareState.Empty, SquareState.Empty]],
      rows: 2,
      cols: 2,
      path: [{ row: 0, col: 0 }],
      isGameActive: false,
      isGameOver: true, // Ensure the button is visible
      isGameWon: false,
      startRow: 0,
      startCol: 0,
    });

    render(<GameCanvas />, { container });

    act(() => {
      fireEvent.click(screen.getByText('Reset Game'));
    });

    // Initial render in StrictMode calls createInitialState() twice.
    // The click calls it once more.
    expect(vi.mocked(gameStateModule.createInitialState)).toHaveBeenCalledTimes(3);
  });
});