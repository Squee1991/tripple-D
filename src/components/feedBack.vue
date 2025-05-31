<template>
    <section class="feedback-section">
        <img class="spellbook-img" src="../../assets/images/spelbook.svg" alt="Книга волшебства"/>

        <form class="spellbook-form" @submit.prevent="onSubmit">
            <h2>📜 Оставь след в книге волшебства</h2>
            <input v-model="name" type="text" class="form-control" placeholder="Твоё имя или никнейм"/>
            <textarea v-model="text" class="form-control" placeholder="Напиши, что думаешь или что хочешь улучшить..."
                      rows="5"></textarea>
            <button type="submit" class="spell-btn">✨ Отправить заклинание</button>
        </form>
    </section>
</template>

<script setup>
import {ref} from 'vue'

const name = ref('')
const text = ref('')

const onSubmit = () => {
    console.log('Заклинание оставил:', name.value, text.value)
    name.value = ''
    text.value = ''
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Kurale&family=Cinzel+Decorative&display=swap');

.feedback-section {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 40px;
    padding: 60px 20px;
    background: url('../../assets/images/spellbook-bg.png') center/cover no-repeat;
    border-radius: 16px;
    flex-wrap: wrap;
}

.spellbook-img {
    max-width: 360px;
    border-radius: 16px;
    transition: transform 0.3s ease;
    box-shadow: 0 0 36px rgba(252, 208, 0, 0.6);
}

.spellbook-img:hover {
    transform: scale(1.02);
}

.spellbook-form {
    background: #fdf3e7;
    border: 2px dashed #a246e4;
    border-radius: 16px;
    box-shadow: 0 0 30px rgba(125, 85, 255, 0.25);
    padding: 30px;
    max-width: 500px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    position: relative;
}

.spellbook-form h2 {
    font-family: 'Cinzel Decorative', serif;
    font-size: 1.8rem;
    font-weight: bold;
    color: #3e2723;
    margin-bottom: 10px;
    line-height: 1.4;
    text-align: left;
    padding-left: 8px;
}

.form-control {
    border: 2px solid #a246e4;
    border-radius: 12px;
    padding: 14px 18px;
    font-size: 16px;
    font-family: 'Kurale', serif;
    background: #fff;
    color: #333;
    outline: none;
    transition: 0.2s ease;
}

.form-control:focus {
    border-color: #5e1d9c;
}

.form-control::placeholder {
    color: #a246e4aa;
}

.spell-btn {
    background: linear-gradient(90deg, #2b668d, #042c47);
    color: #fff;
    font-size: 18px;
    font-family: 'Kurale', serif;
    font-weight: bold;
    padding: 14px;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.spell-btn:hover {
    box-shadow: 0 0 12px rgba(0, 255, 255, 0.3);
    transform: translateY(-2px);
}

@media (max-width: 768px) {
    .feedback-section {
        flex-direction: column;
        text-align: center;
    }

    .spellbook-img {
        max-width: 280px;
    }
}
</style>
