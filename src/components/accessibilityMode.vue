<template>
    <button title="Включить/выключить режим доступности" class="accessibility__btn" @click="toggleMode">
        <img class="accessibility__icon" src="../../assets/images/disability.svg" alt="♿">
    </button>
</template>

<script setup>
    import { ref, onMounted, watch } from 'vue'

    const isAccessibilityMode = ref(false)

    onMounted(() => {
        const saved = localStorage.getItem('accessibility')
        isAccessibilityMode.value = saved === 'true'
        applyMode()
    })

    watch(isAccessibilityMode, applyMode)

    function toggleMode() {
        isAccessibilityMode.value = !isAccessibilityMode.value
        localStorage.setItem('accessibility', isAccessibilityMode.value)
    }

    function applyMode() {
        document.body.classList.toggle('accessibility-mode', isAccessibilityMode.value)
    }
</script>

<style >
    .accessibility__btn {
        position: fixed;
        bottom: 12px;
        right: 20px;
        display: flex;
        align-items: center;
        gap: 10px;
        background: none;
        box-shadow: 3px 3px 0 #000;
        border-radius: 10px;
        font-family: inherit;
        font-weight: bold;
        font-size: 16px;
        color: #000;
        z-index: 9999;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .accessibility__btn:hover {
        background-color: #fffaa5;
        box-shadow: 2px 2px 0 #000;
    }

    .accessibility__icon {
        width: 45px;
    }

    /*body.accessibility-mode {*/
    /*    font-size: 25px;*/
    /*    line-height: 1.6;*/
    /*    background-color: #111 !important;*/
    /*    color: #f8f8f8 !important;*/
    /*}*/

    /*body.accessibility-mode a,*/
    /*body.accessibility-mode button {*/
    /*    color: #ffff66 !important;*/
    /*    background-color: #000 !important;*/
    /*    border: 2px solid #fff !important;*/
    /*    padding: 0.5em 1em;*/
    /*}*/

    /*body.accessibility-mode * {*/
    /*    transition: none !important;*/
    /*    animation: none !important;*/
    /*}*/


    /*body.accessibility-mode :focus {*/
    /*    outline: 3px solid #ffff00 !important;*/
    /*    outline-offset: 2px;*/
    /*}*/
</style>
