<template>
    <div class="cabinet-wrapper">
        <div v-if="cancelModal" class="cancel__modal-overlay" @click.self="closeCancelModal">
            <div class="cancel__modal-wrapper">
                <div class="cancel__title">Отменить подписку?</div>
                <p class="cancel__text">
                    Если вы отмените подписку, премиум-доступ останется до конца оплаченного периода.
                </p>
                <div class="cancel__actions">
                    <button class="cancel-btn cancel-btn-yes" @click="cancelSubscription">Да, отменить</button>
                    <button class="cancel-btn cancel-btn-no" @click="closeCancelModal">Нет</button>
                </div>
            </div>
        </div>
        <Modal
                :visible="openModal"
                :title="dataModal.title"
                :text="dataModal.text"
                :img="dataModal.img"
                @close="openModal= false"
        />
        <!--        <div class="sidebar">-->
        <!--            <button @click="pathBack" class="sidebar-btn back-btn" title="На главную">←</button>-->
        <!--            <button class="sidebar-btn" title="Настройки">⚙️</button>-->
        <!--        </div>-->
        <div class="main-content">
            <div class="header">
                <div class="user-block">
                    <div class="avatar-container">
                        <img v-if="authStore.avatarUrl" :src="authStore.avatarUrl" alt="Аватар" class="avatar-current">
                        <div v-else class="avatar-placeholder"></div>
                        <button @click="isAvatarModalOpen = true" class="change-avatar-btn" title="Сменить аватар">
                            <img src="../assets/images/add.svg" alt="Сменить">
                        </button>
                    </div>
                    <div class="user-info">
                        <div class="user-name">{{ authStore.name }}</div>
                        <div class="exp-bar">
                            <div class="exp-fill" :style="{ width: `${(learningStore.exp / 100) * 100}%` }"></div>
                            <span class="exp-text">{{ learningStore.exp }} / 100 XP</span>
                        </div>
                        <div class="level-info">Уровень: {{ learningStore.isLeveling }}</div>
                    </div>
                </div>

            </div>

            <div class="tabs">
                <button class="tab" :class="{ active: activeTab === 'info' }" @click="setTab('info')">
                    <img class="tab-icon" src="../assets/images/user.svg" alt="">
                    <span>Параметры</span>
                </button>
                <button class="tab" :class="{ active: activeTab === 'progress' }" @click="setTab('progress')">
                    <img class="tab-icon" src="../assets/images/progress.svg" alt="">
                    <span>Прогресс</span>
                </button>
                <button class="tab" :class="{ active: activeTab === 'shop' }" @click="setTab('shop')">
                    <img class="tab-icon" src="../assets/images/chest.png" alt="">
                    <span>Магазин</span>
                </button>
                <button class="tab" :class="{ active: activeTab === 'award' }" @click="setTab('award')">
                    <img class="tab-icon" src="../assets/images/awards/medal.svg" alt="">
                    <span>Награды</span>
                </button>

            </div>
            <div class="tab-content-wrapper">
                <div v-if="activeTab === 'info'" class="tab-content">
                    <div class="row"><span>Имя:</span><span>{{ authStore.name }}</span></div>
                    <div class="row"><span>Email:</span><span>{{ authStore.email }}</span></div>
                    <div class="row"><span>Дата регистрации:</span><span>{{ regDate || '—' }}</span></div>
                    <div @click="toggle" class="subscription-row" :class="{ open: isToggle }">
                        <div class="subscription-title-wrapper">
                            <div class="subscription-title">Управление аккаунтом</div>
                            <img class="sub__arrow" :class="{ rotated: isToggle }" src="../assets/images/arrowNav.svg"
                                 alt="">
                        </div>

                        <!-- Выравнивание: статус + надпись -->
                        <div class="subscription-status-row">
                            <div class="subscription-label">Статус подписки</div>
                            <div class="subscription-status">
                                <template v-if="authStore.isPremium && !authStore.subscriptionCancelled">
                                    <p class="active">✅ Подписка активна</p>
                                </template>
                                <template v-else-if="authStore.isPremium && authStore.subscriptionCancelled">
                                    <p class="cancelled">⚠️ Подписка отменена</p>
                                </template>
                                <template v-else>
                                    <p>🔓 Без подписки</p>
                                </template>
                            </div>
                        </div>

                        <!-- Разворачиваемая часть -->
                        <transition name="fade">
                            <div v-show="isToggle" class="subscription-details">
                                <template v-if="authStore.isPremium && !authStore.subscriptionCancelled">
                                    <p>📅 Следующее списание: {{ formattedEndDate }}</p>
                                    <button class="open__cancel-modal" @click.stop="openCancelModal">Отменить подписку
                                    </button>
                                </template>
                                <template v-else-if="authStore.isPremium && authStore.subscriptionCancelled">
                                    <p>📅 Доступ до: {{ formattedEndDate }}</p>
                                </template>
                            </div>
                        </transition>
                    </div>

                    <div>
                        <button @click="clearFields" class="delete-account-btn">Удалить аккаунт</button>
                    </div>
                </div>
                <div v-if="activeTab === 'progress'">
                    <Progress/>
                </div>
                <div v-if="activeTab === 'shop'" class="tab-content">
                    <Shop/>
                </div>
                <div v-if="activeTab === 'award'" class="tab-content">
                    <AwardsList
                            :awards="awards"
                    />
                </div>

            </div>
        </div>
        <div v-if="isAvatarModalOpen" class="avatar-modal-overlay" @click.self="isAvatarModalOpen = false">
            <div class="avatar-modal-content">
                <h3>Выберите новый аватар</h3>
                <div class="avatar-grid">
                    <div v-for="avatarName in authStore.availableAvatars"
                         :key="avatarName"
                         class="avatar-option"
                         :class="{ 'selected': selectedAvatar === avatarName }"
                         @click="selectAvatar(avatarName)">
                        <img :src="authStore.getAvatarUrl(avatarName)" :alt="avatarName">
                    </div>
                </div>
                <div class="modal-actions">
                    <button @click="isAvatarModalOpen = false" class="btn-cancel">Отмена</button>
                    <button @click="confirmAvatarChange" :disabled="!selectedAvatar" class="btn-confirm">Сохранить
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div v-if="showDeleteModal" class="cancel__modal-overlay" @click.self="showDeleteModal = false">
        <div class="cancel__modal-wrapper">
            <div class="cancel__title">Удалить аккаунт?</div>
            <p class="cancel__text">После удаления аккаунта все Ваши данные будут утеряны безвозвратно</p>
            <p v-if="!isGoogleUser" class="cancel__text-password">
                Введите ваш пароль для подтверждения удаления аккаунта
            </p>
            <div v-if="!isGoogleUser" class="label">
                <input class="input" v-model="deleteFields[0].value" type="password"/>
                <p v-if="deleteFields[0].error" class="delete-error">
                    {{ t(deleteFields[0].error) }}
                </p>
            </div>
            <p v-else class="cancel__text-password">
                Вы вошли через Google. Для удаления аккаунта откроется окно повторной авторизации.
            </p>
            <div class="cancel__actions">
                <button class="cancel-btn cancel-btn-yes" @click="confirmDeleteAccount">Удалить</button>
                <button class="cancel-btn cancel-btn-no" @click="showDeleteModal = false">Отмена</button>
            </div>
        </div>
    </div>
