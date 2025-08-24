<!-- QuestMarker.vue -->
<template>
    <div class="marker" @click="$emit('open')">
        <div class="halo"></div>
        <img class="avatar" :src="avatarUrl" alt="npc"/>

         <span class="bang">!</span>
    </div>
</template>

<script setup>
import {computed} from 'vue'
import fallbackAvatar from '../../assets/images/npcAvatar/npc-owl.png'

const props = defineProps({avatarSrc: {type: String, default: ''}})
const avatarUrl = computed(() => props.avatarSrc || fallbackAvatar)
</script>

<style scoped>
.marker {
    position: absolute;
    cursor: pointer;
    user-select: none;
}

.avatar {
    width: 64px;
    height: 64px;
    border-radius: 999px;
    object-fit: cover;
    box-shadow: 0 8px 24px rgba(0, 0, 0, .45);
    transition: transform .18s ease, filter .18s ease;
}

.marker:hover .avatar {
    transform: translateY(-2px) scale(1.02);
    filter: contrast(1.05);
}

.halo {
    position: absolute;
    inset: -8px;
    border-radius: 999px;
    background: radial-gradient(35px 35px at 50% 50%, rgba(255, 196, 120, .45), rgba(255, 196, 120, .0) 70%);
    animation: pulse 1.8s ease-in-out infinite;
    pointer-events: none;
}

@keyframes pulse {
    0%, 100% {
        opacity: .65;
        transform: scale(1)
    }
    50% {
        opacity: .35;
        transform: scale(1.08)
    }
}
</style>
