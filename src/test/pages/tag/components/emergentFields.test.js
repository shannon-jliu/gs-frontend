import React from 'react'
import renderer from 'react-test-renderer'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import EmergentFields from '../../../../pages/tag/components/emergentFields'

Enzyme.configure({ adapter: new Adapter() })

describe('Base tests', () => {
  let props, wrapper
  beforeEach(() => {
    props = {
      description: 'test',
      getHandler: jest.fn((x) => () => 'getHandler' + x),
    }
    wrapper = shallow(<EmergentFields {...props} />)
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
