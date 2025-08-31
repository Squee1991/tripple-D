<template>
  <div class="ach__wrapper">
    <div>
      <h1 class="title">Достижения</h1>
      <button @click="pathThoAch" class="ach__route">Перейти</button>
    </div>
    <div>
      <img class="ach" src="../../assets/images/ach.svg" alt="">
    </div>
  </div>
</template>

<script setup>
    import { useRouter} from "vue-router";
    const router = useRouter();
    const pathThoAch = () => {
      router.push({ path: "/achievements" });
    }
</script>

<style scoped>
  .ach__route{
    color: black;
    border: 2px solid black;
    box-shadow: 4px 4px 0 black;
    padding: 5px 30px;
    border-radius: 15px;
    font-size: 20px;
    font-family: "Nunito", sans-serif;
    background: #dce7e0;
    font-weight: 600;
    cursor: pointer;
  }

  @media (min-width: 1024px) {
    .ach__route:hover {
      transform: translate(2px, 2px);
       box-shadow: 2px 2px 0 black;
    }
  }

  .title{
    margin-bottom: 15px;
  }

  .ach__wrapper {
    display: flex;
    border: 3px solid black;
    border-radius: 16px;
    background: #d22e5c;
    padding: 15px;
    overflow: hidden;
    position: relative;
    box-shadow: 4px 4px 0 black;
  }

  .ach {
    width: 200px;
    position: absolute;
    right: -37px;
    bottom: -50px
  }
</style>