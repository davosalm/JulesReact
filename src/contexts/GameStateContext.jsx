import { createContext, useContext, useState, useCallback } from 'react';

// --- CONSTANTS ---
export const PLANT_TYPES = {
    trigo: { name: "Trigo", growthTime: 3, harvestYield: 2, salePrice: 10, seedPrice: 5, pestChance: 0.2, icon: "🌾" },
    milho: { name: "Milho", growthTime: 4, harvestYield: 3, salePrice: 15, seedPrice: 8, pestChance: 0.3, icon: "🌽" },
    cenoura: { name: "Cenoura", growthTime: 2, harvestYield: 5, salePrice: 8, seedPrice: 4, pestChance: 0.1, icon: "🥕" }
};

export const PESTICIDE = {
    name: "Pesticida",
    price: 20,
    icon: "🧪"
};

export const WEATHER_TYPES = {
    sunny: { name: "Ensolarado", icon: "☀️", effect: { growthModifier: 1 } },
    rainy: { name: "Chuvoso", icon: "🌧️", effect: { growthModifier: 1.5 } },
    drought: { name: "Seca", icon: "🥵", effect: { growthModifier: 0.5 } }
};

// --- CONTEXT CREATION ---
const GameStateContext = createContext();

// --- INITIAL GAME STATE ---
const initialState = {
    player: {
        name: "Fazendeiro",
        money: 100,
        inventory: {
            'semente_de_trigo': 2,
        }
    },
    farm: {
        plots: Array(5).fill(null).map(() => ({ plant: null, hasPest: false }))
    },
    day: 1,
    weather: WEATHER_TYPES.sunny,
    notification: ''
};


