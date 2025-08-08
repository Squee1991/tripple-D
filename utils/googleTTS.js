export async function getSpeechAudio(text, lang = 'de-DE') {
    const apiKey = import.meta.env.VITE_GOOGLE_TTS_KEY
    const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            input: { text },
            voice: {
                languageCode: lang,
                name: 'de-DE-Wavenet-A',
                ssmlGender: 'FEMALE'
            },
            audioConfig: {
                audioEncoding: 'MP3',
                speakingRate: 1.0
            }
        }),
    });

    const data = await response.json();

    if (data.audioContent) {
        const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
        audio.play();
    } else {
        console.error('Ошибка TTS:', data);
    }
}
