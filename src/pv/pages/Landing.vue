<template>
  <div>
    <p>Quote</p>
    <div>
      <textarea rows="10" cols="60" v-model="quote" placeholder="your quote"></textarea>
    </div>
    <div>
      <input type="text" v-model="author" placeholder="author">
    </div>
    <button @click="advanced = !advanced">Config Advanced</button>
    <div v-if="advanced">
      <p>
        Quote Background
      </p>
      <input type="text" v-model="quoteBG" placeholder="quoteBG">
    </div>
    <div v-if="advanced">
      <p>
        Passage Background
      </p>
      <input type="text" v-model="passageBG" placeholder="passageBG">
    </div>
    <p>
      Poster Generator
    </p>
    <PosterNova :quote="quote" :author="author" :quoteBG="quoteBG" :passageBG="passageBG"></PosterNova>
  </div>
</template>

<script>
export default {
  components: {
    PosterNova: require('./PosterNova.vue').default
  },
  data () {
    return {
      advanced: false,
      quote: 'Life is wonderful.',
      author: 'wonglok',
      quoteBG: require('../apis/resources/quotes.jpg'),
      passageBG: require('../apis/resources/passages.jpg')
    }
  }
}
</script>

<style>
</style>
