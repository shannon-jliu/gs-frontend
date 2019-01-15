import 'jest-localstorage-mock'
import { targetSightingRequests } from '../../util/sendApi.js'
import targetSightingOperations from '../../operations/targetSightingOperations.js'
import { fromJS } from 'immutable'
import * as action from '../../actions/targetSightingActionCreator.js'
import SnackbarUtil from '../../util/snackbarUtil.js'

describe('targetSightingOperations', () => {
  const assignment = fromJS({
    id: 11,
    timestamp: 1443826874918,
    assignee: 'MDLC',
    done: false
  })

  const localTs = fromJS({
    localId: '12:23:4213',
    shape: 'trapezoid',
    shapeColor: 'red',
    alpha: 'r',
    alphaColor: 'blue',
    type: 'alphanum',
    offaxis: 'false',
    mdlcClassConf: 'low',
    assignment: assignment
  })

  const ts = fromJS({
    id: 2,
    shape: 'trapezoid',
    shapeColor: 'red',
    alpha: 'r',
    alphaColor: 'blue',
    type: 'alphanum',
    offaxis: 'false',
    mdlcClassConf: 'low',
    assignment: assignment,
    geotag: {id: 21}
  })

  let dispatch
  beforeEach(() => {
    dispatch = jest.fn()
    SnackbarUtil.render = jest.fn()
  })

  it('adds target sighting', () => {
    targetSightingOperations.addTargetSighting(dispatch)(localTs.delete('assignment'), assignment)

    expect(dispatch).toHaveBeenCalledWith(action.addTargetSighting(localTs.delete('assignment'), assignment))
    expect(dispatch).toHaveBeenCalledTimes(1)

    expect(SnackbarUtil.render).toHaveBeenCalledTimes(0)
  })

  it('deletes unsaved target sighting', () => {
    targetSightingOperations.deleteUnsavedTargetSighting(dispatch)(localTs)

    expect(dispatch).toHaveBeenCalledWith(action.deleteTargetSighting(localTs))
    expect(dispatch).toHaveBeenCalledTimes(1)

    expect(SnackbarUtil.render).toHaveBeenCalledTimes(0)
  })

  describe('deleteSavedTargetSighting', () => {
    it('only deletes when delete succeeds', () => {
      targetSightingRequests.deleteTargetSighting = jest.fn((isAlphanum, id, successCallback, failureCallback) => successCallback())

      targetSightingOperations.deleteSavedTargetSighting(dispatch)(ts)

      expect(dispatch).toHaveBeenCalledWith(action.deleteTargetSighting(ts))
      expect(dispatch).toHaveBeenCalledTimes(1)

      //checks, for 0th call, the 0th argument
      expect(targetSightingRequests.deleteTargetSighting.mock.calls[0][0]).toBe(true)
      expect(targetSightingRequests.deleteTargetSighting.mock.calls[0][1]).toBe(2)
      expect(targetSightingRequests.deleteTargetSighting).toHaveBeenCalledTimes(1)

      expect(SnackbarUtil.render).toHaveBeenCalledTimes(0)
    })


    it('re-adds when delete fails', () => {
      targetSightingRequests.deleteTargetSighting = jest.fn((isAlphanum, id, successCallback, failureCallback) => failureCallback())

      targetSightingOperations.deleteSavedTargetSighting(dispatch)(ts)

      expect(dispatch).toHaveBeenCalledWith(action.deleteTargetSighting(ts))
      expect(dispatch).toHaveBeenCalledWith(action.addTargetSighting(ts, assignment))
      expect(dispatch).toHaveBeenCalledTimes(2)

      expect(targetSightingRequests.deleteTargetSighting.mock.calls[0][0]).toBe(true)
      expect(targetSightingRequests.deleteTargetSighting.mock.calls[0][1]).toBe(2)
      expect(targetSightingRequests.deleteTargetSighting).toHaveBeenCalledTimes(1)

      expect(SnackbarUtil.render).toHaveBeenCalledWith('Failed to delete target sighting')
      expect(SnackbarUtil.render).toHaveBeenCalledTimes(1)
    })
  })

  describe('saveTargetSighting', () => {
    it('saves successfully correctly', () => {
      const expected = localTs.delete('type').delete('localId').set('creator', 'MDLC')
      const returned = expected.set('id', 2)
      targetSightingRequests.saveTargetSighting = jest.fn((isAlphanum, assignmentId, sighting, successCallback, failureCallback) => successCallback(returned))

      targetSightingOperations.saveTargetSighting(dispatch)(localTs)

      expect(dispatch).toHaveBeenCalledWith(action.startSaveTargetSighting(localTs.get('localId')))
      expect(dispatch).toHaveBeenCalledWith(action.succeedSaveTargetSighting(returned.set('type', 'alphanum'), localTs.get('localId')))
      expect(dispatch).toHaveBeenCalledTimes(2)

      expect(targetSightingRequests.saveTargetSighting.mock.calls[0][0]).toBe(true)
      expect(targetSightingRequests.saveTargetSighting.mock.calls[0][1]).toBe(11)
      expect(targetSightingRequests.saveTargetSighting.mock.calls[0][2]).toEqual(expected.toJS())
      expect(targetSightingRequests.saveTargetSighting).toHaveBeenCalledTimes(1)

      expect(SnackbarUtil.render).toHaveBeenCalledWith('Succesfully saved target sighting')
      expect(SnackbarUtil.render).toHaveBeenCalledTimes(1)
    })

    it('fails to save correctly', () => {
      const expected = localTs.delete('type').delete('localId').set('creator', 'MDLC')
      targetSightingRequests.saveTargetSighting = jest.fn((isAlphanum, assignmentId, sighting, successCallback, failureCallback) => failureCallback())

      targetSightingOperations.saveTargetSighting(dispatch)(localTs)

      expect(dispatch).toHaveBeenCalledWith(action.startSaveTargetSighting(localTs.get('localId')))
      expect(dispatch).toHaveBeenCalledWith(action.failSaveTargetSighting(localTs.get('localId')))
      expect(dispatch).toHaveBeenCalledTimes(2)

      expect(targetSightingRequests.saveTargetSighting.mock.calls[0][0]).toBe(true)
      expect(targetSightingRequests.saveTargetSighting.mock.calls[0][1]).toBe(11)
      expect(targetSightingRequests.saveTargetSighting.mock.calls[0][2]).toEqual(expected.toJS())
      expect(targetSightingRequests.saveTargetSighting).toHaveBeenCalledTimes(1)

      expect(SnackbarUtil.render).toHaveBeenCalledWith('Failed to save target sighting')
      expect(SnackbarUtil.render).toHaveBeenCalledTimes(1)
    })
  })

  describe('updateTargetSighting', () => {
    const attrib = fromJS({color: 'green'})

    it('updates target sighting correctly', () => {
      const savedTs = ts.set('localTargetId', '23:63:2048').set('creator', 'MDLC')
      const sentTs = ts.set('color', 'green').delete('type').delete('geotag').delete('id')
      const returned = ts.set('color', 'green').delete('type').set('creator', 'MDLC')
      const final = savedTs.set('color', 'green')

      targetSightingRequests.updateTargetSighting = jest.fn((isAlphanum, id, sighting, successCallback, failureCallback) => successCallback(returned))

      targetSightingOperations.updateTargetSighting(dispatch)(savedTs, attrib)

      expect(dispatch).toHaveBeenCalledWith(action.startUpdateTargetSighting(savedTs, attrib))
      expect(dispatch).toHaveBeenCalledWith(action.succeedUpdateTargetSighting(final, attrib))
      expect(dispatch).toHaveBeenCalledTimes(2)

      expect(targetSightingRequests.updateTargetSighting.mock.calls[0][0]).toBe(true)
      expect(targetSightingRequests.updateTargetSighting.mock.calls[0][1]).toBe(2)
      expect(targetSightingRequests.updateTargetSighting.mock.calls[0][2]).toEqual(sentTs.toJS())
      expect(targetSightingRequests.updateTargetSighting).toHaveBeenCalledTimes(1)

      expect(SnackbarUtil.render).toHaveBeenCalledWith('Succesfully updated target sighting')
      expect(SnackbarUtil.render).toHaveBeenCalledTimes(1)
    })

    it('fails to update target sighting correctly', () => {
      const savedTs = ts.set('localTargetId', '23:63:2048').set('creator', 'MDLC')
      const sentTs = ts.set('color', 'green').delete('type').delete('geotag').delete('id')

      targetSightingRequests.updateTargetSighting = jest.fn((isAlphanum, id, sighting, successCallback, failureCallback) => failureCallback())

      targetSightingOperations.updateTargetSighting(dispatch)(savedTs, attrib)

      expect(dispatch).toHaveBeenCalledWith(action.startUpdateTargetSighting(savedTs, attrib))
      expect(dispatch).toHaveBeenCalledWith(action.failUpdateTargetSighting(savedTs, attrib))

      expect(targetSightingRequests.updateTargetSighting.mock.calls[0][0]).toBe(true)
      expect(targetSightingRequests.updateTargetSighting.mock.calls[0][1]).toBe(2)
      expect(targetSightingRequests.updateTargetSighting.mock.calls[0][2]).toEqual(sentTs.toJS())
      expect(targetSightingRequests.updateTargetSighting).toHaveBeenCalledTimes(1)

      expect(SnackbarUtil.render).toHaveBeenCalledWith('Failed to update target sighting')
      expect(SnackbarUtil.render).toHaveBeenCalledTimes(1)
    })
  })
})
