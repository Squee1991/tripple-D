<script setup>
import {onMounted, ref} from 'vue'
import {useRouter} from 'vue-router'
import {userExamStore} from '../../store/examStore.js'
import VEditTest from "../../src/components/V-editTest.vue";
import Dots from '../../assets/images/dots.svg'
import Trash from '../../assets/images/trash.svg'
import Share from '../../assets/images/share.svg'
import { useFriendsStore } from '../../store/friendsStore.js'
import ShareExamModal from '../../src/components/shareModal.vue';
import { useI18n } from 'vue-i18n'
import VBanner from "~/src/components/V-banner.vue";
import Archive from "../../assets/images/folder.svg";
const { t } = useI18n()
const friendsStore = useFriendsStore()
const router = useRouter()
const examStore = userExamStore()

const dotsEdit = ref(false)
const showShareModal = ref(false)
const isSharing = ref(false)
const shareMessage = ref('')

const showDeleteModal = ref(false)
const examToDelete = ref(null)

const data = ref([
  {icon: Share, alt: t('examResult.share'), text:  t('examResult.share')},
  {icon: Trash, alt: t('examResult.delete'), text: t('examResult.delete')},
])

async function handleShareWithFriend(friendUid) {
  if (!selectedExamId.value || !friendUid) return;
  isSharing.value = true;

  try {
    const res = await examStore.shareExamWithFriend(selectedExamId.value, friendUid);
    shareMessage.value = res?.already ? t('examResult.sended') :  t('examResult.sent');
  } catch (e) {
    console.error(e);
    shareMessage.value = e?.message || t('examResult.error');
  } finally {
    isSharing.value = false;
  }
}

async function handleAction(btn) {
  const att = selectedExamId.value
  dotsEdit.value = false
  if (!att) return
  if (btn.text ===  t('examResult.delete')) {
    await examStore.deleteExam(selectedExamId.value)
  } else if (btn.text === t('examResult.share')) {
    await friendsStore.loadFriends()
    shareMessage.value = ''
    showShareModal.value = true
    console.log('Поделиться экзаменом', selectedExamId.value)
  }
}

function askDelete(id) {
  examToDelete.value = id
  showDeleteModal.value = true
}

function cancelDelete() {
  showDeleteModal.value = false
  examToDelete.value = null
}

async function confirmDelete() {
  if (examToDelete.value) {
    await examStore.deleteExam(examToDelete.value)
    showDeleteModal.value = false
    examToDelete.value = null
  }
}

const selectedExamId = ref(null)

function openMenu(id) {
  selectedExamId.value = id
  dotsEdit.value = true
}

function toDateFlexible(value) {
  if (!value) return null
  try {
    if (typeof value.toDate === 'function') return value.toDate()
    const d = new Date(value)
    return isNaN(d) ? null : d
  } catch {
    return null
  }
}

function openAttempt(id) {
  router.push(`/examp-archieve?id=${encodeURIComponent(id)}`)
}

onMounted(() => {
  examStore.loadArchiveAttempts()
})
</script>

<template>
  <div class="exams-compact">
    <ShareExamModal
        v-if="showShareModal"
        :friends="friendsStore.friends"
        :is-sending="isSharing"
        :message="shareMessage"
        @close="() => { showShareModal = false; shareMessage = '' }"
        @share="handleShareWithFriend"
    />
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="cancelDelete">
      <div class="modal-card">
        <div class="modal-title">Удалить результат?</div>
        <p class="modal-text">Вы уверены, что хотите удалить этот экзамен? Это действие нельзя отменить.</p>
        <div class="modal-actions">
          <button class="btn-app btn-cancel" @click="cancelDelete" type="button">
            Отмена
          </button>
          <button class="btn-app btn-danger" @click="confirmDelete" type="button">
            Удалить
          </button>
        </div>
      </div>
    </div>
    <VBanner
       :text="t('examResult.title')"
       :icon="Archive"
    />
    <div v-if="examStore.archiveLoading" class="ec__box">{{ t('examResult.loading') }}</div>
    <div v-else-if="examStore.archiveError" class="ec__box ec__box--error">{{ examStore.archiveError }}</div>
    <div v-else>
      <div class="ec__not" v-if="examStore.archiveAttempts.length === 0">
        <img class="folder__icon" src="../../assets/images/folders.svg" alt="">
        <div class="ec__text-empty">{{ t('examResult.empty') }}</div>
      </div>
      <ul class="ec__list">
        <li v-for="a in examStore.archiveAttempts" :key="a.id" class="ec__item">
          <div class="ec__left__wrapper">
            <div class="ec__main">
              <div class="ec__line">
                <span class="ec__lvl">{{ a.level || '—' }}</span>
                <span class="ec__badge" :class="a.status === 'finished' ? 'is-finished' : 'is-draft'">
                  {{ a.status || 'draft' }}
                </span>
              </div>
              <div class="ec__meta">
                <span>{{ t('examResult.start') }} {{ toDateFlexible(a.startedAt)?.toLocaleString?.() || '—' }}</span>
                <span v-if="a.status === 'finished'" class="ec__score">
                  {{ t('examResult.middle') }} <b>{{ a.averageScore }}</b> / 10
                </span>
              </div>
            </div>
          </div>
          <div class="ec__actions">
            <button class="app-btn-view" @click="openAttempt(a.id)">
              {{ t('examResult.showResultButton') }}
            </button>
            <button class="app-btn-delete" @click="askDelete(a.id)">
              <img class="app-icon-trash" :src="Trash" alt="Trash">
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>

