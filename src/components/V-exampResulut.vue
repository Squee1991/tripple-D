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
const { t } = useI18n( )
const friendsStore = useFriendsStore()
const router = useRouter()
const examStore = userExamStore()
const dotsEdit = ref(false)
const showShareModal = ref(false)
const isSharing = ref(false)
const shareMessage = ref('')
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
    <h2 class="ec__title">{{ t('examResult.title') }}</h2>
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
                <span class="ec__lvl">Niveau {{ a.level || '—' }}</span>
                <span class="ec__badge" :class="a.status === 'finished' ? 'is-finished' : 'is-draft'">
                {{ a.status || 'draft' }}
              </span>
              </div>
              <div class="ec__meta">
              <span>{{ t('examResult.start') }}
                {{ toDateFlexible(a.startedAt)?.toLocaleString?.() || '—' }}
              </span>
                <!--              <span class="ec__dot">•</span>-->
                <!--              <span>Пройдено: {{ a.currentIndex ?? 0 }}</span>-->
                <!--              <span v-if="a.status === 'finished'" class="ec__dot"></span>-->
                <span v-if="a.status === 'finished'">{{ t('examResult.middle') }} <b>{{ a.averageScore }}</b> / 10</span>
              </div>
            </div>
            <button class="ec__btn" @click="openAttempt(a.id)">{{ t('examResult.showResultButton') }}</button>
          </div>
          <div class="edit__wrapper">
            <button class="dots__btn" @click="openMenu(a.id)">
              <img class="dots__icon" :src="Dots" alt="">
            </button>
            <div class="edit__component">
              <VEditTest
                  v-if="dotsEdit && selectedExamId === a.id"
                  :open="dotsEdit"
                  :buttons="data"
                  @close="dotsEdit = false"
                  @action="handleAction"
              />
            </div>
          </div>
        </li>
      </ul>
      <NuxtLink class="friend__exam" to="/friend-exam">{{ t('friendExamBtn.btn')}}</NuxtLink>
    </div>
  </div>
</template>

<style scoped>

.friend__exam {
  display: flex;
  justify-content: center;
  box-shadow: 3px 3px 0 black;
  border: 2px solid black;
  font-family: "Nunito", sans-serif;
  font-size: 1rem;
  color: white;
  background: #c096ea;
  border-radius: 15px;
  padding: 10px;
  font-weight: 600;
  margin: 40px auto 0;
  max-width: 200px;
  text-align: center;
  width: 100%;
}

.edit__wrapper {
  position: relative;
}

.edit__component {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
}

.ec__left__wrapper {
  display: flex;
  flex: 1;
}

.dots__btn {
  border-radius: 50%;
  border: 3px solid black;
  width: 40px;
  height: 40px;
  padding: 5px;
  background: #798ad2;
  box-shadow: 4px 4px 0 black;
  margin-left: 10px;
  cursor: pointer;
}

.exams-compact {
  width: 100%;
}

.folder__icon {
  width: 120px;
}

.ec__title {
  font-weight: 900;
  font-size: 1.6rem;
  margin-bottom: 12px;
  color: var(--titleColor, #111);
  padding: 25px;
}

.ec__btn {
  margin-left: auto;
}

.ec__box {
  border: 2px solid #000;
  border-radius: 16px;
  padding: 12px;
  background: #fff7dd;
  box-shadow: 3px 3px 0 #000;
}

.ec__box--error {
  background: #ffe2e2;
}

.ec__list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ec__text-empty {
  font-size: 1.5rem;
  font-weight: 600;
  font-family: "Nunito", sans-serif;
  margin-top: 10px;
  color: var(--titleColor);
}

.ec__not {
  margin-top: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.ec__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  border: 3px solid #000;
  border-radius: 16px;
  padding: 8px 12px;
  background: #f3f4f6;
  box-shadow: 3px 3px 0 #000;
}

.ec__main {
  display: grid;
  gap: 4px;
}

.ec__line {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ec__lvl {
  font-weight: 800;
  font-size: 1.1rem;
}

.ec__badge {
  font-size: .75rem;
  padding: 2px 8px;
  border: 2px solid #000;
  border-radius: 999px;
  text-transform: uppercase;
  font-weight: 900;
}

.is-finished {
  background: #bbf7d0;
}

.is-draft {
  background: #fde68a;
}

.ec__meta {
  display: flex;
  width: 100%;
  gap: 6px;
  color: #374151;
  font-size: .95rem;
}

.ec__dot {
  opacity: .6;
}

.ec__btn {
  border: 3px solid #000;
  border-radius: 12px;
  padding: 8px 12px;
  font-weight: 800;
  background: #ffd54f;
  box-shadow: 3px 3px 0 #000;
  cursor: pointer;
  transition: .15s;
}

.ec__btn:hover {
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0 #000;
}

@media (min-width: 1024px) {
  .dots__btn:hover {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0 #000;
  }

  .ec__btn:hover {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0 #000;
  }
}

@media (max-width: 1140px) {
  .ec__left__wrapper {
    flex-direction: column;
  }
  .ec__btn {
    margin-left: 0;
    max-width: 300px;
  }
  .ec__meta {
    flex-direction: column;
  }
  .ec__item {
    align-items: start;
  }
}
</style>