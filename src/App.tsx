import React, { useState } from 'react';
import Header from './components/Header';
import GameCanvas from './components/GameCanvas';
import LevelEditor from './components/LevelEditor';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('game');

  const handleNavigate = (view: string) => {
    setCurrentView(view);
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#eeeeee',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '500px', // Wider column
        height: '100vh', // Full vertical height
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#eeeeee',
        border: 'none', // Remove the border
      }}>
        <Header onNavigate={handleNavigate} />
        {currentView === 'game' && <GameCanvas />}
        {currentView === 'editor' && <LevelEditor />}
      </div>
    </div>
  );
};

export default App;