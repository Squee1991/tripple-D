<template>
	<footer class="footer">
		<div class="footer-container">
			<div class="footer-brand">
				<img src="../../assets/images/3dLogo.png" alt="Der Die Das" class="footer-logo"/>
			</div>
			<nav class="footer-links">
				<li v-for="item in data.items" :key="item.id">
					<NuxtLink class="footer-link" :to="item.url"> {{ t(item.value)}}</NuxtLink>
				</li>
			</nav>
			<LangSwitcher/>
		</div>
		<p class="footer-copy">© {{ new Date().getFullYear() }} {{ t(data.footer)}} </p>
	</footer>
</template>

<script setup>
	import LangSwitcher from './langSwitcher.vue'
    const { t} = useI18n()

	const data = {
		footer: "footer.copy",
		items: [
			{id: 1 , url: "about" , value: "nav.about"},
		]
	}

</script>

<style scoped>

	.footer {
		background: linear-gradient(135deg, #a9b8f9 0%, #ede6ff 100%);
		padding: 44px 20px 20px;
		box-shadow: 0 12px 60px #786ed628 inset, 0 3px 18px #f5eeff9c inset;
		font-family: 'Montserrat', 'Inter', sans-serif;
	}

	.footer-container {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: 26px;
		border-radius: 20px;
		padding: 22px 38px;
	}

	.footer-brand {
		background: none;
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 10px 24px;
	}

	.footer-logo {
		width: 86px;
		height: 86px;
		border-radius: 18px;
	}

	.footer-links {
		display: flex;
		gap: 26px;
		flex-wrap: wrap;
		justify-content: center;
		border-radius: 14px;
		padding: 10px 26px;
	}

	.footer-link {
		background: linear-gradient(90deg, #366cff 60%, #4c88ff 100%);
		color: #fff;
		border: none;
		font-weight: 700;
		font-size: 20px;
		padding: 14px 36px;
		border-radius: 14px 30px 14px 30px / 30px 14px 30px 14px;
		box-shadow: 0 2px 8px 0 #15235e44;
		cursor: pointer;
		letter-spacing: 0.06em;
		text-shadow: 0 1px 2px #26358580;
		transition: transform 0.12s, box-shadow 0.12s, background 0.12s;
		margin-bottom: 0;
	}

	.footer-link:hover {
		color: #1f1478;
		background: linear-gradient(90deg, #f3ebff 30%, #e0dbfa 100%);
		text-shadow: 0 6px 18px #b7aaff90, 0 1px 2px #fff8;
	}

	.footer-meta {
		display: flex;
		gap: 20px;
		flex-wrap: wrap;
		padding: 10px 22px;
	}

	.social-icons {
		display: flex;
		gap: 18px;
	}

	.social-icon {
		color: #887de7;
		font-size: 23px;
		border-radius: 50%;
		background: linear-gradient(120deg, #f6f1ff 30%, #e0e9ff 100%);
		padding: 7px;
		box-shadow: 0 2px 6px #c6bfff30, 0 1px 3px #fff7 inset;
		transition: color 0.19s, box-shadow 0.19s, transform 0.13s;
	}

	.social-icon:hover {
		color: #4f39b9;
		background: linear-gradient(120deg, #f3ebff 40%, #ede6ff 100%);
		box-shadow: 0 7px 18px #b7aaff88, 0 1px 2px #fff8 inset;
		transform: scale(1.13);
	}

	.lang-select {
		border: none;
		border-radius: 10px;
		padding: 7px 18px;
		font-size: 15px;
		font-family: 'Montserrat', 'Inter', sans-serif;
		color: #61589d;
		font-weight: 700;
		outline: none;
		transition: box-shadow 0.15s, background 0.14s, color 0.14s;
		margin-left: 8px;
	}

	.lang-select:focus {
		background: linear-gradient(120deg, #ede6ff 40%, #d7d0fa 100%);
		box-shadow: 0 4px 13px #d8cfff66, 0 2px 8px #fff9 inset;
		color: #442c8c;
	}

	.footer-copy {
		text-align: center;
		margin-top: 32px;
		font-size: 14.5px;
		font-family: 'Montserrat', 'Inter', sans-serif;
		color: #8f8cb9;
		text-shadow: 0 2px 9px #f3eaffc0, 0 0px 1px #fff6;
		letter-spacing: 0.01em;
		font-weight: 600;
	}

</style>
