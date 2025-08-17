<template>
    <div class="quest-page">
        <header>
            <h1>{{ quest?.title || 'Квест' }}</h1>
            <p class="goal" v-if="quest">Цель: {{ quest.conditions.goal }}</p>
        </header>

        <div v-if="!quest" class="empty">Квест не найден.</div>

        <div v-else class="task">
            <div class="q" v-text="current?.question"></div>

            <div class="opts">
                <button
                        v-for="opt in current?.options || []"
                        :key="opt"
                        class="opt"
                        @click="answer(opt)"
                >
                    {{ opt }}
                </button>
            </div>

            <div class="progress">
                Правильно: {{ correct }}/{{ totalNeeded }}
            </div>
        </div>
    </div>
</template>

<script setup>
import {ref, computed, onMounted, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useQuestChainStore} from '../../store/questChainStore.js'



const route = useRoute()
const router = useRouter()
const chain = useQuestChainStore()

console.log('Quest page mounted with params:', route.params)

// Проверяем, что страница загрузилась
console.log('Quest page loaded successfully')

const questId = computed(() => String(route.params.questId || ''))
const regionId = computed(() => String(route.params.id || 'east-plain'))

const quest = ref(null)
const tasks = ref([])
const idx = ref(0)
const correct = ref(0)

async function loadQuest() {
    console.log('Loading quest:', questId.value, 'for region:', regionId.value)
    try {
        const res = await fetch(`/quests/quests-${regionId.value}.json`)
        const data = await res.json()
        quest.value = data.find(q => q.questId === questId.value) || null
        console.log('Found quest:', quest.value)
        tasks.value = quest.value?.tasks || []
        idx.value = 0
        correct.value = 0
    } catch (error) {
        console.error('Error loading quest:', error)
        quest.value = null
        tasks.value = []
    }
}

const totalNeeded = computed(() => {
    const required = quest.value?.conditions?.requiredTasks ?? 0
    return Math.min(required, tasks.value.length)
})
const current = computed(() => tasks.value[idx.value] || null)

function answer(opt) {
    if (!current.value) return
    if (opt === current.value.answer) correct.value += 1
    if (idx.value + 1 >= totalNeeded.value) finish()
    else idx.value += 1
}

function finish() {
    const minCorrect = quest.value?.conditions?.minCorrect ?? 0
    const success = correct.value >= minCorrect
    if (success) {
        chain.complete(regionId.value, questId.value)
        router.replace({name: 'location-id', params: {id: regionId.value}})
    } else {
        const got = correct.value
        idx.value = 0
        correct.value = 0
        alert(`Недостаточно правильных ответов (${got}/${minCorrect}). Попробуй ещё раз!`)
    }
}

onMounted(loadQuest)
watch([questId, regionId], loadQuest)
</script>


<style scoped>
.quest-page {
    padding: 20px;
}

.goal {
    color: #94a3b8;
}

.task {
    margin-top: 16px;
}

.q {
    font-size: 18px;
    margin-bottom: 12px;
}

.opts {
    display: grid;
    gap: 8px;
}

.opt {
    height: 40px;
    border-radius: 10px;
    border: 1px solid #1f2937;
    background: #0b1220;
    color: #fff;
    cursor: pointer;
}

.opt:hover {
    background: #111827;
}

.progress {
    margin-top: 10px;
    color: #cbd5e1;
}
</style>
