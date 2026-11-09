

const PLAIN = { ä: 'a', ö: 'o', ü: 'u', ß: 'ss' }

export const GERMAN_LETTERS = ['ä', 'ö', 'ü', 'ß', 'Ä', 'Ö', 'Ü']

function words(text) {
	return text
		.replace(/[.,!?;:"'„”“«»()–—]/g, ' ')
		.split(/\s+/)
		.filter(Boolean)
}

function plain(word) {
	return word.toLowerCase().replace(/[äöüß]/g, ch => PLAIN[ch])
}

function lowerFirst(word) {
	return word.charAt(0).toLowerCase() + word.slice(1)
}

function displayWords(text) {
	return text.split(/\s+/).filter(Boolean)
}

export function checkDictation(answer, expected) {
	const shown = displayWords(expected)
	const target = shown.map(w => words(w).join(''))
	const given = words(answer)

	const rows = target.length
	const cols = given.length
	const lcs = Array.from({ length: rows + 1 }, () => new Array(cols + 1).fill(0))
	for (let i = rows - 1; i >= 0; i--) {
		for (let j = cols - 1; j >= 0; j--) {
			lcs[i][j] = plain(target[i]) === plain(given[j])
				? lcs[i + 1][j + 1] + 1
				: Math.max(lcs[i + 1][j], lcs[i][j + 1])
		}
	}

	const marks = new Array(rows).fill('wrong')
	let extra = 0
	let i = 0
	let j = 0
	while (i < rows && j < cols) {
		if (plain(target[i]) === plain(given[j])) {
			const exact = i === 0
				? lowerFirst(target[i]) === lowerFirst(given[j])
				: target[i] === given[j]
			marks[i] = exact ? 'ok' : 'marks'
			i++
			j++
		} else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
			i++
		} else {
			extra++
			j++
		}
	}
	extra += cols - j

	target.forEach((w, index) => {
		if (!w) marks[index] = 'ok'
	})

	let status = 'success'
	if (extra > 0 || marks.includes('wrong')) status = 'wrong'
	else if (marks.includes('marks')) status = 'partial'

	return {
		status,
		words: shown.map((text, index) => ({ text, mark: marks[index] }))
	}
}
