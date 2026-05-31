<template>
  <div class="container">
    <div class="balance">Баланс {{ balance }} рублей</div>
    <h1>Магазин товаров из кожи</h1>
    <div class="catalog__elements">
      <li v-for="(item , index) in catalogItems" :key="index" class="catalog__list">
        <img class="item__icon" :src="item.icon" alt="">
        <span class="list__name"> {{ item.name }} </span>
        <span class="list__name"> {{ item.price }} руб.</span>
        <button v-if="item.state" @click="buyItem(item)" class="list__button">Купить</button>
        <button v-else @click="buyItem(item)" class="list__button">Нет в наличии</button>
      </li>
    </div>
    <div v-if="showModal" class="modal__overlay">
       <div class="modal-content">
          <div>x</div>
          <h2>Не хватает бабок пиздуй работать</h2>
         <button @click="showModal = false">Пиздовать работать</button>
       </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import Bag from '../assets/images/catalog-images/bag.svg'
import Wallet from '../assets/images/catalog-images/wallet.svg'

const showModal = ref(false)
const balance = ref(120)

const catalogItems = [
  {icon: Bag, name: 'Сумка', price: 100, state: true },
  {icon: Wallet, name: 'Кошелек', price: 200, state: true },
]

const buyItem = (item) => {
  if (balance.value >= item.price) {
    balance.value = balance.value - item.price
    alert(` Куплен ${item.name}`)
  } else {
    showModal.value = true
  }
}

</script>

<style scoped>

* {
  color: black;
}

.list__button {
  border-radius: 10px;
  border: none;
  color: white;
  background: #00c2ff;
  padding: 5px 10px;
}

.catalog__elements {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.item__icon {
  width: 60px;
  margin: 0 auto;
}

.balance {
  margin-bottom: 50px;
}

.list__name {
  padding: 5px;
  text-align: center;
}

.catalog__list {
  display: flex;
  flex-direction: column;
  border: 2px solid #918e8e;
  padding: 20px 15px;
  border-radius: 15px;
  background: #d9d2d2;
}

.container {
  width: 412px;
  background: white;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 0 auto;
}

.modal__overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(21, 20, 20, 0.68);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: #252525;
  padding: 40px;
  border-radius: 30px;
  text-align: center;
  border: 1px solid #918e8e;
  width: 400px;
}



</style>