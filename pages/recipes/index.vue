    <template>
    <div class="quest-board-page">
        <button @click="goHome" class="back-button">
           {{ t('tenses.barBtn')}}
        </button>
        <header class="page-header">
            <h1>{{ t('questThemeChoose.title') }}</h1>
            <p>{{ t('questThemeChoose.subTitle') }}</p>
        </header>
        <Modal
                @close="closeModal"
                :visible="showModal"
                :title="t(data.title)"
                :img="DoneImg"
                :text="t(data.text)"
        />
        <main class="themes-container">
            <template v-for="theme in questStore.themes" :key="theme.id">
                <div
                        v-if="theme.isActive && theme.availableIds.length"
                        class="theme-sticker-card"
                        @click="selectTheme(theme)"
                >
                    <div class="card-content">
                        <div class="icon">{{ theme.icon }}</div>
                        <h2>{{ t(theme.title) }}</h2>
                        <p>{{ t(theme.description) }}</p>
                    </div>
                </div>
                <div v-else class="theme-sticker-card disabled">
                    <div class="card-content">
                        <div class="icon">{{ theme.icon }}</div>
                        <h2>{{ t(theme.title) }}</h2>
                        <p>{{ t(theme.description) }}</p>
                        <div class="lock-overlay">
                            <span>{{ t('questThemeChoose.block') }}</span>
                        </div>
                    </div>
                </div>
            </template>
        </main>
    </div>
</template>

<script setup>
    import { onMounted, ref } from 'vue'
    import { useQuestStore } from '../../store/questStore.js'
    import Modal from '../../src/components/modal.vue'
    import { useRouter } from 'vue-router'
    import DoneImg from '../../assets/images/done.svg'

    const showModal = ref(false)
    const cooldownSeconds = ref(0)
    const router = useRouter()
    const { t } = useI18n()
    const questStore = useQuestStore()
    const data = ref({
        title: "modal.achieveTitle",
        text: "modal.achieveText"
    })

    const closeModal = () => {
        showModal.value = false
    }

    const goHome = () => {
        router.push('/');
    }

    async function selectTheme(theme) {
        if (questStore.dailyQuestCount > 0) {
            cooldownSeconds.value = await questStore.getTodaysQuestCooldown();
            showModal.value = true;
            return;
        }
        const nextId = await questStore.getFirstAvailableRecipeId(theme.id);
        if (!nextId) {
            cooldownSeconds.value = await questStore.getRemainingCooldown(theme.availableIds.at(-1));
            showModal.value = true;
            return;
        }
        router.push(`/recipes/${nextId}`);
    }

    onMounted(async () => {
        await Promise.all([
            questStore.loadThemesAndRecipes(),
            questStore.loadDailyProgress()
        ]);
    })
</script>

<style scoped>

    .quest-board-page {
        min-height: 100vh;
        padding: 2rem;
        font-family: "Nunito", sans-serif;
        position: relative;
    }

    .back-button {
        position: absolute;
        top: 2rem;
        left: 2rem;
        padding: 0.75rem 1.5rem;
        font-size: 1.1rem;
        font-weight: 600;
        color: #111827;
        background-color: #fff;
        border: 3px solid #111827;
        border-radius: 12px;
        box-shadow: 4px 4px 0px #111827;
        cursor: pointer;
        transition: all 0.1s ease-in-out;
        z-index: 100;
    }

    .back-button:hover {
        transform: translate(2px, 2px);
        box-shadow: 2px 2px 0px #111827;
    }

    .back-button:active {
        transform: translate(4px, 4px);
        box-shadow: 0px 0px 0px #111827;
    }

    .page-header {
        text-align: center;
        margin-bottom: 5rem;
        margin-top: 3rem;
    }

    .page-header h1 {
        font-size: 5rem;
        font-weight: 700;
        color: var(--titleColor);
        text-transform: uppercase;
        -webkit-text-stroke: 3px #111827;
        text-stroke: 3px #111827;
        text-shadow: 6px 6px 0px #c41e3a;
    }

    .page-header p {
        font-size: 1.25rem;
        color: #4b5563;
        margin-top: 0.5rem;
        font-weight: 500;
    }

    .themes-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        gap: 3.5rem;
        padding-bottom: 5rem;
    }

    .theme-sticker-card {
        width: 320px;
        height: 380px;
        background: #fff;
        border-radius: 20px;
        border: 4px solid #111827;
        position: relative;
        cursor: pointer;
        transition: transform 0.2s ease-out;
    }

    .theme-sticker-card:hover {
        transform: translateY(-10px);
    }

    .theme-sticker-card::before {
        content: "";
        position: absolute;
        bottom: 0;
        right: 0;
        border-width: 0 0 50px 50px;
        border-style: solid;
        border-color: transparent transparent #e0e0e0;
        transition: border-width 0.2s ease-out;
        box-shadow: -5px -5px 10px rgba(0, 0, 0, 0.25);
    }

    .theme-sticker-card:hover::before {
        border-width: 0 0 70px 70px;
    }

    .card-content {
        padding: 1.5rem;
        text-align: center;
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: center;
    }

    .icon {
        font-size: 5rem;
        line-height: 1;
    }

    h2 {
        font-size: 2rem;
        font-weight: 700;
        margin: 1.5rem 0;
        text-transform: uppercase;
    }

    p {
        font-size: 1rem;
        line-height: 1.5;
        flex-grow: 1;
    }

    .disabled {
        cursor: not-allowed;
        filter: grayscale(80%);
        opacity: 0.7;
    }

    .disabled:hover {
        transform: none;
    }

    .disabled::before {
        border-width: 0 0 40px 40px;
        box-shadow: -2px -2px 5px rgba(0, 0, 0, 0.2);
    }

    .disabled:hover::before {
        border-width: 0 0 40px 40px;
    }

    .lock-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 1.5rem;
        font-weight: 600;
        text-shadow: 2px 2px 0 #000;
        background-color: rgba(50, 50, 50, 0.5);
    }
</style>