</template>

<script setup>

import {userAuthStore} from '../store/authStore.js'
import {userlangStore} from '../store/learningStore.js'
import {mapErrors} from "../utils/errorsHandler.js";
import {ref, computed, onMounted, watch} from 'vue'
import Progress from '../src/components/progress.vue'
import Skills from '../src/components/skillz.vue'
import {useRouter} from 'vue-router'
import Shop from '../src/components/Shop.vue'
import Modal from '../src/components/modal.vue'
import DevelopmentIcon from '../assets/images/dev.svg'
import AwardsList from '../src/components/AwardsList.vue'
import artichleousDiamond from '../assets/awards/artichleous diamond.svg'
import memberBadge from '../assets/awards/member badge.svg'
import goldStatuette from '../assets/awards/gold statuette.svg'
import veteranMedal from '../assets/awards/veteran medal.svg'
import talismanOfPatience from '../assets/awards/talisman of patience.svg'
import wisdomStatue from '../assets/awards/wisdom statue.svg'
import {cpecialGroupAchievment} from '../src/achieveGroup/specialAchieve/specialAchievment.js';
import {overAchievment} from '../src/achieveGroup/overAllAchieve/overallAchievements.js'
import {useGameStore} from '../store/marafonStore.js'

const {t} = useI18n()
const isToggle = ref(false)
const authStore = userAuthStore()
const learningStore = userlangStore()
const router = useRouter()
const activeTab = ref('info')
const isAvatarModalOpen = ref(false);
const selectedAvatar = ref(null);
const openModal = ref(false)
const cancelModal = ref(false)
const allAchievment = ref(cpecialGroupAchievment)
const marathonStore = useGameStore()
const overAllAchievments = ref(overAchievment)
const showDeleteModal = ref(false)
const errorDeletePassword = ref('')
const isGoogleUser = computed(() => authStore.isGoogleUser);
const awards = [
    {id: 1, title: 'Алмаз артиклеуса', icon: artichleousDiamond, locked: true},
    {id: 2, title: 'Значок участника', icon: memberBadge, locked: true},
    {id: 3, title: 'Золотая статуэтка', icon: goldStatuette, locked: true},
    {id: 4, title: 'Медаль ветерана', icon: veteranMedal, locked: true},
    {id: 5, title: 'Талисман терпения', icon: talismanOfPatience, locked: true},
    {id: 6, title: 'На последнем дыхании', icon: wisdomStatue, locked: true},
]
const formattedEndDate = computed(() => {
    if (!authStore.subscriptionEndsAt) return '-'
    const date = new Date(authStore.subscriptionEndsAt)
    return date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
})
const findById = (id) => {
    for (const group of overAllAchievments.value) {
        if (!Array.isArray(group.achievements)) continue
        const achievement = group.achievements.find(a => {
            return a.id == id
        })
        if (achievement) return achievement
    }
    return null
}

