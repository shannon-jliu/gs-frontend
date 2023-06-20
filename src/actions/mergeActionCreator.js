export const setSelectedTsids = (targetId, sightingType, selectedTsids) => ({
  type: 'SET_SELECTED_TSIDS',
  targetId,
  sightingType,
  selectedTsids
})


export const addSelectedTsid = (targetId, sightingType, targetSighting) => ({
  type: 'ADD_SELECTED_TSID',
  targetId,
  sightingType,
  targetSighting,
})

export const removeSelectedTsid = (targetId, sightingType, targetSighting) => ({
  type: 'REMOVE_SELECTED_TSID',
  targetId,
  sightingType,
  targetSighting,
})

export const updateGeotag = (targetId, geotag) => ({
  type: 'UPDATE_GEOTAG',
  targetId,
  geotag,
})
