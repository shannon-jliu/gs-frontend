import React from 'react'
import renderer from 'react-test-renderer'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import ButtonRow from '../../../../pages/tag/components/buttonRow'

Enzyme.configure({ adapter: new Adapter() })

describe('Base tests', () => {
  let props, wrapper
  beforeEach(() => {
    props = {
      type: 'Emergent',
      saveable: true,
      isSaved: false,
      deletable: true,
      save: jest.fn(() => 'save'),
      deleteSighting: jest.fn(() => 'delete'),
    }
    wrapper = shallow(<ButtonRow {...props} />)
  })

  it('renders correctly', () => {
    expect(wrapper).toBeDefined()
  })

  it('renders all the selectors correctly', () => {
    expect(wrapper.find('a')).toHaveLength(2)
  })

  it('calls the save method correctly', () => {
    const saveButton = wrapper.find('a').first()
    saveButton.simulate('click')
    expect(props.save).toHaveBeenCalled()
  })

  it('calls the delete method correctly', () => {
    const deleteButton = wrapper.find('a').at(1)
    deleteButton.simulate('click')
    expect(props.deleteSighting).toHaveBeenCalled()
  })
})

describe('not saveable', () => {
  let props, wrapper
  beforeEach(() => {
    props = {
      type: 'Emergent',
      save: jest.fn(() => 'save'),
      saveable: false,
      isSaved: false,
      deletable: true,
      deleteSighting: jest.fn(() => 'delete'),
    }
    wrapper = shallow(<ButtonRow {...props} />)
  })

  it('renders correctly', () => {
    expect(wrapper).toBeDefined()
  })

  it('correctly disables the button', () => {
    const saveButton = wrapper.find('a').first()
    expect(saveButton.hasClass('disabled')).toBeTruthy()
  })
})

describe('not deleteable', () => {
  let props, wrapper
  beforeEach(() => {
    props = {
      type: 'Emergent',
      save: jest.fn(() => 'save'),
      saveable: true,
      isSaved: false,
      deletable: false,
      deleteSighting: jest.fn(() => 'delete'),
    }
    wrapper = shallow(<ButtonRow {...props} />)
  })

  it('renders correctly', () => {
    expect(wrapper).toBeDefined()
  })

  it('correctly disables the button', () => {
    const deleteable = wrapper.find('a').at(1)
    expect(deleteable.hasClass('disabled')).toBeTruthy()
  })
})

describe('saved ts', () => {
  let props, wrapper
  beforeEach(() => {
    props = {
      type: 'Emergent',
      isSaved: true,
      save: jest.fn(() => 'save'),
      saveable: false,
      deletable: true,
      deleteSighting: jest.fn(() => 'delete'),
    }
    wrapper = shallow(<ButtonRow {...props} />)
  })

  it('renders correctly', () => {
    expect(wrapper).toBeDefined()
  })

  it('correctly labels the button as update', () => {
    expect(wrapper.find('a').first().text()).toContain('Update')
  })
})
