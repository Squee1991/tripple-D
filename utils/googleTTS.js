let currentAudio = null;
let currentController = null;

export function stopSpeech() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }
    if (currentController) {
        currentController.abort();
        currentController = null;
    }
}
export async function getSpeechAudio(text, lang = 'de-DE') {
    const apiKey = import.meta.env.VITE_GOOGLE_TTS_KEY;
    stopSpeech();
    let voiceName = 'de-DE-Wavenet-A';
    switch (lang) {
        case 'de-AT':
            voiceName = 'de-AT-Wavenet-B';
            break;
        case 'de-CH':
            voiceName = 'de-CH-Wavenet-A';
            break;
    }
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
                    voice: { languageCode: lang, name: voiceName, ssmlGender: 'FEMALE' },
                    audioConfig: { audioEncoding: 'MP3', speakingRate: 1.0 }
                })
            }
        );

        const data = await response.json();
        if (!data.audioContent) {
            console.error('Error TTS:', data);
            return null;
        }
        const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
        currentAudio = audio;
        audio.addEventListener('ended', () => {
            if (currentAudio === audio) currentAudio = null;
        });

        await audio.play();
        return audio;
    } catch (error) {
        if (error?.name === 'AbortError') return null;
        console.error('TTS request failed:', error);
        return null;
    } finally {
        currentController = null;
    }
}
