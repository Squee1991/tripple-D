<script setup>
import MessageAnimation from '../../assets/animation/message.json'
// import {useScrollObserver} from "../utils/useScrollObserver";
import {ref, onMounted} from 'vue';
import Lottie from 'lottie-web';
// import emailjs from 'emailjs-com';

const contactSection = ref(null);
const msgAnimationWrapper = ref(null);
const isVisible = ref(false);

const data = ref({
    label: 'Have a question ?',
    title: 'Would you like to get to know me better? Use this form, and I will definitely get back to you.',
    btn: {
        text: 'send a message',
    }
});

const errors = ref({
    email: '',
    message: ''
})
const userEmail = ref('');
const userMessage = ref('');

onMounted(() => {

    isVisible.value = true;
    if (msgAnimationWrapper.value) {
        Lottie.loadAnimation({
            container: msgAnimationWrapper.value,
            autoplay: true,
            loop: true,
            animationData: MessageAnimation,
        });
    }

});

const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email);
};

const sendMessage = async () => {
    errors.value = {email: '', message: ''};
    if (!userEmail.value.trim()) {
        errors.value.email = "Email is required";
    }
    if (!validateEmail(userEmail.value)) {
        errors.value.email = "Please enter a valid email";
    }
    if (!userMessage.value.trim()) {
        errors.value.message = "Please enter a message";
    }
    if (errors.value.email || errors.value.message) {
        return;
    }

    try {
        await emailjs.send(
            "service_9zsuox2",
            "template_s9p24lo",
            {
                from_name: userEmail.value,
                message: userMessage.value,
            },
            "2v5vLDUsbkXWrluyJ"
        );
        resetFields();
    } catch (error) {
        console.error(error);
    }
};

const resetFields = () => {
    userEmail.value = '';
    userMessage.value = '';
    errors.value = {
        email: '',
        message: ''
    };
};
</script>

<template>
    <section id="contact" ref="contactSection" class="contact">
        <div class="contact__wrapper">
            <div class="form">
                <div class="form__wrapper">
                    <div class="form__animation-wrapper">
                        <div ref="msgAnimationWrapper" class="form__animation" :class="{ 'visible': isVisible }"></div>
                    </div>
                    <div class="form__wrapper-inner" :class="{ 'visible': isVisible }">
                        <div class="contact__label label">{{ data.label }}</div>
                        <div class="contact__title">{{ data.title }}</div>
                        <div class="form__field__inner">
                            <label class="label">
                                <input class="input" v-model="userEmail" type="email" name="user_email"
                                       placeholder="Email"/>
                            </label>
                            <span class="error__message" v-if="errors.email"> {{ errors.email }}</span>
                        </div>
                        <div class="form__message__inner">
                            <label class="label__area">
							<textarea v-model="userMessage" class="area" cols="30" rows="10" name="message"
                        placeholder="Message"></textarea>
                            </label>
                            <span class="error__message" v-if="errors.message"> {{ errors.message }}</span>
                        </div>
                        <div @click="sendMessage" class="form__btn">
                            <button type="submit" class="contact__btn btn">{{ data.btn.text }}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>


<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600&display=swap');

.contact {
    overflow-x: hidden;
    background: linear-gradient(135deg, #f5f7ff, #eef1ff);
    padding: 60px 0;
}

.contact__wrapper {
    padding: 50px 20px;
    border-radius: 20px;
    max-width: 1200px;
    margin: 0 auto;
    background: white;
    box-shadow: 0 15px 50px rgba(92, 58, 255, 0.08);
    position: relative;
    overflow: hidden;
}

.form__wrapper {
    display: flex;
    justify-content: center;
    gap: 40px;
    padding: 0 40px;
    border-radius: 20px;
    flex-wrap: wrap;
}

.form__animation-wrapper {
    display: flex;
    width: 45%;
    min-width: 300px;
    align-items: center;
    justify-content: center;
}

.form__animation {
    width: 100%;
    opacity: 0;
    transform: translateX(-100%);
}

.form__animation.visible {
    animation: slideInLeft 1s ease-out forwards;
}

.form__wrapper-inner {
    width: 50%;
    min-width: 320px;
    padding: 30px;
    opacity: 0;
    animation: slideInRight 1s ease-out forwards;
}

.form__wrapper-inner.visible {
    opacity: 1;
}

.contact__label {
    font-size: 34px;
    color: #5c3aff;
    text-align: center;
    margin-bottom: 30px;
    font-family: 'Cinzel', serif;
    font-weight: 600;
}

.contact__label:after {
    content: '';
    width: 60px;
    height: 4px;
    background: #5c3aff;
    display: block;
    margin: 10px auto 0;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(92, 58, 255, 0.5);
}

.contact__title {
    font-size: 18px;
    color: #3a3a3a;
    line-height: 1.6;
    text-align: center;
    margin-bottom: 25px;
    font-family: 'Cinzel', serif;
    font-weight: 400;
}

.form__field__inner,
.form__message__inner {
    margin-bottom: 20px;
    position: relative;
}

.input,
.area {
    width: 100%;
    padding: 15px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 12px;
    background: #f9faff;
    box-shadow: inset 0 1px 6px rgba(0, 0, 0, 0.05);
    color: #333;
    transition: all 0.3s ease;
    font-family: system-ui, sans-serif;
}

.input:focus,
.area:focus {
    border-color: #5c3aff;
    box-shadow: 0 0 0 4px rgba(92, 58, 255, 0.1);
    outline: none;
    background: #fff;
}

.area {
    resize: none;
    height: 160px;
}

.error__message {
    color: #e25454;
    font-size: 14px;
    margin-top: 5px;
    font-family: system-ui, sans-serif;
}

.contact__btn {
    margin-top: 10px;
    display: inline-block;
    width: 100%;
    padding: 18px;
    font-size: 18px;
    color: white;
    background: linear-gradient(135deg, #3c65ff, #5c3aff);
    border: none;
    border-radius: 12px;
    box-shadow: 0 5px 15px rgba(92, 58, 255, 0.5);
    cursor: pointer;
    transition: all 0.4s ease;
    font-family: system-ui, sans-serif;
}

.contact__btn:hover {
    background: linear-gradient(135deg, #5c3aff, #3c65ff);
    box-shadow: 0 10px 25px rgba(92, 58, 255, 0.7);
    transform: translateY(-2px);
}

@keyframes slideInLeft {
    from {
        transform: translateX(-100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

/* Mobile and tablet responsive */
@media (max-width: 1024px) {
    .form__wrapper {
        flex-direction: column;
        align-items: center;
    }

    .form__animation-wrapper {
        display: none;
    }

    .form__wrapper-inner {
        width: 100%;
        padding: 20px;
    }
}

@media (max-width: 640px) {
    .contact__label {
        font-size: 26px;
    }

    .contact__title {
        font-size: 16px;
    }

    .contact__btn {
        font-size: 16px;
        padding: 14px;
    }
}
</style>
