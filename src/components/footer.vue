<template>
	<footer class="magic-footer">
		<div class="magic-footer__content">
			<img @click="buyKoffe" class="coffe" src="../../assets/images/heart.svg" alt="">
			<p class="magic-footer__text">
				✨ Сделано с магией<br>
				📚 Более 500 слов для твоего волшебного пути<br>
				🔮 Сайт для изучения артиклей в немецком языке
			</p>
			<p class="magic-footer__small">© {{ new Date().getFullYear() }} DerDieDas.com</p>
		</div>
	</footer>
</template>

<script setup>

	const buyKoffe = ()=> {
		window.open("https://www.buymeacoffee.com/diederdas", "_blank");
	}

</script>

<style scoped>
	.magic-footer {
		padding: 2rem 1rem;
		background: linear-gradient(to right, #f3e5ff, #e3d6fc);
		text-align: center;
		font-family: 'Uncial Antiqua', cursive;
		color: #4a256d;
	}

	.magic-footer__text {
		font-size: 1.2rem;
		line-height: 2;
		margin-bottom: 1rem;
	}

	.magic-footer__small {
		font-size: 0.9rem;
		color: #8052aa;
	}

	.coffe {
		cursor: pointer;
	}
</style>
