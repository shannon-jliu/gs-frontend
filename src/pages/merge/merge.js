import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fromJS } from 'immutable'
import _ from 'lodash'

import MergeSighting from './mergeSighting'
import MergeTarget from './mergeTarget'
import TargetSightingOperations from '../../operations/targetSightingOperations'
import TargetOperations from '../../operations/targetOperations'

import './merge.css'

export class Merge extends Component {
  constructor(props){
    super(props)

    this.state = {
      dragSighting: null
    }

    this.newTarget = this.newTarget.bind(this)
    this.onDragStart = this.onDragStart.bind(this)
    this.onDragEnd = this.onDragEnd.bind(this)
    this.onDrop = this.onDrop.bind(this)
    this.renderSighting = this.renderSighting.bind(this)
    this.renderTarget = this.renderTarget.bind(this)
  }

  componentDidMount() {
    const loadNewestContent = () => {
      this.props.getAllTargets()
      this.props.getAllSightings()
    }
    this.contentLoader = setInterval(loadNewestContent, 5000)
  }

  componentWillUnmount() {
    clearInterval(this.contentLoader)
  }

  newTarget() {
    const target = fromJS({
      type: 'alphanum',
      creator: 'MDLC',
      shape: '',
      shapeColor: '',
      alpha: '',
      alphaColor: '',
      thumbnailTSId: 0,
      offaxis: false,
      localId: Math.random() + ':' + Math.random() + ':' + Math.random()
    })
    this.props.addTarget(target)
  }

  onDragStart(sighting) {
    this.setState({
      dragSighting: sighting
    })
  }

  onDragEnd() {
    if (!_.isNil(this.state.dragSighting) && !_.isNil(this.state.dragSighting.get('target'))) {
      this.props.updateTargetSighting(this.state.dragSighting, fromJS({target: null}))
    }
    this.setState({
      dragSighting: null
    })
  }

  onDrop(target) {
    if (target.has('id')) {
      const dragTgt = _.isNull(this.state.dragSighting.getIn(['pending', 'target'])) ? undefined :
        (this.state.dragSighting.getIn(['pending', 'target']) || this.state.dragSighting.get('target'))
      if (_.isNil(dragTgt) || dragTgt.get('id') !== target.get('id')) {
        this.props.updateTargetSighting(this.state.dragSighting, fromJS({target}))
      }
    }
    this.setState({
      dragSighting: null
    })
  }

  renderSighting(sighting) {
    const isDragging = !_.isNil(this.state.dragSighting) &&
        sighting.get('id') === this.state.dragSighting.get('id')

    return (
      <MergeSighting
        key={sighting.get('id') + '-sighting-info'}
        sighting={sighting}
        onDragStart={() => this.onDragStart(sighting)}
        onDragEnd={this.onDragEnd}
        dragging={isDragging}
      />
    )
  }

  renderTarget(target, assignedSightings) {
    const boundSightings = target.has('id') ?
      assignedSightings.filter(s => {
        if (s.hasIn(['pending', 'target'])) {
          //if pending.target === null, this will return false
          return s.getIn(['pending', 'target', 'id']) === target.get('id') && s.get('type') === target.get('type')
        } else {
          return s.getIn(['target', 'id']) === target.get('id') && s.get('type') === target.get('type')
        }
      })
      : fromJS([])

    const dragId = _.isNil(this.state.dragSighting) ? undefined
      : this.state.dragSighting.get('id')

    return (
      <MergeTarget
        key={(target.get('id') || target.get('localId')) + '-target-' + target.get('type')}
        target={target}
        sightings={boundSightings}
        onTsDragStart={this.onDragStart}
        onTsDragEnd={this.onDragEnd}
        onTsDrop={this.onDrop}
        dragId={dragId}
      />
    )
  }

  render() {
    //pending's target overrides the normal target. If pending's target is null, the target is deleted; if pending's target is undefined, there is no override
    //for that reason, this uses both loose and strict equality (!= null checks both - x != null is the same as (x !== null && x !== undefined))
    //It should also be noted that _.isNil() will check both null and undefined equality.
    const isAssigned = ts => (!_.isNil(ts.get('target')) && !_.isNull(ts.getIn(['pending', 'target']))) || !_.isNil(ts.getIn(['pending', 'target']))
    const assignedSightings = this.props.sightings.filter(isAssigned)
    const unassignedSightings = this.props.sightings.filter(ts => ts.get('type') === 'alphanum' && !isAssigned(ts))
    const sortedTargets = this.props.savedTargets.sort((target1, target2) => {
      if (target1.get('type') === 'emergent') {
        return -1
      } else if (target2.get('type') === 'emergent') {
        return 1
      } else {
        return target1.get('id') - target2.get('id')
      }
    })

    return (
      <div className='merge'>
        <div className='sightings'>
          {unassignedSightings.map(this.renderSighting).toJSON()}
        </div>
        <div className='targets'>
          {sortedTargets.map(t => this.renderTarget(t, assignedSightings)).concat(this.props.localTargets.map(this.renderTarget)).toJSON()}
          <div
            className='new-target target card'
            onClick={this.newTarget}
          >
            + New Target
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  sightings: state.targetSightingReducer.get('saved'),
  savedTargets: state.targetReducer.get('saved'),
  localTargets: state.targetReducer.get('local')
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  updateTargetSighting: TargetSightingOperations.updateTargetSighting(dispatch),
  addTarget: TargetOperations.addTarget(dispatch),
  getAllSightings: TargetSightingOperations.getAllSightings(dispatch),
  getAllTargets: TargetOperations.getAllTargets(dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Merge)
