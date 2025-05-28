<template>
    <footer class="magic-footer">
        <div class="magic-footer__content">
            <p class="magic-footer__text">
                ✨ Сделано с магией<br>
                📚 Более 500 слов для твоего волшебного пути<br>
                🔮 Сайт для изучения артиклей в немецком языке
            </p>
            <p class="magic-footer__small">© {{ new Date().getFullYear() }} DerDieDas.com</p>
        </div>
    </footer>
</template>

<script setup>
</script>

<style scoped>
.magic-footer {
    padding: 2.5rem 1rem;
    background: rgba(255, 250, 240, 0.85);
    border-top: 4px solid #b08d57;
    box-shadow: 0 -2px 10px #e6cfa1a0;
    text-align: center;
    font-family: 'Kurale', serif;
    color: #3e2723;
}

/* Основной текст */
.magic-footer__text {
    font-size: 1.1rem;
    line-height: 1.8;
    margin-bottom: 1.2rem;
    color: #4a2c6f;
}

/* Мелкий текст */
.magic-footer__small {
    font-size: 0.85rem;
    color: #7a5e99;
}

/* Ссылки (если понадобятся) */
.magic-footer a {
    color: #55a1bf;
}

.magic-footer a:hover {
    text-decoration: underline;
}
</style>
