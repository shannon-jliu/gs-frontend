import 'jest-localstorage-mock'
import { fromJS } from 'immutable'

import { TargetSightingRequests } from '../../util/sendApi.js'
import { TargetSightingGetRequests as GetRequests } from '../../util/receiveApi.js'
import TargetSightingOperations from '../../operations/targetSightingOperations.js'
import * as action from '../../actions/targetSightingActionCreator.js'
import SnackbarUtil from '../../util/snackbarUtil.js'

describe('TargetSightingOperations', () => {
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
    offaxis: false,
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
    offaxis: false,
    mdlcClassConf: 'low',
    assignment: assignment,
    geotag: {id: 21}
  })

  let dispatch
  beforeEach(() => {
    dispatch = jest.fn()
    SnackbarUtil.render = jest.fn()
  })

  describe('getAllSightings', () => {
    const ts = fromJS({
      id: 2,
      shape: 'trapezoid',
      shapeColor: 'red',
      alpha: 'r',
      alphaColor: 'blue',
      offaxis: false,
      mdlcClassConf: 'low',
      assignment: assignment,
      geotag: {id: 21}
    })

    const emergentTs = fromJS({
      id: 2,
      type: 'emergent',
      description: 'lol',
      offaxis: false,
      mdlcClassConf: 'low',
      assignment: assignment,
      geotag: {id: 21}
    })

    it('gets all target sightings correctly', () => {
      // these requests should return a list of JS target sightings
      GetRequests.getAlphanumSightings = jest.fn((succ, fail) => succ([ts.toJS()]))
      GetRequests.getEmergentSightings = jest.fn((succ, fail) => succ([emergentTs.toJS()]))
      TargetSightingOperations.getAllSightings(dispatch)()

      const expectedCombinedSightings = fromJS([ts.set('type', 'alphanum'), emergentTs.set('type', 'emergent')])
      expect(dispatch).toHaveBeenCalledWith(action.addTargetSightingsFromServer(expectedCombinedSightings))
      expect(dispatch).toHaveBeenCalledTimes(1)
    })

    it('fails to retrieve alphanum sightings', () => {
      // these requests should return a list of JS target sightings
      GetRequests.getAlphanumSightings = jest.fn((succ, fail) => fail())
      GetRequests.getEmergentSightings = jest.fn((succ, fail) => succ([emergentTs.toJS()]))
      TargetSightingOperations.getAllSightings(dispatch)()

      expect(GetRequests.getEmergentSightings).toHaveBeenCalledTimes(0)
      expect(dispatch).toHaveBeenCalledTimes(0)
      expect(SnackbarUtil.render).toHaveBeenCalledWith('Failed to get alphanumeric target sightings')
      expect(SnackbarUtil.render).toHaveBeenCalledTimes(1)
    })

    it('fails to retrieve emergent sightings', () => {
      // these requests should return a list of JS target sightings
      GetRequests.getAlphanumSightings = jest.fn((succ, fail) => succ([ts.toJS()]))
      GetRequests.getEmergentSightings = jest.fn((succ, fail) => fail())
      TargetSightingOperations.getAllSightings(dispatch)()

      expect(GetRequests.getAlphanumSightings).toHaveBeenCalledTimes(1)
      expect(dispatch).toHaveBeenCalledTimes(0)
      expect(SnackbarUtil.render).toHaveBeenCalledWith('Failed to get emergent target sightings')
      expect(SnackbarUtil.render).toHaveBeenCalledTimes(1)
    })
  })

  it('adds target sighting', () => {
    TargetSightingOperations.addTargetSighting(dispatch)(localTs.delete('assignment'), assignment)

    expect(dispatch).toHaveBeenCalledWith(action.addTargetSighting(localTs.delete('assignment'), assignment))
    expect(dispatch).toHaveBeenCalledTimes(1)

    expect(SnackbarUtil.render).toHaveBeenCalledTimes(0)
  })

  it('deletes unsaved target sighting', () => {
    TargetSightingOperations.deleteUnsavedTargetSighting(dispatch)(localTs)

    expect(dispatch).toHaveBeenCalledWith(action.deleteTargetSighting(localTs))
    expect(dispatch).toHaveBeenCalledTimes(1)

    expect(SnackbarUtil.render).toHaveBeenCalledTimes(0)
  })

  describe('deleteSavedTargetSighting', () => {
    it('deletes when delete succeeds', () => {
      TargetSightingRequests.deleteTargetSighting = jest.fn((isAlphanum, id, successCallback, failureCallback) => successCallback())

      TargetSightingOperations.deleteSavedTargetSighting(dispatch)(ts)

      expect(dispatch).toHaveBeenCalledWith(action.deleteTargetSighting(ts))
      expect(dispatch).toHaveBeenCalledTimes(1)

      //checks, for 0th call, the 0th argument
      expect(TargetSightingRequests.deleteTargetSighting.mock.calls[0][0]).toBe(true)
      expect(TargetSightingRequests.deleteTargetSighting.mock.calls[0][1]).toBe(2)
      expect(TargetSightingRequests.deleteTargetSighting).toHaveBeenCalledTimes(1)

      expect(SnackbarUtil.render).toHaveBeenCalledTimes(0)
    })


    it('re-adds when delete fails', () => {
      TargetSightingRequests.deleteTargetSighting = jest.fn((isAlphanum, id, successCallback, failureCallback) => failureCallback())

      TargetSightingOperations.deleteSavedTargetSighting(dispatch)(ts)

      expect(dispatch).toHaveBeenCalledWith(action.deleteTargetSighting(ts))
      expect(dispatch).toHaveBeenCalledWith(action.addTargetSighting(ts, assignment))
      expect(dispatch).toHaveBeenCalledTimes(2)

      expect(TargetSightingRequests.deleteTargetSighting.mock.calls[0][0]).toBe(true)
      expect(TargetSightingRequests.deleteTargetSighting.mock.calls[0][1]).toBe(2)
      expect(TargetSightingRequests.deleteTargetSighting).toHaveBeenCalledTimes(1)

      expect(SnackbarUtil.render).toHaveBeenCalledWith('Failed to delete target sighting')
      expect(SnackbarUtil.render).toHaveBeenCalledTimes(1)
    })
  })

  describe('saveTargetSighting', () => {
    it('saves successfully correctly', () => {
      const expected = localTs.delete('type').delete('localId').set('creator', 'MDLC')
      const returned = expected.set('id', 2)
      TargetSightingRequests.saveTargetSighting = jest.fn((isAlphanum, assignmentId, sighting, successCallback, failureCallback) => successCallback(returned.toJS()))

      TargetSightingOperations.saveTargetSighting(dispatch)(localTs)

      expect(dispatch).toHaveBeenCalledWith(action.startSaveTargetSighting(localTs.get('localId')))
      expect(dispatch).toHaveBeenCalledWith(action.succeedSaveTargetSighting(returned.set('type', 'alphanum'), localTs.get('localId')))
      expect(dispatch).toHaveBeenCalledTimes(2)

      expect(TargetSightingRequests.saveTargetSighting.mock.calls[0][0]).toBe(true)
      expect(TargetSightingRequests.saveTargetSighting.mock.calls[0][1]).toBe(11)
      expect(TargetSightingRequests.saveTargetSighting.mock.calls[0][2]).toEqual(expected.toJS())
      expect(TargetSightingRequests.saveTargetSighting).toHaveBeenCalledTimes(1)

      expect(SnackbarUtil.render).toHaveBeenCalledWith('Succesfully saved target sighting')
      expect(SnackbarUtil.render).toHaveBeenCalledTimes(1)
    })

    it('fails to save correctly', () => {
      const expected = localTs.delete('type').delete('localId').set('creator', 'MDLC')
      TargetSightingRequests.saveTargetSighting = jest.fn((isAlphanum, assignmentId, sighting, successCallback, failureCallback) => failureCallback())

      TargetSightingOperations.saveTargetSighting(dispatch)(localTs)

      expect(dispatch).toHaveBeenCalledWith(action.startSaveTargetSighting(localTs.get('localId')))
      expect(dispatch).toHaveBeenCalledWith(action.failSaveTargetSighting(localTs.get('localId')))
      expect(dispatch).toHaveBeenCalledTimes(2)

      expect(TargetSightingRequests.saveTargetSighting.mock.calls[0][0]).toBe(true)
      expect(TargetSightingRequests.saveTargetSighting.mock.calls[0][1]).toBe(11)
      expect(TargetSightingRequests.saveTargetSighting.mock.calls[0][2]).toEqual(expected.toJS())
      expect(TargetSightingRequests.saveTargetSighting).toHaveBeenCalledTimes(1)

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

      TargetSightingRequests.updateTargetSighting = jest.fn((isAlphanum, id, sighting, successCallback, failureCallback) => successCallback(returned.toJS()))

      TargetSightingOperations.updateTargetSighting(dispatch)(savedTs, attrib)

      expect(dispatch).toHaveBeenCalledWith(action.startUpdateTargetSighting(savedTs, attrib))
      expect(dispatch).toHaveBeenCalledWith(action.succeedUpdateTargetSighting(final, attrib))
      expect(dispatch).toHaveBeenCalledTimes(2)

      expect(TargetSightingRequests.updateTargetSighting.mock.calls[0][0]).toBe(true)
      expect(TargetSightingRequests.updateTargetSighting.mock.calls[0][1]).toBe(2)
      expect(TargetSightingRequests.updateTargetSighting.mock.calls[0][2]).toEqual(sentTs.toJS())
      expect(TargetSightingRequests.updateTargetSighting).toHaveBeenCalledTimes(1)

      expect(SnackbarUtil.render).toHaveBeenCalledWith('Succesfully updated target sighting')
      expect(SnackbarUtil.render).toHaveBeenCalledTimes(1)
    })

    it('updates target in target sighting correctly', () => {
      const tgt = fromJS({id: 30})
      const tgtAttrib = attrib.set('target', tgt)

      const savedTs = ts.set('localTargetId', '23:63:2048').set('creator', 'MDLC')
      const sentTs = ts.set('color', 'green').delete('type').delete('geotag').delete('id').set('target', tgt)
      const returned = ts.set('color', 'green').delete('type').set('creator', 'MDLC').set('target', tgt)
      const final = returned.set('type', ts.get('type')).update('target', t => t.set('type', ts.get('type')))

      TargetSightingRequests.updateTargetSighting = jest.fn((isAlphanum, id, sighting, successCallback, failureCallback) => successCallback(returned.toJS()))

      TargetSightingOperations.updateTargetSighting(dispatch)(savedTs, tgtAttrib)

      expect(dispatch).toHaveBeenCalledWith(action.startUpdateTargetSighting(savedTs, tgtAttrib))
      expect(dispatch).toHaveBeenCalledWith(action.succeedUpdateTargetSighting(final, tgtAttrib))
      expect(dispatch).toHaveBeenCalledTimes(2)

      expect(TargetSightingRequests.updateTargetSighting.mock.calls[0][0]).toBe(true)
      expect(TargetSightingRequests.updateTargetSighting.mock.calls[0][1]).toBe(2)
      expect(TargetSightingRequests.updateTargetSighting.mock.calls[0][2]).toEqual(sentTs.toJS())
      expect(TargetSightingRequests.updateTargetSighting).toHaveBeenCalledTimes(1)

      expect(SnackbarUtil.render).toHaveBeenCalledWith('Succesfully updated target sighting')
      expect(SnackbarUtil.render).toHaveBeenCalledTimes(1)
    })

    it('fails to update target sighting correctly', () => {
      const savedTs = ts.set('localTargetId', '23:63:2048').set('creator', 'MDLC')
      const sentTs = ts.set('color', 'green').delete('type').delete('geotag').delete('id')

      TargetSightingRequests.updateTargetSighting = jest.fn((isAlphanum, id, sighting, successCallback, failureCallback) => failureCallback())

      TargetSightingOperations.updateTargetSighting(dispatch)(savedTs, attrib)

      expect(dispatch).toHaveBeenCalledWith(action.startUpdateTargetSighting(savedTs, attrib))
      expect(dispatch).toHaveBeenCalledWith(action.failUpdateTargetSighting(savedTs, attrib))

      expect(TargetSightingRequests.updateTargetSighting.mock.calls[0][0]).toBe(true)
      expect(TargetSightingRequests.updateTargetSighting.mock.calls[0][1]).toBe(2)
      expect(TargetSightingRequests.updateTargetSighting.mock.calls[0][2]).toEqual(sentTs.toJS())
      expect(TargetSightingRequests.updateTargetSighting).toHaveBeenCalledTimes(1)

      expect(SnackbarUtil.render).toHaveBeenCalledWith('Failed to update target sighting')
      expect(SnackbarUtil.render).toHaveBeenCalledTimes(1)
    })
  })

  describe('saveROISighting', () => {
    const localPixelTs = fromJS({
      localId: '12:23:4213',
      shape: 'trapezoid',
      shapeColor: 'red',
      alpha: 'r',
      alphaColor: 'blue',
      type: 'alphanum',
      offaxis: false,
      mdlcClassConf: 'low',
      height: 100,
      width: 100,
      pixelX: 123,
      pixelY: 321,
      assignment: assignment
    })

    const expectedToSend = fromJS({
      pixelX: 123,
      pixelY: 321,
      assignment: assignment,
      creator: 'MDLC'
    })

    it('saves successfully correctly', () => {
      const returned = expectedToSend.set('id', 2)
      const toSave = returned.set('type', 'roi')
        .set('height', localPixelTs.get('height'))
        .set('width', localPixelTs.get('width'))

      TargetSightingRequests.saveROISighting = jest.fn((assignmentId, sighting, successCallback, failureCallback) => successCallback(returned.toJS()))

      TargetSightingOperations.saveROISighting(dispatch)(localPixelTs)

      expect(dispatch).toHaveBeenCalledWith(action.startSaveTargetSighting(localTs.get('localId')))
      expect(dispatch).toHaveBeenCalledWith(action.succeedSaveTargetSighting(toSave, localTs.get('localId')))
      expect(dispatch).toHaveBeenCalledTimes(2)

      expect(TargetSightingRequests.saveROISighting.mock.calls[0][0]).toBe(11)
      expect(TargetSightingRequests.saveROISighting.mock.calls[0][1]).toEqual(expectedToSend.toJS())
      expect(TargetSightingRequests.saveROISighting).toHaveBeenCalledTimes(1)

      expect(SnackbarUtil.render).toHaveBeenCalledWith('Succesfully saved ROI sighting')
      expect(SnackbarUtil.render).toHaveBeenCalledTimes(1)
    })

    it('fails to save correctly', () => {
      TargetSightingRequests.saveROISighting = jest.fn((assignmentId, sighting, successCallback, failureCallback) => failureCallback())

      TargetSightingOperations.saveROISighting(dispatch)(localPixelTs)

      expect(dispatch).toHaveBeenCalledWith(action.startSaveTargetSighting(localTs.get('localId')))
      expect(dispatch).toHaveBeenCalledWith(action.failSaveTargetSighting(localTs.get('localId')))
      expect(dispatch).toHaveBeenCalledTimes(2)

      expect(TargetSightingRequests.saveROISighting.mock.calls[0][0]).toBe(11)
      expect(TargetSightingRequests.saveROISighting.mock.calls[0][1]).toEqual(expectedToSend.toJS())
      expect(TargetSightingRequests.saveROISighting).toHaveBeenCalledTimes(1)

      expect(SnackbarUtil.render).toHaveBeenCalledWith('Failed to save ROI sighting')
      expect(SnackbarUtil.render).toHaveBeenCalledTimes(1)
    })
  })

  describe('deleteSavedROISighting', () => {
    it('deletes when delete succeeds', () => {
      TargetSightingRequests.deleteROISighting = jest.fn((id, successCallback, failureCallback) => successCallback())

      TargetSightingOperations.deleteSavedROISighting(dispatch)(ts)

      expect(dispatch).toHaveBeenCalledWith(action.deleteTargetSighting(ts))
      expect(dispatch).toHaveBeenCalledTimes(1)

      //checks, for 0th call, the 0th argument
      expect(TargetSightingRequests.deleteROISighting.mock.calls[0][0]).toBe(2)
      expect(TargetSightingRequests.deleteROISighting).toHaveBeenCalledTimes(1)

      expect(SnackbarUtil.render).toHaveBeenCalledTimes(0)
    })


    it('re-adds when delete fails', () => {
      TargetSightingRequests.deleteROISighting = jest.fn((id, successCallback, failureCallback) => failureCallback())

      TargetSightingOperations.deleteSavedROISighting(dispatch)(ts)

      expect(dispatch).toHaveBeenCalledWith(action.deleteTargetSighting(ts))
      expect(dispatch).toHaveBeenCalledWith(action.addTargetSighting(ts, assignment))
      expect(dispatch).toHaveBeenCalledTimes(2)

      expect(TargetSightingRequests.deleteROISighting.mock.calls[0][0]).toBe(2)
      expect(TargetSightingRequests.deleteROISighting).toHaveBeenCalledTimes(1)

      expect(SnackbarUtil.render).toHaveBeenCalledWith('Failed to delete target sighting')
      expect(SnackbarUtil.render).toHaveBeenCalledTimes(1)
    })
  })
})
