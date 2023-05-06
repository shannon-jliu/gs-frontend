import $ from 'jquery'

import { AUTH_TOKEN_ID } from '../constants/constants.js'

var authenticated = !!localStorage.getItem(AUTH_TOKEN_ID)
var confirmedAuthentication = false
var userType = null

export const UserType = Object.freeze({
  Operator: Symbol("operator"),
  IntSys: Symbol("intsys"),
  Tagger: Symbol("tagger")
})

function confirmAuthentication() {
  let usernameObj = (localStorage.getItem(AUTH_TOKEN_ID) === null || localStorage.getItem(AUTH_TOKEN_ID) === undefined) ? {} : { Username: JSON.parse(localStorage.getItem(AUTH_TOKEN_ID)).username }
  var res = $.ajax({
    url: '/api/v1/odlcuser/create/mdlc',
    type: 'GET',
    headers: usernameObj,
    async: false
  })
  if (res && res.status && res.status !== 200) authenticated = false
  if (res && res.responseJSON) {
    if (res.responseJSON.userType === 'MDLCOPERATOR') userType = UserType.Operator
    if (res.responseJSON.userType === 'INTSYSTAGGER') userType = UserType.IntSys
  }
}

const AuthUtil = {
  // sends the auth request to obtain the auth token from ground-server
  login: function (username, callback) {
    $.ajax({
      url: '/api/v1/odlcuser/create/mdlc',
      type: 'GET',
      headers: {
        Username: username
      },
      complete: jqXHR => {
        if (jqXHR.status !== 200) return callback(false, jqXHR.responseText)
        AuthUtil.storeToken(jqXHR.responseText)
        callback(true)
      }
    })
  },
  storeToken: function (token) {
    // clear previous storage as the token is overwritten
    sessionStorage.clear()
    localStorage.setItem(AUTH_TOKEN_ID, token)
  },
  // determine if the user is already authenticated
  authenticated: function (usersEnabled) {
    // if the user does not have a token or it has logged in this session
    if (!usersEnabled) return true
    if (!authenticated || confirmedAuthentication) return authenticated
    confirmAuthentication()
    confirmedAuthentication = true
    return authenticated
  },
  // determine if this user is an operator user
  userType: function (usersEnabled) {
    if (!usersEnabled) return UserType.Operator
    if (confirmedAuthentication) return userType
    confirmAuthentication()
    confirmedAuthentication = true
    return userType
  },
  // determine if this user is an intsys tagger (for target annotation)
  logout: function () {
    sessionStorage.clear()
    localStorage.clear()
    authenticated = false
    confirmedAuthentication = false
    userType = UserType.Tagger
    window.location.assign('/login')
  }
}

export default AuthUtil
