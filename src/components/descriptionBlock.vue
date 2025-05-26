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
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(6px);
    background-blend-mode: overlay;
    border-radius: 20px;
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.2);
    padding: 40px 60px;
    margin: 60px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 40px;
    color: #000;
}

.feature-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
    font-size: 20px;
    font-family: 'Kurale', serif;
    flex: 1;
    min-width: 280px;
}

.feature-line {
    display: flex;
    align-items: center;
    gap: 10px;
}

.feature-line strong {
    color: #a44aff;
    font-weight: 600;
}

.wizard-img {
    max-width: 320px;
    border-radius: 20px;
    box-shadow: 0 0 24px rgba(0, 255, 255, 0.3);
    transition: transform 0.3s ease;
}

.wizard-img:hover {
    transform: scale(1.05);
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

</style>