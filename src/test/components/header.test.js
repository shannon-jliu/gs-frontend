import React from 'react'
import ReactDOM from 'react-dom'
import { shallow, configure, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import configureMockStore from 'redux-mock-store'
import { fromJS } from 'immutable'

import AuthUtil from '../../util/authUtil'
import { Header } from '../../components/header.js'

configure({ adapter: new Adapter() })
// Create mock store
const mockStore = configureMockStore()

describe('navbar tests with operator', () => {
  let wrapper, store

  beforeEach(() => {
    wrapper = mount(<Header authenticated={true} operator={true} />)
  })

  it ('renders correctly', () => {
    expect(wrapper).toBeDefined()
  })

  it ('renders all seven page links', () => {
    expect(wrapper.find('li')).toHaveLength(7)
  })
})

describe('navbar tests without operator', () => {
  let wrapper, store

  beforeEach(() => {
    wrapper = mount(<Header authenticated={true} operator={false} />)
  })

  it ('renders correctly', () => {
    expect(wrapper).toBeDefined()
  })

  it ('renders only Login and Tag', () => {
    const linksWrapper = wrapper.find('li')
    expect(linksWrapper).toHaveLength(6)
    expect(linksWrapper.first().find('a').first().text()).toEqual('Login')
    expect(linksWrapper.at(1).find('a').first().text()).toEqual('Logout')
    expect(linksWrapper.at(2).find('a').first().text()).toEqual('Tagging')
  })
})
