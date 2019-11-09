import reducer from '../../reducers/targetSightingClusterReducer.js'
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
    'alpha': 'G',
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
    'alpha': 'G',
    'localTargetId': '1',
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
    'color': 'green',
    'shape': 'star',
    'alpha': 'K',
    'localTargetId': '2',
    'assignment': {
      'id': 27,
      'image': {
        'id': 7,
        'imageUrl': '/api/v1/image/file/7.jpeg'
      }
    }
  })

  const localCluster1 = fromJS({ items: [sts1, sts3], localTargetId: '1' })
  const localCluster2 = fromJS({ items: [sts2], localTargetId: '2' })

  const savedCluster1 = fromJS({ items: [sts1, sts3], localTargetId: '1' })
  const savedCluster2 = fromJS({ items: [sts2], localTargetId: '2' })

  const populatedState = fromJS({
    local: List.of(localCluster1, localCluster2),
    saved: List.of(savedCluster1, savedCluster2)
  })

  describe('ADD_TARGET_SIGHTING_CLUSTERS_FROM_SERVER', () => {
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
