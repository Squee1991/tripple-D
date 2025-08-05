<template>
    <div class="items-grid">
        <div
            v-for="award in awards"
            class="shop-item"
            :class="{ locked: award.locked }"
            @click="openAward(award)"
        >
            <div class="image-wrapper">
                <img :src="award.icon" alt="award" class="item-img"/>
                <div v-if="award.locked" class="locked-overlay">
                    🔒
                </div>
            </div>
            <p class="item-name">{{ award.title }}</p>
        </div>

        <div v-if="showModal" class="modal-overlay" @click.self="closeAward">
            <div class="modal-content">
                <img :src="selectedAward.icon" class="modal-icon"/>
                <h3>{{ selectedAward.title }}</h3>
                <p v-if="selectedAward.locked">🔒 Награда пока не получена</p>
                <p v-else>🎉 Поздравляем! Эта награда уже у вас!</p>
                <button @click="closeAward">Закрыть</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import {ref} from 'vue'

const props = defineProps({
    awards: {
        type: Array,
        required: true,
    },
})

const showModal = ref(false)
const selectedAward = ref({})

function openAward(award) {
    if (award.locked) return
    selectedAward.value = award
    showModal.value = true
}

function closeAward() {
    showModal.value = false
}
</script>

<style scoped>
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
    opacity: 0.5;
    filter: grayscale(100%);
    position: relative;
}
.image-wrapper {
    position: relative;
    width: 80px;
    height: 80px;
}
.locked-overlay {
    position: absolute;
    top: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 50%;
    padding: 4px 8px;
    font-size: 1rem;
    font-weight: bold;
    color: #1e1e1e;
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

.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
}

.modal-content {
    background: #fff;
    padding: 2rem;
    border-radius: 16px;
    text-align: center;
    max-width: 300px;
    border: 3px solid #1e1e1e;
    box-shadow: 4px 4px 0 #1e1e1e;
    animation: zoomIn 0.2s ease;
}

.modal-icon {
    width: 80px;
    height: 80px;
    margin-bottom: 1rem;
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

@keyframes zoomIn {
    from {
        transform: scale(0.8);
        opacity: 0;
    }
    to {
        transform: scale(1);
        opacity: 1;
    }
}
</style>
