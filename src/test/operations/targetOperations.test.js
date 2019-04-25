import 'jest-localstorage-mock'
import { fromJS, List } from 'immutable'

import { targetRequests } from '../../util/sendApi.js'
import { TargetGetRequests as GetRequests } from '../../util/receiveApi.js'
import TargetOperations from '../../operations/targetOperations.js'
import TargetSightingOperations from '../../operations/targetSightingOperations.js'
import * as action from '../../actions/targetActionCreator.js'
import * as tsAction from '../../actions/targetSightingActionCreator.js'
import SnackbarUtil from '../../util/snackbarUtil.js'

describe('TargetOperations', () => {
  const localTgt = fromJS({
    localId: '12:23:4213',
    shape: 'trapezoid',
    shapeColor: 'red',
    alpha: 'r',
    alphaColor: 'blue',
    type: 'alphanum',
    offaxis: false
  })

  const tgt = fromJS({
    id: 2,
    shape: 'trapezoid',
    shapeColor: 'red',
    alpha: 'r',
    alphaColor: 'blue',
    type: 'alphanum',
    offaxis: false
  })

  const ts1 = fromJS({
    id: 11,
    localTargetId: '12:23:4213',
    type: 'alphanum',
    shape: 'trapezoid'
  })

  const ts2 = fromJS({
    id: 12,
    localTargetId: '12:23:4213',
    type: 'alphanum',
    shape: 'trapezoid'
  })

  const ts3 = fromJS({
    id: 13,
    target: tgt.set('id', 3),
    type: 'alphanum',
    shape: 'trapezoid'
  })

  const ts4 = fromJS({
    id: 14,
    localTargetId: '51:72:9384',
    type: 'alphanum',
    shape: 'trapezoid'
  })

  let dispatch
  beforeEach(() => {
    dispatch = jest.fn()
    SnackbarUtil.render = jest.fn()
  })

  describe('getAllTargets', () => {
    const t = fromJS({
      id: 2,
      shape: 'trapezoid',
      shapeColor: 'red',
      alpha: 'r',
      alphaColor: 'blue',
      offaxis: false
    })

    const emergent = fromJS({
      id: 3,
      type: 'emergent',
      description: 'lol'
    })

    it('gets all targets correctly', () => {
      // these requests should return a list of JS targets
      GetRequests.getAlphanumTargets = jest.fn((succ, fail) => succ([t.toJS()]))
      GetRequests.getEmergentTargets = jest.fn((succ, fail) => succ([emergent.toJS()]))
      TargetOperations.getAllTargets(dispatch)()

      const expectedCombinedTargets = fromJS([t.set('type', 'alphanum'), emergent.set('type', 'emergent')])
      expect(dispatch).toHaveBeenCalledWith(action.addTargetsFromServer(expectedCombinedTargets))
      expect(dispatch).toHaveBeenCalledTimes(1)
    })

    it('fails to retrieve alphanum targets', () => {
      // these requests should return a list of JS targets
      GetRequests.getAlphanumTargets = jest.fn((succ, fail) => fail())
      GetRequests.getEmergentTargets = jest.fn((succ, fail) => succ([emergent.toJS()]))
      TargetOperations.getAllTargets(dispatch)()

      expect(GetRequests.getEmergentTargets).toHaveBeenCalledTimes(0)
      expect(dispatch).toHaveBeenCalledTimes(0)
      expect(SnackbarUtil.render).toHaveBeenCalledWith('Failed to get alphanumeric targets')
      expect(SnackbarUtil.render).toHaveBeenCalledTimes(1)
    })

    it('fails to retrieve emergent targets', () => {
      // these requests should return a list of JS targets
      GetRequests.getAlphanumTargets = jest.fn((succ, fail) => succ([t.toJS()]))
      GetRequests.getEmergentTargets = jest.fn((succ, fail) => fail())
      TargetOperations.getAllTargets(dispatch)()

      expect(GetRequests.getAlphanumTargets).toHaveBeenCalledTimes(1)
      expect(dispatch).toHaveBeenCalledTimes(0)
      expect(SnackbarUtil.render).toHaveBeenCalledWith('Failed to get emergent targets')
      expect(SnackbarUtil.render).toHaveBeenCalledTimes(1)
    })
  })

  it('adds target', () => {
    TargetOperations.addTarget(dispatch)(localTgt)

    expect(dispatch).toHaveBeenCalledWith(action.addTarget(localTgt))
    expect(dispatch).toHaveBeenCalledTimes(1)

    expect(SnackbarUtil.render).toHaveBeenCalledTimes(0)
  })

  it('deletes unsaved target', () => {
    TargetOperations.deleteUnsavedTarget(dispatch)(localTgt)

    expect(dispatch).toHaveBeenCalledWith(action.deleteTarget(localTgt))
    expect(dispatch).toHaveBeenCalledTimes(1)

    expect(SnackbarUtil.render).toHaveBeenCalledTimes(0)
  })

  describe('deleteSavedTarget', () => {
    it('succeeds to delete saved target correctly', () => {
      targetRequests.deleteTarget = jest.fn((id, successCallback, failureCallback) => successCallback())

      TargetOperations.deleteSavedTarget(dispatch)(tgt)

      expect(dispatch).toHaveBeenCalledWith(action.deleteTarget(tgt))
      expect(dispatch).toHaveBeenCalledWith(tsAction.deleteTargetFromTargetSightings(tgt))
      expect(dispatch).toHaveBeenCalledTimes(2)

      //checks, for 0th call, the 0th argument
      expect(targetRequests.deleteTarget.mock.calls[0][0]).toBe(2)
      expect(targetRequests.deleteTarget).toHaveBeenCalledTimes(1)

      expect(SnackbarUtil.render).toHaveBeenCalledTimes(0)
    })


    it('fails delete correctly', () => {
      targetRequests.deleteTarget = jest.fn((id, successCallback, failureCallback) => failureCallback())

      TargetOperations.deleteSavedTarget(dispatch)(tgt)

      expect(dispatch).toHaveBeenCalledWith(action.deleteTarget(tgt))
      expect(dispatch).toHaveBeenCalledWith(action.addTarget(tgt))
      expect(dispatch).toHaveBeenCalledTimes(2)

      expect(targetRequests.deleteTarget.mock.calls[0][0]).toBe(2)
      expect(targetRequests.deleteTarget).toHaveBeenCalledTimes(1)

      expect(SnackbarUtil.render).toHaveBeenCalledWith('Failed to delete target')
      expect(SnackbarUtil.render).toHaveBeenCalledTimes(1)
    })
  })

  describe('saveTarget', () => {
    it('saves successfully correctly', () => {
      const updateTs = jest.fn()
      TargetSightingOperations.updateTargetSighting = jest.fn(dispatch => updateTs)

      targetRequests.saveTarget = jest.fn((target, successCallback, failureCallback) => successCallback(tgt.delete('type').toJS()))

      TargetOperations.saveTarget(dispatch)(localTgt, List.of(ts1, ts2, ts3, ts4))

      expect(dispatch).toHaveBeenCalledWith(action.startSaveTarget(localTgt.get('localId')))
      expect(dispatch).toHaveBeenCalledWith(action.succeedSaveTarget(tgt, localTgt.get('localId')))
      expect(dispatch).toHaveBeenCalledTimes(2)

      expect(updateTs).toHaveBeenCalledWith(ts1, fromJS({target: tgt}))
      expect(updateTs).toHaveBeenCalledWith(ts2, fromJS({target: tgt}))
      expect(updateTs).toHaveBeenCalledTimes(2)

      expect(targetRequests.saveTarget.mock.calls[0][0]).toEqual(localTgt.delete('type').delete('offaxis').delete('localId').toJS())
      expect(targetRequests.saveTarget).toHaveBeenCalledTimes(1)

      expect(SnackbarUtil.render).toHaveBeenCalledWith('Successfully saved target')
      expect(SnackbarUtil.render).toHaveBeenCalledTimes(1)
    })

    it('fails to save correctly', () => {
      const updateTs = jest.fn()
      TargetSightingOperations.updateTargetSighting = jest.fn(dispatch => updateTs)

      targetRequests.saveTarget = jest.fn((target, successCallback, failureCallback) => failureCallback())

      TargetOperations.saveTarget(dispatch)(localTgt, List.of(ts1, ts2, ts3, ts4))

      expect(dispatch).toHaveBeenCalledWith(action.startSaveTarget(localTgt.get('localId')))
      expect(dispatch).toHaveBeenCalledWith(action.failSaveTarget(localTgt.get('localId')))
      expect(dispatch).toHaveBeenCalledTimes(2)

      expect(updateTs).toHaveBeenCalledTimes(0)

      expect(targetRequests.saveTarget.mock.calls[0][0]).toEqual(localTgt.delete('type').delete('offaxis').delete('localId').toJS())
      expect(targetRequests.saveTarget).toHaveBeenCalledTimes(1)

      expect(SnackbarUtil.render).toHaveBeenCalledWith('Failed to save target')
      expect(SnackbarUtil.render).toHaveBeenCalledTimes(1)
    })
  })

  describe('updateTarget', () => {
    const attribute = fromJS({thumbnailTSId: 11, alphaColor: 'green'})
    const sentTgt = fromJS({
      shape: 'trapezoid',
      shapeColor: 'red',
      alpha: 'r',
      alphaColor: 'green',
      thumbnailTSId: 11
    })

    it('updates target successfully correctly', () => {
      const returnedTgt = tgt.delete('type').merge(attribute)
      const finalTgt = returnedTgt.set('type', 'alphanum')

      targetRequests.updateTarget = jest.fn((isAlphanum, id, target, successCallback, failureCallback) => successCallback(returnedTgt.toJS()))

      TargetOperations.updateTarget(dispatch)(tgt, attribute)

      expect(dispatch).toHaveBeenCalledWith(action.startUpdateTarget(tgt, attribute))
      expect(dispatch).toHaveBeenCalledWith(action.succeedUpdateTarget(finalTgt, attribute))
      expect(dispatch).toHaveBeenCalledTimes(2)

      expect(targetRequests.updateTarget.mock.calls[0][0]).toBe(true)
      expect(targetRequests.updateTarget.mock.calls[0][1]).toBe(tgt.get('id'))
      expect(targetRequests.updateTarget.mock.calls[0][2]).toEqual(sentTgt.toJS())
      expect(targetRequests.updateTarget).toHaveBeenCalledTimes(1)

      expect(SnackbarUtil.render).toHaveBeenCalledWith('Successfully updated target')
      expect(SnackbarUtil.render).toHaveBeenCalledTimes(1)
    })

    it('fails to update target correctly', () => {
      targetRequests.updateTarget = jest.fn((isAlphanum, id, target, successCallback, failureCallback) => failureCallback())

      TargetOperations.updateTarget(dispatch)(tgt, attribute)

      expect(dispatch).toHaveBeenCalledWith(action.startUpdateTarget(tgt, attribute))
      expect(dispatch).toHaveBeenCalledWith(action.failUpdateTarget(tgt, attribute))
      expect(dispatch).toHaveBeenCalledTimes(2)

      expect(targetRequests.updateTarget.mock.calls[0][0]).toBe(true)
      expect(targetRequests.updateTarget.mock.calls[0][1]).toBe(tgt.get('id'))
      expect(targetRequests.updateTarget.mock.calls[0][2]).toEqual(sentTgt.toJS())
      expect(targetRequests.updateTarget).toHaveBeenCalledTimes(1)

      expect(SnackbarUtil.render).toHaveBeenCalledWith('Failed to update target')
      expect(SnackbarUtil.render).toHaveBeenCalledTimes(1)
    })
  })
})
