<template>
  <div class="faq">
    <div class="faq__content">
      <div class="faq__header">
        <VBackBtn/>
        <div class="faq__title"> {{ t('helpCenter.faq')}}</div>
      </div>
      <div class="faq__content-inner">
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
                :class="{
                  box: openId === `${sectionIndex}-${questionIndex}`,
                  'overflow-visible': overflowId === `${sectionIndex}-${questionIndex}`
                }"
                class="accordion-box"
            >
              <div
                  :class="{ toTop: liftedId === `${sectionIndex}-${questionIndex}` }"
                  class="text-content"
              >
                <div class="accordion-text">
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

              <div :class="{ hidetitle: openId === `${sectionIndex}-${questionIndex}` }" class="accordion-title">
                <div>{{ item.question }}</div>
                <div class="arrow" @click="toggleQuestion(sectionIndex, questionIndex)">
                  <img class="arrow-item" :class="{ rotated: openId === `${sectionIndex}-${questionIndex}` }"
                       src="../assets/images/arrowNav.svg" alt="arrow_icon"/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="faq__bottom-btn">
          <p class="faq__contact-text">{{ t('faq.questions')}}</p>
          <button class="faq__btn-contact" @click="openContactForm">{{ t('faq.send')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import VBackBtn from "~/src/components/V-back-btn.vue";

const { t } = useI18n()
const router = useRouter()

const openId = ref(null)
const overflowId = ref(null)
const liftedId = ref(null)

function openContactForm() {
  router.push('/support-request')
}

function toggleQuestion(sectionIndex, questionIndex) {
  const id = `${sectionIndex}-${questionIndex}`;
  const isCurrentlyOpen = openId.value === id;

  if (isCurrentlyOpen) {
    openId.value = null;
    liftedId.value = null;
    overflowId.value = null;
  } else {
    openId.value = id;
    liftedId.value = null;
    overflowId.value = null;
    setTimeout(() => {
      if (openId.value === id) {
        liftedId.value = id;
        overflowId.value = id;
      }
    }, 500);
  }
}

const faqSections = ref([
  {
    title: t('howToUse.title'),
    items: [
      { question: t('howToUse.questOne'), answer: t('howToUse.answerOne') },
      { question: t('howToUse.questTwo'), answer: t('howToUse.answerTwo') },
      { question: t('howToUse.questThree'), answer: t('howToUse.answerThree') },
      { question: t('howToUse.questFour'), answer: t('howToUse.answerFour') },
      { question: t('howToUse.questFive'), answer: t('howToUse.answerFive') },
      { question: t('howToUse.questSix'), answer: t('howToUse.answerSix') },
      { question: t('howToUse.questSeven'), answer: t('howToUse.answerSeven') },
      { question: t('howToUse.questEight'), answer: t('howToUse.answerEight') },
      { question: t('howToUse.questNine'), answer: t('howToUse.answerNine') },
    ]
  },
  {
    title: t('accountManagement.title'),
    items: [
      { question: t('accountManagement.questOne'), answer: t('accountManagement.questAnswer') },
      { question: t('accountManagement.questTwo'), answer: t('accountManagement.answerTwo') },
      { question: t('accountManagement.questThree'), answer: t('accountManagement.answerThree') }
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
      { question: t('subscribe.questThree'), answer: t('subscribe.answerThree') }
    ]
  }
])
</script>

<style scoped>
.faq {
  max-width: 1000px;
  margin: 0 auto;
  border-radius: 24px;
  height: 100%;
  overflow: hidden;
}

.faq__content {
  height: 100%;
}

.faq__content-inner{
  max-width: 1100px;
  height: 100%;
  margin: 0 auto;
  overflow-y: auto;
  padding-bottom: 100px;
}

.faq__header {
  display: flex;
  align-items: center;
  padding: 5px 10px 15px 10px;
  margin-bottom: 15px;
}

.faq__title {
  font-size: 23px;
  font-weight: 600;
  color: var(--title);
  margin-left: 15px;
}

.faq__bottom-btn {
  margin-top: 24px;
  text-align: center;
  padding: 15px;
}

.faq__contact-text {
  margin-bottom: 25px;
  font-weight: 700;
  color: var(--titleColor);
  font-size: 19px;
}

.faq__btn-contact {
  background: #007bff;
  box-shadow: 0 6px 0 #0b5baf;
  color: #fff;
  padding: 14px;
  border-radius: 50px;
  border: none;
  cursor: pointer;
  font-weight: 700;
  width: 100%;
  font-size: 18px;
}

.faq__btn-contact:active {
  background: #0056b3;
}

.faq__section-header {
  display: flex;
  justify-content: center;
  color: var(--titleColor);
}

.faq__section-title {
  font-weight: 900;
  font-size: 24px;
  margin-bottom: 15px;
}

.faq__section-body {
  padding: 10px 15px;
}

.accordion-box {
  position: relative;
  margin-bottom: 25px;
  border: 3px solid black;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(218, 182, 124, 0.1);
  height: 75px;
  transition: height 0.4s ease-in-out;
  background: #f3a20f;
  overflow: hidden;
  width: 100%;
}

.box {
  height: 220px;
}

.overflow-visible {
  overflow: visible;
}

.text-content {
  position: absolute;
  transform: rotate(-2deg);
  background: white;
  margin: 10px 20px;
  padding: 10px;
  height: 190px;
  width: calc(100% - 40px);
  border-radius: 10px;
  border: 2px solid black;
  transition: bottom 0.5s ease-out, opacity 0.4s ease-out;
}

.toTop {
  position: absolute;
  bottom: 32px;
  transition: .3s;
}

.box .text-content {
  opacity: 1;
}

.accordion-title {
  position: absolute;
  bottom: 0;
  left: 0;
  background: #f3a20f;
  width: 100%;
  border-top: 2px solid black;
  border-radius: 10px;
  z-index: 2;
  font-family: "Nunito", sans-serif;
  font-weight: bold;
  font-size: 16px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 13px 10px 13px 15px;
}

.arrow {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.arrow-item {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transform: scale(1);
  transition: .5s;
}

.rotated {
  transition: .5s;
  transform: scale(-1);
}

.accordion-text {
  font-size: 17px;
  font-family: "Nunito", sans-serif;
  color: #555;
  padding: 5px;
  height: 100%;
  overflow-y: auto;
}

.faq__steps {
  padding-left: 20px;
  margin: 0 0 8px 0;
}
.faq__step {
  margin: 4px 0;
}
.faq__note {
  margin-top: 8px;
  font-weight: 700;
  padding-left: 20px;
}
.faq__answer {
  margin: 0;
  padding-bottom: 10px;
}
</style>