import {
  addTarget,
  deleteTarget,
  startSaveTarget,
  succeedSaveTarget,
  failSaveTarget,
  startUpdateTarget,
  succeedUpdateTarget,
  failUpdateTarget,
  addTargetsFromServer
} from '../../actions/targetActionCreator.js'
import { fromJS } from 'immutable'

const target = fromJS({
  'id': 1,
  'creator': 'MDLC',
  'shape': 'rectangle',
  'shapeColor': 'red',
  'alpha': 'A',
  'alphaColor': 'green',
  'geotag' : {
    'gps': {
      'latitude': 29.3,
      'longitude': 92.5
    },
    'radiansFromNorth': {
      'radian': 1.5707963268
    }
  }
})

it('should create an action when it adds a target', () => {
  const expectedAction = {
    type: 'ADD_TARGET',
    target
  }
  expect(addTarget(target)).toEqual(expectedAction)
})

it('should create an action when it deletes a target', () => {
  const expectedAction = {
    type: 'DELETE_TARGET',
    target
  }
  expect(deleteTarget(target)).toEqual(expectedAction)
})

it('should create an action when it starts to save a target', () => {
  const localId = '35:21:2321'
  const expectedAction = {
    type: 'START_SAVE_TARGET',
    localId
  }
  expect(startSaveTarget(localId)).toEqual(expectedAction)
})

it('should create an action when it successfully saves a target', () => {
  const expectedAction = {
    type: 'SUCCEED_SAVE_TARGET',
    target,
    localId: '232:342:1233'
  }
  expect(succeedSaveTarget(target, '232:342:1233')).toEqual(expectedAction)
})


it('should create an action when it fails to save a target', () => {
  const expectedAction = {
    type: 'FAIL_SAVE_TARGET',
    localId: '232:342:1233'
  }
  expect(failSaveTarget('232:342:1233')).toEqual(expectedAction)
})

const attribute = fromJS({color: 'red'})

it('should create an action when it starts to update a target', () => {
  const expectedAction = {
    type: 'START_UPDATE_TARGET',
    target,
    attribute
  }
  expect(startUpdateTarget(target, attribute)).toEqual(expectedAction)
})

it('should create an action when it successfully updates a target', () => {
  const expectedAction = {
    type: 'SUCCEED_UPDATE_TARGET',
    target,
    attribute
  }
  expect(succeedUpdateTarget(target, attribute)).toEqual(expectedAction)
})


it('should create an action when it fails to update a target', () => {
  const expectedAction = {
    type: 'FAIL_UPDATE_TARGET',
    target,
    attribute
  }
  expect(failUpdateTarget(target, attribute)).toEqual(expectedAction)
})


it('should create an action adds all targets from server', () => {
  const targets = fromJS([
    {
      'id': 1,
      'creator': 'MDLC',
    },
    {
      'id': 2,
      'creator': 'MDLC',
    }
  ])
  const expectedAction = {
    type: 'ADD_TARGETS_FROM_SERVER',
    targets
  }
  expect(addTargetsFromServer(targets)).toEqual(expectedAction)
})
