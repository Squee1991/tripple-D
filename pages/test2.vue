<template>
    <div class="battle-page">
        <div v-if="player1" class="game-container">
            <div class="player-zone opponent-zone" :class="{ 'inactive-zone': currentPlayerId !== 'player2' }">
                <div class="hand-container top-hand">
                    <div v-for="(card) in player2.hand" :key="card.id" class="card in-hand"
                         @click="selectCardInHand(card, 'player2')"
                         :class="{ 'selected': selectedCardInHand?.id === card.id, 'playable': player2.mana >= card.cost }">
                        <div class="card-header">{{ card.name }} <span class="card-cost">💧{{ card.cost }}</span></div>
                        <p class="card-body">Существо: {{ card.attack }} / {{ card.hp }}</p>
                    </div>
                </div>
                <div class="board-and-info">
                    <div class="magic-menu-container">
                        <div v-for="spell in magicSpells" :key="spell.name" class="magic-spell"
                             @click="selectMagicSpell(spell, 'player2')"
                             :class="{ 'selected': selectedMagicSpell?.name === spell.name, 'playable': player2.mana >= spell.cost }">
                            <div class="card-header">{{ spell.name }} <span class="card-cost">💧{{ spell.cost }}</span>
                            </div>
                            <p class="card-body">{{ spell.description }}</p>
                        </div>
                    </div>
                    <div class="player-main-area">
                        <div class="player-info">
                            <div class="hero-portrait opponent-hero" @click="resolveActionOnTarget(player2)"
                                 :class="{ 'targetable': isTargetable(player2) }">
                                <div class="hero-avatar">T</div>
                                <div class="hero-hp">{{ player2.hp }} / 30</div>
                            </div>
                            <div class="player-stats">
                                <h2>{{ player2.name }}</h2>
                                <div class="mana-display">💧 {{ player2.mana }} / 10</div>
                            </div>
                        </div>
                        <div class="board-container">
                            <div v-for="(card, index) in player2.board" :key="card ? card.id : `p2-slot-${index}`"
                                 class="card-slot"
                                 @click="playCreatureCard(index, 'player2')">
                                <div v-if="card" class="card on-board"
                                     @click.stop="handleBoardCardClick(card, 'player2')"
                                     :class="{ 'targetable': isTargetable(card), 'can-attack': card.canAttack, 'selected': selectedAttacker?.id === card.id }">
                                    <h3>{{ card.name }}</h3>
                                    <div class="card-stats">{{ card.attack }} / {{ card.currentHp }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="center-divider">
                <h2 class="turn-indicator">Ход игрока: {{ activePlayer.name }}</h2>
                <button v-if="!gameOver" @click="endTurn" class="end-turn-button">Завершить ход</button>
                <div v-if="gameOver" class="game-over-display">
                    <h2>Победил {{ winner.name }}!</h2>
                    <button @click="initializeGame">Играть снова</button>
                </div>
            </div>
            <div class="player-zone self-zone" :class="{ 'inactive-zone': currentPlayerId !== 'player1' }">
                <div class="board-and-info">
                    <div class="magic-menu-container">
                        <div v-for="spell in magicSpells" :key="spell.name" class="magic-spell"
                             @click="selectMagicSpell(spell, 'player1')"
                             :class="{ 'selected': selectedMagicSpell?.name === spell.name, 'playable': player1.mana >= spell.cost }">
                            <div class="card-header">{{ spell.name }} <span class="card-cost">💧{{ spell.cost }}</span>
                            </div>
                            <p class="card-body">{{ spell.description }}</p>
                        </div>
                    </div>
                    <div class="player-main-area">
                        <div class="board-container">
                            <div v-for="(card, index) in player1.board" :key="card ? card.id : `p1-slot-${index}`"
                                 class="card-slot"
                                 @click="playCreatureCard(index, 'player1')">
                                <div v-if="card" class="card on-board"
                                     @click.stop="handleBoardCardClick(card, 'player1')"
                                     :class="{ 'targetable': isTargetable(card), 'can-attack': card.canAttack, 'selected': selectedAttacker?.id === card.id }">
                                    <h3>{{ card.name }}</h3>
                                    <div class="card-stats">{{ card.attack }} / {{ card.currentHp }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="player-info">
                            <div class="hero-portrait player-hero" @click="resolveActionOnTarget(player1)"
                                 :class="{ 'targetable': isTargetable(player1) }">
                                <div class="hero-avatar">G</div>
                                <div class="hero-hp">{{ player1.hp }} / 30</div>
                            </div>
                            <div class="player-stats">
                                <h2>{{ player1.name }}</h2>
                                <div class="mana-display">💧 {{ player1.mana }} / 10</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="hand-container bottom-hand">
                    <div v-for="(card) in player1.hand" :key="card.id" class="card in-hand"
                         @click="selectCardInHand(card, 'player1')"
                         :class="{ 'selected': selectedCardInHand?.id === card.id, 'playable': player1.mana >= card.cost }">
                        <div class="card-header">{{ card.name }} <span class="card-cost">💧{{ card.cost }}</span></div>
                        <p class="card-body">Существо: {{ card.attack }} / {{ card.hp }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="loading-screen"><h1>Загрузка...</h1></div>
    </div>
</template>

<script setup>
    import {ref, computed, onMounted} from 'vue';

    const createDeck = () => {
        const data = [{type: 'creature', name: 'Воин', cost: 3, attack: 3, hp: 4}, {
            type: 'creature',
            name: 'Лучник',
            cost: 2,
            attack: 3,
            hp: 2
        }, {type: 'creature', name: 'Гигант', cost: 6, attack: 5, hp: 7}, {
            type: 'creature',
            name: 'Рыцарь',
            cost: 4,
            attack: 4,
            hp: 5
        }, {type: 'creature', name: 'Страж', cost: 1, attack: 1, hp: 2},];
        return data.sort(() => Math.random() - 0.5).map(card => ({...card, id: getUniqueId()}));
    };
    const magicSpells = [
        {name: 'Удар', cost: 2, description: 'Наносит 3 урона', effect: {type: 'damage', value: 3}},
        {name: 'Исцеление', cost: 2, description: 'Лечит 3 здоровья', effect: {type: 'heal', value: 3}},
    ];
    let uniqueIdCounter = 0;
    const getUniqueId = () => uniqueIdCounter++;

    const player1 = ref(null);
    const player2 = ref(null);
    const currentPlayerId = ref(null);
    const activePlayer = computed(() => (currentPlayerId.value === 'player1' ? player1.value : player2.value));
    const opponentPlayer = computed(() => (currentPlayerId.value === 'player1' ? player2.value : player1.value));

    const selectedCardInHand = ref(null);
    const selectedAttacker = ref(null);
    const selectedMagicSpell = ref(null);

    const gameOver = ref(false);
    const winner = ref(null);

    onMounted(initializeGame);

    function initializeGame() {
        const createPlayer = (id, name) => ({
            id,
            name,
            hp: 30,
            mana: 10,
            deck: createDeck(),
            hand: new Array(5).fill(null).map(() => createDeck().pop()),
            board: new Array(5).fill(null)
        });
        player1.value = createPlayer('player1', 'Герой Света');
        player2.value = createPlayer('player2', 'Рыцарь Тьмы');
        currentPlayerId.value = 'player1';
        gameOver.value = false;
        winner.value = null;
        resetSelection();
    }

    function endTurn() {
        if (gameOver.value) return;
        resetSelection();
        currentPlayerId.value = (currentPlayerId.value === 'player1' ? 'player2' : 'player1');
        activePlayer.value.mana = 10;
        activePlayer.value.board.forEach(card => {
            if (card) card.canAttack = true;
        });
    }

    function resetSelection() {
        selectedCardInHand.value = null;
        selectedAttacker.value = null;
        selectedMagicSpell.value = null;
    }

    function selectCardInHand(card, ownerId) {
        if (ownerId !== currentPlayerId.value) return;
        if (activePlayer.value.mana < card.cost) return;
        resetSelection();
        selectedCardInHand.value = card;
    }

    function selectMagicSpell(spell, ownerId) {
        if (ownerId !== currentPlayerId.value) return;
        if (activePlayer.value.mana < spell.cost) return;
        resetSelection();
        selectedMagicSpell.value = spell;
    }

    function handleBoardCardClick(card, ownerId) {

        if (ownerId === currentPlayerId.value && card.canAttack) {
            resetSelection();
            selectedAttacker.value = card;
        } else {
            resolveActionOnTarget(card);
        }
    }

    function playCreatureCard(boardIndex, ownerId) {
        if (ownerId !== currentPlayerId.value) return;
        if (!selectedCardInHand.value || activePlayer.value.board[boardIndex] !== null) return;
        const card = selectedCardInHand.value;
        activePlayer.value.mana -= card.cost;
        activePlayer.value.board[boardIndex] = {...card, currentHp: card.hp, canAttack: false};
        const handIndex = activePlayer.value.hand.findIndex(c => c.id === card.id);
        if (handIndex !== -1) activePlayer.value.hand.splice(handIndex, 1);
        resetSelection();
    }

    function resolveActionOnTarget(target) {
        if (!selectedAttacker.value && !selectedMagicSpell.value) return;
        const isFriendly = target.id === activePlayer.value.id || activePlayer.value.board.includes(target);

        // АТАКА СУЩЕСТВОМ
        if (selectedAttacker.value) {
            if (isFriendly) return;
            const attacker = selectedAttacker.value;
            if (target.currentHp !== undefined) {
                target.currentHp -= attacker.attack;
                attacker.currentHp -= target.attack;
                if (target.currentHp <= 0) removeCardFromBoard(target, opponentPlayer.value);
                if (attacker.currentHp <= 0) removeCardFromBoard(attacker, activePlayer.value);
            } else {
                target.hp -= attacker.attack;
            }
            attacker.canAttack = false;
        } else if (selectedMagicSpell.value) {
            const spell = selectedMagicSpell.value;
            const effect = spell.effect;
            if (effect.type === 'damage' && isFriendly) return;
            if (effect.type === 'heal' && !isFriendly) return;
            if (activePlayer.value.mana < spell.cost) return;

            activePlayer.value.mana -= spell.cost;

            if (effect.type === 'damage') {
                target.currentHp !== undefined ? target.currentHp -= effect.value : target.hp -= effect.value;
            } else if (effect.type === 'heal') {
                if (target.currentHp !== undefined) {
                    const owner = isFriendly ? activePlayer.value : opponentPlayer.value;
                    const cardOnBoard = owner.board.find(c => c && c.id === target.id);
                    if (cardOnBoard) cardOnBoard.currentHp = Math.min(cardOnBoard.hp, cardOnBoard.currentHp + effect.value);
                } else {
                    target.hp = Math.min(30, target.hp + effect.value);
                }
            }
            if (target.currentHp <= 0) removeCardFromBoard(target, isFriendly ? activePlayer.value : opponentPlayer.value);
        }

        checkGameOver();
        resetSelection();
    }

    function isTargetable(target) {
        if (!target) return false;
        const isFriendly = target.id === activePlayer.value.id || activePlayer.value.board.includes(target);
        if (selectedAttacker.value) return !isFriendly;
        if (selectedMagicSpell.value) {
            const spellType = selectedMagicSpell.value.effect.type;
            if (spellType === 'damage') return !isFriendly;
            if (spellType === 'heal') return isFriendly;
        }
        return false;
    }

    function removeCardFromBoard(cardToRemove, owner) {
        if (!cardToRemove || !owner) return;
        const index = owner.board.findIndex(c => c && c.id === cardToRemove.id);
        if (index !== -1) owner.board[index] = null;
    }

    function checkGameOver() {
        if (player1.value.hp <= 0) {
            winner.value = player2.value;
            gameOver.value = true;
        }
        if (player2.value.hp <= 0) {
            winner.value = player1.value;
            gameOver.value = true;
        }
    }
</script>

<style scoped>

    .inactive-zone {
        opacity: 0.6;

    }

    .battle-page {
        font-family: 'Segoe UI', sans-serif;
        background: #2c3e50;
        color: white;
        overflow: hidden;
    }

    .loading-screen {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
    }

    .game-container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 100vh;
        padding: 10px;
    }

    .board-and-info {
        display: flex;
        gap: 20px;
        align-items: stretch;
        margin: 10px 0;
    }

    .opponent-zone .board-and-info {
        flex-direction: row;
    }

    .self-zone .board-and-info {
        flex-direction: row-reverse;
    }

    .hand-container {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        padding: 10px;
        min-height: 200px;
    }

    .magic-menu-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 10px;
    }

    .magic-spell {
        background: #485460;
        border: 2px solid #2f3640;
        border-radius: 8px;
        padding: 10px;
        width: 140px;
        height: 120px;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .player-main-area {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .player-info {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 15px;
    }

    .hero-portrait {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        border: 3px solid #95a5a6;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        cursor: pointer;
        flex-shrink: 0;
    }

    .board-container {
        flex-grow: 1;
        display: flex;
        justify-content: center;
        gap: 10px;
        padding: 10px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 10px;
        min-height: 180px;
    }

    .card-slot {
        width: 130px;
        height: 170px;
        border: 2px dashed #7f8c8d;
        border-radius: 10px;
        cursor: pointer;
    }

    .card {
        border-radius: 10px;
        padding: 8px;
        text-align: center;
        transition: all 0.2s ease;
        cursor: pointer;
        position: relative;
    }

    .card-header {
        display: flex;
        justify-content: space-between;
        font-weight: bold;
    }

    .card-cost {
        background: #3498db;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        flex-shrink: 0;
    }

    .card.in-hand {
        width: 150px;
        height: 180px;
        background: #ecf0f1;
        color: #2c3e50;
        border: 2px solid #bdc3c7;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .card:not(.playable) {
        filter: grayscale(1);
        cursor: not-allowed;
    }

    .card.selected {
        transform: scale(1.1) !important;
        border-color: #f1c40f;
        box-shadow: 0 0 15px #f1c40f;
    }

    .card.on-board {
        width: 100%;
        height: 100%;
        background: #95a5a6;
        color: #2c3e50;
    }

    .card.on-board.can-attack {
        box-shadow: 0 0 15px 5px #27ae60;
    }

    .card-stats {
        position: absolute;
        bottom: 5px;
        right: 8px;
        background: #e74c3c;
        color: white;
        padding: 2px 6px;
        border-radius: 10px;
    }

    .targetable {
        outline: 3px dashed #e74c3c !important;
        outline-offset: 2px;
    }

    .center-divider {
        text-align: center;
        padding: 5px 0;
    }

    .turn-indicator {
        margin: 0;
        color: #f1c40f;
    }

    .end-turn-button {
        background-color: #e67e22;
        color: white;
        border: none;
        padding: 12px 25px;
        font-size: 1.2em;
        border-radius: 8px;
        cursor: pointer;
    }
</style>