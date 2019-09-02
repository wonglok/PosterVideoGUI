<template>
  <div class="nova-box">
    <h2 class="loading" v-if="loading">Loading</h2>
    <transition name="fady">
      <div v-show="!loading" class="posternova" ref="quote">
      </div>
    </transition>
  </div>
</template>

<script>
import slugify from 'slugify'
import * as SRNPoster from '../apis/SRNPoster'
import _ from 'lodash'
export default {
  props: {
    author: {
      default: 'Author'
    },
    quote: {
      default: 'This is my quote'
    },
    quoteBG: {
      default: require('../apis/resources/quotes.jpg')
    },
    passageBG: {
      default: require('../apis/resources/passages.jpg')
    }
  },
  data () {
    return {
      loading: false
    }
  },
  watch: {
    author () {
      this.loading = true
      this.$forceUpdate()
      this.debounceRender()
    },
    quote () {
      this.loading = true
      this.debounceRender()
    }
  },
  mounted () {
    this.loading = true
    this.debounceRender()
  },
  methods: {
    debounceRender: _.debounce(function () {
      this.setup()
    }, 500),
    setup () {
      let input = {
        poster_color_background: 'rgb(237, 237, 237)',
        poster_color_font: '#1F1F1F',
        // poster_image: 'https://srn.net/quote-bg/wonglok.jpg',
        poster_image_quotes: this.quoteBG,
        poster_image_passages: this.passageBG,
        poster_text: this.quote,
        poster_author: this.author || '',
        poster_watermark: '',
        poster_filename: slugify(this.quote, {
          replacement: '_',
          /* eslint-disable-next-line */
          remove: /\'/,
          lower: true
        }),
        poster_aspect: '1:1'
      }

      setTimeout(() => {
        this.loading = true
        this.$forceUpdate()
        SRNPoster.addQuote({ info: input })
          .then(({ dom }) => {
            this.$refs['quote'].innerHTML = ''
            setTimeout(() => {
              this.$refs['quote'].appendChild(dom)
              this.loading = false
              this.$forceUpdate()
            })
          })
      })
    }
  }
}
</script>

<style>
.posternova img{
  width: 100%;
}
</style>

<style scoped>
.nova-box{
  display: block;
  position: relative;
  height: 100vmin;
}
.loading{
  width: 200px;
  text-align: center;
  text-align: center;
  position: absolute;
  top: 50%;
  left: calc(50% - 100px);
}
.fady-enter-active, .fady-leave-active {
  transition: opacity .5s;
}
.fady-enter, .fady-leave-to /* .fady-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
