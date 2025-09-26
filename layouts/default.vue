<template>
    <div class="layout">
        <slot></slot>
        <vScroll/>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useUiSettingsStore } from '../store/uiSettingsStore.js'

const uiStore = useUiSettingsStore()

onMounted(() => {
    // Когда компонент макета смонтирован, мы считаем, что UI готов.
    // Небольшая задержка, чтобы дать Vue закончить отрисовку.
    setTimeout(() => {
        uiStore.isUiReady = true
    }, 3000 ) // 200мс — это небольшая страховка
})
</script>

<style scoped>
</style>