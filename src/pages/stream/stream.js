import React, { Component } from 'react'
import { connect } from 'react-redux'
import $ from 'jquery'

import './stream.css'

const NUM_CAMERAS = 5

export class Stream extends Component {
  constructor() {
    super()
    this.state = {
      videoScript1Loaded: false,
      videoScript2Loaded: false,
    }
  }

  componentDidMount() {
    let script = document.createElement('script')
    script.src = 'https://unpkg.com/video.js/dist/video.js'
    script.id = 'videoScript1'
    document.body.appendChild(script)

    document.getElementById('videoScript1').addEventListener('load', () => {
      this.setState({ videoScript1Loaded: true })
    })

    script = document.createElement('script')
    script.src = 'https://unpkg.com/@videojs/http-streaming/dist/videojs-http-streaming.js'
    script.id = 'videoScript2'
    document.body.appendChild(script)

    document.getElementById('videoScript2').addEventListener('load', () => {
      this.setState({ videoScript2Loaded: true })
    })

    window.addEventListener('load', () => {
      let loadSegments = () => {

      }
      loadSegments()
    })
  }

  componentDidUpdate(_, prevState) {
    if (prevState.videoScript1Loaded === false || prevState.videoScript2Loaded === false) {
      if (this.state.videoScript1Loaded === true && this.state.videoScript2Loaded === true) {
        const script = document.createElement('script')
        script.id = 'videoScript3'
        script.innerHTML = 'var player = videojs(\'vid1\'); player.play();'
        document.body.appendChild(script)

        document.getElementById('videoScript3').addEventListener('load', () => {
          console.log('loaded the third script')
        })
      }
    }
  }

  render() {
    const items = []
    for (var i = 0; i < NUM_CAMERAS; i++) {
      var url = 'http://localhost:9000/api/v1/stream/playlist?number=' + i
      var res = $.ajax({
        url: url,
        type: 'GET',
        async: false
      })
      items.push(
        <video-js id="vid1" width="600" height="300" class="vjs-default-skin" controls data-setup='{"fluid": false}'>
          <source src={url} type="application/x-mpegURL" />
        </video-js>)
    }

    return (
      <div>
        {items}
      </div>
    )
  }
}

export default connect(null, null)(Stream)
