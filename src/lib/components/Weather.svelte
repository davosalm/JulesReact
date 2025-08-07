<script>
    import { gameState } from '$lib/game-state.js';
</script>

<div class="weather-display">
    <h3>Clima do Dia</h3>
    <p>
        <span>{$gameState.weather.icon}</span>
        <span>{$gameState.weather.name}</span>
    </p>
</div>

<style>
    .weather-display {
        border: 1px solid #ccc;
        padding: 1rem;
        border-radius: 8px;
        background-color: #f9f9f9;
        text-align: center;
    }
    p {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        font-size: 1.2rem;
        margin: 0;
    }
    p span:first-child {
        font-size: 2rem;
    }
</style>
