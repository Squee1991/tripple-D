<template>
    <div class="features-section">
        <div class="feature-list">
            <div class="feature-line">🧙‍♂️ — <strong>500+ слов</strong> с артиклями</div>
            <div class="feature-line">🎓 — <strong>5 способов обучения</strong> для разных стилей</div>
            <div class="feature-line">🕹 — <strong>Элементы игры</strong> и прокачка</div>
            <div class="feature-line">🏆 — <strong>Прохождение уровней</strong> и достижений</div>
        </div>
        <img src="../../assets/images/wizard.png" alt="Wizard" class="wizard-img" />
    </div>
</template>

<script setup>
// пусто
</script>

<style scoped>
.features-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 40px;
    padding: 40px 60px;
    background: rgba(30, 24, 17, 0.7);
    backdrop-filter: blur(8px);
    border: 2px solid #b08d57;
    border-radius: 20px;
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
    color: #f3e2b2;
    font-family: 'Kurale', serif;
}

.feature-line .icon {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    fill: #fcd000;
}
.feature-line .highlight {
    color: #bf80ff;  /* лиловый */
    font-weight: 600;
}
.feature-line span:not(.highlight) {
    color: inherit;
}
.feature-line {
    font-size: 22px;
    color: #f3e2b2;
    position: relative;
}
.feature-line::before {
    content: '';
    display: inline-block;
    width: 24px; height: 24px;
    background-size: contain;
    margin-right: 10px;
    vertical-align: middle;
}

.feature-line strong {
    color: #a44aff;
    font-weight: 600;
}

.wizard-img {
    max-width: 320px;
    border-radius: 16px;
    box-shadow: 0 0 24px rgba(0, 255, 255, 0.3);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.wizard-img:hover {
    transform: scale(1.05);
    box-shadow: 0 0 40px rgba(0, 255, 255, 0.6);
}

@media (max-width: 768px) {
    .features-section {
        flex-direction: column;
        text-align: center;
        padding: 30px 20px;
    }

    .wizard-img {
        max-width: 240px;
        margin-top: 20px;
    }
}
.feature-line:nth-child(1)::before { background-image: url('../../assets/images/magic_book.svg'); }
.feature-line:nth-child(2)::before { background-image: url('../../assets/images/learning.svg'); }
</style>


