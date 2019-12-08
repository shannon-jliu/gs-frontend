import React, { Component } from 'react'
import { connect } from 'react-redux'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { fromJS, List } from 'immutable'
import _ from 'lodash'
import classNames from 'classnames'

import TargetSightingClusterOperations from '../../operations/targetSightingClusterOperations'

import MergeSightingCluster from './mergeSightingCluster'

export class MergeSidebar extends Component {
  constructor(props) {
    super(props)

    this.state = { dragHover: 0 }

    this.onDragEnter = this.onDragEnter.bind(this)
    this.onDragOver = this.onDragOver.bind(this)
    this.onDragLeave = this.onDragLeave.bind(this)
    this.onDrop = this.onDrop.bind(this)
  }

  onDragEnter(e) {
    // can't inspect the actual contents of event until drop() due to security restrictions
    // https://stackoverflow.com/questions/28487352/dragndrop-datatransfer-getdata-empty
    // so just check mime type
    if (!e.dataTransfer.types.includes('application/json+cluster'))
      return

    // increment counter for child element
    this.setState({ dragHover: this.state.dragHover + 1 })

    e.preventDefault()
  }

  onDragOver(e) {
    if (!e.dataTransfer.types.includes('application/json+cluster'))
      return

    e.preventDefault()
  }

  onDragLeave(e) {
    this.setState({ dragHover: this.state.dragHover - 1 })
  }

  onDrop(e) {
    if (!e.dataTransfer.types.includes('application/json+cluster')) return

    const data = e.dataTransfer.getData('application/json+cluster')
    if (_.isEmpty(data)) return

    const cluster = fromJS(JSON.parse(data))
    if (_.isNil(cluster)) return

    e.preventDefault()

    this.setState({ dragHover: 0 })
    this.props.updateCluster(cluster, { targetId: null })
  }

  render() {
    const clusters = this.props.clusters

    return (<aside className='merge-sidebar'
      onDragEnter={this.onDragEnter}
      onDragLeave={this.onDragLeave}
      onDragOver={this.onDragOver}
      onDrop={this.onDrop}>
      <ul className="merge-clusters">
        {clusters.map(cluster => (<MergeSightingCluster
          key={cluster.id}
          cluster={cluster}
        />)).toJSON()}
      </ul>
      <div className={classNames('merge-cluster-drop-overlay',
        { active: this.state.dragHover > 0 || clusters.size === 0 })}>
        {/* we can also use this to display empty state */}
        <p>{this.state.dragHover > 0 ? '✔️' : 'No more clusters to merge.'}</p>
      </div>
    </aside>)
  }
}

MergeSidebar.propTypes = {
  clusters: ImmutablePropTypes.list.isRequired
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  updateCluster: TargetSightingClusterOperations.updateCluster(dispatch),

})

export default connect(null, mapDispatchToProps)(MergeSidebar)