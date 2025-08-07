import { useGameState, PLANT_TYPES, PESTICIDE } from '../contexts/GameStateContext';

export default function Store({ isOpen, onClose }) {
    const { gameState, actions } = useGameState();

    if (!isOpen) {
        return null;
    }

    const sellableCrops = Object.entries(gameState.player.inventory).filter(([item]) => item.startsWith('colheita_de_'));

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Loja</h2>

                <div className="store-section">
                    <h3>Comprar Sementes</h3>
                    {Object.entries(PLANT_TYPES).map(([id, plant]) => (
                        <div className="store-item" key={id}>
                            <span>{plant.icon} {plant.name} - ${plant.seedPrice}</span>
                            <button onClick={() => actions.buyItem('seed', id)}>Comprar</button>
                        </div>
                    ))}
                </div>

                <div className="store-section">
                    <h3>Comprar Itens</h3>
                    <div className="store-item">
                        <span>{PESTICIDE.icon} {PESTICIDE.name} - ${PESTICIDE.price}</span>
                        <button onClick={() => actions.buyItem('pesticide', 'pesticida')}>Comprar</button>
                    </div>
                </div>

                <div className="store-section">
                    <h3>Vender Colheitas</h3>
                    {sellableCrops.length === 0 ? (
                        <p>Nenhuma colheita para vender.</p>
                    ) : (
                        sellableCrops.map(([item, quantity]) => {
                            const plantType = item.replace('colheita_de_', '');
                            const plant = PLANT_TYPES[plantType];
                            return (
                                <div className="store-item" key={item}>
                                    <span>{plant.icon} {plant.name} ({quantity}) - ${plant.salePrice} cada</span>
                                    <button onClick={() => actions.sellCrop(plantType)}>Vender 1</button>
                                </div>
                            );
                        })
                    )}
                </div>

                <button className="close-btn" onClick={onClose}>Fechar Loja</button>
            </div>
        </div>
    );
}
