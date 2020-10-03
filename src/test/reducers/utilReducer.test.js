import reducer from '../../reducers/utilReducer.js'
import * as matchers from 'jest-immutable-matchers'
import {fromJS} from 'immutable'

describe('utilReducer', () => {
  // this enables us to use toEqualImmutable
  beforeEach(function () {
    jest.addMatchers(matchers)
  })

  const initState = fromJS({
    usersEnabled: true
  })

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqualImmutable(fromJS(initState))
  })

  describe('RECEIVE_USERS_ENABLED', () => {
    it('should update the state on RECEIVE_USERS_ENABLED when usersEnabled is false', () => {
      expect(
        reducer(
          initState,
          {
            type: 'RECEIVE_USERS_ENABLED',
            usersEnabled: false,
          })
      ).toEqualImmutable(
        fromJS({
          usersEnabled: false
        })
      )
    })

    it('should stay the same when usersEnabled is passed as true', () => {
      expect(
        reducer(
          initState,
          {
            type: 'RECEIVE_USERS_ENABLED',
            usersEnabled: true,
          })
      ).toEqualImmutable(
        fromJS({
          usersEnabled: true
        })
      )
    })
  })
})
