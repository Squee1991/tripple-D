<template>
    <footer class="footer" ref="footerRef" :class="{ visible: isVisible }">
        <div class="footer-container">
            <!-- Лого -->
            <div class="footer-brand">
                <img src="../../assets/images/logoDDD.png" alt="Der Die Das" class="footer-logo" />
            </div>

            <!-- Навигация -->
            <nav class="footer-links">
                <a href="#about" class="footer-link">О проекте</a>
                <a href="#feedback" class="footer-link">Отзывы</a>
                <a href="mailto:support@derdiedas.app" class="footer-link">Контакты</a>
            </nav>

            <!-- Соцсети и язык -->
            <div class="footer-meta">
                <div class="social-icons">
                    <a href="https://t.me/your_channel" target="_blank" class="social-icon">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                            <path d="M...Z" />
                        </svg>
                    </a>
                    <a href="https://github.com/your_repo" target="_blank" class="social-icon">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                            <path d="M...Z" />
                        </svg>
                    </a>
                </div>
                <select class="lang-select">
                    <option>Русский</option>
                    <option>English</option>
                    <option>Deutsch</option>
                </select>
            </div>
        </div>

        <p class="footer-copy">© {{ new Date().getFullYear() }} Der Die Das. Все права защищены.</p>
    </footer>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const footerRef = ref(null)
const isVisible = ref(false)

onMounted(() => {
    const observer = new IntersectionObserver(
        ([entry]) => {
            if (entry.isIntersecting) isVisible.value = true
        },
        { threshold: 0.1 }
    )
    if (footerRef.value) observer.observe(footerRef.value)
})
</script>

<style scoped>
.footer {
    background-color: #f9fafb;
    padding: 40px 20px 20px;
    border-top: 1px solid #e5e7eb;
    font-family: 'Inter', sans-serif;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease, transform 0.6s ease;
}

.footer.visible {
    opacity: 1;
    transform: translateY(0);
}

.footer-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
}

.footer-brand {
    display: flex;
    align-items: center;
    gap: 10px;
}

.footer-logo {
    width: 100px;
    height: 100px;
}

.footer-title {
    font-weight: 700;
    font-size: 18px;
    color: #1f2937;
}

.footer-links {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    justify-content: center;
}

.footer-link {
    font-size: 14px;
    color: #374151;
    text-decoration: none;
    transition: color 0.2s;
}

.footer-link:hover {
    color: #2563eb;
}

.footer-meta {
    display: flex;
    gap: 16px;
    align-items: center;
    flex-wrap: wrap;
}

.social-icons {
    display: flex;
    gap: 12px;
}

.social-icon {
    color: #4b5563;
    font-size: 20px;
    transition: color 0.2s;
}

.social-icon:hover {
    color: #2563eb;
}

.lang-select {
    border: 1px solid #d1d5db;
    border-radius: 8px;
    padding: 6px 12px;
    background: white;
    font-size: 14px;
    color: #374151;
}

.footer-copy {
    text-align: center;
    margin-top: 24px;
    font-size: 13px;
    color: #9ca3af;
}
</style>
