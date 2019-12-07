import { fromJS } from 'immutable'
import _ from 'lodash'

import * as action from '../actions/targetSightingClusterActionCreator.js'

const TargetSightingClusterOperations = {
  updateCluster: dispatch => (target, attribute) => {
    dispatch(action.startUpdateTargetSightingCluster(target, attribute))
    // TODO: implement sending actual information
    dispatch(action.succeedUpdateTargetSightingCluster(target.merge(attribute), attribute))
  }
}

export default TargetSightingClusterOperations