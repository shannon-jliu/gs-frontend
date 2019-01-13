export const addTarget = target => ({
  type: 'ADD_TARGET',
  target
})

export const deleteTarget = target => ({
  type: 'DELETE_TARGET',
  target
})

export const startSaveTarget = localId => ({
  type: 'START_SAVE_TARGET',
  localId
})

export const succeedSaveTarget = (target, localId) => ({
  type: 'SUCCEED_SAVE_TARGET',
  target,
  localId
})

export const failSaveTarget = localId => ({
  type: 'FAIL_SAVE_TARGET',
  localId
})

export const startUpdateTarget = (target, attribute) => ({
  type: 'START_UPDATE_TARGET',
  target,
  attribute
})

export const succeedUpdateTarget = (target, attribute) => ({
  type: 'SUCCEED_UPDATE_TARGET',
  target,
  attribute
})

export const failUpdateTarget = (target, attribute) => ({
  type: 'FAIL_UPDATE_TARGET',
  target,
  attribute
})

export const addTargetsFromServer = targets => ({
  type: 'ADD_TARGETS_FROM_SERVER',
  targets
})
