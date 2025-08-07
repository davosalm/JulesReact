<script>
    import { gameState } from '$lib/game-state.js';
    import Plot from './Plot.svelte';
</script>

<div class="farm">
    <h2>Fazenda</h2>
    <div class="plots-grid">
        {#each $gameState.farm.plots as plot, index}
            <Plot {plot} {index} />
        {/each}
    </div>
</div>

<style>
    .farm {
        border: 1px solid #ccc;
        padding: 1rem;
        border-radius: 8px;
        background-color: #f9f9f9;
    }
    .plots-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        justify-content: center;
    }
</style>
