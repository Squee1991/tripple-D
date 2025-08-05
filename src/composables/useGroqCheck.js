export const useGroqCheckHomeWork = async ({ task, answer, level = 'A1' }) => {
	if (!answer || !answer.trim()) {
		return {
			result: 'keine Antwort',
			feedback: 'Antwort fehlt – 0 Punkte.',
			mistakes: [],
			correctedVersion: ''
		}
	}

	const apiKey = import.meta.env.VITE_GROQ_API_KEY
	const isSpeaking = !!task.prompt && !!task.expectedTopics
	const systemPrompt = isSpeaking
		? `
Du bist ein offizieller Deutschprüfer. Deine Aufgabe ist es, eine gesprochene Antwort eines Schülers auf dem Niveau ${level} zu bewerten.

Gib deine Rückmeldung ausschließlich auf Deutsch. Verwende keine andere Sprache.

Aufgabe (mündlich):
${task.prompt}

Erwartete Themen: ${task.expectedTopics.join(', ')}

Antwort des Schülers (Transkription):
${answer}

Bewerte die Antwort anhand folgender Kriterien:
1. Wurde die Frage verstanden und sinnvoll beantwortet?
2. Entsprechen Inhalt und Sprache dem Niveau ${level}?
3. Wurden relevante Themen erwähnt?

Gib folgende Rückmeldung:
- Bewertung (ausgezeichnet, fast perfekt, gut, kleine Fehler, mittelmäßig, okay, viele Fehler, muss verbessert werden, schlecht, sehr schlecht, keine Antwort)
- Kurzes Feedback (max. 2 Sätze)
- Fehlerliste (optional)
- Korrigierte Version (optimiert)

Antwort ausschließlich im JSON-Format:

{
  "result": "mittelmäßig",
  "feedback": "Die Antwort ist teilweise verständlich, aber wichtige Informationen fehlen.",
  "mistakes": ["fehlende Themen", "unvollständige Sätze"],
  "correctedVersion": "Hallo! Ich heiße Lisa. Ich wohne in Berlin und arbeite als Lehrerin."
}
		`.trim()
		: `
Du bist ein offizieller Deutschprüfer. Deine Aufgabe ist es, eine schriftliche Antwort eines Schülers auf dem Niveau ${level} zu bewerten.

Gib deine Rückmeldung ausschließlich auf Deutsch. Verwende keine andere Sprache, auch nicht für Kommentare oder Beispiele.

Aufgabenstellung:
${task.instruction}

Beispielantwort (falls vorhanden):
${task.exampleAnswer || 'Keine'}

Antwort des Schülers:
${answer}

Bewerte die Antwort anhand folgender Kriterien:
1. Hat der Schüler die Aufgabe verstanden und richtig beantwortet?
2. Gibt es Fehler in Grammatik, Wortschatz oder Satzbau?
3. Entspricht die Sprache dem Niveau ${level}?

Gib folgende Rückmeldung:
- Bewertung auf einer Skala:
  ausgezeichnet, fast perfekt, gut, kleine Fehler, mittelmäßig, okay, viele Fehler, muss verbessert werden, schlecht, sehr schlecht, keine Antwort

- Kurzes Feedback (1–2 Sätze)

- Liste der Fehler (Stichwörter)

- Verbesserungsvorschlag (optimierte Version der Antwort)

Antwortformat **ausschließlich als JSON**:

{
  "result": "kleine Fehler",
  "feedback": "Die Nachricht ist verständlich, aber es fehlen wichtige Informationen.",
  "mistakes": ["fehlende Begrüßung", "Grammatikfehler"],
  "correctedVersion": "Hallo! Gehst du morgen mit mir ins Kino? Der Film beginnt um 18 Uhr."
}
		`.trim()

	try {
		const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${apiKey}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				model: 'llama3-70b-8192',
				messages: [
					{ role: 'system', content: 'Du bist ein strenger Deutschlehrer. Antworte nur auf Deutsch.' },
					{ role: 'user', content: systemPrompt }
				]
			})
		})
		const data = await res.json()
		const content = data.choices?.[0]?.message?.content ?? '{}'
		try {
			return JSON.parse(content)
		} catch {
			return { error: 'Fehler beim Parsen der Antwort', raw: content }
		}
	} catch (error) {
		return { error: 'Fehler bei der Anfrage', details: error }
	}
}
