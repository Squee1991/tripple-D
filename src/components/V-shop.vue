<template>
  <section class="shop">
    <div class="shop__content">
      <header class="shop__header">
        <div class="shop__title-container">
          <VBanner
              :text="t('shop.title')"
              :icon="ShopIcon"
          />
        </div>
      </header>
      <div class="shop__cards">
        <article
            v-for="card in shopCards"
            :key="card.id"
            class="shop-card"
            :class="card.classes"
        >
          <img v-if="card.hotIcon" class="card__deal-icon" :src="card.hotIcon" alt="HotDeal">
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
<!--                <br>{{t('cardsShop.till')}} {{ formatFreezeDate }}-->
              </span>
            </p>
            <div v-if="card.requiredHats && !card.isOwned" class="shop-card__requirements">
              <span class="shop-req-label">{{t('cardsShop.required')}}</span>
              <div class="shop-req-details">
                <span class="req-title">{{ t(card.rankTitle) }} 3</span>
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
                :class="{ 'is-disabled': card.disabled }"
                :disabled="card.disabled && card.type !== 'permanent'"
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
                  <span v-if="card.id === 'lives'"> / {{t('shopInfoModal.pcs')}}</span>
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
          <h3 class="modal-title">{{ modalTitle }}</h3>
        </div>
        <div class="modal-body">
          <template v-if="modalType === 'success'">
            <p class="modal-desc">
              {{t('cardsShopModal.modal-desc-first')}}<br><br>
              {{t('cardsShopModal.modal-desc-Second')}} <b>{{t('cardsShopModal.modal-desc-Third')}}</b>{{t('cardsShopModal.modal-desc-Four')}}
            </p>
            <img :src="ShieldFreeze" alt="Success" class="success-icon"/>
          </template>
          <template v-else-if="modalType === 'coupon_buy'">
            <p class="modal-desc">{{ t('shopInfoModal.buyDiscount')}} <b>{{ selectedCard.title }}</b>?</p>
            <div class="modal-price-summary">
              <span>{{ t('shopInfoModal.suma')}}</span>
              <div class="price-value">
                <img :src="Articlus" alt="Articlus" class="price-icon-small"/>
                <span>{{ selectedCard.price }}</span>
              </div>
            </div>
          </template>
          <template v-else-if="modalType === 'coupon_error'">
            <div class="modal-desc">
              <div class="modal__sub">{{ t('shopInfoModal.forBuyingPartOne')}}
                <b>{{ selectedCard.title }}</b> {{ t('shopInfoModal.forBuyingPartTwo')}}<br><br></div>
              <div class="error-requirements">
                <div v-if="langStore.points < selectedCard.price" class="error-req-row">
                  <div class="error-req-title">
                     <img :src="Articlus" alt="Articlus" class="price-icon-small"/> {{ selectedCard.price }}
                  </div>
                  <span class="error-req-hint">( {{ selectedCard.price - langStore.points }})</span>
                </div>
                <div v-if="authStore.totalHats < selectedCard.requiredHats" class="error-req-row">
                  <div class="error-req-title">
                     <img :src="GraduateHat" alt="Hat" class="price-icon-small"/> {{ selectedCard.requiredHats }}
                  </div>
                  <span class="error-req-hint">({{ t('shopInfoModal.notEnough')}} {{ selectedCard.requiredHats - authStore.totalHats }})</span>
                </div>
              </div>
            </div>
          </template>
          <template v-else-if="modalType === 'coupon_success' || modalType === 'coupon_owned'">
            <p class="modal-desc">
              <span v-if="modalType === 'coupon_success'"><b>{{ t('shopInfoModal.successBuy')}}</b></span>
