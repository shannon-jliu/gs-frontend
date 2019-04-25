import React from 'react'
import ReactDOM from 'react-dom'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import ConfSelect from '../../../components/target/confSelect.js'

Enzyme.configure({ adapter: new Adapter() })

it('renders without crashing', () => {
  const div = document.createElement('div')
  const props = {
    onChange: jest.fn(() => 'onChange'),
    title: 'Confidence'
  }
  ReactDOM.render(<ConfSelect {...props}/>, div)
})

describe('ConfSelect tests', () => {
  let wrapper, props
  beforeEach(() => {
    props = {
      onChange: jest.fn(() => 'onChange'),
      value: 'HIGH',
      title: 'Confidence'
    }
    wrapper = mount(<ConfSelect {...props} />)
  })

  it('renders all the options correctly', () => {
    expect(wrapper.find('option')).toHaveLength(4)
  })

  it('renders the default value correctly', () => {
    const option = wrapper.find('option').first()
    expect(option.text()).toEqual('Confidence')
    expect(option.prop('disabled')).toBe(true)
  })

  it('renders the value correctly', () => {
    const select = wrapper.find('select')
    expect(select.prop('value')).toEqual('HIGH')
  })

  it('calls onChange properly', () => {
    const select = wrapper.find('select').first()
    select.simulate('change', {target: 'MEDIUM'})
    expect(props.onChange).toHaveBeenCalled()
  })
})

describe('ConfSelect tests without default value', () => {
  it('renders without default value correctly', () => {
    const props = {
      onChange: jest.fn(() => 'onChange'),
      title: 'Confidence'
    }
    const wrapper = mount(<ConfSelect {...props} />)
    const select = wrapper.find('select').first()
    expect(select.prop('value')).toEqual('')
  })
})
