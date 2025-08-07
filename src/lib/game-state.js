import { writable } from 'svelte/store';

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

// --- SVELTE STORE ---
export const gameState = writable(initialState);

// --- HELPER FUNCTIONS TO MODIFY THE STORE ---

function setNotification(message, state) {
    state.notification = message;
    setTimeout(() => {
        gameState.update(s => {
            s.notification = '';
            return s;
        });
    }, 3000);
    return state;
}

export function nextDay() {
    gameState.update(state => {
        // 1. Change weather
        const weatherKeys = Object.keys(WEATHER_TYPES);
        const randomWeatherKey = weatherKeys[Math.floor(Math.random() * weatherKeys.length)];
        state.weather = WEATHER_TYPES[randomWeatherKey];

        state.day++;
        let pestDestroyed = 0;
        let newPests = 0;

        state.farm.plots.forEach((plot) => {
            if (plot.plant) {
                if (plot.hasPest) {
                    plot.plant = null;
                    plot.hasPest = false;
                    pestDestroyed++;
                } else {
                    // Apply weather effect to growth
                    plot.plant.currentGrowth += 1 * state.weather.effect.growthModifier;
                    if (Math.random() < plot.plant.pestChance) {
                        plot.hasPest = true;
                        newPests++;
                    }
                }
            }
        });

        let message = `Um novo dia começou. O tempo está ${state.weather.name}.`;
        if (pestDestroyed > 0) message += ` ${pestDestroyed} plantação(ões) foram destruídas por pragas!`;
        if (newPests > 0) message += ` ${newPests} nova(s) praga(s) apareceram!`;

        return setNotification(message, state);
    });
}

export function plantSeed(plotIndex, plantType) {
    gameState.update(state => {
        const seedName = `semente_de_${plantType}`;
        if (state.player.inventory[seedName] > 0) {
            state.player.inventory[seedName]--;
            if (state.player.inventory[seedName] === 0) {
                delete state.player.inventory[seedName];
            }

            const plantData = PLANT_TYPES[plantType];
            state.farm.plots[plotIndex].plant = {
                ...plantData,
                currentGrowth: 0,
            };
            state = setNotification(`${plantData.name} plantado!`, state);
        }
        return state;
    });
}

export function harvest(plotIndex) {
    gameState.update(state => {
        const plot = state.farm.plots[plotIndex];
        const plant = plot.plant;

        if (plant && plant.currentGrowth >= plant.growthTime) {
            const plantName = plant.name.toLowerCase();
            const harvestYield = plant.harvestYield;
            const itemName = `colheita_de_${plantName}`;

            state.player.inventory[itemName] = (state.player.inventory[itemName] || 0) + harvestYield;

            plot.plant = null;
            plot.hasPest = false;
            state = setNotification(`Você colheu ${harvestYield} de ${plant.name}!`, state);
        }
        return state;
    });
}

export function usePesticide(plotIndex) {
    gameState.update(state => {
        const plot = state.farm.plots[plotIndex];
        if (plot.plant && plot.hasPest && state.player.inventory['pesticida'] > 0) {
            state.player.inventory['pesticida']--;
             if (state.player.inventory['pesticida'] === 0) {
                delete state.player.inventory['pesticida'];
            }
            plot.hasPest = false;
            state = setNotification(`Praga eliminada!`, state);
        } else {
            state = setNotification(`Você não tem pesticida!`, state);
        }
        return state;
    });
}

export function buyItem(itemType, itemId) {
    gameState.update(state => {
        if (itemType === 'seed') {
            const plant = PLANT_TYPES[itemId];
            if (state.player.money >= plant.seedPrice) {
                state.player.money -= plant.seedPrice;
                const seedName = `semente_de_${itemId}`;
                state.player.inventory[seedName] = (state.player.inventory[seedName] || 0) + 1;
                state = setNotification(`Semente de ${plant.name} comprada.`, state);
            } else {
                state = setNotification(`Dinheiro insuficiente.`, state);
            }
        } else if (itemType === 'pesticide') {
             if (state.player.money >= PESTICIDE.price) {
                state.player.money -= PESTICIDE.price;
                state.player.inventory['pesticida'] = (state.player.inventory['pesticida'] || 0) + 1;
                state = setNotification(`Pesticida comprado.`, state);
            } else {
                state = setNotification(`Dinheiro insuficiente.`, state);
            }
        }
        return state;
    });
}

export function sellCrop(plantType) {
     gameState.update(state => {
        const cropName = `colheita_de_${plantType}`;
        if (state.player.inventory[cropName] > 0) {
            const plant = PLANT_TYPES[plantType];
            state.player.money += plant.salePrice;
            state.player.inventory[cropName]--;
            if (state.player.inventory[cropName] === 0) {
                delete state.player.inventory[cropName];
            }
            state = setNotification(`Colheita de ${plant.name} vendida.`, state);
        }
        return state;
    });
}
