import React from 'react'
import renderer from 'react-test-renderer'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import TargetGeotagFields from '../../../../pages/merge/components/targetGeotagFields'

Enzyme.configure({ adapter: new Adapter() })

describe('TargetGeotagFields', () => {
  const props = {
    latitude: '42.448630',
    longitude: '-76.612752',
    getHandler: () => () => false
  }

  let wrapper
  beforeEach(() => {
    wrapper = shallow(<TargetGeotagFields {...props} />)
  })

  it('renders correctly', () => {
    expect(wrapper).toBeDefined()
  })

  it('renders all the selectors correctly', () => {
    expect(wrapper.find('input')).toHaveLength(2)
  })

  it('renders the values correctly', () => {
    expect(wrapper.find('input').first().props().value).toEqual('42.448630')
    expect(wrapper.find('input').at(1).props().value).toEqual('-76.612752')
  })
})
