<template>
  <div class="sensation full">
    <div v-if="!SDK">Loading....</div>
    <div v-show="SDK" class="full flex">

      <div class="option-panel">
        <div class="flex justify-center">
          <textarea class="m-4 p-4 bg-gray-300"  @input="onUpdatePoster()" v-model="spec.text" placeholder="text" cols="30" rows="10"></textarea>
        </div>
        <div class="flex justify-center">
          <chrome-picker class="m-4 p-4 bg-gray-300"   v-model="pickers.bg" @input="spec.bg = pickers.bg.hex; onUpdatePoster()"></chrome-picker>
        </div>
        <div class="flex justify-center">
          <chrome-picker class="m-4 p-4 bg-gray-300"   v-model="pickers.ball" @input="spec.ball = pickers.ball.hex; onUpdatePoster()"></chrome-picker>
        </div>
        <div class="flex justify-center">
          <chrome-picker class="m-4 p-4 bg-gray-300"   v-model="pickers.fontColor" @input="spec.fontColor = pickers.fontColor.hex; onUpdatePoster()"></chrome-picker>
        </div>
        <div class="flex justify-center">
          <select v-model="spec.site">
            <option value="http://localhost:3123">localhost Rendering Server</option>
            <option value="https://video-encoder.wonglok.com">Digital Ocean Rendering Server</option>
            <option value="https://ec2-renderer.wonglok.com">Amazon Rendering Server</option>
          </select>
        </div>
        <div class="flex justify-center items-center">
          <div class="flex justify-center items-center text-center">
            Video Length
          </div>
          <div class="flex justify-center items-center">
            <input class="m-4 p-4 bg-gray-300" step="0.001" type="number" v-model="spec.videoDuration">
          </div>
        </div>
        <div class="flex justify-center">
          <button class="mr-2 px-6 py-3 bg-gray-300"  @click="makePic()">Make Pic</button>
          <button class="     px-6 py-3 bg-gray-300"  @click="makeVideo()">Make Video</button>
        </div>

        <div class="logs">
          <div class="m-4 p-4 flex justify-center" :id="log.id" v-for="log in logs" :key="log.id" v-html="log.html"></div>
        </div>

      </div>
      <div class="canvas-area flex items-center justify-center bg-gray-200">
        <canvas class="canvas-el" ref="canvas">
        </canvas>
      </div>

      <!-- <div class="">
        <div class="">
        </div>
        <div>
            Seconds:

        </div>
      </div>

      <div class="fixed top-0 right-0 m-5">

      </div>

      <div class="fixed bottom-0 right-0 m-5">
        <button @click="goTop">Go Top</button>
      </div> -->

    </div>

  </div>
</template>

<script>
import * as VueColor from 'vue-color'
import CircularProgress from '../js/CircularProgress.js'
/* eslint-disable */
function loadExt(files, after) {
  var _this=this;
  _this.files = files;
  _this.js = [];
  _this.head = document.getElementsByTagName("head")[0];
  _this.after = after || function(){};
  _this.loadStyle = function(file) {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = file;
    _this.head.appendChild(link);
  };
  _this.loadScript = function(i) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = _this.js[i];
    var loadNextScript = function() {
      if (++i < _this.js.length) _this.loadScript(i);
      else _this.after();
    };
    script.onload = function() { loadNextScript() };
    _this.head.appendChild(script);
  }
  for (var i=0;i<_this.files.length;i++) {
    if (/\.js$|\.js\?/.test(_this.files[i])) _this.js.push(_this.files[i])
    if (/\.css$|\.css\?/.test(_this.files[i])) _this.loadStyle(_this.files[i])
  }
  if (_this.js.length>0) _this.loadScript(0);
  else _this.after();
}
/* eslint-enable */

