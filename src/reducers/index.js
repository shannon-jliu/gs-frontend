import { combineReducers } from 'redux'

// import other reducers here
import imageReducer from './imageReducer.js'
import assignmentReducer from './assignmentReducer.js'
import targetReducer from './targetReducer.js'
import mergeReducer from './mergeReducer.js'
import targetSightingReducer from './targetSightingReducer.js'
import cameraReducer from './cameraReducer.js'
import cameraGimbalReducer from './cameraGimbalReducer.js'
import gimbalSettingsReducer from './gimbalSettingsReducer.js'
import fiveTargetsReducer from './fiveTargetsReducer.js'
import utilReducer from './utilReducer.js'
import thumbnailReducer from './thumbnailReducer.js'

export default combineReducers({
  imageReducer,
  targetSightingReducer,
  assignmentReducer,
  targetReducer,
  mergeReducer,
  cameraReducer,
  cameraGimbalReducer,
  gimbalSettingsReducer,
  fiveTargetsReducer,
  utilReducer,
  thumbnailReducer,
})
