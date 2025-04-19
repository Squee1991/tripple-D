<template>
	<div class="cabinet-wrapper">
		<div class="sidebar">
			<div class="menu-icon active">🏠</div>
			<div class="menu-icon">⚙</div>
			<div class="menu-icon">🔔</div>
		</div>
		<div class="main-content">
			<div class="header">
				<div class="user-block">
					<div class="avatar__wrapper">
						<img class="avatar" src="../assets/images/Avatars.png" alt=""/>
					</div>
					<div class="user-info">
						<h2 class="nickname">Squee1991</h2>
						<p class="status">🔥 Platinum</p>
					</div>
				</div>
				<div class="balance-block">
					<p class="sub">Общий баланс</p>
					<p class="balance">99 очков</p>
				</div>
				<div class="meta-block">
					<p class="meta">Дата регистрации</p>
					<p class="date">01.01.2024</p>
				</div>
			</div>
			<div class="tabs">
				<div class="tab active">
					<img  class="tab__icon" src="../assets/images/witch-hat.svg" alt="">
					<span class="tab__text">Личные данные</span>
				</div>
				<div class="tab">
					<img  class="tab__icon" src="../assets/images/progress.svg" alt="">
					<span class="tab__text">Прогресс</span>
				</div>
				<div class="tab">
					<img class="tab__icon" src="../assets/images/magic-book.svg" alt="">
					<span class="tab__text">Способности</span>
				</div>
			</div>
			<div class="tab-content">
				<div class="row"><span>Имя:</span><span>Игорь</span></div>
				<div class="row"><span>Email:</span><span>igor.chudesny1991@gmail.com</span></div>
				<div class="row"><span>Пароль:</span><span>*******</span></div>
			</div>
		</div>
	</div>
</template>
<script setup>

</script>

<style scoped>

	* {
		padding: 0;
		margin: 0;
		box-sizing: border-box;
	}

	.cabinet-wrapper {
		display: flex;
		height: 100vh;
		background: radial-gradient(circle at center, #0e0e0e 0%, #000 100%);
		color: #fff;
		font-family: 'Segoe UI', sans-serif;
	}

	.sidebar {
		width: 70px;
		background: rgba(255, 255, 255, 0.03);
		display: flex;
		flex-direction: column;
		align-items: center;
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
		margin-bottom: 1.5rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.05);
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
		color: white;
	}

	.tab__icon {
		width: 50px;
		margin-right: 10px;
	}

	.tab.active {
		opacity: 1;
		font-weight: bold;
	}

	.tab.active:after {
		content: '';
		position: absolute;
		bottom: -1px;
		left: 0;
		height: 2px;
		width: 100%;
		background: #00c2ff;
	}

	.tab-content {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding-left: 1rem;
	}

	.row {
		display: flex;
		justify-content: space-between;
		border-bottom: 1px solid rgba(255, 255, 255, 0.05);
		padding-bottom: 0.5rem;
		font-size: 1rem;
	}

</style>
