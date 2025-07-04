# Pathways

A minimalistic puzzle game built with React, TypeScript, and Vite.

## Description

Pathways is a web-based puzzle game where the player creates paths. The interface is designed to be simple and clean, presented in a vertical, mobile-like column.

This entire project, from initial setup to feature implementation and bug fixes, is being developed by a Gemini AI agent. The user guides the development process by providing prompts and instructions, and the Gemini agent translates these into code changes, file modifications, and other necessary actions to build the game.

Developing a game through agentic coding presents unique challenges and benefits. While it can accelerate development by automating repetitive tasks and enabling rapid prototyping, it also introduces complexities such as maintaining consistent code style, debugging AI-generated logic, and ensuring architectural coherence. The primary benefit lies in the potential for increased efficiency and the ability to explore novel solutions, pushing the boundaries of what's possible in software development.

## Current State

- **UI:** A simple header displays the game's name and navigation links (Blog, Analytics, About). The main game area is a canvas that fills the remaining space.
- **Level Editor:** A dedicated editor interface allows users to design and create custom game levels. This includes placing walls and defining the grid size. Users can save their created levels as JSON files and load existing JSON level files to continue editing.
- **Styling:** The application uses a monochrome theme with a black-on-off-white (`#eeeeee`) color scheme.

## Gameplay Logic

Pathways is a puzzle game set on a 2D grid. The player must create a continuous path that covers every single square on the grid exactly once.

### Goal
- Color every square in the grid by moving through it.

### Player Interaction
- The game starts from a fixed, predefined position (currently top-left).
- The player navigates from square to square using the keyboard arrow keys.
- A "Reset Game" button appears when the game is won or lost, allowing the player to restart the puzzle.
- Pressing the `Escape` key will also reset the game at any time.

### Rules & Constraints
- Each square in the grid must be visited exactly once.
- Visiting a previously colored square results in a loss, and the puzzle restarts.
- The path must be continuous.
- Wall squares obstruct the path and cannot be crossed. They do not need to be visited to win the game.

## How to Run

1.  Navigate to the project directory.
    
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

## Tech Stack

*   **[React](https://react.dev/)**: A JavaScript library for building user interfaces.
*   **[TypeScript](https://www.typescriptlang.org/)**: A typed superset of JavaScript that compiles to plain JavaScript.
*   **[Vite](https://vitejs.dev/)**: A fast build tool and development server for modern web projects.
*   **[Vitest](https://vitest.dev/)**: A fast and simple testing framework for Vite projects.
*   **[ESLint](https://eslint.org/)**: A pluggable and configurable linter tool for identifying and reporting on patterns in JavaScript.

## Available Scripts

In the project directory, you can run the following commands:

*   `npm run dev`: Runs the app in development mode. Open [http://localhost:5173](http://localhost:5173) to view it in the browser.
*   `npm run build`: Builds the app for production to the `dist` folder.
*   `npm run lint`: Lints the project's TypeScript and JavaScript files.
*   `npm run test`: Runs the test suite using Vitest.
*   `npm run preview`: Serves the production build locally for previewing.

## File Structure

```
.
├── src
│   ├── assets
│   ├── components
│   │   ├── GameCanvas.tsx
│   │   ├── Header.tsx
│   │   └── LevelEditor.tsx
│   ├── game
│   │   ├── gameState.ts
│   │   └── grid.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── ...
├── package.json
└── ...
```

*   **`src/components`**: Contains the React components used in the application.
*   **`src/game`**: Contains the core game logic, such as the game state and grid management.
*   **`src/App.tsx`**: The main application component.
*   **`src/main.tsx`**: The entry point of the application.

## Contributing

Contributions are welcome! If you have a suggestion or want to report a bug, please open an issue.

If you want to contribute code, please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a pull request.
