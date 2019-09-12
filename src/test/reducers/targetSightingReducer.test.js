import reducer from '../../reducers/targetSightingReducer.js'
import * as matchers from 'jest-immutable-matchers'
import { fromJS, merge, List } from 'immutable'

describe('targetSightingReducer', () => {
  beforeEach(function() {
    jest.addMatchers(matchers)
  })

  const initState = fromJS({
    local: List(),
    saved: List()
  })

  //objects shortened to be concise
  const sts1 = fromJS({
    'id': 11,
    'type': 'alphanum',
    'color': 'red',
    'shape': 'square',
    'localTargetId': '1',
    'assignment': {
      'id': 25,
      'image': {
        'id': 5,
        'imageUrl': '/api/v1/image/file/5.jpeg'
      }
    }
  })
  const sts2 = fromJS({
    'id': 12,
    'type': 'alphanum',
    'color': 'red',
    'shape': 'square',
    'localTargetId': '2',
    'assignment': {
      'id': 26,
      'image': {
        'id': 6,
        'imageUrl': '/api/v1/image/file/6.jpeg'
      }
    }
  })
  const sts3 = fromJS({
    'id': 13,
    'type': 'alphanum',
    'color': 'red',
    'localTargetId': '3',
    'assignment': {
      'id': 27,
      'image': {
        'id': 7,
        'imageUrl': '/api/v1/image/file/7.jpeg'
      }
    }
  })
  const lts1 = fromJS({
    'localId': '13:14:2353234',
    'type': 'alphanum',
    'color': 'red',
    'assignment': {
      'id': 28,
      'image': {
        'id': 8,
        'imageUrl': '/api/v1/image/file/8.jpeg'
      }
    }
  })
  const lts2 = fromJS({
    'localId': '27:62:024378834',
    'type': 'alphanum',
    'color': 'red',
    'assignment': {
      'id': 27,
      'image': {
        'id': 7,
        'imageUrl': '/api/v1/image/file/7.jpeg'
      }
    }
  })


  const populatedState = fromJS({
    local: List.of(lts1, lts2),
    saved: List.of(sts1, sts2)
  })
  const assignment1 = fromJS({
    'id': 21,
    'image': {
      'id': 5,
      'imageUrl': '/api/v1/image/file/5.jpeg'
    }
  })

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqualImmutable(fromJS(initState))
  })

  const updatedSighting = sts3.merge({ assignment: assignment1 })

  describe('ADD_TARGET_SIGHTING', () => {
    it('should work on ADD_TARGET_SIGHTING with empty state', () => {
      expect(
        reducer(
          initState, {
            type: 'ADD_TARGET_SIGHTING',
            sighting: sts3,
            assignment: assignment1
          })
      ).toEqualImmutable(
        fromJS({
          local: List.of(updatedSighting),
          saved: List()
        })
      )
    })

    it('should work on ADD_TARGET_SIGHTING with populated state', () => {
      expect(
        reducer(
          populatedState, {
            type: 'ADD_TARGET_SIGHTING',
            sighting: sts3,
            assignment: assignment1
          })
      ).toEqualImmutable(
        fromJS({
          local: populatedState.get('local').push(updatedSighting),
          saved: populatedState.get('saved')
        })
      )
    })
  })

  describe('DELETE_TARGET_SIGHTING', () => {
    it('should delete saved ts', () => {
      expect(
        reducer(
          populatedState, {
            type: 'DELETE_TARGET_SIGHTING',
            sighting: sts1
          })
      ).toEqualImmutable(
        fromJS({
          local: populatedState.get('local'),
          saved: List.of(sts2)
        })
      )
    })

    it('should delete local ts', () => {
      expect(
        reducer(
          populatedState, {
            type: 'DELETE_TARGET_SIGHTING',
            sighting: lts1
          })
      ).toEqualImmutable(
        fromJS({
          local: List.of(lts2),
          saved: populatedState.get('saved')
        })
      )
    })

    it('should not delete saved ts with different type', () => {
      expect(
        reducer(
          populatedState, {
            type: 'DELETE_TARGET_SIGHTING',
            sighting: sts1.set('type', 'emergent')
          })
      ).toEqualImmutable(populatedState)
    })
  })

  describe('START_SAVE_TARGET_SIGHTING', () => {
    it('should start saving ts', () => {
      expect(
        reducer(
          populatedState, {
            type: 'START_SAVE_TARGET_SIGHTING',
            localId: lts1.get('localId')
          })
      ).toEqualImmutable(
        fromJS({
          local: List.of(lts1.set('pending', fromJS({})), lts2),
          saved: populatedState.get('saved')
        })
      )
    })
  })

  describe('SUCCEED_SAVE_TARGET_SIGHTING', () => {
    it('should succeed at saving ts', () => {
      expect(
        reducer(
          populatedState, {
            type: 'SUCCEED_SAVE_TARGET_SIGHTING',
            sighting: lts1.delete('localId').set('id', 14),
            localId: lts1.get('localId')
          })
      ).toEqualImmutable(
        fromJS({
          local: List.of(lts2),
          saved: populatedState.get('saved').push(lts1.delete('localId').set('id', 14))
        })
      )
    })
  })

  describe('FAIL_SAVE_TARGET_SIGHTING', () => {
    it('should fail at saving ts', () => {
      expect(
        reducer(
          populatedState.set('local', List.of(lts1.set('pending', fromJS({})), lts2)), {
            type: 'FAIL_SAVE_TARGET_SIGHTING',
            localId: lts1.get('localId')
          })
      ).toEqualImmutable(populatedState)
    })
  })

  const popState1Attrib = populatedState
    .set('saved', List.of(sts1.set('pending', fromJS({ color: 'blue' })), sts2))
  const popState2Attrib = populatedState
    .set('saved', List.of(sts1.set('pending', fromJS({ color: 'blue', shape: 'circle' })), sts2))

  describe('START_UPDATE_TARGET_SIGHTING', () => {
    it('should start updating ts with no attribute updating', () => {
      expect(
        reducer(
          populatedState, {
            type: 'START_UPDATE_TARGET_SIGHTING',
            sighting: sts1,
            attribute: fromJS({ color: 'blue' })
          })
      ).toEqualImmutable(popState1Attrib)
    })

    it('should start updating ts with attribute updating', () => {
      expect(
        reducer(
          popState1Attrib, {
            type: 'START_UPDATE_TARGET_SIGHTING',
            sighting: sts1.set('pending', fromJS({ color: 'blue' })),
            attribute: fromJS({ shape: 'circle' })
          })
      ).toEqualImmutable(popState2Attrib)
    })
  })

  describe('SUCCEED_UPDATE_TARGET_SIGHTING', () => {
    it('should succeed updating ts for only attribute updating', () => {
      //newAttrib mocks whether it handles other changed values
      const newSts = sts1.merge({ color: 'blue', newAttrib: true })
      expect(
        reducer(
          popState1Attrib, {
            type: 'SUCCEED_UPDATE_TARGET_SIGHTING',
            newSighting: newSts,
            attribute: fromJS({ color: 'blue' })
          })
      ).toEqualImmutable(
        fromJS({
          local: populatedState.get('local'),
          saved: List.of(newSts, sts2)
        })
      )
    })

    it('should succeed updating ts with other attributes updating', () => {
      const newSts = sts1.merge({ shape: 'circle', newAttrib: true })
      expect(
        reducer(
          popState2Attrib, {
            type: 'SUCCEED_UPDATE_TARGET_SIGHTING',
            newSighting: newSts,
            attribute: fromJS({ shape: 'circle' })
          })
      ).toEqualImmutable(
        fromJS({
          local: popState1Attrib.get('local'),
          saved: List.of(newSts.set('pending', fromJS({ color: 'blue' })), sts2)
        })
      )
    })
  })

  describe('FAIL_UPDATE_TARGET_SIGHTING', () => {
    it('should fail updating ts for only attribute updating', () => {
      expect(
        reducer(
          popState1Attrib, {
            type: 'FAIL_UPDATE_TARGET_SIGHTING',
            sighting: sts1,
            attribute: fromJS({ color: 'blue' })
          })
      ).toEqualImmutable(populatedState)
    })

    it('should fail updating ts with other attributes updating', () => {
      expect(
        reducer(
          popState2Attrib, {
            type: 'FAIL_UPDATE_TARGET_SIGHTING',
            sighting: sts1,
            attribute: fromJS({ shape: 'circle' })
          })
      ).toEqualImmutable(popState1Attrib)
    })
  })

  describe('ADD_TARGET_SIGHTINGS_FROM_SERVER', () => {
    it('should add, update, and delete target sightings from server', () => {
      const newPopState = populatedState.set('saved', List.of(
        sts1.set('type', 'emergent'),
        sts1.set('pending', fromJS({ shape: 'circle' })),
        sts2.delete('localTargetId'),
        sts3))
      const newTs = fromJS({
        'id': 14,
        'type': 'alphanum',
        'color': 'red',
        'localTargetId': 4,
        'assignment': {
          'id': 28,
          'image': {
            'id': 8,
            'imageUrl': '/api/v1/image/file/8.jpeg'
          }
        }
      })
      expect(
        reducer(
          newPopState, {
            type: 'ADD_TARGET_SIGHTINGS_FROM_SERVER',
            sightings: List.of(sts1.set('color', 'blue').delete('localTargetId'), sts2.delete('localTargetId'), newTs)
          })
      ).toEqualImmutable(
        fromJS({
          local: populatedState.get('local'),
          saved: List.of(
            sts1.merge({ color: 'blue', pending: fromJS({ shape: 'circle' }) }),
            sts2.delete('localTargetId'),
            newTs)
        })
      )
    })
  })

  describe('DELETE_TARGET', () => {
    it('should delete localTargetId for correct ts', () => {
      const tgt = fromJS({id: 300})
      expect(
        reducer(
          populatedState, {
            type: 'DELETE_TARGET',
            target: fromJS({localId: '1'})
          })
      ).toEqualImmutable(
        fromJS({
          local: populatedState.get('local'),
          saved: List.of(sts1.delete('localTargetId'), sts2)
        })
      )
    })

    it('should not delete saved target', () => {
      const tgt = fromJS({id: 300, type: 'alphanum'})
      const newPopState = populatedState.set('saved', List.of(sts1.delete('localTargetId').set('target', tgt), sts2))
      expect(
        reducer(
          newPopState, {
            type: 'DELETE_TARGET',
            target: tgt
          })
      ).toEqualImmutable(newPopState)
    })
  })

  describe('DELETE_TARGET_FROM_TARGET_SIGHTINGS', () => {
    it('should delete target for correct ts', () => {
      const tgt = fromJS({id: 300, type: 'alphanum'})
      const newPopState = populatedState.set('saved', List.of(sts1.delete('localTargetId').set('target', tgt), sts2))
      expect(
        reducer(
          newPopState, {
            type: 'DELETE_TARGET_FROM_TARGET_SIGHTINGS',
            target: tgt
          })
      ).toEqualImmutable(
        fromJS({
          local: populatedState.get('local'),
          saved: List.of(sts1.delete('localTargetId'), sts2)
        })
      )
    })

    it('should not delete target for different saved type', () => {
      const tgt = fromJS({id: 300, type: 'emergent'})
      const newPopState = populatedState.set('saved', List.of(sts1.delete('localTargetId').set('target', tgt), sts2))
      expect(
        reducer(
          newPopState, {
            type: 'DELETE_TARGET_FROM_TARGET_SIGHTINGS',
            target: tgt
          })
      ).toEqualImmutable(newPopState)
    })
  })
})
