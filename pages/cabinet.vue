<template>
	<div class="cabinet-wrapper">
		<div class="sidebar">
			<button @click="pathBack" class="sidebar-btn back-btn" title="На главную">←</button>
			<button class="sidebar-btn" title="Настройки">⚙️</button>
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
						<div class="user-name">{{ authStore.name }}</div>
						<div class="exp-bar">
							<div class="exp-fill" :style="{ width: `${(learningStore.exp / 100) * 100}%` }"></div>
							<span class="exp-text">{{ learningStore.exp }} / 100 XP</span>
						</div>
						<div class="level-info">Уровень: {{ learningStore.isLeveling }}</div>
					</div>
				</div>
				<div class="stats-blocks">
					<div class="balance-block">
						<p class="sub">Артиклюсы</p>
						<p class="balance">{{ learningStore.points }}</p>
					</div>
					<div class="meta-block">
						<p class="sub">Дата регистрации</p>
						<p class="date">{{ regDate || '—' }}</p>
					</div>
				</div>
			</div>

			<div class="tabs">
				<button class="tab" :class="{ active: activeTab === 'info' }" @click="setTab('info')">
					<img class="tab-icon" src="../assets/images/user.svg" alt="">
					<span>Личные данные</span>
				</button>
				<button class="tab" :class="{ active: activeTab === 'progress' }" @click="setTab('progress')">
					<img class="tab-icon" src="../assets/images/progress.svg" alt="">
					<span>Прогресс</span>
				</button>
				<button class="tab" :class="{ active: activeTab === 'skills' }" @click="setTab('skills')">
					<img class="tab-icon" src="../assets/images/magic-book.svg" alt="">
					<span>Способности</span>
				</button>
			</div>

			<div class="tab-content-wrapper">
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
					<button @click="confirmAvatarChange" :disabled="!selectedAvatar" class="btn-confirm">Сохранить</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	// Скрипт без изменений
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
	/* --- НАЧАЛО: НОВЫЕ СТИЛИ С СОХРАНЕНИЕМ МАКЕТА --- */
	.cabinet-wrapper {
		display: flex;
		min-height: 100vh;
		background: #fef8e4; /* Фирменный фон */
		font-family: 'Inter', sans-serif;
		color: #1e1e1e;
	}

	/* --- Боковая панель --- */
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

	/* --- Основной контент --- */
	.main-content {
		flex: 1;
		padding: 2rem 3rem;
		display: flex;
		flex-direction: column;
	}

	/* --- Хедер в основном контенте --- */
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

	.avatar-container { position: relative; }
	.avatar-current, .avatar-placeholder {
		width: 100px; height: 100px; border-radius: 50%;
		border: 4px solid #1e1e1e; object-fit: cover;
	}
	.avatar-placeholder { background-color: #f3f4f6; }

	.change-avatar-btn {
		position: absolute; bottom: 0; right: 0;
		width: 36px; height: 36px; background: #fca13a;
		border: 3px solid #1e1e1e; border-radius: 50%;
		display: flex; align-items: center; justify-content: center;
		cursor: pointer; transition: all 0.2s ease;
	}
	.change-avatar-btn:hover { transform: scale(1.1); }
	.change-avatar-btn img { width: 16px; height: 16px; }

	.user-info { display: flex; flex-direction: column; gap: 0.5rem; }
	.user-name { font-family: 'Fredoka One', cursive; font-size: 1.8rem; }

	.exp-bar {
		width: 250px; height: 28px; background-color: #e5e7eb;
		border-radius: 14px; border: 3px solid #1e1e1e;
		overflow: hidden; position: relative;
	}
	.exp-fill {
		height: 100%; background: #4ade80; border-radius: 8px;
		transition: width 0.5s ease;
	}
	.exp-text {
		position: absolute; top: 50%; left: 50%;
		transform: translate(-50%, -50%);
		font-size: 0.9rem; font-weight: bold; color: #1e1e1e;
	}

	.level-info { font-family: 'Fredoka One', cursive; font-size: 1.2rem; color: #555; }

	.stats-blocks { display: flex; gap: 1rem; }
	.balance-block, .meta-block {
		background-color: #fff; border: 3px solid #1e1e1e;
		box-shadow: 4px 4px 0 #1e1e1e;
		border-radius: 16px; padding: 0.5rem 1rem; text-align: center;
	}
	.sub { font-size: 0.9rem; font-weight: 500; color: #555; }
	.balance, .date {
		font-family: 'Fredoka One', cursive; font-size: 1.5rem; margin-top: 0.25rem;
	}
	.balance { color: #f97028; }

	/* --- Вкладки (табы) --- */
	.tabs { display: flex; gap: 1rem; margin: 2rem 0; }
	.tab {
		font-family: 'Fredoka One', cursive; display: flex; align-items: center; gap: 0.5rem;
		padding: 0.75rem 1.5rem; border: 3px solid #1e1e1e; border-radius: 16px;
		box-shadow: 4px 4px 0 #1e1e1e; cursor: pointer; transition: all 0.2s ease;
		background-color: #fff; font-size: 1.1rem;
	}
	.tab:hover { transform: translate(2px, 2px); box-shadow: 2px 2px 0 #1e1e1e; }
	.tab.active {
		background-color: #fca13a; color: white;
		transform: translate(4px, 4px); box-shadow: 0 0 0 #1e1e1e;
	}
	.tab.active .tab-icon { filter: brightness(0) invert(1); }
	.tab-icon { width: 24px; }

	/* --- Контент вкладок --- */
	.tab-content-wrapper {
		background-color: #fff; border: 3px solid #1e1e1e;
		box-shadow: 8px 8px 0 #e5e7eb;
		padding: 1.5rem; border-radius: 16px;
	}
	.row {
		display: flex; justify-content: space-between; padding: 0.75rem 0;
		border-bottom: 2px solid #f3f4f6; font-size: 1.1rem;
	}
	.row:last-child { border-bottom: none; }
	.row span:first-child { font-weight: bold; }

	/* --- Модальное окно --- */
	.avatar-modal-overlay {
		position: fixed; top: 0; left: 0; width: 100%; height: 100%;
		background-color: rgba(0, 0, 0, 0.6);
		display: flex; align-items: center; justify-content: center; z-index: 1000;
	}
	.avatar-modal-content {
		background: #fff; padding: 2rem; border-radius: 24px;
		border: 4px solid #1e1e1e; box-shadow: 8px 8px 0 #1e1e1e;
		width: 90%; max-width: 600px; text-align: center;
	}
	.avatar-modal-content h3 { font-family: 'Fredoka One', cursive; font-size: 1.8rem; margin-bottom: 2rem; }
	.avatar-grid {
		display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
		gap: 1rem; max-height: 50vh; overflow-y: auto; padding: 0.5rem;
	}
	.avatar-option {
		cursor: pointer; border: 4px solid transparent; border-radius: 16px;
		transition: all 0.2s ease;
	}
	.avatar-option:hover { border-color: #60a5fa; }
	.avatar-option.selected { border-color: #fca13a; transform: scale(1.05); }
	.avatar-option img { width: 100%; border-radius: 12px; display: block; }
	.modal-actions { display: flex; justify-content: center; gap: 1rem; margin-top: 2rem; }
	.modal-actions button {
		font-family: 'Fredoka One', cursive; font-size: 1.1rem; padding: 0.75rem 2rem;
		border-radius: 16px; border: 3px solid #1e1e1e;
		box-shadow: 4px 4px 0 #1e1e1e; cursor: pointer; transition: all 0.2s ease;
	}
	.btn-cancel { background-color: #f3f4f6; color: #1e1e1e; }
	.btn-confirm { background-color: #4ade80; color: #1e1e1e; }
	.btn-confirm:disabled {
		background: #d1d5db; color: #9ca3af;
		box-shadow: 4px 4px 0 #9ca3af; cursor: not-allowed;
	}
</style>