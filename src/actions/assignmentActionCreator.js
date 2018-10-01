export const receiveNewAssignment = assignment => ({
  type: 'GET_NEW_ASSIGNMENT_SUCCESS',
  assignment
})

export const startLoading = () => ({
  type: 'GET_NEW_ASSIGNMENT_STARTED'
})

export const finishLoading = () => ({
  type: 'GET_NEW_ASSIGNMENT_FAILED'
})

export const setActive = index => ({
  type: 'SET_ACTIVE_ASSIGNMENT',
  index
})
