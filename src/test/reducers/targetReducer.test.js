import reducer from '../../reducers/targetReducer.js'
import * as matchers from 'jest-immutable-matchers'
import {fromJS} from 'immutable'

describe('targetReducer', () => {
  // this enables us to use toEqualImmutable
  beforeEach(function () {
    jest.addMatchers(matchers)
  })

  const initState = fromJS({
    local: [],
    saved: []
  })

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqualImmutable(fromJS(initState))
  })

  //objects shortened to be concise
  const st1 = fromJS({
    'id': 11,
    'type': 'alphanum',
    'color': 'red',
    'shape': 'square'
  })
  const st2 = fromJS({
    'id': 12,
    'type': 'alphanum',
    'color': 'red',
    'shape': 'square'
  })
  const est1 = fromJS({
    'id': 11,
    'type': 'emergent',
    'color': 'red'
  })
  const lt1 = fromJS({
    'localId': '13:14:2353234',
    'type': 'alphanum',
    'color': 'red'
  })
  const lt2 = fromJS({
    'localId': '27:62:024378834',
    'type': 'alphanum',
    'color': 'red'
  })

  describe('ADD_TARGET', () => {
    it('should add to local on ADD_TARGET', () => {
      expect(
        reducer(
          fromJS({
            local: [lt1],
            saved: [st1, est1]
          }),
          {
            type: 'ADD_TARGET',
            target: lt2,
          })
      ).toEqualImmutable(
        fromJS({
          local: [lt1, lt2],
          saved: [st1, est1]
        })
      )
    })
  })

  describe('DELETE_TARGET', () => {
    it('should remove from local on DELETE_TARGET', () => {
      expect(
        reducer(
          fromJS({
            local: [lt1],
            saved: [st1, est1]
          }),
          {
            type: 'DELETE_TARGET',
            target: lt1
          })
      ).toEqualImmutable(
        fromJS({
          local: [],
          saved: [st1, est1]
        })
      )
    })

    it('should remove from saved on DELETE_TARGET', () => {
      expect(
        reducer(
          fromJS({
            local: [lt1],
            saved: [st1, est1]
          }),
          {
            type: 'DELETE_TARGET',
            target: st1,
          })
      ).toEqualImmutable(
        fromJS({
          local: [lt1],
          saved: [est1]
        })
      )
    })

    it('should not remove when DELETE_TARGET is called for a target that doesn\'t exist', () => {
      expect(
        reducer(
          fromJS({
            local: [lt1],
            saved: [st1, st2]
          }),
          {
            type: 'DELETE_TARGET',
            target: est1,
          })
      ).toEqualImmutable(
        fromJS({
          local: [lt1],
          saved: [st1, st2]
        })
      )
    })
  })

  describe('START_SAVE_TARGET', () => {
    it('should start to save local target', () => {
      expect(
        reducer(
          fromJS({
            local: [lt1, lt2],
            saved: [st1, est1]
          }),
          {
            type: 'START_SAVE_TARGET',
            localId: lt1.get('localId')
          })
      ).toEqualImmutable(
        fromJS({
          local: [lt1.set('pending', fromJS({})), lt2],
          saved: [st1, est1]
        })
      )
    })
  })

  describe('SUCCEED_SAVE_TARGET', () => {
    it('should succeed to save target', () => {
      expect(
        reducer(
          fromJS({
            local: [lt1.set('pending', fromJS({})), lt2],
            saved: [st1, est1]
          }),
          {
            type: 'SUCCEED_SAVE_TARGET',
            target: st2,
            localId: lt1.get('localId')
          })
      ).toEqualImmutable(
        fromJS({
          local: [lt2],
          saved: [st1, est1, st2]
        })
      )
    })
  })

  describe('FAIL_SAVE_TARGET', () => {
    it('should fail to save target', () => {
      expect(
        reducer(
          fromJS({
            local: [lt1.set('pending', fromJS({})), lt2],
            saved: [st1, est1]
          }),
          {
            type: 'FAIL_SAVE_TARGET',
            localId: lt1.get('localId')
          })
      ).toEqualImmutable(
        fromJS({
          local: [lt1, lt2],
          saved: [st1, est1]
        })
      )
    })
  })

  describe('START_UPDATE_TARGET', () => {
    it('should start to update target without pending', () => {
      expect(
        reducer(
          fromJS({
            local: [lt1, lt2],
            saved: [st1, st2, est1]
          }),
          {
            type: 'START_UPDATE_TARGET',
            target: st1,
            attribute: fromJS({color: 'blue'})
          })
      ).toEqualImmutable(
        fromJS({
          local: [lt1, lt2],
          saved: [st1.set('pending', fromJS({color: 'blue'})), st2, est1]
        })
      )
    })

    it('should start to update target with pending', () => {
      expect(
        reducer(
          fromJS({
            local: [lt1, lt2],
            saved: [st1.set('pending', fromJS({shape: 'circle'})), st2, est1]
          }),
          {
            type: 'START_UPDATE_TARGET',
            target: st1,
            attribute: fromJS({color: 'blue'})
          })
      ).toEqualImmutable(
        fromJS({
          local: [lt1, lt2],
          saved: [st1.set('pending', fromJS({color: 'blue', shape: 'circle'})), st2, est1]
        })
      )
    })
  })

  describe('SUCCEED_UPDATE_TARGET', () => {
    it('should succeed to update target with 1 in pending', () => {
      expect(
        reducer(
          fromJS({
            local: [lt1, lt2],
            saved: [st1.set('pending', fromJS({color: 'blue'})), st2, est1]
          }),
          {
            type: 'SUCCEED_UPDATE_TARGET',
            target: st1.merge(fromJS({color: 'blue', newAttrib: true})),
            attribute: fromJS({color: 'blue'})
          })
      ).toEqualImmutable(
        fromJS({
          local: [lt1, lt2],
          saved: [st1.merge(fromJS({color: 'blue', newAttrib: true})), st2, est1]
        })
      )
    })

    it('should start to update target with multiple in pending', () => {
      expect(
        reducer(
          fromJS({
            local: [lt1, lt2],
            saved: [st1.set('pending', fromJS({color: 'blue', shape: 'circle'})), st2, est1]
          }),
          {
            type: 'SUCCEED_UPDATE_TARGET',
            target: st1.merge(fromJS({color: 'blue', newAttrib: true})),
            attribute: fromJS({color: 'blue'})
          })
      ).toEqualImmutable(
        fromJS({
          local: [lt1, lt2],
          saved: [st1.merge(fromJS({color: 'blue', newAttrib: true, pending: {shape: 'circle'}})), st2, est1]
        })
      )
    })
  })

  describe('FAIL_UPDATE_TARGET', () => {
    it('should fail to update target with 1 in pending', () => {
      expect(
        reducer(
          fromJS({
            local: [lt1, lt2],
            saved: [st1.set('pending', fromJS({color: 'blue'})), st2, est1]
          }),
          {
            type: 'FAIL_UPDATE_TARGET',
            target: st1.set('shape', 'circle'),
            attribute: fromJS({color: 'blue'})
          })
      ).toEqualImmutable(
        fromJS({
          local: [lt1, lt2],
          saved: [st1, st2, est1]
        })
      )
    })

    it('should start to update target with multiple in pending', () => {
      expect(
        reducer(
          fromJS({
            local: [lt1, lt2],
            saved: [st1.set('pending', fromJS({color: 'blue', shape: 'circle'})), st2, est1]
          }),
          {
            type: 'FAIL_UPDATE_TARGET',
            target: st1.set('shape', 'circle'),
            attribute: fromJS({color: 'blue'})
          })
      ).toEqualImmutable(
        fromJS({
          local: [lt1, lt2],
          saved: [st1.set('pending', fromJS({shape: 'circle'})), st2, est1]
        })
      )
    })
  })

  describe('ADD_TARGETS_FROM_SERVER', () => {
    it('should add targets from server', () => {
      expect(
        reducer(
          fromJS({
            local: [lt1, lt2],
            saved: [st1.merge(fromJS({pending: {shape: 'circle'}, color: 'blue'})), est1]
          }),
          {
            type: 'ADD_TARGETS_FROM_SERVER',
            targets: fromJS([est1, st2, st1]),
          })
      ).toEqualImmutable(
        fromJS({
          local: [lt1, lt2],
          saved: [est1, st2, st1.set('pending', fromJS({shape: 'circle'}))]
        })
      )
    })
  })
})
