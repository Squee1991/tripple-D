<template>
    <div class="detective-page">
        <div class="case-file">

            <div class="card card-main-title orange">
                <div class="icon">
                    <img :src="Detective" alt="">
                </div>
                <div>
                    <h1>{{ t('error.title')}}</h1>
                    <p> {{ t('error.subTitle')}}</p>
                </div>
            </div>

            <h2 class="clues-header">{{t('error.label')}}</h2>
            <div class="clues-container">

                <div class="card-wrapper">
                    <div class="card clue-card purple" @click="revealClue(1)">
                        <span class="clue-icon">
                            <img :src="NotePad" alt="">
                        </span>
                        <h3>{{ t('error.cardOne')}}</h3>
                    </div>
                    <div class="clue-result" :class="{ 'visible': revealedClues.includes(1) }">
                        <p>{{ t('error.paperOne')}}</p>
                    </div>
                </div>

                <div class="card-wrapper">
                    <div class="card clue-card green" @click="revealClue(2)">
                        <span class="clue-icon">
                            <img :src="Speak" alt="">
                        </span>
                        <h3>{{ t('error.cardTwo')}}</h3>
                    </div>
                    <div class="clue-result" :class="{ 'visible': revealedClues.includes(2) }">
                        <p>{{ t('error.paperTwo')}}</p>
                    </div>
                </div>

                <div class="card-wrapper">
                    <div class="card clue-card blue" @click="revealClue(3)">
                        <span class="clue-icon">
                            <img :src="Compass" alt="">
                        </span>
                        <h3>{{ t('error.cardThree')}}</h3>
                    </div>
                    <div class="clue-result" :class="{ 'visible': revealedClues.includes(3) }">
                        <p>{{ t('error.paperThree')}}</p>
                    </div>
                </div>

            </div>

            <transition name="fade">
                <div v-if="revealedClues.length > 0" class="solution-container">
                    <p class="solution-text">{{ t('error.footerText')}}</p>
                    <router-link to="/" class="card solution-button">
                        🏠 {{ t('error.btn')}}
                    </router-link>
                </div>
            </transition>

        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    import Detective from 'assets/images/detective.svg'
    import Compass from 'assets/images/compass.svg'
    import NotePad from 'assets/images/notepad.svg'
    import Speak from 'assets/images/speak.svg'
    const revealedClues = ref([]);
    const {t } = useI18n()
    function revealClue(clueId) {
        if (!revealedClues.value.includes(clueId)) {
            revealedClues.value.push(clueId);
        }
    }
</script>

<style scoped>

    .detective-page {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        min-height: 100vh;
        background-color: #fcf8f0;
        font-family: 'Nunito', sans-serif;
        padding:10px;
        box-sizing: border-box;
    }

    .icon {
        width: 190px;
    }

    .card-main-title {
        display: flex;
        align-items: center;
    }

    .case-file {
        width: 100%;
        max-width: 1100px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
    }

    .card {
        border: 3px solid #2c2c2c;
        border-radius: 20px;
        padding: 2px 10px;
        text-align: center;
        color: white;
        font-size: 15px;
    }

    .card-main-title {
        width: 100%;
    }
    .card-main-title .icon {
        font-size: 4rem;
        line-height: 1;
    }
    .card-main-title h1 {
        font-size: 2.5rem;
        margin: 0.5rem 0;
        font-weight: 900;
    }
    .card-main-title p {
        font-size: 1.1rem;
        max-width: 600px;
        margin: 0.5rem auto 0;
    }

    .clues-header {
        color: #555;
        font-size: 1.5rem;
        margin: 0;
    }

    .clues-container {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        width: 100%;
    }

    .card-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .clue-card {
        width: 100%;
        color: #2c2c2c;
        cursor: pointer;
        transition: all 0.2s ease-out;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .clue-card:hover {
        transform: translateY(-3px) rotate(1deg);
        box-shadow: 12px 12px 0px #2c2c2c;
    }

    .clue-icon {
        width: 80px;
        display: block;
    }
    .clue-card h3 {
        font-size: 15px;
    }

    .clue-result {
        background: #fff;
        border: 3px dashed #ccc;
        border-radius: 10px;
        padding: 10px;
        width: 100%;
        margin-top: 13px;
        max-height: 0;
        opacity: 0;
        overflow: hidden;
        transition: max-height 0.5s ease-out, opacity 0.5s ease-out, transform 0.3s;
        transform: translateY(-20px);
    }
    .clue-result.visible {
        max-height: 200px;
        opacity: 1;
        transform: translateY(0);
    }
    .clue-result p {
        margin: 0;
        color: #333;
        font-size: 13px;
    }

    .solution-container {
        text-align: center;
    }
    .solution-text {
        color: #555;
        font-size: 1.2rem;
        font-weight: 700;
    }
    .solution-button {
        display: inline-block;
        background: #e91e63;
        text-decoration: none;
        font-size: 1.5rem;
        font-weight: 900;
        padding: 1rem 3rem;
        margin-top: 1rem;
        transition: all 0.2s ease-out;
    }
    .solution-button:hover {
        transform: scale(1.05);
        box-shadow: 10px 10px 0px #ad1457;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity 0.8s ease;
    }
    .fade-enter-from, .fade-leave-to {
        opacity: 0;
    }

    .orange { background-color: #F9A826; }
    .purple { background-color: #AF85F2; }
    .green { background-color: #8BC34A; }
    .blue { background-color: #59C3E5; }

    @media (max-width: 768px) {
        .clues-container {
            grid-template-columns: 1fr;
        }
        .card-main-title h1 { font-size: 2rem; }
    }
</style>