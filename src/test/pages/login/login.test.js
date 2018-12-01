import React from 'react'
import ReactDOM from 'react-dom'
import 'jest-localstorage-mock'

import Login from '../../../pages/login/login.js'
import AuthUtil from '../../../util/authUtil.js'
import SnackbarUtil from '../../../util/snackbarUtil.js'

AuthUtil.authenticated = jest.fn()

it('renders without crashing', () => {
  AuthUtil.authenticated.mockReturnValueOnce(false)
  const div = document.createElement('div')
  ReactDOM.render(<Login />, div)
})

describe('componentDidMount', () => {
  const loginObj = new Login()
  window.location.assign = jest.fn()

  it('should redir to tag if authenticated and login not forced', () => {
    AuthUtil.authenticated.mockReturnValueOnce(true)
    loginObj.redirect('/login')
    expect( window.location.assign).toHaveBeenCalledWith('/tag')
  })

  it('should stay in login when forced', () => {
    AuthUtil.authenticated.mockReturnValueOnce(true)
    window.location.reload = jest.fn()
    loginObj.redirect('/login#force')
    expect(window.location.assign).toHaveBeenCalledWith('/login#forced')
    expect(window.location.reload).toHaveBeenCalledWith(true)
  })
})

describe('login', () => {
  AuthUtil.login = jest.fn()
  const loginObj = new Login()
  loginObj.state = {
    username: 'Ram',
    password: 'kkkkotlin'
  }

  it('should call login with the correct params', () => {
    loginObj.login()
    expect(AuthUtil.login).toHaveBeenCalledWith('Ram', 'kkkkotlin', expect.any(Function))
  })

  it('should redir to tag if login successful', () => {
    loginObj.loginCallback(true, null)
    expect(window.location.assign).toHaveBeenCalledWith('/tag')
  })

  it('should call snackbar if failed', () => {
    SnackbarUtil.render = jest.fn()
    loginObj.loginCallback(false, null)
    expect(SnackbarUtil.render).toHaveBeenCalledWith('Failed to login')

    loginObj.loginCallback(false, { responseText: 'test' })
    expect(SnackbarUtil.render).toHaveBeenCalledWith('test')
  })
})
