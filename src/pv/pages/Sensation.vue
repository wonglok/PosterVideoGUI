<template>
  <div class="sensation">
    <div v-if="!SDK">Loading....</div>
    <div v-show="SDK">
      <div class="flex">
        <textarea class="bg-teal-100 border b-black p-3"  @input="onUpdatePoster()" v-model="spec.text" placeholder="text" cols="30" rows="10"></textarea>
        <chrome-picker class="bg-teal-100 border b-black p-3"   v-model="colorpicker" @input="spec.bg = colorpicker.hex; onUpdatePoster()"></chrome-picker>
        <div>
            Seconds:
            <input step="0.001" type="number" v-model="spec.videoDuration">
        </div>

      </div>
      <!-- <textarea  @input="onUpdatePoster()" v-model="spec.author" placeholder="author" cols="30" rows="10"></textarea> -->
      <!-- <input @input="onUpdatePoster()" class="bg-teal-100 p-3 border b-black" v-model="spec.bg" type="text"></input> -->
      <select v-model="spec.site">
        <option value="http://localhost:3123">Localhost</option>
        <option value="https://video-encoder.wonglok.com">Digital Ocean Rendering Server</option>
        <option value="https://ec2-renderer.wonglok.com">Amazon Rendering Server</option>
      </select>
      <button class="bg-teal-100 border b-black p-3"  @click="makeVideo()">Make Video</button>
      <button class="bg-teal-100 border b-black p-3"  @click="makePic()">Make Pic</button>
    </div>
    <div class="fixed top-0 right-0 m-5">
      <canvas ref="canvas">
      </canvas>
    </div>
    <div class="logs">
      <div v-for="log in logs" :key="log.id" v-html="log.html"></div>
    </div>
    <div class="fixed bottom-0 right-0 m-5">
      <button @click="goTop">Go Top</button>
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
      colorpicker: {},
      spec: {
        sdk: '/sdk/sdk.js',
        // site: process.env.NODE_ENV === 'development' ? `http://localhost:3123` : 'https://video-encoder.wonglok.com',
        site: 'https://video-encoder.wonglok.com',
        text: 'hello from hong kong',
        bg: '#ffffff',
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
        let strURL = `<a class="link-box" target="_blank" href="${info.url}">${info.url}</a>`
        let strPicture = `<img autoplay loop controls class="img-box" playsinline src="${info.url}"></img>`
        loader.appendHTML(strURL + strPicture)
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
        let strURL = `<a class="link-box" target="_blank" href="${info.url}">${info.url}</a>`
        let strVideo = `<video autoplay loop controls class="video-box" playsinline src="${info.url}"></video>`
        loader.appendHTML(strURL + strVideo)
      })
    },
    makeLoadBox () {
      var progressUI = new CircularProgress({
        radius: 70,
        strokeStyle: '#2fb734',
        lineCap: 'round',
        lineWidth: 20,
        font: '22px NotoSans, sans-serif'
      })
      let rID = `_${(Math.random() * 1000000).toFixed(0)}`
      let element = progressUI.el
      this.logs.unshift({
        id: Math.random(),
        html: `<div id="${rID}"></div>`
      })
      this.$nextTick(() => {
        document.querySelector(`#${rID}`).appendChild(element)
      })
      let val = 0
      return {
        appendHTML: (v) => {
          let d = document.createElement('div')
          d.innerHTML += v
          setTimeout(() => {
            document.querySelector(`#${rID}`).appendChild(d)
          }, 10)
        },
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
.senstaion canvas{
  max-width: 40vmin;
  max-height: 40vmin;
}
.senstaion video{
  max-width: 40vmin;
  max-height: 40vmin;
}
.senstaion img{
  max-width: 40vmin;
  max-height: 40vmin;
}
</style>
