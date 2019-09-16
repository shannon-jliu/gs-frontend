// put GET calls here
import $ from 'jquery'
import _ from 'lodash'

import { AUTH_TOKEN_ID } from '../constants/constants'

export const TargetGetRequests = {
  getAlphanumTargets: function(successCallback, failureCallback) {
    $.get('/api/v1/alphanum_target')
      .done(successCallback)
      .fail(failureCallback)
  },

  getEmergentTargets: function(successCallback, failureCallback) {
    $.get('/api/v1/emergent_target')
      .done(successCallback)
      .fail(failureCallback)
  }
}

export const TargetSightingGetRequests = {
  getAlphanumSightings: function(successCallback, failureCallback) {
    $.get('/api/v1/alphanum_target_sighting')
      .done(successCallback)
      .fail(failureCallback)
  },

  getEmergentSightings: function(successCallback, failureCallback) {
    $.get('/api/v1/emergent_target_sighting')
      .done(successCallback)
      .fail(failureCallback)
  }
}

export const AssignmentGetRequests = {
  getAllAssignmentsAfter: function(index, successCallback, failureCallback) {
    // grab ids that are created after the current id
    $.get('/api/v1/assignment/after/' + index)
      .done(successCallback)
      .fail(failureCallback)
  },

  getAllAssignments: function(successCallback, failureCallback) {
    // if undefined, auth is disabled, grab all assignments
    const route = _.isNull(localStorage.getItem(AUTH_TOKEN_ID))
      ? '/api/v1/assignment'
      : '/api/v1/assignment/user'
    $.get(route)
      .done(successCallback)
      .fail(failureCallback)
  }
}

export const SettingsGetRequests = {
  getSetting: function(route, successCallback, failureCallback) {
    $.get(route)
      .done(successCallback)
      .fail(failureCallback)
  },

  getAirdropSetting: function(successCallback, failureCallback) {
    SettingsGetRequests.getSetting('/api/v1/settings/airdrop/recent', successCallback, failureCallback)
  },

  getCameraSettingCapturing: function(successCallback, failureCallback) {
    SettingsGetRequests.getSetting('/api/continuous-capture', successCallback, failureCallback)
  },

  getCameraSettingZoom: function(successCallback, failureCallback) {
    SettingsGetRequests.getSetting('/api/dev/get-zoom', successCallback, failureCallback)
  },

  getCameraGimbalSetting: function(successCallback, failureCallback) {
    SettingsGetRequests.getSetting('/api/v1/settings/camera_gimbal/recent', successCallback, failureCallback)
  },

  getGimbalSettingsSetting: function(successCallback, failureCallback) {
    SettingsGetRequests.getSetting('/api/v1/settings/gimbal/recent', successCallback, failureCallback)
  }
}

export const FireworksGetRequests = {
  getSetting: function(route, successCallback, failureCallback) {
    $.get(route)
      .done(successCallback)
      .fail(failureCallback)
  },

  /* TODO: Finish implementing the Fireworks get request here. It should be almost identical to the get settings functions in the
  const SettingsGetRequests above. The only difference is the route, which for the fireworks get requests should be
  /api/v1/settings/fireworks/recent */
  getFireworksSetting: function(successCallback, failureCallback) {

  }
}
