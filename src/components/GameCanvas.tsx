
import React, { useRef, useEffect, useState } from 'react';
import { type GameState, createInitialState, startGame, moveTo } from '../game/gameState';
import { SquareState } from '../game/grid';

const GameCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null); // New ref for the game container
  const [gameState, setGameState] = useState<GameState>(createInitialState());

  useEffect(() => {
    // Focus the game container when the game state changes (e.g., after reset)
    if (gameContainerRef.current) {
      gameContainerRef.current.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // If game is not active, but not over/won, start the game with the first move
      if (!gameState.isGameActive && !gameState.isGameOver && !gameState.isGameWon) {
        setGameState(startGame(gameState));
      }

      // Now, if the game is active, process the move
      if (gameState.isGameActive) {
        const lastPos = gameState.path[gameState.path.length - 1];
        let newRow = lastPos.row;
        let newCol = lastPos.col;

        switch (e.key) {
          case 'ArrowUp':
            newRow--;
            break;
          case 'ArrowDown':
            newRow++;
            break;
          case 'ArrowLeft':
            newCol--;
            break;
          case 'ArrowRight':
            newCol++;
            break;
          default:
            return; // Ignore other keys
        }

        // Prevent default scroll behavior for arrow keys
        e.preventDefault();

        // Check if the new position is within bounds
        if (newRow >= 0 && newRow < gameState.rows && newCol >= 0 && newCol < gameState.cols) {
          setGameState(moveTo(gameState, newRow, newCol));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState]); // Depend on gameState to get the latest path and active state

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setGameState(createInitialState());
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, []); // No dependencies, only runs once for the listener

  // Effect to manage focus
  useEffect(() => {
    if (!gameState.isGameActive && gameContainerRef.current) {
      console.log('Attempting to focus game container after reset/game over...');
      gameContainerRef.current.focus();
      console.log('Game container focused. Active element:', document.activeElement);
    }
  }, [gameState.isGameActive]); // Depend on isGameActive to trigger focus

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const container = canvas.parentElement;
    if (container) {
      const size = Math.min(container.clientWidth, container.clientHeight);
      canvas.width = size;
      canvas.height = size;
    }

    const { grid, rows, cols, path } = gameState;
    const squareSize = canvas.width / cols;

    // Clear canvas
    ctx.fillStyle = '#eeeeee';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * squareSize;
        const y = row * squareSize;

        ctx.strokeStyle = '#ccc';
        ctx.strokeRect(x, y, squareSize, squareSize);

        if (grid[row][col] === SquareState.Wall) {
          ctx.fillStyle = '#333';
          ctx.fillRect(x, y, squareSize, squareSize);
        }
      }
    }

    // Draw path (filled squares with gradient)
    for (const pos of path) {
      const x = pos.col * squareSize;
      const y = pos.row * squareSize;

      const centerX = x + squareSize / 2;
      const centerY = y + squareSize / 2;
      const radius = squareSize / 2;

      const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.1, centerX, centerY, radius);
      gradient.addColorStop(0, '#4a78a8'); // Single color for now
      gradient.addColorStop(1, '#4a78a8'); // Single color for now

      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, squareSize, squareSize);
    }

    // Display game over/win message
    if (gameState.isGameOver) {
        ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '48px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
    } else if (gameState.isGameWon) {
        ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '48px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('You Win!', canvas.width / 2, canvas.height / 2);
    }

  }, [gameState]);

  const handleReset = () => {
    setGameState(createInitialState());
  };

  return (
    <div 
        ref={gameContainerRef} // Attach the ref
        tabIndex={0} // Make the div focusable
        style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem', position: 'relative', outline: 'none' }} // Remove outline
    >
    <canvas ref={canvasRef} style={{ background: 'white' }} />
      {(gameState.isGameOver || gameState.isGameWon) && (
        <button
          onClick={handleReset}
          style={{
            position: 'absolute',
            bottom: '20px',
            padding: '10px 20px',
            fontSize: '1.2rem',
            cursor: 'pointer',
          }}
        >
          Reset Game
        </button>
      )}
    </div>
  );
};

export default GameCanvas;

