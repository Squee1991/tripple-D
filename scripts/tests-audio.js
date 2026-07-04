// import fs from 'fs';
// import path from 'path';
//
// const TARGET_LEVEL = 'B1';
// const TARGET_TOPIC_ID = 'b1_natur'
// const ELEVEN_API_KEY = 'sk_009b7e3406d7a57da34141447072ae3b252d3cab876bfc97'.trim();
// const VOICE_ID_MALE = 'SfAtBxtKeIJ5PJmhPaty';
// const VOICE_ID_FEMALE = 'DEZHhPbmb8LVZmWufkCh';
//
// async function generateElevenSpeech(text, voiceId) {
// 	const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_64`;
// 	const response = await fetch(url, {
// 		method: 'POST',
// 		headers: {
// 			'xi-api-key': ELEVEN_API_KEY,
// 			'Content-Type': 'application/json'
// 		},
// 		body: JSON.stringify({
// 			text: text,
// 			model_id: 'eleven_turbo_v2_5',
// 			voice_settings: {
// 				stability: 0.67,
// 				similarity_boost: 0.8,
// 				speaking_rate: 0.75,
// 				style: 0.0,
// 				use_speaker_boost: true
// 			}
// 		})
// 	});
//
// 	if (!response.ok) {
// 		const err = await response.text();
// 		throw new Error(`ElevenLabs Error: ${err}`);
// 	}
// 	const arrayBuffer = await response.arrayBuffer();
// 	return Buffer.from(arrayBuffer);
// }
//
// async function run() {
// 	const jsonPath = path.join(process.cwd(), 'public', 'audio-tasks', 'audio-tasks.json');
// 	const baseAudioDir = path.join(process.cwd(), 'public', 'audio');
// 	const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
// 	const levelData = data[TARGET_LEVEL];
// 	if (!levelData) return console.error(`❌ Уровень ${TARGET_LEVEL} не найден!`);
// 	const topic = levelData.find(t => t.id === TARGET_TOPIC_ID);
// 	if (!topic) return console.error(`❌ Тема ${TARGET_TOPIC_ID} не найдена в уровне ${TARGET_LEVEL}!`);
// 	const topicDir = path.join(baseAudioDir, TARGET_LEVEL, topic.id);
// 	if (!fs.existsSync(topicDir)) {
// 		fs.mkdirSync(topicDir, { recursive: true });
// 	}
// 	console.log(`🚀 Начинаю озвучку темы: ${topic.title} [${TARGET_TOPIC_ID}]`);
// 	console.log(`📂 Папка: ${topicDir}\n`);
//
// 	for (const task of topic.tasks) {
// 		const fileName = `${task.id}_main.mp3`;
// 		const filePath = path.join(topicDir, fileName);
//
// 		if (fs.existsSync(filePath)) {
// 			console.log(`  ⏩ Скип: ${task.id}`);
// 			continue;
// 		}
//
// 		console.log(`  🎙 Озвучиваю: ${task.id}...`);
// 		let buffers = [];
//
// 		for (const line of task.dialogue) {
// 			try {
// 				const voiceId = line.gender === 'MALE' ? VOICE_ID_MALE : VOICE_ID_FEMALE;
// 				const chunk = await generateElevenSpeech(line.text, voiceId);
// 				buffers.push(chunk);
// 				await new Promise(r => setTimeout(r, 400));
// 			} catch (err) {
// 				console.error(`    ❌ Ошибка в ${task.id}:`, err.message);
// 				return;
// 			}
// 		}
//
// 		if (buffers.length > 0) {
// 			fs.writeFileSync(filePath, Buffer.concat(buffers));
// 			console.log(`    ✅ Готово!`);
// 		}
// 	}
// 	console.log(`\n✨ Озвучка темы "${topic.title}" завершена!`);
// }
//
// run();
import fs from 'fs';
import path from 'path';

const TARGET_LEVEL = 'beginner';
const ELEVEN_API_KEY = 'sk_009b7e3406d7a57da34141447072ae3b252d3cab876bfc97'.trim();
const VOICE_ID_FEMALE = 'DEZHhPbmb8LVZmWufkCh';

