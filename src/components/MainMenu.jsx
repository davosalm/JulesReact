import React from 'react';

export default function MainMenu({ onNewGame, onLoadGame }) {
    const hasSaveFile = !!localStorage.getItem('farmGameState');

    return (
        <div className="main-menu">
            <h1>Minha Fazendinha</h1>
            <div className="menu-buttons">
                <button onClick={onNewGame}>Novo Jogo</button>
                <button onClick={onLoadGame} disabled={!hasSaveFile} title={!hasSaveFile ? "Nenhum jogo salvo encontrado" : ""}>
                    Carregar Jogo
                </button>
            </div>
        </div>
    );
}
