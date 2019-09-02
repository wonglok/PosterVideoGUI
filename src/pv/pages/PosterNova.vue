<template>
  <div class="nova-box">
    <h2 class="loading" v-if="loading">Loading</h2>
    <div v-show="!loading" class="posternova" ref="quote">
    </div>
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
    backgroundImage: {
      default: 'This is my quote'
    }
  },
  watch: {
    author () {
      this.loading = true
      this.debounceRender()
    },
    quote () {
      this.loading = true
      this.debounceRender()
    }
  },
  mounted () {
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
        poster_image_quotes: require('../apis/resources/quotes.jpg'),
        poster_image_passages: require('../apis/resources/passages.jpg'),
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
</style>
