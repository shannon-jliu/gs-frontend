import React from 'react'
import ReactDOM from 'react-dom'
import 'jest-localstorage-mock'
import { configure, mount, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import configureMockStore from 'redux-mock-store'
import { fromJS } from 'immutable'

import * as matchers from 'jest-immutable-matchers'

import { Login } from '../../../pages/login/login.js'
import AuthUtil from '../../../util/authUtil.js'
import SnackbarUtil from '../../../util/snackbarUtil.js'

AuthUtil.authenticated = jest.fn()

configure({ adapter: new Adapter() })
// Create mock store
const mockStore = configureMockStore()

describe('Login Component', () => {
  let wrapper, store

  beforeEach(() => {
    jest.addMatchers(matchers)

    const settings = fromJS({
      usersEnabled: true
    })

    const overMap = fromJS(settings)

    store = mockStore(overMap)
    wrapper = mount(<Login
      utilSettings={overMap}
      store={store} />
    )
  })


  describe('componentDidMount', () => {
    const loginObj = new Login({
      utilSettings: fromJS({
        usersEnabled: true
      })
    })
    loginObj.state = {
      username: 'Ram',
    }
    window.location.assign = jest.fn()

    it('should redir to tag if authenticated and login not forced', () => {
      AuthUtil.authenticated.mockReturnValueOnce(true)
      loginObj.redirect('/login')
      expect(window.location.assign).toHaveBeenCalledWith('/tag')
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
    }

    it('should call login with the correct params', () => {
      loginObj.login()
      expect(AuthUtil.login).toHaveBeenCalledWith('Ram', expect.any(Function))
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

  it('renders without crashing', () => {
    AuthUtil.authenticated.mockReturnValueOnce(false)
    const div = document.createElement('div')
    ReactDOM.render(wrapper, div)
  })
})
