<template>
    <div class="login-page">
        <div class="login-container">
            <SingIn />
        </div>
    </div>
</template>

<script setup>
import SingIn from '../src/components/logIn.vue'
</script>

<style scoped>
.login-page {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #0b0f1e, #1b1e38);
}

.login-container {
    width: 360px;
}
</style> 