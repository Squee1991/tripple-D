<template>
	<section class="feedback">
		<div class="feed__back-wrapper">
			<div>
				<img class="spell__book" src="../../assets/images/spelbook.svg" alt="">
			</div>
			<div class="form__content">
				<h2 class="feedback__title">📜 Оставь след в книге волшебства</h2>
				<form class="feedback__form">
					<input
						class="feedback__input"
						type="text"
						placeholder="Твоё имя или никнейм"
					/>
					<textarea
						class="feedback__textarea"
						rows="5"
						placeholder="Напиши, что думаешь или что хочешь улучшить..."
					></textarea>
					<button type="submit" class="feedback__button">
						✨ Отправить заклинание
					</button>
				</form>
			</div>
		</div>
	</section>
</template>

<script setup>
	// логики пока нет — только внешний вид
</script>

<style scoped>
	.feedback {
		padding: 2rem 1rem;
		background-color: #f8f4ff;
		/*border-top: 2px dashed #a246e4;*/
		font-family: 'Uncial Antiqua', cursive;
		text-align: center;
	}

	.feedback__title {
		font-size: 1.6rem;
		margin-bottom: 1.5rem;
		color: #572f7e;
	}

	.feed__back-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.form__content{
		padding: 20px;
		width: 40%;
	}

	.feedback__form {
		margin: 0 auto;
		display: flex;
		flex-direction: column;
	}

	.spell__book {
		padding: 20px 40px;
		margin-top: 40px;
	}

	.feedback__input,
	.feedback__textarea {
		font-family: 'Uncial Antiqua', cursive;
		font-size: 13px;
		padding: 0.8rem 1rem;
		margin-bottom: 1.2rem;
		border: 2px solid #a246e4;
		border-radius: 8px;
		background-color: #fffdfc;
		color: #333;
		resize: vertical;
	}

	.feedback__input::placeholder,
	.feedback__textarea::placeholder {
		color: #a246e4;
	}

	.feedback__button {
		font-family: 'Uncial Antiqua', cursive;
		font-size: 1.1rem;
		padding: 0.8rem 1.5rem;
		background-color: #a246e4;
		color: white;
		border: none;
		border-radius: 10px;
		cursor: pointer;
		transition: 0.3s;
	}

	.feedback__button:hover {
		background-color: #7a2db6;
	}
</style>