<!--              <span v-if="modalType === 'coupon_owned'"><b>Купон уже куплен.</b></span>-->
              <span>{{ t('shopInfoModal.howToUse')}}</span>
            </p>
            <img :src="selectedCard.icon" alt="Success" class="success-icon"/>
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
          <button
              v-for="btn in modalButtons"
              :key="btn.id"
              class="modal-btn"
              :class="btn.class"
              :disabled="btn.disabled"
              @click="btn.action"
          >
            {{ btn.label }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { userlangStore } from '~/store/learningStore.js'
import { userChainStore } from '~/store/chainStore.js'
import { userAuthStore } from '~/store/authStore.js'
import { useRankUserStore } from '~/store/rankStore.js'
import ShopIcon from '../../assets/images/shopping-cart.svg'
import Heart from '../../assets/images/life.svg'
import ShieldFreeze from '../../assets/images/FreezeShield.svg'
import Articlus from '../../assets/images/article.svg'
import Sale from '../../assets/images/save5.svg'
import Sale10 from '../../assets/images/rocket_10.svg'
import GraduateHat from '../../assets/images/graduate-hat.svg'
import HotDeal from '../../assets/images/hot-deal.svg'
import VBanner from "~/src/components/V-banner.vue"

const { t } = useI18n()
const router = useRouter()
const questStore = userChainStore()
const langStore = userlangStore()
const authStore = userAuthStore()
const rankStore = useRankUserStore()

const PRICES = {
  HEART: 10,
  FREEZE_DAY: 10,
  SALE_3: 100,
  SALE_6: 150,
}
const DISCOUNT_REQ_HATS = { 3: 210, 6: 500 }

const showModal = ref(false)
const modalType = ref('freeze')
const quantityToBuy = ref(1)
const selectedCard = ref(null)

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
    {
      id: "time_freeze",
      title: t('cardTime.title'),
      description: t('cardTime.description'),
      icon: ShieldFreeze,
      price: PRICES.FREEZE_DAY,
      type: 'consumable'
    },
    {
      id: "sale_3",
      title: t('cardSales.title3'),
      description: "",
      hotIcon: HotDeal,
      icon: Sale,
      price: PRICES.SALE_3,
      requiredHats: DISCOUNT_REQ_HATS[3],
      type: 'permanent'
    },
    {
      id: "sale_6",
      title: t('cardSales.title6'),
      description: "",
      hotIcon: HotDeal,
      icon: Sale10,
      price: PRICES.SALE_6,
      requiredHats: DISCOUNT_REQ_HATS[6],
      type: 'permanent'
    },
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
    }
    else if (card.id === 'time_freeze') {
      isActive = isFreezeActive.value
      btnLabel = isActive ? t('cardsShop.extend') : t('cardsShop.buy')
    }
    else if (card.type === 'permanent') {
      isOwned = authStore.premiumDiscount?.[card.id] === true
      const hasEnoughHats = authStore.totalHats >= (card.requiredHats || 0)
      const canAffordPoints = langStore.points >= card.price

      if (isOwned) {
        btnLabel = t('shop.bought')
        isDisabled = true
        isActive = hasEnoughHats
      } else {
        isDisabled = !hasEnoughHats || !canAffordPoints
        btnLabel = t('cardsShop.buy')
      }
    }

    const isLevelClaimed = authStore.claimedBonuses?.includes(card.requiredHats)
    if (isLevelClaimed && card.type !== 'consumable') {
      isOwned = true
      btnLabel = "got bonus"
      isDisabled = true
    }

    const classes = {
      'shop-card--owned': isOwned,
      'shop-card--active': isActive,
      'shop-card--locked': (card.requiredHats && authStore.totalHats < card.requiredHats) && !isOwned
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
  selectedCard.value = card

  if (card.type === 'permanent') {
    if (card.isOwned) {
      modalType.value = 'coupon_owned'
    } else if (card.disabled) {
      modalType.value = 'coupon_error'
    } else {
      modalType.value = 'coupon_buy'
    }
    showModal.value = true
    return
  }

  if (card.disabled && !card.isActive) return

  if (card.id === 'lives' || card.id === 'time_freeze') {
    modalType.value = card.id === 'lives' ? 'lives' : 'freeze'
    quantityToBuy.value = 1
    showModal.value = true
  }
}

