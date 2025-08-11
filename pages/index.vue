<script setup>
    import Header from '../src/components/header.vue'
    import Banner from '../src/components/baner.vue'
    import Description from '../src/components/DescriptionBlock.vue'
    import About from '../src/components/about.vue'
    import FeedBack from '../src/components/feedBack.vue'
    import Footer from '../src/components/footer.vue'

</script>

<template>

    <div class="container">
        <Header />
        <Banner />
        <Description/>
        <About/>
        <FeedBack/>
        <Footer/>
    </div>
</template>

<style scoped>
body {
  background-color: #fff;
  color: rgba(0,0,0,0.8);
}
.dark-mode body {
  background-color: #091a28;
  color: #ebf4f1;
}
.sepia-mode body {
  background-color: #f1e7d0;
  color: #433422;
}
</style>
