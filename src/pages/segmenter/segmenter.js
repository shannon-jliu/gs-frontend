import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fromJS } from 'immutable'


import $ from 'jquery'

import { AUTH_TOKEN_ID } from '../../constants/constants.js'
import { GROUND_SERVER_URL } from '../../constants/links.js'
import { MILLISECONDS_BETWEEN_SEGMENT_PAGE_POLLS } from '../../constants/constants.js'

import TargetSightingOperations from '../../operations/targetSightingOperations'

import './segmenter.css'
import SegmentTool from './segment_tool.js'


class Segmenter extends Component {

  constructor(props) {
    super(props)

    this.state = {

    }

    this.renderSighting = this.renderSighting.bind(this)
  }

  componentDidMount() {
    const loadNewestContent = () => {
      this.props.getAllSightings()
    }
    this.contentLoader = setInterval(loadNewestContent, MILLISECONDS_BETWEEN_SEGMENT_PAGE_POLLS)
  }

  componentWillUnmount() {
    clearInterval(this.contentLoader)
  }

  render() {

    return (

      <div className="segmenter">
        {this.renderUnsegmentedSidebar()}
        {/* < SegmentTool /> */}
      </div >
    )
  }

  renderUnsegmentedSidebar() {
    const unsegmentedSightings = this.props.sightings.filter(ts => ts.get('type') === 'alphanum' && !this.isSegmented(ts))
    const renderedUnassignedSightings = unsegmentedSightings.map(this.renderSighting).toJSON()

    return (
      <div className='sightings'>
        {renderedUnassignedSightings}
      </div>
    )
  }

  renderSighting(sighting) {

    return (
      <div >
        < SegmentTool
          isThumbnail={false}
          isMerged={false}
          sighting={sighting} />
      </div>
    )
  }

  //TODO: checks if the sighting has already been segmented
  isSegmented(sighting) {

    return false

  }

}


const mapStateToProps = (state) => ({
  sightings: state.targetSightingReducer.get('saved'),
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  getAllSightings: TargetSightingOperations.getAllSightings(dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Segmenter)
