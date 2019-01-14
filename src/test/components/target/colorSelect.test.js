import React from 'react'
import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import ColorSelect from '../../../components/target/colorSelect.js'

Enzyme.configure({ adapter: new Adapter() })

it('renders without crashing', () => {
  const div = document.createElement('div')
  const props = {
    onChange: jest.fn(() => 'onChange'),
    title: 'Color'
  }
  ReactDOM.render(<ColorSelect {...props}/>, div)
})

describe('colorSelect.js tests', () => {
  let wrapper, props
  beforeEach(() => {
    props = {
      onChange: jest.fn(() => 'onChange'),
      value: 'gray',
      title: 'Color'
    }
    wrapper = mount(<ColorSelect {...props} />)
  })

  it('renders all the options correctly', () => {
    expect(wrapper.find('option')).toHaveLength(10)
  })

  it('renders the default value correctly', () => {
    const select = wrapper.find('select').first()
    expect(select.prop('defaultValue')).toContain('gray')
  })

  it('renders label correctly', () => {
    const label = wrapper.find('label').first()
    expect(label.text()).toContain('Color')
  })

  it('calls onChange properly', () => {
    const select = wrapper.find('select').first()
    select.simulate('change', {target: 'red'})
    expect(props.onChange).toHaveBeenCalled()
  })
})

describe('TypeSelect tests without default value', () => {
  it('renders without default value correctly', () => {
    const props = {
      onChange: jest.fn(() => 'onChange'),
      title: 'Color'
    }
    const wrapper = mount(<ColorSelect {...props} />)
    const select = wrapper.find('select').first()
    expect(select.prop('defaultValue')).toBeUndefined()
  })
})
