import React from 'react'
import renderer from 'react-test-renderer'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import ImageTools from '../../../pages/tag/imageTools'

Enzyme.configure({ adapter: new Adapter() })

describe('Basic tests no sightings', () => {
  let wrapper, instance
  const reset = jest.fn()
  beforeEach(() => {
    const props = {
      getHandler: jest.fn(),
      reset: reset,
      brightness: 100,
      contrast: 100,
      saturation: 100,
    }
    wrapper = shallow(<ImageTools {...props} />)
    instance = wrapper.instance()
  })

  it('renders correctly', () => {
    expect(wrapper).toBeDefined()
  })

  it('renders the sliders', () => {
    const sliders = wrapper.find('Slider')
    expect(sliders).toHaveLength(3)
  })

  it('calls reset properly', () => {
    const resetButton = wrapper.find('button').first()
    resetButton.simulate('click')
    expect(reset).toHaveBeenCalledTimes(1)
  })
})
