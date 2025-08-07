import { useGameState } from '../contexts/GameStateContext';

export default function Inventory() {
    const { gameState } = useGameState();
    const inventory = gameState.player.inventory;

    return (
        <div className="widget">
            <h2>Inventário</h2>
            {Object.keys(inventory).length === 0 ? (
                <p>Vazio</p>
            ) : (
                <ul>
                    {Object.entries(inventory).map(([item, quantity]) => (
                        <li key={item}>
                            {item.replace(/_/g, ' ')}: {quantity}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
