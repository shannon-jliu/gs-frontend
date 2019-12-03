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
 * @property {List<TargetSighting>} sightings provided by Redux
 * @property {boolean}  dragging
 * @property {Function} onDragEnd 
 * @property {Function} onDragEnd
 */

/**
 * @extends Component<MergeSightingClusterProperties>
 */
class MergeSightingCluster extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { cluster, dragging, sightings } = this.props
    const shape = _.capitalize(cluster.get('shape'))
    const shapeColor = _.capitalize(cluster.get('shapeColor'))
    const alpha = _.capitalize(cluster.get('alpha'))
    const alphaColor = _.capitalize(cluster.get('alphaColor'))

    return (
      <div
        className="cluster"
        style={dragging ? { opacity: 0.15 } : {}}>
        <ul className="cluster-attributes">
          <li>
            <span className="caption">Shape</span>
            <p>{shapeColor} {shape}</p>
          </li>
          <li>
            <span className="caption">Alpha</span>
            <p>{alphaColor} {alpha}</p>
          </li>
        </ul>
        <ul className="cluster-sightings">
          {sightings.map(s => <MergeSightingPreview
            isThumbnail={false}
            isMerged={false}
            sighting={s}
            onDragStart={onDragStart === undefined ? undefined : () => onDragStart(sighting)}
            onDragEnd={onDragEnd}
            dragging={dragging} />
          )}
        </ul>
      </div>
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
  sightings: state.targetSightingReducer.saved.filter(ts => ts.clusterId === props.cluster.id)
}))(MergeSightingCluster)
