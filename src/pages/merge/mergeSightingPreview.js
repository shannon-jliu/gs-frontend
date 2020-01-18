import React, { Component } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import PropTypes from 'prop-types'
import localforage from 'localforage'

// import { GROUND_SERVER_URL } from '../../constants/links'

class MergeSightingPreview extends Component {
  constructor(props) {
    super(props)
    this.state = {
      iSrc: '',
      iwidth: -1,
      iheight: -1,
      compressedWidth: -1,
      compressedHeight: -1
    }

    this.loadImage = this.loadImage.bind(this)
    this.getStyle = this.getStyle.bind(this)
  }

  loadImage(imageUrl) {
    let i = new Image()
    i.onload = () => {
      this.setState({
        iSrc: i.src,
        iwidth: i.width,
        iheight: i.height
      })
    }

    let imgUrlFull = imageUrl + '_full'

    localforage.getItem(imgUrlFull).then(data => {
      if (data !== null) {
        i.src = 'data:image/png;base64,' + data
      } else {
        // Display compressed version
        localforage.getItem(imageUrl).then(data => {
          if (data !== null) {
            i.src = data
          }
        })
      }
    })

    let iCompressed = new Image()
    iCompressed.onload = () => {
      this.setState({
        compressedWidth: iCompressed.width,
        compressedHeight: iCompressed.height
      })
    }

    localforage.getItem(imageUrl).then(data => {
      if (data !== null) {
        iCompressed.src = data
      }
    })
  }

  componentDidMount() {
    this.loadImage(this.props.sighting.getIn(['assignment', 'image', 'imageUrl']))
  }

  //testWidth and testHeight should only be passed in when testing
  getStyle(testWidth, testHeight) {
    if (testWidth === undefined && this.state.iwidth === -1) {
      return {}
    }
    const heightWidth = 100
    const imageUrl = this.state.iSrc
    const imgscale = heightWidth / this.props.sighting.get('width')
    const iwidth = testWidth === undefined ? this.state.iwidth : testWidth
    const iheight = testHeight === undefined ? this.state.iheight : testHeight
    const bgSize = iwidth * imgscale + 'px ' + iheight * imgscale + 'px'
    const x = heightWidth/2 - this.props.sighting.get('pixel_x') * (iwidth/this.state.compressedWidth) * imgscale
    const y = heightWidth/2 - this.props.sighting.get('pixel_y') * (iheight/this.state.compressedHeight) * imgscale
    let style = {
      backgroundImage: 'url(' + imageUrl + ')',
      backgroundSize: bgSize,
      // backgroundPosition: x + 'px ' + y + 'px',
      backgroundPosition: x + 'px ' + y + 'px',
      backgroundRepeat: 'no-repeat'
    }
    if (this.props.dragging) {
      style['opacity'] = 0.15
    }

    return style
  }

  render() {
    return (
      <div
        className={
          'image' +
          (this.props.isMerged ? ' merged-ts' : '') +
          (this.props.isThumbnail ? ' t-thumb' : '') +
          (this.state.iwidth === -1 || this.state.iheight === -1 ? ' red lighten-3' : '')
        }
        onClick={this.props.onClick}
        onDragStart={this.props.onDragStart}
        onDragEnd={this.props.onDragEnd}
        onDrag={this.props.onDrag}
        draggable={this.props.onDragStart !== undefined}
        style={this.getStyle()}>
      &nbsp;
      </div>
    )
  }
}

MergeSightingPreview.propTypes = {
  sighting: ImmutablePropTypes.map.isRequired,
  onClick: PropTypes.func,
  onDragStart: PropTypes.func,
  onDragEnd: PropTypes.func,
  dragging: PropTypes.bool.isRequired,
  isMerged: PropTypes.bool.isRequired,
  isThumbnail: PropTypes.bool.isRequired
}

export default MergeSightingPreview