export default {
  components: {
    'chrome-picker': VueColor.Chrome
  },
  data () {
    return {
      progress: 0,
      logs: [],
      SDK: false,
      socket: false,
      pickers: {
        bg: '#355BE4',
        ball: '#00AFFF',
        fontColor: '#ffffff'
      },
      spec: {
        sdk: '/sdk/sdk.js',
        site: process.env.NODE_ENV === 'development' ? `http://localhost:3123` : 'https://video-encoder.wonglok.com',
        // site: 'https://video-encoder.wonglok.com',
        text: `

⚖︎

I love dogs because
they be what they want.
simply love.

- Lok

`,
        bg: '#355BE4',
        ball: '#00AFFF',
        fontColor: '#ffffff',
        videoDuration: 3
      }
    }
  },
  mounted () {
    // eslint-disable-next-line
    new loadExt([this.spec.site + this.spec.sdk], () => {
      this.initSystem()
    })
  },
  methods: {
    goTop () {
      window.scrollTo(0, 0)
    },
    async initSystem () {
      this.SDK = await window.UniversalWebGL.makeSDK({
        canvas: this.$refs['canvas'],
        spec: this.spec
      })
      this.SDK.start()
      this.listen()
    },
    onUpdatePoster () {
      if (this.SDK) {
        this.SDK.refreshSpec({ spec: this.spec })
      }
    },
    makePic () {
      if (!this.SDK) {
        return
      }
      let loader = this.makeLoadBox()
      this.SDK.makePoster({
        spec: this.spec,
        onProgress: ({ progress }) => {
          loader.onUpdate(progress)
        }
      }).then((info) => {
        let strURL = `<a class="text-center" target="_blank" href="${info.url}">${info.url}</a>`
        let strPicture = `<a class="text-center" target="_blank" href="${info.url}"><img autoplay loop controls class="img-box" playsinline src="${info.url}"></img></a>`

        this.logs.unshift({
          id: '_' + (Math.random() * 10000000).toFixed(0),
          html: strURL
        })
        this.logs.unshift({
          id: '_' + (Math.random() * 10000000).toFixed(0),
          html: strPicture
        })
      })
    },
    makeVideo () {
      if (!this.SDK) {
        return
      }
      let loader = this.makeLoadBox()
      this.SDK.makeVideo({
        spec: this.spec,
        onProgress: ({ progress }) => {
          loader.onUpdate(progress)
        }
      }).then((info) => {
        let strURL = `<a class="text-center" target="_blank" href="${info.url}">${info.url}</a>`
        let strVideo = `<video autoplay loop controls class="video-box" playsinline src="${info.url}"></video>`

        this.logs.unshift({
          id: '_' + (Math.random() * 10000000).toFixed(0),
          html: strURL
        })
        this.logs.unshift({
          id: '_' + (Math.random() * 10000000).toFixed(0),
          html: strVideo
        })
      })
    },
    makeLoadBox () {
      var progressUI = new CircularProgress({
        radius: 100,
        strokeStyle: '#30C64D',
        lineCap: 'round',
        lineWidth: 1.5,
        font: '100 30px "Noto Sans CJK TC", sans-serif'
      })
      let rID = `_${(Math.random() * 1000000).toFixed(0)}`
      let element = progressUI.el
      this.logs.unshift({
        id: Math.random(),
        html: `<div id="${rID}"></div>`
      })
      let pid = '_' + (Math.random() * 10000000).toFixed(0)
      this.logs.unshift({
        id: pid,
        html: ''
      })
      this.$nextTick(() => {
        document.querySelector(`#${pid}`).appendChild(element)
      })
      let val = 0
      return {
        // appendHTML: (v) => {
        //   let d = document.createElement('div')
        //   d.classList.add('flex', 'items-center', 'justify-center')
        //   d.innerHTML = v
        //   setTimeout(() => {
        //     document.querySelector(`#${rID}`).appendChild(d)
        //   }, 10)
        // },
        onUpdate: (v) => {
          if (v > val) {
            val = v
            progressUI.update(v * 100)
          }
        }
      }
    },
    listen () {
      // this.SDK.makeSocket(this.spec).on('log', (item) => {
      //   this.logs.unshift(item)
      //   // this.$forceUpdate()
      //   // setTimeout(() => {
      //   //   window.scrollTo(0, 0)
      //   // })
      // })
    }
  }
}
</script>

<style>
.option-panel{
  width: 300px;
  height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
.canvas-area{
  width: calc(100% - 300px);
  height: 100%;
}
.canvas-el{
  max-width: 100vmin;
  max-height: 100vmin;
  transform: scale(0.9);
}
</style>
