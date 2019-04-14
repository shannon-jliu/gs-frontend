import React from 'react'
import ReactDOM from 'react-dom'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import AuthUtil from '../../util/authUtil'
import Header from '../../components/header.js'

Enzyme.configure({ adapter: new Adapter() })

describe('navbar tests with admin', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(<Header />)
    AuthUtil.admin = jest.fn(() => true)
  })

  it ('renders correctly', () => {
    expect(wrapper).toBeDefined()
  })

  it ('renders all six page links', () => {
    expect(wrapper.find('li')).toHaveLength(6)
  })
})

describe('navbar tests without admin', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(<Header />)
    AuthUtil.admin = jest.fn(() => false)
  })

  it ('renders correctly', () => {
    expect(wrapper).toBeDefined()
  })

  it ('renders only Login and Tag', () => {
    const linksWrapper = wrapper.find('li')
    expect(linksWrapper).toHaveLength(2)
    expect(linksWrapper.first().find('a').first().text()).toEqual('Login')
    expect(linksWrapper.at(1).find('a').first().text()).toEqual('Tagging')
  })
})
