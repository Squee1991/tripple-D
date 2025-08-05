<template>
    <div class="page-wrapper">
        <div class="spellbook">
            <div class="modal-overlay" v-if="showModal">
                <transition name="zoom">
                    <div class="modal">
                        <h3>Подтверждение</h3>
                        <p>
                            Вы уверены, что хотите купить
                            <strong>"{{ selectedSpell?.name }}"</strong> за
                            <span class="price-accent">{{ selectedSpell?.price }} Артиклюсов?</span>
                        </p>
                        <div class="modal-buttons">
                            <button @click="cancelBuy" class="btn-cancel">Нет</button>
                            <button @click="confirmBuy" class="btn-confirm">Да</button>
                        </div>
                    </div>
                </transition>
            </div>
            <div class="title-wrapper">
                <transition name="fade">
                    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
                </transition>
            </div>
            <div class="spell-list">
                <div v-for="spell in spells" :key="spell.key" class="spell-card">
                    <div class="spell-header">
                        <span class="spell-name">{{ spell.name }}</span>
                        <div class="spell-price">
                            <span>{{ spell.price }}</span>
                        </div>
                    </div>
                    <p class="spell-desc">{{ spell.description }}</p>
                    <button class="spell-buy-btn"
                            :disabled="isOwned(spell.key) || store.points < spell.price"
                            @click="confirmPurchase(spell)"
                    >
                        {{ isOwned(spell.key) ? 'Изучено' : 'Купить' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {userlangStore} from '../../store/learningStore.js'
import {ref, watch} from 'vue'

const store = userlangStore()
const ownedSpells = ref([])
const errorMessage = ref('')
const showModal = ref(false)
const selectedSpell = ref(null)
const isOwned = (key) => ownedSpells.value.includes(key)
const spells = [
    {key: 'retry', name: 'Anima Reverso', description: 'Даёт вторую попытку', price: 1},
    {key: 'hideWrong', name: 'Umbra Selecta', description: 'Скрывает один неверный ответ', price: 20},
    {key: 'hint', name: 'Clavis Veritatis', description: 'Открывает правильный артикль', price: 30},
    {key: 'autoComplete', name: 'Memoria Implanta', description: 'Моментально изучает слово', price: 50},
    {key: 'freezeTimer', name: 'Tempus Glacies', description: 'Останавливает время на 5 секунд', price: 25},
    {key: 'shieldError', name: 'Aegis Mentis', description: 'Щит от одной ошибки', price: 40},
    {key: 'cleanseWrong', name: 'Purga Mens', description: 'Очищает 1 неправильный ответ', price: 25},
    {key: 'health', name: 'Vitae Fluens', description: 'Восстанавливает 1 здоровье', price: 25},
    {key: 'skip', name: 'Ordo Postremus', description: 'Отправляет слово в конец очереди', price: 25}
]
const confirmPurchase = (spell) => {
    if (isOwned(spell.key)) return
    if (store.points < spell.price) {
        errorMessage.value = `Недостаточно Артиклюсов!`
        setTimeout(() => (errorMessage.value = ''), 3000)
        return
    }
    selectedSpell.value = spell
    showModal.value = true
}

const confirmBuy = () => {
    if (!selectedSpell.value) return
    const spell = selectedSpell.value
    if (store.points >= spell.price && !isOwned(spell.key)) {
        store.points -= spell.price
        store.articlesSpentForAchievement += spell.price
        ownedSpells.value.push(spell.key)
        store.saveToFirebase()
    }
    showModal.value = false
    selectedSpell.value = null
}

const cancelBuy = () => {
    showModal.value = false
    selectedSpell.value = null
}

watch(showModal, (val) => {
    document.body.style.overflow = val ? 'hidden' : ''
})
watch(showModal, (val) => {
    document.body.style.overflow = val ? 'hidden' : ''
})

</script>
<style scoped>
.page-wrapper {
    background-color: #fef8e4;
    min-height: 100vh;
    padding: 2rem;
}

.spellbook {
    max-width: 1200px;
    margin: 0 auto;
    font-family: 'Inter', sans-serif;
}

.title-wrapper {
    text-align: center;
    margin-bottom: 2rem;
}

.spell-title {
    font-family: 'Fredoka One', cursive;
    font-size: 2.8rem;
    color: white;
    display: inline-block;
    background: #fca13a;
    padding: 0.5rem 1.5rem;
    border-radius: 16px;
    border: 3px solid #1e1e1e;
}

.error-message {
    display: inline-block;
    margin-top: 1rem;
    padding: 0.75rem 1.25rem;
    background-color: #f87171;
    color: white;
    font-family: 'Fredoka One', cursive;
    border-radius: 12px;
    border: 3px solid #1e1e1e;
    box-shadow: 4px 4px 0 #1e1e1e;
}

.spell-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
}

.spell-card {
    background: #fff;
    border: 3px solid #1e1e1e;
    border-radius: 24px;
    box-shadow: 8px 8px 0 #1e1e1e;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: all 0.2s ease-in-out;
}

.spell-card:hover {
    transform: translateY(-8px);
    box-shadow: 12px 12px 0 #1e1e1e;
}

.spell-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
}

