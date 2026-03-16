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

export async function getSpeechAudio(text, lang = 'de-DE', gender = 'FEMALE') {
    const apiKey = import.meta.env.VITE_GOOGLE_TTS_KEY;
    stopSpeech();

    let voiceName = gender === 'MALE' ? 'de-DE-Wavenet-B' : 'de-DE-Wavenet-A';
    if (lang === 'de-AT') voiceName = gender === 'MALE' ? 'de-AT-Wavenet-B' : 'de-AT-Wavenet-A';
    if (lang === 'de-CH') voiceName = gender === 'MALE' ? 'de-CH-Wavenet-A' : 'de-CH-Wavenet-A';

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
                    voice: { languageCode: lang, name: voiceName, ssmlGender: gender },
                    audioConfig: { audioEncoding: 'MP3', speakingRate: 1.0 }
                })
            }
        );

        const data = await response.json();
        if (!data.audioContent) return null;

        const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
        currentAudio = audio;

        return new Promise((resolve) => {
            audio.play();
            audio.onended = () => {
                if (currentAudio === audio) currentAudio = null;
                resolve();
            };
            audio.onerror = () => {
                resolve();
            };
        });
    } catch (error) {
        if (error.name === 'AbortError') {
            return null;
        }
        console.error('TTS error:', error);
        return null;
    }
}