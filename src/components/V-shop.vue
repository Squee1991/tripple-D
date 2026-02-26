<template>
  <section class="shop">
    <header class="shop__header">
      <div class="shop__title-container">
        <h2 class="shop__title">{{ t('shop.title') }}</h2>
      </div>
      <p class="shop__subtitle">{{ t('shop.subText') }}</p>
    </header>
    <div class="shop__content">
      <div class="shop__cards">
        <article
            v-for="card in shopCards"
            :key="card.id"
            class="shop-card"
            :class="card.classes"
        >
          <div class="shop-card__preview">
            <img :src="card.icon" :alt="card.id" class="shop-card__img"/>
            <div v-if="card.isOwned" class="shop-card__status-badge">{{ t('shop.bought')}}</div>
            <div v-else-if="card.isActive" class="shop-card__status-badge shop-card__status-badge--freeze">{{ t('cardsShop.active')}}</div>
          </div>
          <div class="shop-card__info">
            <h3 class="shop-card__name">{{ card.title }}</h3>
            <p class="shop-card__desc">
              {{ card.description }}
              <span v-if="card.isActive" class="freeze-date">
                <br>{{t('cardsShop.till')}} {{ formatFreezeDate }}
              </span>
            </p>
            <div v-if="card.requiredHats && !card.isOwned" class="shop-card__requirements">
              <span class="shop-req-label">{{t('cardsShop.required')}}</span>
              <div class="shop-req-details">
                <span class="req-title">{{ card.rankTitle }} 3</span>
                <div class="req-count">
                  <img :src="GraduateHat" alt="Hat" class="req-icon"/>
                  <span>{{ card.requiredHats }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="shop-card__footer">
            <button
                class="shop-card__action-btn"
                :disabled="card.disabled"
                @click="onCardAction(card)"
            >
              <span v-if="card.isOwned || card.isMaxLimit">
                {{ card.btnLabel }}
              </span>
              <div v-else class="btn-content">
                <template v-if="card.id === 'time_freeze'">
                  <span>{{ card.btnLabel }}</span>
                </template>
                <template v-else>
                  <img :src="Articlus" alt="price" class="btn-price-icon"/>
                  <span>{{ card.price }}</span>
                  <span v-if="card.id === 'lives'"> / шт</span>
                </template>
              </div>
            </button>
          </div>
        </article>
      </div>
    </div>
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content" :class="{'modal-content--success': isSuccessState}">
        <div class="modal-header">
          <h3 class="modal-title">
            <span v-if="isSuccessState">{{ t('cardsShop.ready')}}</span>
            <span v-else-if="modalType === 'lives'">{{ t('cardsShop.buyLives')}}</span>
            <span v-else>{{ t('cardsShop.stopTime')}}</span>
          </h3>
        </div>
        <div class="modal-body">
          <template v-if="isSuccessState">
            <p class="modal-desc">
              {{t('cardsShopModal.modal-desc-first')}}<br><br>
              {{t('cardsShopModal.modal-desc-Second')}} <b>{{t('cardsShopModal.modal-desc-Third')}}</b>{{t('cardsShopModal.modal-desc-Four')}}
            </p>
            <img :src="ShieldFreeze" alt="Success" class="success-icon"/>
          </template>
          <template v-else>
            <p class="modal-desc">
              <template v-if="modalType === 'lives'">
                {{t('cardsShop.have')}} {{ questStore.lives }} {{t('cardsShop.from')}} {{ questStore.maxLives }} {{t('cardsShop.lives')}}
              </template>
              <template v-else>
                {{t('cardsShop.selectDaysPeriod')}}
              </template>
            </p>
            <div class="freeze-selector">
              <button class="selector-btn" @click="updateQuantity(-1)">−</button>
              <div class="selector-value">
                <span class="day-count">{{ quantityToBuy }}</span>
                <span class="day-label">{{ quantityLabel }}</span>
              </div>
              <button class="selector-btn" @click="updateQuantity(1)">+</button>
            </div>
            <div class="modal-price-summary">
              <span>{{t('cardsShop.toPayment')}}</span>
              <div class="price-value">
                <img :src="Articlus" alt="Articlus" class="price-icon-small"/>
                <span :class="{'text-red': !canAfford}">{{ totalCost }}</span>
              </div>
            </div>
            <div v-if="!canAfford" class="error-msg">{{t('cardsShop.notEnough')}}</div>
          </template>
        </div>
        <div class="modal-actions">
          <button v-if="isSuccessState" class="modal-close-btn" @click="closeModal">{{t('cardsShop.accessibly')}}</button>
          <template v-else>
            <button class="modal-btn cancel" @click="closeModal">{{t('cardsShop.cancel')}}</button>
            <button class="modal-btn confirm" :disabled="!canAfford" @click="confirmPurchase">{{t('cardsShop.buy')}}</button>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import {computed, ref} from 'vue'
import {userlangStore} from '~/store/learningStore.js'
import {userChainStore} from '~/store/chainStore.js'
import {userAuthStore} from '~/store/authStore.js'
import {useRankUserStore} from '~/store/rankStore.js'

import Heart from '../../assets/images/life.svg'
import ShieldFreeze from '../../assets/images/FreezeShield.svg'
import Articlus from '../../assets/images/articlus.png'
import Sale from '../../assets/images/save5.svg'
import Sale10 from '../../assets/images/rocket_10.svg'
import Sale15 from '../../assets/images/hot-air-ballon15.svg'
import GraduateHat from '../../assets/images/graduate-hat.svg'

const {t} = useI18n()
const questStore = userChainStore()
const langStore = userlangStore()
const authStore = userAuthStore()
const rankStore = useRankUserStore()

const PRICES = {
  HEART: 10,
  FREEZE_DAY: 10,
  SALE_5: 30,
  SALE_10: 50,
  SALE_15: 70
}
const DISCOUNT_REQ_HATS = {5: 40, 10: 130, 15: 270}

const showModal = ref(false)
const modalType = ref('freeze')
const quantityToBuy = ref(1)

const isMaxHearts = computed(() => Number(questStore.lives) >= Number(questStore.maxLives))
const isFreezeActive = computed(() => authStore.isFreezeActive)
const formatFreezeDate = computed(() => {
  if (!authStore.freezeEndsAt) return ''
  return new Date(authStore.freezeEndsAt).toLocaleDateString()
})

const shopCards = computed(() => {
  const cardsData = [
    {
      id: "lives",
      title: t('cardLives.title'),
      description: t('cardLives.description'),
      icon: Heart,
      price: PRICES.HEART,
      type: 'consumable'
    },
    // {
    //   id: "time_freeze",
    //   title: t('cardTime.title'),
    //   description: t('cardTime.description'),
    //   icon: ShieldFreeze,
    //   price: PRICES.FREEZE_DAY,
    //   type: 'consumable'
    // },
    // {
    //   id: "sale_5",
    //   title: t('cardSales.title5'),
    //   description: "",
    //   icon: Sale,
    //   price: PRICES.SALE_5,
    //   requiredHats: DISCOUNT_REQ_HATS[5],
    //   type: 'permanent'
    // },
    // {
    //   id: "sale_10",
    //   title: t('cardSales.title10'),
    //   description: "",
    //   icon: Sale10,
    //   price: PRICES.SALE_10,
    //   requiredHats: DISCOUNT_REQ_HATS[10],
    //   type: 'permanent'
    // },
    // {
    //   id: "sale_15",
    //   title:  t('cardSales.title15'),
    //   description: "",
    //   icon: Sale15,
    //   price: PRICES.SALE_15,
    //   requiredHats: DISCOUNT_REQ_HATS[15],
    //   type: 'permanent'
    // },
  ]
  return cardsData.map(card => {
    let isOwned = false
    let isActive = false
    let isDisabled = false
    let btnLabel = t('cardsShop.buy')
    let isMaxLimit = false
    let rankTitle = ''
    if (card.requiredHats) {
      rankTitle = rankStore.getRankTitleByHats(card.requiredHats)
    }
    if (card.id === 'lives') {
      isMaxLimit = isMaxHearts.value
      isDisabled = isMaxLimit
      btnLabel = isMaxLimit ? t('cardsShop.maximum') : t('cardsShop.buy')
    } else if (card.id === 'time_freeze') {
      isActive = isFreezeActive.value
      btnLabel = isActive ?  t('cardsShop.extend') : t('cardsShop.buy')
    } else if (card.type === 'permanent') {
      isOwned = authStore.premiumDiscount?.[card.id] === true
      const notEnoughHats = authStore.totalHats < (card.requiredHats || 0)
      const notEnoughPoints = langStore.points < card.price
      if (isOwned) {
        btnLabel = t('shop.bought')
        isDisabled = true
      } else {
        isDisabled = notEnoughHats || notEnoughPoints
      }
    }
    const classes = {
      'shop-card--owned': isOwned,
      'shop-card--active': isActive,
      'shop-card--locked': isDisabled && !isOwned && !isMaxLimit
    }
    return {
      ...card,
      isOwned,
      isActive,
      isDisabled,
      disabled: isDisabled,
      btnLabel,
      isMaxLimit,
      classes,
      rankTitle
    }
  })
})

const onCardAction = async (card) => {
  if (card.disabled && !card.isActive) return
  if (card.id === 'lives' || card.id === 'time_freeze') {
    modalType.value = card.id === 'lives' ? 'lives' : 'freeze'
    quantityToBuy.value = 1
    showModal.value = true
    return
  }

  if (card.type === 'permanent') {
    langStore.points -= card.price
    langStore.articlesSpentForAchievement += card.price
    await langStore.saveToFirebase()
    await authStore.activateDiscount(card.id)
  }
}
const isSuccessState = computed(() => modalType.value === 'success')
const maxQuantity = computed(() => {
  if (modalType.value === 'lives') return Math.max(0, Number(questStore.maxLives) - Number(questStore.lives))
  return 30
})

const totalCost = computed(() => {
  const price = modalType.value === 'lives' ? PRICES.HEART : PRICES.FREEZE_DAY
  return quantityToBuy.value * price
})

const canAfford = computed(() => langStore.points >= totalCost.value)

const quantityLabel = computed(() => {
  const count = quantityToBuy.value;
  const lastTwo = count % 100;
  const last = count % 10;
  const isLives = modalType.value === 'lives';
  let suffix = '';
  if (lastTwo >= 11 && lastTwo <= 14) {
    suffix = 'Third';
  } else if (last === 1) {
    suffix = 'First';
  } else if (last >= 2 && last <= 4) {
    suffix = 'Second';
  } else {
    suffix = 'Third';
  }
  const key = isLives ? `shopDaysRaw.life${suffix}` : `shopDaysRaw.day${suffix}`;
  return t(key);
});

const closeModal = () => {
  showModal.value = false
}

const updateQuantity = (delta) => {
  const newValue = quantityToBuy.value + delta
  if (newValue >= 1 && newValue <= maxQuantity.value) {
    quantityToBuy.value = newValue
  }
}

const confirmPurchase = async () => {
  if (!canAfford.value) return

  langStore.points -= totalCost.value
  langStore.articlesSpentForAchievement += totalCost.value
  await langStore.saveToFirebase()

  if (modalType.value === 'lives') {
    await questStore.addLife(quantityToBuy.value)
    closeModal()
  } else if (modalType.value === 'freeze') {
    await authStore.activateFreeze(quantityToBuy.value)
    modalType.value = 'success'
  }
}

</script>

<style scoped>
.shop {
  min-height: 100vh;
  padding: 10px;
  font-family: "Nunito", sans-serif;
}

.shop__content {
  overflow-y: auto;
  max-height: calc(100vh - 215px);
}

.shop__content::-webkit-scrollbar {
  width: 10px;
}

.shop__content::-webkit-scrollbar-thumb {
  background: #1e1e1e;
  border-radius: 10px;
  border: 2px solid #fff;
}

.shop__content::-webkit-scrollbar-track {
  background: transparent;
}

.shop__title-container {
  background: #50a2d8;
  border-radius: 12px;
  padding: 15px 20px;
  margin-bottom: 10px;
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
  font-weight: 700;
}

.shop__subtitle {
  text-align: center;
  color: var(--titleColor);
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 10px;
}

.shop__cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
}

