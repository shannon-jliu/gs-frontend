import React from 'react'
import renderer from 'react-test-renderer'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import AlphaNumFields from '../../../../pages/tag/components/alphanumFields'

Enzyme.configure({ adapter: new Adapter() })

describe('Base tests', () => {
  let props, wrapper
  beforeEach(() => {
    props = {
      shape: 'circle',
      shapeColor: 'black',
      alpha: 'A',
      alphaColor: 'white',
      isOffAxis: true,
      cameraTilt: true,
      handleKeyPress: jest.fn(() => 'handleKeyPress'),
      getHandler: jest.fn(() => () => 'getHandler'),
    }
    wrapper = shallow(<AlphaNumFields {...props} />)
  })

  it('renders correctly', () => {
    expect(wrapper).toBeDefined()
  })

  it('renders all the selectors correctly', () => {
    expect(wrapper.find('ShapeSelect')).toHaveLength(1)
    expect(wrapper.find('ColorSelect')).toHaveLength(2)
    expect(wrapper.find('input')).toHaveLength(2)
  })

  it('off-axis is checked by default', () => {
    const offAxis = wrapper.find('input').at(1)
    expect(offAxis.props().checked).toBe(true)
  })
})

describe('disabled offaxis by default', () => {
  let props, wrapper
  beforeEach(() => {
    props = {
      shape: 'circle',
      shapeColor: 'black',
      alpha: 'A',
      alphaColor: 'white',
      isOffAxis: false,
      cameraTilt: true,
      getHandler: jest.fn((x) => () => 'getHandler' + x),
    }
    wrapper = shallow(<AlphaNumFields {...props} />)
  })

  it('renders correctly', () => {
    expect(wrapper).toBeDefined()
  })

  it('off-axis is checked by default', () => {
    const offAxis = wrapper.find('input').at(1)
    expect(offAxis.props().checked).toBe(false)
  })
})

describe('No camera tilt', () => {
  let props, wrapper
  beforeEach(() => {
    props = {
      shape: 'circle',
      shapeColor: 'black',
      alpha: 'A',
      alphaColor: 'white',
      isOffAxis: false,
      cameraTilt: false,
      handleKeyPress: jest.fn(() => 'handleKeyPress'),
      getHandler: jest.fn((x) => () => 'getHandler' + x),
    }
    wrapper = shallow(<AlphaNumFields {...props} />)
  })

  it('renders correctly', () => {
    expect(wrapper).toBeDefined()
  })

  it('renders all the selectors correctly and not the off-axis switch', () => {
    const offAxisSwitch = wrapper.find('div').at(4)
    expect(offAxisSwitch.hasClass('hidden')).toBe(true)
  })
})
