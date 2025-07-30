<template>
    <main class="modal-verbs-page" :class="{ 'content-is-active': isContentVisible }">
        <div v-if="showTips" class="tips__overlay" @click.self="showTips = false">
            <div class="tips__content">
                <button class="tips__close" @click="showTips = false">×</button>
                <h2 class="tipps__title">{{ t('modalVerbsTipsTitle.tipsTitle')}}</h2>
                <ul class="tips__list">
                    <li v-for="tip in activeTipps" :key="tip.text" class="tips__item">
                        <div class="tips__text" v-html="tip.text"></div>
                    </li>
                </ul>
            </div>
        </div>
        <aside class="sidebar">
            <NuxtLink to="/" class="btn__back">{{ t('trainerPage.toMain')}}</NuxtLink>
            <h2 class="sidebar__title">{{t('modalVerbsPage.title')}}</h2>
            <div class="sidebar__heading">{{t('modalVerbsPage.level')}}</div>
            <ul class="sidebar__list">
                <li v-for="group in modalGroups" :key="group.level" class="sidebar__item"
                    :class="{'sidebar__item--active': selectedGroup && selectedGroup.level === group.level}">
                    <button class="sidebar__button" @click="selectGroup(group)">
                        <span>{{ group.level }}</span>
                    </button>
                </li>
            </ul>
        </aside>
        <section class="content">
            <button v-if="isMobileLayout" class="btn__close" @click="closeContent">×</button>
            <div v-if="selectedGroup" class="content-block">
                <header class="content__header">
                    <h1 class="content__title">{{t('modalVerbsPage.selectedTitle')}} {{ selectedGroup.level }}</h1>
                </header>
                <div class="content__body">
                    <div class="content__main-column">
                        <section class="info-section">
                            <div class="info__wrapper">
                                <h3 class="info-section__title">{{t('modalVerbsPage.examplesTitle')}}</h3>
                                <button
                                        title="Советы по теме"
                                        v-if="selectedGroup.tips" class="info__icon-tips" ref="tipRef"
                                        @click="openTips(selectedGroup.tips)">
                                </button>
                            </div>
                            <ul class="example-list">
                                <li v-for="verb in selectedGroup.verbs" :key="verb.name" class="example">
                                    <div class="verb-header">
                                        <div class="verb-info">
                                            <span class="verb-name">{{ verb.name }}</span>
                                            <span class="verb-translation">{{ t(verb.translation) }}</span>
                                        </div>
                                        <SoundBtn :text="verb.name"/>
                                    </div>
                                    <div class="example-details">
                                        <div>
                                            <div class="example__sentence" v-html="verb.example"></div>
                                            <div class="example__translation"> {{ t(verb.exampleTranslate)}}</div>
                                        </div>
                                        <SoundBtn :text="verb.example"/>
                                    </div>
                                </li>
                            </ul>
                        </section>
                    </div>
                    <div class="practice-area">
                        <h3 class="practice-area__title">{{ t(selectedGroup.practice.title) }}</h3>
                        <NuxtLink :to="selectedGroup.practice.url" class="practice-area__button">
                            {{t('modalVerbsPage.begin')}}
                        </NuxtLink>
                    </div>
                </div>
            </div>
            <div v-else class="placeholder">
                <p>👈 {{t('modalVerbsPage.chooseLevel')}}</p>
            </div>
        </section>
    </main>
</template>

