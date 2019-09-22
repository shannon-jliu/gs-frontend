import 'jest-localstorage-mock'
import md5 from 'md5'

import AuthUtil from '../../util/authUtil.js'
import {AUTH_TOKEN_ID} from '../../constants/constants.js'

jest.mock('jquery')
const $ = require('jquery')

beforeEach(() => localStorage.clear())

describe('login', () => {
  const dummyCallback = (val, text) => {retVal = val}
  var retVal = undefined
  var retText = undefined

  it('should call the auth path with the correct params', () => {
    AuthUtil.login('test', 'password', dummyCallback)
    expect($.ajax).toHaveBeenCalledWith({
      complete: expect.any(Function),
      type: 'GET',
      url: '/api/v1/auth',
      headers: {
        Authorization: md5('password'),
        Username: 'test'
      }
    })
  })

  it('should return true and store the token if it succeeds with 200', async (done) => {
    const response = {
      status: 200,
      responseText: JSON.stringify({token: 'ecksdee'})
    }
    $.ajax.mock.calls[0][0].complete(response)

    // wait for the call to finish
    await AuthUtil.login('test', 'password', dummyCallback)
    expect(localStorage.getItem(AUTH_TOKEN_ID)).toEqual('ecksdee')
    expect(retVal).toEqual(true)
    done()
  })

  it('should return false and populate responseText if it fails with non 200', async (done) => {
    const response = {
      status: 400,
      responseText: 'Failed'
    }
    $.ajax.mock.calls[0][0].complete(response)

    // wait for the call to finish
    await AuthUtil.login('test', 'password', dummyCallback)
    expect(localStorage.getItem(AUTH_TOKEN_ID)).toBeNull()
    expect(retVal).toEqual(false)
    done()
  })
})

describe('storeToken', () => {
  it('should set stored token properly', () => {
    AuthUtil.storeToken('test')
    expect(localStorage.getItem(AUTH_TOKEN_ID)).toEqual('test')
  })

  it('can overwrite stored token', () => {
    AuthUtil.storeToken('test')
    expect(localStorage.getItem(AUTH_TOKEN_ID)).toEqual('test')
    AuthUtil.storeToken('test2')
    expect(localStorage.getItem(AUTH_TOKEN_ID)).toEqual('test2')
  })
})
