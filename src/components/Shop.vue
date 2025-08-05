<template>
    <div class="shop-wrapper">
        <h2 class="shop-title">Магазин</h2>

        <div class="shop-tabs">
            <button
                    v-for="tab in shopTabs"
                    :key="tab.key"
                    :class="{ active: currentShopTab === tab.key }"
                    @click="currentShopTab = tab.key"
            >
                <img v-if="tab.icon.endsWith('.svg')" class="tab-icon" :src="tab.icon" alt=""/>
                <span v-else class="tab-label">{{ tab.icon }}</span>
                <span class="tab-label">{{ tab.label }}</span>
            </button>
        </div>

        <transition name="slide-up" mode="out-in">
            <div class="shop-content" :key="currentShopTab">
                <Skills v-if="currentShopTab === 'skills'"/>

                <div v-if="currentShopTab === 'avatars'" class="items-grid">
                    <div
                            v-for="item in items"
                            :key="item.id"
                            class="shop-item"
                            :class="{ locked: item.cost > points }"
                    >
                        <img :src="item.image" alt="" class="item-img"/>
                        <p class="item-name">{{ item.name }}</p>
                        <p class="item-cost">{{ item.cost }} артикл.</p>
                        <button @click="buy(item)" :disabled="item.cost > points">Купить</button>
                    </div>
                </div>


                <div v-if="currentShopTab === 'custom'" class="placeholder">
                    Тут будет кастомизация интерфейса
                </div>

                <div v-if="currentShopTab === 'backgrounds'" class="placeholder">
                    Тут будут фоны для выбора
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import {ref, computed} from 'vue'
import {userlangStore} from '../../store/learningStore.js'
import Skills from '../components/skillz.vue'

import cat from '../../assets/shop/cat.png'
import girl from '../../assets/shop/girlviolent.png'
import hamster from '../../assets/shop/hamster.png'
import zaba from '../../assets/shop/zaba.png'
import skillsImg from '../../assets/images/skills.svg'

const currentShopTab = ref('skills')

const shopTabs = [
    {key: 'skills', label: 'Способности', icon: skillsImg},
    {key: 'avatars', label: 'Аватары', icon: '🧍'},
    {key: 'custom', label: 'Кастомизация', icon: '🎨'},
    {key: 'backgrounds', label: 'Фон', icon: '🖼️'},
]

const learningStore = userlangStore()
const points = computed(() => learningStore.points)

const items = [
    {id: '1', name: 'Кот в очках', cost: 50, image: cat},
    {id: '2', name: 'Девочка в капюшоне', cost: 60, image: girl},
    {id: '3', name: 'Хомяк в кимоно', cost: 70, image: hamster},
    {id: '4', name: 'Жаба с рюкзаком', cost: 80, image: zaba},
]

async function buy(item) {
    if (learningStore.points >= item.cost) {
        learningStore.points -= item.cost

        // ✅ Увеличиваем потраченные артиклюсы
        learningStore.articlesSpentForAchievement += item.cost

        // ✅ Сохраняем в Firebase
        await learningStore.saveToFirebase()

        // ✅ Можно показать подтверждение
        alert(`Покупка: ${item.name}`)
    } else {
        alert('Недостаточно артиклюсов для покупки.')
    }
}
</script>

<style scoped>
/* (Без изменений, всё изначально корректно) */
.shop-wrapper {
    background-color: #fff8dc;
    padding: 2rem;
    border-radius: 16px;
    border: 3px solid #1e1e1e;
    box-shadow: 8px 8px 0 #e5e7eb;
}

.shop-title {
    font-family: 'Fredoka One', cursive;
    font-size: 2rem;
    margin-bottom: 2rem;
    text-align: center;
}

.shop-tabs {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    justify-content: center;
}

.shop-tabs button {
    position: relative;
    font-family: 'Fredoka One', cursive;
    padding: 0.5rem 1.25rem;
    font-size: 1rem;
    border: 3px solid #1e1e1e;
    border-radius: 16px;
    background: #ffffff;
    cursor: pointer;
    transition: 0.2s;
    box-shadow: 4px 4px 0 #1e1e1e;
}

.shop-tabs button.active::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 40%;
    height: 3px;
    background-color: #f97316;
    border-radius: 2px;
}

.shop-content {
    min-height: 300px;
}

.items-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 1.5rem;
}

.shop-item.locked img {
    filter: grayscale(100%);
    opacity: 0.6;
}

.shop-item {
    background-color: #ffffff;
    border: 3px solid #1e1e1e;
    border-radius: 16px;
    padding: 1rem;
    text-align: center;
    box-shadow: 4px 4px 0 #1e1e1e;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.shop-item:hover {
    transform: translateY(-4px);
    box-shadow: 6px 6px 0 #1e1e1e;
}

.shop-item.locked {
    opacity: 0.6;
}

.shop-item:hover {
    transform: translate(2px, 2px);
}

.item-img {
    width: 80px;
    height: 80px;
    object-fit: contain;
    margin-bottom: 0.5rem;
}

.item-name {
    font-weight: bold;
    font-size: 1.1rem;
    margin-bottom: 0.25rem;
}

.item-cost {
    color: #f97316;
    font-size: 1rem;
    margin-bottom: 0.5rem;
}

button {
    font-family: 'Fredoka One', cursive;
    padding: 0.5rem 1rem;
    border-radius: 12px;
    border: 2px solid #1e1e1e;
    background: #4ade80;
    box-shadow: 2px 2px 0 #1e1e1e;
    cursor: pointer;
    transition: all 0.2s ease;
}

button:disabled {
    background: #ccc;
    cursor: not-allowed;
    box-shadow: none;
}

.placeholder {
    text-align: center;
    font-style: italic;
    padding: 2rem;
    color: #555;
}

.slide-up-enter-active,
.slide-up-leave-active {
    transition: all 0.4s ease;
}

.slide-up-enter-from {
    opacity: 0;
    transform: translateY(20px);
}

.slide-up-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

.tab-icon {
    width: 30px;
}
</style>