<script setup>
    import {ref, onMounted, onUnmounted, watch, nextTick} from 'vue';
    import {useRouter} from 'vue-router';
    import Lottie from 'lottie-web';
    import TipIcon from '../../assets/animation/info.json';
    import SoundBtn from '../../src/components/soundBtn.vue';
    const {t } = useI18n()
    const router = useRouter();
    const isMobileLayout = ref(false);
    const isContentVisible = ref(false);
    const selectedGroup = ref(null);
    const showTips = ref(false);
    const activeTipps = ref([]);
    const tipRef = ref(null);
    let lottieInstance = null;
    const backToMenu = () => router.push('/');

    const modalGroups = ref([
        {
            level: 'A1 - A2',
            practice: {title: 'modalGroupA.practice', url: '/modal-verbs/modal-verbs-session'},
            tips: [
                {text: t('modalGroupA.tipFirstA')},
                {text: t('modalGroupA.tipSecondA')},
                {text: t('modalGroupA.tipThirdA')},
                {text: t('modalGroupA.tipFourthA')}
            ],
            verbs: [
                {
                    name: 'können',
                    translation: 'modalGroupA.verbTranslateFirst',
                    example: 'Ich <b>kann</b> gut schwimmen.',
                    exampleTranslate: 'modalGroupA.exampleTranslateFirst'
                },
                {
                    name: 'müssen',
                    translation: 'modalGroupA.verbTranslateSecond',
                    example: 'Du <b>musst</b> die Hausaufgaben machen.',
                    exampleTranslate: 'modalGroupA.exampleTranslateSecond'
                },
                {
                    name: 'wollen',
                    translation: 'modalGroupA.verbTranslateThird',
                    example: 'Wir <b>wollen</b> ins Kino gehen.',
                    exampleTranslate: 'modalGroupA.exampleTranslateThird'
                },
                {
                    name: 'möchten',
                    translation: 'modalGroupA.verbTranslateFourth',
                    example: 'Ich <b>möchte</b> einen Kaffee, bitte.',
                    exampleTranslate: 'modalGroupA.exampleTranslateFourth'
                }
            ]
        },
        {
            level: 'B1',
            practice: {title: 'modalGroupB.practice', url: '/modal-verbs/modal-verbs-session-b1'},
            tips: [
                {text: t('modalGroupB.tipFirstB')},
                {text: t('modalGroupB.tipSecondB')},
                {text: t('modalGroupB.tipThirdB')},
            ],
            verbs: [
                {
                    name: 'dürfen',
                    translation: 'modalGroupB.verbTranslateFirst',
                    example: 'Hier <b>darf</b> man nicht rauchen.',
                    exampleTranslate: 'modalGroupB.exampleTranslateFirst'
                },
                {
                    name: 'sollen',
                    translation: 'modalGroupB.verbTranslateSecond',
                    example: 'Ich <b>soll</b> mehr schlafen.',
                    exampleTranslate: 'modalGroupB.exampleTranslateSecond'
                }
            ]
        }
    ]);

    const openTips = (tipps) => {
        activeTipps.value = tipps;
        showTips.value = true;
    };

    const initLottieIcon = async () => {
        await nextTick();
        if (lottieInstance) {
            lottieInstance.destroy();
            lottieInstance = null;
        }
        if (tipRef.value) {
            lottieInstance = Lottie.loadAnimation({
                container: tipRef.value,
                renderer: 'svg',
                loop: false,
                autoplay: true,
                animationData: TipIcon,
            });
        }
    };

    const checkScreenSize = () => {
        isMobileLayout.value = window.innerWidth <= 767;
        if (!isMobileLayout.value) isContentVisible.value = false;
    };

    const closeContent = () => {
        isContentVisible.value = false;
    };

    const selectGroup = async (group) => {
        selectedGroup.value = group;
        if (isMobileLayout.value) {
            await nextTick();
            isContentVisible.value = true;
        }
    };

    onMounted(() => {
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        if (!isMobileLayout.value) {
            selectedGroup.value = modalGroups.value[0];
        }
        initLottieIcon();
    });

    onUnmounted(() => {
        window.removeEventListener('resize', checkScreenSize);
        if (lottieInstance) lottieInstance.destroy();
    });

    watch(selectedGroup, initLottieIcon);
</script>