.exams-compact {
  width: 100%;
  font-family: "Nunito", sans-serif;
}

.ec__title {
  font-weight: 800;
  font-size: 23px;
  margin-bottom: 16px;
  color: white;
  text-align: center;
  background: #00c2ff;
  padding: 10px;
  border-radius: 20px;
}

.folder__icon {
  width: 100px;
  opacity: 0.8;
}

.ec__text-empty {
  font-size: 1.2rem;
  font-weight: 600;
  margin-top: 15px;
  color: #a0a0b0;
}

.ec__not {
  margin-top: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.ec__box {
  border-radius: 16px;
  padding: 16px;
  background: #2a2a3c;
  color: #fff;
  text-align: center;
}

.ec__box--error {
  background: #ff4d4f;
}

.ec__list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0;
  margin: 0;
  list-style: none;
}


.ec__item {
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: var(--menuItemsBg);
  border: 2px solid var(--tabsSlideBorderColor);
  box-shadow: 0 4px 0 var(--tabsSlideBorderColor);
  border-radius: 20px;
  padding: 16px;

}

.ec__left__wrapper {
  display: flex;
  flex-direction: column;
}

.ec__main {
  display: grid;
  gap: 8px;
}

.ec__line {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ec__lvl {
  font-weight: 800;
  font-size: 1.1rem;
  color: var(--titleColor);
}

.ec__badge {
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 12px;
  text-transform: uppercase;
  font-weight: 800;
}

.is-finished {
  background: #34c759;
  color: #fff;
}

.is-draft {
  background: #ffcc00;
  color: #000;
}

.ec__meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: #a0a0b0;
  font-size: 0.9rem;
  font-weight: 600;
}

.ec__score {
  color: #3e91cd;
}


.ec__actions {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-top: 4px;
}

.app-btn-view {
  flex: 1;
  background: #2b6be2;
  color: #ffffff;
  border: none;
  border-radius: 24px;
  box-shadow: 0 4px 0 #2959b0;
  padding: 12px;
  font-size: 1rem;
  font-weight: 800;
  font-family: "Nunito", sans-serif;
  cursor: pointer;
  transition: opacity 0.2s;
}

.app-btn-view:active {
  opacity: 0.7;
}

.app-btn-delete {
  width: 50px;
  height: 50px;
  background: #3a3a52;
  border: none;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: opacity 0.2s;
  flex-shrink: 0;
}

.app-btn-delete:active {
  opacity: 0.7;
  background: #ff4d4f;
}

.app-icon-trash {
  width: 24px;
  height: 24px;
  filter: brightness(0) invert(1);
}

.modal-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  z-index: 10000;
  backdrop-filter: blur(5px);
}

.modal-card {
  background: var(--menuItemsBg);
  border-radius: 24px;
  padding: 24px;
  width: 90%;
  max-width: 360px;
  text-align: center;
  box-shadow: 0 5px 0 rgba(224, 216, 216, 0.5);
  animation: scaleIn 0.2s ease-out;
}

.modal-title {
  font-size: 23px;
  font-weight: 800;
  color: var(--title);
  margin: 15px 0;
}

.modal-text {
  font-size: 0.95rem;
  color: #a0a0b0;
  margin-bottom: 24px;
  line-height: 1.4;
}

.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn-app {
  width: 100%;
  padding: 14px;
  border-radius: 24px;
  font-family: "Nunito", sans-serif;
  font-weight: 800;
  font-size: 1rem;
  border: none;
  cursor: pointer;
}

.btn-app:active {
  opacity: 0.8;
}

.btn-danger {
  background: none;
  color: var(--title);
}

.btn-cancel {
  background: #2b6be2;
  color: #fff;
}

@keyframes scaleIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@media (min-width: 768px) {
  .ec__item {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .ec__actions {
    margin-top: 0;
    width: 250px;
  }
}
</style>