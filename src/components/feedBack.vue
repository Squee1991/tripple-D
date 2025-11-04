<template>
  <section id="contact" ref="contactSection" class="contact">
    <div class="contact__wrapper">
      <div class="contact-form" ref="contactFormRef">
        <div class="form__animation-wrapper">
          <div ref="msgAnimationWrapper" class="form__animation"></div>
        </div>
        <div class="form__content">
          <div class="form__header">
            <p class="form__label">{{ t(data.label) }}</p>
            <h2 class="form__title">{{ t(data.title) }}</h2>
          </div>
          <div class="form__field">
            <label class="form__field-label" for="user_email">{{ t(data.placeholder.email) }}</label>
            <input id="user_email" class="input" v-model="userEmail" type="email" name="user_email"
                   :placeholder="t(data.placeholder.email)"/>
            <span class="error__message" v-if="errors.name">{{ errors.name }}</span>
          </div>
          <div class="form__field">
            <label class="form__field-label" for="user_message">{{ t(data.placeholder.message) }}</label>
            <textarea id="user_message" v-model="userMessage" class="area" cols="30" rows="5" name="message"
                      :placeholder="t(data.placeholder.message)"></textarea>
            <span class="error__message" v-if="errors.message">{{ errors.message }}</span>
          </div>
          <button type="submit" class="btn--submit" @click="sendMessage">{{ t(data.btn.text) }}</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import MessageAnimation from '../../assets/animation/sendMessage.json'
import {ref, onMounted} from 'vue';
import Lottie from 'lottie-web';
import emailjs from 'emailjs-com';
import {gsap} from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { userAuthStore } from "~/store/authStore.js";

gsap.registerPlugin(ScrollTrigger);
const authStore = userAuthStore()
const contactSection = ref(null);
const msgAnimationWrapper = ref(null);
const {t} = useI18n()
const contactFormRef = ref(null);

const data = ref({
  label: 'feedBack.label',
  title: 'feedBack.title',
  btn: {
    text: 'feedBack.btn',
  },
  placeholder: {
    email: 'feedBack.emailPlaceholder',
    message: 'feedBack.messagePlaceholder'
  }
});

const errors = ref({email: '', message: ''})
const userEmail = ref(authStore.email);
const userMessage = ref('');

onMounted(() => {
  if (msgAnimationWrapper.value) {
    Lottie.loadAnimation({
      container: msgAnimationWrapper.value,
      autoplay: false,
      loop: false,
      animationData: MessageAnimation,
      name: 'feedbackAnimation'
    });
  }

  if (contactFormRef.value) {
    gsap.from(contactFormRef.value, {
      scrollTrigger: {
        trigger: contactFormRef.value,
        start: "top 80%",
        toggleActions: "play none none none",
      },
      y: 100,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    });
  }
});

const sendMessage = async () => {
  errors.value = {name: '', message: ''};
  if (!userEmail.value.trim()) {
    errors.value.name = t('errors.errorEmail');
  }
  if (!userMessage.value.trim()) {
    errors.value.message = t('errors.enterMsg');
  }
  if (errors.value.email || errors.value.message) {
    return;
  }

  try {
    await emailjs.send("service_9zsuox2", "template_s9p24lo", {
      from_name: userEmail.value,
      message: userMessage.value
    }, "2v5vLDUsbkXWrluyJ");
    Lottie.play('feedbackAnimation');
    resetFields();
  } catch (error) {
    console.error(error);
  }
};
const resetFields = () => {
  userEmail.value = '';
  userMessage.value = '';
  errors.value = {name: '', message: ''};
};

</script>

<style scoped>

.contact__wrapper {
  width: 100%;
  padding: 2rem 1.5rem;
  font-family: "Nunito", sans-serif;
  margin-bottom: 50px;
}

.contact-form {
  display: flex;
  gap: 2.5rem;
}

.form__animation-wrapper {
  flex: 1;
  min-width: 300px;
  align-self: stretch;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #60a5fa;
  border-radius: 24px;
  border: 3px solid #1e1e1e;
  box-shadow: 8px 8px 0px #1e1e1e;
}

.form__animation {
  width: 100%;
  max-width: 400px;
}

.form__content {
  flex: 1;
  padding: 2.5rem;
  background: #ffffff;
  border-radius: 24px;
  border: 3px solid #1e1e1e;
  box-shadow: 8px 8px 0px #1e1e1e;
}

.form__header {
  text-align: center;
  margin-bottom: 2rem;
}

.form__label {
  font-size: 1rem;
  font-weight: 400;
  color: #e53935;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.form__title {
  font-size: 2.2rem;
  font-weight: 400;
  color: #1e1e1e;
  margin-top: 0.5rem;
}

.form__field {
  margin-bottom: 1rem;
}

.form__field-label {
  display: none;
}

.input,
.area {
  width: 100%;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  color: #1e1e1e;
  background: #fef8e4;
  border: 3px solid #1e1e1e;
  border-radius: 16px;
  font-size: 1rem;
  padding: 1rem;
  transition: all 0.2s ease-in-out;
  box-shadow: 4px 4px 0px #1e1e1e;
}

.input::placeholder,
.area::placeholder {
  color: #a1a1a1;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
}

.input:focus,
.area:focus {
  outline: none;
  background: #ffffff;
  border-color: #fca13a;
}

.area {
  min-height: 140px;
  resize: vertical;
}

.error__message {
  color: #e53935;
  font-size: 0.9rem;
  font-family: "Nunito", sans-serif;
  font-weight: 700;
  display: block;
  margin-top: 0.2rem;
}

.btn--submit {
  width: 100%;
  font-family: "Nunito", sans-serif;
  font-weight: bold;
  padding: 1rem 1.5rem;
  font-size: 1.3rem;
  border-radius: 16px;
  cursor: pointer;
  border: 3px solid #1e1e1e;
  transition: all 0.1s ease-in-out;
  background-color: #4ade80;
  color: #1e1e1e;
  box-shadow: 4px 4px 0px #1e1e1e;
}

.btn--submit:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px #1e1e1e;
}

.btn--submit:active {
  transform: translate(4px, 4px);
  box-shadow: 0px 0px 0px #1e1e1e;
}

@media (max-width: 900px) {
  .contact-form {
    flex-direction: column;
  }

  .form__animation-wrapper {
    display: none;
  }

  .form__content {
    width: 100%;
    flex-basis: auto;
    padding: 2.5rem;
    box-shadow: none;
  }
}

@media (max-width: 767px) {
  .contact__wrapper {
    padding: 0 15px;
  }
}

@media (max-width: 640px) {

  .form__content {
    padding: 2rem 1.5rem;
  }

  .form__title {
    font-size: 1.2rem;
  }

  .form__header {
    margin-bottom: 1rem;
  }
  .btn__back {
    font-size: 1rem;
  }

  .btn--submit {
    font-size: 1rem;
  }
}
</style>