console.log(findById('LastChance'))
const openCancelModal = () => {
    cancelModal.value = true
}

const clearFields = () => {
    showDeleteModal.value = true
    deleteFields.value.forEach((item) => {
        item.value = '',
            item.error = ''
    });
}

const closeCancelModal = () => {
    cancelModal.value = false
}

const deleteFields = ref([
    {name: 'deletePassword', value: '', error: ''}
])

async function confirmDeleteAccount() {
    deleteFields.value[0].error = ''
    try {
        await authStore.deleteAccount(deleteFields.value[0].value)
        router.push('/')
    } catch (err) {
        mapErrors(deleteFields.value, err.code)
    }
}

async function cancelSubscription() {
    if (!authStore.uid) return
    try {
        const res = await $fetch('/api/stripe/cancel', {
            method: 'POST',
            body: {uid: authStore.uid},
        })
        if (res.success) {
            console.log('Подписка будет отменена в конце текущего оплаченного периода.')
        } else {
            alert('Ошибка отмены подписки: ' + res.error)
        }
    } catch (err) {
        console.error('Ошибка отмены подписки:', err)
        alert('Произошла ошибка. Попробуй позже.')
    }
}

const dataModal = ref({
    title: 'Заголовок',
    text: 'текст',
    img: DevelopmentIcon
})

const openModalSkills = () => {
    openModal.value = true
}