const ALL_THEMES = [
	'firstmeet', 'acquaintance', 'secondmeet', 'refusal_invite', 'family_talk',
	'weekend_plans', 'friend_call', 'hobby_talk', 'party_talk',
	'airport_talk', 'apartment_rent', 'ask_road', 'at_doctor', 'bakery',
	'bank_account', 'barbershop', 'border_check', 'bos_talk', 'bus_stop',
	'bus_talk', 'buying_fruit', 'buying_glasses', 'cafe_order', 'car_buying',
	'car_rental', 'client_talk', 'clothes_shopping', 'complaint', 'consultation_talk',
	'dentist', 'dismissal_talk', 'doctor_visit', 'emergency_call', 'first_day',
	'gas_station', 'hotel_checkin', 'hotel_issue', 'insurance', 'job_interview',
	'job_looking', 'library', 'oil_change', 'order_eat', 'pharmacy_vitamins',
	'police_control', 'police_talk', 'post_office', 'restaurant_dinner', 'road_assistance',
	'salary_talk', 'shopping', 'store_checkout', 'taxi_berlin', 'train_station',
	'train_ticket', 'vacation', 'veterinary'
];

async function generateElevenSpeech(text) {
	const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID_FEMALE}?output_format=mp3_44100_64`;
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'xi-api-key': ELEVEN_API_KEY,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			text: text,
			model_id: 'eleven_turbo_v2_5',
			voice_settings: {
				stability: 0.67,
				similarity_boost: 0.8,
				speaking_rate: 0.75,
				style: 0.0,
				use_speaker_boost: true
			}
		})
	});

	if (!response.ok) {
		const err = await response.text();
		throw new Error(`ElevenLabs Error: ${err}`);
	}
	const arrayBuffer = await response.arrayBuffer();
	return Buffer.from(arrayBuffer);
}

async function run() {
	console.log(`🚀 Начинаю генерацию аудио (БОТ + ОПЦИИ) для: [${TARGET_LEVEL}]...\n`);

	for (const themeId of ALL_THEMES) {
		const jsonPath = path.join(process.cwd(), 'public', 'speak-tasks', TARGET_LEVEL, `${themeId}.json`);
		const outputDir = path.join(process.cwd(), 'public', 'audio', 'speak-tasks', TARGET_LEVEL, themeId);

		if (!fs.existsSync(jsonPath)) continue;

		console.log(`\n📂 Обрабатываю тему: ${themeId}.json`);

		let dialogueData;
		try {
			dialogueData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
		} catch (err) {
			console.error(`  ❌ Ошибка чтения ${themeId}:`, err.message);
			continue;
		}

		if (!fs.existsSync(outputDir)) {
			fs.mkdirSync(outputDir, { recursive: true });
		}

		for (const stepKey of Object.keys(dialogueData)) {
			const stepData = dialogueData[stepKey];
			// 1. Озвучиваем текст бота (botText)
			if (stepData.botText) {
				const botFileName = `${stepKey}.mp3`;
				const botFilePath = path.join(outputDir, botFileName);

				if (!fs.existsSync(botFilePath)) {
					console.log(`  🤖 Бот [${stepKey}]: "${stepData.botText}"`);
					try {
						const buffer = await generateElevenSpeech(stepData.botText);
						fs.writeFileSync(botFilePath, buffer);
						console.log(`    ✅ Сохранено: ${botFileName}`);
						await new Promise(r => setTimeout(r, 400));
					} catch (err) {
						console.error(`    ❌ Ошибка API (бот):`, err.message);
					}
				} else {
					console.log(`  ⏩ Скип (бот уже есть): ${botFileName}`);
				}
			}

			if (stepData.options && Array.isArray(stepData.options)) {
				for (let i = 0; i < stepData.options.length; i++) {
					const optionText = stepData.options[i].text;
					if (!optionText) continue;
					// Очищаем текст от троеточия перед озвучкой, если это поле для ручного ввода
					const cleanText = optionText.replace('...', '').trim();
					const optionFileName = `${stepKey}_option_${i}.mp3`;
					const optionFilePath = path.join(outputDir, optionFileName);
					if (!fs.existsSync(optionFilePath)) {
						console.log(`  👤 Опция [${stepKey}, вар. ${i}]: "${cleanText}"`);
						try {
							const buffer = await generateElevenSpeech(cleanText);
							fs.writeFileSync(optionFilePath, buffer);
							console.log(`    ✅ Сохранено: ${optionFileName}`);
							await new Promise(r => setTimeout(r, 400));
						} catch (err) {
							console.error(`    ❌ Ошибка API (опция):`, err.message);
						}
					} else {
						console.log(`  ⏩ Скип (опция уже есть): ${optionFileName}`);
					}
				}
			}
		}
	}

	console.log(`\n✨ Озвучка всех файлов успешно завершена!`);
}

run();