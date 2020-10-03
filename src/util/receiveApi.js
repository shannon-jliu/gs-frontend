// put GET calls here
import $ from 'jquery'
import _ from 'lodash'

import { AUTH_TOKEN_ID } from '../constants/constants'
import { GET_SETTINGS } from './config.js'

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
  getAllAssignments: function(successCallback, failureCallback) {
    $.get('/api/v1/assignment')
      .done(successCallback)
      .fail(failureCallback)
  },

  getNewImages: function(id, successCallback, failureCallback) {
    // get all images after id
    $.get('/api/v1/image/all/' + id)
      .done(successCallback)
      .fail(failureCallback)
  }
}

export const SettingsGetRequests = {
  getSetting: function(route, successCallback, failureCallback) {
    if (GET_SETTINGS) $.get(route).done(successCallback).fail(failureCallback)
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

export const UtilGetRequests = {
  getUsersEnabled: function(successCallback, failureCallback) {
    $.get('/api/v1/odlcuser/enabled')
      .done(successCallback)
      .fail(failureCallback)
  }
}
