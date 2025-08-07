import { useGameState } from '../contexts/GameStateContext';

export default function PlayerStats() {
    const { gameState } = useGameState();

    return (
        <div className="widget">
            <h2>Status</h2>
            <p>Fazendeiro: {gameState.player.name}</p>
            <p>Dinheiro: ${gameState.player.money}</p>
            <p>Dia: {gameState.day}</p>
        </div>
    );
}
