<template>
  <div class="shared-exams-page">
    <h2>Общие экзамены</h2>

    <div v-if="examStore.sharedLoading">Загрузка...</div>
    <div v-else-if="examStore.sharedError" class="error-box">{{ examStore.sharedError }}</div>

    <div v-else-if="pendingExams.length > 0 || acceptedExams.length > 0">
      <section v-if="pendingExams.length > 0">
        <h3>Новые приглашения</h3>
        <ul class="exams-list">
          <li v-for="share in pendingExams" :key="share.shareId" class="exam-item pending">
            <div class="info">
              <p><b>{{ share.fromName }}</b> поделился с вами экзаменом.</p>
              <p class="details">Уровень: {{ share.examDetails?.level || 'N/A' }}</p>
            </div>
            <div class="actions">
              <button @click="examStore.acceptShare(share)" class="btn-accept">Принять</button>
              <button @click="examStore.declineShare(share)" class="btn-decline">Отклонить</button>
            </div>
          </li>
        </ul>
      </section>

      <section>
        <h3>Доступные вам</h3>
        <ul class="exams-list">
          <li v-if="acceptedExams.length === 0" class="empty-list">У вас пока нет принятых экзаменов.</li>
          <li v-for="share in acceptedExams" :key="share.shareId" class="exam-item accepted">
            <div class="info">
              <p>Экзамен от <b>{{ share.fromName }}</b></p>
              <p class="details">Уровень: {{ share.examDetails?.level || 'N/A' }}, Средний балл: {{ share.examDetails?.averageScore || 'N/A' }}</p>
            </div>
            <div class="actions">
              <button @click="openSharedAttempt(share.examId)" class="btn-view">Посмотреть</button>
            </div>
          </li>
        </ul>
      </section>
    </div>

    <div v-else class="empty-state">
      <p>С вами пока никто не поделился результатами экзаменов.</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { userExamStore } from '../store/examStore.js';

const examStore = userExamStore();
const router = useRouter();

onMounted(() => {
  examStore.loadSharedExams();
});

const pendingExams = computed(() =>
    examStore.sharedExams.filter(e => e.status === 'pending')
);

const acceptedExams = computed(() =>
    examStore.sharedExams.filter(e => e.status === 'accepted')
);

function openSharedAttempt(id) {
  // Используем тот же роут, что и для просмотра своих архивных экзаменов
  router.push(`/examp-archieve?id=${encodeURIComponent(id)}`);
}
</script>

<style scoped>
/* Добавьте стили для этой страницы */
.shared-exams-page { padding: 20px; }
.exams-list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.exam-item { display: flex; justify-content: space-between; align-items: center; padding: 15px; border-radius: 12px; border: 2px solid #000; box-shadow: 3px 3px 0 #000; }
.pending { background-color: #fffbe6; }
.accepted { background-color: #f0fdf4; }
.info .details { font-size: 0.9rem; color: #555; }
.actions { display: flex; gap: 10px; }
.btn-accept, .btn-decline, .btn-view { /* Стили для кнопок */ }
.empty-state { text-align: center; margin-top: 50px; }
</style>