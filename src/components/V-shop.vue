<template>
  <section class="shop">
    <header class="shop__header">
      <div class="shop__title-container">
        <h2 class="shop__title">Магазин предметов</h2>
      </div>
      <p class="shop__subtitle">
        Обменивай накопленные Артиклюсы на полезные бонусы и постоянные скидки для своего обучения.
      </p>
    </header>
    <div class="shop__content">
      <div class="shop__cards">
        <article
            v-for="card in shopCards"
            :key="card.id"
            class="shop-card"
            :class="{
              'shop-card--owned': card.btnText === 'Куплено',
              'shop-card--locked': card.disabled && card.btnText !== 'Куплено'
            }"
        >
          <div class="shop-card__preview">
            <img :src="card.icon" :alt="card.alt" class="shop-card__img"/>
            <div v-if="card.btnText === 'Куплено'" class="shop-card__status-badge">Куплено</div>
          </div>

          <div class="shop-card__info">
            <h3 class="shop-card__name">{{ card.title }}</h3>
            <p class="shop-card__desc">{{ card.description }}</p>

            <div v-if="card.requiredHats && card.btnText !== 'Куплено'" class="shop-card__requirements">
              <span class="shop-req-badge">Ранг {{ card.requiredHats }}</span>
            </div>
          </div>

          <footer class="shop-card__footer">
            <button
                class="shop-card__action-btn"
                :disabled="card.disabled"
                @click="onCardAction(card)"
            >
              <div class="btn-content" v-if="card.btnText === 'Купить'">
                <img :src="Articlus" class="btn-price-icon"/>
                <span>{{ card.price }}</span>
              </div>
              <span v-else>{{ card.btnText === 'Полное' ? 'Максимум' : card.btnText }}</span>
            </button>
          </footer>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import {computed} from 'vue'
import {userlangStore} from '~/store/learningStore.js'
import {userChainStore} from '~/store/chainStore.js'
import {userAuthStore} from '~/store/authStore.js'
import Heart from '../../assets/images/life.svg'
import Articlus from '../../assets/images/articlus.png'
import Sale from '../../assets/images/save5.svg'
import Sale10 from '../../assets/images/rocket_10.svg'
import Sale15 from '../../assets/images/hot-air-ballon15.svg'
import GraduateHat from '../../assets/images/graduate-hat.svg'

const questStore = userChainStore()
const langStore = userlangStore()
const authStore = userAuthStore()

const PRICE_PER_HEART = 10

const DISCOUNT_PRICE_ARTICLUS_5 = 30
const DISCOUNT_PRICE_ARTICLUS_10 = 50
const DISCOUNT_PRICE_ARTICLUS_15 = 70

const DISCOUNT_REQ_HATS_5 = 14
const DISCOUNT_REQ_HATS_10 = 25
const DISCOUNT_REQ_HATS_15 = 50

const isMaxHearts = computed(() => Number(questStore.lives) >= Number(questStore.maxLives))
const shopCards = computed(() => [
  {
    id: "lives",
    title: "Жизни",
    description: "Тут можно пополнить запас жизней(Максимально 5)",
    icon: Heart,
    alt: "Heart",
    price: PRICE_PER_HEART,
    currency: "articlus",
    btnText: isMaxHearts.value ? 'Полное' : 'Купить',
    disabled: isMaxHearts.value,
  },
  {
    id: "sale_5",
    title: "Скидка 5%",
    description: "Требования:",
    icon: Sale,
    alt: "Sale_5",
    price: DISCOUNT_PRICE_ARTICLUS_5,
    currency: "articlus",
    requiredHats: DISCOUNT_REQ_HATS_5,
    btnText: authStore.premiumDiscount?.sale_5 ? 'Куплено' : 'Купить',
    btnIcon: GraduateHat,
    disabled:
        authStore.premiumDiscount?.sale_5 === true ||
        authStore.totalHats < DISCOUNT_REQ_HATS_5 ||
        langStore.points < DISCOUNT_PRICE_ARTICLUS_5,
  },
  {
    id: "sale_10",
    title: "Скидка 10%",
    description: "Требования:",
    icon: Sale10,
    alt: "Sale_10",
    price: DISCOUNT_PRICE_ARTICLUS_10,
    currency: "articlus",
    requiredHats: DISCOUNT_REQ_HATS_10,
    btnText: authStore.premiumDiscount?.sale_10 ? 'Куплено' : 'Купить',
    btnIcon: GraduateHat,
    disabled:
        authStore.premiumDiscount?.sale_10 === true ||
        authStore.totalHats < DISCOUNT_REQ_HATS_10 ||
        langStore.points < DISCOUNT_PRICE_ARTICLUS_10,
  },
  {
    id: "sale_15",
    title: "Скидка 15%",
    description: "Требования:",
    icon: Sale15,
    alt: "Sale_15",
    price: DISCOUNT_PRICE_ARTICLUS_15,
    currency: "articlus",
    requiredHats: DISCOUNT_REQ_HATS_15,
    btnText: authStore.premiumDiscount?.sale_15 ? 'Куплено' : 'Купить',
    btnIcon: GraduateHat,
    disabled:
        authStore.premiumDiscount?.sale_15 === true ||
        authStore.totalHats < DISCOUNT_REQ_HATS_15 ||
        langStore.points < DISCOUNT_PRICE_ARTICLUS_15,
  },
])


