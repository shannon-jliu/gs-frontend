import React from 'react'
import renderer from 'react-test-renderer'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import TargetAlphanumFields from '../../../../pages/merge/components/targetAlphanumFields'

Enzyme.configure({ adapter: new Adapter() })

describe('TargetAlphanumFields', () => {
  const props = {
    shape: 'circle',
    shapeColor: 'black',
    alpha: 'A',
    alphaColor: 'white',
    getHandler: () => () => false
  }

  let wrapper
  beforeEach(() => {
    wrapper = shallow(<TargetAlphanumFields {...props} />)
  })

  it('renders correctly', () => {
    expect(wrapper).toBeDefined()
  })

  it('renders all the selectors correctly', () => {
    expect(wrapper.find('ShapeSelect')).toHaveLength(1)
    expect(wrapper.find('ColorSelect')).toHaveLength(2)
    expect(wrapper.find('input')).toHaveLength(1)
  })

  it('renders the values correctly', () => {
    expect(wrapper.find('ShapeSelect').first().props().value).toEqual('circle')
    expect(wrapper.find('ColorSelect').first().props().value).toEqual('black')
    expect(wrapper.find('ColorSelect').at(1).props().value).toEqual('white')
    expect(wrapper.find('input').first().props().value).toEqual('A')
  })
})
