import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fromJS } from 'immutable'
import _ from 'lodash'

import MergeSighting from './mergeSighting'
import MergeTarget from './mergeTarget'
import TargetSightingOperations from '../../operations/targetSightingOperations'
import TargetOperations from '../../operations/targetOperations'
import SnackbarUtil from '../../util/snackbarUtil.js'
import Switch from './components/Switch.js'

import { MILLISECONDS_BETWEEN_MERGE_PAGE_POLLS } from '../../constants/constants.js'
import { AUTH_TOKEN_ID } from '../../constants/constants.js'

import './merge.css'
import { TargetSightingRequests } from '../../util/sendApi'

export class Merge extends Component {
  constructor(props) {
    super(props)

    this.state = {
      // if a target sighting is being dragged, the entire object is copied to this variable
      // when no sighting is being dragged, this is null
      dragSighting: null,
      adlcChecked: false
    }

    this.createNewTarget = this.createNewTarget.bind(this)
    this.onDragStart = this.onDragStart.bind(this)
    this.onDragEnd = this.onDragEnd.bind(this)
    this.onDrag = this.onDrag.bind(this)
    this.onDrop = this.onDrop.bind(this)
    this.renderSighting = this.renderSighting.bind(this)
    this.renderTarget = this.renderTarget.bind(this)
    this.mergeADLC = this.mergeADLC.bind(this)
    this.updateCheck = this.updateCheck.bind(this)
  }

  // every 3 seconds, the page polls the server for the current targets and target sightings
  componentDidMount() {
    const loadNewestContent = () => {
      this.props.getAllTargets()
      this.props.getAllSightings()
    }
    this.contentLoader = setInterval(
      loadNewestContent,
      MILLISECONDS_BETWEEN_MERGE_PAGE_POLLS
    )
  }

  componentWillUnmount() {
    clearInterval(this.contentLoader)
  }

  render() {
    return (
      <div className="merge">
        {this.renderUnassignedSightingsSidebar()}
        {this.renderTargetsColumn()}
      </div>
    )
  }

  renderUnassignedSightingsSidebar() {
    const unassignedSightings = this.props.sightings.filter(
      (ts) => ts.get('type') === 'alphanum' && !this.isSightingAssigned(ts)
    )
    this.assignUnassignedSighting()
    const renderedUnassignedSightings = unassignedSightings
      .map(this.renderSighting)
      .toJSON()

    return <div className="sightings">{renderedUnassignedSightings}
      <br />
      <div className="adlcMdlcSwitch">
        <Switch offState={'mdlc'}
          myRef={ref => (this.capturingInput = ref)}
          onChange={this.updateCheck}
          id={'adlc or mdlc'}
          checked={this.state.adlcChecked}
          onState={'adlc'}
        />
      </div>
      <br />
      <div className='mergeButton'>
        <a onClick={this.mergeADLC} className='waves-effect waves-light btn red' href='/#'>
          Merge ADLC Sightings
        </a>
      </div>
    </div>
  }

  updateCheck() {
    let newLocal = _.cloneDeep(this.state)
    let past = newLocal.adlcChecked
    newLocal.adlcChecked = !past
    this.setState(newLocal)
  }

  mergeADLC() {
    const targets = this.props.savedTargets
    const adlcSightings = this.props.sightings.filter(
      (ts) => ts.get('type') === 'alphanum' && !this.isSightingAssigned(ts) && ts.get('creator').get('username') == 'ADLC'
    )
    adlcSightings.map((sighting) =>
      targets.map((target) => {
        if (sighting.get('shape') == target.get('shape')
          && sighting.get('shapeColor') == target.get('shapeColor')
          && sighting.get('alpha') == target.get('alpha')
          && sighting.get('alphaColor') == target.get('alphaColor')) {
          this.props.updateTargetSighting(
            sighting,
            fromJS({ target: target })
          )
        }
      }))
  }

  assignUnassignedSighting() {
    const unassignedSightings = this.props.sightings.filter(
      (ts) => ts.get('type') === 'alphanum' && !this.isSightingAssigned(ts) && ts.get('creator').get('username') !== 'ADLC'
    )
    unassignedSightings.map((sighting) => this.matchSightingToTarget(sighting, this.props.savedTargets))
  }

