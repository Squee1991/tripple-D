<template>
  <section class="faq">
    <div class="faq__top-btn">
      <button class="faq__btn-home" @click="goHome">{{ t('faq.btnBack')}}</button>
    </div>
    <div
        v-for="(section, sectionIndex) in faqSections"
        :key="sectionIndex"
        class="faq__section"
    >
      <div class="faq__section-header">
        <h2 class="faq__section-title">{{ section.title }}</h2>
      </div>
      <div class="faq__section-body">
        <div
            v-for="(item, questionIndex) in section.items"
            :key="questionIndex"
            class="faq__item"
            :class="{ 'faq__item--open': isQuestionOpen(sectionIndex, questionIndex) }"
        >
          <h3 class="faq__item-question">
            <button
                class="faq__item-toggle"
                @click="toggleQuestion(sectionIndex, questionIndex)"
                :aria-expanded="isQuestionOpen(sectionIndex, questionIndex)"
                :aria-controls="`faq-item-${sectionIndex}-${questionIndex}`"
            >
              <span class="faq__item-question-text">{{ item.question }}</span>
              <img
                  class="faq__item-arrow"
                  src="../assets/images/arrowNav.svg"
                  alt="Show_answer"
              />
            </button>
          </h3>
          <div class="faq__item-body"
               :id="`faq-item-${sectionIndex}-${questionIndex}`"
          >
            <template v-if="item.steps && item.steps.length">
              <ol class="faq__steps">
                <li
                    v-for="(step, stepIndex) in item.steps"
                    :key="stepIndex"
                    class="faq__step"
                >
                  {{ step }}
                </li>
              </ol>
              <p v-if="item.note" class="faq__note">{{ item.note }}</p>
            </template>
            <template v-else>
              <p class="faq__answer">{{ item.answer }}</p>
            </template>
          </div>
        </div>
      </div>
    </div>
    <div class="faq__bottom-btn">
      <p class="faq__contact-text">{{ t('faq.questions')}}</p>
      <button class="faq__btn-contact" @click="openContactForm">{{ t('faq.send')}}</button>
    </div>
  </section>
</template>

<script setup>
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import {useHead} from '#imports'
const { t } = useI18n()
const router = useRouter()

function goHome() {
  router.push('/')
}

function openContactForm() {
  router.push('/support-request')
}

const faqSections = ref([
  {
    title: t('howToUse.title'),
    items: [
      {
        question: t('howToUse.questOne'),
        answer: t('howToUse.answerOne'),
      },
      {
        question: t('howToUse.questTwo'),
        answer: t('howToUse.answerTwo'),
      },
      {
        question: t('howToUse.questThree'),
        answer: t('howToUse.answerThree')
      },
      {
        question: t('howToUse.questFour'),
        answer: t('howToUse.answerFour'),
      },
      {
        question: t('howToUse.questFive'),
        answer: t('howToUse.answerFive')
      },
      {
        question: t('howToUse.questSix'),
        answer: t('howToUse.answerSix')
      },
      {
        question: t('howToUse.questSeven'),
        answer: t('howToUse.answerSeven'),
      },
      {
        question: t('howToUse.questEight'),
        answer: t('howToUse.answerEight')
      }
    ]
  },
  {
    title: t('accountManagement.title'),
    items: [
      {
        question: t('accountManagement.questOne'),
        answer: t('accountManagement.questAnswer')
      },
      {
        question:  t('accountManagement.questTwo'),
        answer: t('accountManagement.answerTwo')
      },
      {
        question: t('accountManagement.questThree'),
        answer:t('accountManagement.answerThree')
      }
    ]
  },
  {
    title: t('subscribe.title'),
    items: [
      {
        question: t('subscribe.questOne'),
        steps: [
          t('subscribe.questOneStepOne'),
          t('subscribe.questOneStepTwo'),
          t('subscribe.questOneStepThree'),
          t('subscribe.questOneStepFour'),
          t('subscribe.questOneStepFive'),
          t('subscribe.questOneStepSix'),
        ]
      },
      {
        question: t('subscribe.questTwo'),
        steps: [
          t('subscribe.questTwoStepOne'),
          t('subscribe.questTwoStepTwo'),
          t('subscribe.questTwoStepThree'),
          t('subscribe.questTwoStepFour'),
        ],
        note: t('subscribe.note'),
      },
      {
        question: t('subscribe.questThree'),
        answer: t('subscribe.answerThree'),
      }
    ]
  }
])

useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqSections.value.flatMap((section) =>
            section.items.map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text:
                    item.answer ??
                    (item.steps ? item.steps.join(' ') : '')
              }
            }))
        )
      })
    }
  ]
})

const openQuestionBySection = ref(new Map())

function toggleQuestion(sectionIndex, questionIndex) {
  const current = openQuestionBySection.value.get(sectionIndex)
  if (current === questionIndex) {
    openQuestionBySection.value.delete(sectionIndex)
  } else {
    openQuestionBySection.value.set(sectionIndex, questionIndex)
  }
}

function isQuestionOpen(sectionIndex, questionIndex) {
  return openQuestionBySection.value.get(sectionIndex) === questionIndex
}
</script>

<style scoped>
* {
  font-family: "Nunito", sans-serif;
}

.faq {
  max-width: 1000px;
  margin: 0 auto;
  border-radius: 24px;
  padding: 22px;
}

.faq__top-btn {
  text-align: center;
  margin-bottom: 16px;
}

.faq__btn-home {
  background: #007bff;
  color: #fff;
  padding: 10px 20px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-weight: 700;
  min-width: 250px;
  font-size: 1.3rem;
}

.faq__btn-home:hover {
  background: #0f72dc;
}

.faq__bottom-btn {
  margin-top: 24px;
  text-align: center;
}

.faq__contact-text {
  margin-bottom: 25px;
  font-weight: 700;
  color: var(--titleColor);
  font-size: 1.4rem;
}

.faq__btn-contact {
  background: #007bff;
  color: #fff;
  padding: 12px 20px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-weight: 700;
  min-width: 260px;
  font-size: 1.4rem;
}

.faq__btn-contact:hover {
  background: #0056b3;
}

.faq__section-header {
  display: flex;
  justify-content: center;
  color: var(--titleColor);
}

.faq__section-title {
  font-weight: 900;
  font-size: 2rem;
}

.faq__section-body {
  padding: 10px 10px 14px;
}

.faq__item {
  background: #fff;
  border: 3px solid #000;
  border-radius: 16px;
  box-shadow: 3px 3px 0 #000;
  margin: 10px 0;
  overflow: hidden;
}

.faq__item-question {
  margin: 0;
}

.faq__item-question .faq__item-toggle {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f3f4f6;
  border: 0;
  cursor: pointer;
  font-weight: 800;
  text-align: left;
}

.faq__item-question-text {
  font-weight: 900;
  font-size: 1.4rem;
}

.faq__item-arrow {
  width: 20px;
  transition: transform .2s ease;
}

.faq__item--open .faq__item-arrow {
  transform: rotate(180deg);
}

.faq__item-body {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transition: max-height .2s ease, opacity .2s ease, padding .2s ease;
  padding: 0 15px;
}

.faq__item--open .faq__item-body {
  max-height: 1000px;
  opacity: 1;
  padding: 10px 15px;
}

.faq__steps {
  padding-left: 20px;
  margin: 0 0 8px 0;
}

.faq__step {
  margin: 4px 0;
  font-size: 20px;
}

.faq__note {
  margin-top: 8px;
  font-weight: 700;
  padding-left: 20px;
}

.faq__answer {
  margin: 0;
  font-size: 20px;
  font-weight: 400;
}

@media (max-width: 767px) {
  .faq__item-question-text {
    font-size: 1rem;
  }

  .faq__answer {
    font-size: 1rem;
  }

  .faq__step {
    font-size: 1rem;
  }
}
</style>
