import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fromJS } from 'immutable'
import M from 'materialize-css'

import TargetSightingOperations from '../../operations/targetSightingOperations'
import AssignmentOperations from '../../operations/assignmentOperations'
import ImageViewer from '../../components/imageViewer'
import TagSighting from './tagSighting'
import ImageTools from './imageTools'

import { GROUND_SERVER_URL } from '../../constants/links'
import { TWO_PASS_MODE } from '../../util/config'

import './tag.css'

export class Tag extends Component {
  constructor(props){
    super(props)

    this.state = {
      brightness: 100,
      contrast: 100,
      saturation: 100
    }

    this.reset = this.reset.bind(this)
    this.onTag = this.onTag.bind(this)
    this.onNext = this.onNext.bind(this)
    this.onPrev = this.onPrev.bind(this)
    this.getHandler = this.getHandler.bind(this)
    this.renderSighting = this.renderSighting.bind(this)
  }

  onTag(tagged) {
    this.props.addTargetSighting(fromJS(tagged), this.props.assignment.get('assignment'))
  }

  onNext() {
    this.props.finishAssignment(this.props.assignment)
  }

  onPrev() {
    this.props.getPrevAssignment(this.props.assignment)
  }

  getHandler(prop) {
    return e => {
      let propToUpdate = {}
      // for some reason e.target.value is a string so have to cast
      propToUpdate[prop] = Number(e.target.value)
      this.setState(propToUpdate)
    }
  }

  reset() {
    this.setState({
      brightness: 100,
      contrast: 100,
      saturation: 100
    })
  }

  componentDidMount() {
    // required to render the sliders properly
    let elems = document.querySelectorAll('input')
    M.Range.init(elems, {})

    if (!this.props.assignment.hasIn(['assignment', 'id'])) {
      this.props.getAllAssignments(this.props.assignment.get('currentIndex'))
      this.props.getAllSightings()
    }
  }

  componentDidUpdate() {
    M.updateTextFields()
  }

  renderSighting(s, isTracking) {
    const imageUrl = this.props.assignment.getIn(['assignment', 'image', 'imageUrl'])
    // TODO once gimbal settings is set in stone do this
    const showOffaxis = /* mode === 'angle' || mode === undefined || mode === null*/ true
    return (
      <TagSighting
        key={s.get('id') + s.get('type') || s.get('localId')}
        sighting={s}
        isTracking={isTracking}
        imageUrl={GROUND_SERVER_URL + imageUrl}
        cameraTilt={showOffaxis}
      />
    )
  }

  render() {
    const assignment = this.props.assignment
    const sightings = this.props.sightings

    const mdlcSightings = sightings.filter(
      s => !(s.has('creator')) || s.get('creator') === 'MDLC'
    )
    const imageUrl = assignment.getIn(['assignment', 'image', 'imageUrl'])

    // extract the gimbalMode to determine if it is an ROI image (if fixed) or regular (tracking)
    const gimbalMode = assignment.getIn(['assignment', 'image', 'camGimMode'])
    const isTracking = (gimbalMode && gimbalMode === 'tracking') || !TWO_PASS_MODE
    const name = imageUrl ? imageUrl.substring(
      imageUrl.lastIndexOf('/') + 1,
      imageUrl.lastIndexOf('.')
    ) + (isTracking ? ' (TARGET)' : ' (ROI)')  : ' none'
    const count = (assignment.get('currentIndex') + 1) + '/' + assignment.get('total')
    const btnClass = 'waves-effect waves-light btn-floating btn-large red'
    const backClass = 'prev ' + btnClass + (assignment.get('currentIndex') <= 0 ? ' disabled' : '')
    const nextClass = 'next ' + btnClass + (assignment.get('loading') ? ' disabled' : '')
    return (
      <div className='tag'>
        <ImageTools
          getHandler={this.getHandler}
          reset={this.reset}
          brightness={this.state.brightness}
          contrast={this.state.contrast}
          saturation={this.state.saturation}
        />
        <div className='detect'>
          <div className='tag-image card'>
            <ImageViewer
              imageUrl={imageUrl ? GROUND_SERVER_URL + imageUrl : undefined}
              taggable={true}
              brightness={this.state.brightness}
              contrast={this.state.contrast}
              saturation={this.state.saturation}
              onTag={this.onTag}
            />
          </div>
          <div className='name'><span> {name} </span></div>
        </div>
        <div className='classify'>
          <div className='sightings'>
            {mdlcSightings.map(s => this.renderSighting(s, isTracking))}
          </div>
        </div>
        <div className='count'> {count} </div>
        <button className={backClass} onClick={this.onPrev}>
          <i className='material-icons'>arrow_back</i>
        </button>
        <button className={nextClass} onClick={this.onNext}>
          <i className='material-icons'>arrow_forward</i>
        </button>
      </div>
    )
  }
}

const getCurrentAssignment = a => {
  return fromJS({
    assignment: a.getIn(['assignments', a.get('current')]) || null,
    loading: a.get('loading'),
    currentIndex: a.get('current'),
    total: a.get('assignments').size
  })
}

const getSightingsForAssignment = (a, ts) => {
  // grab all target sightings that match the current assignment
  var assignmentId = a.getIn(['assignments', a.get('current'), 'id'])
  return ts
    .get('local')
    .filter(s => s.getIn(['assignment', 'id']) === assignmentId)
    .concat(
      ts.get('saved').filter(s => s.getIn(['assignment', 'id']) === assignmentId)
    )
}

const mapStateToProps = (state) => ({
  assignment: getCurrentAssignment(state.assignmentReducer),
  sightings: getSightingsForAssignment(state.assignmentReducer, state.targetSightingReducer)
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  addTargetSighting: TargetSightingOperations.addTargetSighting(dispatch),
  getAllSightings: TargetSightingOperations.getAllSightings(dispatch),
  getAllAssignments: AssignmentOperations.getAllAssignments(dispatch),
  finishAssignment: AssignmentOperations.finishAssignment(dispatch),
  getPrevAssignment: AssignmentOperations.getPrevAssignment(dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(Tag)
