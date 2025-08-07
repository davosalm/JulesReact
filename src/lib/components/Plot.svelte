<script>
    import { plantSeed, harvest, usePesticide, gameState, PLANT_TYPES } from '$lib/game-state.js';

    export let plot;
    export let index;

    function handleClick() {
        if (plot.plant) {
            if (plot.hasPest) {
                if (confirm('A praga está atacando! Usar um pesticida?')) {
                    usePesticide(index);
                }
            } else if (plot.plant.currentGrowth >= plot.plant.growthTime) {
                harvest(index);
            }
        } else {
            const availableSeeds = Object.keys($gameState.player.inventory)
                .filter(item => item.startsWith('semente_de_'))
                .map(item => item.replace('semente_de_', ''));

            if (availableSeeds.length > 0) {
                const seedType = prompt(`Qual semente plantar?\nDisponível: ${availableSeeds.join(', ')}`);
                if (seedType && PLANT_TYPES[seedType.toLowerCase()]) {
                    plantSeed(index, seedType.toLowerCase());
                } else if(seedType) {
                    alert('Semente inválida ou não encontrada.');
                }
            } else {
                alert('Você não tem sementes. Visite a loja!');
            }
        }
    }

    $: statusText = (() => {
        if (!plot.plant) return 'Lote Vazio';
        if (plot.hasPest) return 'PRAGA! 🐛';
        if (plot.plant.currentGrowth >= plot.plant.growthTime) return 'Pronta!';
        return `${plot.plant.currentGrowth}/${plot.plant.growthTime} dias`;
    })();

    $: icon = plot.plant ? plot.plant.icon : '🟫';
</script>

<button class="plot" on:click={handleClick} class:has-pest={plot.hasPest}>
    <div class="icon">{icon}</div>
    <div class="status">{statusText}</div>
</button>

<style>
    .plot {
        width: 100px;
        height: 100px;
        border: 2px dashed #8b4513;
        background-color: #deb887;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        font-family: inherit;
        border-radius: 8px;
    }
    .plot.has-pest {
        border-color: red;
        animation: pulse 1s infinite;
    }
    .icon {
        font-size: 2rem;
    }
    @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7); }
        70% { box-shadow: 0 0 0 10px rgba(255, 0, 0, 0); }
        100% { box-shadow: 0 0 0 0 rgba(255, 0, 0, 0); }
    }
</style>
