<template>
    <section class="features-section">
        <div class="features-grid">
            <div class="feature-card" v-for="(item, index) in items" :key="index">
                <div class="card-bg" />
                <div class="card-content">
                    <img :src="item.src" :alt="item.alt" class="feature-icon" />
                    <h3 class="feature-title">{{ item.title }}</h3>
                    <p class="feature-description">{{ item.description }}</p>
                </div>
            </div>
        </div>
    </section>
</template>




<script setup>
import MagikBook from '../../assets/images/magicBook.svg'
import Brain from '../../assets/images/brain.svg'
import Controller from '../../assets/images/controller.svg'
import Cup from '../../assets/images/cubok.svg'

const items = [
    {
        src: MagikBook,
        alt: 'Book',
        title: '800+ слов',
        description: 'Выучите более 800 слов с определёнными и неопределёнными артиклями в удобной системе.',
    },
    {
        src: Brain,
        alt: 'Brain',
        title: '5 методов обучения',
        description: 'Подберите подходящий стиль: визуальный, аудиальный, кинестетический — или комбинируйте их.',
    },
    {
        src: Controller,
        alt: 'Controller',
        title: 'Игровые элементы',
        description: 'Зарабатывайте очки, проходите уровни, применяйте геймификацию для ускоренного прогресса.',
    },
    {
        src: Cup,
        alt: 'Cup',
        title: 'Система достижений',
        description: 'Прокачивайтесь, получайте награды и открывайте новые возможности по мере обучения.',
    },
]
</script>



<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel&display=swap');

.features-section {
    background: linear-gradient(135deg, #fdf6e3, #e0e7ff);
    padding: 80px 20px;
    display: flex;
    justify-content: center;
}

.features-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 40px;
    max-width: 1200px;
    width: 100%;
}

.feature-card {
    width: 260px;
    height: 360px;
    perspective: 1200px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

.card-bg {
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #ffffff, #f3f4f6);
    border-radius: 20px;
    border: 1px solid rgba(124, 58, 237, 0.15); /* добавлено */
    box-shadow: 0 10px 30px rgba(124, 58, 237, 0.08);
    transition: transform 0.5s ease, box-shadow 0.5s ease;
    z-index: 0;
}

.feature-card:hover .card-bg {
    transform: perspective(900px) translateY(-8%) rotateX(35deg);
    box-shadow: 0 50px 40px -10px rgba(0, 0, 0, 0.3);
}

.card-content {
    position: relative;
    z-index: 1;
    text-align: center;
    padding: 20px;
    transition: transform 0.5s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
}

.feature-card:hover .card-content {
    transform: translate3d(0, -60px, 120px) scale(1.2);
}

.feature-icon {
    width: 77px;
    height: 77px;
    margin-bottom: 16px;
    transition: transform 0.5s ease;
    filter: drop-shadow(0 0 6px rgba(124, 58, 237, 0.3));
}

.feature-title {
    font-family: 'Cinzel', serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: #7c3aed;
    margin-bottom: 10px;
    text-shadow: 0 0 4px #c4b5fd33;
    min-height: 24px;
}

.feature-description {
    font-family: 'Cinzel', serif;
    font-size: 0.95rem;
    color: #4b5563;
    line-height: 1.6;
    min-height: 96px;
    padding: 1px;
}
</style>
