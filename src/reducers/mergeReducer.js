import { fromJS } from 'immutable'



const initialState = fromJS({
  selectedTsids: {},
  geotags: {}
})

const mergeReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'SET_SELECTED_TSIDS':
    return setSelectedTsids(state, action.targetId, action.sightingType, action.selectedTsids)
    case 'ADD_SELECTED_TSID':
      return addSelectedTsid(state, action.targetId, action.sightingType, action.targetSighting)
    case 'REMOVE_SELECTED_TSID':
      return removeSelectedTsid(state, action.targetId, action.sightingType, action.targetSighting)
    case 'UPDATE_GEOTAG':
      return updateGeotag(state, action.targetId, action.geotag)
    default:
    return state
  }
}

function updateGeotag(state, targetId, geotag){
  return state.set('geotags',  
    {...state.get('geotags'), [targetId]: {longitude: geotag['longitude'], latitude: geotag['latitude']}} )
}

function setSelectedTsids(state, targetId, sightingType, selectedTsids) {
  const newState = {...state.get('selectedTsids'), [targetId]: {[sightingType]: selectedTsids}}
  const oldTargetState = targetId in state.get('selectedTsids')? state.get('selectedTsids')[targetId] : {}
  console.log("new state", newState)
  return state.set('selectedTsids', {...state.get('selectedTsids'), [targetId]: {...oldTargetState , [sightingType]: selectedTsids}})
}

const getRelatedSelectedTsids = (state, targetId, sightingType, ts) =>{
  if (targetId in state.get('selectedTsids')){
    if (sightingType in state.get('selectedTsids')[targetId]){
      return state.get('selectedTsids')[targetId][sightingType]
    }
  }
  return []
}

function addSelectedTsid(state, targetId, sightingType, targetSighting) {
  const sightingId = targetSighting.get('id')
  const selectedIds = getRelatedSelectedTsids(state, targetId, sightingType, targetSighting)
  if (selectedIds.includes(sightingId)){
    return state
  }
  const newSelectedTsids = [...selectedIds || [], sightingId]
  const oldTargetState = targetId in state.get('selectedTsids')? state.get('selectedTsids')[targetId] : {}
  const newState = {...state.get('selectedTsids'), [targetId]: {...oldTargetState , [sightingType]: newSelectedTsids}}
  return state.set('selectedTsids', {...newState})
}

function removeSelectedTsid(state, targetId, sightingType, targetSighting) {
  const sightingId = targetSighting.get('id')
  const selectedIds = getRelatedSelectedTsids(state, targetId, sightingType, targetSighting)
  if (!selectedIds.includes(sightingId)){
    return state
  }
  const newSelectedTsids = [...(selectedIds.filter(id => id !== sightingId))]
  const oldTargetState = targetId in state.get('selectedTsids')? state.get('selectedTsids')[targetId] : {}
  const newState = {...state.get('selectedTsids'), [targetId]: {...oldTargetState , [sightingType]: newSelectedTsids}}
  return state.set('selectedTsids', {...newState})
}

export default mergeReducer
