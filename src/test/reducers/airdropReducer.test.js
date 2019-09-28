import reducer from '../../reducers/airdropReducer.js'
import * as matchers from 'jest-immutable-matchers'
import { fromJS } from 'immutable'

describe('airdropReducer', () => {
  // this enables us to use toEqualImmutable
  beforeEach(function () {
    jest.addMatchers(matchers)
  })

  const initState = fromJS({
    settings: {
      timestamp: -1,
      isArmed: false,
      commandDropNow: false,
      gpsTargetLocation: {
        latitude: 0,
        longitude: 0
      },
      acceptableThresholdFt: 0
    },
    pending: {}
  })

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqualImmutable(fromJS(initState))
  })

  describe('RECEIVE_AIRDROP_SETTINGS', () => {
    const settings = fromJS({
      'id': 1,
      'timestamp': 1443826874918,
      'gpsTargetLocation': {
        'latitude': 29.4,
        'longitude': 28.3
      },
      'acceptableThresholdFt': 100,
      'isArmed': false,
      'commandDropNow': false
    })

    it('should handle from the initial state', () => {
      expect(
        reducer(
          initState,
          {
            type: 'RECEIVE_AIRDROP_SETTINGS',
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
      const sndSettings = fromJS({
        'id': 1,
        'timestamp': 1443826874919,
        'gpsTargetLocation': {
          'latitude': 29.4,
          'longitude': 28.3
        },
        'acceptableThresholdFt': 100,
        'isArmed': false,
        'commandDropNow': false
      })

      const startingState = fromJS({
        settings,
        pending: {}
      })

      expect(
        reducer(
          startingState,
          {
            type: 'RECEIVE_AIRDROP_SETTINGS',
            settings: sndSettings,
          })
      ).toEqualImmutable(
        fromJS({
          settings: {
            'id': 1,
            'timestamp': 1443826874919,
            'gpsTargetLocation': {
              'latitude': 29.4,
              'longitude': 28.3
            },
            'acceptableThresholdFt': 100,
            'isArmed': false,
            'commandDropNow': false
          },
          pending: {}
        })
      )
    })

    it('should not update if the timestamp is less', () => {
      const sndSettings = fromJS({
        'id': 1,
        'timestamp': 1443826874917,
        'gpsTargetLocation': {
          'latitude': 29.4,
          'longitude': 28.3
        },
        'acceptableThresholdFt': 100,
        'isArmed': false,
        'commandDropNow': false
      })

      const startingState = fromJS({
        settings,
        pending: {}
      })

      expect(
        reducer(
          startingState,
          {
            type: 'RECEIVE_AIRDROP_SETTINGS',
            settings: sndSettings,
          })
      ).toEqualImmutable(
        fromJS({
          settings: {
            'id': 1,
            'timestamp': 1443826874918,
            'gpsTargetLocation': {
              'latitude': 29.4,
              'longitude': 28.3
            },
            'acceptableThresholdFt': 100,
            'isArmed': false,
            'commandDropNow': false
          },
          pending: {}
        })
      )
    })
  })

  describe('UPDATE_AIRDROP_SETTINGS_SUCCESS', () => {
    const settings = fromJS({
      'id': 1,
      'timestamp': 1443826874918,
      'gpsTargetLocation': {
        'latitude': 29.4,
        'longitude': 28.3
      },
      'acceptableThresholdFt': 100,
      'isArmed': false,
      'commandDropNow': false
    })

    it('should handle from the initial state', () => {
      expect(
        reducer(
          initState,
          {
            type: 'UPDATE_AIRDROP_SETTINGS_SUCCESS',
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
        'gpsTargetLocation': {
          'latitude': 29.4,
          'longitude': 28.3
        },
        'acceptableThresholdFt': 100,
        'isArmed': false,
        'commandDropNow': false
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
            type: 'UPDATE_AIRDROP_SETTINGS_SUCCESS',
            settings: settings,
          })
      ).toEqualImmutable(
        fromJS({
          settings: {
            'id': 1,
            'timestamp': 1443826874919,
            'gpsTargetLocation': {
              'latitude': 29.4,
              'longitude': 28.3
            },
            'acceptableThresholdFt': 100,
            'isArmed': false,
            'commandDropNow': false
          },
          pending: {}
        })
      )
    })
  })

  describe('UPDATE_AIRDROP_SETTINGS_STARTED', () => {
    const settings = fromJS({
      'id': 1,
      'timestamp': 1443826874918,
      'gpsTargetLocation': {
        'latitude': 29.4,
        'longitude': 28.3
      },
      'acceptableThresholdFt': 100,
      'isArmed': false,
      'commandDropNow': false
    })

    it('should handle from the initial state', () => {
      expect(
        reducer(
          initState,
          {
            type: 'UPDATE_AIRDROP_SETTINGS_STARTED',
            settings: settings,
          })
      ).toEqualImmutable(
        fromJS({
          settings:{
            timestamp: -1,
            isArmed: false,
            commandDropNow: false,
            gpsTargetLocation: {
              latitude: 0,
              longitude: 0
            },
            acceptableThresholdFt: 0
          },
          pending: {
            'id': 1,
            'timestamp': 1443826874918,
            'gpsTargetLocation': {
              'latitude': 29.4,
              'longitude': 28.3
            },
            'acceptableThresholdFt': 100,
            'isArmed': false,
            'commandDropNow': false
          }
        })
      )
    })

    it('should set pending', () => {
      const settings = fromJS({
        'id': 1,
        'timestamp': 1443826874919,
        'gpsTargetLocation': {
          'latitude': 29.4,
          'longitude': 28.3
        },
        'acceptableThresholdFt': 100,
        'isArmed': false,
        'commandDropNow': false
      })

      expect(
        reducer(
          fromJS({
            settings: {
              'id': 1,
              'timestamp': 1443826874919,
              'gpsTargetLocation': {
                'latitude': 29.4,
                'longitude': 28.3
              },
              'acceptableThresholdFt': 100,
              'isArmed': false,
              'commandDropNow': false
            },
            pending: settings
          }),
          {
            type: 'UPDATE_AIRDROP_SETTINGS_STARTED',
            settings: settings,
          })
      ).toEqualImmutable(
        fromJS({
          settings: {
            'id': 1,
            'timestamp': 1443826874919,
            'gpsTargetLocation': {
              'latitude': 29.4,
              'longitude': 28.3
            },
            'acceptableThresholdFt': 100,
            'isArmed': false,
            'commandDropNow': false
          },
          pending: {
            'id': 1,
            'timestamp': 1443826874919,
            'gpsTargetLocation': {
              'latitude': 29.4,
              'longitude': 28.3
            },
            'acceptableThresholdFt': 100,
            'isArmed': false,
            'commandDropNow': false
          }
        })
      )
    })
  })

  describe('UPDATE_AIRDROP_SETTINGS_FAILED', () => {
    const settings = fromJS({
      'id': 1,
      'timestamp': 1443826874918,
      'gpsTargetLocation': {
        'latitude': 29.4,
        'longitude': 28.3
      },
      'acceptableThresholdFt': 100,
      'isArmed': false,
      'commandDropNow': false
    })

    it('should handle from the initial state', () => {
      expect(
        reducer(
          initState,
          {
            type: 'UPDATE_AIRDROP_SETTINGS_FAILED',
            settings: settings,
          })
      ).toEqualImmutable(
        fromJS({
          settings:{
            timestamp: -1,
            isArmed: false,
            commandDropNow: false,
            gpsTargetLocation: {
              latitude: 0,
              longitude: 0
            },
            acceptableThresholdFt: 0
          },
          pending: {}
        })
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
            type: 'UPDATE_AIRDROP_SETTINGS_FAILED',
            settings: settings,
          })
      ).toEqualImmutable(
        fromJS({
          settings: {
            timestamp: -1
          },
          pending: {}
        })
      )
    })
  })

})