// --- PROVIDER COMPONENT ---
export function GameStateProvider({ children }) {
    const [gameState, setGameState] = useState(initialState);

    const setNotification = useCallback((message) => {
        setGameState(prevState => ({ ...prevState, notification: message }));
        setTimeout(() => {
            setGameState(prevState => ({ ...prevState, notification: '' }));
        }, 3000);
    }, []);

    // --- GAME LOGIC FUNCTIONS ---
    // All functions that modify state are wrapped in useCallback for performance
    const nextDay = useCallback(() => {
        setGameState(prevState => {
            const weatherKeys = Object.keys(WEATHER_TYPES);
            const randomWeatherKey = weatherKeys[Math.floor(Math.random() * weatherKeys.length)];
            const newWeather = WEATHER_TYPES[randomWeatherKey];

            const newState = {
                ...prevState,
                day: prevState.day + 1,
                weather: newWeather
            };

            let pestDestroyed = 0;
            let newPests = 0;

            newState.farm.plots = newState.farm.plots.map(plot => {
                if (plot.plant) {
                    if (plot.hasPest) {
                        pestDestroyed++;
                        return { ...plot, plant: null, hasPest: false };
                    }
                    plot.plant.currentGrowth += 1 * newWeather.effect.growthModifier;
                    if (Math.random() < plot.plant.pestChance) {
                        newPests++;
                        plot.hasPest = true;
                    }
                }
                return plot;
            });

            let message = `Um novo dia começou. O tempo está ${newWeather.name}.`;
            if (pestDestroyed > 0) message += ` ${pestDestroyed} plantação(ões) foram destruídas!`;
            if (newPests > 0) message += ` ${newPests} nova(s) praga(s) apareceram!`;
            setNotification(message);

            return newState;
        });
    }, [setNotification]);

    const plantSeed = useCallback((plotIndex, plantType) => {
        setGameState(prevState => {
            const newState = { ...prevState };
            const seedName = `semente_de_${plantType}`;
            if (newState.player.inventory[seedName] > 0) {
                newState.player.inventory[seedName]--;
                if (newState.player.inventory[seedName] === 0) {
                    delete newState.player.inventory[seedName];
                }

                const plantData = PLANT_TYPES[plantType];
                newState.farm.plots[plotIndex].plant = { ...plantData, currentGrowth: 0 };
                setNotification(`${plantData.name} plantado!`);
            }
            return newState;
        });
    }, [setNotification]);

    const harvest = useCallback((plotIndex) => {
        setGameState(prevState => {
            const newState = { ...prevState };
            const plot = newState.farm.plots[plotIndex];
            const plant = plot.plant;

            if (plant && plant.currentGrowth >= plant.growthTime) {
                const plantName = plant.name.toLowerCase();
                const harvestYield = plant.harvestYield;
                const itemName = `colheita_de_${plantName}`;

                newState.player.inventory[itemName] = (newState.player.inventory[itemName] || 0) + harvestYield;

                plot.plant = null;
                plot.hasPest = false;
                setNotification(`Você colheu ${harvestYield} de ${plant.name}!`);
            }
            return newState;
        });
    }, [setNotification]);

    const buyItem = useCallback((itemType, itemId) => {
        setGameState(prevState => {
            const newState = { ...prevState };
            if (itemType === 'seed') {
                const plant = PLANT_TYPES[itemId];
                if (newState.player.money >= plant.seedPrice) {
                    newState.player.money -= plant.seedPrice;
                    const seedName = `semente_de_${itemId}`;
                    newState.player.inventory[seedName] = (newState.player.inventory[seedName] || 0) + 1;
                    setNotification(`Semente de ${plant.name} comprada.`);
                } else {
                    setNotification(`Dinheiro insuficiente.`);
                }
            } else if (itemType === 'pesticide') {
                if (newState.player.money >= PESTICIDE.price) {
                    newState.player.money -= PESTICIDE.price;
                    newState.player.inventory['pesticida'] = (newState.player.inventory['pesticida'] || 0) + 1;
                    setNotification(`Pesticida comprado.`);
                } else {
                    setNotification(`Dinheiro insuficiente.`);
                }
            }
            return newState;
        });
    }, [setNotification]);

    const sellCrop = useCallback((plantType) => {
        setGameState(prevState => {
            const newState = { ...prevState };
            const cropName = `colheita_de_${plantType}`;
            if (newState.player.inventory[cropName] > 0) {
                const plant = PLANT_TYPES[plantType];
                newState.player.money += plant.salePrice;
                newState.player.inventory[cropName]--;
                if (newState.player.inventory[cropName] === 0) {
                    delete newState.player.inventory[cropName];
                }
                setNotification(`Colheita de ${plant.name} vendida.`);
            }
            return newState;
        });
    }, [setNotification]);

    const usePesticide = useCallback((plotIndex) => {
        setGameState(prevState => {
            const newState = { ...prevState };
            const plot = newState.farm.plots[plotIndex];
            if (plot.plant && plot.hasPest && newState.player.inventory['pesticida'] > 0) {
                newState.player.inventory['pesticida']--;
                if (newState.player.inventory['pesticida'] === 0) {
                    delete newState.player.inventory['pesticida'];
                }
                plot.hasPest = false;
                setNotification(`Praga eliminada!`);
            } else {
                setNotification(`Você não tem pesticida!`);
            }
            return newState;
        });
    }, [setNotification]);

    const saveGame = useCallback(() => {
        try {
            localStorage.setItem('farmGameState', JSON.stringify(gameState));
            setNotification('Jogo salvo com sucesso!');
        } catch (error) {
            console.error("Failed to save game", error);
            setNotification('Erro ao salvar o jogo.');
        }
    }, [gameState, setNotification]);

    const loadGame = useCallback(() => {
        try {
            const savedStateJSON = localStorage.getItem('farmGameState');
            if (savedStateJSON) {
                const savedState = JSON.parse(savedStateJSON);
                setGameState(savedState);
                setNotification('Jogo carregado com sucesso!');
            } else {
                setNotification('Nenhum jogo salvo encontrado.');
            }
        } catch (error) {
            console.error("Failed to load game", error);
            setNotification('Erro ao carregar o jogo.');
        }
    }, [setNotification]);

    const newGame = useCallback(() => {
        // Reset state to initial values
        setGameState(initialState);
        setNotification('Novo jogo iniciado!');
    }, [setNotification]);


    const value = {
        gameState,
        actions: {
            nextDay,
            plantSeed,
            harvest,
            buyItem,
            sellCrop,
            usePesticide,
            saveGame,
            loadGame,
            newGame
        }
    };

    return (
        <GameStateContext.Provider value={value}>
            {children}
        </GameStateContext.Provider>
    );
}

// --- CUSTOM HOOK ---
export function useGameState() {
    const context = useContext(GameStateContext);
    if (!context) {
        throw new Error('useGameState must be used within a GameStateProvider');
    }
    return context;
}
