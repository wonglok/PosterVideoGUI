import * as rasterizeHTML from 'rasterizehtml'

/*
COPYRIGHT MCGILL MEDIA 2019 all rights reserved.
*/
window.nextIdle = () => {
  return new Promise((resolve) => {
    window.requestIdleCallback(resolve)
  })
}
window.nextImmediate = () => {
  return new Promise((resolve) => {
    resolve()
  })
}
window.nextTimeout = () => {
  return new Promise((resolve) => {
    window.setTimeout(resolve, 0)
  })
}

/* eslint-disable */
//
  // https://www.rgraph.net/blog/measuring-text-height-with-html5-canvas.html
  // modififed
  function measureTextHeight_ (text, bold, boxWidth, font, fontSize) {
    // This global variable is used to cache repeated calls with the same arguments
    var str = text + ':' + bold + ':' + font + ':' + fontSize;
    if (typeof(window.____MEASURE_CACHE____) == 'object' && window.____MEASURE_CACHE____[str]) {
        return window.____MEASURE_CACHE____[str];
    }

    var div = document.createElement('DIV');
        div.innerHTML = text;
        div.style.position = 'absolute';
        div.style.top = '-2048px';
        div.style.left = '-2048px';
        div.style.width = boxWidth + 'px';
        div.style.fontFamily = font;
        div.style.fontWeight = 'normal';
        div.style.whiteSpace = 'pre-line';
        div.style.fontSize = fontSize + 'px';
    document.body.appendChild(div);
    var size = [div.offsetWidth, div.offsetHeight];
    document.body.removeChild(div);

    if (typeof(window.____MEASURE_CACHE____) != 'object') {
        window.____MEASURE_CACHE____ = [];
    }
    window.____MEASURE_CACHE____[str] = size;

    return size;
}

let autoDOMResuser = new Map()
let autoMeasureMap = new Map()
async function measureTextHeight (text, bold, boxWidth, font, fontSize) {
  var str = text + ':' + bold + ':' + boxWidth + ':' + font + ':' + fontSize;
  if (autoMeasureMap.has(str)) {
    return autoMeasureMap.get(str)
  } else {
    let value = false
    let dom = false
    if (autoDOMResuser.has(str)) {
      dom = autoDOMResuser.get(str)
    } else {
      dom = document.createElement('div')

      dom.innerHTML = text;
      dom.style.position = 'absolute';
      dom.style.top = '-2048px';
      dom.style.left = '-2048px';
      dom.style.width = boxWidth + 'px';
      dom.style.fontFamily = font;

      dom.style.fontWeight = 'normal';
      dom.style.whiteSpace = 'pre-line';
      // dom.style.fontWeight = bold ? 'bold' : 'normal';
      dom.style.fontSize = fontSize + 'px';
      dom.style.zIndex = '-1'

      autoDOMResuser.set(str, dom)
    }

    document.body.appendChild(dom)
    value = dom.offsetHeight
    await window.nextImmediate()
    document.body.removeChild(dom)
    autoMeasureMap.set(str, value)

    return value
  }
}

class PosterItem {
  constructor ({ fontColor, bgColor, text, author, bgSize, watermark, bgURL }) {
    var self = this
    this.bgSize = bgSize
    this.bgURL = bgURL
    if (!this.bgURL) {
      bgURL = this.bgURL = `data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7`
    }
    this.watermark = watermark
    this.fontColor = fontColor

    return Promise.all([
      this.toDataURL(this.bgURL)
        .then(({ url, img }) => {
          this.bgImage = img
          this.bgURL = bgURL = url
        }),
      this.setup({ fontColor, text, author, self, bgURL, bgSize, watermark, bgColor })
    ])
      .then((results) => {
        return results[1]
      })
  }
  // getFont () {
  //   return new Promise((resolve) => {
  //     WebFont.load({
  //       google: {
  //         families: ['Raleway']
  //       },
  //       active: () => {
  //         resolve()
  //       },
  //       inactive: () => {
  //         setTimeout(() => {
  //           resolve()
  //         }, 1000)
  //       }
  //     })
  //   })
  // }
  // getImage (url) {
  //   return new Promise((resolve) => {
  //     var img = new Image()
  //     img.onload = () => {
  //       resolve()
  //     }
  //     img.src = url
  //   });
  // }

  async getAutoFontSize ({ text, aspect = this.bgSize.width / this.bgSize.height }) {
    var n = 5;
    let maxFontSize = 90

    async function helper () {
      let bold = 'normal'
      let boxWidth = 0.8 * 2048
      let maxHeight = 0.8 * 2048 / aspect
      let font = 'font-family: "HelveticaNeue", "Helvetica Neue", Helvetica, Arial, sans-serif;'
      let fontSize = Math.log(text.length) * n

      let height = await measureTextHeight(text, bold, boxWidth, font, fontSize)
      // console.log(height)
      if (height < maxHeight && fontSize < maxFontSize) {
        n += 0.15;
        return await helper()
      } else {
        return fontSize
      }
    }

    let finalSize = await helper()
    // console.log(text, finalSize)
    // if (finalSize >= maxFontSize) {
    //   finalSize = maxFontSize
    // }

    return finalSize;//Math.log(text.length) * 11.0;
  }

