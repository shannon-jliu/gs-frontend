import reducer from '../../reducers/imageReducer.js'
import * as matchers from 'jest-immutable-matchers'
import {fromJS} from 'immutable'

describe('imageReducer', () => {
  // this enables us to use toEqualImmutable
  beforeEach(function () {
    jest.addMatchers(matchers);
  });

  const initState = fromJS({
    all: {},
    recent: {
      timestamp: -1
    }
  })

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqualImmutable(fromJS(initState))
  })

  describe('RECEIVE_IMAGE', () => {
    const firstImg = {
      "id": 1,
      "timestamp": 5,
      "state": null,
      "imageUrl": "/api/v1/image/file/5.jpeg",
      "telemetryData": null,
      "gimbalView": null
    }
    it('should handle RECEIVE_IMAGE', () => {
      expect(
        reducer(
          initState,
          {
            type: 'RECEIVE_IMAGE',
            img: firstImg,
          })
      ).toEqualImmutable(
        fromJS({
          all: {
            1: firstImg,
          },
          recent: firstImg,
        })
      )
    })

    it('should update recent img on RECEIVE_IMAGE', () => {
      const secondImg = {
        "id": 2,
        "timestamp": 6,
        "state": null,
        "imageUrl": "/api/v1/image/file/6.jpeg",
        "telemetryData": null,
        "gimbalView": null
      }

      expect(
        reducer(
          fromJS({
            all: {
              1: firstImg,
            },
            recent: firstImg,
          }),
          {
            type: 'RECEIVE_IMAGE',
            img: secondImg,
          })
      ).toEqualImmutable(
        fromJS({
          all: {
            1: firstImg,
            2: secondImg,
          },
          recent: secondImg,
        })
      )
    })

    it('should not update recent img on RECEIVE_IMAGE', () => {
      const secondImg = {
        "id": 2,
        "timestamp": 2,
        "state": null,
        "imageUrl": "/api/v1/image/file/2.jpeg",
        "telemetryData": null,
        "gimbalView": null
      }

      expect(
        reducer(
          fromJS({
            all: {
              1: firstImg,
            },
            recent: firstImg,
          }),
          {
            type: 'RECEIVE_IMAGE',
            img: secondImg,
          })
      ).toEqualImmutable(
        fromJS({
          all: {
            1: firstImg,
            2: secondImg,
          },
          recent: firstImg,
        })
      )
    })
  })
})