  matchSightingToTarget(sighting, targets) {
    targets.map((target) => {
      if (sighting.get('shape') == target.get('shape')
        && sighting.get('shapeColor') == target.get('shapeColor')
        && sighting.get('alpha') == target.get('alpha')
        && sighting.get('alphaColor') == target.get('alphaColor')) {
        this.props.updateTargetSighting(
          sighting,
          fromJS({ target: target })
        )
        // sighting.set('target', target)
      }
    })
  }

  // aka, is some target assumed for sighting
  isSightingAssigned(sighting) {
    const isSomeTargetConfirmedOrPendingForSighting =
      this.isSomeTargetConfirmedForSighting(sighting) ||
      this.isSomeTargetPendingForSighting(sighting)
    return (
      isSomeTargetConfirmedOrPendingForSighting &&
      !this.isSomeTargetBeingUnboundFromSighting(sighting)
    )
  }

  renderSighting(sighting) {
    const isDragging =
      !_.isNil(this.state.dragSighting) &&
      sighting.get('id') === this.state.dragSighting.get('id')

    return (
      <MergeSighting
        key={sighting.get('id') + '-sighting-info'}
        sighting={sighting}
        onDragStart={() => this.onDragStart(sighting)}
        onDragEnd={this.onDragEnd}
        onDrag={this.onDrag}
        dragging={isDragging}
      />
    )
  }

  // begin dragging a sighting, either from the sidebar or a target
  onDragStart(sighting) {
    this.setState({
      dragSighting: sighting,
    })
  }

  // end dragging a sighting, whether over a target or not. runs after onDrop (if it was over a target)
  onDragEnd() {
    if (
      !_.isNil(this.state.dragSighting) &&
      !_.isNil(this.state.dragSighting.get('target'))
    ) {
      if (this.state.dragSighting.has('type')) {
        if (this.state.dragSighting.has('id')) {
          this.props.deleteSavedTargetSighting(this.state.dragSighting)
        } else {
          this.props.deleteUnsavedTargetSighting(this.state.dragSighting)
        }
        // this.props.deleteSavedTargetSighting(this.state.dragSighting)
      }
    }
    this.setState({
      dragSighting: null,
    })
  }

  onDrag(e) {
    if (e.clientY < 300) {
      window.scrollBy(0, -7, 'smooth')
    }

    if (e.clientY > window.innerHeight - 300) {
      window.scrollBy(0, 7, 'smooth')
    }
  }

  renderTargetsColumn() {
    const sortedTargets = this.getSortedTargets()
    const renderedSortedTargets = sortedTargets.map(this.renderTarget).toJSON()
    // const renderedNewTargetButton = this.renderNewTargetButton()

    return (
      <div className="targets">
        {renderedSortedTargets}
      </div>
    )
  }

  getSortedTargets() {
    // order should be first the emergent target, then the offaxis (will be alphanum with lowest id), then every other alphanum in ascending id order
    const sortedSavedTargets = this.props.savedTargets.sort(
      (target1, target2) => {
        if (target1.get('type') === 'emergent') {
          return -1
        } else if (target2.get('type') === 'emergent') {
          return 1
        } else {
          return target1.get('airdropId') - target2.get('airdropId')
        }
      }
    )
    // local targets go after, in the order they were created (which is their props order)
    return sortedSavedTargets.concat(this.props.localTargets)
  }

  renderTarget(target) {
    const key =
      (target.get('id') || target.get('localId')) +
      '-target-' +
      target.get('type')
    const boundSightings = target.has('id')
      ? this.getSightingsAssumedForTarget(target)
      : fromJS([])
    const dragId = _.isNil(this.state.dragSighting)
      ? undefined
      : this.state.dragSighting.get('id')

    return (
      <MergeTarget
        key={key}
        target={target}
        sightings={boundSightings}
        onTsDragStart={this.onDragStart}
        onTsDragEnd={this.onDragEnd}
        onTsDrop={this.onDrop}
        dragId={dragId}
        isChecked={this.state.adlcChecked}
      />
    )
  }

