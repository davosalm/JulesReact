<script>
    import { gameState } from '$lib/game-state.js';
</script>

<div class="inventory">
    <h2>Inventário</h2>
    {#if Object.keys($gameState.player.inventory).length === 0}
        <p>Vazio</p>
    {:else}
        <ul>
            {#each Object.entries($gameState.player.inventory) as [item, quantity]}
                <li>{item.replace(/_/g, ' ')}: {quantity}</li>
            {/each}
        </ul>
    {/if}
</div>

<style>
    .inventory {
        border: 1px solid #ccc;
        padding: 1rem;
        border-radius: 8px;
        background-color: #f9f9f9;
    }
    ul {
        list-style-type: none;
        padding: 0;
    }
</style>