watch(isAvatarModalOpen, (newValue) => {
    if (newValue) {
        selectedAvatar.value = authStore.avatar;
    }
});
watch(() => authStore.uid, (newUid) => {
    if (!newUid) return

    const startAward = awards.find(a => a.title === 'Значок участника')
    if (startAward && startAward.locked) {
        startAward.locked = false
    }
}, {immediate: true})
watch(
    () => marathonStore.lastChanceProgress,
    (newProgress) => {
        const ach = findById('LastChance');
        if (!ach) return;


        ach.currentProgress = Math.min(newProgress, ach.targetProgress);


        if (ach.currentProgress >= ach.targetProgress) {
            const award = awards.find(a => a.title === 'На последнем дыхании');
            if (award && award.locked) {
                award.locked = false;


                dataModal.value = {
                    title: 'Поздравляем!',
                    text: `Вы получили награду «${award.title}»!`,
                    img: award.icon
                };
                openModal.value = true;
            }
        }
    },
    { immediate: true }
);



const selectAvatar = (avatarName) => {
    selectedAvatar.value = avatarName;
};
const confirmAvatarChange = async () => {
    if (!selectedAvatar.value) return;
    try {
        await authStore.updateUserAvatar(selectedAvatar.value);
        isAvatarModalOpen.value = false;
    } catch (error) {
        console.error("Не удалось обновить аватар:", error);
    }
};
const toggle = () => {
    isToggle.value = !isToggle.value;
}
const pathBack = () => {
    router.push('/')
}
const setTab = (tab) => {
    activeTab.value = tab
}
const regDate = computed(() => {
    if (!authStore.registeredAt) return '-'
    return new Date(authStore.registeredAt).toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    })
})

onMounted(async () => {
    await learningStore.loadFromFirebase()
})

</script>

<style scoped>

.delete-error {
    color: #d32f2f;
    font-size: 0.8rem;
    margin-top: 0.3rem;
    font-weight: bold;
}

.input {
    width: 100%;
    padding: 10px;
    border-radius: 15px;
}

.label {
    height: 80px;
}

.subscription-title {
    padding: 0 0 10px 0;
    font-size: 1.3rem;
    font-weight: bold;
    font-family: 'Fredoka One', cursive;
    color: #1e1e1e;
}

.subscription-title-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.delete-password-input {
    width: 90%;
    box-shadow: 4px 4px 0 black;
    padding: 10px;
    border-radius: 15px;
}

.delete-password-input:active {

}

.cancel__modal-overlay {
    width: 100%;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
}

.cancel__modal-wrapper {
    background: #fffbea;
    border: 3px solid #1e1e1e;
    border-radius: 20px;
    padding: 2rem;
    width: 90%;
    max-width: 440px;
    box-shadow: 8px 8px 0 #1e1e1e;
    text-align: center;
    font-family: "Nunito", sans-serif;
}

.cancel__title {
    font-size: 1.8rem;
    font-weight: bold;
    font-style: italic;
    margin-bottom: 1rem;
    color: #1e1e1e;
}

.cancel__text {
    padding: 10px;
    font-size: 1.2rem;
    font-weight: normal;
    font-family: 'Inter', sans-serif;
    color: #333;
    margin-bottom: 2rem;
    line-height: 1.4;
}

.cancel__actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
}

.cabinet-wrapper {
    display: flex;
    min-height: 100vh;
    background: #fef8e4;
    font-family: 'Inter', sans-serif;
    color: #1e1e1e;
}

.sidebar {
    width: 90px;
    background: #ffffff;
    border-right: 3px solid #1e1e1e;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.5rem 0;
    gap: 1.5rem;
    flex-shrink: 0;
}

.cancel__text-password {
    font-size: 0.8rem;
    margin-bottom: 10px;
}

