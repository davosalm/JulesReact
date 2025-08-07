<script>
    import { gameState, buyItem, sellCrop, PLANT_TYPES, PESTICIDE } from '$lib/game-state.js';

    export let isOpen = false;

    function close() {
        isOpen = false;
    }

    $: sellableCrops = Object.entries($gameState.player.inventory).filter(([item]) => item.startsWith('colheita_de_'));
</script>

{#if isOpen}
    <div class="modal-backdrop" on:click={close}>
        <div class="modal-content" on:click|stopPropagation>
            <h2>Loja</h2>

            <div class="store-section">
                <h3>Comprar Sementes</h3>
                {#each Object.entries(PLANT_TYPES) as [id, plant]}
                    <div class="store-item">
                        <span>{plant.icon} {plant.name} - ${plant.seedPrice}</span>
                        <button on:click={() => buyItem('seed', id)}>Comprar</button>
                    </div>
                {/each}
            </div>

            <div class="store-section">
                <h3>Comprar Itens</h3>
                 <div class="store-item">
                    <span>{PESTICIDE.icon} {PESTICIDE.name} - ${PESTICIDE.price}</span>
                    <button on:click={() => buyItem('pesticide', 'pesticida')}>Comprar</button>
                </div>
            </div>

            <div class="store-section">
                <h3>Vender Colheitas</h3>
                {#if sellableCrops.length === 0}
                    <p>Nenhuma colheita para vender.</p>
                {:else}
                    {#each sellableCrops as [item, quantity]}
                        {@const plantType = item.replace('colheita_de_', '')}
                        {@const plant = PLANT_TYPES[plantType]}
                         <div class="store-item">
                            <span>{plant.icon} {plant.name} ({quantity}) - ${plant.salePrice} cada</span>
                            <button on:click={() => sellCrop(plantType)}>Vender 1</button>
                        </div>
                    {/each}
                {/if}
            </div>

            <button class="close-btn" on:click={close}>Fechar Loja</button>
        </div>
    </div>
{/if}

<style>
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10;
    }
    .modal-content {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        width: 90%;
        max-width: 600px;
    }
    .store-section {
        margin-bottom: 1.5rem;
    }
    .store-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 0;
        border-bottom: 1px solid #eee;
    }
    .close-btn {
        display: block;
        margin: 1rem auto 0;
    }
</style>
