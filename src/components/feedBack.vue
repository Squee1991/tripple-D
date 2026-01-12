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
            <p class="form__label">{{ t(data.label) }}</p>
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
          <div class="form__field  --area">
                        <textarea
                            class="area"
                            v-model="userMessage"
                            :placeholder="t(data.placeholder.message)"
                        ></textarea>
            <span class="error__message" v-if="errors.message">{{ errors.message }}  </span>
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
              <span> {{ t('feedBack.screenShot') }}</span>
            </label>
            <span class="error__message" v-if="errors.file">{{ errors.file }}</span>
            <div class="btn-screenshot" v-for="(item, index) in images" :key="index">
              <div class="file-info">
                <span class="file-icon">- 📄 screenshot({{ index + 1 }})</span>
              </div>
              <button type="button" class="delete-image" @click="removeImage(index)">
                <img src="../../assets/images/garbage.svg" alt="garbage">
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
import {ref, onMounted, onUnmounted, computed} from 'vue'
import emailjs from 'emailjs-com'
import Lottie from 'lottie-web'
import MessageAnimation from '@/assets/animation/sendMessage.json'
import {gsap} from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import {userAuthStore} from '~/store/authStore.js'

import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage'

gsap.registerPlugin(ScrollTrigger)
const {t} = useI18n()
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
  btn: {text: 'feedBack.btn'},
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
  errors.value = {email: '', message: '', file: ''}

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
  margin-bottom: 1.2rem;
}

.form__label {
  font-size: 1rem;
  font-weight: 400;
  color: #e53935;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.form__title {
  font-size: 1.5rem;
  font-weight: 400;
  color: #1e1e1e;
  margin-top: 0.5rem;
}

.form__field {
  height: 80px;
}

.form__field.--area {
  height: 170px;
  margin-bottom: 5px;
}

.form__field-screenshot {
  margin-bottom: 15px;
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
  font-size: .8rem;
  padding: 1rem;
  transition: all 0.2s ease-in-out;
  box-shadow: 3px 3px 0px #1e1e1e;
}

.input::placeholder,
.area::placeholder {
  color: #a1a1a1;
  font-family: "Nunito", sans-serif;
  font-weight: 500;
}

.input:focus,
.area:focus {
  outline: none;
  background: #ffffff;
  border-color: #fca13a;
  box-shadow: 3px 3px 0px #fca13a;
}

.area {
  min-height: 145px;
  resize: none;
}

.error__message {
  color: #e53935;
  font-size: 0.9rem;
  text-align: center;
  font-family: "Nunito", sans-serif;
  font-weight: 700;
  display: block;
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
  box-shadow: 3px 3px 0px #1e1e1e;
}

.btn--submit:hover {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0px #1e1e1e;
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

.custom-input {
  display: none;
}

.custom-btn {
  display: flex;
  align-items: center;
  cursor: pointer;
  border: 2px solid #1e1e1e;
  max-width: 200px;
  border-radius: 12px;
  background-color: white;
  box-shadow: 3px 3px 0 black;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
}

.file-name {
  font-weight: 700;
  color: #1e1e1e;
  font-size: 0.9rem;
}

.btn-screenshot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0 ;
  background: #ffffff;
  padding: 4px;
  border-bottom: 2px dashed #1e1e1e;
  border-radius: 8px;
}

.paper_clip {
  font-size: 30px;
  cursor: pointer;
}

.delete-image {
  display: flex;
  justify-content: space-between;
  border: none;
  background: none;
  width: 30px;
  height: 30px;
}
</style>