const isSuccessState = computed(() => modalType.value === 'success' || modalType.value === 'coupon_success')

const maxQuantity = computed(() => {
  if (modalType.value === 'lives') return Math.max(0, Number(questStore.maxLives) - Number(questStore.lives))
  return 30
})

const totalCost = computed(() => {
  if (modalType.value === 'coupon_buy') return selectedCard.value?.price || 0
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

const modalTitle = computed(() => {
  if (modalType.value === 'success') return t('cardsShop.ready')
  if (modalType.value === 'lives') return t('cardsShop.buyLives')
  if (modalType.value === 'freeze') return t('cardsShop.stopTime')
  if (modalType.value === 'coupon_buy') return t('cardsShop.coupon_buy')
  if (modalType.value === 'coupon_error') return t('cardsShop.coupon_error')
  if (modalType.value === 'coupon_success') return t('cardsShop.coupon_success')
  if (modalType.value === 'coupon_owned') return t('cardsShop.coupon_owned')
  return ''
})

const closeModal = () => {
  showModal.value = false
}

const goToPay = () => {
  closeModal()
  router.push('/pay')
}

const modalButtons = computed(() => {
  switch (modalType.value) {
    case 'success':
      return [{ id: 'ok', label: t('cardsShop.accessibly'), class: 'confirm', action: closeModal }]
    case 'coupon_success':
    case 'coupon_owned':
      return [{ id: 'buy_plus', label: t('cardsShop.buyingPlus'), class: 'confirm', action: goToPay }]
    case 'coupon_error':
      return [{ id: 'ok', label: 'ОК', class: 'confirm', action: closeModal }]
    case 'coupon_buy':
    case 'lives':
    case 'freeze':
      return [
        { id: 'cancel', label: t('cardsShop.cancel'), class: 'cancel', action: closeModal },
        { id: 'confirm', label: t('cardsShop.buy'), class: 'confirm', action: confirmPurchase, disabled: !canAfford.value }
      ]
    default:
      return []
  }
})

const updateQuantity = (delta) => {
  const newValue = quantityToBuy.value + delta
  if (newValue >= 1 && newValue <= maxQuantity.value) {
    quantityToBuy.value = newValue
  }
}

const confirmPurchase = async () => {
  if (!canAfford.value) return

  if (modalType.value === 'coupon_buy') {
    langStore.points -= selectedCard.value.price
    langStore.articlesSpentForAchievement += selectedCard.value.price
    await langStore.saveToFirebase()
    await authStore.activateDiscount(selectedCard.value.id)
    modalType.value = 'coupon_success'
    return
  }

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
  font-family: "Nunito", sans-serif;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 84px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.shop__content {
  padding-bottom: 10px;
}

.shop__content::-webkit-scrollbar {
  width: 2px;
  background: transparent;
}

.shop__content::-webkit-scrollbar-track {
  background: transparent;
}

.modal__sub {
  height: 34px;
}

.shop__content::after{
  content: "";
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 50px;
  background: var(--overlayAfter);
}

.shop__header {
  margin-bottom: 15px;
}

.shop__title-container {
  font-size: 40px;
}

.shop__cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 2fr));
  gap: 10px;
}

.shop-card {
  background: var(--cardShopBg);
  border: 2px solid var(--tabsSlideBorderColor);
  box-shadow: 0 2px 0 var(--tabsSlideBorderColor);
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, border-color 0.2s;
  position: relative;
  min-height: 270px;
}

