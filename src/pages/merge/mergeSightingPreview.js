import React, { Component } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import PropTypes from 'prop-types'

class MergeSightingPreview extends Component {
  constructor(props) {
    super(props)
    this.state = {
      iwidth: -1,
      iheight: -1
    }

    this.loadImage = this.loadImage.bind(this)
  }

  loadImage(imageUrl) {
    let i = new Image()
    i.onload = () => {
      this.setState({
        iwidth: i.width,
        iheight: i.height
      })
    }
    i.src = imageUrl
  }

  componentDidMount() {
    this.loadImage(this.props.sighting.getIn(['assignment', 'image', 'imageUrl']))
  }

  //testWidth and testHeight should only be passed in when testing
  getStyle(testWidth, testHeight) {
    const imageUrl = this.props.sighting.getIn(['assignment', 'image', 'imageUrl'])
    const imgscale = 100 / this.props.sighting.get('width')
    const iwidth = testWidth === undefined ? this.state.iwidth : testWidth
    const iheight = testHeight === undefined ? this.state.iheight : testHeight
    const bgSize = iwidth * imgscale + 'px ' + iheight * imgscale + 'px'
    const x = 50 - this.props.sighting.get('pixelX') * imgscale
    const y = 50 - this.props.sighting.get('pixelY') * imgscale
    let style = {
      backgroundImage: 'url(' + imageUrl + ')',
      backgroundSize: bgSize,
      backgroundPosition: x + 'px ' + y + 'px'
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
          (this.props.isThumbnail ? ' t-thumb' : '')
        }
        onClick={this.props.onClick}
        onDragStart={this.props.onDragStart}
        onDragEnd={this.props.onDragEnd}
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
