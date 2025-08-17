import { useQuestChainStore } from '../store/questChainStore.js'
export default defineNuxtPlugin((nuxtApp) => {
    const chain = useQuestChainStore(nuxtApp.$pinia)
    chain.hydrate()
})