import {defineStore} from 'pinia';
import {ref} from 'vue';

export const useSentencesStore = defineStore('sentences', () => {
    const db = ref(null);
    const isLoading = ref(false);
    const error = ref(null);

    async function loadSentences() {
        if (db.value) return;

        isLoading.value = true;
        error.value = null;
        try {
            const response = await fetch('/sentences.json');
            if (!response.ok) {
                throw new Error
            }
            db.value = await response.json();
        } catch (e) {
            error.value = e.message;
            console.error(e);
        } finally {
            isLoading.value = false;
        }
    }

    return {
        db, isLoading, error,
        loadSentences
    };
});