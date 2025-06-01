<template>
    <section class="description-cards">
        <div class="cards-row">
            <div class="card" v-for="(item, index) in items" :key="index">
                <span class="emoji">{{ item.emoji }}</span>
                <p class="card-text">
                    <span class="highlight">{{ item.title }}</span>
                    {{ item.rest }}
                </p>
            </div>
        </div>
    </section>
</template>

<script setup>
const items = [
    { emoji: '🧙‍♂️', title: '800+ слов', rest: ' с артиклями' },
    { emoji: '🎓', title: '5 способов обучения', rest: ' для разных стилей' },
    { emoji: '🕹', title: 'Элементы игры', rest: ' и прокачка' },
    { emoji: '🏆', title: 'Прохождение уровней', rest: ' и достижений' },
    { emoji: '⚔', title: 'Дуэли с другими участниками', rest: '' }
]
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Uncial+Antiqua&display=swap');

.description-cards {
    display: flex;
    justify-content: center;
    padding: 60px 20px;
    background: linear-gradient(to bottom, #fdfcf7, #fbf5e9);
    overflow-x: auto;
}

.cards-row {
    display: flex;
    gap: 20px;
    width: 100%;
    max-width: 1600px;
    justify-content: space-between;
    flex-wrap: nowrap;
}

.card {
    flex: 1 1 0;
    min-width: 260px;
    max-width: 300px;
    height: 180px;
    background: #fffdf4;
    border-radius: 16px;
    padding: 20px;
    font-family: 'Uncial Antiqua', cursive;
    font-size: 1.15rem;
    line-height: 1.6;
    color: #3e2723;
    transition: transform 0.2s ease;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    overflow: hidden;
    box-shadow: 0 0 16px rgba(162, 70, 228, 0.1);
}

.card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url('../../assets/images/magic-frame.png') center/cover no-repeat;
    z-index: 0;
    pointer-events: none;
    opacity: 0.7;
}

.card > * {
    position: relative;
    z-index: 1;
}

.card:hover {
    transform: scale(1.03);
    box-shadow: 0 0 20px rgba(162, 70, 228, 0.2);
}

.emoji {
    font-size: 1.5rem;
    display: block;
    margin-bottom: 0.5rem;
}

.highlight {
    color: #a246e4;
    font-weight: bold;
}

@media (max-width: 768px) {
    .cards-row {
        flex-wrap: wrap;
        justify-content: center;
    }

    .card {
        width: 90%;
        max-width: 100%;
    }
}
</style>