.sidebar-btn {
    width: 60px;
    height: 60px;
    border-radius: 16px;
    border: 3px solid #1e1e1e;
    background-color: #f3f4f6;
    box-shadow: 4px 4px 0 #1e1e1e;
    font-size: 2rem;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.sidebar-btn.back-btn {
    font-size: 2.5rem;
    font-weight: bold;
}

.sidebar-btn:hover {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 #1e1e1e;
}

.sidebar-btn.active {
    background-color: #fca13a;
    color: white;
    transform: translate(4px, 4px);
    box-shadow: 0 0 0 #1e1e1e;
}

.main-content {
    flex: 1;
    padding: 2rem 3rem;
    display: flex;
    flex-direction: column;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1.5rem;
    padding-bottom: 2rem;
    border-bottom: 3px solid #f3f4f6;
}

.user-block {
    display: flex;
    align-items: center;
    gap: 1.5rem;
}

.avatar-container {
    position: relative;
}

.avatar-current, .avatar-placeholder {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 4px solid #1e1e1e;
    object-fit: cover;
}

.avatar-placeholder {
    background-color: #f3f4f6;
}

.change-avatar-btn {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 36px;
    height: 36px;
    background: #fca13a;
    border: 3px solid #1e1e1e;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
}

.change-avatar-btn:hover {
    transform: scale(1.1);
}

.change-avatar-btn img {
    width: 16px;
    height: 16px;
}

.user-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.user-name {
    font-family: 'Fredoka One', cursive;
    font-size: 1.8rem;
}

.exp-bar {
    width: 250px;
    height: 28px;
    background-color: #e5e7eb;
    border-radius: 14px;
    border: 3px solid #1e1e1e;
    overflow: hidden;
    position: relative;
}

.exp-fill {
    height: 100%;
    background: #4ade80;
    border-radius: 8px;
    transition: width 0.5s ease;
}

.exp-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 0.9rem;
    font-weight: bold;
    color: #1e1e1e;
}

.level-info {
    font-family: 'Fredoka One', cursive;
    font-size: 1.2rem;
    color: #555;
}


.balance-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
}


.sub {
    font-size: 0.9rem;
    font-weight: 500;
    color: #555;
}

.balance, .date {
    font-family: 'Fredoka One', cursive;
    font-size: 1.5rem;
    margin-top: 0.25rem;
}

.balance {
    color: #f97028;
}

.tabs {
    display: flex;
    gap: 1rem;
    margin: 2rem 0;
}

.tab {
    font-family: 'Fredoka One', cursive;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border: 3px solid #1e1e1e;
    border-radius: 16px;
    box-shadow: 4px 4px 0 #1e1e1e;
    cursor: pointer;
    transition: all 0.2s ease;
    background-color: #fff;
    font-size: 1.1rem;
}

.tab:hover {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 #1e1e1e;
}

.tab.active {
    background-color: #fca13a;
    color: white;
    transform: translate(4px, 4px);
    box-shadow: 0 0 0 #1e1e1e;
}

.tab.active .tab-icon {
    filter: brightness(0) invert(1);
}

.tab-icon {
    width: 24px;
}

.tab-content-wrapper {
    background-color: #fff;
    border: 3px solid #1e1e1e;
    box-shadow: 8px 8px 0 #e5e7eb;
    padding: 1.5rem;
    border-radius: 16px;
}

.row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fffbea;
    padding: 1rem 1.5rem;
    border: 2px solid #1e1e1e;
    border-radius: 16px;
    margin-bottom: 1rem;
    font-size: 1.1rem;
    font-weight: 500;
    box-shadow: 4px 4px 0 #1e1e1e;
    transition: background 0.3s ease;
}

.row:hover {
    background-color: #fff4c2;
}

.row:last-child {
    border-bottom: none;
}

.row span:first-child {
    font-weight: bold;
}

.avatar-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.sub__arrow {
    width: 24px;
    transition: transform 0.3s ease;
}

.sub__arrow.rotated {
    transform: rotate(180deg);
}

.subscription-status-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.avatar-modal-content {
    background: #fff;
    padding: 2rem;
    border-radius: 24px;
    border: 4px solid #1e1e1e;
    box-shadow: 8px 8px 0 #1e1e1e;
    width: 90%;
    max-width: 600px;
    text-align: center;
}

.avatar-modal-content h3 {
    font-family: 'Fredoka One', cursive;
    font-size: 1.8rem;
    margin-bottom: 2rem;
}

.avatar-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 1rem;
    max-height: 50vh;
    overflow-y: auto;
    padding: 0.5rem;
}

.avatar-option {
    cursor: pointer;
    border: 4px solid transparent;
    border-radius: 16px;
    transition: all 0.2s ease;
}

.avatar-option:hover {
    border-color: #60a5fa;
}

