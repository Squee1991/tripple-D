<template>
    <p class="typewriter" @click="skip">
        <span>{{ output }}</span>
        <span v-if="cursor && !done" class="caret">▋</span>
    </p>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
    text: { type: String, default: '' },  // исходный текст
    speed: { type: Number, default: 28 }, // мс между символами
    startDelay: { type: Number, default: 120 }, // задержка перед стартом
    cursor: { type: Boolean, default: true },   // мигающий курсор
    smartPause: { type: Boolean, default: true } // подольше после . , ! ? :
})

const emit = defineEmits(['done'])

const output = ref('')
const done = ref(false)
let timer = null
let i = 0

function nextDelay(ch) {
    if (!props.smartPause) return props.speed
    if (/[.!?]/.test(ch)) return props.speed * 6
    if (/[,;:]/.test(ch)) return props.speed * 3
    if (/\n/.test(ch)) return props.speed * 4
    return props.speed
}

function typeOnce() {
    if (i >= props.text.length) {
        done.value = true
        emit('done')
        return
    }
    const ch = props.text[i++]
    output.value += ch
    timer = setTimeout(typeOnce, nextDelay(ch))
}

function start() {
    stop()
    output.value = ''
    done.value = false
    i = 0
    timer = setTimeout(typeOnce, props.startDelay)
}

function stop() {
    if (timer) { clearTimeout(timer); timer = null }
}

function skip() {
    stop()
    output.value = props.text
    done.value = true
    emit('done')
}

watch(() => props.text, start, { immediate: true })
onMounted(start)
onBeforeUnmount(stop)
</script>

<style scoped>
.typewriter {
    white-space: pre-wrap;
    line-height: 1.5;
}
.caret {
    display: inline-block;
    margin-left: 2px;
    animation: blink 1s step-end infinite;
    opacity: .8;
}
@keyframes blink { 50% { opacity: 0; } }
</style>
