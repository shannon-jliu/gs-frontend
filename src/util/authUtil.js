import $ from 'jquery'
import md5 from 'md5'

import {AUTH_TOKEN_ID} from '../constants/constants.js'

var authenticated = !!localStorage.getItem(AUTH_TOKEN_ID)
var confirmedAuthentication = false
var admin = false

function confirmAuthentication() {
  var res = $.ajax({
    url: '/api/v1/auth',
    type: 'GET',
    headers: {
      'X-AUTH-TOKEN': localStorage.getItem(AUTH_TOKEN_ID)
    },
    async: false
  })
  if (res.status !== 200) authenticated = false
  if (res.responseText === 'admin') admin = true
}

const AuthUtil = {
  // sends the auth request to obtain the auth token from ground-server
  login: function(username, password, callback) {
    $.ajax({
      url: '/api/v1/auth',
      type: 'GET',
      headers: {
        Authorization: md5(password),
        Username: username
      },
      complete: jqXHR => {
        if (jqXHR.status !== 200) return callback(false, jqXHR.responseText);
        AuthUtil.storeToken(JSON.parse(jqXHR.responseText).token);
        callback(true)
      }
    })
  },
  storeToken: function(token) {
    localStorage.setItem(AUTH_TOKEN_ID, token)
  },
  // determine if the user is already authenticated
  authenticated: function() {
    // if the user does not have a token or it has logged in this session
    if (!authenticated || confirmedAuthentication) return authenticated
    confirmAuthentication()
    confirmedAuthentication = true
    return authenticated
  },
  // determine if this user is an admin use
  admin: function() {
    if (confirmedAuthentication) return admin
    confirmAuthentication()
    confirmedAuthentication = true
    return admin
  }
}

export default AuthUtil
