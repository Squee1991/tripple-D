<template>
    <section class="why">
        <div class="why__wrapper">
            <div class="decoration-container">
                <div class="deco-stripe">{{ t('aboutAnimText.first')}}</div>
                <div class="deco-stripe">{{ t('aboutAnimText.second')}}</div>
                <div class="deco-stripe">{{ t('aboutAnimText.third')}}</div>
                <div class="deco-stripe">{{ t('aboutAnimText.fourth')}}</div>
                <div class="deco-stripe">{{ t('aboutAnimText.fifth')}}</div>
                <div class="deco-stripe">{{ t('aboutAnimText.sixth')}}</div>
            </div>
            <div ref="accordionWrapperRef" class="accordion-wrapper">
                <div v-for="(item, index) in data.items" :key="item.id"
                     :class="{ box: isOpen.includes(index), 'overflow-visible': overflowIndex === index }"
                     class="accordion-box">
                    <div
                            :class="{ toTop: liftedIndex === index }"
                            class="text-content">
                        <div class="accordion-text">{{ t(item.explainkey) }}</div>
                    </div>
                    <div :class="{ hidetitle: isOpen.includes(index) }" class="accordion-title">
                        <div>{{ t(item.valueKey) }}</div>
                        <div class="arrow" @click="toggle(index)">
                            <img class="arrow-item" :class="{ rotated: isOpen.includes(index) }"
                                 src="../../assets/images/arrowNav.svg" alt=""/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
<!--        <div class="about__why" ref="whyFooterRef"> {{ t('about.whyFooter') }}</div>-->
    </section>
</template>

<script setup>
    import {ref, onMounted} from 'vue'
    import {useI18n} from 'vue-i18n'
    import {gsap} from 'gsap'
    import {ScrollTrigger} from "gsap/ScrollTrigger";
    gsap.registerPlugin(ScrollTrigger);
    const {t} = useI18n()
    const isOpen = ref([])
    const accordionWrapperRef = ref(null);
    const whyFooterRef = ref(null);
    const overflowIndex = ref(null);
    const liftedIndex = ref(null);
    function toggle(index) {
        const isCurrentlyOpen = isOpen.value.includes(index);
        if (isCurrentlyOpen) {
            isOpen.value = [];
            liftedIndex.value = null;
            overflowIndex.value = null;
        } else {
            isOpen.value = [index];
            liftedIndex.value = null;
            overflowIndex.value = null;
            setTimeout(() => {
                if (isOpen.value.includes(index)) {
                    liftedIndex.value = index;
                    overflowIndex.value = index;
                }
            }, 500);
        }
    }

    onMounted(() => {
        if (accordionWrapperRef.value) {
            gsap.from(".deco-stripe", {
                xPercent: -100,
                opacity: 0,
                ease: 'power3.out',
                stagger: 0.1,
                scrollTrigger: {
                    trigger: accordionWrapperRef.value,
                    start: 'top 90%',
                    end: 'center center',
                    scrub: 0.5,
                }
            });
        }

        // if (whyFooterRef.value) {
        //     gsap.from(whyFooterRef.value, {
        //         xPercent: -100,
        //         opacity: 0,
        //         ease: 'power3.out',
        //         scrollTrigger: {
        //             trigger: '.why',
        //
        //             start: 'top 100%',
        //             end: 'bottom center',
        //             scrub: 1,
        //         }
        //     });
        // }
    });

    const data = {
        title: "about.title",
        lead: "about.lead",
        items: [
            {valueKey: "about.whyFirst", explainkey: "aboutList.one", id: 1},
            {valueKey: "about.whySecond", explainkey: "aboutList.two", id: 2},
            {valueKey: "about.whyThird", explainkey: "aboutList.three", id: 3},
            {valueKey: "about.whyFourth", explainkey: "aboutList.four", id: 4},
            {valueKey: "about.whyFifth", explainkey: "aboutList.five", id: 5},
            {valueKey: "about.whySixth", explainkey: "aboutList.six", id: 6},
        ],
    }
