<template>
  <div class="posternova" ref="quote">
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
    }
  },
  watch: {
    author () {
      this.debounceRender()
    },
    quote () {
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
        this.$refs['quote'].innerHTML = ''
        SRNPoster.addQuote({ info: input })
          .then(({ dom }) => {
            this.$refs['quote'].appendChild(dom)
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
