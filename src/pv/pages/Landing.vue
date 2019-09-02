<template>
  <div>
    <p>Quote</p>
    <div>
      <textarea rows="10" cols="60" v-model="quote" placeholder="your quote"></textarea>
    </div>
    <div>
      <input type="text" v-model="author" placeholder="author">
    </div>
    <button @click="advancedSettings = !advancedSettings">Swtich Background Image</button>
    <div v-if="advancedSettings">
      <p>
        Quote Background
      </p>
      <input type="text" v-model="quoteBG" placeholder="quoteBG">
    </div>
    <div v-if="advancedSettings">
      <p>
        Passage Background
      </p>
      <input type="text" v-model="passageBG" placeholder="passageBG">
    </div>
    <p>
      McGill Media PosterNova Poster Generator - Powered by Human Imagination.
    </p>
    <p>
      <PosterNova :quote="quote" :author="author" :quoteBG="quoteBG" :passageBG="passageBG"></PosterNova>
    </p>

  </div>
</template>

<script>
export default {
  components: {
    PosterNova: require('./PosterNova.vue').default
  },
  data () {
    return {
      advancedSettings: false,
      quote: 'I agree that our Charater and Identity is visible through every actions and also contagious through relationships. Simply holding door out for people is a way of comporting ourselves with kindness and also by being what you want to see in your community. So making dreams come true surely related to our being-ness, by being brave and definatly inventional to the conventional. People can always see: How grateful we are, How thankful we are, How respectful we are to the gift of life by living it to the fullest.',
      author: 'wonglok',
      quoteBG: require('../apis/resources/quotes.jpg'),
      passageBG: require('../apis/resources/passages.jpg')
    }
  }
}
</script>

<style>
</style>
