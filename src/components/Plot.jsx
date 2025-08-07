import { useGameState, PLANT_TYPES } from '../contexts/GameStateContext';

export default function Plot({ plot, index }) {
    const { gameState, actions } = useGameState();

    const handleClick = () => {
        if (plot.plant) {
            if (plot.hasPest) {
                if (confirm('A praga está atacando! Usar um pesticida?')) {
                    actions.usePesticide(index);
                }
            } else if (plot.plant.currentGrowth >= plot.plant.growthTime) {
                actions.harvest(index);
            }
        } else {
            const availableSeeds = Object.keys(gameState.player.inventory)
                .filter(item => item.startsWith('semente_de_'))
                .map(item => item.replace('semente_de_', ''));

            if (availableSeeds.length > 0) {
                const seedType = prompt(`Qual semente plantar?\nDisponível: ${availableSeeds.join(', ')}`);
                if (seedType && PLANT_TYPES[seedType.toLowerCase()]) {
                    actions.plantSeed(index, seedType.toLowerCase());
                } else if(seedType) {
                    alert('Semente inválida ou não encontrada.');
                }
            } else {
                alert('Você não tem sementes. Visite a loja!');
            }
        }
    };

    let statusText = 'Lote Vazio';
    let icon = '🟫';
    let className = 'plot';

    if (plot.plant) {
        icon = plot.plant.icon;
        if (plot.hasPest) {
            statusText = 'PRAGA! 🐛';
            className += ' has-pest';
        } else if (plot.plant.currentGrowth >= plot.plant.growthTime) {
            statusText = 'Pronta!';
        } else {
            statusText = `${Math.floor(plot.plant.currentGrowth)}/${plot.plant.growthTime} dias`;
        }
    }

    return (
        <button className={className} onClick={handleClick}>
            <div className="icon">{icon}</div>
            <div className="status">{statusText}</div>
        </button>
    );
}
