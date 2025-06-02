<template>
    <section class="features__section">
       <div class="features__inner">
           <div class="features__title">Что вас ждёт внутри</div>
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
        description: 'Выучите более 800 слов и артиклей в удобной системе.',
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
    {
        src: Cup,
        alt: 'Cup',
        title: 'Правила',
        description: 'Учите быстре ознакомивший с простыми правилами изучения.',
    },
    {
        src: Cup,
        alt: 'Cup',
        title: 'Упражнения',
        description: 'Закрепи полученные знания на практике. Выполняй упражнения',
    },
]
</script>



<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel&display=swap');

.features__section {
    background: linear-gradient(135deg, #fcf6e6 0%, #edeaff 100%);
    padding: 80px 20px;
    display: flex;
    justify-content: center;
}

.features__title {
    position: relative;
    text-align: center;
    margin-bottom: 55px;
    font-size: 42px;
    font-family: 'Montserrat', Arial, sans-serif;
    font-weight: bold;
    color: #fcdf8a;
    letter-spacing: 0.03em;
    text-shadow:
        0 2px 18px #87601585,
        0 1px 0 #fff,
        0 0px 2px #fff3,
        1px 2px 0 #a6752baa;
    filter: drop-shadow(0 2px 10px #7c4c09cc);
    background: none;
}

.features-grid {
    padding: 40px 10px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 45px;
    max-width: 1200px;
    width: 100%;
}

.feature-card {
    width: 260px;
    height: 380px;
    perspective: 1400px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: filter 0.18s;
}

.card-bg {
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(120deg, #fff9e6 20%, #ede7fe 80%);
    border-radius: 122px 32px 252px 32px / 34px 24px 34px 50px;
    border: 3.5px solid #dec2ff88;
    box-shadow:
        0 10px 40px 0 #dfd1ff80,
        0 2px 12px 0 #b58bff24,
        0 0 0 4px #fff3 inset;
    z-index: 0;
    transition:
        transform 0.55s cubic-bezier(.35,1.7,.44,.96),
        box-shadow 0.55s cubic-bezier(.35,1.7,.44,.96);
}

.feature-card:hover .card-bg {
    transform: perspective(900px) translateY(-6%) rotateX(19deg) scale(1.04);
    box-shadow:
        0 28px 64px -6px #9677ef44,
        0 8px 32px #fff3,
        0 0 0 7px #f4e6ffa1 inset;
    border-color: #a685f1;
}

.card-content {
    position: relative;
    z-index: 1;
    text-align: center;
    padding: 28px 16px 20px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    transition: transform 0.55s cubic-bezier(.35,1.7,.44,.96),
    filter 0.4s cubic-bezier(.44,1.7,.44,.96);
}

.feature-card:hover .card-content {
    transform: translate3d(0, -44px, 110px) scale(1.08);
    filter: brightness(1.1) drop-shadow(0 6px 22px #c0a5ff60);
}

.feature-icon {
    width: 86px;
    height: 86px;
    margin-bottom: 14px;
    filter:
        drop-shadow(0 0 10px #deceffad)
        drop-shadow(0 0 22px #fffde6bb);
    transition: transform 0.5s, filter 0.5s;
}

.feature-card:hover .feature-icon {
    transform: scale(1.09) rotate(-6deg);
    filter:
        drop-shadow(0 0 18px #d6b7ffbb)
        drop-shadow(0 0 40px #fff9c766);
}

.feature-title {
    font-family: "Cinzel", serif;
    font-size: 21px;
    font-weight: 700;
    color: #7c3aed;
    margin-bottom: 8px;
    text-shadow:
        0 2px 8px #dfcaff40,
        0 1px 0 #fff8;
    min-height: 24px;
    letter-spacing: 0.02em;
}

.feature-description {
    font-family: 'Kurale', serif;
    font-size: 16px;
    color: #715921;
    border-radius: 12px;
    box-shadow: 0 2px 18px #fff5 inset;
    line-height: 1.6;
    min-height: 150px;
    padding: 14px 10px 8px 10px;
    text-shadow: 0 1px 0 #fff9;
    margin-bottom: 0;
}

@media (max-width: 1050px) {
    .features-grid {
        gap: 28px;
    }
    .feature-card {
        width: 210px;
        height: 320px;
    }
    .feature-title {
        font-size: 17px;
    }
    .feature-description {
        font-size: 13px;
        min-height: 68px;
    }
    .feature-icon {
        width: 62px;
        height: 62px;
    }
}

@media (max-width: 700px) {
    .features__title {
        font-size: 26px;
    }
    .features-grid {
        flex-direction: column;
        gap: 18px;
    }
    .feature-card {
        width: 100%;
        min-width: 0;
        height: 210px;
        margin: 0 auto;
    }
}
</style>
