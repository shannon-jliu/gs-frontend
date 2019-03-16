import $ from 'jquery'
import _ from 'lodash'
// non-GET requests here

export const TargetSightingRequests = {
  deleteTargetSighting: function(isAlphanum, id, successCallback, failureCallback) {
    $.ajax('/api/v1/' + (isAlphanum ? 'alphanum' : 'emergent') + '_target_sighting/' + id, {method: 'DELETE'})
      .done(successCallback)
      .fail(failureCallback)
  },

  saveTargetSighting: function(isAlphanum, assignmentId, sighting, successCallback, failureCallback) {
    $.post('/api/v1/assignment/' + assignmentId + (isAlphanum ? '/alphanum' : '/emergent') + '_target_sighting', sighting)
      .done(successCallback)
      .fail(failureCallback)
  },

  updateTargetSighting: function(isAlphanum, id, sighting, successCallback, failureCallback) {
    $.ajax('/api/v1/' + (isAlphanum ? 'alphanum' : 'emergent') + '_target_sighting/' + id,
      {method: 'PUT', data: sighting})
      .done(successCallback)
      .fail(failureCallback)
  },

  // TODO doesn't exist on backend yet
  // deleteROISighting: function(id, successCallback, failureCallback) {
  //   $.ajax('/api/v1/roi/sighting/' + id, {method: 'DELETE'})
  //     .done(successCallback)
  //     .fail(failureCallback)
  // },

  saveROISighting: function(assignmentId, sighting, successCallback, failureCallback) {
    $.post('/api/v1/assignment/' + assignmentId +'/roi', sighting)
      .done(successCallback)
      .fail(failureCallback)
  }
}

export const targetRequests = {
  deleteTarget: function(id, successCallback, failureCallback) {
    //no option for emergent bc it shouldn't be deleted
    $.ajax('/api/v1/alphanum_target/' + id, {method: 'DELETE'})
      .done(successCallback)
      .fail(failureCallback)
  },

  saveTarget: function(target, successCallback, failureCallback) {
    //no option for emergent bc it shouldn't be created here
    $.post('/api/v1/alphanum_target/', target)
      .done(successCallback)
      .fail(failureCallback)
  },

  updateTarget: function(isAlphanum, id, target, successCallback, failureCallback) {
    $.ajax('/api/v1/' + (isAlphanum ? 'alphanum' : 'emergent') + '_target/' + id,
      {method: 'PUT', data: target})
      .done(successCallback)
      .fail(failureCallback)
  }
}

export const AssignmentRequests = {
  updateAssignment: function(assignment, successCallback, failureCallback) {
    $.ajax('/api/v1/assignment/' + assignment.id,
      {method: 'PUT', data: _.assign({}, assignment, { done: true })})
      .done(successCallback)
      .fail(failureCallback)
  },

  requestWork: function(successCallback, failureCallback) {
    $.post('/api/v1/assignment/work/MDLC')
      .done(successCallback)
      .fail(failureCallback)
  }
}

export const SettingsRequest = {
  updateSetting: function(route, settings, successCallback, failureCallback) {
    $.post(route, settings)
      .done(successCallback)
      .fail(failureCallback)
  },

  updateAirdropSetting: function(settings, successCallback, failureCallback) {
    // TODO: Find correct route
    SettingsRequest.updateSetting('/api/v1/settings/airdrop', settings, successCallback, failureCallback)
  },

  updateCameraSetting: function(settings, successCallback, failureCallback) {
    // TODO: Find correct route
    SettingsRequest.updateSetting('/api/v1/settings/camera/types', settings, successCallback, failureCallback)
  },

  updateGimbalSetting: function(settings, successCallback, failureCallback) {
    // TODO: Find correct route
    SettingsRequest.updateSetting('/api/set-mode', settings, successCallback, failureCallback)
  }
}
