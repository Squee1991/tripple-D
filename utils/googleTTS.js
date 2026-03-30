let currentAudio = null;
let currentController = null;

export function stopSpeech() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.src = "";
        currentAudio = null;
    }
    if (currentController) {
        currentController.abort();
        currentController = null;
    }
}

export async function getSpeechAudio(text, lang = 'de-DE') {
    // Останавливаем предыдущее воспроизведение, если было
    stopSpeech();

    const apiKey = import.meta.env.VITE_GOOGLE_TTS_KEY;

    // Оставляем только качественные женские голоса (семейство Wavenet)
    let voiceName = 'de-DE-Wavenet-A';
    if (lang === 'de-AT') voiceName = 'de-AT-Wavenet-A';
    if (lang === 'de-CH') voiceName = 'de-CH-Wavenet-A';

    currentController = new AbortController();

    try {
        const response = await fetch(
            `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                signal: currentController.signal,
                body: JSON.stringify({
                    input: { text },
                    // Жестко фиксируем женский голос
                    voice: { languageCode: lang, name: voiceName, ssmlGender: 'FEMALE' },
                    audioConfig: { audioEncoding: 'MP3', speakingRate: 1.0 }
                })
            }
        );

        const data = await response.json();

        // ВАЖНО: Проверяем, не ответил ли Google ошибкой (например, статус 400 или 403)
        if (!response.ok) {
            console.error('Ошибка от Google Cloud TTS API:', data.error || data);
            return null;
        }

        if (!data.audioContent) {
            console.error('Google API не вернул аудиоконтент');
            return null;
        }
        const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
        currentAudio = audio;
        return new Promise((resolve) => {
            // Безопасный запуск аудио, который отлавливает блокировки браузера
            audio.play().catch(e => {
                console.error('Браузер заблокировал автовоспроизведение:', e);
                resolve(); // Резолвим, чтобы приложение не зависло в состоянии isSpeaking = true
            });

            audio.onended = () => {
                if (currentAudio === audio) currentAudio = null;
                resolve();
            };

            audio.onerror = () => {
                console.error('Ошибка воспроизведения созданного Audio объекта');
                resolve();
            };
        });
    } catch (error) {
        if (error.name === 'AbortError') {
            return null; // Запрос был отменен через stopSpeech, это норма
        }
        console.error('Критическая ошибка сети или TTS:', error);
        return null;
    }
}