import { useGameState } from '../contexts/GameStateContext';

export default function Weather() {
    const { gameState } = useGameState();

    return (
        <div className="widget">
            <h2>Clima do Dia</h2>
            <p className="weather-display">
                <span>{gameState.weather.icon}</span>
                <span>{gameState.weather.name}</span>
            </p>
        </div>
    );
}
