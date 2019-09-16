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
      initialState = initialState.set('color', 'green')
      const overMap = fromJS({ settings: initialState, pending: Map() })

      store = mockStore(overMap)
      wrapper = mount(<Fireworks settings={overMap} store={store}/>)

      expect(wrapper.instance().getSavedFields()).toEqual({
        color: initialState.get('color'),
        number: initialState.get('number')
      })
    })

    /* TODO: You should implement this third test case that, while extremely similar to the one above, makes sure that
    changing to the local state color to blue works as expected. Again, it should be almost identical to the test case that
    checks whether or not changing the color to green works as expcted. */
    it('should return the correct fields from the initialState | change => color = "blue"', () => {

    })
  })

  /* TODO: Because we are not changing the local state from the initial state to something else, and because we are not
  changing the fireworks setting on the plane, getDisplayFields() should simply return the initial state. The test case
  should be very similar to those for getDisplayFields() in other settings test files. */
  describe('getDisplayFields', () => {
    it('should return the input value', () => {

    })
  })

  /* TODO: Because we are not changing the initial state and because there should not be any type-mismatches in the initial
  state, getNewFields() should simply return an unmodified version of what getDisplayFields() returns (the initial state).
  The test case should be very similar to those for getNewFields() in other settings test files. */
  describe('getNewFields', () => {
    it('should return the correct fields based on getDisplayFields()', () => {

    })
  })

  /* In this test case, we change the local state so that it is different from the fireworks setting on the plane. This way,
  canSave() should return true. We then test for that below. */
  describe('canSave', () => {
    it('should return true/should be able to save the settings', () => {
      initialState = initialState.set('color', 'blue')
      const overMap = fromJS({ settings: initialState, pending: Map() })

      store = mockStore(overMap)
      wrapper = mount(<Fireworks settings={overMap} store={store}/>)

      expect(wrapper.instance().canSave()).toBe(true)
    })
  })

  /* TODO: Call the save() function using wrapper.instance().save() (wrapper.instance().someFunction is how you would call
  any component function from a test file) and then check to make sure that the store/state (wrapper.instance().state) is
  in fact what we expect it to be (it should just be the initial state). Again, examples of this test case should be found
  in the test files for the other settings files. */
  describe('save', () => {
    it('should update state based on state and getDisplayFields()', () => {

    })
  })

  describe('colorChange', () => {
    it('should set state.color to "red"', () => {
      let newColor = 'red'

      const target = { target: { value: newColor, type: 'radio' } }
      const handler = {}
      const changeReturn = new Proxy(target, handler)

      let newL = wrapper.instance().state
      newL = wrapper.instance().colorChange(changeReturn)
      expect(newL.color).toEqual('red')
    })

    /* TODO: Test changing the color to green. The form should be almost identical to the "red" test case above. */
    it('should set state.color to "green"', () => {
      
    })

    /* TODO: Test changing the color to blue. The form should be almost identical to the "red" test case above. */
    it('should set state.color to "blue"', () => {

    })
  })

  describe('numberChange', () => {
    it('should set state.number to 0', () => {
      let newNumber = 0

      const target = { target: { value: newNumber } }
      const handler = {}
      const changeReturn = new Proxy(target, handler)

      let newL = wrapper.instance().state
      newL = wrapper.instance().numberChange(changeReturn)
      expect(newL.number).toEqual(0)
    })

    /* TODO: You could test other numerical values to see if those work as expected. A more interesting and useful test case
    would be to test what happens when you simulate entering a non-numerical value into the "Number" textfield. This is useful
    because it would tells us whether or not the "type-checking" works in the numberChange(e) function. */
  })

  it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(wrapper, div)
  })
})

