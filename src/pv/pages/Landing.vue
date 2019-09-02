<template>
  <div>
    <textarea v-model="quote"></textarea>
    <input type="text" v-model="author">
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
      quote: 'wonglok quote',
      author: 'abc author'
    }
  }
}
</script>

<style>
</style>
