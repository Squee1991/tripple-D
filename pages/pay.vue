<template>
    <div class="comic-wrapper">
        <h1 class="comic-title">🔥 Подключи суперсилу!</h1>
        <p class="comic-description">
            Получи доступ ко всем функциям платформы: обучение, озвучка, прогресс, онлайн-сражения и многое другое!
        </p>

        <div class="mode-toggle-wrapper">
            <div
                    class="mode-toggle-option"
                    :class="{ 'mode-toggle-option--inactive': plan !== 'monthly' }"
                    @click="plan = 'monthly'"
            >
                📆 Месяц
            </div>
            <div
                    class="mode-toggle-option"
                    :class="{ 'mode-toggle-option--inactive': plan !== 'yearly' }"
                    @click="plan = 'yearly'"
            >
                📅 Год
            </div>
            <div class="mode-toggle-slider" :class="{ 'mode-toggle-slider--local': plan === 'yearly' }"></div>
        </div>

        <div class="subscription-box">
            <h2 class="price">
                {{ plan === 'monthly' ? '1.99€ / месяц' : '1.99€ / год' }}
            </h2>

            <ul class="benefits">
                <li>✅ Онлайн-сражения</li>
                <li>✅ Все режимы обучения</li>
                <li>✅ Озвучка всех слов</li>
                <li>✅ Поддержка разработчиков</li>
                <li>✅ Тесты всех уровней</li>
                <li>✅ Доступ к будущим функциям</li>
            </ul>

            <button
                    v-if="!authStore.isPremium"
                    class="pay-btn"
                    @click="pay"
            >
                Оплатить {{ plan === 'monthly' ? 'за месяц' : 'за год' }}
            </button>
        </div>
    </div>
</template>


<script setup>
import {ref, computed} from 'vue'
import {userAuthStore} from '../store/authStore.js'
import {getStripe} from '@/utils/stripe'

const authStore = userAuthStore()
const plan = ref('monthly')



async function pay() {
    if (!authStore.uid || !authStore.email) {
        alert('Сначала войди в аккаунт')
        return
    }

    const priceId = plan.value === 'monthly'
        ? 'price_1RqDZU0mqXJB1TZDSVvs8yyQ'
        : 'price_yearly_id'

    const response = await $fetch('/api/stripe/checkout', {
        method: 'POST',
        body: {
            userId: authStore.uid,
            email: authStore.email,
            priceId,
        },
    })

    const stripe = await getStripe()
    await stripe.redirectToCheckout({sessionId: response.sessionId})
}


</script>


<style scoped>
.comic-wrapper {
    min-height: 100vh;
    background-color: #fffbea;
    padding: 60px 20px;
    font-family: 'Bangers', cursive;
    text-align: center;
    color: #1e1e1e;
}

.comic-title {
    font-size: 3.5rem;
    color: #e53935;
    text-shadow: 3px 3px 0 #000;
    margin-bottom: 20px;
}

.comic-description {
    font-size: 1.5rem;
    margin-bottom: 40px;
    color: #333;
    max-width: 700px;
    margin-inline: auto;
    font-family: 'Nunito', sans-serif;
}

.subscription-box {
    background: #fff;
    border: 4px solid #000;
    padding: 30px;
    border-radius: 20px;
    box-shadow: 6px 6px 0 #000;
    display: inline-block;
    min-width: 320px;
    max-width: 440px;
    font-family: 'Nunito', sans-serif;
}

.price {
    font-size: 2rem;
    color: #ff5722;
    margin-bottom: 20px;
    font-weight: bold;
}

.benefits {
    text-align: left;
    margin: 0 auto 30px;
    padding-left: 0;
    list-style: none;
}

.benefits li {
    font-size: 1.2rem;
    margin: 12px 0;
    position: relative;
    padding-left: 30px;
}

.benefits li::before {
    content: '💥';
    position: absolute;
    left: 0;
    top: 0;
}

.pay-btn {
    width: 100%;
    background: #81c784;
    color: #1e1e1e;
    font-size: 1.3rem;
    font-weight: bold;
    padding: 14px 24px;
    border: 3px solid #000;
    border-radius: 12px;
    cursor: pointer;
    box-shadow: 4px 4px 0 #000;
    transition: background 0.2s ease, transform 0.1s;
}

.pay-btn:hover {
    background: #66bb6a;
    transform: translateY(-2px);
}


.mode-toggle-wrapper {
    width: 320px;
    display: flex;
    background: #fff;
    border-radius: 16px;
    position: relative;
    margin: 2rem auto;
    box-shadow: 4px 4px 0px #1e1e1e;
    border: 3px solid #1e1e1e;
    overflow: hidden;
    padding: 4px;
}

.mode-toggle-option {
    flex: 1;
    text-align: center;
    padding: 14px 5px;
    cursor: pointer;
    color: #fff;
    font-family: "Nunito", sans-serif;
    font-weight: 700;
    font-size: 1.1rem;
    transition: color 0.4s cubic-bezier(.38, 1.32, .39, 1);
    user-select: none;
    z-index: 1;
}

.mode-toggle-option--inactive {
    color: #1e1e1e;
}

.mode-toggle-slider {
    position: absolute;
    top: 4px;
    left: 4px;
    width: calc(50% - 4px);
    height: calc(100% - 8px);
    background: #1e1e1e;
    border-radius: 12px;
    transition: transform 0.4s cubic-bezier(.38, 1.32, .39, 1);
    z-index: 0;
}

.mode-toggle-slider--local {
    transform: translateX(100%);
}
</style>