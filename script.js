document.addEventListener('DOMContentLoaded', () => {
    // --- GAME DATA & CONSTANTS ---

    const PLANT_TYPES = {
        trigo: { name: "Trigo", growthTime: 3, harvestYield: 2, salePrice: 10, seedPrice: 5, pestChance: 0.2, icon: "🌾" },
        milho: { name: "Milho", growthTime: 4, harvestYield: 3, salePrice: 15, seedPrice: 8, pestChance: 0.3, icon: "🌽" },
        cenoura: { name: "Cenoura", growthTime: 2, harvestYield: 5, salePrice: 8, seedPrice: 4, pestChance: 0.1, icon: "🥕" }
    };

    const PESTICIDE = {
        name: "Pesticida",
        price: 20,
        icon: "🧪"
    };

    let gameState = {
        player: {
            name: "",
            money: 100,
            inventory: {
                'semente_de_trigo': 2,
            }
        },
        farm: {
            plots: Array(5).fill(null).map(() => ({ plant: null, hasPest: false }))
        },
        day: 1
    };

    // --- DOM ELEMENTS ---

    const playerNameEl = document.getElementById('player-name');
    const playerMoneyEl = document.getElementById('player-money');
    const gameDayEl = document.getElementById('game-day');
    const farmPlotsContainer = document.getElementById('farm-plots');
    const inventoryItemsContainer = document.getElementById('inventory-items');
    const storeContainer = document.getElementById('store');
    const storeItemsContainer = document.getElementById('store-items');

    const nextDayBtn = document.getElementById('next-day-btn');
    const openStoreBtn = document.getElementById('open-store-btn');
    const closeStoreBtn = document.getElementById('close-store-btn');

    // --- GAME LOGIC ---

    function createPlant(type) {
        const plantData = PLANT_TYPES[type];
        if (!plantData) return null;
        return {
            ...plantData,
            currentGrowth: 0,
            isMature: function() { return this.currentGrowth >= this.growthTime; }
        };
    }

    function addItemToInventory(itemName, quantity = 1) {
        gameState.player.inventory[itemName] = (gameState.player.inventory[itemName] || 0) + quantity;
    }

    function removeItemFromInventory(itemName, quantity = 1) {
        if (gameState.player.inventory[itemName] >= quantity) {
            gameState.player.inventory[itemName] -= quantity;
            if (gameState.player.inventory[itemName] <= 0) {
                delete gameState.player.inventory[itemName];
            }
            return true;
        }
        return false;
    }

    function nextDay() {
        gameState.day++;

        // Grow plants and check for pests
        gameState.farm.plots.forEach((plot, index) => {
            if (plot.plant) {
                if (plot.hasPest) {
                    alert(`Sua plantação de ${plot.plant.name} no lote ${index + 1} foi destruída por uma praga!`);
                    plot.plant = null;
                    plot.hasPest = false;
                } else {
                    plot.plant.currentGrowth++;
                    if (Math.random() < plot.plant.pestChance) {
                        plot.hasPest = true;
                        alert(`Uma praga apareceu na sua plantação de ${plot.plant.name} no lote ${index + 1}! Use pesticida ou ela será destruída amanhã.`);
                    }
                }
            }
        });

        updateUI();
    }

    function handlePlotClick(index) {
        const plot = gameState.farm.plots[index];
        if (plot.plant && plot.plant.isMature()) {
            // Harvest
            const plantName = plot.plant.name.toLowerCase();
            const harvestYield = plot.plant.harvestYield;
            addItemToInventory(`colheita_de_${plantName}`, harvestYield);
            alert(`Você colheu ${harvestYield} de ${plantName}!`);
            plot.plant = null;
            plot.hasPest = false;

        } else if (!plot.plant) {
            // Plant
            const availableSeeds = Object.keys(gameState.player.inventory)
                .filter(item => item.startsWith('semente_de_'))
                .map(item => item.replace('semente_de_', ''));

            if (availableSeeds.length === 0) {
                alert("Você não tem sementes para plantar. Visite a loja!");
                return;
            }

            const seedToPlant = prompt(`Qual semente você quer plantar neste lote?\nDisponível: ${availableSeeds.join(', ')}`);
            if (seedToPlant && availableSeeds.includes(seedToPlant.toLowerCase())) {
                const seedName = `semente_de_${seedToPlant.toLowerCase()}`;
                if (removeItemFromInventory(seedName)) {
                    plot.plant = createPlant(seedToPlant.toLowerCase());
                    alert(`${plot.plant.name} plantado!`);
                }
            } else if (seedToPlant) {
                alert("Semente inválida ou você não a possui.");
            }
        } else if (plot.hasPest) {
            // Use pesticide
            if (confirm("Esta planta tem uma praga. Deseja usar um pesticida?")) {
                if (removeItemFromInventory('pesticida')) {
                    plot.hasPest = false;
                    alert("Praga eliminada!");
                } else {
                    alert("Você não tem pesticida! Compre na loja.");
                }
            }
        } else {
            alert(`Sua plantação de ${plot.plant.name} ainda não está madura.`);
        }
        updateUI();
    }

    // --- UI RENDERING ---

    function updateUI() {
        // Player Stats
        playerNameEl.textContent = gameState.player.name;
        playerMoneyEl.textContent = gameState.player.money;
        gameDayEl.textContent = gameState.day;

        // Inventory
        inventoryItemsContainer.innerHTML = '';
        if (Object.keys(gameState.player.inventory).length === 0) {
            inventoryItemsContainer.innerHTML = '<p>Vazio</p>';
        } else {
            for (const [item, quantity] of Object.entries(gameState.player.inventory)) {
                inventoryItemsContainer.innerHTML += `<p>${item.replace(/_/g, ' ')}: ${quantity}</p>`;
            }
        }

        // Farm Plots
        farmPlotsContainer.innerHTML = '<h2>Fazenda</h2>';
        gameState.farm.plots.forEach((plot, index) => {
            const plotEl = document.createElement('div');
            plotEl.classList.add('plot');
            plotEl.dataset.index = index;
            if (plot.plant) {
                plotEl.classList.add('planted');
                let status = plot.plant.isMature() ? "Pronta!" : `${plot.plant.currentGrowth}/${plot.plant.growthTime} dias`;
                if (plot.hasPest) {
                    status = "PRAGA! 🐛";
                    plotEl.style.borderColor = 'red';
                }
                plotEl.innerHTML = `<span>${plot.plant.icon}</span><span>${plot.plant.name}</span><small>${status}</small>`;
            } else {
                plotEl.innerHTML = '<span>Lote Vazio</span><small>Clique para plantar</small>';
            }
            farmPlotsContainer.appendChild(plotEl);
        });

        // Store
        renderStore();
    }

    function renderStore() {
        storeItemsContainer.innerHTML = '';
        // Seeds
        for(const type in PLANT_TYPES) {
            const plant = PLANT_TYPES[type];
            storeItemsContainer.innerHTML += `
                <div>
                    <p>${plant.icon} Semente de ${plant.name} - $${plant.seedPrice}</p>
                    <button class="buy-btn" data-item-type="seed" data-item-id="${type}">Comprar</button>
                </div>
            `;
        }
        // Pesticide
        storeItemsContainer.innerHTML += `
            <div>
                <p>${PESTICIDE.icon} ${PESTICIDE.name} - $${PESTICIDE.price}</p>
                <button class="buy-btn" data-item-type="pesticide" data-item-id="pesticida">Comprar</button>
            </div>
        `;

        // Sellable items
        storeItemsContainer.innerHTML += '<h3>Vender Colheitas</h3>';
        let hasCrops = false;
        for (const [item, quantity] of Object.entries(gameState.player.inventory)) {
            if (item.startsWith('colheita_de_')) {
                hasCrops = true;
                const plantType = item.replace('colheita_de_', '');
                const plant = PLANT_TYPES[plantType];
                storeItemsContainer.innerHTML += `
                    <div>
                        <p>${plant.icon} ${plant.name} (${quantity}) - $${plant.salePrice} cada</p>
                        <button class="sell-btn" data-item-id="${plantType}">Vender 1</button>
                    </div>
                `;
            }
        }
        if (!hasCrops) {
            storeItemsContainer.innerHTML += '<p>Você não tem colheitas para vender.</p>';
        }
    }

    function handleStoreAction(e) {
        const target = e.target;
        if (target.classList.contains('buy-btn')) {
            const itemType = target.dataset.itemType;
            const itemId = target.dataset.itemId;

            if (itemType === 'seed') {
                const plant = PLANT_TYPES[itemId];
                if (gameState.player.money >= plant.seedPrice) {
                    gameState.player.money -= plant.seedPrice;
                    addItemToInventory(`semente_de_${itemId}`);
                } else {
                    alert("Dinheiro insuficiente!");
                }
            } else if (itemType === 'pesticide') {
                if (gameState.player.money >= PESTICIDE.price) {
                    gameState.player.money -= PESTICIDE.price;
                    addItemToInventory('pesticida');
                } else {
                    alert("Dinheiro insuficiente!");
                }
            }
        } else if (target.classList.contains('sell-btn')) {
            const itemId = target.dataset.itemId;
            const plant = PLANT_TYPES[itemId];
            if (removeItemFromInventory(`colheita_de_${itemId}`)) {
                gameState.player.money += plant.salePrice;
            }
        }
        updateUI();
    }

    // --- EVENT LISTENERS ---

    nextDayBtn.addEventListener('click', nextDay);

    openStoreBtn.addEventListener('click', () => storeContainer.classList.remove('hidden'));
    closeStoreBtn.addEventListener('click', () => storeContainer.classList.add('hidden'));

    farmPlotsContainer.addEventListener('click', (e) => {
        const plotEl = e.target.closest('.plot');
        if (plotEl) {
            handlePlotClick(parseInt(plotEl.dataset.index, 10));
        }
    });

    storeItemsContainer.addEventListener('click', handleStoreAction);

    // --- INITIALIZATION ---
    function init() {
        gameState.player.name = prompt("Qual é o seu nome, fazendeiro?") || "Fazendeiro";
        updateUI();
    }

    init();
});
