<template>
  <div v-if="friend">
    <h3>Профиль друга</h3>
    <div class="friend-card">
      <img
          v-if="friend.avatar"
          :src="friend.avatar"
          class="avatar"
          alt="аватар"
      />
      <div class="info">
        <div class="name">{{ friend.name }}</div>
        <div class="email">{{ friend.email }}</div>
        <div class="exp">Опыт: {{ friend.exp }}</div>
        <div class="level">Уровень: {{ friend.isLeveling }}</div>
        <div class="premium" v-if="friend.gotPremiumBonus">Premium ✔</div>
      </div>
    </div>
  </div>
  <p v-else>Профиль не найден.</p>
</template>

<script setup>
const props = defineProps({
  friend: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.friend-card {
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 16px;
  padding: 16px 20px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  object-fit: cover;
  border: 2px solid var(--border, #ccc);
  background: #fff;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.name {
  font-weight: 700;
  font-size: 1.2rem;
  color: #333;
}

.email {
  color: #555;
  font-size: 0.95rem;
  font-style: italic;
}

.exp, .level, .premium {
  font-size: 0.95rem;
  color: #222;
}

.level {
  font-weight: 600;
  color: #444;
}

.premium {
  color: #0a8f08;
  font-weight: 700;
}

</style>
