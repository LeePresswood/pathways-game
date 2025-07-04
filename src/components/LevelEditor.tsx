import React, { useRef, useEffect, useState } from 'react';
import { createGrid, SquareState, type Grid } from '../game/grid';

const ROWS = 10;
const COLS = 10;

const LevelEditor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [grid, setGrid] = useState<Grid>(createGrid(ROWS, COLS));

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

    const squareSize = canvas.width / COLS;

    // Clear canvas
    ctx.fillStyle = '#eeeeee';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
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
  }, [grid]);

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const squareSize = canvas.width / COLS;
    const col = Math.floor(x / squareSize);
    const row = Math.floor(y / squareSize);

    if (row >= 0 && row < ROWS && col >= 0 && col < COLS) {
      setGrid(prevGrid => {
        const newGrid = prevGrid.map(r => [...r]);
        newGrid[row][col] = newGrid[row][col] === SquareState.Wall ? SquareState.Empty : SquareState.Wall;
        return newGrid;
      });
    }
  };

  const handleLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const loadedData = JSON.parse(e.target?.result as string);
        if (loadedData.rows && loadedData.cols && loadedData.grid) {
          // Reconstruct the 2D grid from the flattened array
          const newGrid: Grid = [];
          for (let i = 0; i < loadedData.rows; i++) {
            newGrid.push(loadedData.grid.slice(i * loadedData.cols, (i + 1) * loadedData.cols));
          }
          setGrid(newGrid);
        } else {
          console.error("Invalid level file format.");
        }
      } catch (error) {
        console.error("Error parsing level file:", error);
      } finally {
        // Clear the file input value to allow re-uploading the same file
        if (event.target) {
          event.target.value = '';
        }
      }
    };
    reader.readAsText(file);
  };

  const handleSave = () => {
    const levelData = {
      rows: ROWS,
      cols: COLS,
      grid: grid.flat(), // Flatten the 2D grid into a 1D array
    };
    const json = JSON.stringify(levelData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'level.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
      <canvas ref={canvasRef} onClick={handleClick} style={{ background: 'white' }} />
      <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
        <button onClick={handleSave} style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>Save Level</button>
        <input
          type="file"
          accept=".json"
          onChange={handleLoad}
          style={{ display: 'none' }}
          id="level-upload"
          data-testid="level-upload-input"
        />
        <button
          onClick={() => document.getElementById('level-upload')?.click()}
          style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}
        >
          Load Level
        </button>
      </div>
    </div>
  );
};

export default LevelEditor;
