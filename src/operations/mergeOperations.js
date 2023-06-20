import { fromJS } from 'immutable'
import * as action from '../actions/mergeActionCreator.js'


const MergeOperations = {
  setSelectedTsids: (dispatch) => (targetId, sightingType, tsids) => {
    dispatch(action.setSelectedTsids(targetId, sightingType, tsids))
  },
  addSelectedTsid: (dispatch) => (targetId, sightingType,targetSighting) =>{
    dispatch(action.addSelectedTsid(targetId, sightingType, targetSighting))
  },
  removeSelectedTsid: (dispatch) => (targetId, sightingType,targetSighting) =>{
    dispatch(action.removeSelectedTsid(targetId, sightingType, targetSighting))
  },
  updateGeotag: (dispatch) => (targetId, geotag) =>{
    dispatch(action.updateGeotag(targetId, geotag))
  }
}

export default MergeOperations
