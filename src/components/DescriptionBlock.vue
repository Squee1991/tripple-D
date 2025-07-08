<template>
    <section class="features">
        <div class="features__inner">
            <div ref="titleRef" class="f__title">
                <h2 class="features__title">{{t('features.title')}}</h2>
            </div>
            <div class="features__grid">
                <div class="features__card" v-for="(item, index) in items" :key="index" :ref="el => { if (el) cardsRef[index] = el }">
                    <div class="features__icon-wrapper">
                        <img :src="item.src" :alt="item.alt" class="features__icon"/>
                    </div>
                    <h3 class="features__card-title">{{ t(item.title) }}</h3>
                    <p class="features__card-desc">{{ t(item.description) }}</p>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { useI18n } from 'vue-i18n'
    import { gsap } from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";

    import MagikBook from '../../assets/images/magicBook.svg'
    import Brain from '../../assets/images/brain.svg'
    import Controller from '../../assets/images/controller.svg'
    import Cup from '../../assets/images/cubok.svg'

    gsap.registerPlugin(ScrollTrigger);

    const { t } = useI18n()
    const titleRef = ref(null);
    const cardsRef = ref([]);
    const cards = cardsRef.value;
    const items = [
        { src: MagikBook, alt: 'Book', title: 'cardWords.title', description: 'cardWords.sub' },
        { src: Brain, alt: 'Brain', title: 'cardMethod.title', description: 'cardMethod.sub' },
        { src: Controller, alt: 'Controller', title: 'gameCard.title', description: 'gameCard.sub' },
        { src: Cup, alt: 'Cup', title: 'achievCard.title', description: 'achievCard.sub' },
    ]

    onMounted(() => {

        gsap.from(titleRef.value, {
            scrollTrigger: { trigger: titleRef.value, start: "top 90%" },
            y: 50,
            opacity: 0,
            duration: 0.3,
            ease: "power3.out",
        });

        const cards = cardsRef.value;

        gsap.set(cards, { opacity: 0, y: 50 });
        gsap.to(cards, {
            scrollTrigger: {
                trigger: ".features__grid",
                start: "top 85%",
                toggleActions: "play none none none",
            },
            opacity: 1,
            y: 0,
            duration: 0.3,
            stagger: 0.2,
            ease: "power3.out",
        });
    });


</script>

<style scoped>
    .features {
        background: #fef8e4;
        padding: 6rem 1.5rem;
        font-family: 'Fredoka One', cursive;
        overflow-x: hidden;
    }

    .features__inner {
        width: 100%;
        max-width: 1280px;
        margin: 0 auto;
    }

    .features__title {
        text-align: center;
        margin-bottom: 4rem;
        font-size: 3rem;
        font-family: 'Fredoka One', cursive;
        font-weight: 400;
        color: white;
        letter-spacing: -0.02em;
        background: #f97028;
        padding: 10px 20px ;
        transform: rotate(3deg);
        border: 2px solid black;
        border-radius: 10px;
    }

    .f__title {
        display: flex;
        justify-content: center;
    }

    .features__grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        justify-content: center;
        gap: 2.5rem;
        padding: 10px;
    }

    .features__card {
        border-radius: 24px;
        border: 3px solid #1e1e1e;
        box-shadow: 8px 8px 0px #1e1e1e;
        padding: 2rem 1.5rem;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        transition: all 0.2s ease-in-out;
        cursor: pointer;
    }

    .features__card:hover {
        transform: translate(4px, 4px);
        box-shadow: 4px 4px 0px #1e1e1e;
    }

    .features__card:nth-child(1) { background-color: #60a5fa; }
    .features__card:nth-child(2) { background-color: #fca13a; }
    .features__card:nth-child(3) { background-color: #4ade80; }
    .features__card:nth-child(4) { background-color: #a855f7; }

    .features__icon-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 90px;
        height: 90px;
        border-radius: 20px;
        margin-bottom: 2rem;
        border: 3px solid #1e1e1e;
        background-color: #ffffff;
    }

    .features__icon {
        width: 50px;
        height: 50px;
    }

    .features__card-title {
        font-family: 'Inter', sans-serif;
        font-size: 1.3rem;
        font-weight: 400;
        margin-bottom: 0.75rem;
        color: #ffffff;
    }

    .features__card-desc {
        font-family: 'Inter', sans-serif;
        font-size: 1rem;
        font-weight: 500;
        line-height: 1.6;
        color: #ffffff;
        opacity: 0.9;
    }

    @media (max-width: 768px) {
        .features {
            padding: 4rem 1rem;
        }

        .features__title {
            font-size: 2.2rem;
            margin-bottom: 3rem;
        }

        .features__grid {
            gap: 2rem;
        }
    }
</style>