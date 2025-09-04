
<script setup>
const props = defineProps({
  kind: { type: String, default: 'achievement' },
  title: { type: String, required: true },
})
</script>

<template>
  <div class="ach-toast__wrap" role="status" aria-live="polite">
    <div class="ach-toast__icon" aria-hidden="true">
      <span v-if="kind === 'achievement'">🏆</span>
      <span v-else>🎉</span>
    </div>
    <div class="ach-toast__content">
      <div class="ach-toast__title">
        <template v-if="kind === 'achievement'">
          {{ $t('Достижение') }} «{{ title }}» {{ $t('выполнено') }}!
        </template>
        <template v-else>
          {{ $t('Вы получили награду') }} «{{ title }}»!
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ach-toast__wrap {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: center;
}
.ach-toast__icon {
  font-size: 22px;
  line-height: 1;
}
.ach-toast__title {
  font-weight: 600;
}
</style>
