<template>
  <section class="shop">
    <header class="shop__header">
      <h2 class="shop__title">Магазин</h2>
    </header>

    <div class="shop__content">
      <div class="shop__cards">
        <article
            v-for="card in shopCards"
            :key="card.id"
            class="shop__card"
        >
          <div class="shop-card__name">{{ card.title }}</div>

          <div class="shop-card__content">
            <div class="shop-card__img-wrap">
              <img :src="card.icon" :alt="card.alt" class="shop-card__img"/>
            </div>
            <div class="shop__card-description">
              {{ card.description }}
            </div>

            <div class="shop-card__bottom">
              <div class="shop-card__info">
                <img
                    v-if="card.currency === 'articlus'"
                    :src="Articlus"
                    alt="articlus"
                    class="shop-card__price-icon"
                />
                <span class="shop-card__price-value">{{ card.price }}</span>
              </div>
              <button
                  class="shop-card__buy"
                  :class="{ 'shop-card__buy--disabled': card.disabled }"
                  :disabled="card.disabled"
                  @click="onCardAction(card)"
              >
                <span>{{ card.btnText }}</span>

              </button>
            </div>
          </div>


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
import Sale from '../../assets/images/sale.svg'
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
    description: "Покупка жизни ,поможет вам продолжить обучение даже если они закончились",
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
    description: "Для покупки необходимо звание, не ниже Студент Ранг 3",
    icon: Sale,
    alt: "Sale_5",
    price: DISCOUNT_PRICE_ARTICLUS_5, // ✅ цена в артиклюсах
    currency: "articlus",
    requiredHats: DISCOUNT_REQ_HATS_5, // ✅ условие по конфеткам
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
    description: "Для покупки необходимо звание, не ниже Исследователь Ранг 3",
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
    description: "Для покупки необходимо звание, не ниже Магистр Ранг 3",
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
.shop__header {
  padding: 12px 14px;
}

.shop__title {
  margin: 0;
  padding: 10px;
  background:green;
  border-radius: 10px;
  box-shadow: 0 2px yellow;
  font-weight: 900;
  font-size: 22px;
  letter-spacing: 0.2px;
  color: var(--titleColor);
}

.shop__content {
  padding: 0 14px 14px;
}

.shop__cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
}

.shop__card {
  max-width: 220px;
  min-height: 230px;
  display: flex;
  flex-direction: column;
  background: #fff;
  margin-right: 20px;
  border-radius: 14px;
  border: 2px solid #000;
  box-shadow: 3px 3px 0 #000;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
  overflow: hidden;
}

.shop-card__name {
  color: white;
  font-size: 18px;
  font-weight: 600;
  font-family: "Nunito", sans-serif;
  margin-bottom: 10px;
  text-align: center;
  background: #415de4;
  padding: 5px;
}

.shop-card__img-wrap {
  width: 96px;
  height: 96px;
  margin: 0 auto 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.shop-card__img {
  width: 70px;
  height: 70px;
  object-fit: contain;
}

.shop-card__bottom {
  margin-top: auto;
  display: flex;
  justify-content: center;
  gap: 5px;
}


.shop-card__buy {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 5px 12px;
  width: 100%;
  line-height: 1;
  white-space: nowrap;
  border-radius: 9px;
  border: 2px solid #e69848;
  box-shadow: 0 4px 0 #b8631c;
  background: linear-gradient(to bottom, #e69848 0%, #b8631c 100%);
  color: white;
  font-weight: 900;
}

.shop-card__buy--disabled,
.shop-card__buy:disabled {
  cursor: not-allowed;
  filter: grayscale(0.1);
}


.shop-card__price-icon {
  width: 22px;
  height: 22px;
}

.shop__card-description {
  text-align: center;
  font-size: 14px;
  height: 60px;
  margin-bottom: 20px;
}

.shop-card__info {
  display: flex;
  position: relative;
  justify-content: end;
  width: 70px;
  padding: 2px 8px;
  border-radius: 10px;
  background: #9B8CFF;
  border: 2px solid #9B8CFF;
  box-shadow: 0px 4px #4837bc;
}

.shop-card__price-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
}

.shop-card__content {
  padding: 0 10px 15px 10px;
}
</style>
