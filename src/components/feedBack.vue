<template>
    <section class="magic-book-section">
        <img
                class="magic-book-img"
                src="../../assets/images/spelbook.svg"
                alt="Книга волшебства"
        />

        <form class="magic-book-form" @submit.prevent="onSubmit">
            <h2>📜 Оставь след в книге волшебства</h2>

            <input
                    v-model="name"
                    type="text"
                    class="form-control"
                    placeholder="Твоё имя или никнейм"
            />

            <textarea
                    v-model="text"
                    class="form-control"
                    placeholder="Напиши, что думаешь или что хочешь улучшить..."
                    rows="5"
            ></textarea>

            <button type="submit" class="btn-spell">
                ✨ Отправить заклинание
            </button>
        </form>
    </section>
</template>

<script setup>
import {ref} from 'vue'

// фиксируем значение полей, чтобы форму можно было потом подключить к API
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

/* Корневой контейнер */
.magic-book-section {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 40px;
    padding: 60px 20px;
    background: rgba(255, 250, 240, 0.85);
    border: 4px solid #b08d57;
    border-radius: 16px;
    box-shadow: 0 0 20px #e6cfa1aa;
}

/* Картинка книги */
.magic-book-img {
    flex: 1;
    max-width: 360px;
    border-radius: 16px;
    box-shadow: 0 0 24px rgba(252, 208, 0, 0.6);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.magic-book-img:hover {
    transform: scale(1.02);
    box-shadow: 0 0 36px rgba(252, 208, 0, 0.8);
}

/* Форма */
.magic-book-form {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 500px;
}

/* Заголовок */
.magic-book-form h2 {
    font-family: 'Cinzel Decorative', serif;
    font-size: 28px;
    color: #3e2723;
    margin: 0;
}

/* Общие стили полей */
.form-control {
    width: 100%;
    padding: 14px 18px;
    border: 2px solid #55a1bf;
    border-radius: 12px;
    background: #fff;
    font-size: 16px;
    font-family: 'Kurale', serif;
    color: #333;
    outline: none;
    transition: border-color 0.2s;
}

.form-control::placeholder {
    color: #55a1bf;
}

.form-control:focus {
    border-color: #5e1d9c;
}

/* Кнопка */
.btn-spell {
    padding: 16px;
    background: linear-gradient(90deg, #55a1bf, #004466);
    box-shadow: 0 0 12px #00ffff44;
    color: #fff;
    font-size: 18px;
    font-family: 'Kurale', serif;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
}

.btn-spell:hover {
    transform: translateY(-2px);
    background: radial-gradient(circle, #55a1bf, #004466);
}

/* Адаптив */
@media (max-width: 768px) {
    .magic-book-section {
        flex-direction: column;
        padding: 40px 10px;
    }

    .magic-book-img {
        max-width: 280px;
    }
}
</style>