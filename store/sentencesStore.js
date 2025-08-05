import {defineStore} from 'pinia';
import {ref} from 'vue';

export const useSentencesStore = defineStore('sentences', () => {
    const db = ref(null);
    const isLoading = ref(true);
    const error = ref(null);

    async function loadSentences() {
        if (db.value) {
            isLoading.value = false;
            return;
        }
        try {
            const response = await fetch('/sentences.json');
            if (!response.ok) throw new Error('Ошибка');
            db.value = await response.json();
        } catch (e) {
            error.value = e.message;
        } finally {
            isLoading.value = false;
        }
    }

    return { db, isLoading, error, loadSentences };
});