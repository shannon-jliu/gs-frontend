import React from 'react'
import renderer from 'react-test-renderer'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import Slider from '../../../../pages/tag/components/slider'

Enzyme.configure({ adapter: new Adapter() })

describe('Basic tests no sightings', () => {
  let wrapper, instance
  const getHandler = jest.fn((id) => () => id)
  beforeEach(() => {
    wrapper = shallow(<Slider id='brightness' getHandler={getHandler} value={100} />)
    instance = wrapper.instance()
  })

  it('renders correctly', () => {
    expect(wrapper).toBeDefined()
  })

  it('renders the correct label', () => {
    const label = wrapper.find('p')
    expect(label.text()).toBe('Brightness: ')
  })

  it('calls getHandler properly', () => {
    const slider = wrapper.find('input').at(0)
    slider.simulate('change', {target: {value: 100}})
    expect(getHandler).toHaveBeenCalled()
  })
})
