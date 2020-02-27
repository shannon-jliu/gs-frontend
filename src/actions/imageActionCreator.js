export const receiveImage = img => ({
  type: 'RECEIVE_IMAGE',
  img
})

export const preloadImage = img => ({
  type: 'PRELOAD_IMAGE',
  img
})

export const clearState = () => ({
  type: 'CLEAR_STATE'
})