.card__deal-icon {
  width: 67px;
  position: absolute;
  z-index: 11;
  right: -15px;
  top: -5px;
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
  background: var(--cardShopHeadBg);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.shop-card__img {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

.shop-card__status-badge {
  position: absolute;
  top: 5px;
  left: 5px;
  background: #4caf50;
  color: white;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 600;
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
  font-size: 15px;
}

.shop-card__desc {
  color: var(--cardShopDescColor);
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
  color: var(--cardShopDescColor);
  font-size: 12px;
  margin-bottom: 6px;
}

.shop-req-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: rgba(255, 255, 255, 0.05);
  padding: 5px 10px;
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
  width: 25px;
  height: 25px;
}

.shop-card__footer {
  padding: 0 15px 15px 15px;
}

.modal-body {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.shop-card__action-btn {
  width: 100%;
  padding: 8px 3px;
  min-height: 39px;
  border: none;
  border-radius: 24px;
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

.shop-card__action-btn:disabled, .shop-card__action-btn.is-disabled {
  background: var(--cardShopBtnDisabledBg);
  color: #7f8fa4;
  box-shadow: 0 4px 0 var(--cardShopBtnDisabledBg);
  cursor: pointer;
}

.shop-card__action-btn:disabled {
  cursor: not-allowed;
}

.shop-card--owned .shop-card__action-btn {
  background: #4caf50;
  color: white;
  box-shadow: 0 4px 0 #2e7d32;
}

.btn-content {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
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
  z-index: 9000;
  backdrop-filter: blur(4px);
  padding: 20px;
}

.modal-content {
  background: var(--menuItemsBg);
  box-shadow: 0 4px 0 var(--tabsSlideBorderColor);
  border: 2px solid var(--tabsSlideBorderColor);
  border-radius: 20px;
  padding: 24px;
  width: 100%;
  max-width: 360px;
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
  color: var(--titleColor);
  margin: 0;
  font-size: 24px;
  font-weight: 800;
}

.modal-desc {
  color: #a0a6b1;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  text-align: center;
  margin-bottom: 18px;
  line-height: 1.5;
}

.error-requirements {
  display: flex;
  gap: 18px;
  justify-content: center;
  background: var(--tabBg);
  padding: 28px 12px;
  border-radius: 12px;
}

.error-req-row {
  display: flex;
  flex-direction: column;
}

.error-req-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 400;
  color: var(--titleColor);
  font-family: Lilita One, sans-serif;
  font-size: 24px;
}

.error-req-hint {
  font-size: 13px;
  color: #ef5350;
  display: flex;
}

.freeze-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 24px;
  background: var(--tabBg);
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
  color: var(--titleColor);
  font-size: 24px;
  font-weight: 800;
}

.day-label {
  color: var(--titleColor);
  font-size: 12px;
}

.modal-price-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--tabBg);
  padding: 12px 16px;
  border-radius: 12px;
  margin-bottom: 16px;
  color: var(--titleColor);
}

.price-value {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--titleColor);
  font-weight: 800;
  font-size: 18px;
}

.price-icon-small {
  width: 42px;
  height: 42px;
}

.text-red {
  color: #ef5350;
}

.error-msg {
  color: #ef5350;
  text-align: center;
  font-size: 13px;
  font-weight: 900;
  margin-bottom: 12px;
}

.modal-actions {
  display: flex;
  gap: 12px;
}

.modal-btn {
  flex: 1;
  padding: 14px;
  border-radius: 50px;
  border: none;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.1s;
}

.modal-btn.cancel {
  background: transparent;
  border: 1px solid #363d4a;
  color: #a0a6b1;
  box-shadow: 0 6px 0  #363d4a;
}

.modal-btn.confirm {
  background: #f1c40f;
  color: #1c222d;
  box-shadow: 0 6px 0 #c29d0b;
}

.modal-btn.confirm:disabled {
  background: #365ea8;
  box-shadow: 0 6px 0 #2f559a;
  color: #ffffff;
  cursor: not-allowed;
}

.modal-btn:active {
  box-shadow: none;
  transform: translateY(2px);
}

.success-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 25px;
  display: block;
}
</style>