<template>
  <VOnboardingWrapper
      v-if="userAuth.uid && showOnboarding"
      ref="wrapperRef"
      :options="onboardingOptions"
      :steps="onboardingSteps"
  >
    <template #default="{ exit, step, previous, next, isFirst, isLast }">
      <VOnboardingStep>
        <div class="hd__wrapper">
          <div class="hd__content">
            <!-- <img class="hd" v-if="step.content.image" :src="step.content.image" alt="Onboarding Image" /> -->
            <div>
              <h2 class="hd__title" v-if="step.content.title">
                {{ t(step.content.title) }}
              </h2>
              <p class="hd__desc" v-if="step.content.description">
                {{ t(step.content.description) }}
              </p>
            </div>
          </div>
          <div class="onboarding-actions">
            <button class="close__hd" @click="finishOnboarding">X</button>
            <button class="hd__button" v-if="!isFirst" @click="previous">
              {{ t('stepHitSettings.back')}}
            </button>
            <button class="hd__button next" v-if="!isLast" @click="next">
              {{ t('stepHitSettings.further')}}
            </button>
            <button class="hd__button next" v-if="isLast" @click="finishOnboarding">
              {{ t('stepHitSettings.end')}}
            </button>
          </div>
        </div>
      </VOnboardingStep>
    </template>
  </VOnboardingWrapper>
</template>

<script setup>
import { VOnboardingWrapper, VOnboardingStep, useVOnboarding } from 'v-onboarding'
import 'v-onboarding/dist/style.css'
import {ref, computed, watch, onMounted, onBeforeUnmount, nextTick,} from 'vue'
import { userAuthStore } from '@/store/authStore'
import { useBreakPointsStore } from '@/store/breakPointsStore'
import HD from '@/assets/images/HD.svg'
const emit = defineEmits(['close'])
const wrapperRef = ref(null)
const { start, finish, exit } = useVOnboarding(wrapperRef)
const { t } = useI18n()
const userAuth = userAuthStore()
const bp = useBreakPointsStore()
const windowWidth = ref(0)

const updateWidth = () => {
  if (typeof window !== 'undefined') {
    windowWidth.value = window.innerWidth
  }
}

const showOnboarding = computed(() => {
  const localFlag = userAuth.uid ? localStorage.getItem(`onboardingPassed_${userAuth.uid}`) === 'true' : false
  return (
      windowWidth.value >= 1023 &&
      !!userAuth.uid &&
      !userAuth.hasSeenOnboarding &&
      !localFlag
  )
})

const finishOnboarding = async () => {
  await userAuth.setHasSeenOnboarding(true)
  finish()
  exit()
  emit('close')
}

const onboardingOptions = {
  skippable: true,
  overlay: {
    enabled: false,
    padding: 0,
    borderRadius: 12,
  },
  labels: {
    previousButton: t('stepHitSettings.back'),
    nextButton: t('stepHitSettings.further'),
    finishButton: t('stepHitSettings.end'),
    skipButton: t('stepHitSettings.skip')
  },
}

const onboardingSteps = [
  {
    attachTo: {
      element: '#learn',
      padding: 31,
    },
    content: {
      title: t('stepHitLabels.learnTitle'),
      description: t('stepHitLabels.learnDescription'),
      image: HD,
    },
  },
  {
    attachTo: {
      element: '#duel',
    },
    content: {
      title: t('stepHitLabels.duelTitle'),
      description: t('stepHitLabels.duelDescription'),
      image: HD,
    },
  },
  {
    attachTo: {
      element: '#test',
    },
    content: {
      title: t('stepHitLabels.testTitle'),
      description: t('stepHitLabels.testDescription'),
      image: HD,
    },
  },
  {
    attachTo: {
      element: '#events',
    },
    content: {
      title: t('stepHitLabels.eventTitle'),
      description: t('stepHitLabels.eventDescription'),
      image: HD,
    },
  },
  {
    attachTo: {
      element: '#articlus',
      padding: 16,
    },
    content: {
      title: t('stepHitLabels.articleTitle'),
      description: t('stepHitLabels.articleDescription'),
    },
  },
  {
    attachTo: {
      element: '#level',
      padding: 16,
    },
    content: {
      title: t('stepHitLabels.levelTitle'),
      description: t('stepHitLabels.levelDescription'),
    },
  },
  {
    attachTo: {
      element: '#stats',
      padding: 16,
    },
    content: {
      title: t('stepHitLabels.statsTitle'),
      description: t('stepHitLabels.statsDescription'),
    },
  },
  {
    attachTo: {
      element: '#achievement',
      padding: 16,
    },
    content: {
      title: t('stepHitLabels.achievementsTitle'),
      description: t('stepHitLabels.achievementsDescription'),
    },
  },
  {
    attachTo: {
      element: '#ranked',
      padding: 16,
    },
    content: {
      title: t('stepHitLabels.rankedTitle'),
      description: t('stepHitLabels.rankedDescription'),
    },
  },
  {
    attachTo: {
      element: '#calendar',
      padding: 16,
    },
    content: {
      title: t('stepHitLabels.calendarTitle'),
      description: t('stepHitLabels.calendarDescription'),
    },
  },
]

watch(showOnboarding, async (canShow) => {
      if (canShow) {
        await nextTick()
        setTimeout(() => {
          start()
        }, 50)
      } else {
        finish()
      }
    },
    { immediate: true }
)

onMounted(() => {
  updateWidth()
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', updateWidth)
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateWidth)
  }
  finish()
})
</script>

<style>

.hd {
  width: 80px;
}

.hd__content {
  display: flex;
  margin-bottom: 15px;
}

.close__hd {
  position: absolute;
  z-index: 99999999;
  right: 10px;
  top: 10px;
  font-size: 15px;
  font-weight: bold;
  width: 24px;
  height: 24px;
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: black;
  border: none;
  cursor: pointer;
}

.hd__wrapper {
  position: relative;
  flex-direction: column;
  justify-content: space-between;
  background: white;
  max-width: 320px;
  padding: 10px 10px 15px 10px;
  box-shadow: 3px 3px 0 black;
  border-radius: 10px;
  font-family: 'Nunito', sans-serif;
}

.hd__button {
  width: 100%;
  border-radius: 50px;
  padding: 8px;
  border: 1px solid #d5d4d4;
  font-weight: 600;
  background: none;
}

.hd__button.next {
  background: #007bff;
  color: white;
}

.onboarding-actions {
  display: flex;
  gap: 5px;
}

.hd__title {
  margin-bottom: 5px;
}

.hd__desc {
  font-size: 14px;
}
</style>
