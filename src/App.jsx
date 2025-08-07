import { useState } from 'react';
import './App.css';
import { useGameState } from './contexts/GameStateContext';
import PlayerStats from './components/PlayerStats.jsx';
import Inventory from './components/Inventory.jsx';
import Farm from './components/Farm.jsx';
import Weather from './components/Weather.jsx';
import Store from './components/Store.jsx';

function App() {
  const { gameState, actions } = useGameState();
  const [isStoreOpen, setStoreOpen] = useState(false);

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
