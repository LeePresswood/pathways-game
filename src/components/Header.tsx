
import React from 'react';

interface HeaderProps {
  onNavigate: (view: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      backgroundColor: '#eeeeee',
      color: 'black',
      borderBottom: '1px solid black',
    }}>
      <h1>Pathways</h1>
      <nav>
        <ul style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'flex',
          gap: '1.5rem',
        }}>
          <li><a href="#" onClick={() => onNavigate('game')} style={{ color: 'black', textDecoration: 'none' }}>Game</a></li>
          <li><a href="/blog" style={{ color: 'black', textDecoration: 'none' }}>Blog</a></li>
          <li><a href="/analytics" style={{ color: 'black', textDecoration: 'none' }}>Analytics</a></li>
          <li><a href="/about" style={{ color: 'black', textDecoration: 'none' }}>About</a></li>
          <li><a href="#" onClick={() => onNavigate('editor')} style={{ color: 'black', textDecoration: 'none' }}>Editor</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
