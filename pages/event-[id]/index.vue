<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import WinterEvent from '../../src/components/winterEvent.vue'
import ValentineEvent from '../../src/components/ValentineEvent.vue'
import HalloweenEvent from '../../src/components/halloweenEvent.vue'
import AprilJokeEvent from '../../src/components/aprilJokeEvent.vue'
const route = useRoute()
const eventId = computed(() => String(route.params.id))

const EventViews = {
  winter: WinterEvent,
  valentine: ValentineEvent,
  halloween: HalloweenEvent,
  joke: AprilJokeEvent,
}

const currentEventView = computed(() => EventViews[eventId.value] || null)
</script>

<template>
  <component :is="currentEventView"/>
</template>
