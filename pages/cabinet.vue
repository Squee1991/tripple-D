<template>
	<div class="cabinet-wrapper">
		<div class="sidebar">
			<button @click="pathBack" class="button__back"><</button>
			<div class="menu-icon active">🏠</div>
			<div class="menu-icon">⚙</div>
			<!--			<div class="menu-icon">🔔 </div>-->
		</div>
		<div class="main-content">
			<div class="header">
				<div class="user-block">
					<div class="user-info">
						<div class="exp-bar">
							<div class="exp-fill" :style="{ width: `${(learningStore.exp / 100) * 100}%` }"></div>
						</div>
						<span>{{ learningStore.exp }} XP</span>
						<div>Уровень: {{ learningStore.isLeveling }}</div>
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
	</div>
</template>
<script setup>
	import {userAuthStore} from '../store/authStore.js'
	import {userlangStore} from '../store/learningStore.js'
	import {ref, computed} from 'vue'
	import Progress from '../src/components/progress.vue'
	import Skills from '../src/components/skillz.vue'
	import {onMounted} from 'vue'
	import {useRouter} from 'vue-router'

	const authStore = userAuthStore()
	const learningStore = userlangStore()
	const router = useRouter()
	const activeTab = ref('info')
	const pathBack = () => {
		router.push('/')
	}

	const setTab = (tab) => {
		activeTab.value = tab
	}

	const regDate = computed(() => {
		if (!authStore.registeredAt) return '-'
		return new Date(authStore.registeredAt).toLocaleDateString('ru-Ru',  {
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

	.exp-bar {
		height: 14px;
		width: 100%;
		background: #352c1f;
		border: 1px solid #ffd369;
		border-radius: 8px;
		margin-top: 6px;
		overflow: hidden;
	}

	.exp-fill {
		height: 100%;
		background: linear-gradient(to right, #ffc107, #ff9800);
		transition: width 0.3s ease;
	}


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
		align-items: center;
	}

	.user-block {
		display: flex;
		align-items: center;
	}

	.avatar__wrapper {
		width: 160px;
		display: flex;
	}

	.avatar {
		width: 100%;

	}

	.nickname {
		font-size: 1.5rem;
		margin: 0;
	}

	.status {
		font-size: 0.9rem;
		color: #00c2ff;
		margin-top: 4px;
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
		background: rgba(36, 26, 14, 0.7);
		padding: 1rem 1.5rem;
		border-radius: 12px;
		box-shadow: 0 0 15px #000;
		border: 2px solid #c29f52;
	}

	.row {
		display: flex;
		justify-content: space-between;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		padding: 0.5rem 0;
		font-size: 1.1rem;
	}

	.exp-bar {
		height: 22px;
		width: 220px;
		background: linear-gradient(90deg, #2e1e40 60%, #462f5e 120%);
		border: 3px solid #ffd700;
		border-radius: 13px;
		margin-top: 7px;
		margin-bottom: 6px;
		overflow: hidden;
		box-shadow: 0 0 16px #ffd70088,
		0 0 30px #ffe99e33 inset,
		0 2px 14px #1b093766;
		position: relative;
	}

	.exp-fill {
		height: 100%;
		background: linear-gradient(90deg, #ffeeba 0%, #ffe170 46%, #c59cff 100%);
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


</style>