<style scoped>
    .modal-verbs-page {
        display: flex;
        width: 100%;
        height: 100vh;
        padding: 20px;
        background: #f7f9fc;
        gap: 20px;
        font-family: "Nunito", sans-serif;
    }

    .sidebar {
        min-width: 350px;
        background: #ffffff;
        border: 3px solid #1e1e1e;
        border-radius: 15px;
        padding: 25px;
        box-shadow: 6px 6px 0px #1e1e1e;
        flex-shrink: 0;
    }

    .btn__back {
        display: block;
        text-align: center;
        width: 100%;
        padding: 0.8rem;
        margin-bottom: 2rem;
        font-size: 1.2rem;
        border-radius: 12px;
        cursor: pointer;
        background-color: #f1c40f;
        color: #1e1e1e;
        text-decoration: none;
        border: 3px solid #1e1e1e;
        box-shadow: 4px 4px 0px #1e1e1e;
        transition: background-color 0.2s;
    }

    .sidebar__title {
        font-size: 1.8rem;
        font-weight: bold;
        margin: 0 0 10px 0;
        text-align: center;
    }

    .sidebar__heading {
        margin-bottom: 20px;
        text-align: center;
        font-size: 1.2rem;
        font-weight: 600;
        color: #60a5fa;
        text-transform: uppercase;
    }

    .sidebar__list {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .sidebar__item {
        margin-bottom: 12px;
    }

    .sidebar__button {
        width: 100%;
        text-align: left;
        padding: 12px 20px;
        background: #f0f0f0;
        border: 2px solid #1e1e1e;
        border-radius: 8px;
        cursor: pointer;
        font-weight: bold;
        font-size: 1.1rem;
        transition: all 0.2s ease-in-out;
        box-shadow: 3px 3px 0px #1e1e1e;
    }

    .sidebar__button:hover {
        background: #e0e0e0;
    }

    .sidebar__button:active {
        transform: translate(3px, 3px);
        box-shadow: none;
    }

    .sidebar__item--active .sidebar__button {
        color: #1e1e1e;
        background: #4ade80;
    }

    .content {
        border-radius: 15px;
        border: 3px solid #1e1e1e;
        flex-grow: 1;
        background: #fdfdfd;
        padding: 30px;
        overflow-y: auto;
        box-shadow: 6px 6px 0px #1e1e1e;
        display: flex;
        flex-direction: column;
        gap: 20px;
        position: relative;
    }

    .placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: #aaa;
        text-align: center;
        font-size: 1.5rem;
    }

    .content__header {
        background: #f97028;
        border: 3px solid #000;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 5px 5px 0px #000;
        margin-bottom: 20px;
    }

    .content__title {
        color: white;
        font-size: 2.5rem;
        font-weight: bold;
        text-shadow: 2px 2px 0px #000;
        text-align: center;
    }

    .content__body {
        display: flex;
        flex-grow: 1;
        border: 3px solid #1e1e1e;
        padding: 20px;
        border-radius: 20px;
        box-shadow: 6px 6px 0px #1e1e1e;
        background: #fff;
    }

    .content__main-column {
        width: 60%;
        padding-right: 20px;
        border-right: 3px dashed #cccccc;
        overflow-y: auto;
    }

    .info-section__title {
        font-size: 1.8rem;
        font-weight: bold;
        margin-bottom: 20px;
        color: #333;
    }

    .example {
        background: #f5f5f5;
        border: 2px solid #ddd;
        border-left: 6px solid #ffab00;
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 12px;
    }

    .verb-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }

    .verb-info {
        display: flex;
        align-items: baseline;
        gap: 10px;
    }

    .verb-name {
        font-size: 1.5rem;
        font-weight: bold;
    }

    .verb-translation {
        color: #777;
        font-style: italic;
    }

    .example-details {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .example__sentence {
        font-size: 1.2rem;
    }

    .example__translation {
        color: #777;
        font-size: 1rem;
        font-style: italic;
        margin-top: 5px;
    }

    .practice-area {
        width: 40%;
        padding-left: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        justify-content: center;
    }

    .practice-area__title {
        font-size: 1.8rem;
        font-weight: bold;
        margin-bottom: 1rem;
    }

    .practice-area__button {
        display: block;
        text-decoration: none;
        background: #28a745;
        color: #fff;
        border: 3px solid #000;
        border-radius: 8px;
        padding: 15px 30px;
        font-size: 1.3rem;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        box-shadow: 4px 4px 0px #000;
        width: 100%;
    }

    .practice-area__button:hover {
        background: #218838;
    }

    .practice-area__button:active {
        transform: translate(4px, 4px);
        box-shadow: none;
    }

    .info__wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .info__icon-tips {
        width: 60px;
        cursor: pointer;
        border: none;
        background: none;
    }

    .btn__close {
        position: absolute;
        top: 20px;
        right: 20px;
        width: 40px;
        height: 40px;
        background-color: #f1c40f;
        border: 3px solid #1e1e1e;
        border-radius: 50%;
        font-size: 24px;
        font-weight: bold;
        color: #1e1e1e;
        cursor: pointer;
        z-index: 100;
        display: none;
        justify-content: center;
        align-items: center;
    }

    .tips__overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.6);
        z-index: 1000;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .tips__content {
        position: relative;
        background: white;
        padding: 2rem;
        border-radius: 16px;
        border: 3px solid #1e1e1e;
        box-shadow: 8px 8px 0 #1e1e1e;
        width: 90%;
        max-width: 500px;
    }

    .tips__close {
        position: absolute;
        top: 10px;
        right: 10px;
        background: #f97028;
        color: #fff;
        border: 2px solid #1e1e1e;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        font-size: 1.5rem;
        font-weight: bold;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .tipps__title {
        font-size: 1.8rem;
        font-weight: bold;
        margin-bottom: 1.5rem;
    }

    .tips__item {
        margin-bottom: 1rem;
    }

    .tips__text {
        font-size: 1.1rem;
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 8px;
        border-left: 5px solid #60a5fa;
    }

    @media (max-width: 1024px) {
        .content__body {
            flex-direction: column;
        }

        .content__main-column, .practice-area {
            width: 100%;
            border-right: none;
            padding: 1rem;
        }

        .content__main-column {
            padding-bottom: 2rem;
            border-bottom: 3px dashed #cccccc;
        }

        .practice-area {
            padding-top: 2rem;
        }

        .content__title {
            font-size: 2rem;
        }
    }

    @media (max-width: 767px) {
        .modal-verbs-page {
            position: relative;
            overflow-x: hidden;
            display: block;
            padding: 0;
            gap: 0;
        }

        .sidebar {
            width: 100%;
            height: 100%;
            min-width: unset;
            border-radius: 0;
            box-shadow: none;
            border: none;
        }

        .content {
            position: absolute;
            top: 0;
            left: 100%;
            width: 100%;
            height: 100%;
            z-index: 50;
            transition: transform 0.4s ease-in-out;
            border-radius: 0;
            box-shadow: -5px 0 15px rgba(0, 0, 0, 0.2);
        }

        .modal-verbs-page.content-is-active .content {
            transform: translateX(-100%);
        }

        .btn__close {
            display: flex;
        }
    }
</style>