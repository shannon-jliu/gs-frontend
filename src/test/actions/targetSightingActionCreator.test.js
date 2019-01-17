import {
  addTargetSighting,
  deleteTargetSighting,
  startSaveTargetSighting,
  succeedSaveTargetSighting,
  failSaveTargetSighting,
  startUpdateTargetSighting,
  succeedUpdateTargetSighting,
  failUpdateTargetSighting,
  addTargetSightingsFromServer,
  replaceLocalTargetInSightings,
  deleteTargetFromTargetSightings
} from '../../actions/targetSightingActionCreator.js'
import { fromJS } from 'immutable'

describe('targetSightingActionCreator', () => {

  //objects shortened to be concise
  const sighting = fromJS({
    'id' : 1,
    'timestamp' : 1443826874918,
    'target': null,
    'type' : 'alphanum'
  })
  const local_ts = fromJS({
    'localId' : '341:107:938729871',
    'timestamp' : 1443826874918,
    'target': null,
    'type' : 'alphanum'
  })
  const attribute = fromJS({
    color: 'red'
  })

  describe('ADD_TARGET_SIGHTING', () => {
    it('should create an action when it adds target sighting', () => {
      const assignment = fromJS({
        'id': 21,
        'image': {
          'id': 1,
          'timestamp': 5,
          'state': null,
          'imageUrl': '/api/v1/image/file/5.jpeg',
          'telemetryData': null,
          'gimbalView': null
        },
        'timestamp': 1443826874918,
        'assignee': 'MDLC',
        'done': false,
        'username': 'username'
      })

      const expectedAction = {
        type: 'ADD_TARGET_SIGHTING',
        sighting,
        assignment
      }
      expect(addTargetSighting(sighting, assignment)).toEqual(expectedAction)
    })
  })

  describe('DELETE_TARGET_SIGHTING', () => {
    it('should create an action when it deletes target sighting', () => {
      const expectedAction = {
        type: 'DELETE_TARGET_SIGHTING',
        sighting
      }
      expect(deleteTargetSighting(sighting)).toEqual(expectedAction)
    })
  })

  describe('START_SAVE_TARGET_SIGHTING', () => {
    it('should create an action when it starts save of target sighting', () => {
      const expectedAction = {
        type: 'START_SAVE_TARGET_SIGHTING',
        localId: '341:107:938729871'
      }
      expect(startSaveTargetSighting('341:107:938729871')).toEqual(expectedAction)
    })
  })

  describe('SUCCEED_SAVE_TARGET_SIGHTING', () => {
    it('should create an action when it succeeds save of target sighting', () => {
      const expectedAction = {
        type: 'SUCCEED_SAVE_TARGET_SIGHTING',
        sighting: sighting,
        localId: '341:107:938729871'
      }
      expect(succeedSaveTargetSighting(sighting, '341:107:938729871')).toEqual(expectedAction)
    })
  })

  describe('FAIL_SAVE_TARGET_SIGHTING', () => {
    it('should create an action when it fails save of target sighting', () => {
      const expectedAction = {
        type: 'FAIL_SAVE_TARGET_SIGHTING',
        localId: '341:107:938729871'
      }
      expect(failSaveTargetSighting('341:107:938729871')).toEqual(expectedAction)
    })
  })

  describe('START_UPDATE_TARGET_SIGHTING', () => {
    it('should create an action when it starts update of target sighting', () => {
      const expectedAction = {
        type: 'START_UPDATE_TARGET_SIGHTING',
        sighting,
        attribute
      }
      expect(startUpdateTargetSighting(sighting, attribute)).toEqual(expectedAction)
    })
  })

  describe('SUCCEED_UPDATE_TARGET_SIGHTING', () => {
    it('should create an action when it succeeds update of target sighting', () => {
      const expectedAction = {
        type: 'SUCCEED_UPDATE_TARGET_SIGHTING',
        newSighting: sighting,
        attribute
      }
      expect(succeedUpdateTargetSighting(sighting, attribute)).toEqual(expectedAction)
    })
  })

  describe('FAIL_UPDATE_TARGET_SIGHTING', () => {
    it('should create an action when it fails update of target sighting', () => {
      const expectedAction = {
        type: 'FAIL_UPDATE_TARGET_SIGHTING',
        sighting,
        attribute
      }
      expect(failUpdateTargetSighting(sighting, attribute)).toEqual(expectedAction)
    })
  })

  describe('ADD_TARGET_SIGHTINGS_FROM_SERVER', () => {
    it('should create an action when it adds target sightings from server', () => {
      const sightings = fromJS([
        sighting,
        {
          'id' : 2,
          'timestamp' : 1443826874919,
          'target': null,
          'type' : 'alphanum'
        }
      ])
      const expectedAction = {
        type: 'ADD_TARGET_SIGHTINGS_FROM_SERVER',
        sightings
      }
      expect(addTargetSightingsFromServer(sightings)).toEqual(expectedAction)
    })
  })

  describe('DELETE_TARGET_FROM_TARGET_SIGHTINGS', () => {
    it('should create an action when it fails update of target sighting', () => {
      const target = fromJS({id: 5})

      const expectedAction = {
        type: 'DELETE_TARGET_FROM_TARGET_SIGHTINGS',
        target
      }
      expect(deleteTargetFromTargetSightings(target)).toEqual(expectedAction)
    })
  })
})
