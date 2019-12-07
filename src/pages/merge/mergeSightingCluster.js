import * as _ from 'lodash'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import ImmutablePropTypes from 'react-immutable-proptypes'
import PropTypes from 'prop-types'

import { Map, List } from 'immutable'
import { TargetSightingCluster } from '../../reducers/targetSightingClusterReducer.js'
import { TargetSighting } from '../../reducers/targetSightingReducer'

import MergeSightingPreview from './mergeSightingPreview.js'

/**
 * @typedef MergeSightingClusterProperties
 * @property {Map<keyof TargetSightingCluster, any>} cluster
 * @property {List<TargetSighting>} sightings
 */

/**
 * @extends Component<MergeSightingClusterProperties>
 */
class MergeSightingCluster extends Component {
  constructor(props) {
    super(props)

    this.onDragStart = this.onDragStart.bind(this)
  }

  /**
   * @param {DragEvent} ev 
   */
  onDragStart(ev) {
    ev.dataTransfer.setData('application/json+cluster', JSON.stringify(this.props.cluster.toJS()))
    ev.dataTransfer.dropEffect = 'move'
  }

  render() {
    const { cluster, dragging, sightings } = this.props
    const shape = _.capitalize(cluster.get('shape'))
    const shapeColor = _.capitalize(cluster.get('shapeColor'))
    const alpha = _.capitalize(cluster.get('alpha'))
    const alphaColor = _.capitalize(cluster.get('alphaColor'))

    return (
      <li
        className="merge-cluster"
        style={dragging ? { opacity: 0.15 } : {}}
        draggable
        onDragStart={this.onDragStart}>
        <ul className="merge-cluster-attributes">
          <li>
            <label>Shape</label>
            <br />
            <span>{shapeColor} {shape}</span>
          </li>
          <li>
            <label>Alpha</label>
            <br />
            <span>{alphaColor} {alpha}</span>
          </li>
        </ul>
        <ul className="merge-cluster-sightings">
          {sightings.map(s => <li>
            <MergeSightingPreview
              isThumbnail={false}
              isMerged={false}
              sighting={s} />
          </li>
          )}
        </ul>
      </li>
    )
  }
}

MergeSightingCluster.propTypes = {
  cluster: ImmutablePropTypes.map.isRequired,
  dragging: PropTypes.bool.isRequired,
  onDragStart: PropTypes.func,
  onDragEnd: PropTypes.func
}

export default connect((state, props) => ({
  // retrieve sightings corresponding to this cluster from the store
  sightings: state.targetSightingReducer.get('saved').filter(ts => ts.clusterId === props.cluster.id),
  target: state.targetReducer.get('saved').find(t => t.id === props.cluster.id)
}))(MergeSightingCluster)
