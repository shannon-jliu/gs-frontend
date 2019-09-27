import React, { Component } from 'react'
import PropTypes from 'prop-types'
import $ from 'jquery'
import _ from 'lodash'

import './stylesheets/imageViewer.css'

import DEFAULT_IMG from '../img/cuair_default.png'

class ImageViewer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loaded: false, // if the current image is loaded
      width: null, // width and height of the imageViewer
      height: null,
      mx: 0, // mx and my is the mouse's last location
      my: 0,
      mousedown: { // location of where mouse was clicked, -1 if not clicked
        x: -1,
        y: -1
      },
      dragging: false, // after click, "dragging" the image around in the box
      view: { // x,y of top left corner of the image in the top left corner of img Viewer
        x: 0,
        y: 0,
        scale: 1
      },
      img: { // img height and width
        width: 0,
        height: 0
      },
      tag: { // the tag circle's x & y. on if a tag is active (so render knows to draw it)
        cx: -1,
        cy: -1,
        on: false
      }
    }
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.onWheel = this.onWheel.bind(this)
    this.pointOnImage = this.pointOnImage.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
    this.resize = this.resize.bind(this)
    this.loadImage = this.loadImage.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  // on mouse press down
  onMouseDown(event) {
    // save the location where the mouse was clicked (the center)
    // if the image is zoomed, you can "drag" the image around
    this.setState({
      dragging: true,
      mousedown: {
        x: this.state.mx,
        y: this.state.my
      }
    })
  }

  // on mouse release
  onMouseUp(event) {
    const prevMouseDownX = this.state.mousedown.x
    const prevMouseDownY = this.state.mousedown.y
    this.setState({
      dragging: false,
      mousedown: {
        x: -1,
        y: -1
      }
    })
    // essentially simulates a mouse click
    if (
      this.state.mx === prevMouseDownX &&
      this.state.my === prevMouseDownY
    ) {
      this.onClick()
    }
  }

  onWheel(event) {
    event.stopPropagation()
    event.preventDefault()
    const s = this.state
    let hmin = Math.min(s.height, s.width * s.img.height / s.img.width)
    let maxScale = s.img.height / hmin
    let newScale = Math.min(
      Math.max(1, s.view.scale - 0.001 * event.deltaY),
      maxScale
    )
    // calculate the dx/dy of the scaling operation
    let dx =
      (s.mx - s.width / 2) * (maxScale / newScale - maxScale / s.view.scale)
    let dy =
      (s.my - s.height / 2) * (maxScale / newScale - maxScale / s.view.scale)
    let maxTransX = s.img.width * (1 - 1 / newScale) / 2
    let maxTransY = s.img.height * (1 - 1 / newScale) / 2
    this.setState({
      view: {
        x: Math.min(Math.max(-maxTransX, s.view.x + dx), maxTransX),
        y: Math.min(Math.max(-maxTransY, s.view.y + dy), maxTransY),
        scale: newScale
      }
    })
  }

  pointOnImage(x, y) {
    // calculates the points on the image relative to the mouse coordinates
    const s = this.state
    // latter argument is if the image is scaled down to fit in imageviewer
    const wmin = Math.min(s.width, s.height * s.img.width / s.img.height)
    const hmin = Math.min(s.height, s.width * s.img.height / s.img.width)

    // w and h are the dimensions of the image in the image viewer
    const w = wmin * s.view.scale
    const h = hmin * s.view.scale
    // s.view.x * w / s.img.width and for height is the offset if the image is zoomed in
    // actual_x and y is position of the top left corner in the image viewer space
    const actual_x = (s.width - w) / 2 + s.view.x * w / s.img.width
    const actual_y = (s.height - h) / 2 + s.view.y * h / s.img.height
    // multiply the original image dimensions by the %s that point is a
    return {
      x: s.img.width * ((x - actual_x) / w),
      y: s.img.height * ((y - actual_y) / h)
    }
  }

  onClick() {
    const s = this.state
    // if this is an imageviewer to tag on
    if (this.props.taggable) {
      // if currently selecting a tag
      if (s.tag.on) {
        let n = this.pointOnImage(s.mx, s.my)
        let dx = n.x - s.tag.cx
        let dy = n.y - s.tag.cy
        let r = Math.sqrt(dx * dx + dy * dy)
        let rad = (Math.atan2(dy, dx) + 5 * Math.PI / 2) % (2 * Math.PI)
        //record tag
        this.props.onTag({
          pixelX: Math.round(s.tag.cx),
          pixelY: Math.round(s.tag.cy),
          width: Math.round(r * 2),
          height: Math.round(r * 2),
          radiansFromTop: rad,
          localId: s.tag.cx + ':' + s.tag.cy + ':' + r + ':' + Math.random()
        })
        //clear state
        this.setState({
          tag: {
            on: false,
            cx: 0,
            cy: 0
          }
        })
      } else {
        let c = this.pointOnImage(s.mx, s.my)
        if (c.x > 0 && c.y > 0) {
          // only try to tag if the center is on the image
          this.setState({
            tag: {
              on: true,
              cx: c.x,
              cy: c.y
            }
          })
        }
      }
    }
  }

  // keeps track of the mouse's location and saves it to state
  onMouseMove(event) {
    const s = this.state
    let x = s.view.x
    let y = s.view.y
    // event.clientX and Y is the mouse's position in the whole window
    // however we offset it from the location of the imageviewer itself, pos
    let pos = $(this.refs.viewer).offset()
    let newMX = event.clientX - pos.left
    let newMY = event.clientY - pos.top

    if (s.dragging) {
      // if the mouse is currently being pressed down, moving the mouse will also
      // shift the image
      // yeah i also wish this math was documented lmao
      let maxTransX = s.img.width * (1 - 1 / s.view.scale) / 2
      let maxTransY = s.img.height * (1 - 1 / s.view.scale) / 2
      let maxScale =
        s.img.height / Math.min(s.height, s.width * s.img.height / s.img.width)
      x = Math.min(
        Math.max(-maxTransX, x + (newMX - s.mx) * (maxScale / s.view.scale)),
        maxTransX
      )
      y = Math.min(
        Math.max(-maxTransY, y + (newMY - s.my) * (maxScale / s.view.scale)),
        maxTransY
      )
    }
    this.setState({
      mx: newMX,
      my: newMY,
      view: {
        scale: s.view.scale,
        x: x,
        y: y
      }
    })
  }

  // resizes the imageviewer div
  resize() {
    let w = this.refs.viewer.offsetWidth
    let h = this.refs.viewer.offsetHeight
    if (h < 300) {
      // keep attempting to resize it until the height is at least 300
      // could be that the image hasn't loaded yet
      setTimeout(this.resize, 10)
    } else {
      const s = this.state
      if (w !== s.width || h !== s.height) {
        // update the width/height in the state
        // maintain aspect ratio to the image
        let hmin = Math.min(s.height, s.width * s.img.height / s.img.width)
        let maxScale = s.img.height / hmin // maxScale for the image when zoomed
        this.setState({
          width: w,
          height: h,
          view: {
            x: s.view.x || 0,
            y: s.view.y || 0,
            scale: Math.min(s.view.scale, maxScale) // scale of the image
          }
        })
      }
    }
  }

  // loads the given image into the state
  loadImage(imageUrl) {
    if (imageUrl === undefined) imageUrl = DEFAULT_IMG
    let i = new Image()
    i.onload = () => {
      this.setState({
        loaded: true,
        img: {
          width: i.width,
          height: i.height
        },
        view: {
          scale: 1,
          x: 0,
          y: 0
        }
      })
    }
    i.src = imageUrl
  }

  componentDidMount() {
    this.resize()
    this.loadImage(this.props.imageUrl)
    $(window).on('resize', this.resize)
    $(document.body).on('keydown', this.handleKeyDown)
  }

  componentWillUnmount() {
    $(window).off('resize', this.resize)
    $(document.body).off('keydown', this.handleKeyDown)
  }

  componentWillReceiveProps(nextProps) {
    // loading the next image
    if (nextProps.imageUrl !== this.props.imageUrl) {
      this.setState({
        loaded: false,
        view: {
          x: 0,
          y: 0,
          scale: 1
        },
        img: {
          width: 0,
          height: 0
        }
      })
      this.loadImage(nextProps.imageUrl)
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.imageUrl !== nextProps.imageUrl ||
      this.props.brightness !== nextProps.brightness ||
      this.props.contrast !== nextProps.contrast ||
      this.props.saturation !== nextProps.saturation ||
      this.props.taggable !== nextProps.taggable ||
      this.state.loaded !== nextState.loaded ||
      this.state.width !== nextState.width ||
      this.state.height !== nextState.height ||
      (this.state.tag.on &&
        (this.state.mx !== nextState.mx || this.state.my !== nextState.my)) ||
      !_.isEqual(this.state.img, nextState.img) ||
      !_.isEqual(this.state.view, nextState.view) ||
      !_.isEqual(this.state.tag, nextState.tag)
    )
  }

  handleKeyDown(event) {
    // cancels the tag
    if (event.keyCode === 27) {
      // ESC
      this.setState({
        tag: {
          on: false,
          cx: 0,
          cy: 0
        }
      })
    }
  }

  render() {
    const p = this.props
    let style = {
      backgroundImage: 'url("' + p.imageUrl + '")'
    }
    if (!_.isUndefined(p.brightness) &&
      !_.isUndefined(p.contrast) &&
      !_.isUndefined(p.saturation)) {
      style.filter = 'brightness(' +
        this.props.brightness +
        '%) contrast(' +
        this.props.contrast +
        '%) saturate(' +
        this.props.saturation +
        '%)'
    }
    const s = this.state
    let tagger = null
    if (s.loaded) {
      // calculations for the image itself
      // calculate width/height of the image according to scale
      // do min here to because it fits the image to scale within the imageviewer
      let wmin = Math.min(s.width, s.height * s.img.width / s.img.height)
      let hmin = Math.min(s.height, s.width * s.img.height / s.img.width)
      let w = wmin * s.view.scale
      let h = hmin * s.view.scale
      let x = (s.width - w) / 2 + s.view.x * w / s.img.width
      let y = (s.height - h) / 2 + s.view.y * h / s.img.height
      _.assign(style, {
        backgroundSize: w + 'px ' + h + 'px',
        backgroundPosition: x + 'px ' + y + 'px'
      })

      if (s.tag.on) {
        // if tagging is enabled (draw the red circle)
        let tx = x + s.tag.cx * (w / s.img.width)
        let ty = y + s.tag.cy * (h / s.img.height)
        let dx = tx - s.mx
        let dy = ty - s.my
        let tr = Math.sqrt(dx * dx + dy * dy)
        let rad = (Math.atan2(dy, dx) + 3 * Math.PI / 2) % (2 * Math.PI)
        tagger = (
          <div
            className="tagger"
            style={{
              transform: 'translate(-50%,-50%) rotate(' + rad + 'rad)',
              left: tx,
              top: ty,
              width: 2 * tr,
              height: 2 * tr,
              borderRadius: 2 * tr
            }}
          >
            <div
              className="dash"
              style={{
                height: Math.min(tr / 2, 10)
              }}
            />
            <div className="dot" />
          </div>
        )
      }
    }

    return (
      <div
        className="image-viewer"
        style={style}
        ref="viewer"
        onWheel={this.onWheel}
        onMouseMove={this.onMouseMove}
        onMouseDown={this.onMouseDown}
        onMouseLeave={this.onMouseUp}
        onMouseUp={this.onMouseUp}
        onKeyDown={this.handleKeyDown}
      >
        {tagger}
      </div>
    )
  }
}

ImageViewer.defaultProps = {
  imageUrl: DEFAULT_IMG,
  taggable: false
}

ImageViewer.propTypes = {
  imageUrl: PropTypes.string,
  taggable: PropTypes.bool.isRequired,
  onTag: PropTypes.func.isRequired,
  brightness: PropTypes.number,
  saturation: PropTypes.number,
  contrast: PropTypes.number
}

export default ImageViewer
