import reducer from '../../reducers/assignmentReducer.js'
import * as matchers from 'jest-immutable-matchers'
import {fromJS} from 'immutable'

describe('assignmentReducer', () => {
  // this enables us to use toEqualImmutable
  beforeEach(function () {
    jest.addMatchers(matchers)
  })

  const initState = fromJS({
    assignments: [],
    current: -1,
    loading: false
  })

  // fields are omitted intentionally to avoid length
  const firstAssignment = {
    "id": 21,
    "image": {
        "id": 1,
        "imageUrl": "/some/local/file/url.jpg",
        "timestamp": 23412313948574072,
    },
    "timestamp": 1443826874918,
    "assignee": "MDLC",
    "done": false,
    "username": "username"
  }

  const firstStateAfterInit = fromJS({
    assignments: [firstAssignment],
    current: -1,
    loading: false,
  })

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqualImmutable(fromJS(initState))
  })

  describe('GET_NEW_ASSIGNMENT_SUCCESS', () => {
    it('should handle on init state', () => {
      const returnedState = reducer(
        initState,
        {
          type: 'GET_NEW_ASSIGNMENT_SUCCESS',
          assignment: firstAssignment,
        }
      )
      expect(returnedState).toEqualImmutable(firstStateAfterInit)
    })

    it('should handle a second action', () => {
      const sndAssignment = {
        "id": 22,
        "image": {
            "id": 1,
            "imageUrl": "/some/local/file/url.jpg",
            "timestamp": 23412313948574073,
        },
        "timestamp": 1443826874919,
        "assignee": "MDLC",
        "done": false,
        "username": "username"
      }

      expect(
        reducer(
          firstStateAfterInit,
          {
            type: 'GET_NEW_ASSIGNMENT_SUCCESS',
            assignment: sndAssignment,
          })
      ).toEqualImmutable(
        fromJS({
          assignments: [firstAssignment, sndAssignment],
          current: -1,
          loading: false,
        })
      )
    })

    it('should change loading to false', () => {
      expect(
        reducer(
          fromJS({
            assignments: [],
            current: -1,
            loading: true
          }),
          {
            type: 'GET_NEW_ASSIGNMENT_SUCCESS',
            assignment: firstAssignment,
          })
      ).toEqualImmutable(
        fromJS({
          assignments: [firstAssignment],
          current: -1,
          loading: false,
        })
      )
    })
  })

  describe('GET_NEW_ASSIGNMENT_STARTED/FAILED', () => {
    it('should handle GET_NEW_ASSIGNMENT_STARTED on init state', () => {
      expect(
        reducer(
          initState,
          {
            type: 'GET_NEW_ASSIGNMENT_STARTED'
          })
      ).toEqualImmutable(
        fromJS({
          assignments: [],
          current: -1,
          loading: true
        })
      )
    })

    it('should handle GET_NEW_ASSIGNMENT_FAILED on init state', () => {
      expect(
        reducer(
          initState,
          {
            type: 'GET_NEW_ASSIGNMENT_FAILED'
          })
      ).toEqualImmutable(
        fromJS({
          assignments: [],
          current: -1,
          loading: false
        }))
      })
  })

  describe('SET_ACTIVE_ASSIGNMENT', () => {
    var index = 0
    it('should properly update', () => {
      expect(
        reducer(
          firstStateAfterInit,
          {
            type: 'SET_ACTIVE_ASSIGNMENT',
            index
          })
      ).toEqualImmutable(
        fromJS({
          assignments: [firstAssignment],
          current: 0,
          loading: false
        }))
      })

    it('should not update if index is greater than assignments list', () => {
      index = 1
      expect(
        reducer(
          initState,
          {
            type: 'SET_ACTIVE_ASSIGNMENT',
            index
          })
      ).toEqualImmutable(
        fromJS({
          assignments: [],
          current: -1,
          loading: false
        }))
      })

    it('should not update if index is negative', () => {
      index = -1
      expect(
        reducer(
          initState,
          {
            type: 'SET_ACTIVE_ASSIGNMENT',
            index
          })
      ).toEqualImmutable(
        fromJS({
          assignments: [],
          current: -1,
          loading: false
        }))
      })
  })

})
