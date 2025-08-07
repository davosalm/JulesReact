<script>
    import PlayerStats from '$lib/components/PlayerStats.svelte';
    import Weather from '$lib/components/Weather.svelte';
    import Inventory from '$lib/components/Inventory.svelte';
    import Farm from '$lib/components/Farm.svelte';
    import Store from '$lib/components/Store.svelte';
    import { gameState, nextDay } from '$lib/game-state.js';

    let isStoreOpen = false;
</script>

<main>
    <header>
        <h1>Minha Fazendinha Svelte</h1>
    </header>

    {#if $gameState.notification}
        <div class="notification">
            {$gameState.notification}
        </div>
    {/if}

    <div class="game-layout">
        <div class="sidebar">
            <Weather />
            <PlayerStats />
            <Inventory />
            <div class="actions">
                 <h2>Ações</h2>
                 <button on:click={nextDay}>Próximo Dia</button>
                 <button on:click={() => isStoreOpen = true}>Visitar Loja</button>
            </div>
        </div>
        <div class="main-content">
            <Farm />
        </div>
    </div>

    <Store bind:isOpen={isStoreOpen} />
</main>

<style>
    :global(body) {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        background-color: #eef7e9;
        color: #333;
    }

    main {
        max-width: 1200px;
        margin: 0 auto;
        padding: 1rem;
    }

    header {
        text-align: center;
        margin-bottom: 2rem;
    }

    .game-layout {
        display: grid;
        grid-template-columns: 300px 1fr;
        gap: 1rem;
    }

    .sidebar > * + * {
        margin-top: 1rem;
    }

    .actions {
        border: 1px solid #ccc;
        padding: 1rem;
        border-radius: 8px;
        background-color: #f9f9f9;
    }

    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #2d3436;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        z-index: 100;
        animation: fadeInOut 3s forwards;
    }

    @keyframes fadeInOut {
        0% { opacity: 0; transform: translateY(-20px); }
        10% { opacity: 1; transform: translateY(0); }
        90% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-20px); }
    }

    @media (max-width: 768px) {
        .game-layout {
            grid-template-columns: 1fr;
        }
    }
</style>
