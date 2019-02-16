import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fromJS } from 'immutable'
import _ from 'lodash'

import SnackbarUtil from '../../util/snackbarUtil'
import TargetSightingOperations from '../../operations/targetSightingOperations'
import AssignmentOperations from '../../operations/assignmentOperations'
import ImageViewer from '../../components/imageViewer'
import TagSighting from './tagSighting'
import ROISighting from './roiSighting'

import { GROUND_SERVER_URL } from '../../constants/links'
import { TWO_PASS_MODE } from '../../util/config'
import './tag.css'

export class Tag extends Component {
  constructor(props){
    super(props)
    this.onTag = this.onTag.bind(this)
    this.onNext = this.onNext.bind(this)
    this.onPrev = this.onPrev.bind(this)
    this.listen = this.listen.bind(this)
    this.renderSighting = this.renderSighting.bind(this)

    this.state = {
      roiMode: TWO_PASS_MODE,
    }
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

  listen(e) {
    // let log = e.data
    // let oldLogs = this.state.logs
    // this.setState({
    //   roiMode: false
    // })
  }

  // open the eventsource to the ground server
  componentWillMount() {
    if (TWO_PASS_MODE) {
      // var eventSourceInitDict = {headers: {'X-AUTH-TOKEN': localStorage.getItem(AUTH_TOKEN_ID)}}
      // var eventSource = new EventSource(GROUND_SERVER_URL + '/api/v1/livelogs', eventSourceInitDict)
      // eventSource.addEventListener('message', this.listen, false)
    }
  }

  componentDidMount() {
    if (!this.props.assignment.hasIn(['assignment', 'id'])) {
      this.props.getAllAssignments(this.props.assignment.get('currentIndex'))
      this.props.getAllSightings()
    }
  }

  renderSighting(s) {
    const imageUrl = this.props.assignment.getIn(['assignment', 'image', 'imageUrl'])

    // TODO once gimbal settings is set in stone do this
    const showOffaxis = /* mode === 'angle' || mode === undefined || mode === null*/ true

    if (this.state.roiMode)
      return (
        <ROISighting
          key={s.get('id') + s.get('type') || s.get('localId')}
          sighting={s}
          imageUrl={GROUND_SERVER_URL + imageUrl}
        />
      )
    else
      return (
        <TagSighting
          key={s.get('id') + s.get('type') || s.get('localId')}
          sighting={s}
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

    // TODO the object parameters are not finalized yet
    const isROI = assignment.getIn(['assignment', 'image', 'gimbalState', 'mode']) || TWO_PASS_MODE

    const name = imageUrl ? imageUrl.substring(
      imageUrl.lastIndexOf('/') + 1,
      imageUrl.lastIndexOf('.')
    ) + (' ' +  isROI ? '(ROI)' : '(TARGET)')  : 'none'
    const count = (assignment.get('currentIndex') + 1) + '/' + assignment.get('total')

    const btnClass = 'btn-floating btn-large red'
    const backClass = 'prev ' + btnClass + (assignment.get('currentIndex') <= 0 ? ' disabled' : '')
    const nextClass = 'next ' + btnClass + (assignment.get('loading') ? ' disabled' : '')
    return (
      <div className='tag'>
        <div className='tag-image card'>
          <ImageViewer
            imageUrl={GROUND_SERVER_URL + imageUrl}
            taggable={true}
            onTag={this.onTag}
          />
        </div>
        <div className='name'> {name} </div>
        <div className='count'> {count} </div>
        <button className={backClass} onClick={this.onPrev}>
          <i className='material-icons'>arrow_back</i>
        </button>
        <button className={nextClass} onClick={this.onNext}>
          <i className='material-icons'>arrow_forward</i>
        </button>
        <div className='sightings'>
          {mdlcSightings.map(s => this.renderSighting(s))}
        </div>
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
