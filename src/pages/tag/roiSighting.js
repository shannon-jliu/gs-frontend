import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { ButtonRow, ImageSighting } from './components'
import TargetSightingOperations from '../../operations/targetSightingOperations'

export class ROISighting extends Component {
  constructor(props) {
    super(props)

    this.state = {
      imgWidth: -1,
      imgHeight: -1
    }

    this.save = this.save.bind(this)
    this.deleteSighting = this.deleteSighting.bind(this)
  }

  componentDidMount() {
    this.loadImage(this.props.imageUrl)
  }

  loadImage(imageUrl) {
    let i = new Image()
    i.onload = () => {
      this.setState({
        imgWidth: i.width,
        imgHeight: i.height
      })
    }
    i.src = imageUrl
  }

  save() {
    this.props.saveROISighting(this.props.sighting)
  }

  deleteSighting() {
    if (this.props.sighting.has('id')) {
      this.props.deleteSavedROISighting(this.props.sighting)
    } else {
      this.props.deleteUnsavedTargetSighting(this.props.sighting)
    }
  }

  render() {
    const height_width = 300
    return (
      <div className={this.state.saved ? 'hidden' : 'sighting card'}>
        <ImageSighting
          heightWidth={height_width}
          imgWidth={this.state.imgWidth}
          imgHeight={this.state.imgHeight}
          imageUrl={this.props.imageUrl}
          sighting={this.props.sighting}
        />
        <ButtonRow
          type={'ROI'}
          isSaved={this.props.sighting.has('id')}
          saveable={true}
          save={this.save}
          deletable={true}
          deleteSighting={this.deleteSighting}
        />
      </div>
    )
  }
}

ROISighting.propTypes = {
  sighting: PropTypes.object.isRequired,
  imageUrl: PropTypes.string.isRequired,
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  saveROISighting: TargetSightingOperations.saveROISighting(dispatch),
  deleteSavedROISighting: TargetSightingOperations.deleteSavedROISighting(dispatch),
  deleteUnsavedTargetSighting: TargetSightingOperations.deleteUnsavedTargetSighting(dispatch),
})

export default connect(null, mapDispatchToProps)(ROISighting)