const onCardAction = async (card) => {
  if (card.disabled) return

  if (card.id === 'lives') {
    if (langStore.points < card.price) return
    langStore.points -= card.price
    await questStore.addLife(1)
    await langStore.saveToFirebase()
    return
  }

  if (card.id.startsWith('sale_')) {
    if (authStore.totalHats < (card.requiredHats ?? 0)) return
    if (langStore.points < card.price) return

    langStore.points -= card.price
    await langStore.saveToFirebase()

    await authStore.activateDiscount(card.id)
  }
}

const buyItem = async (cardId, amount) => {
  const card = shopCards.find(item => item.id === cardId)
  if (!card) return
  const cost = amount * PRICE_PER_HEART
  if (cardId === "lives") {

  }
}
</script>

<style scoped>

.shop {
  min-height: 100vh;
  padding: 10px;
}

.shop__title-container {
  background: #50a2d8;
  border-radius: 12px;
  padding: 15px 10px;
  margin-bottom: 15px;
  text-align: center;
  box-shadow: inset 0 -4px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.shop__title {
  color: white;
  margin: 0;
  font-size: 24px;
  text-transform: none;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.shop__subtitle {
  text-align: center;
  margin: 0 auto 5px;
  padding: 5px;
  color: var(--titleColor);
  font-size: 14px;
  backdrop-filter: blur(8px);
}

.shop__subtitle::after {
  content: '';
  display: inline-block;
  width: 90%;
  height: 2px;
  background: #50a2d8
}

@media (max-width: 767px) {
  .shop__subtitle {
    font-size: 15px;
    padding: 0 5px;
  }
}

.shop__cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(175px, 1fr));
  gap: 10px;
  overflow-y: auto;
  max-height: calc(100vh - 250px);
}

.shop__cards::-webkit-scrollbar {
  width: 10px;
}

.shop__cards::-webkit-scrollbar-thumb {
  background: var(--titleColor);
  border-radius: 5px;
  border: 2px solid #fff;
}

.shop__cards::-webkit-scrollbar-track {
  background: transparent;
}

.shop-card {
  background: #1c222d;
  border: 2px solid #363d4a;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s;
}

.shop-card:hover {
  border-color: #50a2d8;
}

.shop-card__preview {
  padding: 15px;
  background: #2a313e;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-bottom: 2px solid #363d4a;
}

.shop-card__img {
  width: 60px;
  height: 60px;
  object-fit: contain;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

.shop-card__status-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #4caf50;
  color: white;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: bold;
}

.shop-card__info {
  padding: 15px;
  flex-grow: 1;
  text-align: left;
}

.shop-card__name {
  color: white;
  margin: 0 0 8px 0;
  font-size: 16px;
}

.shop-card__desc {
  color: #a0a6b1;
  font-size: 13px;
  line-height: 1.4;
  margin: 0;
}

.shop-card__requirements {
  margin-top: 10px;
}

.shop-req-badge {
  background: rgba(255, 255, 255, 0.1);
  color: #ffd04b;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  border: 1px solid rgba(255, 208, 75, 0.3);
}

.shop-card__footer {
  padding: 15px;
}

.shop-card__action-btn {
  width: 100%;
  padding: 3px;
  border: none;
  border-radius: 12px;
  background: #f1c40f;
  color: var(--titleColor);
  font-weight: 800;
  font-size: 15px;
  cursor: pointer;
  box-shadow: 0 4px 0 #c29d0b;
  transition: all 0.1s;
}

.shop-card__action-btn:active {
  box-shadow: 0 0 0 #c29d0b;
  transform: translateY(4px);
}

.shop-card__action-btn:disabled {
  background: #363d4a;
  color: var(--titleColor);
  box-shadow: 0 4px 0 #252a33;
  cursor: not-allowed;
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-price-icon {
  width: 23px;
  height: 23px;
}

.shop-card--owned {
  border-color: #4caf50;
}

.shop-card--owned .shop-card__action-btn {
  background: #4caf50;
  color: white;
  box-shadow: 0 4px 0 #2e7d32;
}

@media (min-width: 1024px) {
  .shop-card:hover {
    border-color: #50a2d8;
  }
}

@media (max-width: 1023px) {
  .shop__title-container {
    padding: 10px;
  }
  .shop__title {
    font-size: 22px;
  }
}
</style>




