import { useGameState } from '../contexts/GameStateContext';
import Plot from './Plot.jsx';

export default function Farm() {
    const { gameState } = useGameState();

    return (
        <div className="widget">
            <h2>Fazenda</h2>
            <div className="plots-grid">
                {gameState.farm.plots.map((plot, index) => (
                    <Plot key={index} plot={plot} index={index} />
                ))}
            </div>
        </div>
    );
}
