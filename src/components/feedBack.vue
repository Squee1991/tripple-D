<template>
  <section id="contact" ref="contactSection" class="contact">
    <div class="contact__wrapper">
      <div class="contact-form" ref="contactFormRef">
        <div class="form__animation-wrapper">
          <div ref="msgAnimationWrapper" class="form__animation"></div>
        </div>
        <form
            ref="formRef"
            class="form__content"
            @submit.prevent="sendMessage"
        >
          <div class="form__header">
            <h2 class="form__title">{{ t(data.title) }}</h2>
          </div>
          <div class="form__field">
            <input
                class="input"
                type="email"
                v-model="userEmail"
                :placeholder="t(data.placeholder.email)"
            />
            <span class="error__message" v-if="errors.email">{{ errors.email }}</span>
          </div>
          <div class="form__field --area">
            <textarea
                class="area"
                v-model="userMessage"
                :placeholder="t(data.placeholder.message)"
            ></textarea>
            <span class="error__message" v-if="errors.message">{{ errors.message }}</span>
          </div>
          <div class="form__field-screenshot">
            <input
                class="custom-input"
                id="file"
                type="file"
                accept="image/png,image/jpeg"
                @change="onFileChange"
            />
            <label for="file" class="custom-btn">
              <span class="paper_clip">📎</span>
              <span>{{ t('feedBack.screenShot') }}</span>
            </label>
            <span class="error__message" v-if="errors.file">{{ errors.file }}</span>
            <div class="btn-screenshot" v-for="(item, index) in images" :key="index">
              <div class="file-info">
                <span class="file-icon">📄 Скриншот ({{ index + 1 }})</span>
              </div>
              <button type="button" class="delete-image" @click="removeImage(index)">
                <img src="../../assets/images/garbage.svg" alt="garbage" class="garbage-icon">
              </button>
            </div>
          </div>
          <button
              type="submit"
              class="btn--submit"
              :disabled="isSending"
          >
            {{ isSending ? t('sending') : t(data.btn.text) }}
          </button>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import emailjs from 'emailjs-com'
import Lottie from 'lottie-web'
import MessageAnimation from '@/assets/animation/sendMessage.json'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { userAuthStore } from '~/store/authStore.js'
import { useI18n } from "vue-i18n"

import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage'

gsap.registerPlugin(ScrollTrigger)
const { t } = useI18n()
const authStore = userAuthStore()
const contactSection = ref(null)
const contactFormRef = ref(null)
const msgAnimationWrapper = ref(null)
const formRef = ref(null)
const userEmail = ref(authStore.email || '')
const userMessage = ref('')
const images = ref([])
const isSending = ref(false)

const errors = ref({
  email: '',
  message: '',
  file: ''
})

const MAX_FILE_SIZE = 2 * 1024 * 1024
const data = {
  label: 'feedBack.label',
  title: 'feedBack.title',
  btn: { text: 'feedBack.btn' },
  placeholder: {
    email: 'feedBack.emailPlaceholder',
    message: 'feedBack.messagePlaceholder'
  }
}

const onFileChange = (e) => {
  const files = e.target.files;
  if (!files || files.length === 0) return;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.size > MAX_FILE_SIZE) {
      errors.value.file = t('errors.fileTooLarge');
      continue;
    }

    images.value.push({
      file: file,
      url: URL.createObjectURL(file)
    });
  }
  e.target.value = "";
};

const removeImage = (index) => {
  URL.revokeObjectURL(images.value[index].url)
  images.value.splice(index, 1)
}

const uploadScreenshot = async (file) => {
  const storage = getStorage()
  const fileRef = storageRef(
      storage,
      `feedback/${Date.now()}-${file.name}`
  )
  await uploadBytes(fileRef, file)
  return await getDownloadURL(fileRef)
}

const sendMessage = async () => {
  errors.value = { email: '', message: '', file: '' }

  if (!userEmail.value.trim()) {
    errors.value.email = t('feedBack.emailPlaceholder')
    return
  }
  if (!userMessage.value.trim()) {
    errors.value.message = t('feedBack.messagePlaceholder')
    return
  }
  isSending.value = true;
  try {
    let screenshotUrl = '-';
    if (images.value.length > 0) {
      screenshotUrl = await uploadScreenshot(images.value[0].file);
    }
    await emailjs.send(
        'service_1ciacg7',
        'template_nh1qmx9',
        {
          user_email: userEmail.value,
          message: userMessage.value,
          screenshot: screenshotUrl
        },
        'rh5IqXjASdtNeHdyG'
    );
    Lottie.play('feedbackAnimation');
    userMessage.value = '';
    images.value.forEach(img => URL.revokeObjectURL(img.url));
    images.value = [];
    if (formRef.value) formRef.value.reset();
  } catch (error) {
    console.error("Error sending:", error);
    errors.value.message = t('errors.sendFailed');
  } finally {
    isSending.value = false;
  }
}

