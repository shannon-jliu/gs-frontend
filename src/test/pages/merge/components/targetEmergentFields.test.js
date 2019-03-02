import React from 'react'
import renderer from 'react-test-renderer'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import TargetEmergentFields from '../../../../pages/merge/components/targetEmergentFields'

Enzyme.configure({ adapter: new Adapter() })

describe('TargetEmergentFields', () => {
  const props = {
    description: 'test',
    getHandler: () => () => false
  }
  let wrapper
  beforeEach(() => {
    wrapper = shallow(<TargetEmergentFields {...props} />)
  })

  it('renders correctly', () => {
    expect(wrapper).toBeDefined()
  })

  it('renders all the selectors correctly', () => {
    expect(wrapper.find('input')).toHaveLength(1)
  })

  it('renders the value correctly', () => {
    expect(wrapper.find('input').first().props().value).toEqual('test')
  })
})