</script>

<style scoped>
    .why {
        padding: 60px 0;
        background-color: #fef8e4;
        overflow-x: hidden;
    }

    .why__wrapper {
        display: flex;
        width: 100%;
        align-items: flex-start;
    }

    .about__why {
        background: #f97028;
        text-align: center;
        padding: 30px 0;
        font-size: 3.1rem;
        font-weight: 600;
        font-family: 'Fredoka One', cursive;
        color: white;
        width: 90%;
        margin: 40px auto;
        border-radius: 10px;
        border: 4px solid black;
        transform: rotate(-2deg);
    }

    .decoration-container,
    .accordion-wrapper {
        width: 50%;
        box-sizing: border-box;
    }

    .decoration-container {
        display: flex;
        flex-direction: column;
        padding: 0 5%;
        align-items: end;
    }

    .deco-stripe {
        width: 100%;
        height: 90px;
        border: 3px solid black;
        border-radius: 12px;
        box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        padding: 15px 15px  15px 25px;
        font-family: 'Fredoka One', cursive;
        font-size: 28px;
        font-style: italic;
        color: white;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.4);
    }

    .deco-stripe:nth-child(1) {
        background: #f97028;

    }

    .deco-stripe:nth-child(2) {
        background: #fca13a;
        width: 95%;
        transform: rotate(-1deg);
    }

    .deco-stripe:nth-child(3) {
        width: 92%;
        background: #ffc94e;
        transform: rotate(-2deg);
    }

    .deco-stripe:nth-child(4) {
        background: #a855f7;
        transform: rotate(-3deg);
        width: 89%;
    }

    .deco-stripe:nth-child(5) {
        background: #4ade80;;
        transform: rotate(-4deg);
        width: 86%;
    }
    .deco-stripe:nth-child(6) {
        background: #60a5fa;
        transform: rotate(-5deg);
        width: 83%;

    }

    .accordion-wrapper {
        margin: 0;
        padding: 0 5%;
        position: relative;
        z-index: 1;
    }

    @media (max-width: 1024px) {
        .why__wrapper {
            flex-direction: column;
            align-items: center;
        }

        .decoration-container {
            display: none;
        }

        .accordion-wrapper {
            width: 100%;
            padding: 40px 15px;
        }
    }

    .accordion-box {
        position: relative;
        margin-bottom: 23px;
        border: 3px solid black;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(218, 182, 124, 0.1);
        height: 75px;
        transition: height 0.4s ease-in-out;
        background: #f3a20f;
        overflow: hidden;
    }

    .box {
        height: 220px;
    }

    .overflow-visible {
        overflow: visible;
    }

    .text-content {
        position: absolute;
        transform: rotate(-1deg);
        background: white;
        margin: 10px 20px;
        padding: 10px;
        height: 190px;
        border-radius: 10px;
        border: 2px solid black;
        transition: bottom 0.5s ease-out, opacity 0.4s ease-out;

    }

    .toTop {
        position: absolute;
        bottom: 32px;
        transition: .3s;
    }

    .box .text-content {
        opacity: 1;
    }

    .accordion-title {
        position: absolute;
        bottom: 0;
        left: 0;
        background: #f3a20f;
        width: 100%;
        border-top: 3px solid black;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        z-index: 2;
        font-family: "Nunito", sans-serif;
        font-weight: bold;
        font-size: 16px;
        color: black;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 13px 10px 13px 15px;
        box-sizing: border-box;
    }

    .arrow {
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }

    .arrow-item {
        width: 100%;
        height: 100%;
        object-fit: contain;
        transform: scale(1);
        transition: .5s;
    }

    .rotated {
        transition: .5s;
        transform: scale(-1);
    }

    .accordion-text {
        font-size: 17px;
        font-family: "Nunito", sans-serif;
        color: #555;
        padding: 5px;
    }
</style>