onMounted(() => {
  if (msgAnimationWrapper.value) {
    Lottie.loadAnimation({
      container: msgAnimationWrapper.value,
      autoplay: false,
      loop: false,
      animationData: MessageAnimation,
      name: 'feedbackAnimation'
    })
  }
  if (contactFormRef.value) {
    gsap.from(contactFormRef.value, {
      scrollTrigger: {
        trigger: contactFormRef.value,
        start: 'top 80%'
      },
      y: 100,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    })
  }
})

onUnmounted(() => {
  ScrollTrigger.killAll()
})

</script>

<style scoped>

.contact__wrapper {
  width: 100%;
  font-family: "Nunito", sans-serif;
}

.contact-form {
  display: flex;
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.form__animation-wrapper {
  flex: 1;
  min-width: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1C1E26;
  border-radius: 24px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.form__animation {
  width: 100%;
  max-width: 400px;
}

.form__content {
  flex: 1;
  border-radius: 24px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
}

.form__header {
  text-align: center;
  margin-bottom: 2rem;
}

.form__label {
  font-size: 0.9rem;
  font-weight: 700;
  color: #EB5757;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

.form__title {
  font-size: 1.2rem;
  font-weight: 500;
  color: #A3A3A3;
  margin-top: 0.5rem;
  margin-bottom: 0;
}

.form__field {
  margin-bottom: 1.5rem;
  position: relative;
}

.form__field.--area {
  flex-grow: 1;
}

.input,
.area {
  width: 100%;
  font-family: "Nunito", sans-serif;
  font-weight: 600;
  background: white;
  border: none;
  border-radius: 16px;
  font-size: 1rem;
  padding: 1.2rem;
  transition: all 0.2s ease;
  box-sizing: border-box;
  box-shadow: inset 0 3px 6px rgba(0, 0, 0, 0.15);
}

.input::placeholder,
.area::placeholder {
  color: #5C5E6A;
  font-weight: 500;
}

.input:focus,
.area:focus {
  outline: none;
  /* Голубое свечение при фокусе */
  box-shadow: inset 0 3px 6px rgba(0, 0, 0, 0.1), 0 0 0 2px #55a8f5;
}

.area {
  min-height: 140px;
  resize: vertical;
}

.error__message {
  color: #EB5757;
  font-size: 0.85rem;
  margin-top: 5px;
  font-weight: 700;
  display: block;
  text-align: left;
  padding-left: 10px;
}

.form__field-screenshot {
  margin-bottom: 1.5rem;
}

.custom-input {
  display: none;
}

.custom-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  background-color: #323647;
  color: #ffffff;
  padding: 12px 20px;
  border-radius: 16px;
  font-weight: 700;
  font-size: 1rem;
  transition: transform 0.1s, box-shadow 0.1s;
  box-shadow: 0 5px 0 #222532;
}

.custom-btn:active {
  transform: translateY(5px);
  box-shadow: 0 0 0 #222532;
}

.paper_clip {
  font-size: 1.2rem;
}

.btn-screenshot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  background: #2A2D3A;
  padding: 10px 15px;
  border-radius: 12px;
  color: #ffffff;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.file-icon {
  font-weight: 600;
  font-size: 0.95rem;
  color: #55a8f5;
}

.delete-image {
  border: none;
  background: rgba(235, 87, 87, 0.1);
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}

.delete-image:hover {
  background: rgba(235, 87, 87, 0.2);
}

.garbage-icon {
  width: 18px;
  height: 18px;
  filter: invert(1);
}

.btn--submit {
  width: 100%;
  font-family: "Nunito", sans-serif;
  font-weight: 800;
  padding: 1rem;
  font-size: 18px;
  border-radius: 50px;
  cursor: pointer;
  border: none;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
  background-color: #2ECC71;
  color: #ffffff;
  text-transform: lowercase;
  box-shadow: 0 6px 0 #24A055;
}

.btn--submit:active {
  transform: translateY(6px);
  box-shadow: 0 0 0 #24A055;
}

.btn--submit:disabled {
  background-color: #5C5E6A;
  box-shadow: 0 6px 0 #4A4C56;
  cursor: not-allowed;
}

@media (max-width: 900px) {
  .contact-form {
    flex-direction: column;
  }
  .form__animation-wrapper {
    display: none;
  }
}

@media (max-width: 640px) {
  .input, .area {
    padding: 1rem;
  }

  .custom-btn {
    width: 100%;
  }
}
</style>