<template>
    <div class="idiom-container">
        <div class="comic-frame">
            <h3>📚 Фразеологизм дня</h3>
            <div class="speech-bubble">
                <p class="idiom-title">🐾 Da liegt der Hund begraben</p>
                <button @click="show = !show" class="comic-btn">
                    {{ show ? 'Скрыть значение' : 'Показать значение' }}
                </button>
                <div v-if="show" class="idiom-details">
                    <p><strong>🧠 Значение:</strong> Вот где зарыта собака (в этом суть)</p>
                    <p><strong>💬 Пример:</strong> Er versteht es nicht – da liegt der Hund begraben!</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    const show = ref(false)
</script>

<style scoped>

    .idiom-container {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2rem;
        /*background: repeating-linear-gradient(*/
        /*        45deg,*/
        /*        #fef6e4,*/
        /*        #fef6e4 10px,*/
        /*        #fff2c6 10px,*/
        /*        #fff2c6 20px*/
        /*);*/
        min-height: 100vh;
        font-family: 'Comic Sans MS', 'Fredoka', sans-serif;
    }

    .comic-frame {
        border: 6px double #ff6b00;
        background: #fffbe6;
        border-radius: 24px;
        box-shadow: 8px 8px 0px #ff6b00;
        padding: 2rem;
        max-width: 600px;
        width: 100%;
        position: relative;
    }

    .speech-bubble {
        background: #ffffff;
        border: 4px dashed #ffb347;
        border-radius: 20px;
        padding: 1.5rem;
        position: relative;
        box-shadow: 4px 4px 0px #ffa500;
    }

    .speech-bubble::after {
        content: '';
        position: absolute;
        bottom: -20px;
        left: 40px;
        width: 0;
        height: 0;
        border: 20px solid transparent;
        border-top-color: #ffffff;
    }

    h3 {
        font-size: 1.6rem;
        text-align: center;
        color: #d94c00;
        margin-bottom: 1rem;
        text-shadow: 1px 1px 0 #fff;
    }

    .idiom-title {
        font-size: 1.3rem;
        font-weight: bold;
        color: #333;
        background: #fff2c6;
        border-left: 6px solid #ff8c00;
        padding: 0.5rem 1rem;
        border-radius: 12px;
        margin-bottom: 1rem;
    }

    .comic-btn {
        background-color: #ffb347;
        border: 3px solid #ff6b00;
        border-radius: 10px;
        padding: 0.5rem 1rem;
        font-weight: bold;
        color: #fff;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 1rem;
        box-shadow: 2px 2px 0px #ff6b00;
    }

    .comic-btn:hover {
        background-color: #ff9234;
        box-shadow: none;
    }

    .idiom-details {
        margin-top: 1rem;
        background: #fff9dd;
        padding: 1rem;
        border: 2px dashed #ffa726;
        border-radius: 12px;
        font-size: 0.95rem;
    }
</style>
