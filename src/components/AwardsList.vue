<template>
  <div class="awards__section">
    <VModal
        :visible="showModal"
        :title="modalData.title"
        :img="modalData.icon"
        :text="modalData.text"
        @close="closeAward"
    />
    <div class="awards__header">
      <h1 class="awards__title">{{ t('awardModal.title') }}</h1>
      <button @click="questionModal" class="awards__info-btn">
        <!--            <img class="awards__question-icon" :src="Question" alt="quest_icon">-->
        <div class="awards__counter cartoon-board">
          <span class="cartoon-board__value">{{ awardsTotalLocked }}</span>
          <span class="cartoon-board__sep">/</span>
          <span class="cartoon-board__total">{{ awardsTotal }}</span>
        </div>
      </button>
    </div>
    <div class="awards__list-scroll">
      <div class="items-grid">
        <div
            v-for="award in sortedAwards"
            class="shop-item"
            :class="{ locked: award.locked }"
        >
          <div class="image-wrapper">
            <img :class="{ locked: award.locked }" :src="award.icon" alt="award" class="item-img"/>
            <div v-if="award.locked" class="locked-overlay">
              <img class="lock" src="../../assets/images/padlock.svg" alt="lock icon">
            </div>
          </div>
          <p class="item-name">{{ t(award.title) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import VModal from '~/src/components/modal.vue'
import AwardIconModal from '../../assets/images/AwardForModal.svg'
import Question from '../../assets/images/question.svg'

const {t} = useI18n()
const props = defineProps({
  awards: {
    type: Array,
    required: true,
  },
})
const awardsTotal = computed(() => props.awards.length)
const awardsTotalLocked = computed(() => props.awards.filter(award => !award.locked).length)
const sortedAwards = computed(() => {
  return [...props.awards].sort((a, b) => Number(a.locked) - Number(b.locked))
})

const modalData = ref({
  title: t('awardModal.title'),
  icon: AwardIconModal,
  text: t('awardModal.description')
})

const questionModal = () => {
  showModal.value = true
}

const showModal = ref(false)
const selectedAward = ref({})

function openAward(award) {
  if (award.locked) return
  selectedAward.value = award
  showModal.value = true
}

function closeAward() {
  showModal.value = false
}
</script>

<style scoped>

.items-grid {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  border-top: 3px solid #1a1d2b;
  padding-bottom: 10px;
  border-radius: 15px;
}

.shop-item {
  padding: 1rem;
  text-align: center;
  display: flex;
  width: 180px;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.awards__title {
  color: var(--titleColor);
  font-size: 1.5rem;
  font-weight: 600;
  font-family: "Nunito", sans-serif;
}

.awards__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 0 20px;
  border-radius: 16px;
}

.item-img.locked {
  opacity: 0.5;
  filter: grayscale(100%);
  position: relative;
}

.lock {
  width: 140px;
}

.image-wrapper {
  position: relative;
  width: 70px;
  margin-bottom: 10px;
}

.locked-overlay {
  position: absolute;
  top: 0;
  right: 0;
  padding: 4px 8px;
  font-size: 1rem;
  font-weight: bold;
  color: #1e1e1e;
}

.item-img {
  object-fit: contain;
  margin-bottom: 0.1rem;
}

.item-name {
  color: var(--titleColor);
  font-weight: bold;
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  background: #fff;
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  max-width: 300px;
  border: 3px solid #1e1e1e;
  box-shadow: 4px 4px 0 #1e1e1e;
  animation: zoomIn 0.2s ease;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 15px;
}

.modal-icon {
  width: 100px;
  height: 100px;
  margin-bottom: 1rem;
}

button {
  font-family: "Nunito", sans-serif;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  border: 2px solid #1e1e1e;
  background: #4ade80;
  box-shadow: 2px 2px 0 #1e1e1e;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  font-size: 1.1rem;
  font-weight: 600;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
  box-shadow: none;
}

.awards__list-scroll {
  max-height: calc(100vh - 310px);
  overflow-y: auto;
  padding-right: 6px;
}

.awards__list-scroll::-webkit-scrollbar {
  width: 10px;
}

.awards__list-scroll::-webkit-scrollbar-thumb {
  background: #1e1e1e;
  border-radius: 10px;
  border: 2px solid #fff;
}

.awards__list-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.awards__counter.cartoon-board {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 36px;
  padding: 0 12px;
  min-width: 82px;
  border-radius: 14px;
  border: 2px solid #000;
  background: #ffffff;
  box-shadow: 4px 4px 0 #000;
  font-family: "Nunito", sans-serif;
  font-weight: 900;
  font-size: 1.05rem;
  line-height: 1;
  user-select: none;
  overflow: hidden;
}

.cartoon-board__value {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  padding: 0 8px;
  border-radius: 10px;
  color: #0b0b0b;
}

.cartoon-board__sep {
  position: relative;
  z-index: 1;
  opacity: 0.65;
  transform: translateY(-1px);
}

.cartoon-board__total {
  position: relative;
  z-index: 1;
  opacity: 0.9;
}

.awards__info-btn:active .awards__counter.cartoon-board {
  transform: translateY(0px);
  box-shadow: 3px 3px 0 #000;
}

@media (max-width: 767px) {
  .awards__counter.cartoon-board {
    height: 34px;
    min-width: 76px;
    font-size: 1rem;
  }
  .cartoon-board__value {
    height: 23px;
    padding: 0 7px;
  }
}

@keyframes zoomIn {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@media (max-width: 767px) {
  .items-grid {
    width: 100%;
  }
  .awards__title {
    font-size: 1.5rem;
  }
  .shop-item {
    width: 160px;
  }
  .item-name {
    font-size: .9rem;
  }
}

.awards__info-btn {
  background: none;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  padding: 10px;
  width: 70px;
  height: 60px;
  box-shadow: none;
}

@media (min-width: 1024px ) {
  .shop-item:hover {
    transform: translateY(-1px);
  }
}
</style>
