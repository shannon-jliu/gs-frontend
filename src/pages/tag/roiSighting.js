import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { fromJS } from 'immutable'
import _ from 'lodash'

import { ButtonRow } from './components'
import TargetSightingOperations from '../../operations/targetSightingOperations'

export class ROISighting extends Component {
  constructor(props) {
    super(props)

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
    this.props.saveTargetSighting()
  }

  deleteSighting() {
    if(this.actionable()) {
      if (this.props.sighting.has('id')) {
        this.props.deleteSavedTargetSighting(this.props.sighting)
      } else {
        this.props.deleteUnsavedTargetSighting(this.props.sighting)
      }
    }
  }

  render() {
    const height_width = 300
    return (
      <div>
        <ButtonRow
          type={'ROI'}
          isSaved={this.props.sighting.has('id')}
          saveable={this.canSave()}
          save={this.save}
          deletable={this.actionable()}
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
