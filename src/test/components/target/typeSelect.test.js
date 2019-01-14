import React from 'react'
import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import TypeSelect from '../../../components/target/typeSelect.js'

Enzyme.configure({ adapter: new Adapter() })

it('renders without crashing', () => {
  const div = document.createElement('div')
  const props = {
    onChange: jest.fn(() => 'onChange'),
    title: 'Type'
  }
  ReactDOM.render(<TypeSelect {...props}/>, div)
})

describe('TypeSelect tests with default value', () => {
  let wrapper, props
  beforeEach(() => {
    props = {
      onChange: jest.fn(() => 'onChange'),
      value: 'emergent',
      title: 'Type'
    }
    wrapper = mount(<TypeSelect {...props} />)
  })

  it('renders all the options correctly', () => {
    expect(wrapper.find('option')).toHaveLength(2)
  })

  it('renders the default value correctly', () => {
    const select = wrapper.find('select').first()
    expect(select.prop('defaultValue')).toContain('emergent')
  })

  it('renders label correctly', () => {
    const label = wrapper.find('label').first()
    expect(label.text()).toContain('Type')
  })

  it('calls onChange properly', () => {
    const select = wrapper.find('select').first()
    select.simulate('change', {target: 'alphanum'})
    expect(props.onChange).toHaveBeenCalled()
  })
})

describe('TypeSelect tests without default value', () => {
  it('renders without default value correctly', () => {
    const props = {
      onChange: jest.fn(() => 'onChange'),
      title: 'Type'
    }
    const wrapper = mount(<TypeSelect {...props} />)
    const select = wrapper.find('select').first()
    expect(select.prop('defaultValue')).toBeUndefined()
  })
})
