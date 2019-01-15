import $ from 'jquery'
// non-GET requests here

export const targetSightingRequests = {
  deleteTargetSighting: function(isAlphanum, id, successCallback, failureCallback) {
    $.ajax('/api/v1/' + (isAlphanum ? 'alphanum' : 'emergent') + '_target_sighting/' + id, {method: 'DELETE'})
      .done(successCallback)
      .fail(failureCallback)
  },

  saveTargetSighting: function(isAlphanum, assignmentId, sighting, successCallback, failureCallback) {
    $.post('/api/v1/assignment/' + assignmentId + (isAlphanum ? '/alphanum' : '/emergent') + '_target_sighting/', sighting)
      .done(successCallback)
      .fail(failureCallback)
  },

  updateTargetSighting: function(isAlphanum, id, sighting, successCallback, failureCallback) {
    $.ajax('/api/v1/' + (isAlphanum ? 'alphanum' : 'emergent') + '_target_sighting/' + id,
      {method: 'PUT', data: sighting})
      .done(successCallback)
      .fail(failureCallback)
  }
}
