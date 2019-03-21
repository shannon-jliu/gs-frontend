// put GET calls here
import $ from 'jquery'
import _ from 'lodash'

import { AUTH_TOKEN_ID } from '../constants/constants'

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
    // TODO: Find correct route
    SettingsGetRequests.getSetting('/api/v1/settings/airdrop', successCallback, failureCallback)
  },

  getCameraSettingCapturing: function(successCallback, failureCallback) {
    // TODO: Find correct route
    SettingsGetRequests.getSetting('/api/continuous-capture', successCallback, failureCallback)
  },

  getCameraSettingZoom: function(successCallback, failureCallback) {
    // TODO: Find correct route
    SettingsGetRequests.getSetting('/api/dev/get-zoom', successCallback, failureCallback)
  },

  getGimbalSetting: function(successCallback, failureCallback) {
    // TODO: Find correct route
    SettingsGetRequests.getSetting('/api/v1/settings/camera_gimbal/recent', successCallback, failureCallback)
  }
}
