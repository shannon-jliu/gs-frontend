import $ from 'jquery'
import _ from 'lodash'
// non-GET requests here

export const PlaneSystemRequests = {
  startPanSearch: function (
    successCallback,
    failureCallback
  ) {
    $.ajax(
      'api/v1/progress/pan-search/',
      { method: 'POST' }
    )
      .done(successCallback)
      .fail(failureCallback)
  },
  startManualSearch: function (
    successCallback,
    failureCallback
  ) {
    $.ajax(
      'api/v1/progress/manual-search/',
      { method: 'POST' }
    )
      .done(successCallback)
      .fail(failureCallback)
  },
  startDistanceSearch: function (
    successCallback,
    failureCallback
  ) {
    $.ajax(
      'api/v1/progress/distance-search/',
      { method: 'POST' }
    )
      .done(successCallback)
      .fail(failureCallback)
  },
  startTimeSearch: function (
    inactive,
    active,
    successCallback,
    failureCallback
  ) {
    $.ajax(
      'api/v1/progress/time-search/',
      { method: 'POST', headers: { 'inactive': inactive, 'active': active } }
    )
      .done(successCallback)
      .fail(failureCallback)
  },
  saveGimbalPosition: function (
    roll,
    pitch,
    successCallback,
    failureCallback
  ) {
    $.ajax(
      'api/v1/progress/set-gimbal/',
      { method: 'POST', headers: { 'roll': roll, 'pitch': pitch } }
    )
      .done(successCallback)
      .fail(failureCallback)
  },
  saveFocalLength: function (
    focalLength,
    successCallback,
    failureCallback
  ) {
    $.ajax(
      '/api/v1/progress/focal-len/',
      { method: 'POST', headers: { 'focalLength': focalLength } })
      .done(successCallback)
      .fail(failureCallback)
  },
  saveZoomLevel: function (
    level,
    successCallback,
    failureCallback
  ) {
    $.ajax(
      '/api/v1/progress/set-zoom-level/',
      { method: 'POST', headers: { 'level': level } })
      .done(successCallback)
      .fail(failureCallback)
  },
  captureImage: function (successCallback, failureCallback) {
    $.ajax('/api/v1/progress/capture/',
      { method: 'POST' })
      .done(successCallback)
      .fail(failureCallback)
  },
  savePlaneSystemMode: function (
    psMode,
    successCallback,
    failureCallback
  ) {
    $.ajax(
      '/api/v1/progress/' + psMode,
      { method: 'POST' })
      .done(successCallback)
      .fail(failureCallback)
  },
  savePlaneSystemModeTimeSearch: function (
    inactive,
    active,
    successCallback,
    failureCallback
  ) {
    $.ajax(
      '/api/v1/progress/time-search',
      { method: 'POST', headers: { 'inactive': inactive, 'active': active } })
      .done(successCallback)
      .fail(failureCallback)
  }
}

export const TargetSightingRequests = {
  getGeotag: function (targetId, ids, successCallback, failureCallback) {
    $.ajax(
      '/api/v1/alphanum_target/' + targetId + '/geotags',
      { method: 'PUT', data: ids }
    )
      .done(successCallback)
      .fail(failureCallback)
  },

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
      { method: 'DELETE', dataType: 'text' }
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

  //calls endpoint to send to autopilot
  sendTarget: function (target, successCallback, failureCallback) {
    $.ajax('/api/v1/alphanum_target/send/', { method: 'POST', data: target })
      .done(successCallback)
      .fail(failureCallback)
  }
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