.avatar-option.selected {
    border-color: #fca13a;
    transform: scale(1.05);
}

.avatar-option img {
    width: 100%;
    border-radius: 12px;
    display: block;
}

.modal-actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 2rem;
}

.modal-actions button {
    font-family: 'Fredoka One', cursive;
    font-size: 1.1rem;
    padding: 0.75rem 2rem;
    border-radius: 16px;
    border: 3px solid #1e1e1e;
    box-shadow: 4px 4px 0 #1e1e1e;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-cancel {
    background-color: #f3f4f6;
    color: #1e1e1e;
}

.btn-confirm {
    background-color: #4ade80;
    color: #1e1e1e;
}

.btn-confirm:disabled {
    background: #d1d5db;
    color: #9ca3af;
    box-shadow: 4px 4px 0 #9ca3af;
    cursor: not-allowed;
}

.icon-articles {
    width: 40px;
    height: 40px;
}

.cancel-btn-yes,
.cancel-btn-no {
    font-family: 'Fredoka One', cursive;
    font-size: 1.1rem;
    padding: 0.75rem 2rem;
    border-radius: 16px;
    border: 3px solid #1e1e1e;
    box-shadow: 4px 4px 0 #1e1e1e;
    cursor: pointer;
    transition: all 0.2s ease;
    display: inline-block;
    margin: 1rem 0.5rem 0 0.5rem;
}

.cancel-btn-yes {
    background-color: #f44336;
    color: #fff;
}

.cancel-btn-no {
    background-color: #ffdc52;
    color: #1e1e1e;
}

.cancel-btn-yes:hover,
.cancel-btn-no:hover {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 #1e1e1e;
}

.open__cancel-modal {
    margin-top: 10px;
    font-style: italic;
    font-weight: 600;
    font-family: "Nunito", sans-serif;
    font-size: 1rem;
    background: #da4f4f;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 10px;
    box-shadow: 4px 4px 0 black;
    cursor: pointer;
    transition: .2s;
}

button.delete-account-btn {
    margin-top: 2rem;
    font-size: 1rem;
    font-weight: 600;
    background-color: #f44336;
    color: white;
    border: 3px solid #1e1e1e;
    padding: 10px 20px;
    border-radius: 16px;
    box-shadow: 4px 4px 0 black;
    font-family: 'Fredoka One', cursive;
    transition: 0.2s ease;
}

button.delete-account-btn:hover {
    background: #333;
    box-shadow: 2px 2px 0 #d1d5db;
}

.open__cancel-modal:hover {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 #1e1e1e;
}

@media (min-width: 1023px ) {
    .open__cancel-modal:hover {
        transform: translate(2px, 2px);
        box-shadow: 2px 2px 0 black;
        transition: .2s;
    }
}

.subscription-row {
    max-height: 80px;
    overflow: hidden;
    justify-content: space-between;
    border-radius: 16px;
    margin-top: 1.5rem;
    box-shadow: 4px 4px 0 #1e1e1e;
    cursor: pointer;
    background-color: #fff7dd;
    border: 3px solid #1e1e1e;
    padding: 1rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    transition: max-height 0.3s ease;

}

.subscription-row.open {
    max-height: 300px;
    transition: .6s;
    font-size: 1.3rem;
    font-weight: bold;
    font-family: 'Fredoka One', cursive;
    color: #1e1e1e;
}

.subscription-label {
    min-width: 150px;
    margin-top: 1rem;
    font-size: 1.1rem;
    font-weight: 600;
    color: #6b7280;
}

.subscription-status {
    text-align: right;
    flex: 1;
    margin-top: 0.5rem;
    font-size: 1rem;
}

.subscription-status p {
    margin: 0;
    font-size: 1rem;
    font-weight: 500;
}

.subscription-status .active {
    color: #f97316;
    font-weight: bold;
}

.subscription-status .cancelled {
    color: #ff9800;
    font-weight: bold;
}

.subscription-details {
    padding-top: 0.5rem;
    font-size: 0.95rem;
    color: #1e1e1e;
}

.fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
    opacity: 0;
}
</style>