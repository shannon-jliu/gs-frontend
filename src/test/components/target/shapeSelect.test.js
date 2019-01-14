import React from 'react'
import ReactDOM from 'react-dom'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import ShapeSelect from '../../../components/target/shapeSelect.js'

Enzyme.configure({ adapter: new Adapter() })

it('renders without crashing', () => {
  const div = document.createElement('div')
  const props = {
    onChange: jest.fn(() => 'onChange'),
    title: 'Shape'
  }
  ReactDOM.render(<ShapeSelect {...props}/>, div)
})

describe('ShapeSelect tests', () => {
  let wrapper, props
  beforeEach(() => {
    props = {
      onChange: jest.fn(() => 'onChange'),
      value: 'square',
      title: 'Shape'
    }
    wrapper = mount(<ShapeSelect {...props} />)
  })

  it('renders all the options correctly', () => {
    expect(wrapper.find('option')).toHaveLength(13)
  })

  it('renders the default value correctly', () => {
    const select = wrapper.find('select').first()
    expect(select.prop('defaultValue')).toContain('square')
  })

  it('renders label correctly', () => {
    const label = wrapper.find('label').first()
    expect(label.text()).toContain('Shape')
  })

  it('calls onChange properly', () => {
    const select = wrapper.find('select').first()
    select.simulate('change', {target: 'circle'})
    expect(props.onChange).toHaveBeenCalled()
  })
})

describe('TypeSelect tests without default value', () => {
  it('renders without default value correctly', () => {
    const props = {
      onChange: jest.fn(() => 'onChange'),
      title: 'Shape'
    }
    const wrapper = mount(<ShapeSelect {...props} />)
    const select = wrapper.find('select').first()
    expect(select.prop('defaultValue')).toBeUndefined()
  })
})
