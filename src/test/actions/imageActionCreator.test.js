import {receiveImage} from '../../actions/imageActionCreator.js';

it('should create an action when it receives an img', () => {
  const img = {
    "id": 1,
    "timestamp": 5,
    "state": null,
    "imageUrl": "/api/v1/image/file/5.jpeg",
    "telemetryData": null,
    "gimbalView": null
  }
  const expectedAction = {
    type: 'RECEIVE_IMAGE',
    img
  }
  expect(receiveImage(img)).toEqual(expectedAction)
})
