//pass in image to each action
export const receiveImage = (image, id) => ({
  type: 'RECEIVE_IMAGE',
  image,
  id,
})

// export const preloadImage = (image) => ({
//   type: "PRELOAD_IMAGE",
//   image,
// });
export const clearState = () => ({
  type: 'CLEAR_STATE',
})
