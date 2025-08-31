<template>
  <div class="points">
    <section class="points-card" aria-label="Поинты и уровень">
      <header class="points-card__header">
        <h2 class="points-card__title">Профиль</h2>
      </header>
      <ul v-if="langStore" class="points-card__list" aria-label="Сводка">
        <li class="points-card__item">
          <span class="points-card__label">Артиклюсы</span>
          <span class="points-card__value"> {{ langStore.points}}</span>
        </li>
        <li class="points-card__item">
          <span class="points-card__label">Уровень</span>
          <span class="points-card__badge">{{ langStore.isLeveling}}</span>

        </li>
        <div class="points-card__progress">
          <div v-if="langStore.exp" class="progress_exp-bar">
            <div class="progress__bar" :style="{width: `${(langStore.exp / 100) * 100}%`}"></div>
            <div class="progress__meta">{{ langStore.exp}}/100 XP</div></div>
          </div>
        <li class="points-card__item">
          <span class="points-card__label">Подписка</span>
          <span class="sub-badge sub-badge--off">Не активна</span>
        </li>
      </ul>
      <div class="sub-actions">
        <button @click="toPayment" class="btn-activate">Попробовать</button>
      </div>
    </section>
  </div>
</template>
<script setup>

import {userlangStore} from "~/store/learningStore.js";
import { useRouter} from "vue-router";
const langStore = userlangStore()
const router = useRouter()

const toPayment = () => {
  router.push('/pay')
}

</script>
<style scoped>
.points {
  min-width: 360px;
  display: flex;
  width: 100%;
  height: 100%;
}

.points-card {
  color: #111;
  background: linear-gradient(180deg, #ffd83b, #f1c40f);
  border: 4px solid #111;
  border-radius: 20px;
  box-shadow: 4px 4px 0 #111;
  padding: 18px;
  width: 100%;
}

.progress_exp-bar {
  width: 100%;
  height: 20px;
  background: white;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
}

.progress__bar {
  height: 100%;
  background: #6589e0;
  transition: width .4s;
}

.points-card__header {
  margin-bottom: 12px;
}

.points-card__title {
  display: inline-block;
  margin: 0;
  padding: 8px 14px;
  background: #111;
  color: #fff;
  border-radius: 14px;
  font-size: 16px;
}

.points-card__list {
  list-style: none;
  margin: 0;
  padding: 10px 12px;
  background: #ffe78a;
  border: 3px solid #111;
  border-radius: 14px;
}

.points-card__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 4px;
  margin-top: 15px;
  border-top: 3px dashed #111;
}

.points-card__item + .points-card__item {
  border-top: 2px dashed rgba(0, 0, 0, .15);
}

.points-card__label {
  font-size: 14px;
  font-weight: 700;
  color: #111;
}

.points-card__value {
  font-size: 18px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #111;
}


.points-card__badge {
  font-size: 14px;
  font-weight: 800;
  background: #fff;
  border: 3px solid #111;
  border-radius: 999px;
  padding: 4px 10px;
}

.sub-badge {
  font-size: 12px;
  font-weight: 800;
  border: 3px solid #111;
  border-radius: 999px;
  padding: 3px 10px;
  background: #fff;
}

.sub-badge--off {
  position: relative;
  padding-left: 28px;
}

.sub-badge--off::before {
  content: "";
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ff4d4f;
  border: 2px solid #111;
}

.sub-actions {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}

.btn-activate {
  width: 100%;
  appearance: none;
  background: #fff;
  color: #111;
  border: 3px solid #111;
  border-radius: 15px;
  padding: 10px 16px;
  font-weight: 900;
  box-shadow: 4px 4px 0 #111;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: transform .06s ease, box-shadow .06s ease, background .2s ease;
}

.btn-activate:hover {
  background: #ffe78a;
}

.btn-activate:active {
  transform: translate(3px, 3px);
  box-shadow: 1px 1px 0 #111;
}

.btn-activate__icon {
  font-size: 16px;
  line-height: 1;
}

.points-card__progress {
  margin-top: 5px;
}

.progress__meta {
  display: flex;
  align-items: center;
  justify-content:center;
  font-size: 12px;
  color: #111;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-weight: 600;
}

@media (max-width: 420px) {
  .points-card {
    padding: 14px;
  }

  .points-card__title {
    font-size: 15px;
  }

  .points-card__value {
    font-size: 16px;
  }
}
</style>
