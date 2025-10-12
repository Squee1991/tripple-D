<template>
  <div class="wrap">
    <h1 class="title snow-hills">Зимний заголовок</h1>
  </div>
</template>

<script setup>
</script>

<style scoped>
.wrap {
  display: grid;
  place-items: center;
  min-height: 240px;
  background: linear-gradient(#dff2ff, #c5e6ff);
  font-family: "Nunito", sans-serif;
}

/* блок */
.title {
  position: relative;
  padding: 18px 26px;
  background: #142546;
  color: #fff;
  border-radius: 12px;
  font-size: 26px;
  font-weight: 900;
  z-index: 1;
}

/* сугробы */
.snow-hills::before {
  content: "";
  position: absolute;
  top: -50px;
  width: 100%;
  left: 0;
  height: 65px;
  pointer-events: none;
  z-index: -1;

  background:
      radial-gradient(40px 40px at 100% 100%, #fff 0 70%, transparent 71%),
      radial-gradient(60px 40px at 15% 100%, #fff 0 70%, transparent 71%),
      radial-gradient(90px 55px at 45% 100%, #fff 0 70%, transparent 71%),
      radial-gradient(70px 45px at 75% 100%, #fff 0 70%, transparent 71%),
      radial-gradient(80px 50px at 95% 100%, #fff 0 70%, transparent 71%);

  background-repeat: no-repeat;
  background-size: auto;
  background-position: bottom;
}
</style>