.shop-card {
  background: #1c222d;
  border: 2px solid #363d4a;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, border-color 0.2s;
  position: relative;
  min-height: 280px;
}

.shop-card:hover {
  border-color: #50a2d8;
}

.shop-card--active {
  border-color: #3498db;
  box-shadow: 0 0 12px rgba(52, 152, 219, 0.2);
}

.shop-card--owned {
  border-color: #4caf50;
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

.shop-card__status-badge--freeze {
  background: #3498db;
}

.shop-card__info {
  padding: 15px;
  flex-grow: 1;
  text-align: left;
  display: flex;
  flex-direction: column;
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

.freeze-date {
  color: #3498db;
  font-weight: 700;
  display: block;
  margin-top: 4px;
}

.shop-card__requirements {
  padding-top: 10px;
}
.shop-req-label {
  display: block;
  color: #a0a6b1;
  font-size: 12px;
  margin-bottom: 6px;
}

.shop-req-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;

  background: rgba(255, 255, 255, 0.05);
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid rgba(255, 208, 75, 0.2);
}

.req-title {
  color: #ffd04b;
  font-weight: 700;
  font-size: 12px;
  text-transform: uppercase;
}

.req-count {
  display: flex;
  align-items: center;
  gap: 6px;
  color: white;
  font-weight: 700;
  font-size: 13px;
}

.req-icon {
  width: 20px;
  height: 20px;
}

.shop-card__footer {
  padding: 15px;
}

.modal-body {
  height: 250px;
}

.shop-card__action-btn {
  width: 100%;
  padding: 8px 3px;
  min-height: 39px;
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
  color: #7f8fa4;
  box-shadow: 0 4px 0 #252a33;
  cursor: not-allowed;
}

.shop-card--owned .shop-card__action-btn {
  background: #4caf50;
  color: white;
  box-shadow: 0 4px 0 #2e7d32;
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  padding: 20px;
}

.modal-content {
  background: #1c222d;
  border: 2px solid #50a2d8;
  border-radius: 20px;
  padding: 24px;
  width: 100%;
  max-width: 360px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.3s ease-out;
}

.modal-content--success {
  border-color: #4caf50;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  text-align: center;
  margin-bottom: 12px;
}

.modal-title {
  color: white;
  margin: 0;
  font-size: 20px;
  font-weight: 800;
}

.modal-desc {
  color: #a0a6b1;
  font-size: 14px;
  text-align: center;
  margin-bottom: 24px;
  line-height: 1.5;
}

.freeze-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 24px;
  background: #2a313e;
  padding: 10px;
  border-radius: 12px;
}

