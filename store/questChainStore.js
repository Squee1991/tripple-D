import {defineStore} from 'pinia'

const KEY = 'questChain.v1'
const isClient = import.meta.client

function loadSaved() {
    if (!isClient) return {byRegion: {}}
    try {
        return JSON.parse(localStorage.getItem(KEY)) || {byRegion: {}}
    } catch {
        return {byRegion: {}}
    }
}

function persist(state) {
    if (isClient) localStorage.setItem(KEY, JSON.stringify(state))
}

export const useQuestChainStore = defineStore('questChain', {
    state: () => ({byRegion: {}, hydrated: false}),
    getters: {
        nextLockedId: (s) => (regionId) => {
            const rp = s.byRegion[regionId];
            console.log('nextLockedId called for region:', regionId, 'region data:', rp)
            if (!rp) return null
            for (const id of rp.order) {
                if (!rp.completed.includes(id)) {
                    console.log('Found next locked quest:', id)
                    return id
                }
            }
            console.log('No locked quests found')
            return null
        },
    },
    actions: {
        hydrate() {
            const saved = loadSaved();
            this.byRegion = saved.byRegion || {};
            this.hydrated = true
        },
        initRegion(regionId, order) {
            if (!this.byRegion[regionId]) {
                this.byRegion[regionId] = {
                    order,
                    unlocked: order.length ? [order[0]] : [],
                    completed: [],
                    accepted: null
                }
                persist(this.$state)
            }
        },
        accept(regionId, questId) {
            console.log('QuestChainStore: accept called', { regionId, questId })
            const rp = this.byRegion[regionId];
            console.log('Region data:', rp)
            if (!rp || !rp.unlocked.includes(questId)) {
                console.log('Quest not unlocked or region not found')
                return
            }
            rp.accepted = questId;
            console.log('Quest accepted:', questId)
            persist(this.$state)
        },
        complete(regionId, questId) {
            const rp = this.byRegion[regionId];
            if (!rp) return
            if (!rp.completed.includes(questId)) rp.completed.push(questId)
            if (rp.accepted === questId) rp.accepted = null
            const idx = rp.order.indexOf(questId);
            const next = rp.order[idx + 1]
            if (next && !rp.unlocked.includes(next)) rp.unlocked.push(next)
            persist(this.$state)
        },
        reset(regionId) {
            const rp = this.byRegion[regionId];
            if (!rp) return
            this.byRegion[regionId] = {
                order: [...rp.order],
                unlocked: rp.order.length ? [rp.order[0]] : [],
                completed: [],
                accepted: null
            }
            persist(this.$state)
        },
    }
})
