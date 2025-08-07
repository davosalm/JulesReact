<script>
    import { gameState } from '$lib/game-state.js';
</script>

<div class="player-stats">
    <h2>Status</h2>
    <p>Fazendeiro: {$gameState.player.name}</p>
    <p>Dinheiro: ${$gameState.player.money}</p>
    <p>Dia: {$gameState.day}</p>
</div>

<style>
    .player-stats {
        border: 1px solid #ccc;
        padding: 1rem;
        border-radius: 8px;
        background-color: #f9f9f9;
    }
</style>