.selector-btn {
  background: #363d4a;
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.selector-btn:hover {
  background: #50a2d8;
}

.selector-value {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 60px;
}

.day-count {
  color: white;
  font-size: 24px;
  font-weight: 800;
}

.day-label {
  color: #a0a6b1;
  font-size: 12px;
}

.modal-price-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #252a33;
  padding: 12px 16px;
  border-radius: 12px;
  margin-bottom: 16px;
  color: #a0a6b1;
}

.price-value {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  font-weight: 800;
  font-size: 18px;
}

.price-icon-small {
  width: 20px;
  height: 20px;
}

.text-red {
  color: #ef5350;
}

.error-msg {
  color: #ef5350;
  text-align: center;
  font-size: 13px;
  margin-bottom: 12px;
}

.modal-actions {
  display: flex;
  gap: 12px;
}

.modal-btn, .modal-close-btn {
  flex: 1;
  padding: 12px;
  border-radius: 12px;
  border: none;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
}

.modal-btn.cancel {
  background: transparent;
  border: 2px solid #363d4a;
  color: #a0a6b1;
}

.modal-btn.confirm, .modal-close-btn {
  background: #f1c40f;
  color: #1c222d;
  box-shadow: 0 4px 0 #c29d0b;
}

.modal-btn.confirm:disabled {
  background: #363d4a;
  color: #555;
  box-shadow: none;
  cursor: not-allowed;
}

.modal-btn.confirm:active, .modal-close-btn:active {
  box-shadow: none;
  transform: translateY(2px);
}

.success-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 15px;
  display: block;
}
</style>