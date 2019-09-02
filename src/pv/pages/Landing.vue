<template>
  <div>
    <p>Quote</p>
    <div>
      <textarea rows="10" cols="60" v-model="quote" placeholder="your quote"></textarea>
    </div>
    <div>
      <input type="text" v-model="author" placeholder="author">
    </div>
    <p>
      Poster Generator
    </p>
    <PosterNova :quote="quote" :author="author"></PosterNova>
  </div>
</template>

<script>
export default {
  components: {
    PosterNova: require('./PosterNova.vue').default
  },
  data () {
    return {
      quote: 'Life is wonderful.',
      author: 'wonglok'
    }
  }
}
</script>

<style>
</style>
