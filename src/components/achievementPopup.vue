<template>
    <transition name="fade">
        <div v-if="achievement" class="modal-overlay" @click.self="closeModal">
            <transition name="pop">
                <div class="modal-container">
                    <button class="modal-close" @click="closeModal">×</button>
                    <div class="modal-content">
                        <h3 class="modal-title">Поздравляем!!!</h3>
                        <p class="modal-title">Вы получили достижение:</p>
                        <div class="modal__icon">{{ achievement?.icon }}</div>
                        <p class="modal-text">{{ t(achievement?.name) }}</p>
                    </div>
                </div>
            </transition>
        </div>
    </transition>
</template>

<script setup>
    const props = defineProps({
        achievement: Object
    })
    const emit = defineEmits(['close'])
    const { t } = useI18n()

    const closeModal = () => {
        emit('close')
    }
</script>

<style scoped>
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
        z-index: 1000;
    }

    .modal-container {
        font-family: "Nunito", sans-serif;
        position: relative;
        background: white;
        padding: 2.5rem;
        border-radius: 24px;
        border: 4px solid #1e1e1e;
        box-shadow: 8px 8px 0 #1e1e1e;
        max-width: 500px;
        width: 90%;
        text-align: center;
    }

    .modal-close {
        position: absolute;
        top: 10px;
        right: 15px;
        background: none;
        border: none;
        font-size: 2.5rem;
        font-weight: 700;
        color: #1e1e1e;
        cursor: pointer;
        line-height: 1;
        padding: 0;
        transition: transform 0.2s ease;
    }

    .modal-close:hover {
        transform: scale(1.1) rotate(90deg);
    }

    .modal-title {
        font-size: 2rem;
        color: #1e1e1e;
        margin-bottom: 1rem;
    }

    .modal__icon {
        font-size: 4rem;
        margin: 20px;
        text-shadow: 0 0 5px gold;
    }

    .modal-text {
        font-family: "Nunito", sans-serif;
        font-size: 1.6rem;
        color: #555;
        line-height: 1.6;
        font-style: italic;
        font-weight: 600;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity 0.3s ease;
    }
    .fade-enter-from, .fade-leave-to {
        opacity: 0;
    }

    .pop-enter-active, .pop-leave-active {
        transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    .pop-enter-from, .pop-leave-to {
        transform: scale(0.9);
    }
</style>
