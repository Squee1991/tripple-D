<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import WinterEvent from '../../src/components/events-group/winterEvent.vue'
import ValentineEvent from '../../src/components/events-group/ValentineEvent.vue'
import HalloweenEvent from '../../src/components/events-group/halloweenEvent.vue'
import AprilJokeEvent from '../../src/components/events-group/aprilJokeEvent.vue'
import {useSeoMeta} from "#imports";
const route = useRoute()
const eventId = computed(() => String(route.params.id))

useSeoMeta({
  robots: 'noindex, nofollow'
})

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
