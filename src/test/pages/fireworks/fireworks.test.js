import React from 'react'
import ReactDOM from 'react-dom'
import { configure, mount, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import configureMockStore from 'redux-mock-store'
import { fromJS, Map } from 'immutable'

import * as matchers from 'jest-immutable-matchers'

import fireworksOperations from '../../../operations/fireworksOperations.js'

import { Fireworks } from '../../../pages/fireworks/fireworks.js'

configure({ adapter: new Adapter() })
// Create mock store
const mockStore = configureMockStore()

describe('Fireworks Component', () => {
  let wrapper, store, initialState, settingsProps, settingsWrapper

  beforeEach(() => {
    jest.addMatchers(matchers)

    const settings = fromJS({
      color: 'red',
      number: 0
    })

    initialState = settings

    const overMap = fromJS({ settings: settings, pending: Map() })

    store = mockStore(overMap)
    wrapper = mount(<Fireworks settings={overMap}
      store={store} updateSettingsStart={fireworksOperations.updateSettingsStart}/>
    )
  })

  it('should return the initial state', () => {
    expect(wrapper.props().store.getState().get('settings')).toEqualImmutable(initialState)
  })

  describe('componentDidUpdate', () => {
    it('should not update the local state | old and new props should be the same', () => {
      const overMap = fromJS({ settings: initialState, pending: Map() })

      wrapper.setProps({ settings: overMap })

      const wrapperInstance = wrapper.instance()

      expect(wrapperInstance.state.color).toEqual(wrapper.instance().props.settings.get('settings').get('color'))
      expect(wrapperInstance.state.number).toEqual(wrapper.instance().props.settings.get('settings').get('number'))
    })

    it('should update the local state | old and new props should not be the same', () => {
      initialState = fromJS({
        color: 'green',
        number: 1
      })
      const overMap = fromJS({ settings: initialState, pending: Map() })
      store = mockStore(overMap)

      wrapper.setProps({ settings: overMap })

      const wrapperInstance = wrapper.instance()

      expect(wrapperInstance.state.color).toEqual(wrapper.instance().props.settings.get('settings').get('color'))
      expect(wrapperInstance.state.number).toEqual(wrapper.instance().props.settings.get('settings').get('number'))
    })
  })

  describe('getSavedFields', () => {
    it('should return the correct fields from the initialState', () => {
      expect(wrapper.instance().getSavedFields()).toEqual({
        color: initialState.get('color'),
        number: initialState.get('number')
      })
    })

    it('should return the correct fields from the initialState | change => color = "green"', () => {
      initialState = initialState.set('collor', 'green')
      const overMap = fromJS({ settings: initialState, pending: Map() })

      store = mockStore(overMap)
      wrapper = mount(<Fireworks settings={overMap} store={store}/>)

      expect(wrapper.instance().getSavedFields()).toEqual({
        color: initialState.get('color'),
        number: initialState.get('number')
      })
    })

    /* Finish this test case based on the previous two. It should be very similar to the "green" test case */
    it('should return the correct fields from the initialState | change => color = "blue"', () => {

    })
  })

  describe('getDisplayFields', () => {
    it('should return the input value', () => {
      expect(wrapper.instance().getDisplayFields()).toEqual({
        color: initialState.get('color'),
        number: initialState.get('number')
      })
    })
  })

  describe('getNewFields', () => {
    it('should return the correct fields based on getDisplayFields()', () => {
      expect(wrapper.instance().getNewFields()).toEqual({
        color: initialState.get('color'),
        number: initialState.get('number')
      })
    })
  })

  describe('canSave', () => {
    it('should return true/should be able to save the settings', () => {
      initialState = initialState.set('color', 'blue')
      const overMap = fromJS({ settings: initialState, pending: Map() })

      store = mockStore(overMap)
      wrapper = mount(<Fireworks settings={overMap} store={store}/>)

      expect(wrapper.instance().canSave()).toBe(true)
    })
  })

  describe('save', () => {
    it('should update state based on state and getDisplayFields()', () => {
      wrapper.instance().save()
      expect(wrapper.instance().state).toEqual({
        color: 'red',
        number: 0
      })
    })
  })

  describe('colorChange', () => {
    it('should set state.color to "red"', () => {

    })

  })

  describe('numberChange', () => {
    it('should set state.number to 0', () => {

    })
  })

  it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(wrapper, div)
  })
})

