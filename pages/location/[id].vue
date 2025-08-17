<script setup>
import {ref, computed, onMounted, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useCurrentUser} from 'vuefire'
import {regions} from '../../utils/regions.js'
import {useQuestChainStore} from '../../store/questChainStore.js'
import QuestMarker from '../../src/components/QuestMarker.vue'
import QuestDrawer from '../../src/components/QuestDrawer.vue'


import npcAvatar from '../../assets/images/npcAvatar/npc-owl.png'

const route = useRoute()
const router = useRouter()
const chain = useQuestChainStore()
const user = useCurrentUser()


const routeParams = computed(() => route.params.id)
const regionId = computed(() => {
    return regions.find(r => r.pathTo === routeParams.value)?.id || routeParams.value || 'east-plain'
})
const allQuests = ref([])
const error = ref('')
const drawerOpen = ref(false)

async function loadQuests() {
    const questUrl = `/quests/quests-${regionId.value}.json`
    error.value = ''
    allQuests.value = []
    try {
        const res = await fetch(questUrl)
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
        const data = await res.json()
        allQuests.value = Array.isArray(data) ? data : []
        const order = allQuests.value.map(q => q.questId)
        if (regionId.value) {
            chain.initRegion(regionId.value, order)
        }
    } catch (e) {
        console.error('Error loading quests:', e)
        error.value = e?.message || String(e)
    }
}

onMounted(() => {
    if (typeof window !== 'undefined' && !chain.hydrated) chain.hydrate()
    if (route.params.id) {
        loadQuests()
    }
    watch(routeParams, (newParams) => {
        if (newParams) {
            loadQuests()
        }
    })
})

const currentQuestId = computed(() => chain.nextLockedId(regionId.value))
const currentQuest = computed(() => {
    return allQuests.value.find(q => q.questId === currentQuestId.value) || null
})

function openDrawer() {
    if (currentQuest.value) drawerOpen.value = true
}

async function acceptQuest() {
    if (!currentQuest.value) return

    chain.accept(regionId.value, currentQuest.value.questId)
    drawerOpen.value = false

    try {
        await router.push({

            params: {

                id: regionId.id,
                questId: currentQuest.value.questId
            }
        })
    } catch (e) {
        console.error('Navigation failed:', e)
    }
}
</script>

<template>
    <div class="location-page">
        <ClientOnly>
            <QuestMarker
                    v-if="currentQuest && allQuests.length > 0"
                    class="npc"
                    :avatar-src="npcAvatar"
                    @open="openDrawer"
            />
            <QuestDrawer
                    :open="drawerOpen"
                    :quest="currentQuest"
                    @close="drawerOpen = false"
                    @accept="acceptQuest"
            />
        </ClientOnly>

        <div v-if="error" class="error">Не удалось загрузить квесты: {{ error }}</div>
    </div>
</template>

<style>
.location-page {
    position: relative;
    min-height: 60vh;
    padding: 0;
}

.npc {
    left: 24px;
    bottom: 40px;
}

.error {
    position: absolute;
    left: 24px;
    bottom: 110px;
    padding: 8px 10px;
    border-radius: 8px;
    border: 1px solid #7f1d1d;
    background: #3f1d1d;
    color: #fff;
}
</style>