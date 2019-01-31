import reducer from '../../reducers/gimbalReducer.js'
import * as matchers from 'jest-immutable-matchers'
import {fromJS} from 'immutable'

describe('gimbalReducer', () => {
  // this enables us to use toEqualImmutable
  beforeEach(function () {
    jest.addMatchers(matchers)
  })

  const initState = fromJS({
    settings: {
      timestamp: -1
    },
    pending: {}
  })

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqualImmutable(fromJS(initState))
  })

  describe('RECEIVE_GIMBAL_SETTINGS', () => {
    const settings = fromJS({
      'id': 1,
      'timestamp': 1443826874918,
      'mode': 'retract',
      'gps': null,
      'orientation': null
    })

    it('should handle from the initial state', () => {
      expect(
        reducer(
          initState,
          {
            type: 'RECEIVE_GIMBAL_SETTINGS',
            settings: settings,
          })
      ).toEqualImmutable(
        fromJS({
          settings,
          pending: {}
        })
      )
    })

    it('should update only on a greater timestamp', () => {
      const sndSettings =  fromJS({
        'id': 1,
        'timestamp': 1443826874919,
        'mode': 'retract',
        'gps': null,
        'orientation': null
      })

      const startingState = fromJS({
        settings,
        pending: {}
      })

      expect(
        reducer(
          startingState,
          {
            type: 'RECEIVE_GIMBAL_SETTINGS',
            settings: sndSettings,
          })
      ).toEqualImmutable(
        fromJS({
          settings: {
            'id': 1,
            'timestamp': 1443826874919,
            'mode': 'retract',
            'gps': null,
            'orientation': null
          },
          pending: {}
        })
      )
    })

    it('should not update if the timestamp is less', () => {
      const sndSettings = fromJS({
        'id': 1,
        'timestamp': 1443826874917,
        'mode': 'retract',
        'gps': null,
        'orientation': null
      })

      const startingState = fromJS({
        settings,
        pending: {}
      })

      expect(
        reducer(
          startingState,
          {
            type: 'RECEIVE_GIMBAL_SETTINGS',
            settings: sndSettings,
          })
      ).toEqualImmutable(
        fromJS({
          settings: {
            'id': 1,
            'timestamp': 1443826874918,
            'mode': 'retract',
            'gps': null,
            'orientation': null
          },
          pending: {}
        })
      )
    })
  })

  describe('UPDATE_GIMBAL_SETTINGS_SUCCESS', () => {
    const settings = fromJS({
      'id': 1,
      'timestamp': 1443826874918,
      'mode': 'retract',
      'gps': null,
      'orientation': null
    })

    it('should handle from the initial state', () => {
      expect(
        reducer(
          initState,
          {
            type: 'UPDATE_GIMBAL_SETTINGS_SUCCESS',
            settings: settings,
          })
      ).toEqualImmutable(
        fromJS({
          settings,
          pending: {}
        })
      )
    })

    it('should set pending to empty', () => {
      const settings = fromJS({
        'id': 1,
        'timestamp': 1443826874919,
        'mode': 'retract',
        'gps': null,
        'orientation': null
      })

      const startingState = fromJS({
        settings: {
          timestamp: -1
        },
        pending: settings
      })

      expect(
        reducer(
          startingState,
          {
            type: 'UPDATE_GIMBAL_SETTINGS_SUCCESS',
            settings: settings,
          })
      ).toEqualImmutable(
        fromJS({
          settings: {
            'id': 1,
            'timestamp': 1443826874919,
            'mode': 'retract',
            'gps': null,
            'orientation': null
          },
          pending: {}
        })
      )
    })
  })

  describe('UPDATE_GIMBAL_SETTINGS_STARTED', () => {
    const settings = fromJS({
      'id': 1,
      'timestamp': 1443826874918,
      'mode': 'retract',
      'gps': null,
      'orientation': null
    })

    it('should handle from the initial state', () => {
      expect(
        reducer(
          initState,
          {
            type: 'UPDATE_GIMBAL_SETTINGS_STARTED',
            settings: settings,
          })
      ).toEqualImmutable(
        fromJS({
          settings:{
            timestamp: -1
          },
          pending: {
            'id': 1,
            'timestamp': 1443826874918,
            'mode': 'retract',
            'gps': null,
            'orientation': null
          }
        })
      )
    })

    it('should set pending', () => {
      const settings = fromJS({
        'id': 1,
        'timestamp': 1443826874919,
        'mode': 'retract',
        'gps': null,
        'orientation': null
      })

      expect(
        reducer(
          fromJS({
            settings: {
              'id': 1,
              'timestamp': 1443826874919,
              'mode': 'retract',
              'gps': null,
              'orientation': null
            },
            pending: settings
          }),
          {
            type: 'UPDATE_GIMBAL_SETTINGS_STARTED',
            settings: settings,
          })
      ).toEqualImmutable(
        fromJS({
          settings: {
            'id': 1,
            'timestamp': 1443826874919,
            'mode': 'retract',
            'gps': null,
            'orientation': null
          },
          pending: {
            'id': 1,
            'timestamp': 1443826874919,
            'mode': 'retract',
            'gps': null,
            'orientation': null
          }
        })
      )
    })
  })

  describe('UPDATE_GIMBAL_SETTINGS_FAILED', () => {
    const settings = fromJS({
      'id': 1,
      'timestamp': 1443826874918,
      'mode': 'retract',
      'gps': null,
      'orientation': null
    })

    it('should handle from the initial state', () => {
      expect(
        reducer(
          initState,
          {
            type: 'UPDATE_GIMBAL_SETTINGS_FAILED',
            settings: settings,
          })
      ).toEqualImmutable(
        initState
      )
    })

    it('should set pending to empty', () => {
      expect(
        reducer(
          fromJS({
            settings: {
              timestamp: -1
            },
            pending: settings
          }),
          {
            type: 'UPDATE_GIMBAL_SETTINGS_FAILED',
            settings: settings,
          })
      ).toEqualImmutable(
        initState
      )
    })
  })

})
