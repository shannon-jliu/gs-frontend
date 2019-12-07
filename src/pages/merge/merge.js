import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fromJS, List } from 'immutable'
import _ from 'lodash'

import MergeSightingCluster from './mergeSightingCluster'
import MergeTarget from './mergeTarget'
import TargetSightingOperations from '../../operations/targetSightingOperations'
import TargetSightingClusterOperations from '../../operations/targetSightingClusterOperations'
import TargetOperations from '../../operations/targetOperations'

import './merge.css'

export class Merge extends Component {
  constructor(props) {
    super(props)

    this.state = {
      dragSighting: null
    }

    this.newTarget = this.newTarget.bind(this)
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

  renderTarget(target, assignedClusters) {
    const boundClusters = _.isNil(target.get('id')) ?
      List() :
      assignedClusters.filter(c => {
        if (c.get('type') !== target.get('type')) return false
        return c.hasIn(['pending', 'targetId']) === target.get('id') || c.get('targetId') === target.get('id')
      })

    return (
      <MergeTarget
        key={(target.get('id') || target.get('localId')) + '-target-' + target.get('type')}
        target={target}
        clusters={boundClusters}
      />
    )
  }

  render() {
    const isAssigned = cluster => {
      if (cluster.get('type') !== 'alphanum') {
        // cluster is for emergent target
        return true
      }

      // pending target overrides base target
      const target = cluster.getIn(['pending', 'targetId']) || cluster.get('targetId') || null
      return !_.isNil(target)
    }

    const unassignedClusters = this.props.clusters.filterNot(isAssigned)
    const assignedClusters = this.props.clusters.filter(isAssigned)

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
        <ul className='merge-clusters'>
          {unassignedClusters.map(cluster => (<MergeSightingCluster
            key={cluster.id}
            cluster={cluster}
          />))}
        </ul>
        <div className='targets'>
          {sortedTargets
            .map(t => this.renderTarget(t, assignedClusters))
            .concat(this.props.localTargets.map(this.renderTarget))
            .toJSON()}
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
  clusters: state.targetSightingClusterReducer,
  savedTargets: state.targetReducer.get('saved'),
  localTargets: state.targetReducer.get('local')
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  updateTargetSighting: TargetSightingOperations.updateTargetSighting(dispatch),
  addTarget: TargetOperations.addTarget(dispatch),
  getAllSightings: TargetSightingOperations.getAllSightings(dispatch),
  getAllTargets: TargetOperations.getAllTargets(dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(Merge)
