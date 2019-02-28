import React from 'react'
import ReactDOM from 'react-dom'
import { configure, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import configureMockStore from 'redux-mock-store'
import { fromJS, Map } from 'immutable'

import * as matchers from 'jest-immutable-matchers'

import {
  receiveSettings,
  receiveAndUpdateSettings,
  updateSettingsStart,
  updateSettingsFailed
} from '../../../actions/gimbalActionCreator.js'

import { GimbalSettings } from '../../../pages/settings/gimbalSettings.js'

configure({ adapter: new Adapter() })
// Create mock store
const mockStore = configureMockStore()

describe('GimbalSettings Component', () => {
  let wrapper, store, initialState

  beforeEach(() => {
    jest.addMatchers(matchers)

    const settings = fromJS({
      mode: 0
    })

    const mappedSettings = new Map(settings)
    initialState = mappedSettings

    const overMap = new Map({ settings: mappedSettings, pending: Map() })

    store = mockStore(overMap)
    wrapper = mount(<GimbalSettings settings={overMap} 
      store={store} receiveSettings={receiveSettings} 
      receiveAndUpdateSettings={receiveAndUpdateSettings} 
      updateSettingsStart={updateSettingsStart} 
      updateSettingsFailed={updateSettingsFailed}/>
    )
  })


  it('should return the initial state', () => {
    expect(JSON.stringify(wrapper.props().store.getState().get('settings'))).toEqualImmutable(JSON.stringify(initialState))
  })

  describe('componentDidUpdate', () => {
    it('should not update the local state | old and new props should be the same', () => {
      const overMap = new Map({ settings: initialState, pending: Map() })

      wrapper.setProps({ settings: overMap })

      expect(JSON.stringify(wrapper.instance().state.mode)).toEqualImmutable(JSON.stringify(wrapper.instance().props.settings.get('settings').get('mode')))
    })

    it('should update the local state | old and new props should not be the same', () => {
      initialState = initialState.set('mode', 1)
      const overMap = new Map({ settings: initialState, pending: Map() })
      store = mockStore(overMap)

      wrapper.setProps({ settings: overMap })

      expect(JSON.stringify(wrapper.instance().state.mode)).toEqualImmutable(JSON.stringify(wrapper.instance().props.settings.get('settings').get('mode')))
    })
  })

  describe('getSavedFields', () => {
    it('should return the correct fields based on justSaved and mode | mode = 0', () => {
      expect(JSON.stringify(wrapper.instance().getSavedFields())).toEqualImmutable(JSON.stringify(
        { mode: initialState.get('mode') }
      ))
    })

    it('should return the correct fields based on justSaved and mode | mode = 1', () => {
      initialState = initialState.set('mode', 1)
      const overMap = new Map({ settings: initialState, pending: Map() })

      store = mockStore(overMap)
      wrapper = mount(<GimbalSettings settings={overMap} store={store}/>)

      expect(JSON.stringify(wrapper.instance().getSavedFields())).toEqualImmutable(JSON.stringify(
        { mode: initialState.get('mode') }
      ))
    })
  })

  describe('getDisplayFields', () => {
    it('should return the input value', () => {
      expect(JSON.stringify(wrapper.instance().getDisplayFields())).toEqualImmutable(JSON.stringify(
        { mode: initialState.get('mode') }
      ))
    })
  })

  describe('getNewFields', () => {
    it('should return the correct fields based on getDisplayFields() | mode = 0', () => {
      expect(JSON.stringify(wrapper.instance().getNewFields())).toEqualImmutable(JSON.stringify(
        { mode: initialState.get('mode') }
      ))
    })
  })

  describe('canSave', () => {
    it('should return true/should be able to save the settings', () => {
      initialState = initialState.set('mode', 1)
      const overMap = new Map({ settings: initialState, pending: Map() })

      store = mockStore(overMap)
      wrapper = mount(<GimbalSettings settings={overMap} store={store}/>)

      expect(wrapper.instance().canSave()).toBe(true)
    })
  })

  describe('save', () => {
    it('should update state based on state and getDisplayFields()', () => {
      wrapper.instance().save()
      expect(JSON.stringify(wrapper.instance().state)).toEqualImmutable(JSON.stringify({ mode: 0 }))
    })
  })

  describe('modeChange', () => {
    it('should set state.mode to 0', () => {
      let newMode = 'retract'

      const target = { target: { value: newMode, type: 'radio' } }
      const handler = {}
      const changeReturn = new Proxy(target, handler)

      var newL = wrapper.instance().state
      newL = wrapper.instance().modeChange(changeReturn, newL)
      expect(JSON.stringify(newL.mode)).toEqualImmutable(JSON.stringify(0))
    })

    it('should set state.mode to 1', () => {
      let newMode = 'fixed'

      const target = { target: { value: newMode, type: 'radio' } }
      const handler = {}
      const changeReturn = new Proxy(target, handler)

      var newL = wrapper.instance().state
      newL = wrapper.instance().modeChange(changeReturn, newL)
      expect(JSON.stringify(newL.mode)).toEqualImmutable(JSON.stringify(1))
    })

    it('should set state.mode to 2', () => {
      let newMode = 'tracking'

      const target = { target: { value: newMode, type: 'radio' } }
      const handler = {}
      const changeReturn = new Proxy(target, handler)

      var newL = wrapper.instance().state
      newL = wrapper.instance().modeChange(changeReturn, newL)
      expect(JSON.stringify(newL.mode)).toEqualImmutable(JSON.stringify(2))
    })
  })

  describe('updateSettingsOnInputChange', () => {
    it('should update state properly', () => {
      var newL = wrapper.instance().state

      let newMode = 'fixed'
      const target = { target: { value: newMode, type: 'radio' } }
      const handler = {}
      const changeReturn = new Proxy(target, handler)
      newL = wrapper.instance().modeChange(changeReturn, newL)
      wrapper.instance().state = newL
      expect(JSON.stringify(wrapper.instance().state)).toEqualImmutable(JSON.stringify(newL))
      expect(JSON.stringify(wrapper.instance().state)).toEqualImmutable(JSON.stringify({
        mode: 1
      }))
    })
  })

  it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(wrapper, div)
  })
})
