<template>
	<footer class="footer">
		<div class="footer__container">
			<div class="footer-brand">
				<NuxtLink to="/">
					<img src="../../assets/images/3dLogo.png" alt="Der Die Das" class="footer-logo"/>
				</NuxtLink>
			</div>
			<nav class="footer-links">
				<li v-for="item in data.items" :key="item.id">
					<NuxtLink class="footer-link" :to="item.url"> {{ t(item.value)}}</NuxtLink>
				</li>
				<div @click="toDiscord" class="discord__img">
					<svg enable-background="new 0 0 24 24" height="30" viewBox="0 0 24 24" width="30" xmlns="http://www.w3.org/2000/svg">
						<g fill="currentColor">
							<path d="m3.58 21.196h14.259l-.681-2.205c.101.088 5.842 5.009 5.842 5.009v-21.525c-.068-1.338-1.22-2.475-2.648-2.475l-16.767.003c-1.427 0-2.585 1.139-2.585 2.477v16.24c0 1.411 1.156 2.476 2.58 2.476zm10.548-15.513-.033.012.012-.012zm-7.631 1.269c1.833-1.334 3.532-1.27 3.532-1.27l.137.135c-2.243.535-3.26 1.537-3.26 1.537.104-.022 4.633-2.635 10.121.066 0 0-1.019-.937-3.124-1.537l.186-.183c.291.001 1.831.055 3.479 1.26 0 0 1.844 3.15 1.844 7.02-.061-.074-1.144 1.666-3.931 1.726 0 0-.472-.534-.808-1 1.63-.468 2.24-1.404 2.24-1.404-3.173 1.998-5.954 1.686-9.281.336-.031 0-.045-.014-.061-.03v-.006c-.016-.015-.03-.03-.061-.03h-.06c-.204-.134-.34-.2-.34-.2s.609.936 2.174 1.404c-.411.469-.818 1.002-.818 1.002-2.786-.066-3.802-1.806-3.802-1.806 0-3.876 1.833-7.02 1.833-7.02z"/>
							<path d="m14.308 12.771c.711 0 1.29-.6 1.29-1.34 0-.735-.576-1.335-1.29-1.335v.003c-.708 0-1.288.598-1.29 1.338 0 .734.579 1.334 1.29 1.334z"/>
							<path d="m9.69 12.771c.711 0 1.29-.6 1.29-1.34 0-.735-.575-1.335-1.286-1.335l-.004.003c-.711 0-1.29.598-1.29 1.338 0 .734.579 1.334 1.29 1.334z"/>
						</g>
					</svg>
				</div>
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

	const toDiscord = () => {
		window.open('https://discord.gg/a5bkqpeP')
	}

</script>

<style scoped>
	.footer {
		background-color: #F7FAFC;
		border-top: 2px solid #bdc8d6;
		padding: 3rem 1.5rem 2rem;
		font-family: 'Nunito', sans-serif;
	}

	.footer__container {
		max-width: 1280px;
		margin: 0 auto;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: 2rem;
	}

	.footer-brand {
		display: flex;
		align-items: center;
	}

	.footer-logo {
		width: 60px;
		height: auto;
	}

	.footer-links {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.footer-link {
		font-size: 1rem;
		font-weight: 600;
		color: #718096;
		text-decoration: none;
		transition: color 0.2s ease-in-out;
	}

	.footer-link:hover {
		color: #5A67D8;
		text-decoration: underline;
	}

	.footer-copy {
		text-align: center;
		margin-top: 3rem;
		font-size: 0.875rem;
		color: #A0AEC0;
	}

	.discord__img {
		color: blue;
		cursor: pointer;
	}

	.discord__img:hover {
		color: #d9bcbc;
	}

	svg {
		color: currentColor;
	}

	@media (max-width: 768px) {
		.footer__container {
			flex-direction: column;
			gap: 1.5rem;
		}
	}
</style>