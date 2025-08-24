<template>
    <teleport to="body">
        <div v-if="open" class="overlay" @click="emit('close')"/>
        <aside :class="['drawer', { open }]">

            <header class="head">
                <div class="npc">
                    <img :src="questAvatar" alt="npc"/>
                    <div class="title">
                        <h3>{{ quest?.title }}</h3>
                    </div>
                </div>
                <button class="x" @click="emit('close')">×</button>
            </header>

            <section class="body" v-if="quest">
                <!-- Печатается ТУТ, в прокручиваемой области -->
                <TypeWriter
                        :text="quest.description || ''"
                        :speed="26"
                        :start-delay="140"
                        :cursor="true"
                        :smart-pause="true"
                        @done="typedDone = true"
                />

                <transition name="fade">
                    <div v-if="typedDone">
                        <ul class="conditions">
                            <li>🎯 {{ quest.conditions.goal }}</li>
                            <li>✅ Правильных ответов: {{ quest.conditions.minCorrect }} /
                                {{ quest.conditions.requiredTasks }}
                            </li>
                        </ul>
                        <div class="rewards">
                            <span class="chip">💎 {{ quest.rewards.points }}</span>
                            <span class="chip">XP {{ quest.rewards.xp }}</span>
                        </div>
                    </div>
                </transition>
            </section>

            <footer class="foot">
                <button class="btn-accept" @click="handleAccept">Принять квест</button>
            </footer>
        </aside>
    </teleport>
</template>

<script setup>
import {ref, computed, watch} from 'vue'
import npc from '../../assets/images/npcAvatar/npc-owl.png'
import TypeWriter from '../../src/components/TypeWriter.vue'

const props = defineProps({open: Boolean, quest: Object})
const emit = defineEmits(['close', 'accept'])
const typedDone = ref(false)

const questAvatar = computed(() => npc)

// перезапуск печати при открытии панели/смене квеста
watch(() => [props.open, props.quest?.questId], () => {
    typedDone.value = false
})

function handleAccept() {
    console.log('QuestDrawer: handleAccept called', { quest: props.quest })
    if (props.quest) {
        emit('accept', props.quest)
    }
}
</script>

<style scoped>
.overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, .45);
    backdrop-filter: blur(2px);
    z-index: 50;
}

.drawer {
    position: fixed;
    top: 0;
    right: -420px;
    width: 420px;
    max-width: 100%;
    height: 100dvh;
    z-index: 60;
    display: grid;
    grid-template-rows:auto 1fr auto;
    background: #f2e5c0;
    background-image: radial-gradient(ellipse at top left, rgba(255, 255, 255, .25), transparent 40%),
    radial-gradient(ellipse at bottom right, rgba(0, 0, 0, .08), transparent 45%);
    box-shadow: -18px 0 40px rgba(0, 0, 0, .35);
    transition: right .28s cubic-bezier(.2, .9, .2, 1);
}

.drawer.open {
    right: 0;
}

.head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    border-bottom: 1px solid rgba(0, 0, 0, .1);
    /* фикс: высота хедера не растёт из-за текста */
}

.npc {
    display: flex;
    gap: 12px;
    align-items: center;
    min-width: 0;
}

.npc img {
    width: 48px;
    height: 48px;
    border-radius: 999px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, .25);
}

.title {
    min-width: 0;
}

.title h3 {
    margin: 0;
    font-weight: 800;
    letter-spacing: .3px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.body {
    min-height: 0; /* важно для grid, чтобы секция сжималась */
    overflow: auto; /* скролл только у контента */
    padding: 16px 18px; /* без большого нижнего паддинга — футер отдельной строкой */
}

.conditions {
    margin: 12px 0 0;
    padding-left: 18px;
}

.conditions li {
    margin: 6px 0;
}

.rewards {
    display: flex;
    gap: 8px;
    margin: 14px 0 4px;
}

.chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    border-radius: 999px;
    background: #fee2b6;
    border: 1px solid rgba(0, 0, 0, .12);
    font-weight: 700;
}

.foot {
    position: relative;
    z-index: 1;
    padding: 14px 18px;
    padding-bottom: calc(14px + env(safe-area-inset-bottom));
    border-top: 1px solid rgba(0, 0, 0, .1);
    background: #0b1220; /* сплошной фон, чтобы не просвечивал текст */
}

.btn-accept {
    width: 100%;
    height: 46px;
    border-radius: 12px;
    font-weight: 900;
    letter-spacing: .3px;
    background: linear-gradient(180deg, #9e2a2a, #7c1f1f);
    color: #fff;
    border: 1px solid #2b0f0f;
    box-shadow: 0 8px 18px rgba(126, 31, 31, .35);
    cursor: pointer;
    transition: transform .08s ease, box-shadow .2s ease;
}

.btn-accept:hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 22px rgba(126, 31, 31, .45);
}

.btn-accept:active {
    transform: translateY(0);
}

.x {
    background: transparent;
    border: none;
    font-size: 28px;
    cursor: pointer;
    line-height: 1;
}

/* плавное появление блока условий и наград после печати */
.fade-enter-from, .fade-leave-to {
    opacity: 0;
    transform: translateY(6px);
}

.fade-enter-active, .fade-leave-active {
    transition: .22s ease;
}
</style>
