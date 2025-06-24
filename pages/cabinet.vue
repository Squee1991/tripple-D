<template>
	<div class="cabinet-wrapper">
		<div class="sidebar">
			<button @click="pathBack" class="button__back">&lt;</button>
			<div class="menu-icon active">🏠</div>
			<div class="menu-icon">⚙</div>
		</div>
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
						<div class="exp-bar">
							<div class="exp-fill" :style="{ width: `${(learningStore.exp / 100) * 100}%` }"></div>
							<span class="exp-bar-exp">{{ learningStore.exp }} XP</span>
						</div>
						<div class="expol__lvl-value">Уровень: {{ learningStore.isLeveling }}</div>
					</div>
				</div>
				<div class="balance-block">
					<p class="sub">Артиклюсы</p>
					<p class="balance">{{ learningStore.points }}</p>
				</div>
				<div class="meta-block">
					<p class="meta">Дата регистрации</p>
					<p class="date">{{ regDate || '—' }}</p>
				</div>
			</div>
			<div class="tabs">
				<div class="tab" :class="{ active: activeTab === 'info' }" @click="setTab('info')">
					<img class="tab__icon" src="../assets/images/witch-hat.svg" alt="">
					<span class="tab__text">Личные данные</span>
				</div>
				<div class="tab" :class="{ active: activeTab === 'progress' }" @click="setTab('progress')">
					<img class="tab__icon" src="../assets/images/progress.svg" alt="">
					<span class="tab__text">Прогресс</span>
				</div>
				<div class="tab" :class="{ active: activeTab === 'skills' }" @click="setTab('skills')">
					<img class="tab__icon" src="../assets/images/magic-book.svg" alt="">
					<span class="tab__text">Способности</span>
				</div>
			</div>
			<div v-if="activeTab === 'info'" class="tab-content">
				<div class="row"><span>Имя:</span><span>{{ authStore.name }}</span></div>
				<div class="row"><span>Email:</span><span>{{ authStore.email }}</span></div>
			</div>
			<div v-if="activeTab === 'progress'">
				<Progress/>
			</div>
			<div v-if="activeTab === 'skills'" class="tab-content">
				<Skills/>
			</div>
		</div>

		<div v-if="isAvatarModalOpen" class="avatar-modal-overlay" @click.self="isAvatarModalOpen = false">
			<div class="avatar-modal-content">
				<h3>Выберите аватар</h3>
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
					<button @click="confirmAvatarChange" :disabled="!selectedAvatar" class="btn-confirm">Сохранить</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { userAuthStore } from '../store/authStore.js'
	import { userlangStore } from '../store/learningStore.js'
	import { ref, computed, onMounted, watch } from 'vue'
	import Progress from '../src/components/progress.vue'
	import Skills from '../src/components/skillz.vue'
	import { useRouter } from 'vue-router'

	const authStore = userAuthStore()
	const learningStore = userlangStore()
	const router = useRouter()
	const activeTab = ref('info')
	const isAvatarModalOpen = ref(false);
	const selectedAvatar = ref(null);

	watch(isAvatarModalOpen, (newValue) => {
		if (newValue) {
			selectedAvatar.value = authStore.avatar;
		}
	});

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

	const pathBack = () => {
		router.push('/')
	}

	const setTab = (tab) => {
		activeTab.value = tab
	}

	const regDate = computed(() => {
		if (!authStore.registeredAt) return '-'
		return new Date(authStore.registeredAt).toLocaleDateString('ru-Ru', {
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
	/* Стили не меняются, они корректны */
	* {
		padding: 0;
		margin: 0;
		box-sizing: border-box;
	}

	.button__back {
		border: none;
		font-size: 20px;
		display: flex;
		justify-content: center;
		align-items: center;
		color: white;
		background: none;
		border-radius: 15px;
		cursor: pointer;
	}

	.cabinet-wrapper {
		display: flex;
		height: 100%;
		min-height: 100vh;
		background: radial-gradient(circle at center, #423f3f 0%, #544e4e 100%);
		color: #fff;
		font-family: 'Segoe UI', sans-serif;
	}

	.sidebar {
		width: 70px;
		background: rgba(255, 255, 255, 0.03);
		display: flex;
		align-items: center;
		flex-direction: column;
		padding-top: 2rem;
		gap: 1.5rem;
		backdrop-filter: blur(6px);
		border-right: 1px solid rgba(255, 255, 255, 0.05);
	}

	.menu-icon {
		font-size: 1.4rem;
		cursor: pointer;
		opacity: 0.6;
		transition: 0.3s;
	}

	.menu-icon:hover,
	.menu-icon.active {
		opacity: 1;
		color: #00c2ff;
	}

	.main-content {
		flex: 1;
		padding: 2rem 3rem;
		display: flex;
		flex-direction: column;
		justify-content: start;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start; /* Изменено для лучшего выравнивания с аватаром */
	}

	.user-block {
		display: flex;
		align-items: flex-start; /* Изменено */
	}

	.user-info {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}


	.balance-block,
	.meta-block {
		text-align: right;
	}

	.balance {
		font-size: 1.8rem;
		font-weight: bold;
		text-align: center;
	}

	.sub,
	.meta {
		font-size: 0.9rem;
		opacity: 0.6;
		text-align: center;
	}

	.date {
		font-size: 1rem;
		color: #ccc;
	}

	.tabs {
		display: flex;
		gap: 2rem;
		margin: 2rem 0 1rem;
	}

	.tab {
		display: flex;
		justify-content: center;
		padding-bottom: 0.5rem;
		cursor: pointer;
		opacity: 0.7;
		position: relative;
	}


	.tab__text {
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 22px;
		font-weight: 600;
		color: #fff4b8;
	}

	.tab__icon {
		width: 40px;
		margin-right: 10px;
	}

	.tab.active {
		opacity: 1;
		font-weight: bold;
	}

	.tab.active:after {
		content: '';
		position: absolute;
		bottom: -6px;
		left: 0;
		height: 4px;
		width: 100%;
		background: #ffd700;
		border-radius: 2px;
	}

	.tab-content {

	}

	.row {
		display: flex;
		justify-content: space-between;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		padding: 0.5rem 0;
		font-size: 1.1rem;
	}

	.exp-bar {
		height: 30px;
		width: 220px;
		background: linear-gradient(90deg, #2e1e40 60%, #462f5e 120%);
		border: 3px solid #e3e1d3;
		border-radius: 13px;
		margin-bottom: 6px;
		overflow: hidden;
		box-shadow: 0 0 16px #ffd70088,
		0 0 30px #ffe99e33 inset,
		0 2px 14px #1b093766;
		position: relative;
	}

	.exp-fill {
		height: 100%;
		background: #ff6f00;
		box-shadow: 0 0 17px #ffe17088, 0 0 44px #bfa5e6cc;
		transition: width 0.5s cubic-bezier(.35, 2, .6, 1);
		position: relative;
		border-radius: 13px;
	}

	.exp-bar::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: 13px;
		box-shadow: 0 0 30px #ffe8b366, 0 0 80px #ffeaaa22 inset;
		opacity: .33;
		pointer-events: none;
	}

	.exp-bar-exp {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50% , -50%);
	}

	.expol__lvl-value{
		font-size: 24px;
		margin-left: 10px;
	}

	/* ================================= */
	/* НОВЫЕ СТИЛИ ДЛЯ АВАТАРА         */
	/* ================================= */
	.avatar-container {
		position: relative;
		margin-right: 20px;
		flex-shrink: 0; /* Предотвращает сжатие аватара */
	}

	.avatar-current, .avatar-placeholder {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		border: 3px solid #ffd369;
		object-fit: cover;
		background-color: #2c2828;
	}

	.avatar-placeholder {
		border-color: #666;
		background-color: #333;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 2rem;
		color: #666;
	}

	.change-avatar-btn {
		position: absolute;
		bottom: -4px;
		right: -4px;
		width: 32px;
		height: 32px;
		background: #fff;
		border: 2px solid #ffd369;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: transform 0.2s ease;
		padding: 0;
	}

	.change-avatar-btn:hover {
		transform: scale(1.15);
	}

	.change-avatar-btn img {
		width: 16px;
		height: 16px;
	}

	/* Стили для модального окна */
	.avatar-modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.75);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		backdrop-filter: blur(5px);
	}

	.avatar-modal-content {
		background: #3a3636;
		padding: 2rem;
		border-radius: 15px;
		border: 2px solid #ffd369;
		box-shadow: 0 0 40px rgba(255, 211, 105, 0.5);
		width: 90%;
		max-width: 600px;
		color: #fff;
		text-align: center;
	}

	.avatar-modal-content h3 {
		font-size: 1.5rem;
		color: #ffd369;
	}

	.avatar-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
		gap: 1.5rem;
		margin: 2rem 0;
		max-height: 50vh;
		padding-right: 10px;
	}

	.avatar-option {
		cursor: pointer;
		border: 3px solid transparent;
		border-radius: 15px;
		transition: all 0.2s ease;
		padding: 5px;
		background: rgba(255,255,255,0.05);
	}

	.avatar-option:hover {
		border-color: #00c2ff;
		transform: translateY(-5px);
	}

	.avatar-option.selected {
		border-color: #ffd369;
		transform: scale(1.05);
		box-shadow: 0 0 15px #ffd369;
	}

	.avatar-option img {
		width: 100%;
		border-radius: 10px;
		display: block;
	}

	.modal-actions {
		display: flex;
		justify-content: center;
		gap: 1rem;
		margin-top: 1rem;
	}

	.modal-actions button {
		padding: 12px 30px;
		border-radius: 8px;
		border: none;
		cursor: pointer;
		font-size: 1rem;
		font-weight: bold;
		transition: all 0.2s;
	}

	.btn-cancel {
		background-color: #555;
		color: #fff;
		border: 1px solid #777;
	}
	.btn-cancel:hover {
		background-color: #666;
	}

	.btn-confirm {
		background-color: #ffd369;
		color: #1a1a1a;
	}
	.btn-confirm:hover {
		background-color: #ffc73d;
		box-shadow: 0 0 10px #ffd369;
	}
	.btn-confirm:disabled {
		background-color: #444;
		color: #888;
		cursor: not-allowed;
		box-shadow: none;
	}
</style>