  toDataURL (url) {
    return new Promise((resolve) => {
      var canvas = document.createElement('canvas')
      var img = new Image()
      img.crossOrigin = 'Anonymous'
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        let ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        let dataURL = canvas.toDataURL('image/jpeg', 1.0)
        resolve({
          url: dataURL,
          img: img
        })
      }
      img.src = url
    })
  }

  async setup ({ text, author, self, bgURL, bgSize, watermark, bgColor, fontColor }) {
    let aspect = 1 / (bgSize.height / bgSize.width)
    let fontSize = await this.getAutoFontSize({ text, aspect })
    let authorHTML = ``
    if (author) {
      authorHTML = `<div class="authordiv">
        — ${author}
      </div>`
    }

    return rasterizeHTML.drawHTML(`
        <style>
          .concon{
            display: flex;
            justify-content: center;
            align-items: center;
            width: ${2048}px;
            height: ${2048 / aspect}px;

            /*
            background-color: ${bgColor};
            background-image: url(${bgURL});
            background-size: cover;
            background-position: 50% 50%;
            background-repeat: no-repeat no-repeat;
            */


          }
          .textdiv{

            font-family: "Raleway", "HelveticaNeue", "Helvetica Neue", Helvetica, Arial, sans-serif;
            font-size: ${fontSize}px;
            /*
            text-shadow: 0px 0px 100px rgba(255,255,255,0.5);
            */
            color: ${fontColor};
            width: ${0.8 * 2048}px;
            height: ${0.8 * 2048 / aspect}px;

            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            position: relative;
            margin-bottom: 300px;
            white-space: pre-line;
          }
          .quotediv{
            text-align: center;
          }
          .authordiv{
            margin-top: 80px;
            font-size: ${fontSize * 0.5}px;
            text-align: center;
          }
          .watermark{
            font-family: "Raleway", "HelveticaNeue", "Helvetica Neue", Helvetica, Arial, sans-serif;
            color: ${fontColor};
            font-size: 50px;
            position: absolute;
            left: 0px;
            bottom: 50px;
            text-align: center;
            width: 100%;
          }
        </style>
        <div class="concon">
          <div class="textdiv">
            <div class="quotediv">
              ${text}
            </div>
            ${authorHTML}

          </div>
          <div class="watermark">
            ${watermark}
          </div>
        </div>
    `,{
      width: `${2048}`,
      height: `${2048 / aspect}`,
      baseUrl: window.location.protocol + "//" + window.location.host + '/'
    }).then((renderResult) => {
      console.log('renderResult', renderResult)
      this.result = renderResult
      this.canvas = renderResult.image
      this.svg = renderResult.svg
      return self;
    })
  }
}

function dataURLtoBlob(dataurl) {
  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {type:mime});
}

export function addQuote ({ info }) {
  return new Promise(async (resolve) => {
    let target = document.createElement('div')
    info.poster_image = info.poster_image_quotes

    if (info.poster_text.length > 400) {
      info.poster_aspect = '5:7'
      info.poster_image = info.poster_image_passages
    }

    var poster_filename = info.poster_filename;
    var poster_aspect = info.poster_aspect;
    let poster_color_background = info.poster_color_background;

    // var wh = poster_aspect// .split(':').map(Number).map(v => v * 500)
    var ww = 600;
    var hh = 600;

    if (poster_aspect === '5:7') {
      ww = 500;
      hh = 700;
    }

    let aspect = ww / hh;

    let centerRow = document.createElement('div')
    centerRow.classList.add('fadein')

    centerRow.style['width'] = '100%'
    centerRow.style['display'] = 'flex'
    centerRow.style['justify-content'] = 'center'
    centerRow.style['align-items'] = 'center'


    let novaAPI = await new PosterItem({
      fontColor: info.poster_color_font,
      text: info.poster_text,
      author: info.poster_author,
      bgURL: info.poster_image,
      bgColor: info.poster_color_background,
      watermark: info.poster_watermark,
      bgSize: {
        width: ww,
        height: hh
      }
    })
    let originalImageSRC = novaAPI.result.image.src

    let canvas = document.createElement('canvas')
    let ctx = canvas.getContext('2d')
    canvas.width = 2048
    canvas.height = 2048 / aspect

    ctx.fillStyle = poster_color_background;
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.drawImage(novaAPI.bgImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(novaAPI.result.image, 0, 0, canvas.width, canvas.height);

    let imgSRC = canvas.toDataURL('png')
    novaAPI.result.image.src = imgSRC

    // console.log(novaAPI);
    // let item = $(`<button class="uk-button">Download Poster</button>`)

    let button = document.createElement('button')
    button.classList.add('srn-button')
    button.innerHTML = 'Download Poster'
    // button.style.display = 'block'
    button.style.marginTop = '10px'
    button.style.marginBottom = '10px'
    button.style.marginLeft = 'auto'
    button.style.marginRight = 'auto'
    button.style.display = 'flex'
    button.style.alignItems = 'center'
    button.style.justifyContnet = 'center'
    // button.style.justifyContnet = ''

    button.onclick = () => {
      let a = document.createElement('a')
      let imgSRC2 = URL.createObjectURL(dataURLtoBlob(imgSRC))
      a.href = imgSRC2
      a.download = poster_filename + '.png'
      a.click()
    }

    centerRow.appendChild(novaAPI.result.image);
    target.appendChild(centerRow)
    target.appendChild(button)

    resolve({
      imgSRC: originalImageSRC,
      dom: target
    })
  });
}

// (function (){


//   window.SRN = window.SRN || {}
//   window.SRN.addQuote = addQuote;

//   // $(function () {
//     // var poster_color_background = '#C1CAF1';
//     // var poster_color_font = '#1F1F1F';
//     // var poster_image = 'https://www.wonglok.com/_acs/www.wonglok.com/images/quotes.jpg';
//     // var poster_text = 'Do you love the creative power of loving what is hard to work on?';
//     // var poster_author = 'Lok Lok';
//     // var poster_watermark = '';
//     // var poster_filename = 'lok-lok-love-creative-power-loving-hard-work';
//     // var poster_aspect = '1:1'
//   //   addQuote({ target: $('.uk-container')[0], info: window })
//   // });



// }());