  // called by a target when a target sighting that can be dropped into it is released over it. runs before onDragEnd
  onDrop(target) {
    if (target.has('id')) {
      const currTargetOfDragSighting = this.getTargetAssumedForSighting(
        this.state.dragSighting
      )
      if (
        _.isNil(currTargetOfDragSighting) ||
        currTargetOfDragSighting.get('id') !== target.get('id')
      ) {
        // this.props.deleteSavedTargetSighting(target)
        this.props.updateTargetSighting(
          this.state.dragSighting,
          fromJS({ target })
        )
      }
    }
    this.setState({
      dragSighting: null,
    })
  }

  getTargetAssumedForSighting(sighting) {
    if (this.isTargetBoundToSightingBeingChanged(sighting)) {
      return sighting.getIn(['pending', 'target'])
    } else {
      return sighting.get('target')
    }
  }

  getSightingsAssumedForTarget(target) {
    return this.props.sightings.filter((ts) => {
      if (ts.get('type') === 'emergent') {
        return target.get('type') === 'emergent'
      }
      if (
        this.isSomeTargetBeingUnboundFromSighting(ts) ||
        !this.isSomeTargetConfirmedForSighting(ts)
      ) {
        return false
      }
      if (this.isSomeTargetPendingForSighting(ts)) {
        return this.isTargetPendingForSighting(target, ts)
      } else {
        return this.isTargetConfirmedForSighting(target, ts)
      }
    })
  }

  // Note how some functions below use isNil and some use isNull. This is because for a sighting's
  // assumed target, the pending target overrides the confirmed target.
  // If pending's target is undefined (aka the field doesn't exist), then nothing is overridden (and the assumed target is the confirmed one).
  // But, if pending's target is set to null, the target is being deleted (and the assumed target is null).
  // _.isNil() is true for either null or undefined. _.isNull() is only true for null.

  isSomeTargetConfirmedForSighting(sighting) {
    return !_.isNil(sighting.get('target'))
  }

  isSomeTargetBeingUnboundFromSighting(sighting) {
    return _.isNull(sighting.getIn(['pending', 'target']))
  }

  isSomeTargetPendingForSighting(sighting) {
    return !_.isNil(sighting.getIn(['pending', 'target']))
  }

  isTargetBoundToSightingBeingChanged(sighting) {
    return !_.isUndefined(sighting.getIn(['pending', 'target']))
  }

  isTargetPendingForSighting(target, sighting) {
    return (
      sighting.getIn(['pending', 'target', 'id']) === target.get('id') &&
      sighting.get('type') === target.get('type')
    )
  }

  isTargetConfirmedForSighting(target, sighting) {
    return (
      sighting.getIn(['target', 'id']) === target.get('id') &&
      sighting.get('type') === target.get('type')
    )
  }

  renderNewTargetButton() {
    return (
      <div className="new-target target card" onClick={this.createNewTarget}>
        + New Target
      </div>
    )
  }

  createNewTarget() {
    const creator = {
      id: JSON.parse(localStorage.getItem(AUTH_TOKEN_ID)).id,
      username: JSON.parse(localStorage.getItem(AUTH_TOKEN_ID)).username,
      address: JSON.parse(localStorage.getItem(AUTH_TOKEN_ID)).address,
      userType: JSON.parse(localStorage.getItem(AUTH_TOKEN_ID)).userType,
    }

    const target = fromJS({
      type: 'alphanum',
      creator: creator,
      shape: '',
      shapeColor: '',
      alpha: '',
      alphaColor: '',
      thumbnailTsid: 0,
      offaxis: false,
      localId: Math.random() + ':' + Math.random() + ':' + Math.random(),
    })
    //adds the target to the state/store (local)
    this.props.addTarget(target)
  }

  updateMergeTargetNum() {

  }
}

const mapStateToProps = (state) => ({
  sightings: state.targetSightingReducer.get('saved'),
  savedTargets: state.targetReducer.get('saved'),
  localTargets: state.targetReducer.get('local'),
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  updateTargetSighting: TargetSightingOperations.updateTargetSighting(dispatch),
  addTarget: TargetOperations.addTarget(dispatch),
  getAllSightings: TargetSightingOperations.getAllSightings(dispatch),
  getAllTargets: TargetOperations.getAllTargets(dispatch),
  deleteSavedTargetSighting: TargetSightingOperations.deleteSavedTargetSighting(dispatch),
  deleteUnsavedTargetSighting: TargetSightingOperations.deleteUnsavedTargetSighting(dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Merge)
