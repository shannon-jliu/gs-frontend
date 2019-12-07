import { fromJS } from 'immutable'
import _ from 'lodash'

import * as action from '../actions/targetSightingClusterActionCreator.js'

const TargetSightingClusterOperations = {
  dummyCluster: dispatch => {
    console.log('hi1')
    return () => {
      console.log('hi')
      dispatch(action.dummyCluster({
        type: 'alphanum',
        alpha: 'K',
        alphaColor: 'blue',
        shape: 'pentagon',
        shapeColor: 'yellow'
      }))
    }
  }
}

export default TargetSightingClusterOperations