import { useState } from 'react';
import './App.css';
import { useGameState } from './contexts/GameStateContext';
import PlayerStats from './components/PlayerStats.jsx';
import Inventory from './components/Inventory.jsx';
import Farm from './components/Farm.jsx';
import Store from './components/Store.jsx';
import MainMenu from './components/MainMenu.jsx';
import Weather from './components/Weather.jsx';

function App() {
  const { gameState, actions } = useGameState();
  const [isStoreOpen, setStoreOpen] = useState(false);
  const [gameStatus, setGameStatus] = useState('menu'); // 'menu' or 'playing'

  const handleNewGame = () => {
    actions.newGame();
    setGameStatus('playing');
  };

  const handleLoadGame = () => {
    actions.loadGame();
    setGameStatus('playing');
  };

  if (gameStatus === 'menu') {
    return <MainMenu onNewGame={handleNewGame} onLoadGame={handleLoadGame} />;
  }

  return (
    <>
      <header>
        <h1>Minha Fazendinha React</h1>
      </header>

      {gameState.notification && (
        <div className="notification">
          {gameState.notification}
        </div>
      )}

      <main className="game-layout">
        <div className="sidebar">
          <Weather />
          <PlayerStats />
          <Inventory />
          <div className="widget">
            <h2>Ações</h2>
            <button onClick={actions.nextDay}>Próximo Dia</button>
            <button onClick={() => setStoreOpen(true)}>Visitar Loja</button>
            <button onClick={actions.saveGame}>Salvar Jogo</button>
          </div>
        </div>
        <div className="main-content">
          <Farm />
        </div>
      </main>

      <Store isOpen={isStoreOpen} onClose={() => setStoreOpen(false)} />
    </>
  )
}

export default App
