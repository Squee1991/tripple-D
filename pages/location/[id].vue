<template>
    <div class="location-page">
        <div class="location__wrapper">
            <header class="location-header">
                <button class="close-btn" @click="goHome" aria-label="to main">×</button>
                <h1 class="region__title-name">{{ t(region?.name) }}</h1>
            </header>
            <div v-if="loading" class="loading">{{ t('locationQuests.loading') }}</div>
            <div v-else class="quests">
                <div v-if="error" class="error">
                    {{ t('locationQuests.error') }}<br/>
                    <div class="tiny">
                        URL: {{ url }}<br/>
                        {{ error }}
                    </div>
                </div>
                <ul v-else-if="questsView.length" class="quest-list">
                    <li
                            v-for="q in questsView"
                            :key="q.questId"
                            class="quest-card"
                            :class="{ completed: q._success }"
                    >
                        <div v-if="q._success" class="stamp">{{ t('locationQuests.done') }}</div>
                        <h3 class="quest__title">{{ t(q.title) }}</h3>
                        <p class="quest__description">{{ t(q.description) }}</p>
                        <div class="quest-meta">
                            <span v-if="!q._success" class="rewards-container">
                                <span class="reward-item">
                                    {{ q.rewards.points }}
                                    <img src="assets/images/articlus.png" alt="Артиклюсы" class="icon-articlus">
                                </span>
                                <span class="reward-item">
                                    {{ q.rewards.xp }} XP
                                </span>
                            </span>
                            <span v-else>{{ t('locationQuests.gotAward') }}</span>
                        </div>
                        <button class="btn" @click="startQuest(q)">
                            {{ q._success ? t('locationQuests.repeat') : t('locationQuests.start') }}
                        </button>
                    </li>
                </ul>
                <div v-else class="empty">{{ t('locationQuests.notFound') }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {ref, computed, watch, onMounted} from "vue";
import {useRoute, useRouter} from "vue-router";
import {regions} from "~/utils/regions.js";
import {userChainStore} from "~/store/chainStore.js";
import {useHead, useSeoMeta, useRuntimeConfig} from '#imports'
import {useCanonical} from "../../composables/useCanonical.js";

const route = useRoute()
const canonical = useCanonical()
const {t} = useI18n();

const pageTitle = t('metaLocation.title')
const pageDesc = t('metaLocation.description')
useHead({
    title: pageTitle,
    link: [{rel: 'canonical', href: canonical}]
})
useSeoMeta({
    title: pageTitle,
    description: pageDesc,
    ogTitle: pageTitle,
    ogDescription: pageDesc,
    ogType: 'website',
    ogUrl: canonical,
    ogImage: '/images/seo-lands.png',
    robots: 'index, follow'
})

const router = useRouter();
const chainStore = userChainStore();

const regionKey = computed(() => String(route.query.region || route.params.id || ""));
const region = computed(() => regions.find(r => r.pathTo === regionKey.value));
const url = computed(() => `/quests/quests-${regionKey.value}.json`);

const quests = ref([]);
const loading = ref(false);
const error = ref("");

async function loadQuests() {
    loading.value = true;
    error.value = "";
    quests.value = [];
    try {
        const res = await fetch(url.value);
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const data = await res.json();
        quests.value = Array.isArray(data) ? data : data.quests || [data];
    } catch (err) {
        error.value = err.message;
    } finally {
        loading.value = false;
    }
}

onMounted(() => {
    chainStore.loadProgressFromFirebase();
});
watch(regionKey, loadQuests, {immediate: true});

const questsView = computed(() =>
    quests.value.map(q => {
        const p = chainStore.questProgress?.[q.questId] || {};
        return {
            ...q,
            _success: !!p.success,
            _completed: !!p.completed
        }
    })
);

function startQuest(q) {
    if (!q?.questId) return;
    router.push({path: `/location/quest-${q.questId}`, query: {region: regionKey.value}});
}

function goHome() {
    router.push({path: "/"});
}
</script>

<style scoped>
.location-page {
    padding: 20px;
    min-height: 100vh;
    color: #1b1b1b;
    font-family: "Nunito", sans-serif;
    max-width: 1200px;
    margin: 0 auto;
}

.close-btn {
    width: 46px;
    height: 46px;
    border: 3px solid #111;
    border-radius: 14px;
    background: linear-gradient(180deg, #FFE690 0%, #FFD54D 100%);
    color: #111;
    font-weight: 900;
    font-size: 28px;
    line-height: 1;
    box-shadow: 4px 4px 0 #2b2b2b;
    cursor: pointer;
    transition: all .1s ease-in-out;
}

.close-btn:active {
    transform: translate(2px, 2px);
    box-shadow: 3px 3px 0 #2b2b2b;
}

.close-btn:focus-visible {
    outline: 3px dashed #111;
    outline-offset: 3px;
}

.region__title-name {
    font-size: 32px;
}

.location-header {
    display: flex;
    align-items: center;
    gap: 30px;
    position: relative;
    padding: 22px 24px 20px;
    background: linear-gradient(180deg, #FFF4C8 0%, #FFEBA4 100%);
    border: 3px solid #111;
    border-radius: 22px;
    box-shadow: 4px 4px 0 #2b2b2b;
    margin-bottom: 18px;
    overflow: visible;
}

.location-desc {
    margin: 0;
    color: #3b3b3b;
}

.loading, .error, .empty {
    margin-top: 16px;
    padding: 12px 14px;
    border-radius: 16px;
    border: 3px solid #111;
    background: #fff;
    color: #111;
    box-shadow: 6px 6px 0 #2b2b2b;
}

.error {
    background: #FFE7E7;
}

.empty {
    opacity: .96;
}

.tiny {
    font-size: 12px;
    opacity: .85;
    margin-top: 6px;
}

.quest-list {
    display: grid;
    grid-template-columns:repeat(auto-fill, minmax(280px, 1fr));
    gap: 30px;
    align-items: stretch;
    margin-top: 12px;
}

.quest-card {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 12px;
    height: 100%;
    min-height: 380px;
    background: linear-gradient(90deg, #8ddcff 0%, #bfa7ff 100%) 0 0/100% 12px no-repeat,
    #FFFDF3;
    color: #111;
    border: 3px solid #111;
    border-radius: 20px;
    padding: 18px 16px 16px;
    box-shadow: 4px 4px 0 #2b2b2b;
    transform: translateY(0) rotate(-.1deg);
    transition: all .1s ease-in-out;
    opacity: 0;
    animation: pop .45s cubic-bezier(.2, .8, .25, 1) forwards;
}

.quest-card:nth-child(6n+2) {
    background: linear-gradient(90deg, #ffb4b4 0%, #ffd19a 100%) 0 0/100% 12px no-repeat,
    #FFFDF3;
}

.quest-card:nth-child(6n+3) {
    background: linear-gradient(90deg, #b0f2b6 0%, #8be39a 100%) 0 0/100% 12px no-repeat,
    #FFFDF3;
}

.quest-card:nth-child(6n+4) {
    background: linear-gradient(90deg, #ffd88c 0%, #ffc26a 100%) 0 0/100% 12px no-repeat,
    #FFFDF3;
}

.quest-card:nth-child(6n+5) {
    background: linear-gradient(90deg, #a7f3eb 0%, #74d8e8 100%) 0 0/100% 12px no-repeat,
    #FFFDF3;
}

.quest-card:nth-child(6n) {
    background: linear-gradient(90deg, #f9a8ff 0%, #d8b4fe 100%) 0 0/100% 12px no-repeat,
    #FFFDF3;
}

.quest-card::before {
    content: "";
    position: absolute;
    inset: 8px;
    border-radius: 16px;
    outline: 10px solid #fff;
    pointer-events: none;
}

.quest-card::after {
    content: "!";
    position: absolute;
    top: -10px;
    left: -10px;
    width: 36px;
    height: 36px;
    display: grid;
    place-items: center;
    background: #FFEC77;
    color: #111;
    font-weight: 900;
    font-size: 22px;
    line-height: 1;
    border: 3px solid #111;
    border-radius: 50%;
    box-shadow: 6px 6px 0 #2b2b2b;
    transform: rotate(-8deg);
    animation: wiggle 2.8s ease-in-out infinite;
}

.quest-card.completed {
    opacity: .98;
}

.quest-card.completed .quest__title {
    text-decoration: none;
}

.stamp {
    position: absolute;
    top: -6px;
    right: -20px;
    transform: rotate(9deg);
    font-size: 14px;
    background: linear-gradient(180deg, #6a74a5 0%, #5d7fc1 100% 100%);
    color: white;
    border: 3px solid #111;
    border-radius: 12px;
    padding: 8px 14px;
    font-weight: 900;
    letter-spacing: .04em;
    box-shadow: 4px 4px 0 #2b2b2b;
    z-index: 3;
}

.quest__title {
    margin: 2px 0 0;
    padding: 10px;
    min-height: 75px;
    font-size: 20px;
    font-weight: 900;
    text-align: center;
    display: flex;
    justify-content: center;
    gap: 6px;
}

.ok-mark {
    font-size: 18px;
}

.quest__description {
    margin: 4px 0 0;
    color: #2b2b2b;
}

.quest-details {
    margin: 0;
    padding: 10px 12px;
    background: #F4F7FF;
    border: 3px solid #111;
    border-radius: 12px;
    box-shadow: 4px 4px 0 #2b2b2b;
}

.quest-details p {
    margin: 6px 0;
}

.quest-meta {
    margin-top: auto;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.quest-meta .rewards-container {
    display: inline-flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    padding: 6px 12px;
    font-size: 14px;
    background: #FFF3D7;
    border: 3px solid #111;
    border-radius: 999px;
    box-shadow: 4px 4px 0 #2b2b2b;
}

.reward-item {
    display: inline-flex;
    align-items: center;
}

.icon-articlus {
    width: 30px;
    height: 27px;
    vertical-align: middle;
}

.btn {
    position: relative;
    height: 46px;
    padding: 0 22px;
    margin-top: 12px;
    border-radius: 14px;
    font-weight: 900;
    letter-spacing: .02em;
    border: 3px solid #111;
    background: linear-gradient(180deg, #B9F2B0 0%, #5EDB6A 100%);
    color: #111;
    cursor: pointer;
    box-shadow: 4px 4px 0 #2b2b2b;
    transition: transform .12s ease, box-shadow .12s ease, filter .12s ease;
    overflow: hidden;
}

.btn:active {
    transform: translate(2px, 2px);
    box-shadow: 4px 4px 0 #2b2b2b;
}

@keyframes bob {
    0%, 100% {
        transform: translateY(0) rotate(8deg);
    }
    50% {
        transform: translateY(-6px) rotate(8deg);
    }
}

@keyframes wiggle {
    0%, 100% {
        transform: rotate(-8deg) translateY(0);
    }
    50% {
        transform: rotate(-2deg) translateY(-2px);
    }
}

@keyframes pop {
    0% {
        opacity: 0;
        transform: translateY(12px) rotate(-.8deg);
    }
    100% {
        opacity: 1;
        transform: translateY(0) rotate(-.1deg);
    }
}

.quest-card:nth-child(1) { animation-delay: .02s; }
.quest-card:nth-child(2) { animation-delay: .06s; }
.quest-card:nth-child(3) { animation-delay: .10s; }
.quest-card:nth-child(4) { animation-delay: .14s; }
.quest-card:nth-child(5) { animation-delay: .18s; }
.quest-card:nth-child(6) { animation-delay: .22s; }
.quest-card:nth-child(7) { animation-delay: .26s; }
.quest-card:nth-child(8) { animation-delay: .30s; }
.quest-card:nth-child(9) { animation-delay: .34s; }
.quest-card:nth-child(10) { animation-delay: .38s; }


@media (max-width: 767px) {
    .close-btn {
        width: 44px;
        height: 44px;
        font-size: 26px;
        top: 10px;
    }

    .location-header {
        padding: 14px;
    }

    .region__title-name {
        font-size: 24px;
    }

    .quest-list {
        grid-template-columns:1fr;
        gap: 16px;
    }

    .quest-card {
        box-shadow: 4px 4px 0 black;
    }

    .location-header:after {
        transform: scale(.9) rotate(8deg);
    }

    .icon-articlus {
        width: 22px;
        height: 20px;
    }
}

@media (min-width: 1024px) {
    .quest-card:hover {
        transform: translate(2px, 2px);
        box-shadow: 2px 2px 0 #2b2b2b;
    }

    .btn:hover {
        transform: translate(2px, 2px);
        box-shadow: 2px 2px 0 #2b2b2b;
    }

    .close-btn:hover {
        transform: translate(2px, 2px);
        box-shadow: 2px 2px 0 #2b2b2b;
    }
}

@media (max-width: 766px) {
    .location-page {
        padding: 12px;
    }

    .location-header {
        padding: 10px 14px;
        gap: 15px;
        margin-bottom: 12px;
        border-radius: 16px;
    }

    .close-btn {
        width: 40px;
        height: 40px;
        font-size: 24px;
        border-radius: 12px;
        box-shadow: 3px 3px 0 #2b2b2b;
    }

    .region__title-name {
        font-size: 22px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .quest-list {
        grid-template-columns: 1fr;
        gap: 14px;
        margin-top: 8px;
    }

    .quest-card {
        min-height: auto;
        padding: 14px;
        gap: 8px;
        border-radius: 16px;
        box-shadow: 3px 3px 0 #2b2b2b;
    }

    .quest-card::before {
        inset: 6px;
        outline: 8px solid #fff;
    }

    .quest-card::after {
        top: -8px;
        left: -8px;
        width: 30px;
        height: 30px;
        font-size: 18px;
        border: 2px solid #111;
        box-shadow: 4px 4px 0 #2b2b2b;
    }

    .quest__title {
        font-size: 18px;
        padding: 6px;
    }

    .quest__description {
        font-size: 14px;
    }

    .quest-meta .rewards-container {
        font-size: 13px;
        padding: 4px 8px;
        box-shadow: 3px 3px 0 #2b2b2b;
    }

    .btn {
        height: 40px;
        margin-top: 8px;
        font-size: 15px;
        border-radius: 12px;
        box-shadow: 3px 3px 0 #2b2b2b;
    }

    .stamp {
        top: -4px;
        right: -10px;
        transform: rotate(5deg);
        font-size: 12px;
        padding: 6px 10px;
        box-shadow: 3px 3px 0 #2b2b2b;
    }

    .location-header::after {
        content: none;
    }
}

@media (min-width: 767px) {
    .location-header::after {
        content: "!";
        position: absolute;
        top: 0;
        right: 0;
        width: 56px;
        height: 56px;
        display: grid;
        place-items: center;
        background: radial-gradient(circle at 35% 30%, #ffe08a 0 45%, #facc15 46% 70%, #d97706 71% 100%);
        color: #111;
        font-weight: 900;
        font-size: 34px;
        line-height: 1;
        border: 3px solid #111;
        border-radius: 50%;
        box-shadow: 8px 8px 0 #2b2b2b;
        transform: rotate(8deg);
        animation: bob 2.2s ease-in-out infinite;
        z-index: 2;
    }
}
</style>
