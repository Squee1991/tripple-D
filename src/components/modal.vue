<template>
    <transition name="fade">
        <div v-if="visible" class="modal-overlay" @click.self="closeModal">
            <transition name="pop">
                <div v-if="visible" class="modal-container">
                    <button class="modal-close" @click="closeModal">×</button>
                    <div class="modal-content">
                        <h3 class="modal-title">{{ props.title }}</h3>
                        <img class="modal__icon" :src="props.img" alt="">
                        <p class="modal-text"> {{ props.text }}</p>
                    </div>
                </div>
            </transition>
        </div>
    </transition>
</template>

<script setup>
    import {defineProps, defineEmits} from 'vue'
    const emit = defineEmits(['close'])

    const closeModal = () => {
        emit('close')
    }
    const props =  defineProps({
        visible: {
            type: Boolean,
            required: true
        },
        img: {
            type: String
        },
        title: {
            type: String,
        },
        text: {
            type: String
        }
    });



</script>

<style scoped>

    .modal__icon {
        width: 150px;
    }

    .modal-content {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
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
        z-index: 1000;
    }

    .modal-container {
        font-family: 'Fredoka One', cursive;
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

    .modal-text {
        font-family: 'Inter', sans-serif;
        font-size: 1.1rem;
        color: #555;
        line-height: 1.6;
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