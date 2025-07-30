<template>
    <div class="shop-wrapper">
        <h2 class="shop-title">Магазин</h2>
        <div class="items-grid">
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
    </div>
</template>

<script setup>
import {computed} from 'vue'
import {userlangStore} from '../../store/learningStore.js'
import cat from '../../assets/shop/cat.png'
import girl from '../../assets/shop/girlviolent.png'
import hamster from '../../assets/shop/hamster.png'
import zaba from '../../assets/shop/zaba.png'

const learningStore = userlangStore()
const points = computed(() => learningStore.points)

const items = [
    { id: '1', name: 'Кот в очках', cost: 50, image: cat },
    { id: '2', name: 'Девочка в капюшоне', cost: 60, image: girl },
    { id: '3', name: 'Хомяк в кимоно', cost: 70, image: hamster },
    { id: '4', name: 'Жаба с рюкзаком', cost: 80, image: zaba }
]

function buy(item) {
    if (learningStore.points >= item.cost) {
        learningStore.points -= item.cost
        // TODO: сохранить покупку в Firebase, добавить в инвентарь
        alert(`Покупка: ${item.name}`)
    }
}
</script>

<style scoped>
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

.items-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 1.5rem;
}

.shop-item {
    background-color: #ffffff;
    border: 3px solid #1e1e1e;
    border-radius: 16px;
    padding: 1rem;
    text-align: center;
    box-shadow: 4px 4px 0 #1e1e1e;
    transition: transform 0.2s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
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
</style>
