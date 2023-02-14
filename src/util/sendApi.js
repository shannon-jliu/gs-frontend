import $ from 'jquery'
import _ from 'lodash'
// non-GET requests here

export const TargetSightingRequests = {
  deleteTargetSighting: function (
    isAlphanum,
    id,
    successCallback,
    failureCallback
  ) {
    $.ajax(
      '/api/v1/' +
        (isAlphanum ? 'alphanum' : 'emergent') +
        '_target_sighting/' +
        id,
      { method: 'DELETE' }
    )
      .done(successCallback)
      .fail(failureCallback)
  },

  saveTargetSighting: function (
    isAlphanum,
    assignmentId,
    sighting,
    successCallback,
    failureCallback
  ) {
    $.post(
      '/api/v1' +
        (isAlphanum ? '/alphanum' : '/emergent') +
        '_target_sighting/assignment/' +
        assignmentId,
      sighting
    )
      .done(successCallback)
      .fail(failureCallback)
  },

  updateTargetSighting: function (
    isAlphanum,
    id,
    sighting,
    successCallback,
    failureCallback
  ) {
    $.ajax(
      '/api/v1/' +
        (isAlphanum ? 'alphanum' : 'emergent') +
        '_target_sighting/' +
        id,
      { method: 'PUT', data: sighting }
    )
      .done(successCallback)
      .fail(failureCallback)
  },

  deleteROISighting: function (id, successCallback, failureCallback) {
    $.ajax('/api/v1/roi/' + id, { method: 'DELETE' })
      .done(successCallback)
      .fail(failureCallback)
  },

  saveROISighting: function (
    assignmentId,
    sighting,
    successCallback,
    failureCallback
  ) {
    $.post('/api/v1/roi/' + assignmentId, sighting)
      .done(successCallback)
      .fail(failureCallback)
  },
}

export const targetRequests = {
  deleteTarget: function (id, successCallback, failureCallback) {
    //no option for emergent bc it shouldn't be deleted
    $.ajax('/api/v1/alphanum_target/' + id, { method: 'DELETE' })
      .done(successCallback)
      .fail(failureCallback)
  },

  //deletes all targets in database
  deleteAllTargets: function (successCallback, failureCallback) {
    $.ajax('/api/v1/alphanum_target', { method: 'DELETE' })
      .done(successCallback)
      .fail(failureCallback)
  },

  saveTarget: function (target, successCallback, failureCallback) {
    //no option for emergent bc it shouldn't be created here

    $.post('/api/v1/alphanum_target', target)
      .done(successCallback)
      .fail(failureCallback)
  },

  updateTarget: function (
    isAlphanum,
    id,
    target,
    successCallback,
    failureCallback
  ) {
    $.ajax(
      '/api/v1/' + (isAlphanum ? 'alphanum' : 'emergent') + '_target/' + id,
      { method: 'PUT', data: target }
    )
      .done(successCallback)
      .fail(failureCallback)
  },
}

export const AssignmentRequests = {
  updateAssignment: function (assignment, successCallback, failureCallback) {
    $.ajax('/api/v1/assignment/' + assignment.id, {
      method: 'PUT',
      data: _.assign({}, assignment, { done: true }),
    })
      .done(successCallback)
      .fail(failureCallback)
  },

  requestWork: function (successCallback, failureCallback) {
    $.post('/api/v1/assignment/work')
      .done(successCallback)
      .fail(failureCallback)
  },

  enableReceiving: function (enable, successCallback, failureCallback) {
    $.ajax('/api/v1/assignment/enable', {
      method: 'POST',
      data: { enable: enable },
    })
      .done(successCallback)
      .fail(failureCallback)
  },
}

export const SettingsRequest = {
  updateSetting: function (route, settings, successCallback, failureCallback) {
    $.post(route, settings).done(successCallback).fail(failureCallback)
  },

  updateCameraSetting: function (settings, successCallback, failureCallback) {
    SettingsRequest.updateSetting(
      '/api/v1/settings/camera',
      settings,
      successCallback,
      failureCallback
    )
  },

  updateCameraGimbalSetting: function (
    settings,
    successCallback,
    failureCallback
  ) {
    SettingsRequest.updateSetting(
      '/api/v1/settings/camera_gimbal',
      settings,
      successCallback,
      failureCallback
    )
  },

  updateGimbalSettingsSetting: function (
    settings,
    successCallback,
    failureCallback
  ) {
    SettingsRequest.updateSetting(
      '/api/v1/settings/gimbal',
      settings,
      successCallback,
      failureCallback
    )
  },

  updateFiveTargetsSetting: function (
    settings,
    successCallback,
    failureCallback
  ) {
    SettingsRequest.updateSetting(
      'api/v1/settings/five_targets',
      settings,
      successCallback,
      failureCallback
    )
  },
}

export const UtilRequests = {
  clearMdlc: function (successCallback, failureCallback) {
    $.ajax('/api/v1/util/clear_mdlc', { method: 'POST', dataType: 'html' })
      .done(successCallback)
      .fail(failureCallback)
  },
}
