<template>
  <div class="awards__section">
    <VModal
        :visible="showModal"
        :title="modalData.title"
        :img="modalData.icon"
        :text="modalData.text"
        @close="closeAward"
    />
    <!--    <div class="awards__header">-->
    <!--      <h1 class="awards__title">{{ t('awards.title') }}</h1>-->
    <!--      <button @click="questionModal" class="awards__info-btn">-->
    <!--        <img class="awards__question-icon" :src="Question" alt="quest_icon">-->
    <!--      </button>-->
    <!--    </div>-->
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

const sortedAwards = computed(() => {
  // сначала полученные (locked=false), потом закрытые (locked=true)
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
  border-top: 3px solid  #1a1d2b;
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
  font-size: 1.5rem;
  font-weight: 600;
  font-family: "Nunito", sans-serif;
}


.awards__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  background: #4ade80;
  border: 2px solid black;
  padding: 0 20px;
  border-radius: 16px;
  box-shadow: 5px 5px 0 black;
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
  margin-bottom: 0.5rem;
}

.item-name {
  color: var(--titleColor);
  font-weight: bold;
  font-size: 1.1rem;
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
  max-height: calc(100vh - 200px);
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
    font-size: 1.7rem;
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
