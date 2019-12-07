import React, { Component } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import PropTypes from 'prop-types'
import { resolve } from 'url'

import { GROUND_SERVER_URL } from '../../constants/links'

class MergeSightingPreview extends Component {
  constructor(props) {
    super(props)
    this.state = {
      imgWidth: -1,
      imgHeight: -1
    }

    this.loadImage = this.loadImage.bind(this)
    this.getStyle = this.getStyle.bind(this)
  }

  loadImage(imageUrl) {
    let i = new Image()
    i.onload = () => {
      this.setState({
        imgWidth: i.width,
        imgHeight: i.height
      })
    }
    i.src = resolve(GROUND_SERVER_URL, imageUrl)
  }

  componentDidMount() {
    this.loadImage(this.props.sighting.getIn(['assignment', 'image', 'imageUrl']))
  }

  //testWidth and testHeight should only be passed in when testing
  getStyle(testWidth, testHeight) {
    if (testWidth === undefined && this.state.imgWidth === -1) {
      return {}
    }
    const imageUrl = this.props.sighting.getIn(['assignment', 'image', 'imageUrl'])
    const imgScale = 100 / this.props.sighting.get('width')
    const imgWidth = testWidth === undefined ? this.state.imgWidth : testWidth
    const imgHeight = testHeight === undefined ? this.state.imgHeight : testHeight
    const bgSize = imgWidth * imgScale + 'px ' + imgHeight * imgScale + 'px'
    const x = 50 - this.props.sighting.get('pixelX') * imgScale
    const y = 50 - this.props.sighting.get('pixelY') * imgScale

    return {
      backgroundImage: 'url(' + resolve(GROUND_SERVER_URL, imageUrl) + ')',
      backgroundSize: bgSize,
      backgroundPosition: `${x}px ${y}px`
    }
  }

  render() {
    return (
      <div
        className={
          'image' +
          (this.props.isMerged ? ' merged-ts' : '') +
          (this.props.isThumbnail ? ' t-thumb' : '') +
          (this.state.imgWidth === -1 || this.state.imgHeight === -1 ? ' red lighten-3' : '')
        }
        style={this.getStyle()}>
      &nbsp;
      </div>
    )
  }
}

MergeSightingPreview.propTypes = {
  sighting: ImmutablePropTypes.map.isRequired,
  isMerged: PropTypes.bool.isRequired,
  isThumbnail: PropTypes.bool.isRequired
}

export default MergeSightingPreview