.spell-name {
    font-family: 'Fredoka One', cursive;
    font-size: 1.5rem;
    color: #1e1e1e;
}

.spell-price {
    flex-shrink: 0;
    width: 50px;
    height: 50px;
    background-color: #fef8e4;
    border-radius: 50%;
    border: 3px solid #1e1e1e;
    display: flex;
    align-items: center;
    justify-content: center;
}

.spell-price span {
    font-family: 'Fredoka One', cursive;
    font-size: 1.2rem;
    color: #f97028;
    font-weight: 700;
}

.spell-desc {
    color: #555;
    font-size: 1rem;
    line-height: 1.6;
    margin: 1rem 0;
}

.spell-buy-btn {
    width: 100%;
    padding: 0.75rem;
    font-family: 'Fredoka One', cursive;
    font-size: 1.2rem;
    cursor: pointer;
    border: 3px solid #1e1e1e;
    border-radius: 16px;
    box-shadow: 4px 4px 0 #1e1e1e;
    transition: all 0.1s ease-in-out;
    background-color: #4ade80;
    color: #1e1e1e;
}

.spell-buy-btn:hover:not(:disabled) {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 #1e1e1e;
}

.spell-buy-btn:active:not(:disabled) {
    transform: translate(4px, 4px);
    box-shadow: 0 0 0 #1e1e1e;
}

.spell-buy-btn:disabled {
    background: #d1d5db;
    color: #6b7280;
    box-shadow: 4px 4px 0 #9ca3af;
    cursor: not-allowed;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
}

.modal {
    background: #fff;
    border: 4px solid #1e1e1e;
    padding: 2rem;
    border-radius: 24px;
    box-shadow: 8px 8px 0 #1e1e1e;
    text-align: center;
    max-width: 400px;
    width: 90%;
}

.modal h3 {
    font-family: 'Fredoka One', cursive;
    font-size: 1.8rem;
    margin-bottom: 1rem;
    color: #1e1e1e;
}

.modal p {
    font-size: 1.1rem;
    line-height: 1.6;
    color: #555;
}

.price-accent {
    font-weight: bold;
    color: #f97028;
}

.modal-buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 2rem;
}

.modal-buttons button {
    font-family: 'Fredoka One', cursive;
    font-size: 1.1rem;
    padding: 0.75rem 2rem;
    border-radius: 16px;
    border: 3px solid #1e1e1e;
    box-shadow: 4px 4px 0 #1e1e1e;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-cancel {
    background-color: #f3f4f6;
    color: #1e1e1e;
}

.btn-confirm {
    background-color: #4ade80;
    color: #1e1e1e;
}

.btn-cancel:hover, .btn-confirm:hover {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 #1e1e1e;
}

.fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
    opacity: 0;
}

.zoom-enter-active, .zoom-leave-active {
    transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s ease;
}

.zoom-enter-from, .zoom-leave-to {
    opacity: 0;
    transform: scale(0.9);
}

@media (max-width: 640px) {
    .spell-list {
        grid-template-columns: 1fr;
    }

    .spell-title {
        font-size: 2.2rem;
    }
}
</style>