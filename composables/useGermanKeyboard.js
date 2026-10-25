import { computed, nextTick } from 'vue'

export function useGermanKeyboard(questStore, inputRef, speechInputRef) {
    const germanLetters = ['ä', 'ö', 'ü', 'Ä', 'Ö', 'Ü', 'ß']

    const shouldShowGermanLetters = computed(() => {
        if (!questStore.task) return false
        if (!['speechToText', 'input'].includes(questStore.task.type)) return false
        const source = String(questStore.task.answer || questStore.task.correctAnswer || questStore.task.text || '')
        return /[äöüÄÖÜß]/.test(source)
    })

    function addGermanLetter(letter) {
        if (questStore.showResult) return
        const inputEl = questStore.task?.type === 'input' ? inputRef.value : speechInputRef.value
        const current = String(questStore.userInput || '')
        if (!inputEl) {
            questStore.userInput = current + letter
            return
        }
        const start = inputEl.selectionStart ?? current.length
        const end = inputEl.selectionEnd ?? current.length
        questStore.userInput = current.slice(0, start) + letter + current.slice(end)
        nextTick(() => {
            inputEl.focus()
            const pos = start + 1
            inputEl.setSelectionRange(pos, pos)
        })
    }

    return { germanLetters, shouldShowGermanLetters, addGermanLetter }
}